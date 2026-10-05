const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9252;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=375,812',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('index.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('DOM.enable');

    await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('heroSearchInput');
        input.focus();
        input.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 375, height: 700, scale: 1 }
    });
    fs.writeFileSync('scratch/test_dropdown_mobile.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/test_dropdown_mobile.png');

    const evalData = await send('Runtime.evaluate', {
      expression: `(() => {
        const dropdown = document.getElementById('searchSuggestDropdown');
        const dRect = dropdown.getBoundingClientRect();
        return {
          dropdownLeft: Math.round(dRect.left),
          dropdownWidth: Math.round(dRect.width),
          isOpen: dropdown.classList.contains('is-open')
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile metrics:', evalData.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
