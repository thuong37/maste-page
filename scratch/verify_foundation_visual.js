const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testVisual() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9225;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--user-data-dir=D:\\master page\\scratch\\chrome-profile-foundation',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
  console.log('Connected to:', page.title);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
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
  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Check computed font-family, base font size, line-height on body
  const bodyMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const b = window.getComputedStyle(document.body);
      const card = document.querySelector('.job-card');
      const cardStyles = card ? window.getComputedStyle(card) : {};
      const salary = document.querySelector('.job-salary-text');
      const salaryStyles = salary ? window.getComputedStyle(salary) : {};
      const bookmark = document.querySelector('.btn-card-bookmark');
      const bookmarkStyles = bookmark ? window.getComputedStyle(bookmark) : {};

      return {
        bodyFontFamily: b.fontFamily,
        bodyFontSize: b.fontSize,
        bodyLineHeight: b.lineHeight,
        bodyColor: b.color,
        bodyBg: b.backgroundColor,
        cardBorderRadius: cardStyles.borderRadius,
        salaryColor: salaryStyles.color,
        bookmarkBorderColor: bookmarkStyles.borderColor,
        bookmarkColor: bookmarkStyles.color
      };
    })()`,
    returnByValue: true
  });

  console.log('Computed Body & Component Metrics:', JSON.stringify(bodyMetrics.result.value, null, 2));

  // Take screenshot of viec-lam.html
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/foundation_vieclam_verified.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved scratch/foundation_vieclam_verified.png');

  // Navigate to index.html and test
  await send('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  const homeMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const b = window.getComputedStyle(document.body);
      const card = document.querySelector('.job-card');
      const cardStyles = card ? window.getComputedStyle(card) : {};
      const title = document.querySelector('.job-title');
      const titleStyles = title ? window.getComputedStyle(title) : {};

      return {
        homeBodyFontFamily: b.fontFamily,
        homeBodyFontSize: b.fontSize,
        homeBodyLineHeight: b.lineHeight,
        homeCardRadius: cardStyles.borderRadius
      };
    })()`,
    returnByValue: true
  });

  console.log('Home Metrics:', JSON.stringify(homeMetrics.result.value, null, 2));

  const homeScreenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/foundation_home_verified.png', Buffer.from(homeScreenshot.data, 'base64'));
  console.log('Saved scratch/foundation_home_verified.png');

  ws.close();
  chrome.kill();
  console.log('Visual test completed successfully!');
}

testVisual().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
