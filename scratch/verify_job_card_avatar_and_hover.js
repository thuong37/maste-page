const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyJobCard() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9228/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list[0];
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

    // Cuộn tới vị trí của section Việc làm nổi bật
    await send('Runtime.evaluate', { 
      expression: `
        const section = document.getElementById('viec-lam-noi-bat');
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -60);
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // Lấy thông số tọa độ và kích thước của thẻ job đầu tiên
    const cardMetrics = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#featuredJobsGrid .job-card');
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          const logo = card.querySelector('.job-logo-wrapper');
          const logoRect = logo ? logo.getBoundingClientRect() : null;
          const timeEl = card.querySelector('.job-posted-time');
          const applyBtn = card.querySelector('.btn-card-apply');
          
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            logoWidth: logoRect ? logoRect.width : 0,
            logoHeight: logoRect ? logoRect.height : 0,
            timeDisplay: timeEl ? window.getComputedStyle(timeEl).display : 'none',
            applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none'
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Unhovered card metrics:', cardMetrics.result.value);

    // Chụp toàn cảnh trước
    const shotFull = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_featured_unhovered_full.png', Buffer.from(shotFull.data, 'base64'));

    // Chụp clip thẻ job unhovered
    const cardBox = cardMetrics.result.value;
    if (cardBox) {
      const shotCardUnhovered = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, cardBox.x - 10),
          y: Math.max(0, cardBox.y - 10),
          width: cardBox.width + 20,
          height: cardBox.height + 20,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/verified_card_unhovered.png', Buffer.from(shotCardUnhovered.data, 'base64'));
    }

    // Di chuột hover vào thẻ job đầu tiên
    const hoverX = cardBox.x + (cardBox.width / 2);
    const hoverY = cardBox.y + (cardBox.height / 2);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: hoverX,
      y: hoverY
    });
    await new Promise(r => setTimeout(r, 500));

    // Lấy thông số sau khi hover
    const hoveredMetrics = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#featuredJobsGrid .job-card');
          if (!card) return null;
          const timeEl = card.querySelector('.job-posted-time');
          const applyBtn = card.querySelector('.btn-card-apply');
          const applyBtnRect = applyBtn ? applyBtn.getBoundingClientRect() : null;
          
          return {
            timeDisplay: timeEl ? window.getComputedStyle(timeEl).display : 'none',
            applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none',
            applyBtnHeight: applyBtnRect ? applyBtnRect.height : 0,
            applyBtnWidth: applyBtnRect ? applyBtnRect.width : 0
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Hovered card metrics:', hoveredMetrics.result.value);

    // Chụp clip thẻ job khi hover (hiện nút ứng tuyển, ẩn thời gian)
    if (cardBox) {
      const shotCardHovered = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, cardBox.x - 10),
          y: Math.max(0, cardBox.y - 10),
          width: cardBox.width + 20,
          height: cardBox.height + 20,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/verified_card_hovered.png', Buffer.from(shotCardHovered.data, 'base64'));
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyJobCard().catch(console.error);
