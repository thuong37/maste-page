const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function captureFullPage(width = 1440, height = 950, filename = 'homepage_full_desktop.png') {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9335;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    `--window-size=${width},${height}`,
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:' + port + '/json/list', res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('index.html')) || list[0];
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
  
  // Get content size
  const layout = await send('Page.getLayoutMetrics');
  const contentHeight = Math.ceil(layout.contentSize.height);
  
  // Set device metrics to content size for full page
  await send('Emulation.setDeviceMetricsOverride', {
    width: width,
    height: contentHeight,
    deviceScaleFactor: 1,
    mobile: width < 768
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });
  
  const outPath = path.resolve(__dirname, filename);
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot ${width}x${contentHeight} to ${outPath}`);
  
  chrome.kill();
}

(async () => {
  await captureFullPage(1440, 950, 'homepage_full_before_desktop.png');
  await captureFullPage(390, 844, 'homepage_full_before_mobile.png');
})();
