const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function captureMatchingAndHover() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9490',
    '--disable-gpu',
    '--window-size=1440,1200',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9490/json/list', res => {
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

    // 1. Scroll into view and capture matching jobs
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-phu-hop');
        if (sec) sec.scrollIntoView({ block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const matchingClip = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-phu-hop');
        const r = sec.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 650) };
      })()`
    });

    if (matchingClip.result.value) {
      const clip = matchingClip.result.value;
      const ss = await send('Page.captureScreenshot', {
        clip: { x: Math.max(0, clip.x), y: Math.max(0, clip.y), width: clip.width, height: clip.height, scale: 1 }
      });
      fs.writeFileSync('scratch/verify_matching_jobs_scrolled.png', Buffer.from(ss.data, 'base64'));
      console.log('Saved scratch/verify_matching_jobs_scrolled.png');
    }

    // 2. Measure matching jobs dimensions
    const matchingMeasurements = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('#viec-lam-phu-hop .job-card'));
        return cards.slice(0, 3).map((card, idx) => {
          const r = card.getBoundingClientRect();
          const logo = card.querySelector('.job-logo-wrapper')?.getBoundingClientRect();
          const pills = card.querySelector('.job-pills')?.getBoundingClientRect();
          return {
            idx: idx + 1,
            cardWidth: Math.round(r.width),
            cardHeight: Math.round(r.height),
            logoW: logo ? Math.round(logo.width) : 0,
            logoH: logo ? Math.round(logo.height) : 0,
            pillsH: pills ? Math.round(pills.height) : 0
          };
        });
      })()`
    });
    console.log('Matching jobs measurements:', matchingMeasurements.result.value);

    // 3. Scroll to featured section and hover card 1
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-noi-bat');
        if (sec) sec.scrollIntoView({ block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const hoverCoords = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const card = document.querySelector('#featuredJobsGrid .job-card');
        const r = card.getBoundingClientRect();
        return {
          x: Math.round(r.x + r.width / 2),
          y: Math.round(r.y + r.height / 2),
          clip: { x: r.x - 10, y: r.y - 10, width: r.width + 20, height: r.height + 20 }
        };
      })()`
    });

    if (hoverCoords.result.value) {
      const { x, y, clip } = hoverCoords.result.value;
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await new Promise(r => setTimeout(r, 400));

      const ss = await send('Page.captureScreenshot', {
        clip: { x: Math.max(0, clip.x), y: Math.max(0, clip.y), width: clip.width, height: clip.height, scale: 1 }
      });
      fs.writeFileSync('scratch/verify_single_card_hovered.png', Buffer.from(ss.data, 'base64'));
      console.log('Saved scratch/verify_single_card_hovered.png');
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

captureMatchingAndHover();
