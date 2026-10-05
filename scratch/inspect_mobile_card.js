const { spawn } = require('child_process');
const http = require('http');

async function testCardWidth() {
  const port = 9363;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:' + port + '/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  const page = list.find(p => p.url.includes('index.html')) || list[0];
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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.cv-template-card');
      const track = document.querySelector('.cv-template-track');
      const viewport = document.querySelector('.cv-template-carousel');
      const sheet = document.querySelector('.cv-sheet');
      return {
        viewportWidth: viewport?.getBoundingClientRect().width,
        cardWidth: card?.getBoundingClientRect().width,
        cardComputedWidth: card ? window.getComputedStyle(card).width : null,
        cardFlexBasis: card ? window.getComputedStyle(card).flexBasis : null,
        sheetWidth: sheet?.getBoundingClientRect().width
      };
    })()`,
    returnByValue: true
  });
  console.log(res.result.value);
  ws.close();
  chrome.kill();
}
testCardWidth();
