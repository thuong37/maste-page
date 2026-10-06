const { spawn } = require('child_process');
const http = require('http');

async function testUrl(url) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9336;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    url
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

    console.log('List of targets:', list.map(t => ({ url: t.url, type: t.type })));
    const target = list.find(t => t.type === 'page' && t.url.includes('3000')) || list[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);

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

    // Wait until document is ready
    const res = await send('Runtime.evaluate', {
      expression: `(function() {
        const searchBox = document.querySelector('#jobSearchForm');
        const filterBar = document.querySelector('.top-filter-bar');
        const sBoxRect = searchBox ? searchBox.getBoundingClientRect() : null;
        const fBarRect = filterBar ? filterBar.getBoundingClientRect() : null;
        const fBarComp = filterBar ? window.getComputedStyle(filterBar) : null;
        return {
          title: document.title,
          url: location.href,
          searchBox: sBoxRect ? { x: Math.round(sBoxRect.x), width: Math.round(sBoxRect.width) } : null,
          filterBar: fBarRect ? { x: Math.round(fBarRect.x), width: Math.round(fBarRect.width) } : null,
          filterBarBg: fBarComp ? fBarComp.backgroundColor : null,
          filterBarBorder: fBarComp ? fBarComp.border : null,
          filterBarParent: filterBar && filterBar.parentElement ? filterBar.parentElement.className : null
        };
      })()`,
      returnByValue: true
    });

    console.log('Page eval:', res.result ? res.result.value : res);
    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  console.log('--- VIE-LAM ---');
  await testUrl('http://localhost:3000/viec-lam.html');
  await new Promise(r => setTimeout(r, 1000));
  console.log('--- CHI-TIET ---');
  await testUrl('http://localhost:3000/chi-tiet-viec-lam.html');
}

run().catch(console.error);
