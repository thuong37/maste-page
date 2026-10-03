const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verify() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9340;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1200',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
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

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('#viec-lam-hap-dan');
        const computed = el ? window.getComputedStyle(el) : null;
        
        const visibleSections = Array.from(document.querySelectorAll('section')).map(s => {
          const style = window.getComputedStyle(s);
          const title = s.querySelector('.section-title, h1, h2, h3')?.textContent.trim();
          return {
            id: s.id || s.className,
            title: title || 'no-title',
            display: style.display,
            visibility: style.visibility,
            offsetParent: s.offsetParent !== null,
            height: s.offsetHeight
          };
        }).filter(s => s.display !== 'none');

        return {
          attractiveSection: {
            exists: !!el,
            display: computed?.display,
            offsetParent: el?.offsetParent !== null,
            height: el?.offsetHeight,
            hidden: el?.hidden
          },
          visibleSections
        };
      })()`,
      returnByValue: true
    });

    console.log('Result:', JSON.stringify(evalResult.result.value, null, 2));

    // Scroll to #viec-lam-noi-bat and take a screenshot
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#viec-lam-noi-bat').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(path.resolve(__dirname, 'section_transition_verification.png'), buffer);
    console.log('Screenshot saved to scratch/section_transition_verification.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

verify().catch(console.error);
