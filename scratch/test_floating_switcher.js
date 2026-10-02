const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testFloatingSwitcher() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9225;
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

  // 1. Check floating box on desktop
  const checkDesktop = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const box = document.getElementById('floatingViewModeBox');
        return {
          boxExists: !!box,
          boxRect: box ? box.getBoundingClientRect() : null,
          hasBtnWeb: !!document.getElementById('floatingBtnWeb'),
          hasBtnMobile: !!document.getElementById('floatingBtnMobile')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Desktop Floating Box check:', JSON.stringify(checkDesktop, null, 2));

  // Capture desktop screenshot with floating box visible on right edge
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot1 && shot1.data) {
    fs.writeFileSync(path.resolve(__dirname, 'screenshot_floating_desktop.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshot_floating_desktop.png');
  }

  // 2. Click Mobile button in floating box
  const clickMobile = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = document.getElementById('floatingBtnMobile');
        if (!btn) return 'floatingBtnMobile not found';
        btn.click();
        const overlay = document.getElementById('mobileSimulatorOverlay');
        return {
          clicked: true,
          overlayActive: overlay ? overlay.classList.contains('is-active') : false,
          boxHasModeMobile: document.getElementById('floatingViewModeBox')?.classList.contains('mode-mobile')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Click Mobile result:', JSON.stringify(clickMobile, null, 2));

  await new Promise(r => setTimeout(r, 2000));

  // Capture screenshot after clicking mobile
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot2 && shot2.data) {
    fs.writeFileSync(path.resolve(__dirname, 'screenshot_floating_mobile.png'), Buffer.from(shot2.data, 'base64'));
    console.log('Saved screenshot_floating_mobile.png');
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

testFloatingSwitcher().catch(err => {
  console.error(err);
  process.exit(1);
});
