const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9493',
    '--disable-gpu',
    '--window-size=1440,2400',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9493/json/list', res => {
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

    // 1. Single card screenshot from featured section
    const cardInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const c = document.querySelector('#featuredJobsGrid .job-card');
        const r = c.getBoundingClientRect();
        return {
          x: Math.round(r.left + window.pageXOffset),
          y: Math.round(r.top + window.pageYOffset),
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      })()`
    });

    const cClip = cardInfo.result.value;
    const singleCardSS = await send('Page.captureScreenshot', {
      clip: { x: cClip.x - 6, y: cClip.y - 6, width: cClip.width + 12, height: cClip.height + 12, scale: 1 }
    });
    fs.writeFileSync('scratch/single_compact_card_result.png', Buffer.from(singleCardSS.data, 'base64'));
    console.log('Saved scratch/single_compact_card_result.png');

    // 2. Matching section screenshot
    const matchInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const sec = document.querySelector('#viec-lam-phu-hop');
        const r = sec.getBoundingClientRect();
        return {
          x: Math.round(r.left + window.pageXOffset),
          y: Math.round(r.top + window.pageYOffset),
          width: Math.round(r.width),
          height: 600
        };
      })()`
    });

    const mClip = matchInfo.result.value;
    const matchSS = await send('Page.captureScreenshot', {
      clip: { x: mClip.x, y: mClip.y, width: mClip.width, height: mClip.height, scale: 1 }
    });
    fs.writeFileSync('scratch/matching_compact_cards_result.png', Buffer.from(matchSS.data, 'base64'));
    console.log('Saved scratch/matching_compact_cards_result.png');

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

run();
