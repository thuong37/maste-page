const { spawn } = require('child_process');
const http = require('http');

async function measurePage(url, pageName) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9335;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    url
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list[0];
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
    const evalRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const hero = document.querySelector('.job-search-hero');
        const searchBox = document.querySelector('.job-search-box');
        const filterBar = document.querySelector('.top-filter-bar');
        const pillsGroup = document.querySelector('.top-filter-pills-group');
        
        function getInfo(el) {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const comp = window.getComputedStyle(el);
          return {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            background: comp.backgroundColor,
            border: comp.border,
            borderRadius: comp.borderRadius,
            boxShadow: comp.boxShadow
          };
        }

        return {
          hero: getInfo(hero),
          searchBox: getInfo(searchBox),
          filterBar: getInfo(filterBar),
          pillsGroup: getInfo(pillsGroup),
          filterBarParentClass: filterBar ? filterBar.parentElement.className : null
        };
      })()`,
      returnByValue: true
    });

    console.log(`=== Results for ${pageName} (${url}) ===`);
    console.log(JSON.stringify(evalRes.result ? evalRes.result.value : evalRes, null, 2));
    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  await measurePage('http://localhost:3000/viec-lam.html', 'viec-lam.html');
  await new Promise(r => setTimeout(r, 1000));
  await measurePage('http://localhost:3000/chi-tiet-viec-lam.html', 'chi-tiet-viec-lam.html');
}

run().catch(console.error);
