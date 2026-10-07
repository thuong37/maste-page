const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verifyRealPage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9450;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
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

    // Read real DOM values from the live page
    const cardData = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('#cong-ty-tieu-bieu .company-card')).map(card => {
          const title = card.querySelector('.company-card-title');
          const logoWrap = card.querySelector('.company-card-logo-wrap');
          const logoMark = card.querySelector('.company-card-logo-mark');
          const titleStyle = window.getComputedStyle(title);
          const logoStyle = window.getComputedStyle(logoWrap);
          const markStyle = window.getComputedStyle(logoMark);
          return {
            title: title ? title.textContent.trim() : '',
            logoWidth: logoStyle.width,
            logoHeight: logoStyle.height,
            markFontSize: markStyle.fontSize,
            titleFontSize: titleStyle.fontSize,
            cardHeight: card.offsetHeight
          };
        });
        return cards;
      })()`,
      returnByValue: true
    });

    console.log('Real DOM Company Cards (Larger Logo 108px):');
    console.log(JSON.stringify(cardData.result.value, null, 2));

    // Scroll to #cong-ty-tieu-bieu
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.createElement('style');
        s.textContent = '.mode-switcher-pill, .floating-switcher { display: none !important; }';
        document.head.appendChild(s);
        const sec = document.querySelector('#cong-ty-tieu-bieu');
        window.scrollTo(0, sec.offsetTop - 120);
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    // Screenshot Desktop Slide 1
    const shotSlide1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'actual_108px_slide1.png'), Buffer.from(shotSlide1.data, 'base64'));

    // Move to next cards to see MB Bank
    await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('.companies-carousel-next');
        if (nextBtn) {
          nextBtn.click();
          setTimeout(() => nextBtn.click(), 400);
          setTimeout(() => nextBtn.click(), 800);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1400));

    // Screenshot Desktop Slide 2
    const shotSlide2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'actual_108px_slide2.png'), Buffer.from(shotSlide2.data, 'base64'));

    // Test mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    // Scroll into view on mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#cong-ty-tieu-bieu');
        window.scrollTo(0, sec.offsetTop - 80);
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'actual_108px_mobile.png'), Buffer.from(shotMobile.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyRealPage().catch(console.error);
