const { spawn } = require('child_process');
const http = require('http');

async function testClearFilters() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9389;
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

    // 1. Select filters
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelector('.dropdown-item[data-type="exp"][data-value="under1"]')?.click();
        document.querySelector('.dropdown-item[data-type="level"][data-value="manager"]')?.click();
      })()`
    });

    // 2. Click clear button
    const clearResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('btnClearTopFilters');
        if (btn) btn.click();

        return {
          expLabel: document.getElementById('expFilterLabel')?.textContent,
          levelLabel: document.getElementById('levelFilterLabel')?.textContent,
          clearBtnDisplay: document.getElementById('btnClearTopFilters')?.style.display
        };
      })()`,
      returnByValue: true
    });

    console.log('State after clicking Clear Filters:', clearResult.result.value);
    ws.close();
  } finally {
    chrome.kill();
  }
}

testClearFilters().catch(console.error);
