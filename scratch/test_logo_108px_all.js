const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function test108All() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9445;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/index.html'
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

    // Apply 108px styles
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.createElement('style');
        s.textContent = \`
          .mode-switcher-pill, .floating-switcher { display: none !important; }
          .company-card-logo-wrap {
            width: 108px !important;
            height: 108px !important;
            min-width: 108px !important;
            min-height: 108px !important;
            border-radius: 24px !important;
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07) !important;
          }
          .company-card-logo-mark {
            font-size: 30px !important;
            border-radius: 24px !important;
          }
          .company-logo-fpt { font-size: 30px !important; }
          .company-logo-vng { font-size: 30px !important; }
          .company-logo-viettel { font-size: 23px !important; }
          .company-logo-techcombank { font-size: 28px !important; }
          .company-logo-momo { font-size: 22px !important; }
          .company-logo-shopee { font-size: 34px !important; }
          .company-logo-mb { font-size: 30px !important; }
          .company-logo-vinai { font-size: 23px !important; }
          .company-card {
            padding: 24px 14px 20px !important;
          }
          .company-card-title {
            margin-top: 16px !important;
          }
        \`;
        document.head.appendChild(s);
        const sec = document.querySelector('#cong-ty-tieu-bieu');
        window.scrollTo(0, sec.offsetTop - 120);
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'verify_108px_slide1.png'), Buffer.from(shot1.data, 'base64'));

    // Move next to see MB Bank
    await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('.companies-carousel-next');
        if (nextBtn) {
          nextBtn.click();
          setTimeout(() => nextBtn.click(), 300);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'verify_108px_slide2.png'), Buffer.from(shot2.data, 'base64'));

    // Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s2 = document.createElement('style');
        s2.textContent = \`
          .company-card-logo-wrap {
            width: 88px !important;
            height: 88px !important;
            min-width: 88px !important;
            min-height: 88px !important;
            border-radius: 20px !important;
          }
          .company-card-logo-mark {
            font-size: 25px !important;
            border-radius: 20px !important;
          }
          .company-logo-viettel { font-size: 19px !important; }
          .company-logo-momo { font-size: 18px !important; }
          .company-logo-vinai { font-size: 19px !important; }
        \`;
        document.head.appendChild(s2);
        const sec = document.querySelector('#cong-ty-tieu-bieu');
        window.scrollTo(0, sec.offsetTop - 80);
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'verify_108px_mobile.png'), Buffer.from(shotMobile.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

test108All().catch(console.error);
