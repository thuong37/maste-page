const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testStickySearch() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9229;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1000',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:' + port + '/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('localhost:3000')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
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

  // 1. Initial State (scrollY = 0)
  const initResult = await send('Runtime.evaluate', {
    expression: 'JSON.stringify({ scrollY: window.scrollY, isSticky: document.getElementById("heroSearchStickyBar").classList.contains("is-sticky") })',
    returnByValue: true
  });
  console.log('1. Initial State (scrollY = 0):', initResult.result.value);

  // 2. Scroll down 700px
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 700);'
  });

  await new Promise(r => setTimeout(r, 800));

  // Check sticky state
  const evalResult = await send('Runtime.evaluate', {
    expression: 'JSON.stringify({ scrollY: window.scrollY, isSticky: document.getElementById("heroSearchStickyBar").classList.contains("is-sticky"), rect: document.getElementById("heroSearchStickyBar").getBoundingClientRect() })',
    returnByValue: true
  });
  console.log('2. Scrolled State (scrollY = 700):', evalResult.result.value);

  // Capture screenshot while scrolled down
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve(__dirname, 'homepage_sticky_scrolled.png');
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  // 3. Scroll back to top
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 0);'
  });

  await new Promise(r => setTimeout(r, 600));

  const backResult = await send('Runtime.evaluate', {
    expression: 'JSON.stringify({ scrollY: window.scrollY, isSticky: document.getElementById("heroSearchStickyBar").classList.contains("is-sticky") })',
    returnByValue: true
  });
  console.log('3. Back to Top State (scrollY = 0):', backResult.result.value);

  chrome.kill();
  process.exit(0);
}

testStickySearch().catch(err => {
  console.error(err);
  process.exit(1);
});
