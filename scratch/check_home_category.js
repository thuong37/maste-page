const { spawn } = require('child_process');
const fs = require('fs');

async function testHome() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9233', '--window-size=1440,900', 'http://localhost:3000/index.html']);
  await new Promise(r => setTimeout(r, 1500));
  const listRes = await fetch('http://127.0.0.1:9233/json');
  const tabs = await listRes.json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(res => {
      const id = msgId++;
      const h = e => {
        const d = JSON.parse(e.data);
        if (d.id === id) { ws.removeEventListener('message', h); res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('categoryFilterTrigger');
      if (btn) btn.click();
      const modal = document.querySelector('.category-modal-dialog');
      const box = document.getElementById('heroSearchBox');
      return {
        boxRect: box ? box.getBoundingClientRect() : null,
        modalRect: modal ? modal.getBoundingClientRect() : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Home Category Result:', JSON.stringify(evalRes.result.value, null, 2));
  const shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch/home_category_screenshot.png', Buffer.from(shot.data, 'base64'));
  ws.close();
  proc.kill();
}
testHome();
