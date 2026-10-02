const { spawn } = require('child_process');
const http = require('http');

async function findOverflow() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9224;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=390,844',
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

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const docWidth = document.documentElement.offsetWidth;
        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > docWidth + 2) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              right: rect.right,
              width: rect.width
            });
          }
        });
        return { docWidth, windowWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, overflowing: overflowing.slice(0, 15) };
      })()
    `,
    returnByValue: true
  });

  console.log('Overflow result:', JSON.stringify(evalRes, null, 2));
  ws.close();
  chrome.kill();
}

findOverflow().catch(console.error);
