const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testDevicePresets() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9228;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
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

  // 1. Switch to Mobile
  await send('Runtime.evaluate', { expression: `document.getElementById('floatingBtnMobile').click();` });
  await new Promise(r => setTimeout(r, 800));

  // 2. Click Galaxy S24 (412px)
  const s24Res = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const item = document.querySelector('.floating-preset-item[data-width="412"]');
        if (item) item.click();
        const frame = document.getElementById('smartphoneFrame');
        return {
          frameWidth: frame.style.width,
          frameHeight: frame.style.height
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Galaxy S24 preset result:', JSON.stringify(s24Res));

  // 3. Click Rotate button
  const rotateRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        document.getElementById('floatingRotateBtn').click();
        const frame = document.getElementById('smartphoneFrame');
        return {
          rotatedWidth: frame.style.width,
          rotatedHeight: frame.style.height
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Rotate result:', JSON.stringify(rotateRes));

  // 4. Test Minimize
  const minRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const box = document.getElementById('floatingViewModeBox');
        document.getElementById('floatingMinBtn').click();
        const isMin = box.classList.contains('is-minimized');
        document.getElementById('floatingMinimizedPill').click();
        const isExpanded = !box.classList.contains('is-minimized');
        return { isMin, isExpanded };
      })()
    `,
    returnByValue: true
  });
  console.log('Minimize & Expand result:', JSON.stringify(minRes));

  ws.close();
  chrome.kill();
  process.exit(0);
}

testDevicePresets().catch(console.error);
