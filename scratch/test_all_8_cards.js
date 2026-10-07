const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testAll8Cards() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9370;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1600,1200',
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

    // Apply names and create an overview grid showing all 8 cards at once!
    await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.getElementById('companies-track');
        // Stop any carousel auto-rotation if any
        const clone = track.cloneNode(true);
        track.parentNode.replaceChild(clone, track);
        
        const titles = clone.querySelectorAll('.company-card-title');
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

        // Make track wrap so all 8 cards are visible in 2 rows of 4
        clone.style.flexWrap = 'wrap';
        clone.style.transform = 'none';
        clone.style.gap = '20px';
        const cards = clone.querySelectorAll('.company-card');
        cards.forEach(c => {
          c.style.flex = '0 0 calc((100% - 3 * 20px) / 4)';
          c.style.visibility = 'visible';
          c.style.opacity = '1';
        });

        // Add custom styles for title
        let style = document.getElementById('test-all-cards-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'test-all-cards-style';
          document.head.appendChild(style);
        }
        style.textContent = \`
          .company-card-title {
            font-size: 15.5px !important;
            font-weight: 750 !important;
            line-height: 1.4 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 48px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
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

    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const shotAll = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_all_8_cards_15_5px.png'), Buffer.from(shotAll.data, 'base64'));

    // Check with 16px and line-clamp 3
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('test-all-cards-style').textContent = \`
          .company-card-title {
            font-size: 16px !important;
            font-weight: 750 !important;
            line-height: 1.38 !important;
            color: #0F172A !important;
            margin-top: 18px !important;
            min-height: 52px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-align: center !important;
            letter-spacing: -0.015em !important;
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
    await new Promise(r => setTimeout(r, 600));

    const shotAll16 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'test_all_8_cards_16px.png'), Buffer.from(shotAll16.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testAll8Cards().catch(console.error);
