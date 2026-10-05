const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testSnapshot() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9361;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    // Get exact document coordinate of .cv-template-section
    const rect = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const box = sec.getBoundingClientRect();
        return {
          x: 0,
          y: Math.round(box.top + window.scrollY),
          width: 1440,
          height: Math.round(box.height)
        };
      })()`,
      returnByValue: true
    });
    console.log('CV Section Rect on Page:', rect.result.value);

    // Scroll to position so section header is below sticky navbar
    const targetScrollY = rect.result.value.y - 140;
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${targetScrollY}, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture viewport screenshot
    const shot = await send('Page.captureScreenshot', {});
    fs.writeFileSync('scratch/cv_carousel_full_view.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/cv_carousel_full_view.png');

    ws.close();
  } catch (err) {
    console.error('Error during snapshot:', err);
  } finally {
    chrome.kill();
  }
}

testSnapshot();
