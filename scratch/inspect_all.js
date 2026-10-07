const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testAll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9337;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1280,800',
    '--user-data-dir=c:\\code\\easycv\\maste-page\\scratch\\temp-chrome-all-' + Date.now(),
    'http://127.0.0.1:8000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const onMsg = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', onMsg);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const html = await send('Runtime.evaluate', {
      expression: 'document.getElementById("heroLocationTrigger").outerHTML',
      returnByValue: true
    });
    console.log('VIEC-LAM.HTML trigger outerHTML:');
    console.log(html.result?.value);

    // Capture screenshot of the whole search bar
    const barBox = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.hero-search-box') || document.querySelector('.job-search-box') || document.querySelector('.search-input-group');
          const r = el.getBoundingClientRect();
          return { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 10), width: r.width + 40, height: r.height + 20, scale: 1 };
        })()
      `,
      returnByValue: true
    });
    console.log('Search box rect:', barBox.result?.value);

    const shot = await send('Page.captureScreenshot', {
      clip: barBox.result?.value
    });
    if (shot.data) {
      fs.writeFileSync('c:\\code\\easycv\\maste-page\\scratch\\search_bar_current.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot to scratch/search_bar_current.png');
    }

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

testAll();
