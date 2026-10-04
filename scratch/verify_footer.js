const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// First check if server is running on 3000
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:3000/public/index.html', (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function verifyFooter() {
  const isUp = await checkServer();
  let serverProcess = null;
  if (!isUp) {
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], { stdio: 'inherit' });
    await new Promise(r => setTimeout(r, 1000));
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9355;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/public/index.html'
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

    await new Promise(r => ws.addEventListener('open', r));
    await send('Runtime.enable');
    await send('Page.enable');

    // Scroll to footer
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('#chan-trang');
          if (!footer) return { error: 'footer not found' };
          footer.scrollIntoView({ behavior: 'instant', block: 'end' });
          
          const titles = Array.from(footer.querySelectorAll('.footer-col-title')).map(h => h.textContent.trim());
          const gridCols = getComputedStyle(document.querySelector('.footer-main-grid')).gridTemplateColumns;
          const numCols = document.querySelector('.footer-main-grid').children.length;
          
          const hasNhaTuyenDung = titles.some(t => t.toLowerCase().includes('nhà tuyển dụng'));

          return {
            titles,
            gridCols,
            numCols,
            hasNhaTuyenDung
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Evaluation result:', JSON.stringify(evalRes.result.value, null, 2));

    await new Promise(r => setTimeout(r, 1000));

    // Capture screenshot of footer
    const clipRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('#chan-trang');
          const rect = footer.getBoundingClientRect();
          return {
            x: rect.x,
            y: rect.y + window.scrollY,
            width: rect.width,
            height: rect.height
          };
        })()
      `,
      returnByValue: true
    });

    const clip = clipRes.result.value;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height,
        scale: 1
      }
    });

    if (screenshot && screenshot.data) {
      fs.writeFileSync(path.join(__dirname, 'footer_after_removal.png'), Buffer.from(screenshot.data, 'base64'));
      console.log('Screenshot saved to scratch/footer_after_removal.png');
    }

    ws.close();
  } finally {
    chrome.kill();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

verifyFooter().catch(console.error);
