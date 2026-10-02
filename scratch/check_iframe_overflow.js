const { spawn } = require('child_process');
const http = require('http');

async function checkIframeOverflow() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9226;
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

  // Click Mobile button
  await send('Runtime.evaluate', {
    expression: `document.getElementById('floatingBtnMobile').click();`
  });

  await new Promise(r => setTimeout(r, 2500));

  // Check floating box z-index and rect
  const boxCheck = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const box = document.getElementById('floatingViewModeBox');
        const overlay = document.getElementById('mobileSimulatorOverlay');
        const iframe = document.getElementById('mobileSimulatorIframe');
        let iframeDoc = null;
        let iframeOverflow = [];
        try {
          iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const bodyWidth = iframeDoc.documentElement.clientWidth;
          iframeDoc.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > bodyWidth + 2) {
              iframeOverflow.push({
                tag: el.tagName,
                id: el.id,
                className: el.className,
                right: rect.right,
                width: rect.width,
                bodyWidth
              });
            }
          });
        } catch (e) {
          iframeOverflow = 'Cross-origin error: ' + e.message;
        }

        return {
          boxDisplay: window.getComputedStyle(box).display,
          boxVisibility: window.getComputedStyle(box).visibility,
          boxZIndex: window.getComputedStyle(box).zIndex,
          overlayZIndex: window.getComputedStyle(overlay).zIndex,
          boxRect: box.getBoundingClientRect(),
          iframeOverflow: typeof iframeOverflow === 'string' ? iframeOverflow : iframeOverflow.slice(0, 10)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(boxCheck, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

checkIframeOverflow().catch(console.error);
