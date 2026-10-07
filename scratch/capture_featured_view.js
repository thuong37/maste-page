const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testScroll() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2200));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9227/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const msgId = id++;
      const handler = e => {
        const m = JSON.parse(e.data);
        if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 680);' });
    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_featured_jobs_scrolled.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/verified_featured_jobs_scrolled.png successfully');
    ws.close();
  } finally {
    chrome.kill();
  }
}

testScroll().catch(console.error);
