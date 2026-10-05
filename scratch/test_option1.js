const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9232;
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

    await send('Runtime.enable');
    await send('Page.enable');

    // Let's test moving card 15 bookmark to top right and changing to heart
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        if (!card15) return 'card15 not found';
        const bookmarkBtn = card15.querySelector('.btn-card-bookmark');
        const badgesGroup = card15.querySelector('.job-badges-group');
        if (bookmarkBtn && badgesGroup) {
          bookmarkBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
          badgesGroup.appendChild(bookmarkBtn);
        }
        return 'success';
      })()`
    });

    await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        card15.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', {
      format: 'png'
    });

    fs.writeFileSync('scratch/card15_option1.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/card15_option1.png');
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
