const { spawn } = require('child_process');
const fs = require('fs');

async function testStickyCategory() {
  console.log('--- Testing: Sticky Mode Category Modal Directly Below ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9236',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9236/json');
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

    await send('Page.enable');
    await send('DOM.enable');

    // Cuộn xuống 500px để thanh tìm kiếm chuyển sang chế độ sticky
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 500, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 400));

    // Click nút trigger Danh mục Nghề khi đang sticky
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const trigger = document.getElementById('categoryFilterTrigger');
        if (trigger) trigger.click();

        const searchBox = document.getElementById('jobSearchForm');
        const dialog = document.querySelector('.category-modal-dialog');
        const footer = document.querySelector('.category-modal-footer');
        const submitBtn = document.querySelector('.btn-category-submit');

        const boxRect = searchBox ? searchBox.getBoundingClientRect() : null;
        const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        const submitRect = submitBtn ? submitBtn.getBoundingClientRect() : null;

        const distanceBelow = (boxRect && dialogRect) ? Math.round(dialogRect.top - boxRect.bottom) : null;

        return {
          boxBottom: boxRect ? Math.round(boxRect.bottom) : null,
          dialogTop: dialogRect ? Math.round(dialogRect.top) : null,
          dialogBottom: dialogRect ? Math.round(dialogRect.bottom) : null,
          dialogHeight: dialogRect ? Math.round(dialogRect.height) : null,
          distanceBelow: distanceBelow,
          footerVisible: footerRect && footerRect.bottom <= window.innerHeight && footerRect.top >= 0,
          submitVisible: submitRect && submitRect.bottom <= window.innerHeight && submitRect.top >= 0,
          viewportHeight: window.innerHeight
        };
      })()`,
      returnByValue: true
    });

    const res = clickRes.result?.value || {};
    console.log('Sticky Open Result:', JSON.stringify(res, null, 2));

    const shot = await send('Page.captureScreenshot');
    fs.writeFileSync('scratch/verify_category_sticky_below_search.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot: scratch/verify_category_sticky_below_search.png');

    if (res.distanceBelow !== null && Math.abs(res.distanceBelow - 8) <= 4 && res.footerVisible && res.submitVisible) {
      console.log('✓ PASS: Sticky mode Category Modal is positioned DIRECTLY BELOW sticky search bar!');
    } else {
      console.error('✗ FAIL: Sticky mode positioning mismatch!');
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

testStickyCategory().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
