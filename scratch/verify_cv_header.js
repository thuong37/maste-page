const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verifyCvHeader() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9399;
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

    // 1. Check title, view all, and element coordinates on Desktop 1440
    const checkDesktop = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const header = sec?.querySelector('.cv-section-header');
        const title = header?.querySelector('.section-title');
        const viewAll = header?.querySelector('.section-view-all');
        const filters = header?.querySelector('.cv-style-filters');
        const filterBtns = Array.from(filters?.querySelectorAll('.cv-style-filter') || []);

        const titleRect = title?.getBoundingClientRect();
        const filtersRect = filters?.getBoundingClientRect();
        const viewAllRect = viewAll?.getBoundingClientRect();

        return {
          titleText: title?.textContent.trim(),
          viewAllText: viewAll?.querySelector('span')?.textContent.trim() || viewAll?.textContent.trim(),
          isTitleMatches: title?.textContent.trim() === 'Khám phá CV',
          isViewAllMatches: (viewAll?.querySelector('span')?.textContent.trim() || viewAll?.textContent.trim()) === 'Xem tất cả',
          filterCount: filterBtns.length,
          titleRect: titleRect ? { top: Math.round(titleRect.top), bottom: Math.round(titleRect.bottom), height: Math.round(titleRect.height) } : null,
          filtersRect: filtersRect ? { top: Math.round(filtersRect.top), bottom: Math.round(filtersRect.bottom), height: Math.round(filtersRect.height) } : null,
          viewAllRect: viewAllRect ? { top: Math.round(viewAllRect.top), bottom: Math.round(viewAllRect.bottom), height: Math.round(viewAllRect.height) } : null,
          isSameLine: filtersRect && titleRect ? Math.abs(filtersRect.top - titleRect.top) < 15 : false
        };
      })()`,
      returnByValue: true
    });

    console.log('--- 1. DESKTOP HEADER & FILTERS ALIGNMENT CHECK ---');
    console.log(JSON.stringify(checkDesktop.result?.value, null, 2));

    // 2. Scroll and capture Desktop Screenshot
    const rect = await send('Runtime.evaluate', {
      expression: `document.querySelector(".cv-template-section").getBoundingClientRect().top + window.scrollY`,
      returnByValue: true
    });
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${rect.result.value - 140}, behavior: "instant" });`
    });
    await new Promise(r => setTimeout(r, 600));

    const shotDesktop = await send('Page.captureScreenshot', {});
    fs.writeFileSync(path.join(__dirname, 'cv_header_inline_filters.png'), Buffer.from(shotDesktop.data, 'base64'));
    console.log('Saved screenshot: scratch/cv_header_inline_filters.png');

    // 3. Test Mobile responsive (390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileRect = await send('Runtime.evaluate', {
      expression: `document.querySelector(".cv-template-section").getBoundingClientRect().top + window.scrollY`,
      returnByValue: true
    });
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${mobileRect.result.value - 80}, behavior: "instant" });`
    });
    await new Promise(r => setTimeout(r, 600));

    const checkMobile = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const header = sec?.querySelector('.cv-section-header');
        const title = header?.querySelector('.section-title');
        const viewAll = header?.querySelector('.section-view-all');
        const filters = header?.querySelector('.cv-style-filters');

        return {
          titleText: title?.textContent.trim(),
          viewAllText: viewAll?.querySelector('span')?.textContent.trim() || viewAll?.textContent.trim(),
          filtersDisplay: window.getComputedStyle(filters).display,
          filtersWidth: filters?.scrollWidth,
          headerHeight: header?.offsetHeight
        };
      })()`,
      returnByValue: true
    });

    console.log('--- 2. MOBILE RESPONSIVE CHECK ---');
    console.log(JSON.stringify(checkMobile.result?.value, null, 2));

    const shotMobile = await send('Page.captureScreenshot', {});
    fs.writeFileSync(path.join(__dirname, 'cv_header_mobile.png'), Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved screenshot: scratch/cv_header_mobile.png');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

verifyCvHeader();
