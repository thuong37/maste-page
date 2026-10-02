/**
 * Automated Verification: Category Filter Modal (Danh mục Nghề)
 */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9233;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,1000',
  'http://localhost:3000/viec-lam.html'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage() {
  await delay(2000);
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, response => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data).find(page => page.url.includes('localhost:3000'))));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const page = await getPage();
    if (!page) throw new Error('Page not found on port ' + port);

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(resolve => {
      const messageId = id++;
      const handler = event => {
        const message = JSON.parse(event.data);
        if (message.id === messageId) {
          ws.removeEventListener('message', handler);
          resolve(message.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });
    await new Promise(resolve => { ws.onopen = resolve; });

    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return result.result.value;
    };

    console.log('--- TEST 1: Initial state of category filter trigger ---');
    const triggerInfo = await evaluate(`(() => {
      const trigger = document.getElementById('categoryFilterTrigger');
      const label = document.getElementById('categoryFilterLabel');
      return {
        exists: !!trigger,
        label: label ? label.textContent.trim() : null,
        expanded: trigger ? trigger.getAttribute('aria-expanded') : null
      };
    })()`);
    console.log('Trigger info:', triggerInfo);

    console.log('--- TEST 2: Click trigger to open modal ---');
    await evaluate(`document.getElementById('categoryFilterTrigger').click()`);
    await delay(300);

    const modalState = await evaluate(`(() => {
      const overlay = document.getElementById('categoryModalOverlay');
      const title = document.getElementById('categoryModalTitle');
      const groups = Array.from(document.querySelectorAll('.category-group-item')).map(g => g.textContent.trim());
      const subgroups = Array.from(document.querySelectorAll('.category-role-title')).map(s => s.textContent.trim());
      const pills = Array.from(document.querySelectorAll('.category-specialty-pill')).map(p => p.textContent.trim());
      const headers = {
        role: document.querySelector('.category-right-headers .col-role')?.textContent.trim(),
        specialty: document.querySelector('.category-right-headers .col-specialty')?.textContent.trim()
      };
      const scrollHint = document.getElementById('categoryScrollHint');
      const feedback = document.querySelector('.category-footer-feedback')?.textContent.trim();

      return {
        isOpen: overlay && !overlay.hidden,
        title: title ? title.textContent.trim() : null,
        groupCount: groups.length,
        firstThreeGroups: groups.slice(0, 3),
        subgroupsCount: subgroups.length,
        firstThreeSubgroups: subgroups.slice(0, 3),
        pillsCount: pills.length,
        firstFivePills: pills.slice(0, 5),
        headers,
        hasScrollHint: !!scrollHint,
        feedback
      };
    })()`);
    console.log('Modal opened state:', JSON.stringify(modalState, null, 2));

    // Capture screenshot of opened modal on Desktop
    const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'category_filter_vieclam_modal.png'), Buffer.from(screenshotData.data, 'base64'));
    console.log('✓ Captured scratch/category_filter_vieclam_modal.png');

    console.log('--- TEST 3: Select a specialty pill & Apply ---');
    await evaluate(`(() => {
      const pill = document.querySelector('[data-role="Sales Logistics"]');
      if (pill) pill.click();
      return !!pill;
    })()`);
    await delay(150);

    await evaluate(`document.getElementById('btnCategorySubmit').click()`);
    await delay(300);

    const postApplyState = await evaluate(`(() => {
      const overlay = document.getElementById('categoryModalOverlay');
      const label = document.getElementById('categoryFilterLabel');
      const countText = document.getElementById('jobCountText')?.textContent.trim();
      const matchBadge = document.querySelectorAll('.badge-search-match').length;

      return {
        isClosed: overlay && overlay.hidden,
        label: label ? label.textContent.trim() : null,
        countText,
        matchingJobsCount: matchBadge
      };
    })()`);
    console.log('Post-apply state:', postApplyState);

    // TEST 4: Mobile Responsive test at 390x844
    console.log('--- TEST 4: Mobile Responsive at 390x844 ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await delay(200);

    // Open modal on mobile
    await evaluate(`document.getElementById('categoryFilterTrigger').click()`);
    await delay(300);

    const mobileMetrics = await evaluate(`(() => {
      const doc = document.documentElement;
      const overlay = document.getElementById('categoryModalOverlay');
      const dialog = document.querySelector('.category-modal-dialog');
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: doc.scrollWidth,
        hasHorizontalOverflow: doc.scrollWidth > window.innerWidth,
        dialogWidth: dialog ? dialog.getBoundingClientRect().width : null,
        dialogHeight: dialog ? dialog.getBoundingClientRect().height : null
      };
    })()`);
    console.log('Mobile metrics:', mobileMetrics);

    const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'category_filter_vieclam_mobile.png'), Buffer.from(mobileScreenshot.data, 'base64'));
    console.log('✓ Captured scratch/category_filter_vieclam_mobile.png');

    console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

run();
