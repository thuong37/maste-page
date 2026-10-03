const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function captureUpdatedArea() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9338;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,950',
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

  // Capture area around matching jobs bottom and cv template section
  const posRes = await send('Runtime.evaluate', {
    expression: `(function() {
      const cv = document.querySelector('.cv-template-section');
      const matching = document.querySelector('#viec-lam-phu-hop');
      const stats = document.querySelector('.hero-stats-strip');
      const cvRect = cv ? cv.getBoundingClientRect() : null;
      return {
        statsPresent: !!stats,
        cvY: cvRect ? cvRect.y + window.scrollY : 0,
        cvHeight: cvRect ? cvRect.height : 0
      };
    })()`,
    returnByValue: true
  });
  console.log('POSITION INFO:', posRes.result.value);

  const { cvY, cvHeight } = posRes.result.value;
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: cvY - 80,
      width: 1440,
      height: cvHeight + 160,
      scale: 1
    },
    captureBeyondViewport: true
  });
  fs.writeFileSync(path.resolve(__dirname, 'cv_section_after.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved cv_section_after.png');

  chrome.kill();
}

captureUpdatedArea();
