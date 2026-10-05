const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testFilterRemoval() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9388;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/viec-lam.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    // 1. Select filters via clicking or script
    const checkStateBefore = await send('Runtime.evaluate', {
      expression: `(() => {
        // Click exp filter: under1 ("Dưới 1 năm")
        const expItem = document.querySelector('.dropdown-item[data-type="exp"][data-value="under1"]');
        if (expItem) expItem.click();

        // Click level filter: manager ("Trưởng phòng/Manager")
        const levelItem = document.querySelector('.dropdown-item[data-type="level"][data-value="manager"]');
        if (levelItem) levelItem.click();

        return {
          expLabel: document.getElementById('expFilterLabel')?.textContent,
          levelLabel: document.getElementById('levelFilterLabel')?.textContent,
          hasChipsRowInDOM: Boolean(document.getElementById('activeFilterChipsRow')),
          hasChipsListInDOM: Boolean(document.getElementById('activeChipsList')),
          clearBtnDisplay: document.getElementById('btnClearTopFilters')?.style.display
        };
      })()`,
      returnByValue: true
    });

    console.log('Filter state after selection:', checkStateBefore.result.value);

    await new Promise(r => setTimeout(r, 800));

    // Capture screenshot of the filter bar area
    const clipBox = await send('Runtime.evaluate', {
      expression: `(() => {
        const filterBar = document.getElementById('topFilterBar') || document.querySelector('.top-filter-bar');
        const rect = filterBar.getBoundingClientRect();
        return {
          x: Math.max(0, rect.x - 20),
          y: Math.max(0, rect.y - 20),
          width: Math.min(rect.width + 40, 1400),
          height: rect.height + 60,
          scale: 1
        };
      })()`,
      returnByValue: true
    });

    const screenshot = await send('Page.captureScreenshot', {
      clip: clipBox.result.value
    });

    fs.writeFileSync('scratch/filter_no_chips_verified.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to scratch/filter_no_chips_verified.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

testFilterRemoval().catch(console.error);
