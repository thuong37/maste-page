const { spawn, execFileSync } = require('child_process');
const http = require('http');
const path = require('path');

async function testStickyScroll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9338;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/chi-tiet-viec-lam.html'
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

    const target = list.find(t => t.type === 'page' && t.url.includes('chi-tiet')) || list[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);

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

    // Scroll page down by 300px
    const res = await send('Runtime.evaluate', {
      expression: `(async function() {
        window.scrollTo(0, 350);
        // wait for requestAnimationFrame
        await new Promise(r => setTimeout(r, 300));
        
        const stickyBar = document.getElementById('heroSearchStickyBar');
        const searchBox = document.getElementById('jobSearchForm');
        const filterBar = document.getElementById('chiTietTopFilterBar');
        const siteHeader = document.querySelector('.site-header');

        const sbRect = stickyBar ? stickyBar.getBoundingClientRect() : null;
        const comp = stickyBar ? window.getComputedStyle(stickyBar) : null;
        const shRect = siteHeader ? siteHeader.getBoundingClientRect() : null;

        return {
          scrollY: window.scrollY,
          isSticky: stickyBar ? stickyBar.classList.contains('is-sticky') : false,
          stickyBarTop: sbRect ? sbRect.top : null,
          stickyBarHeight: sbRect ? sbRect.height : null,
          computedTop: comp ? comp.top : null,
          stickySearchTopVar: comp ? comp.getPropertyValue('--sticky-search-top') : null,
          siteHeaderTop: shRect ? shRect.top : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Scroll sticky evaluation:', res.result ? res.result.value : res);

    // Take screenshot of scrolled state
    const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    const outImg = path.resolve(__dirname, 'chi_tiet_scrolled_sticky_top0.png');
    fs.writeFileSync(outImg, Buffer.from(screenshotRes.data, 'base64'));
    console.log('Saved scrolled screenshot to:', outImg);

    ws.close();
  } finally {
    chrome.kill();
  }
}

testStickyScroll().catch(console.error);
