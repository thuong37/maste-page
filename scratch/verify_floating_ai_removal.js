const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

function hashFile(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

async function verify() {
  console.log('--- 1. File Hash Consistency Check ---');
  const indexHash = hashFile('index.html');
  const publicIndexHash = hashFile('public/index.html');
  console.log('index.html == public/index.html:', indexHash === publicIndexHash);

  const homeJsHash = hashFile('js/home.js');
  const publicHomeJsHash = hashFile('public/js/home.js');
  console.log('js/home.js == public/js/home.js:', homeJsHash === publicHomeJsHash);

  if (indexHash !== publicIndexHash || homeJsHash !== publicHomeJsHash) {
    console.error('Mismatch detected between root and public files!');
    process.exit(1);
  }

  console.log('--- 2. Chrome Headless CDP Verification ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9467;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:' + port + '/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const msgId = id++;
        const handler = (e) => {
          const m = JSON.parse(e.data);
          if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const consoleErrors = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(m.params);
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    await new Promise(r => setTimeout(r, 1000));

    const checkDom = await send('Runtime.evaluate', {
      expression: `(() => {
        const widget = document.querySelector('.floating-ai-widget');
        const btn = document.querySelector('.floating-ai-btn');
        const popover = document.querySelector('.floating-ai-popover');
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          if (walker.currentNode.nodeValue.includes('Gợi ý AI')) {
            textNodes.push(walker.currentNode.nodeValue.trim());
          }
        }
        return {
          hasWidget: !!widget,
          hasBtn: !!btn,
          hasPopover: !!popover,
          foundAiSuggestionTexts: textNodes
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM Check Result:', JSON.stringify(checkDom.result.value, null, 2));

    // Capture screenshot of bottom right area
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 1000,
        y: 500,
        width: 440,
        height: 400,
        scale: 1
      }
    });

    fs.writeFileSync('scratch/verify_bottom_right_clean.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to scratch/verify_bottom_right_clean.png');
    console.log('Console Errors count:', consoleErrors.length);

    ws.close();
  } finally {
    chrome.kill();
  }
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
