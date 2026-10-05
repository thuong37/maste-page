const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function snap() {
  const port = 9356;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:' + port + '/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });
    const page = list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const msgId = id++;
      const h = e => {
        const m = JSON.parse(e.data);
        if (m.id === msgId) { ws.removeEventListener('message', h); res(m.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
    await new Promise(r => ws.onopen = r);

    await send('Runtime.evaluate', {
      expression: 'document.querySelector(".cv-template-section").scrollIntoView({ block: "start" });'
    });
    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', {});
    fs.writeFileSync('scratch/cv_carousel_viewport.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/cv_carousel_viewport.png');

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
snap();
