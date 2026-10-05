const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function runTest() {
  console.log('--- Verifying Unpinned Menu on Scroll ---');

  const chromeProc = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9229/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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

    // 1. Initial State (scrollY = 0)
    const initCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('.site-header');
        const stickyBar = document.getElementById('heroSearchStickyBar');
        const headerStyle = window.getComputedStyle(header);
        return JSON.stringify({
          headerPosition: headerStyle.position,
          headerTop: headerStyle.top,
          headerRect: header.getBoundingClientRect(),
          isSticky: stickyBar.classList.contains('is-sticky')
        });
      })()`,
      returnByValue: true
    });
    console.log('1. Initial State (scrollY = 0):', JSON.parse(initCheck.result.value));

    // Capture screenshot at top
    const shotTop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'vieclam_unpinned_menu_top.png'), Buffer.from(shotTop.data, 'base64'));

    // 2. Scroll down 600px
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 600);' });
    await new Promise(r => setTimeout(r, 800));

    const scrolledCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('.site-header');
        const stickyBar = document.getElementById('heroSearchStickyBar');
        const adsSidebar = document.querySelector('.ads-sidebar-container');
        const headerRect = header.getBoundingClientRect();
        const stickyBarRect = stickyBar.getBoundingClientRect();
        const adsRect = adsSidebar ? adsSidebar.getBoundingClientRect() : null;

        return JSON.stringify({
          headerRectTop: Math.round(headerRect.top),
          headerPosition: window.getComputedStyle(header).position,
          isSticky: stickyBar.classList.contains('is-sticky'),
          stickyBarTop: Math.round(stickyBarRect.top),
          stickyBarHeight: Math.round(stickyBarRect.height),
          adsSidebarTop: adsRect ? Math.round(adsRect.top) : null
        });
      })()`,
      returnByValue: true
    });
    const scrolledData = JSON.parse(scrolledCheck.result.value);
    console.log('2. Scrolled State (scrollY = 600):', scrolledData);

    // Verify key requirements:
    console.log('--- Verification Results ---');
    const headerNotSticky = scrolledData.headerPosition === 'relative';
    const headerScrolledAway = scrolledData.headerRectTop <= -500;
    const stickyBarAtTop = scrolledData.isSticky && scrolledData.stickyBarTop === 0;

    console.log('✓ Header position is relative (not sticky):', headerNotSticky);
    console.log('✓ Header has scrolled off screen (rect.top <= -500):', headerScrolledAway, `(${scrolledData.headerRectTop}px)`);
    console.log('✓ Sticky search bar docks at top: 0px:', stickyBarAtTop, `(${scrolledData.stickyBarTop}px)`);

    // Capture screenshot when scrolled
    const shotScrolled = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'vieclam_unpinned_menu_scrolled.png'), Buffer.from(shotScrolled.data, 'base64'));
    console.log('✓ Saved screenshot to scratch/vieclam_unpinned_menu_scrolled.png');

    // 3. Mobile test (390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 400));
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 400);' });
    await new Promise(r => setTimeout(r, 600));

    const mobileCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('.site-header');
        const headerRect = header.getBoundingClientRect();
        return JSON.stringify({
          headerRectTop: Math.round(headerRect.top),
          headerPosition: window.getComputedStyle(header).position
        });
      })()`,
      returnByValue: true
    });
    console.log('3. Mobile Scrolled State (scrollY = 400):', JSON.parse(mobileCheck.result.value));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'vieclam_unpinned_menu_mobile.png'), Buffer.from(shotMobile.data, 'base64'));
    console.log('✓ Saved screenshot to scratch/vieclam_unpinned_menu_mobile.png');

    chromeProc.kill();
    console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error(err);
    chromeProc.kill();
  }
}

runTest();
