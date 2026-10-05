const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9234;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=430,932',
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
          .btn-card-bookmark {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1.5px solid #CBD5E1;
            background: #FFFFFF;
            color: #64748B;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 0;
            flex-shrink: 0;
          }
          .btn-card-bookmark:hover {
            border-color: #EF4444;
            color: #EF4444;
            background: #FEF2F2;
          }
          .btn-card-bookmark.saved {
            background: #FEF2F2;
            border-color: #EF4444;
            color: #EF4444;
          }
          .btn-card-bookmark.saved svg {
            fill: #EF4444;
            stroke: #EF4444;
          }
        \`;
        document.head.appendChild(style);

        const card15 = document.querySelector('.job-card[data-id="15"]');
        const b15 = card15.querySelector('.btn-card-bookmark');
        card15.querySelector('.job-badges-group').appendChild(b15);
        b15.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      })()`
    });

    await send('Runtime.evaluate', {
      expression: `(() => {
        const floatBox = document.getElementById('floatingViewModeBox');
        if (floatBox) floatBox.style.display = 'none';
        const card15 = document.querySelector('.job-card[data-id="15"]');
        card15.scrollIntoView();
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const cardRect = await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        const rect = card15.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });

    const clip = cardRect.result.value;
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, clip.x - 5),
        y: Math.max(0, clip.y - 5),
        width: clip.width + 10,
        height: clip.height + 10,
        scale: 1
      }
    });
    fs.writeFileSync('scratch/card_mobile_view.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/card_mobile_view.png');
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
