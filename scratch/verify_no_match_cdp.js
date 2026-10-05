const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testSection() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9360;
  const filePath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1200',
    filePath
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

    await new Promise(r => ws.addEventListener('open', r));

    // Evaluate cards in #viec-lam-phu-hop
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sec = document.querySelector('#viec-lam-phu-hop');
          if (!sec) return { error: 'not found' };
          const rect = sec.getBoundingClientRect();
          const cards = Array.from(sec.querySelectorAll('.job-card')).map(card => {
            const title = card.querySelector('.job-title')?.textContent?.trim();
            const pills = Array.from(card.querySelectorAll('.job-pill')).map(p => p.textContent.trim());
            return { title, pills };
          });
          return {
            x: rect.x,
            y: rect.y + window.pageYOffset,
            width: rect.width,
            height: rect.height,
            cards
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DOM Evaluation Result:');
    console.log(JSON.stringify(evalRes.result.value, null, 2));

    const { x, y, width, height } = evalRes.result.value;

    const screenshotRes = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(1440, width),
        height: height,
        scale: 1
      },
      captureBeyondViewport: true
    });

    if (screenshotRes && screenshotRes.data) {
      fs.writeFileSync(path.join(__dirname, 'viec_lam_phu_hop_cards.png'), Buffer.from(screenshotRes.data, 'base64'));
      console.log('Saved screenshot to scratch/viec_lam_phu_hop_cards.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    chrome.kill();
  }
}

testSection();
