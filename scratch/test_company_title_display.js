const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const companies = [
  'Công ty TNHH Phần Mềm FPT',
  'Công ty Cổ Phần VNG',
  'Tổng Công ty Dịch Vụ Số Viettel',
  'Ngân Hàng TMCP Kỹ Thương Việt Nam',
  'Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến',
  'Công ty TNHH Shopee',
  'Ngân Hàng TMCP Quân Đội',
  'Công ty Cổ Phần VinAI'
];

async function testTitleDisplay() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9360;
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

    // Update names temporarily on the live page and test styles
    const result = await send('Runtime.evaluate', {
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
        
        // Return heights and line wraps with current CSS
        return Array.from(titles).map(t => ({
          name: t.textContent,
          offsetHeight: t.offsetHeight,
          scrollHeight: t.scrollHeight,
          fontSize: window.getComputedStyle(t).fontSize
        }));
      })()`,
      returnByValue: true
    });

    console.log('Current style with new names:', JSON.stringify(result.result.value, null, 2));

    // Scroll to section
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 500));

    // Capture screenshot with current 13.5px
    const shotBefore = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_names_13_5px.png'), Buffer.from(shotBefore.data, 'base64'));

    // Now test with 16px font-size, bold, clear
    await send('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.id = 'test-title-style';
        style.textContent = \`
          .company-card-title {
            font-size: 16px !important;
            font-weight: 750 !important;
            line-height: 1.4 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 68px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          .company-card {
            padding: 24px 16px 20px !important;
          }
        \`;
        document.head.appendChild(style);
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const shot16px = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_names_16px.png'), Buffer.from(shot16px.data, 'base64'));

    // Check measurements with 16px
    const metrics16 = await send('Runtime.evaluate', {
      expression: `(() => {
        const titles = document.querySelectorAll('#cong-ty-tieu-bieu .company-card-title');
        return Array.from(titles).map(t => ({
          name: t.textContent,
          offsetHeight: t.offsetHeight,
          cardHeight: t.closest('.company-card').offsetHeight,
          lineHeight: window.getComputedStyle(t).lineHeight
        }));
      })()`,
      returnByValue: true
    });
    console.log('Metrics with 16px:', JSON.stringify(metrics16.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testTitleDisplay().catch(console.error);
