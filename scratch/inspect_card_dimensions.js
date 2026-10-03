const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function runTest() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9478',
    '--disable-gpu',
    '--window-size=1440,1000',
    'http://localhost:8080/chi-tiet-viec-lam.html?id=5'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9478/json/list', res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('chi-tiet-viec-lam')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    const send = (method, params = {}) => new Promise(resolve => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await new Promise(r => setTimeout(r, 1000));

    // Evaluate Card Dimensions
    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('#splitListFeed .split-job-card'));
        return cards.slice(0, 5).map((card, idx) => {
          const r = card.getBoundingClientRect();
          const logo = card.querySelector('.split-company-logo')?.getBoundingClientRect();
          const title = card.querySelector('.split-card-title')?.textContent.trim();
          return {
            idx: idx + 1,
            title: title ? title.substring(0, 30) + '...' : '',
            cardW: Math.round(r.width),
            cardH: Math.round(r.height),
            logoW: logo ? Math.round(logo.width) : 0,
            logoH: logo ? Math.round(logo.height) : 0,
            borderRadius: window.getComputedStyle(card).borderRadius
          };
        });
      })()`
    });

    console.log('Card Inspection Results:', JSON.stringify(evalRes.result?.value, null, 2));

    // Capture screenshot of the whole page
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/fixed_cards_view.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to scratch/fixed_cards_view.png');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

runTest();
