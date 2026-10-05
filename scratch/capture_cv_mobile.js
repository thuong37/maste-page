const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testMobile() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9362;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=390,844',
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

    const rect = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const box = sec.getBoundingClientRect();
        return {
          y: Math.round(box.top + window.scrollY),
          cardCount: sec.querySelectorAll('.cv-template-card').length,
          firstCardWidth: sec.querySelector('.cv-template-card').getBoundingClientRect().width
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Check:', rect.result.value);

    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${rect.result.value.y - 80}, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 500));

    const shot = await send('Page.captureScreenshot', {});
    fs.writeFileSync('scratch/cv_carousel_mobile.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/cv_carousel_mobile.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

testMobile();
