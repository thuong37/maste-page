const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9330;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1200',
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
    await new Promise(r => setTimeout(r, 1200));

    // Inject demo comparison container showing Card 1 (unhovered) and Card 1 (hovered) side-by-side or stacked
    await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('#jobListingGrid .job-card');
        if (cards.length >= 2) {
          // Card 1 stays unhovered
          cards[0].classList.remove('is-hovered');
          // Card 2 simulates hovered
          cards[1].classList.add('is-hovered');
        }
      })()`
    });

    // Capture grid with card 0 (unhovered) and card 1 (hovered)
    const cardsData = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('#jobListingGrid .job-card');
        if (cards.length < 2) return null;
        const r1 = cards[0].getBoundingClientRect();
        const r2 = cards[1].getBoundingClientRect();
        return {
          x: Math.round(r1.x),
          y: Math.round(r1.y),
          width: Math.round(r1.width),
          height: Math.round(r2.bottom - r1.top)
        };
      })()`,
      returnByValue: true
    });

    if (cardsData.result.value) {
      const box = cardsData.result.value;
      const screenshot = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: box.width + 20,
          height: box.height + 20,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/final_two_cards_modes.png', Buffer.from(screenshot.data, 'base64'));
      console.log('Saved scratch/final_two_cards_modes.png');
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
  }
}

run();
