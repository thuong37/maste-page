const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyViecLamPage() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/viec-lam.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2200));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9232/json/list', r => {
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

    // Cuộn tới thẻ job đầu tiên
    await send('Runtime.evaluate', { 
      expression: `
        (() => {
          const card = document.querySelector('#jobListingGrid .job-card');
          if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // Đo đạc thông số thẻ đầu tiên trước khi hover
    const unhovered = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#jobListingGrid .job-card');
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          const logo = card.querySelector('.job-company-logo');
          const logoRect = logo ? logo.getBoundingClientRect() : null;
          const metaUnhovered = card.querySelector('.job-meta-unhovered');
          const actionsHovered = card.querySelector('.job-actions-hovered');
          const applyBtn = card.querySelector('.btn-card-apply');
          
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            logoWidth: logoRect ? Math.round(logoRect.width) : 0,
            logoHeight: logoRect ? Math.round(logoRect.height) : 0,
            metaUnhoveredDisplay: metaUnhovered ? window.getComputedStyle(metaUnhovered).display : 'none',
            metaUnhoveredText: metaUnhovered ? metaUnhovered.textContent.trim().replace(/\\s+/g, ' ') : '',
            actionsHoveredDisplay: actionsHovered ? window.getComputedStyle(actionsHovered).display : 'none',
            applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none'
          };
        })()
      `,
      returnByValue: true
    });

    console.log('UNHOVERED CARD STATS:', unhovered.result.value);

    // Di chuột hover vào thẻ đầu tiên
    const cardBox = unhovered.result.value;
    const hoverX = cardBox.x + cardBox.width / 2;
    const hoverY = cardBox.y + cardBox.height / 2;

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: hoverX,
      y: hoverY
    });
    await new Promise(r => setTimeout(r, 500));

    // Đo đạc thông số sau khi hover
    const hovered = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#jobListingGrid .job-card');
          if (!card) return null;
          const metaUnhovered = card.querySelector('.job-meta-unhovered');
          const actionsHovered = card.querySelector('.job-actions-hovered');
          const applyBtn = card.querySelector('.btn-card-apply');
          const applyRect = applyBtn ? applyBtn.getBoundingClientRect() : null;
          
          return {
            metaUnhoveredDisplay: metaUnhovered ? window.getComputedStyle(metaUnhovered).display : 'none',
            actionsHoveredDisplay: actionsHovered ? window.getComputedStyle(actionsHovered).display : 'none',
            applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none',
            applyWidth: applyRect ? Math.round(applyRect.width) : 0,
            applyHeight: applyRect ? Math.round(applyRect.height) : 0,
            applyText: applyBtn ? applyBtn.textContent.trim() : ''
          };
        })()
      `,
      returnByValue: true
    });

    console.log('HOVERED CARD STATS:', hovered.result.value);

    // Chụp ảnh thẻ job ở trạng thái hover
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_vieclam_hover.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/verified_vieclam_hover.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyViecLamPage().catch(console.error);
