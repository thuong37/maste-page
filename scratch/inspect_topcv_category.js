const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9244;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,1000',
  'https://www.topcv.vn/tim-viec-lam'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  try {
    await delay(5000);
    const pages = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/list`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = pages.find(p => p.url.includes('topcv'));
    if (!page) {
      console.log('No topcv page found', pages);
      chrome.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(resolve => {
      const messageId = id++;
      const handler = event => {
        const msg = JSON.parse(event.data);
        if (msg.id === messageId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });
    await new Promise(resolve => { ws.onopen = resolve; });

    console.log('Connected to TopCV!');
    await delay(3000);

    // Look for category button
    const findCategoryBtn = await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('button, div, a, span'));
        const cat = buttons.find(b => b.textContent && (b.textContent.includes('Danh mục nghề') || b.textContent.includes('Ngành nghề') || b.textContent.includes('Tất cả ngành nghề')));
        return cat ? { tag: cat.tagName, text: cat.textContent.trim().slice(0, 50), class: cat.className } : null;
      })()`,
      returnByValue: true
    });
    console.log('Category element:', findCategoryBtn.result.value);

    // Take screenshot of page
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/topcv_tim_viec_lam.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved scratch/topcv_tim_viec_lam.png');

    chrome.kill();
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}

run();
