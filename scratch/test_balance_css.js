const { spawn } = require('child_process');
const http = require('http');

async function testBalanceCss() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9420', '--disable-gpu', '--window-size=1440,1100', 'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(r => http.get('http://127.0.0.1:9420/json/list', res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(JSON.parse(d)));
  }));
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(r => {
    const i = id++;
    const h = (e) => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); r(m.result); }};
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await new Promise(r => ws.onopen = r);

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.createElement('div');
      el.style.width = '198px';
      el.style.fontSize = '15.5px';
      el.style.fontWeight = '750';
      el.style.textAlign = 'center';
      el.style.textWrap = 'balance';
      el.textContent = 'Ngân Hàng TMCP Quân Đội';
      document.body.appendChild(el);
      
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = range.getClientRects();
      const h = el.clientHeight;
      document.body.removeChild(el);
      return { clientRectsCount: rects.length, height: h };
    })()`,
    returnByValue: true
  });
  console.log('Balance CSS Result:', JSON.stringify(res.result.value, null, 2));
  ws.close();
  chrome.kill();
}
testBalanceCss().catch(console.error);
