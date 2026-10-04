const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testStickySuggest() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9375',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);
  
  await new Promise(r => setTimeout(r, 2000));
  
  const list = await new Promise(res => {
    http.get('http://127.0.0.1:9375/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });

  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  function send(m, p = {}) {
    return new Promise(res => {
      const mid = id++;
      const h = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === mid) {
          ws.removeEventListener('message', h);
          res(msg);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
  }

  await send('Page.enable');
  const loaded = new Promise(resolve => {
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Page.loadEventFired') {
        ws.removeEventListener('message', handler);
        resolve();
      }
    };
    ws.addEventListener('message', handler);
  });
  await send('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await loaded;
  await new Promise(r => setTimeout(r, 1200));

  // Scroll down to make search bar sticky
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 600)'
  });
  await new Promise(r => setTimeout(r, 500));

  // Click on search input
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.getElementById('heroSearchInput');
      input.focus();
      input.click();
      return 'clicked while scrolled';
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 300));

  // Inspect positions
  const inspectRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const stickyBar = document.getElementById('heroSearchStickyBar');
      const dropdown = document.getElementById('searchSuggestDropdown');
      const toRect = r => ({ x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) });

      return {
        scrollY: window.scrollY,
        isSticky: stickyBar.classList.contains('is-sticky'),
        stickyBarRect: toRect(stickyBar.getBoundingClientRect()),
        isOpen: dropdown.classList.contains('is-open'),
        dropdownRect: toRect(dropdown.getBoundingClientRect()),
        dropdownParentId: dropdown.parentElement.id,
        dropdownParentClass: dropdown.parentElement.className
      };
    })()`,
    returnByValue: true
  });

  console.log('Inspection:', JSON.stringify(inspectRes.result.result.value, null, 2));

  // Capture viewport screenshot
  const screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch/sticky_suggest_test.png', screenshot.result.data, 'base64');
  console.log('Saved scratch/sticky_suggest_test.png');

  chrome.kill();
}

testStickySuggest().catch(console.error);
