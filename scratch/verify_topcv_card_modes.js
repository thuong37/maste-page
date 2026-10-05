const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9310;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));

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

    await send('Runtime.enable');
    await send('Page.enable');

    // Wait a brief moment for page JS to finish rendering
    await new Promise(r => setTimeout(r, 1000));

    // Capture unhovered card 1
    const card1Box = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.job-card[data-id="1"]');
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        return { x: rect.x - 10, y: rect.y - 10, width: rect.width + 20, height: rect.height + 20 };
      })()`,
      returnByValue: true
    });

    if (card1Box.result.value) {
      const clip1 = card1Box.result.value;
      const screenshotUnhovered = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, clip1.x),
          y: Math.max(0, clip1.y),
          width: clip1.width,
          height: clip1.height,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/topcv_unhovered_actual.png', Buffer.from(screenshotUnhovered.data, 'base64'));
      console.log('Saved scratch/topcv_unhovered_actual.png');
    }

    // Now hover over card 1 using Input.dispatchMouseEvent
    const cardCenter = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.job-card[data-id="1"]');
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      })()`,
      returnByValue: true
    });

    if (cardCenter.result.value) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: cardCenter.result.value.x,
        y: cardCenter.result.value.y
      });
      await new Promise(r => setTimeout(r, 600));

      const clip2 = card1Box.result.value;
      const screenshotHovered = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, clip2.x),
          y: Math.max(0, clip2.y),
          width: clip2.width,
          height: clip2.height,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/topcv_hovered_actual.png', Buffer.from(screenshotHovered.data, 'base64'));
      console.log('Saved scratch/topcv_hovered_actual.png');
    }

    // Full section capture showing cards 1 and 2
    const gridBox = await send('Runtime.evaluate', {
      expression: `(() => {
        const grid = document.getElementById('jobListingGrid');
        if (!grid) return null;
        const rect = grid.getBoundingClientRect();
        return { x: rect.x - 15, y: rect.y - 15, width: rect.width + 30, height: 460 };
      })()`,
      returnByValue: true
    });

    if (gridBox.result.value) {
      const clipGrid = gridBox.result.value;
      const screenshotGrid = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, clipGrid.x),
          y: Math.max(0, clipGrid.y),
          width: clipGrid.width,
          height: clipGrid.height,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/topcv_cards_pair_actual.png', Buffer.from(screenshotGrid.data, 'base64'));
      console.log('Saved scratch/topcv_cards_pair_actual.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    proc.kill();
  }
}

run();
