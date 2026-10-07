const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9461;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1350',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:' + port + '/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const msgId = id++;
        const handler = (e) => {
          const m = JSON.parse(e.data);
          if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.getElementById('viec-lam-noi-bat');
        if (sec) {
          const y = sec.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo(0, y);
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    if (screenshot?.data) {
      fs.writeFileSync('scratch/featured_jobs_full_view.png', Buffer.from(screenshot.data, 'base64'));
      console.log('Saved scratch/featured_jobs_full_view.png');
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

capture().catch(console.error);
