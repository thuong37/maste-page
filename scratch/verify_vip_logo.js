const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyVipEmployerLogo() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/viec-lam.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2200));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9234/json/list', r => {
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

    // Lấy thông số của widget VIP Employer và logo của nó
    const stats = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.vip-employer-card');
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          const logoWrap = card.querySelector('.vip-employer-logo-wrap');
          const logoImg = card.querySelector('.vip-logo-img');
          const logoRect = logoWrap ? logoWrap.getBoundingClientRect() : null;
          const cover = card.querySelector('.vip-employer-cover');
          const coverRect = cover ? cover.getBoundingClientRect() : null;

          return {
            cardX: rect.x,
            cardY: rect.y,
            cardWidth: Math.round(rect.width),
            cardHeight: Math.round(rect.height),
            coverHeight: coverRect ? Math.round(coverRect.height) : 0,
            logoWidth: logoRect ? Math.round(logoRect.width) : 0,
            logoHeight: logoRect ? Math.round(logoRect.height) : 0
          };
        })()
      `,
      returnByValue: true
    });

    console.log('VIP EMPLOYER STATS:', stats.result.value);

    // Chụp cận cảnh widget VIP Employer
    const box = stats.result.value;
    if (box) {
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, box.cardX - 10),
          y: Math.max(0, box.cardY - 10),
          width: box.cardWidth + 20,
          height: box.cardHeight + 20,
          scale: 1
        }
      });
      fs.writeFileSync('scratch/verified_vip_employer_logo.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scratch/verified_vip_employer_logo.png');
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyVipEmployerLogo().catch(console.error);
