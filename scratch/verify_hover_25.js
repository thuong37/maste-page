const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9230;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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

    await new Promise(r => setTimeout(r, 1000));

    // Get position of the first card
    const cardBox = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.job-card');
          const r = card.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        })()
      `,
      returnByValue: true
    });

    const pos = cardBox.result.value;
    console.log('Hovering over first card at:', pos);

    // Dispatch mouse event hover
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: pos.x,
      y: pos.y
    });

    await new Promise(r => setTimeout(r, 500));

    // Check apply button visibility
    const applyBtnStyles = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('.job-card .btn-card-apply');
          const s = window.getComputedStyle(btn);
          return {
            opacity: s.opacity,
            visibility: s.visibility,
            background: s.background
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Apply button computed styles on hover:', applyBtnStyles.result.value);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'vieclam_25_hover_check.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved hover screenshot to scratch/vieclam_25_hover_check.png');

    ws.close();
  } finally {
    proc.kill();
  }
}

run();
