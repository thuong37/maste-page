const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9245;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/viec-lam.html?keyword=Sales'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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

    await new Promise(r => setTimeout(r, 1500));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const badgeCount = document.querySelectorAll('.badge-search-match').length;
        const splitBadgeCount = document.querySelectorAll('.split-match-badge').length;
        const firstCard = document.querySelector('.job-card');
        const salaryWrap = firstCard ? firstCard.querySelector('.job-salary-wrap')?.innerHTML.trim() : null;
        const jobTitle = firstCard ? firstCard.querySelector('.job-title')?.textContent.trim() : null;
        return {
          badgeCount,
          splitBadgeCount,
          firstJobTitle: jobTitle,
          firstSalaryWrapHtml: salaryWrap
        };
      })()`,
      returnByValue: true
    });

    console.log('RESULT:', JSON.stringify(check.result.value, null, 2));

    // Scroll to first job card and take screenshot
    await send('Runtime.evaluate', {
      expression: `(() => {
        const firstCard = document.querySelector('.job-card');
        if (firstCard) {
          firstCard.scrollIntoView({ block: 'center' });
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(__dirname, 'no_match_badge_sales.png');
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to:', outPath);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
