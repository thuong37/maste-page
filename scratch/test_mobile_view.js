const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9255;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=375,812',
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

    await send('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.innerHTML = \`
          @media (min-width: 769px) {
            .job-info-main {
              position: relative !important;
              padding-right: 280px !important;
            }
            .job-title-row {
              display: block !important;
              margin-bottom: 6px !important;
            }
            .job-title {
              margin: 0 !important;
              line-height: 1.35 !important;
            }
            .job-badges-group {
              position: absolute !important;
              top: 0 !important;
              right: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-end !important;
              gap: 8px !important;
              flex-shrink: 0 !important;
            }
            .job-salary-wrap {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
            }
          }
          @media (max-width: 768px) {
            .job-info-main {
              position: static !important;
              padding-right: 0 !important;
            }
            .job-title-row {
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 8px !important;
              width: 100% !important;
            }
            .job-badges-group {
              position: static !important;
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
              width: 100% !important;
              gap: 8px !important;
            }
          }
        \`;
        document.head.appendChild(style);

        const card = document.querySelector('.job-card[data-id="2"]');
        if (card) {
          const rect = card.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 80);
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/test_mobile_card2_scrolled.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/test_mobile_card2_scrolled.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
