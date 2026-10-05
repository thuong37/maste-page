const { spawn } = require('child_process');
const fs = require('fs');

async function testCategoryTwoThirdsHeight() {
  console.log('--- Testing: Category Modal 2/3 Height Verification ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9235/json');
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

    // 1. Click Trigger and Measure
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const trigger = document.getElementById('categoryFilterTrigger');
        if (trigger) trigger.click();

        const searchBox = document.getElementById('jobSearchForm');
        const dialog = document.querySelector('.category-modal-dialog');
        const footer = document.querySelector('.category-modal-footer');
        const submitBtn = document.querySelector('.btn-category-submit');
        const body = document.querySelector('.category-modal-body');
        const groupList = document.getElementById('categoryGroupList');
        const subgroupList = document.getElementById('categorySubgroupList');

        const boxRect = searchBox ? searchBox.getBoundingClientRect() : null;
        const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        const submitRect = submitBtn ? submitBtn.getBoundingClientRect() : null;
        const bodyRect = body ? body.getBoundingClientRect() : null;

        const distanceBelow = (boxRect && dialogRect) ? Math.round(dialogRect.top - boxRect.bottom) : null;

        return {
          viewportHeight: window.innerHeight,
          boxRect: boxRect ? { top: Math.round(boxRect.top), bottom: Math.round(boxRect.bottom) } : null,
          dialogRect: dialogRect ? {
            top: Math.round(dialogRect.top),
            bottom: Math.round(dialogRect.bottom),
            height: Math.round(dialogRect.height),
            width: Math.round(dialogRect.width)
          } : null,
          distanceBelow,
          bodyHeight: bodyRect ? Math.round(bodyRect.height) : null,
          footerVisible: !!(footerRect && footerRect.bottom <= window.innerHeight),
          submitVisible: !!(submitRect && submitRect.bottom <= window.innerHeight),
          groupListScrollable: groupList ? groupList.scrollHeight > groupList.clientHeight : null,
          subgroupListScrollable: subgroupList ? subgroupList.scrollHeight > subgroupList.clientHeight : null
        };
      })()`,
      returnByValue: true
    });

    console.log('Default State Measurement (2/3 Height):', JSON.stringify(clickRes.value, null, 2));

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_category_2_thirds_height.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot: scratch/verify_category_2_thirds_height.png');

    // 2. Also test Sticky State
    await send('Runtime.evaluate', {
      expression: 'window.scrollTo(0, 500);'
    });
    await new Promise(r => setTimeout(r, 400));

    const stickyRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const searchBox = document.getElementById('jobSearchForm');
        const dialog = document.querySelector('.category-modal-dialog');
        const boxRect = searchBox ? searchBox.getBoundingClientRect() : null;
        const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
        return {
          boxRect: boxRect ? { top: Math.round(boxRect.top), bottom: Math.round(boxRect.bottom) } : null,
          dialogRect: dialogRect ? {
            top: Math.round(dialogRect.top),
            bottom: Math.round(dialogRect.bottom),
            height: Math.round(dialogRect.height)
          } : null,
          distanceBelow: (boxRect && dialogRect) ? Math.round(dialogRect.top - boxRect.bottom) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Sticky State Measurement (2/3 Height):', JSON.stringify(stickyRes.value, null, 2));

    const stickyShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_category_sticky_2_thirds_height.png', Buffer.from(stickyShot.data, 'base64'));
    console.log('Saved sticky screenshot: scratch/verify_category_sticky_2_thirds_height.png');

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    proc.kill();
  }
}

testCategoryTwoThirdsHeight();
