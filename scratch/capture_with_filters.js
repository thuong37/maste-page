const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function captureWithFilters() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9377;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
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

    // Scroll so section has room below sticky header
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const y = sec.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'instant' });
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // 1. Initial State (All filter active)
    const secBox = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const rect = sec.getBoundingClientRect();
        return {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })()`,
      returnByValue: true
    });

    const box = secBox.result?.value;
    const shotAll = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: box.width,
        height: box.height,
        scale: 1
      }
    });
    fs.writeFileSync(path.join(__dirname, 'cv_section_with_filters_all.png'), Buffer.from(shotAll.data, 'base64'));

    // 2. Click "Đơn giản"
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.cv-style-filter[data-cv-style="simple"]').click();`
    });
    await new Promise(r => setTimeout(r, 300));

    const shotSimple = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: box.width,
        height: box.height,
        scale: 1
      }
    });
    fs.writeFileSync(path.join(__dirname, 'cv_section_with_filters_simple.png'), Buffer.from(shotSimple.data, 'base64'));

    console.log('Captures completed successfully!');
    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

captureWithFilters();
