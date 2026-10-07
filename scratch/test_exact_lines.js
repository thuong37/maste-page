const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testExactLines() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9380;
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

    const test = await send('Runtime.evaluate', {
      expression: `(() => {
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

        const card = document.querySelector('#cong-ty-tieu-bieu .company-card');
        const cardWidth = card.clientWidth;

        const tester = document.createElement('div');
        document.body.appendChild(tester);
        tester.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        tester.style.fontWeight = '700';
        tester.style.textAlign = 'center';
        tester.style.boxSizing = 'border-box';

        const paddings = [
          { name: 'pad16 (inner 194px)', pad: '16px', width: cardWidth - 32 },
          { name: 'pad12 (inner 202px)', pad: '12px', width: cardWidth - 24 },
          { name: 'pad10 (inner 206px)', pad: '10px', width: cardWidth - 20 }
        ];

        const fontSizes = ['14px', '14.5px', '15px', '15.5px', '16px'];

        const out = [];

        paddings.forEach(p => {
          tester.style.width = p.width + 'px';
          fontSizes.forEach(fs => {
            tester.style.fontSize = fs;
            tester.style.lineHeight = '1.35';
            const linesPerName = names.map(n => {
              tester.innerText = n;
              // measure line count using clientHeight / single line height
              tester.innerText = 'M';
              const singleLineH = tester.clientHeight;
              tester.innerText = n;
              const actualH = tester.clientHeight;
              const count = Math.round(actualH / singleLineH);
              return { name: n, lines: count, text: n };
            });
            out.push({
              config: \`\${p.name} - \${fs}\`,
              maxLines: Math.max(...linesPerName.map(l => l.lines)),
              names: linesPerName
            });
          });
        });

        document.body.removeChild(tester);
        return out;
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(test.result.value.filter(c => c.maxLines <= 2 || c.config.includes('15')), null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testExactLines().catch(console.error);
