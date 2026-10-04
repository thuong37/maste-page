const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testTop() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9377',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise(res => {
    http.get('http://127.0.0.1:9377/json/list', r => {
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
  await send('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  // Test normal top state (scrollY = 0)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.getElementById('heroSearchInput');
      input.focus();
      input.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 300));

  const topRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const dropdown = document.getElementById('searchSuggestDropdown');
      const r = dropdown.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        isOpen: dropdown.classList.contains('is-open'),
        dropdownRect: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }
      };
    })()`,
    returnByValue: true
  });

  console.log('Top state result:', JSON.stringify(topRes.result.result.value, null, 2));

  const topShot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch/top_suggest_test.png', topShot.result.data, 'base64');

  await send('Browser.close');
  try { chrome.kill(); } catch (e) {}
}

testTop();
