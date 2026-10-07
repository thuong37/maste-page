const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testCarouselSlides() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9375;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1050',
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

    // Apply the clean names & improved typography
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

        let style = document.createElement('style');
        style.textContent = \`
          .company-card {
            padding: 24px 16px 20px !important;
          }
          .company-card-title {
            font-size: 15.5px !important;
            font-weight: 750 !important;
            line-height: 1.4 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 48px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
            word-break: break-word !important;
            text-decoration: none !important;
          }
          [data-theme="dark"] .company-card-title {
            color: #F8FAFC !important;
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
    const shotSlide1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'carousel_slide1.png'), Buffer.from(shotSlide1.data, 'base64'));

    // Click Next button 3 times to show cards 6, 7 (MB Bank), 8
    await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('.companies-carousel-next');
        if (nextBtn) {
          nextBtn.click();
          setTimeout(() => nextBtn.click(), 400);
          setTimeout(() => nextBtn.click(), 800);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1400));

    // Capture Slide 2
    const shotSlide2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'carousel_slide2.png'), Buffer.from(shotSlide2.data, 'base64'));

    // Also test mobile view
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'carousel_mobile.png'), Buffer.from(shotMobile.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testCarouselSlides().catch(console.error);
