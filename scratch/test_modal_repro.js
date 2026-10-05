const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function runTest() {
  console.log('--- Inspecting Category Modal on viec-lam.html ---');

  const chromeProc = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9231/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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

    // Type "Kiến trúc sư" and click category trigger
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('jobSearchInput');
        if (input) {
          input.value = 'Kiến trúc sư';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const trigger = document.getElementById('categoryFilterTrigger');
        if (trigger) trigger.click();

        const modal = document.querySelector('.category-modal-dialog');
        const overlay = document.getElementById('categoryModalOverlay');
        const modalRect = modal ? modal.getBoundingClientRect() : null;
        const overlayRect = overlay ? overlay.getBoundingClientRect() : null;

        return JSON.stringify({
          overlayHidden: overlay ? overlay.hidden : null,
          overlayPos: overlay ? window.getComputedStyle(overlay).position : null,
          overlayZIndex: overlay ? window.getComputedStyle(overlay).zIndex : null,
          overlayRect,
          modalRect
        });
      })()`,
      returnByValue: true
    });
    console.log('Category Modal Inspection:', JSON.parse(evalRes.result.value));

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_modal_repro.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved test screenshot to scratch/test_modal_repro.png');

    chromeProc.kill();
  } catch (err) {
    console.error(err);
    chromeProc.kill();
  }
}

runTest();
