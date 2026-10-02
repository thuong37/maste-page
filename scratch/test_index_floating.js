const { spawn } = require('child_process');
const http = require('http');

async function testIndexPage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9229;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('index.html')) || list[0];
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

  const check = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const box = document.getElementById('floatingViewModeBox');
        return {
          boxExists: !!box,
          hasBtnWeb: !!document.getElementById('floatingBtnWeb'),
          hasBtnMobile: !!document.getElementById('floatingBtnMobile')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('index.html floating box check:', JSON.stringify(check));

  ws.close();
  chrome.kill();
  process.exit(0);
}

testIndexPage().catch(console.error);
