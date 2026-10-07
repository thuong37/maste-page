const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testFontSizes() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9365;
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

    // Apply names
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
      })()`
    });

    // Test different options:
    // Option 1: 15px, letter-spacing: -0.01em
    // Option 2: 15.5px
    // Option 3: 16px with flex center
    const testResults = await send('Runtime.evaluate', {
      expression: `(() => {
        const testText = 'Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến';
        const cardWidth = document.querySelector('#cong-ty-tieu-bieu .company-card').clientWidth;
        
        // Create dummy tester
        const tester = document.createElement('div');
        tester.style.width = (cardWidth - 32) + 'px'; // 16px padding on each side
        tester.style.fontFamily = 'Inter, sans-serif';
        tester.style.fontWeight = '700';
        tester.textContent = testText;
        document.body.appendChild(tester);

        const sizes = ['14.5px', '15px', '15.5px', '16px'];
        const res = sizes.map(sz => {
          tester.style.fontSize = sz;
          tester.style.lineHeight = '1.35';
          return {
            size: sz,
            scrollHeight: tester.scrollHeight,
            lineCount: Math.round(tester.scrollHeight / (parseFloat(sz) * 1.35))
          };
        });
        document.body.removeChild(tester);
        return { cardInnerWidth: cardWidth - 32, results: res };
      })()`,
      returnByValue: true
    });

    console.log('Test results:', JSON.stringify(testResults.result.value, null, 2));

    // Scroll to section
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 400));

    // Let's test Option A: 15.5px with vertical centering in flex box
    await send('Runtime.evaluate', {
      expression: `(() => {
        let style = document.getElementById('test-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'test-style';
          document.head.appendChild(style);
        }
        style.textContent = \`
          .company-card-title {
            font-size: 15.5px !important;
            font-weight: 750 !important;
            line-height: 1.38 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 64px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
            word-break: break-word !important;
          }
          [data-theme="dark"] .company-card-title {
            color: #F8FAFC !important;
          }
          .company-card {
            padding: 24px 16px 20px !important;
          }
        \`;
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const shotOptA = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_opt_a_15_5px.png'), Buffer.from(shotOptA.data, 'base64'));

    // Option B: 16px with vertical centering in flex box
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('test-style').textContent = \`
          .company-card-title {
            font-size: 16px !important;
            font-weight: 750 !important;
            line-height: 1.38 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 66px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
            word-break: break-word !important;
          }
          [data-theme="dark"] .company-card-title {
            color: #F8FAFC !important;
          }
          .company-card {
            padding: 24px 16px 20px !important;
          }
        \`;
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const shotOptB = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_opt_b_16px.png'), Buffer.from(shotOptB.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testFontSizes().catch(console.error);
