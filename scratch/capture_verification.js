const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function captureAllVerificationScreens() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9489',
    '--disable-gpu',
    '--window-size=1440,1200',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9489/json/list', res => {
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

    // 1. Capture Featured Section
    const featuredRect = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-noi-bat');
        const r = sec.getBoundingClientRect();
        return { x: r.x, y: r.y + window.scrollY, width: r.width, height: 620 };
      })()`
    });

    if (featuredRect.result.value) {
      const clip = featuredRect.result.value;
      const ss = await send('Page.captureScreenshot', {
        clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 }
      });
      fs.writeFileSync('scratch/verify_featured_jobs_compact.png', Buffer.from(ss.data, 'base64'));
      console.log('Saved scratch/verify_featured_jobs_compact.png');
    }

    // 2. Capture Matching Jobs Section
    const matchingRect = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-phu-hop');
        if (!sec) return null;
        const r = sec.getBoundingClientRect();
        return { x: r.x, y: r.y + window.scrollY, width: r.width, height: 600 };
      })()`
    });

    if (matchingRect.result?.value) {
      const clip = matchingRect.result.value;
      const ss = await send('Page.captureScreenshot', {
        clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 }
      });
      fs.writeFileSync('scratch/verify_matching_jobs_compact.png', Buffer.from(ss.data, 'base64'));
      console.log('Saved scratch/verify_matching_jobs_compact.png');
    }

    // 3. Hover over first card and capture
    await send('Runtime.evaluate', {
      expression: `(() => {
        const firstCard = document.querySelector('#featuredJobsGrid .job-card');
        if (firstCard) {
          firstCard.scrollIntoView({ block: 'center' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const cardCoords = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const firstCard = document.querySelector('#featuredJobsGrid .job-card');
        const r = firstCard.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), clip: { x: r.x - 10, y: r.y - 10, width: r.width + 20, height: r.height + 20 } };
      })()`
    });

    if (cardCoords.result.value) {
      const { x, y, clip } = cardCoords.result.value;
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await new Promise(r => setTimeout(r, 400));
      const ss = await send('Page.captureScreenshot', {
        clip: { x: Math.max(0, clip.x), y: Math.max(0, clip.y), width: clip.width, height: clip.height, scale: 1 }
      });
      fs.writeFileSync('scratch/verify_card_hovered_compact.png', Buffer.from(ss.data, 'base64'));
      console.log('Saved scratch/verify_card_hovered_compact.png');
    }

    // 4. Mobile view measurement
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 800));

    const mobileStats = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const card = document.querySelector('#featuredJobsGrid .job-card');
        const r = card.getBoundingClientRect();
        const logo = card.querySelector('.job-logo-wrapper').getBoundingClientRect();
        return {
          cardWidth: Math.round(r.width),
          cardHeight: Math.round(r.height),
          logoWidth: Math.round(logo.width),
          logoHeight: Math.round(logo.height)
        };
      })()`
    });
    console.log('Mobile Card Stats:', mobileStats.result.value);

    const mobileSS = await send('Page.captureScreenshot');
    fs.writeFileSync('scratch/verify_mobile_compact_card.png', Buffer.from(mobileSS.data, 'base64'));
    console.log('Saved scratch/verify_mobile_compact_card.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

captureAllVerificationScreens();
