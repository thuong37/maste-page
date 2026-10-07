const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyVisual() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2200));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9230/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    console.log('Available targets:', list.map(t => ({ type: t.type, url: t.url })));
    const page = list.find(t => t.type === 'page' && t.url.includes('index.html')) || list.find(t => t.type === 'page') || list[0];
    
    if (!page || !page.webSocketDebuggerUrl) {
      throw new Error('No target page found');
    }

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

    // Chờ DOM và JS tải xong
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
    await new Promise(r => setTimeout(r, 800));

    // Đo đạc thông số thẻ job đầu tiên khi CHƯA HOVER
    const unhovered = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#featuredJobsGrid .job-card');
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          const logoWrapper = card.querySelector('.job-logo-wrapper');
          const logoRect = logoWrapper ? logoWrapper.getBoundingClientRect() : null;
          const timeEl = card.querySelector('.job-posted-time');
          const applyBtn = card.querySelector('.btn-card-apply');
          
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            logoWidth: logoRect ? Math.round(logoRect.width) : 0,
            logoHeight: logoRect ? Math.round(logoRect.height) : 0,
            timeDisplay: timeEl ? window.getComputedStyle(timeEl).display : 'none',
            timeVisible: timeEl ? (window.getComputedStyle(timeEl).display !== 'none') : false,
            timeText: timeEl ? timeEl.textContent.trim() : '',
            applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none',
            applyVisible: applyBtn ? (window.getComputedStyle(applyBtn).display !== 'none') : false
          };
        })()
      `,
      returnByValue: true
    });

    console.log('UNHOVERED CARD STATS:', unhovered.result.value);

    // Chụp screenshot toàn phần section
    const fullShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_featured_section.png', Buffer.from(fullShot.data, 'base64'));

    const cardBox = unhovered.result.value;
    if (cardBox) {
      // Chụp cận cảnh 2 thẻ đầu tiên khi chưa hover
      const shotUnhoveredCard = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, cardBox.x - 10),
          y: Math.max(0, cardBox.y - 10),
          width: Math.min(1400, cardBox.width * 2 + 50),
          height: cardBox.height + 30,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/verified_card_unhovered.png', Buffer.from(shotUnhoveredCard.data, 'base64'));

      // Di chuột Hover vào thẻ job đầu tiên
      const hoverX = cardBox.x + 80;
      const hoverY = cardBox.y + 40;

      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: hoverX,
        y: hoverY
      });
      await new Promise(r => setTimeout(r, 600));

      // Đo đạc thông số sau khi HOVER
      const hovered = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const card = document.querySelector('#featuredJobsGrid .job-card');
            if (!card) return null;
            const timeEl = card.querySelector('.job-posted-time');
            const applyBtn = card.querySelector('.btn-card-apply');
            const applyRect = applyBtn ? applyBtn.getBoundingClientRect() : null;
            
            return {
              timeDisplay: timeEl ? window.getComputedStyle(timeEl).display : 'none',
              timeVisible: timeEl ? (window.getComputedStyle(timeEl).display !== 'none') : false,
              applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none',
              applyVisible: applyBtn ? (window.getComputedStyle(applyBtn).display !== 'none') : false,
              applyWidth: applyRect ? Math.round(applyRect.width) : 0,
              applyHeight: applyRect ? Math.round(applyRect.height) : 0,
              applyText: applyBtn ? applyBtn.textContent.trim() : ''
            };
          })()
        `,
        returnByValue: true
      });

      console.log('HOVERED CARD STATS:', hovered.result.value);

      // Chụp cận cảnh khi hover (hiện nút Ứng tuyển, ẩn Thời gian đăng)
      const shotHoveredCard = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, cardBox.x - 10),
          y: Math.max(0, cardBox.y - 10),
          width: Math.min(1400, cardBox.width * 2 + 50),
          height: cardBox.height + 30,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/verified_card_hovered.png', Buffer.from(shotHoveredCard.data, 'base64'));
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyVisual().catch(console.error);
