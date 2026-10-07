const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function snapDropdown() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9340;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1280,720',
    '--user-data-dir=c:\\code\\easycv\\maste-page\\scratch\\temp-dropdown-snap-' + Date.now(),
    'http://127.0.0.1:8000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const page = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
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

    // Open dropdown
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const navLinks = Array.from(document.querySelectorAll('.nav-link'));
          const hosoLink = navLinks.find(l => l.textContent.includes('Hồ sơ & CV'));
          const navItem = hosoLink ? hosoLink.closest('.nav-item') : null;
          if (navItem) {
            navItem.classList.add('open');
            const drop = navItem.querySelector('.dropdown-menu');
            if (drop) {
              drop.style.opacity = '1';
              drop.style.visibility = 'visible';
              drop.style.transform = 'none';
            }
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 500));

    const shot = await send('Page.captureScreenshot', {
      clip: { x: 0, y: 0, width: 1280, height: 400, scale: 1 }
    });

    if (shot.data) {
      fs.writeFileSync('c:\\code\\easycv\\maste-page\\scratch\\dropdown_snap.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved to scratch/dropdown_snap.png');
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

snapDropdown();
