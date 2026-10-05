const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9245;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1200',
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

    // Test Option 1 vs Option 2
    await send('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.innerHTML = \`
          /* Option 1: inside title-row */
          .opt1-title-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 4px;
          }
          .opt1-badges {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            flex-shrink: 0;
          }

          /* Option 2: 3-column top */
          .opt2-card-top {
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }
          .opt2-main {
            flex: 1;
            min-width: 0;
          }
          .opt2-main .job-title {
            margin-bottom: 6px;
          }
          .opt2-right-col {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            flex-shrink: 0;
            padding-top: 2px;
          }
        \`;
        document.head.appendChild(style);

        // Apply Option 1 to Card 15
        const c15 = document.querySelector('.job-card[data-id="15"]');
        if (c15) {
          const row = c15.querySelector('.job-title-row');
          const badges = c15.querySelector('.job-badges-group');
          if (row) row.className = 'opt1-title-row';
          if (badges) badges.className = 'opt1-badges';
        }

        // Apply Option 2 to Card 16
        const c16 = document.querySelector('.job-card[data-id="16"]');
        if (c16) {
          const top = c16.querySelector('.job-card-top');
          const badges = c16.querySelector('.job-badges-group');
          const main = c16.querySelector('.job-info-main');
          if (top && badges && main) {
            top.className = 'job-card-top opt2-card-top';
            main.className = 'job-info-main opt2-main';
            badges.className = 'opt2-right-col';
            top.appendChild(badges);
          }
        }

        c15.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/compare_opt1_opt2.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/compare_opt1_opt2.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
