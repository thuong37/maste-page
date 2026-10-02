const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9226;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
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

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    // Inspect first job card bounding box
    const cardBox = await evaluate(`
      (() => {
        const card = document.querySelector('.job-card');
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
      })()
    `);
    console.log('First card box:', cardBox);

    // Save screenshot before hover
    const shotBefore = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_before_hover.png'), Buffer.from(shotBefore.data, 'base64'));
    console.log('Saved test_before_hover.png');

    // Simulate mouse move / hover on the first card
    if (cardBox) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: cardBox.x,
        y: cardBox.y
      });
      await new Promise(r => setTimeout(r, 400));

      const shotHover = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.resolve(__dirname, 'test_hover.png'), Buffer.from(shotHover.data, 'base64'));
      console.log('Saved test_hover.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    proc.kill();
  }
}

run();
