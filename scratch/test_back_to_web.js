const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testSwitchBackToWeb() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9227;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
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

  // 1. Switch to Mobile
  await send('Runtime.evaluate', { expression: `document.getElementById('floatingBtnMobile').click();` });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Switch back to Web via floatingBtnWeb
  const webRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        document.getElementById('floatingBtnWeb').click();
        const overlay = document.getElementById('mobileSimulatorOverlay');
        const box = document.getElementById('floatingViewModeBox');
        return {
          overlayActive: overlay ? overlay.classList.contains('is-active') : false,
          boxModeMobile: box ? box.classList.contains('mode-mobile') : false,
          bodyOverflow: document.body.style.overflow
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Switch back to Web result:', JSON.stringify(webRes, null, 2));

  // 3. Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.resolve(__dirname, 'screenshot_back_to_web.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot_back_to_web.png');
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

testSwitchBackToWeb().catch(console.error);
