const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9226;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1000'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const target = await new Promise((resolve, reject) => {
      const req = http.request(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('http://localhost:3000/index.html')}`, { method: 'PUT' }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });

    const ws = new WebSocket(target.webSocketDebuggerUrl);
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
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to #cong-ty-tieu-bieu
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_cong_ty_tieu_bieu_real.png', Buffer.from((ss.result?.data || ss.data), 'base64'));
    console.log('Saved scratch/verified_cong_ty_tieu_bieu_real.png');
    ws.close();
  } finally {
    chrome.kill();
  }
}

capture();
