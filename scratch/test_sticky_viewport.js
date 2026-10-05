const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9251;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,900',
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

    // Scroll to 800px where sticky bar is active
    await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo(0, 800);
        window.dispatchEvent(new Event('scroll'));
        const input = document.getElementById('heroSearchInput');
        input.focus();
        input.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture viewport screenshot
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('scratch/test_dropdown_sticky_viewport.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/test_dropdown_sticky_viewport.png');

    const evalData = await send('Runtime.evaluate', {
      expression: `(() => {
        const stickyBar = document.getElementById('heroSearchStickyBar');
        const dropdown = document.getElementById('searchSuggestDropdown');
        const input = document.getElementById('heroSearchInput');
        const group = input.closest('.search-input-group');
        const dRect = dropdown.getBoundingClientRect();
        const gRect = group.getBoundingClientRect();
        const sRect = stickyBar.getBoundingClientRect();
        return {
          stickyBarTop: sRect.top,
          groupLeft: gRect.left,
          dropdownLeft: dRect.left,
          dropdownTop: dRect.top,
          isOpen: dropdown.classList.contains('is-open')
        };
      })()`,
      returnByValue: true
    });
    console.log('Sticky metrics:', evalData.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
