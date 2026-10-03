const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureElement(selector, outputFile) {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9488',
    '--disable-gpu',
    '--window-size=1440,1000',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9488/json/list', res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    const send = (method, params = {}) => new Promise(resolve => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (el) el.scrollIntoView({ block: 'center', inline: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const boxRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`
    });

    const box = boxRes.result.value;
    if (box) {
      const shot = await send('Page.captureScreenshot', {
        clip: {
          x: Math.max(0, box.x),
          y: Math.max(0, box.y),
          width: Math.min(1440, box.width),
          height: box.height,
          scale: 1
        }
      });
      fs.writeFileSync(outputFile, Buffer.from(shot.data, 'base64'));
      console.log('Saved', outputFile);
    }
    chrome.kill();
  } catch(e) {
    console.error(e);
    chrome.kill();
  }
}

(async () => {
  await captureElement('#cong-ty-tieu-bieu', path.resolve(__dirname, 'companies_section_65x65.png'));
  process.exit(0);
})();
