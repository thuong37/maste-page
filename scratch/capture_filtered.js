const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9388', '--disable-gpu', '--window-size=1440,1080', 'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(res => http.get('http://127.0.0.1:9388/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const mi = id++;
    const h = (e) => { const msg = JSON.parse(e.data); if (msg.id === mi) { ws.removeEventListener('message', h); res(msg.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: mi, method: m, params: p }));
  });
  await new Promise(r => ws.onopen = r);
  
  // click Simple filter
  await send('Runtime.evaluate', { expression: 'document.querySelector(\x22.cv-style-filter[data-cv-style=\x27simple\x27]\x22).click();' });
  await new Promise(r => setTimeout(r, 300));

  const rect = await send('Runtime.evaluate', {
    expression: 'document.querySelector(".cv-template-section").getBoundingClientRect().top + window.scrollY',
    returnByValue: true
  });
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${rect.result.value - 140}, behavior: "instant" });` });
  await new Promise(r => setTimeout(r, 500));
  const shot = await send('Page.captureScreenshot', {});
  fs.writeFileSync('scratch/cv_carousel_filtered_view.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved scratch/cv_carousel_filtered_view.png');
  ws.close();
  chrome.kill();
}
run();
