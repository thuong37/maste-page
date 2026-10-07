const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testMobileCards() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9400;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=414,896',
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

    // Apply names & responsive styles
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
          .company-card-title {
            font-size: 13.5px !important;
            font-weight: 750 !important;
            line-height: 1.38 !important;
            color: #0F172A !important;
            margin-top: 14px !important;
            min-height: 42px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
            text-decoration: none !important;
          }
          [data-theme="dark"] .company-card-title {
            color: #F8FAFC !important;
          }
          .mode-switcher-pill, .floating-switcher {
            display: none !important;
          }
        \`;
        document.head.appendChild(style);
      })()`
    });

    // Mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to section
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'perfect_mobile_view.png'), Buffer.from(shotMobile.data, 'base64'));

    // Move to next cards
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

    const shotMobile2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'perfect_mobile_view2.png'), Buffer.from(shotMobile2.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testMobileCards().catch(console.error);
