const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function measureHomeCards() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9488',
    '--disable-gpu',
    '--window-size=1440,1000',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9488/json/list', res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
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

    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('#featuredJobsGrid .job-card, .matching-jobs-section .job-card'));
        return cards.slice(0, 4).map((card, idx) => {
          const r = card.getBoundingClientRect();
          const logoWrap = card.querySelector('.job-logo-wrapper')?.getBoundingClientRect();
          const logoImg = card.querySelector('.job-logo')?.getBoundingClientRect();
          const title = card.querySelector('.job-title');
          const company = card.querySelector('.company-name');
          const pills = card.querySelector('.job-pills')?.getBoundingClientRect();
          const bookmark = card.querySelector('.btn-bookmark')?.getBoundingClientRect();
          const cs = window.getComputedStyle(card);
          return {
            idx: idx + 1,
            cardWidth: Math.round(r.width),
            cardHeight: Math.round(r.height),
            padding: cs.padding,
            borderRadius: cs.borderRadius,
            gap: cs.gap,
            logoWrapW: logoWrap ? Math.round(logoWrap.width) : 0,
            logoWrapH: logoWrap ? Math.round(logoWrap.height) : 0,
            titleText: title ? title.textContent.trim().substring(0, 30) + '...' : '',
            titleFontSize: title ? window.getComputedStyle(title).fontSize : '',
            companyText: company ? company.textContent.trim().substring(0, 25) + '...' : '',
            companyFontSize: company ? window.getComputedStyle(company).fontSize : '',
            pillsH: pills ? Math.round(pills.height) : 0,
            bookmarkW: bookmark ? Math.round(bookmark.width) : 0,
            bookmarkH: bookmark ? Math.round(bookmark.height) : 0,
          };
        });
      })()`
    });

    console.log("Card measurements on home page:", JSON.stringify(evalRes.result.value, null, 2));

    // Also take a screenshot of the featured jobs section
    const clipRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-noi-bat');
        const r = sec.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 600) };
      })()`
    });

    if (clipRes.result.value) {
      const clip = clipRes.result.value;
      const ss = await send('Page.captureScreenshot', {
        clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 }
      });
      fs.writeFileSync('scratch/home_featured_jobs_current.png', Buffer.from(ss.data, 'base64'));
      console.log("Saved scratch/home_featured_jobs_current.png");
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

measureHomeCards();
