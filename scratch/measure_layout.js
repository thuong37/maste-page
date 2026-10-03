const { spawn } = require('child_process');
const http = require('http');

async function checkLayout() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9333;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,950',
    'http://localhost:3000/index.html'
  ]);

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
  const evalRes = await send('Runtime.evaluate', {
    expression: `(function() {
      const grid = document.querySelector('.bento-sponsor-grid');
      const primary = document.querySelector('.sponsor-primary');
      const miniA = document.querySelector('.sponsor-mini-a');
      const miniWide = document.querySelector('.sponsor-mini-wide');
      return {
        grid: grid ? { width: grid.offsetWidth, height: grid.offsetHeight } : null,
        primary: primary ? { width: primary.offsetWidth, height: primary.offsetHeight } : null,
        miniA: miniA ? { width: miniA.offsetWidth, height: miniA.offsetHeight } : null,
        miniWide: miniWide ? { width: miniWide.offsetWidth, height: miniWide.offsetHeight } : null,
      };
    })()`,
    returnByValue: true
  });

  console.log('MEASUREMENTS:', JSON.stringify(evalRes.result ? evalRes.result.value : evalRes, null, 2));
  chrome.kill();
  process.exit(0);
}
checkLayout();
