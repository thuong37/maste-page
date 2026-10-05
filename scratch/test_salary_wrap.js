const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9240;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html?keyword=React'
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
          .job-title-row {
            align-items: flex-start !important;
          }
          .job-badges-group {
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
        \`;
        document.head.appendChild(style);

        document.querySelectorAll('.job-card').forEach(card => {
          const badgesGroup = card.querySelector('.job-badges-group');
          if (!badgesGroup) return;
          const searchMatch = badgesGroup.querySelector('.badge-search-match');
          const salaryBadge = badgesGroup.querySelector('.job-salary-badge');
          const bookmarkBtn = badgesGroup.querySelector('.btn-card-bookmark');

          if (salaryBadge && !badgesGroup.querySelector('.job-salary-wrap')) {
            const wrap = document.createElement('div');
            wrap.className = 'job-salary-wrap';
            if (searchMatch) wrap.appendChild(searchMatch);
            wrap.appendChild(salaryBadge);
            badgesGroup.prepend(wrap);
          }
        });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/test_salary_wrap_react.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/test_salary_wrap_react.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
