const { spawn } = require('child_process');
const http = require('http');

async function inspectTrigger() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9334;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--user-data-dir=c:\\code\\easycv\\maste-page\\scratch\\temp-chrome-inspect-' + Date.now(),
    'http://127.0.0.1:8000/viec-lam.html?keyword=sale'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const page = tabs.find(p => p.url.includes('viec-lam.html')) || tabs[0];
    const wsUrl = page.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

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

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('heroLocationTrigger');
          return {
            outerHTML: el ? el.outerHTML : 'NULL',
            innerText: el ? el.innerText : 'NULL',
            childNodes: el ? Array.from(el.childNodes).map(n => ({
              nodeType: n.nodeType,
              nodeName: n.nodeName,
              textContent: n.textContent
            })) : []
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Result for viec-lam.html:');
    console.log(JSON.stringify(evalRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

inspectTrigger();
