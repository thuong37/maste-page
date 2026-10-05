const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9320;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
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

    await send('Runtime.enable');
    await send('Page.enable');
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Click bookmark button
    const testBookmark = await send('Runtime.evaluate', {
      expression: `(() => {
        const firstBtn = document.querySelector('#jobListingGrid .job-card .btn-card-bookmark');
        if (!firstBtn) return 'btn not found';
        const wasSaved = firstBtn.classList.contains('saved');
        firstBtn.click();
        const isSavedNow = firstBtn.classList.contains('saved');
        return { wasSaved, isSavedNow };
      })()`,
      returnByValue: true
    });
    console.log('Bookmark test result:', testBookmark.result.value);

    // Test 2: Click Apply button
    const testApply = await send('Runtime.evaluate', {
      expression: `(() => {
        const applyBtn = document.querySelector('#jobListingGrid .job-card .btn-card-apply');
        if (!applyBtn) return 'apply btn not found';
        applyBtn.click();
        const toast = document.querySelector('.easycv-toast, .toast-notification, [class*="toast"]');
        return { clicked: true, toastText: toast ? toast.textContent : null };
      })()`,
      returnByValue: true
    });
    console.log('Apply test result:', testApply.result.value);

    // Test 3: Click Hide button on second card
    const testHide = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('#jobListingGrid .job-card');
        if (cards.length < 2) return 'cards < 2';
        const card2 = cards[1];
        const hideBtn = card2.querySelector('.btn-card-hide');
        if (!hideBtn) return 'hide btn not found';
        hideBtn.click();
        return { clicked: true };
      })()`,
      returnByValue: true
    });
    console.log('Hide test result:', testHide.result.value);

    await new Promise(r => setTimeout(r, 400));
    const card2Hidden = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('#jobListingGrid .job-card');
        return { card2Display: cards[1]?.style.display };
      })()`,
      returnByValue: true
    });
    console.log('Card 2 hidden status:', card2Hidden.result.value);

    // Test 4: Click Quick View button
    const testQuickView = await send('Runtime.evaluate', {
      expression: `(() => {
        const quickViewBtn = document.querySelector('#jobListingGrid .job-card .btn-quick-view');
        if (!quickViewBtn) return 'quick view btn not found';
        quickViewBtn.click();
        const splitContainer = document.getElementById('jobSplitContainer');
        return {
          clicked: true,
          splitVisible: splitContainer ? getComputedStyle(splitContainer).display : 'none'
        };
      })()`,
      returnByValue: true
    });
    console.log('Quick View test result:', testQuickView.result.value);

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
  }
}

run();
