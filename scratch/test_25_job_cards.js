const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  console.log('=== VERIFYING 25 JOB CARDS ON VIECLAM SCREEN ===');
  const port = 9228;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,2500',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    // Wait for DOMContentLoaded & JS render
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Count job cards on page 1
    const page1CardCount = await evaluate(`
      document.querySelectorAll('#jobListingGrid .job-card').length
    `);
    console.log(`[TEST 1] Job cards rendered on Page 1: ${page1CardCount} (Expected: 25)`);
    if (page1CardCount !== 25) {
      throw new Error(`Expected 25 job cards on page 1, got ${page1CardCount}`);
    }

    // Test 2: Check jobCountText
    const jobCountText = await evaluate(`
      document.getElementById('jobCountText').textContent.trim()
    `);
    console.log(`[TEST 2] jobCountText header: "${jobCountText}" (Expected to start with 28)`);

    // Test 3: Check pagination wrapper and active button
    const paginationState = await evaluate(`
      (() => {
        const wrap = document.getElementById('paginationWrapper');
        if (!wrap) return { exists: false };
        const activeBtn = wrap.querySelector('.page-btn.active');
        const buttons = Array.from(wrap.querySelectorAll('.page-btn')).map(b => b.textContent.trim());
        return {
          exists: true,
          display: window.getComputedStyle(wrap).display,
          buttons,
          activeText: activeBtn?.textContent.trim()
        };
      })()
    `);
    console.log(`[TEST 3] Pagination state on Page 1:`, paginationState);
    if (!paginationState.exists || paginationState.activeText !== '1') {
      throw new Error('Pagination not active on page 1');
    }

    // Test 4: Navigate to Page 2
    console.log('[TEST 4] Navigating to Page 2...');
    await evaluate(`
      (() => {
        const page2Btn = document.querySelector('#paginationWrapper .page-btn[data-page="2"]');
        if (page2Btn) page2Btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const page2CardCount = await evaluate(`
      document.querySelectorAll('#jobListingGrid .job-card').length
    `);
    const page2Active = await evaluate(`
      document.querySelector('#paginationWrapper .page-btn.active')?.textContent.trim()
    `);
    console.log(`[TEST 4] Job cards on Page 2: ${page2CardCount} (Expected: 3), Active page: ${page2Active}`);
    if (page2CardCount !== 3 || page2Active !== '2') {
      throw new Error(`Page 2 failed: cards=${page2CardCount}, active=${page2Active}`);
    }

    // Test 5: Navigate back to Page 1
    console.log('[TEST 5] Navigating back to Page 1...');
    await evaluate(`
      (() => {
        const page1Btn = document.querySelector('#paginationWrapper .page-btn[data-page="1"]');
        if (page1Btn) page1Btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const backToPage1Count = await evaluate(`
      document.querySelectorAll('#jobListingGrid .job-card').length
    `);
    console.log(`[TEST 5] Job cards back on Page 1: ${backToPage1Count} (Expected: 25)`);
    if (backToPage1Count !== 25) {
      throw new Error(`Back to page 1 failed: cards=${backToPage1Count}`);
    }

    // Test 6: Capture screenshot of Page 1
    const screenshotRes = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    const buffer = Buffer.from(screenshotRes.data, 'base64');
    const shotPath = path.resolve(__dirname, 'vieclam_25_cards_page1.png');
    fs.writeFileSync(shotPath, buffer);
    console.log(`[TEST 6] Captured screenshot saved to: ${shotPath}`);

    console.log('\n>>> ALL 6 TESTS PASSED FLAWLESSLY! <<<');
    ws.close();
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    proc.kill();
  }
}

run();
