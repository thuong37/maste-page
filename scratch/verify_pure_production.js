const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9260;
  // Launch fresh Chrome instance
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html?t=' + Date.now()
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

    // 1. Inspect layout metrics of Card 15 & Card 2
    const metrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        if (!card15) return { error: 'Card 15 not found' };

        const salaryWrap = card15.querySelector('.job-salary-wrap');
        const bookmarkBtn = card15.querySelector('.btn-card-bookmark');
        const salaryBadge = card15.querySelector('.job-salary-badge');
        const companyRow = card15.querySelector('.job-company-row');

        const sRect = salaryWrap ? salaryWrap.getBoundingClientRect() : salaryBadge.getBoundingClientRect();
        const bRect = bookmarkBtn.getBoundingClientRect();
        const cRect = companyRow.getBoundingClientRect();

        return {
          salaryRight: sRect.right,
          salaryBottom: sRect.bottom,
          bookmarkRight: bRect.right,
          bookmarkTop: bRect.top,
          isDirectlyBelow: bRect.top >= sRect.bottom,
          verticalDistance: bRect.top - sRect.bottom,
          companyRowTop: cRect.top
        };
      })()`,
      returnByValue: true
    });

    console.log('Card 15 Layout Metrics:', JSON.stringify(metrics.result.value, null, 2));

    // Scroll card 15 into view and click bookmark on card 15 to test saved state
    await send('Runtime.evaluate', {
      expression: `(() => {
        const floatBox = document.getElementById('floatingViewModeBox');
        if (floatBox) floatBox.style.display = 'none';

        const card15 = document.querySelector('.job-card[data-id="15"]');
        if (card15) {
          card15.scrollIntoView({ block: 'center' });
          const btn = card15.querySelector('.btn-card-bookmark');
          if (btn) btn.click(); // toggle save
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot 1: Pure production desktop showing card 15 saved (red heart) and card 16 unsaved
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/pure_prod_desktop.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/pure_prod_desktop.png');

    // Hover on Card 16 to verify apply button appears and heart button stays in place
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card16 = document.querySelector('.job-card[data-id="16"]');
        if (card16) {
          card16.classList.add('hover-simulated'); // or move mouse
        }
      })()`
    });

    const card16Rect = await send('Runtime.evaluate', {
      expression: `(() => {
        const c16 = document.querySelector('.job-card[data-id="16"]');
        const r = c16.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      })()`,
      returnByValue: true
    });

    if (card16Rect && card16Rect.result && card16Rect.result.value) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: card16Rect.result.value.x,
        y: card16Rect.result.value.y
      });
    }

    await new Promise(r => setTimeout(r, 400));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/pure_prod_hover.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/pure_prod_hover.png');

    // 2. Test search page: keyword=React
    await send('Page.navigate', { url: 'http://localhost:3000/viec-lam.html?keyword=React&t=' + Date.now() });
    await new Promise(r => setTimeout(r, 1500));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const floatBox = document.getElementById('floatingViewModeBox');
        if (floatBox) floatBox.style.display = 'none';
      })()`
    });

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/pure_prod_search_react.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved scratch/pure_prod_search_react.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    proc.kill();
  }
}

run();
