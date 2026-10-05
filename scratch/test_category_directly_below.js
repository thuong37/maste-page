const { spawn } = require('child_process');
const fs = require('fs');

async function testCategoryDirectlyBelow() {
  console.log('--- Testing: Category Modal Directly Below Search Bar ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9234/json');
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

    // 1. Initial State Check & Click Trigger
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

    const res = (clickRes.result && clickRes.result.value) || clickRes.value || {};
    console.log('Test 1 (Initial Open) Result:', JSON.stringify(res, null, 2));

    const shot1 = await send('Page.captureScreenshot');
    fs.writeFileSync('scratch/verify_category_directly_below_search.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshot: scratch/verify_category_directly_below_search.png');

    // Kiểm tra tiêu chí: distanceBelow phải khoảng 6-12px (chính xác ngay dưới thanh tìm kiếm)
    if (res.distanceBelow !== null && Math.abs(res.distanceBelow - 8) <= 4 && res.footerVisible && res.submitVisible) {
      console.log('✓ PASS: Modal dialog is positioned DIRECTLY BELOW search bar (gap ~8px), footer is 100% visible!');
    } else {
      console.error('✗ FAIL: Modal dialog is NOT positioned directly below search bar!');
    }

    // 2. Test Toggle Close
    console.log('\n--- Testing: Click trigger again to toggle close ---');
    const toggleRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const trigger = document.getElementById('categoryFilterTrigger');
        if (trigger) trigger.click();
        const overlay = document.getElementById('categoryModalOverlay');
        return { isHidden: overlay ? overlay.hidden : true };
      })()`,
      returnByValue: true
    });
    console.log('Toggle Close Result:', JSON.stringify(toggleRes.result?.value, null, 2));

    ws.close();
  } finally {
    proc.kill();
  }
}

testCategoryDirectlyBelow().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
