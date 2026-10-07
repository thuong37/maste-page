const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureHoverEffect() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2200));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9231/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('index.html')) || list.find(t => t.type === 'page');
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

    // Cuộn tới vị trí danh sách Việc làm nổi bật
    await send('Runtime.evaluate', { 
      expression: `
        (() => {
          const section = document.getElementById('viec-lam-noi-bat');
          if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.scrollBy(0, -20);
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // Lấy tọa độ viewport của thẻ đầu tiên
    const pos = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#featuredJobsGrid .job-card');
          const rect = card.getBoundingClientRect();
          return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Mouse move to:', pos.result.value);

    // Di chuyển chuột vào thẻ đầu tiên để kích hoạt :hover
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: pos.result.value.x,
      y: pos.result.value.y
    });

    await new Promise(r => setTimeout(r, 400));

    // Chụp lại toàn cảnh viewport khi hover
    const hoverShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_featured_hovered_full.png', Buffer.from(hoverShot.data, 'base64'));
    console.log('Saved scratch/verified_featured_hovered_full.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

captureHoverEffect().catch(console.error);
