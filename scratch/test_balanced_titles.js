const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testBalancedTitles() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9395;
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

    // Apply balanced names & styles
    await send('Runtime.evaluate', {
      expression: `(() => {
        const titles = document.querySelectorAll('#cong-ty-tieu-bieu .company-card-title');
        const namesHtml = [
          'Công ty TNHH Phần&nbsp;Mềm&nbsp;FPT',
          'Công ty Cổ Phần VNG',
          'Tổng Công ty Dịch&nbsp;Vụ&nbsp;Số&nbsp;Viettel',
          'Ngân Hàng TMCP Kỹ&nbsp;Thương&nbsp;Việt&nbsp;Nam',
          'Công ty Cổ Phần Dịch Vụ Di&nbsp;Động&nbsp;Trực&nbsp;Tuyến',
          'Công ty TNHH Shopee',
          'Ngân Hàng TMCP Quân&nbsp;Đội',
          'Công ty Cổ Phần VinAI'
        ];
        titles.forEach((t, i) => {
          if (namesHtml[i]) t.innerHTML = namesHtml[i];
        });

        const style = document.createElement('style');
        style.textContent = \`
          .company-card {
            padding: 26px 14px 22px !important;
          }
          .company-card-title {
            font-size: 15.5px !important;
            font-weight: 750 !important;
            line-height: 1.38 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 46px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
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
            display: none !important;
          }
        \`;
        document.head.appendChild(style);
      })()`
    });

    // Scroll to section
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture Slide 1 (cards 1-5)
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'balanced_slide1.png'), Buffer.from(shot1.data, 'base64'));

    // Move track to center MB Bank
    await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.getElementById('companies-track');
        for (let i = 0; i < 3; i++) {
          track.appendChild(track.firstElementChild);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'balanced_slide2_mbbank.png'), Buffer.from(shot2.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testBalancedTitles().catch(console.error);
