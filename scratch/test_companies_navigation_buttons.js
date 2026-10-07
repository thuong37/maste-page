const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function testCompaniesNavigation() {
  console.log('=== VERIFYING FEATURED COMPANIES CAROUSEL NAVIGATION CONTROLS ===');
  const port = 9235;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1200',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('index.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Scroll to section
    await send('Runtime.evaluate', {
      expression: `
        const section = document.getElementById('cong-ty-tieu-bieu');
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify elements and styles
    const headerInfoRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.getElementById('cong-ty-tieu-bieu');
          const header = section?.querySelector('.top-companies-header');
          const viewAll = header?.querySelector('.section-view-all');
          const prevBtn = header?.querySelector('.companies-carousel-prev');
          const nextBtn = header?.querySelector('.companies-carousel-next');
          const track = section?.querySelector('#companies-track');

          const prevStyle = prevBtn ? window.getComputedStyle(prevBtn) : null;
          const nextStyle = nextBtn ? window.getComputedStyle(nextBtn) : null;
          const viewAllStyle = viewAll ? window.getComputedStyle(viewAll) : null;

          const firstCardTitle = track?.firstElementChild?.querySelector('.company-card-title')?.textContent?.trim();

          return JSON.stringify({
            hasSection: !!section,
            hasHeader: !!header,
            viewAllText: viewAll?.textContent?.trim(),
            viewAllColor: viewAllStyle?.color,
            hasPrev: !!prevBtn,
            hasNext: !!nextBtn,
            prevWidth: prevStyle?.width,
            prevHeight: prevStyle?.height,
            prevBorderRadius: prevStyle?.borderRadius,
            nextWidth: nextStyle?.width,
            nextHeight: nextStyle?.height,
            nextBorderRadius: nextStyle?.borderRadius,
            initialFirstCard: firstCardTitle,
            cardCount: track?.children.length
          });
        })()
      `,
      returnByValue: true
    });

    const parseEval = (res) => {
      const val = res?.result?.value !== undefined ? res.result.value : res?.value;
      return typeof val === 'string' ? JSON.parse(val) : val;
    };

    const headerInfo = parseEval(headerInfoRes);
    console.log('1. Header structure & styles:', JSON.stringify(headerInfo, null, 2));

    if (!headerInfo.hasPrev || !headerInfo.hasNext) {
      throw new Error('Previous or Next button missing!');
    }
    if (headerInfo.viewAllText !== 'Xem tất cả') {
      throw new Error(`Expected 'Xem tất cả', got '${headerInfo.viewAllText}'`);
    }

    // Capture screenshot of the section
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'companies_carousel_desktop.png'), Buffer.from(ss1.data, 'base64'));
    console.log('Saved screenshot: scratch/companies_carousel_desktop.png');

    // Test Click Next (Simulate user hover first, which pauses auto-scroll)
    console.log('\n2. Testing Click Next...');
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('cong-ty-tieu-bieu').dispatchEvent(new MouseEvent('mouseenter'));
        document.querySelector('.companies-carousel-next').click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const afterNextRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const track = document.getElementById('companies-track');
          const firstCardTitle = track?.firstElementChild?.querySelector('.company-card-title')?.textContent?.trim();
          const status = document.querySelector('.companies-carousel-status')?.textContent;
          return JSON.stringify({ firstCardTitle, status });
        })()
      `,
      returnByValue: true
    });
    const afterNext = parseEval(afterNextRes);
    console.log('After Next click - First card:', afterNext.firstCardTitle);
    console.log('Live status announcement:', afterNext.status);

    if (afterNext.firstCardTitle === headerInfo.initialFirstCard) {
      throw new Error('Next button click did not advance the carousel!');
    }

    // Test Click Prev
    console.log('\n3. Testing Click Prev...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.companies-carousel-prev').click();`
    });
    await new Promise(r => setTimeout(r, 800));

    const afterPrevRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const track = document.getElementById('companies-track');
          const firstCardTitle = track?.firstElementChild?.querySelector('.company-card-title')?.textContent?.trim();
          const status = document.querySelector('.companies-carousel-status')?.textContent;
          return JSON.stringify({ firstCardTitle, status });
        })()
      `,
      returnByValue: true
    });
    const afterPrev = parseEval(afterPrevRes);
    console.log('After Prev click - First card:', afterPrev.firstCardTitle);
    console.log('Live status announcement:', afterPrev.status);

    if (afterPrev.firstCardTitle !== headerInfo.initialFirstCard) {
      throw new Error('Prev button click did not restore original card!');
    }

    // Test Mobile viewport (375px)
    console.log('\n4. Testing Mobile Viewport (375px)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `
        const section = document.getElementById('cong-ty-tieu-bieu');
        if (section) window.scrollTo(0, section.offsetTop - 20);
      `
    });
    await new Promise(r => setTimeout(r, 400));

    const mobileCheckRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('.top-companies-header');
          const headerRect = header?.getBoundingClientRect();
          const bodyWidth = document.body.clientWidth;
          const docOverflow = document.documentElement.scrollWidth > window.innerWidth;
          return JSON.stringify({
            headerWidth: headerRect?.width,
            bodyWidth,
            docOverflow
          });
        })()
      `,
      returnByValue: true
    });
    const mobileCheck = parseEval(mobileCheckRes);
    console.log('Mobile layout check:', JSON.stringify(mobileCheck, null, 2));

    const clipRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('.top-companies-header');
          const r = header.getBoundingClientRect();
          return JSON.stringify({ x: Math.max(0, r.left), y: Math.max(0, r.top), width: r.width, height: r.height + 200, scale: 1 });
        })()
      `,
      returnByValue: true
    });
    const clip = parseEval(clipRes);
    console.log('Mobile clip rect:', clip);
    const ssMobile = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    fs.writeFileSync(path.join(__dirname, 'companies_carousel_mobile.png'), Buffer.from(ssMobile.data, 'base64'));
    console.log('Saved screenshot: scratch/companies_carousel_mobile.png');

    console.log('\nALL TESTS PASSED 100%! 🎉');
    ws.close();
  } finally {
    proc.kill();
  }
}

testCompaniesNavigation().catch(err => {
  console.error('Test FAILED:', err);
  process.exit(1);
});
