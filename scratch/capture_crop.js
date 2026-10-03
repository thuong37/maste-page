const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function captureHeaders() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9336;
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

  const evalRes = await send('Runtime.evaluate', {
    expression: `(function() {
      const headers = [
        { name: 'Featured Jobs', el: document.querySelector('#viec-lam-noi-bat .section-header') },
        { name: 'Attractive Jobs', el: document.querySelector('#viec-lam-hap-dan .section-header') },
        { name: 'Top Companies', el: document.querySelector('#cong-ty-tieu-bieu .section-header') },
        { name: 'Matching Jobs', el: document.querySelector('#viec-lam-phu-hop .section-header') },
        { name: 'CV Template', el: document.querySelector('.cv-template-header') },
        { name: 'Popular Keywords', el: document.querySelector('#tu-khoa-pho-bien .section-header') }
      ];
      return headers.map(h => {
        if (!h.el) return { name: h.name, error: 'NOT_FOUND' };
        const rect = h.el.getBoundingClientRect();
        return {
          name: h.name,
          x: Math.round(rect.x),
          y: Math.round(rect.y + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      });
    })()`,
    returnByValue: true
  });

  const headerBoxes = evalRes.result.value;
  console.log('HEADER BOXES:', headerBoxes);

  // Capture stats strip and CV template area screenshot
  const statsRes = await send('Runtime.evaluate', {
    expression: `(function() {
      const stats = document.querySelector('.hero-stats-strip');
      const cv = document.querySelector('.cv-template-section');
      const rectStats = stats ? stats.getBoundingClientRect() : null;
      const rectCv = cv ? cv.getBoundingClientRect() : null;
      return {
        stats: rectStats ? { x: rectStats.x, y: rectStats.y + window.scrollY, width: rectStats.width, height: rectStats.height } : null,
        cv: rectCv ? { x: rectCv.x, y: rectCv.y + window.scrollY, width: rectCv.width, height: rectCv.height } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('STATS & CV:', statsRes.result.value);

  // Capture screenshot of stats + CV area
  if (statsRes.result.value.stats && statsRes.result.value.cv) {
    const yStart = statsRes.result.value.stats.y - 40;
    const totalHeight = statsRes.result.value.stats.height + statsRes.result.value.cv.height + 80;
    const clip = {
      x: 0,
      y: yStart,
      width: 1440,
      height: totalHeight,
      scale: 1
    };
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clip,
      captureBeyondViewport: true
    });
    fs.writeFileSync(path.resolve(__dirname, 'stats_and_cv_before.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved stats_and_cv_before.png');
  }

  chrome.kill();
}

captureHeaders();
