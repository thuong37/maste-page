const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const remoteDebuggingPort = 9222;

async function runTest() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${remoteDebuggingPort}`,
    '--window-size=1440,900',
    '--no-sandbox'
  ]);

  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const pages = await fetchJson(`http://127.0.0.1:${remoteDebuggingPort}/json/list`);
    const pageTarget = pages.find(p => p.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    await sendCommand('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const items = Array.from(document.querySelectorAll('.navbar-nav .dropdown-item'));
        const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
        return {
          totalItems: items.length,
          itemTitles: items.map(item => ({
            name: item.querySelector('.dropdown-item-title')?.textContent.trim(),
            title: item.getAttribute('title')
          })),
          navLinkTitles: navLinks.map(link => ({
            name: link.querySelector('span')?.textContent.trim(),
            title: link.getAttribute('title')
          }))
        };
      })()`,
      returnByValue: true
    });

    console.log('Navbar Nav Link Titles:', result.result.value.navLinkTitles);
    console.log('Sample Dropdown Item Titles (First 4 under Tìm việc):', result.result.value.itemTitles.slice(0, 4));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProcess.kill();
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

runTest();
