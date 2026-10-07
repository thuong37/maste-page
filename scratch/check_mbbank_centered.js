const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function checkMBBankCentered() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9390;
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

    // Apply names & styles, and hide the floating switcher widget temporarily so it doesn't block the view
    await send('Runtime.evaluate', {
      expression: `(() => {
        const titles = document.querySelectorAll('#cong-ty-tieu-bieu .company-card-title');
        const names = [
          'Công ty TNHH Phần Mềm FPT',
          'Công ty Cổ Phần VNG',
          'Tổng Công ty Dịch Vụ Số Viettel',
          'Ngân Hàng TMCP Kỹ Thương Việt Nam',
          'Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến',
          'Công ty TNHH Shopee',
          'Ngân Hàng TMCP Quân Đội',
          'Công ty Cổ Phần VinAI'
        ];
        titles.forEach((t, i) => {
          if (names[i]) t.textContent = names[i];
        });

        const style = document.createElement('style');
        style.textContent = \`
          .company-card {
            padding: 26px 12px 22px !important;
          }
          .company-card-title {
            font-size: 15.5px !important;
            font-weight: 700 !important;
            line-height: 1.4 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 46px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
            word-break: break-word !important;
            text-decoration: none !important;
            transition: color 0.18s ease !important;
          }
          .company-card-title:hover {
            color: #F97316 !important;
          }
          [data-theme="dark"] .company-card-title {
            color: #F8FAFC !important;
          }
          [data-theme="dark"] .company-card-title:hover {
            color: #F97316 !important;
          }
          .mode-switcher-pill, .floating-switcher {
            opacity: 0.15 !important;
          }
        \`;
        document.head.appendChild(style);

        // Shift so MB Bank is right in the center (cards 5, 6, 7, 8, 1)
        const track = document.getElementById('companies-track');
        // move 4 cards to the back
        for (let i = 0; i < 4; i++) {
          track.appendChild(track.firstElementChild);
        }
      })()`
    });

    // Scroll to section
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const shotMB = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'perfect_mbbank_centered.png'), Buffer.from(shotMB.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

checkMBBankCentered().catch(console.error);
