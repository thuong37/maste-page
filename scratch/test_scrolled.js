const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testScrollInsideIframe() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9230;
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
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
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

  // Click Mobile Web button
  await send('Runtime.evaluate', {
    expression: `document.getElementById('floatingBtnMobile').click();`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 2000));

  // Scroll down inside iframe
  const scrollResult = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const iframe = document.getElementById('mobileSimulatorIframe');
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.defaultView.scrollTo(0, 500);
        return {
          scrollY: doc.defaultView.scrollY,
          pageYOffset: doc.defaultView.pageYOffset
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Scroll result:', scrollResult.result.value);

  await new Promise(r => setTimeout(r, 500));

  // Take screenshot while scrolled down
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.resolve(__dirname, 'test_scrolled_mobile.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved test_scrolled_mobile.png');
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

testScrollInsideIframe().catch(e => {
  console.error(e);
  process.exit(1);
});
