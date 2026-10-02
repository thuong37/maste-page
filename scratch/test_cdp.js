const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testClickMobile() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9223;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
  console.log('Target page found:', page.title, page.url);

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
  console.log('Connected to CDP websocket');

  // Evaluate click on #btnModeMobile
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = document.getElementById('btnModeMobile');
        if (!btn) return 'btnModeMobile NOT FOUND';
        btn.click();
        const overlay = document.getElementById('mobileSimulatorOverlay');
        return {
          btnFound: true,
          overlayFound: !!overlay,
          overlayActive: overlay ? overlay.classList.contains('is-active') : false,
          iframeSrc: overlay ? overlay.querySelector('iframe')?.src : null
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Eval result:', JSON.stringify(evalRes));

  // wait 1s
  await new Promise(r => setTimeout(r, 1500));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    const out = path.resolve(__dirname, 'page_mobile_click.png');
    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
    console.log('Saved page_mobile_click.png to', out);
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

testClickMobile().catch(err => {
  console.error(err);
  process.exit(1);
});
