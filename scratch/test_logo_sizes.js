const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testLogoSizes() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9440;
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

    // Scroll to section and hide floating switcher
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.createElement('style');
        s.id = 'hide-switcher';
        s.textContent = '.mode-switcher-pill, .floating-switcher { display: none !important; }';
        document.head.appendChild(s);
        const sec = document.querySelector('#cong-ty-tieu-bieu');
        window.scrollTo(0, sec.offsetTop - 100);
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Option 1: 100px x 100px
    await send('Runtime.evaluate', {
      expression: `(() => {
        let style = document.getElementById('test-logo-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'test-logo-style';
          document.head.appendChild(style);
        }
        style.textContent = \`
          .company-card-logo-wrap {
            width: 100px !important;
            height: 100px !important;
            min-width: 100px !important;
            min-height: 100px !important;
            border-radius: 22px !important;
          }
          .company-card-logo-mark {
            font-size: 28px !important;
            border-radius: 22px !important;
          }
          .company-logo-fpt { font-size: 28px !important; }
          .company-logo-vng { font-size: 28px !important; }
          .company-logo-viettel { font-size: 21px !important; }
          .company-logo-techcombank { font-size: 26px !important; }
          .company-logo-momo { font-size: 20px !important; }
          .company-logo-shopee { font-size: 32px !important; }
          .company-logo-mb { font-size: 28px !important; }
          .company-logo-vinai { font-size: 21px !important; }
          .company-card {
            padding: 24px 14px 20px !important;
          }
        \`;
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const shot100 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_logo_100px.png'), Buffer.from(shot100.data, 'base64'));

    // Option 2: 108px x 108px
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('test-logo-style').textContent = \`
          .company-card-logo-wrap {
            width: 108px !important;
            height: 108px !important;
            min-width: 108px !important;
            min-height: 108px !important;
            border-radius: 24px !important;
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
        \`;
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const shot108 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_logo_108px.png'), Buffer.from(shot108.data, 'base64'));

    // Option 3: 116px x 116px
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('test-logo-style').textContent = \`
          .company-card-logo-wrap {
            width: 116px !important;
            height: 116px !important;
            min-width: 116px !important;
            min-height: 116px !important;
            border-radius: 26px !important;
          }
          .company-card-logo-mark {
            font-size: 32px !important;
            border-radius: 26px !important;
          }
          .company-logo-fpt { font-size: 32px !important; }
          .company-logo-vng { font-size: 32px !important; }
          .company-logo-viettel { font-size: 25px !important; }
          .company-logo-techcombank { font-size: 30px !important; }
          .company-logo-momo { font-size: 23px !important; }
          .company-logo-shopee { font-size: 38px !important; }
          .company-logo-mb { font-size: 32px !important; }
          .company-logo-vinai { font-size: 24px !important; }
          .company-card {
            padding: 22px 14px 20px !important;
          }
        \`;
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const shot116 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_logo_116px.png'), Buffer.from(shot116.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testLogoSizes().catch(console.error);
