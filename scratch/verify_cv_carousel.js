const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testCvCarousel() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9355;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    // 1. Initial DOM and styles check
    const check1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('.cv-template-section');
        const viewport = section?.querySelector('.cv-template-carousel');
        const track = viewport?.querySelector('.cv-template-track');
        const cards = Array.from(track?.querySelectorAll('.cv-template-card') || []);
        const header = section?.querySelector('.section-header');
        const title = header?.querySelector('.section-title');
        const viewAll = header?.querySelector('.section-view-all');

        const trackStyle = track ? window.getComputedStyle(track) : null;
        const firstCard = cards[0];
        const firstCardRect = firstCard ? firstCard.getBoundingClientRect() : null;
        const firstCardName = firstCard?.querySelector('.cv-template-name')?.textContent?.trim();

        return {
          hasSection: !!section,
          hasViewport: !!viewport,
          hasTrack: !!track,
          cardCount: cards.length,
          titleText: title?.textContent?.trim(),
          viewAllText: viewAll?.textContent?.trim(),
          trackDisplay: trackStyle?.display,
          trackGap: trackStyle?.gap,
          firstCardWidth: firstCardRect?.width,
          firstCardName: firstCardName
        };
      })()`,
      returnByValue: true
    });
    console.log('--- Initial Check ---', check1.result.value);

    // 2. Scroll CV section into view and capture initial screenshot
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.cv-template-section').scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const clip1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const r = document.querySelector('.cv-template-section').getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height, scale: 1 };
      })()`,
      returnByValue: true
    });

    const shot1 = await send('Page.captureScreenshot', {
      clip: clip1.result.value
    });
    fs.writeFileSync('scratch/cv_carousel_initial.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/cv_carousel_initial.png');

    // 3. Wait for auto-scroll step (2.5 seconds)
    console.log('Waiting 2.6s for carousel auto-step...');
    await new Promise(r => setTimeout(r, 2600));

    const check2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.querySelector('.cv-template-section .cv-template-track');
        const cards = Array.from(track?.querySelectorAll('.cv-template-card') || []);
        const firstCardName = cards[0]?.querySelector('.cv-template-name')?.textContent?.trim();
        const lastCardName = cards[cards.length - 1]?.querySelector('.cv-template-name')?.textContent?.trim();
        return {
          firstCardName,
          lastCardName
        };
      })()`,
      returnByValue: true
    });
    console.log('--- After Auto-Step Check ---', check2.result.value);

    const shot2 = await send('Page.captureScreenshot', {
      clip: clip1.result.value
    });
    fs.writeFileSync('scratch/cv_carousel_stepped.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/cv_carousel_stepped.png');

    // 4. Test hover pause
    console.log('Hovering over section to test pause...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.cv-template-section').dispatchEvent(new MouseEvent('mouseenter'));`
    });
    await new Promise(r => setTimeout(r, 3000));

    const check3 = await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.querySelector('.cv-template-section .cv-template-track');
        const cards = Array.from(track?.querySelectorAll('.cv-template-card') || []);
        const firstCardName = cards[0]?.querySelector('.cv-template-name')?.textContent?.trim();
        return {
          firstCardName
        };
      })()`,
      returnByValue: true
    });
    console.log('--- Hover Pause Check (should match stepped check) ---', check3.result.value);

    const isPaused = check2.result.value.firstCardName === check3.result.value.firstCardName;
    console.log('Hover pause working correctly:', isPaused ? 'PASS' : 'FAIL');

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    chrome.kill();
  }
}

testCvCarousel();
