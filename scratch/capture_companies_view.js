const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9489',
  '--disable-gpu',
  '--window-size=1440,1000',
  'http://localhost:3000/index.html'
]);

setTimeout(async () => {
  try {
    const list = await new Promise(r => http.get('http://127.0.0.1:9489/json/list', res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => r(JSON.parse(d)));
    }));
    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    const send = (method, params = {}) => new Promise(resolve => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Runtime.evaluate', {
      expression: "window.scrollTo(0, document.querySelector('#cong-ty-tieu-bieu').offsetTop - 120);"
    });
    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot');
    fs.writeFileSync('D:\\master page\\scratch\\companies_scrolled.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved companies_scrolled.png');
    chrome.kill();
    process.exit(0);
  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
