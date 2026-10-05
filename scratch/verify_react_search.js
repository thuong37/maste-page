const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9237;
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

    await new Promise(r => setTimeout(r, 1000));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const card1 = document.querySelector('.job-card[data-id="1"]');
        const badgeSearch = card1.querySelector('.badge-search-match');
        const heartBtn = card1.querySelector('.job-badges-group .btn-card-bookmark');
        const bottomBtn = card1.querySelector('.job-card-bottom .btn-card-bookmark');
        return {
          hasSearchMatchBadge: !!badgeSearch,
          heartBtnInBadges: !!heartBtn,
          noBookmarkAtBottom: !bottomBtn
        };
      })()`,
      returnByValue: true
    });

    console.log('Check Card 1 with React Search:', check.result.value);

    // Scroll card 1 into view
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card1 = document.querySelector('.job-card[data-id="1"]');
        card1.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/react_search_card1_verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/react_search_card1_verified.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
