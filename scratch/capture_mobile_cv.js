const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9411', '--disable-gpu', '--window-size=390,844', 'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(res => http.get('http://127.0.0.1:9411/json/list', r => {
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
  
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 400));
  
  const top = await send('Runtime.evaluate', {
    expression: 'document.querySelector(".cv-template-section").getBoundingClientRect().top + window.scrollY',
    returnByValue: true
  });
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${top.result.value - 180}, behavior: "instant" });` });
  await new Promise(r => setTimeout(r, 600));
  const shot = await send('Page.captureScreenshot', {});
  fs.writeFileSync('scratch/cv_header_mobile_perfect.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved mobile perfect view');
  ws.close();
  chrome.kill();
}
run();
