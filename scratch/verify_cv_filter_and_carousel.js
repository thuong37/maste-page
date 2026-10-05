const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testCvFilterAndCarousel() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9366;
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

    // 1. Check CV filters exist and "Tất cả" is active
    const checkFilters = await send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('.cv-template-section');
        const filtersContainer = section?.querySelector('.cv-style-filters');
        const filters = Array.from(filtersContainer?.querySelectorAll('.cv-style-filter') || []);
        const activeFilter = filters.find(f => f.classList.contains('is-active'));
        const track = section?.querySelector('.cv-template-track');
        const cards = Array.from(track?.querySelectorAll('.cv-template-card') || []);

        return {
          filtersCount: filters.length,
          filterLabels: filters.map(f => f.textContent.trim()),
          activeLabel: activeFilter?.textContent.trim(),
          activeStyle: activeFilter?.getAttribute('data-cv-style'),
          totalCardsInitial: cards.length,
          initialCardNames: cards.map(c => c.querySelector('.cv-template-name')?.textContent.trim())
        };
      })()`,
      returnByValue: true
    });

    console.log('--- 1. FILTER PILLS INITIAL CHECK ---');
    console.log(JSON.stringify(checkFilters.result?.value, null, 2));

    // 2. Click on "Đơn giản" (data-cv-style="simple")
    const clickSimple = await send('Runtime.evaluate', {
      expression: `(() => {
        const simpleBtn = document.querySelector('.cv-style-filter[data-cv-style="simple"]');
        if (!simpleBtn) return { error: 'Not found simple button' };
        simpleBtn.click();
        const section = document.querySelector('.cv-template-section');
        const activeFilter = section?.querySelector('.cv-style-filter.is-active');
        const track = section?.querySelector('.cv-template-track');
        const cards = Array.from(track?.querySelectorAll('.cv-template-card') || []);
        return {
          clicked: true,
          activeLabel: activeFilter?.textContent.trim(),
          activeStyle: activeFilter?.getAttribute('data-cv-style'),
          cardCountAfterFilter: cards.length,
          filteredCardNames: cards.map(c => c.querySelector('.cv-template-name')?.textContent.trim()),
          filteredCardStyles: cards.map(c => c.getAttribute('data-cv-styles'))
        };
      })()`,
      returnByValue: true
    });

    console.log('--- 2. CLICK FILTER: "Đơn giản" ---');
    console.log(JSON.stringify(clickSimple.result?.value, null, 2));

    // 3. Scroll to section and take screenshot
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.cv-template-section').scrollIntoView({ block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const secClip = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.cv-template-section');
        const rect = sec.getBoundingClientRect();
        return {
          x: Math.round(rect.left + window.scrollX),
          y: Math.round(rect.top + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })()`,
      returnByValue: true
    });

    const clipVal = secClip.result?.value || { x: 0, y: 0, width: 1440, height: 600 };
    const shot1 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: clipVal.x,
        y: clipVal.y,
        width: clipVal.width,
        height: Math.min(clipVal.height + 40, 560),
        scale: 1
      }
    });

    const outPath1 = path.join(__dirname, 'cv_filter_simple_active.png');
    fs.writeFileSync(outPath1, Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshot:', outPath1);

    // 4. Test auto-step when filter is active (wait 2.8s)
    const initialFirstCard = await send('Runtime.evaluate', {
      expression: `document.querySelector('.cv-template-track').firstElementChild.querySelector('.cv-template-name').textContent.trim()`,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 2800));

    const steppedFirstCard = await send('Runtime.evaluate', {
      expression: `document.querySelector('.cv-template-track').firstElementChild.querySelector('.cv-template-name').textContent.trim()`,
      returnByValue: true
    });

    console.log('--- 3. CAROUSEL AUTO-STEP WHILE FILTERED ---');
    console.log('Initial first card:', initialFirstCard.result?.value);
    console.log('Stepped first card:', steppedFirstCard.result?.value);
    console.log('Carousel shifted successfully?', initialFirstCard.result?.value !== steppedFirstCard.result?.value);

    // 5. Click back to "Tất cả"
    const clickAll = await send('Runtime.evaluate', {
      expression: `(() => {
        const allBtn = document.querySelector('.cv-style-filter[data-cv-style="all"]');
        allBtn.click();
        const track = document.querySelector('.cv-template-track');
        const cards = Array.from(track.querySelectorAll('.cv-template-card'));
        return {
          activeLabel: document.querySelector('.cv-style-filter.is-active').textContent.trim(),
          cardCount: cards.length
        };
      })()`,
      returnByValue: true
    });
    console.log('--- 4. CLICK BACK TO "Tất cả" ---');
    console.log(JSON.stringify(clickAll.result?.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

testCvFilterAndCarousel();
