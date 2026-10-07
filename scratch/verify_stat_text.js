const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyStatText() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/viec-lam.html?keyword=sale'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2200));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9233/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('viec-lam.html')) || list.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const msgId = id++;
      const handler = e => {
        const m = JSON.parse(e.data);
        if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    await new Promise(r => setTimeout(r, 1500));

    // Lấy nội dung text thống kê
    const result = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const statEl = document.querySelector('.result-stat-text');
          const countEl = document.getElementById('jobCountText');
          return {
            statText: statEl ? statEl.textContent.trim().replace(/\\s+/g, ' ') : '',
            statHtml: statEl ? statEl.innerHTML.trim() : '',
            countText: countEl ? countEl.textContent.trim() : ''
          };
        })()
      `,
      returnByValue: true
    });

    console.log('RESULT STAT CHECK:', result.result.value);

    // Chụp lại toàn màn hình với từ khóa "sale"
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_stat_text.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/verified_stat_text.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyStatText().catch(console.error);
