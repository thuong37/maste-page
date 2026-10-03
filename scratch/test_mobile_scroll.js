const { spawn } = require('child_process');
const http = require('http');

async function testMobileScroll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9335;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=390,844',
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
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
        gridWidth: document.querySelector('.bento-sponsor-grid').offsetWidth,
        primaryWidth: document.querySelector('.sponsor-primary').offsetWidth,
        miniAWidth: document.querySelector('.sponsor-mini-a').offsetWidth,
        miniBWidth: document.querySelector('.sponsor-mini-b').offsetWidth,
        miniWideWidth: document.querySelector('.sponsor-mini-wide').offsetWidth
      };
    })()`,
    returnByValue: true
  });

  console.log('MOBILE CHECK:', JSON.stringify(evalRes.result ? evalRes.result.value : evalRes, null, 2));
  chrome.kill();
  process.exit(0);
}
testMobileScroll();
