const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9315;
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

    // Wait for JS to render
    await new Promise(r => setTimeout(r, 1200));

    // Scroll first card into view
    await send('Runtime.evaluate', {
      expression: `(() => {
        const firstCard = document.querySelector('#jobListingGrid .job-card');
        if (firstCard) {
          firstCard.scrollIntoView({ block: 'center' });
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    // Get first card rect
    const firstCardData = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('#jobListingGrid .job-card');
        if (!card) return null;
        const r = card.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
          centerX: Math.round(r.x + r.width / 2),
          centerY: Math.round(r.y + r.height / 2)
        };
      })()`,
      returnByValue: true
    });

    console.log('First card data:', firstCardData.result.value);
    const box = firstCardData.result.value;

    if (box) {
      // 1. Move mouse away to ensure unhovered
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: 10,
        y: 10
      });
      await new Promise(r => setTimeout(r, 400));

      // Capture unhovered card
      const screenshot1 = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: box.width + 20,
          height: box.height + 20,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/live_card_unhovered.png', Buffer.from(screenshot1.data, 'base64'));
      console.log('Saved scratch/live_card_unhovered.png');

      // 2. Hover over the card center
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: box.centerX,
        y: box.centerY
      });
      await new Promise(r => setTimeout(r, 600));

      // Capture hovered card
      const screenshot2 = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: box.width + 20,
          height: box.height + 20,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/live_card_hovered.png', Buffer.from(screenshot2.data, 'base64'));
      console.log('Saved scratch/live_card_hovered.png');
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
  }
}

run();
