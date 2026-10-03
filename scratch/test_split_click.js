const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9231;
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

    // Click on card with data-id="20" (Bosch)
    const splitOpenResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.job-card[data-id="20"]');
          if (!card) return { found: false };
          card.click();
          const splitContainer = document.getElementById('jobSplitContainer');
          const detailTitle = document.getElementById('detailJobTitle')?.textContent.trim();
          const detailComp = document.getElementById('detailCompanyName')?.textContent.trim();
          return {
            found: true,
            splitDisplay: splitContainer ? window.getComputedStyle(splitContainer).display : null,
            detailTitle,
            detailComp
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Split view click result:', splitOpenResult.result.value);
    if (!splitOpenResult.result.value.found || splitOpenResult.result.value.splitDisplay !== 'grid') {
      throw new Error('Split view failed to open on card click');
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

run();
