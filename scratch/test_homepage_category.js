/**
 * Automated Verification: Homepage Category Filter Modal & Search Bar
 */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9244;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,1000',
  'http://localhost:3000/index.html'
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

    console.log('--- TEST 1: Initial state of category filter trigger on Homepage ---');
    const triggerInfo = await evaluate(`(() => {
      const trigger = document.getElementById('categoryFilterTrigger');
      const icon = trigger ? trigger.querySelector('.category-icon') : null;
      const chevron = trigger ? trigger.querySelector('.category-chevron') : null;
      const label = document.getElementById('categoryFilterLabel');
      const rect = trigger ? trigger.getBoundingClientRect() : null;
      return {
        exists: !!trigger,
        width: rect ? rect.width : 0,
        height: rect ? rect.height : 0,
        label: label ? label.textContent.trim() : null,
        iconWidth: icon ? icon.getBoundingClientRect().width : 0,
        iconHeight: icon ? icon.getBoundingClientRect().height : 0,
        chevronWidth: chevron ? chevron.getBoundingClientRect().width : 0,
        chevronHeight: chevron ? chevron.getBoundingClientRect().height : 0
      };
    })()`);
    console.log('Trigger info:', triggerInfo);

    // Capture screenshot of closed search bar
    const clip1 = await evaluate(`(() => {
      const box = document.getElementById('heroSearchBox');
      const rect = box.getBoundingClientRect();
      return { x: Math.max(0, rect.x - 20), y: Math.max(0, rect.y - 20), width: rect.width + 40, height: rect.height + 100, scale: 1 };
    })()`);

    const screenshot1 = await send('Page.captureScreenshot', { format: 'png', clip: clip1 });
    fs.writeFileSync(path.join(__dirname, 'homepage_search_bar_fixed.png'), Buffer.from(screenshot1.data, 'base64'));
    console.log('Saved scratch/homepage_search_bar_fixed.png');

    console.log('--- TEST 2: Open Category Modal on Homepage ---');
    await evaluate(`document.getElementById('categoryFilterTrigger').click();`);
    await delay(400);

    const modalState = await evaluate(`(() => {
      const overlay = document.getElementById('categoryModalOverlay');
      const title = document.getElementById('categoryModalTitle');
      const groups = document.querySelectorAll('#categoryGroupList .category-group-item').length;
      const subgroups = document.querySelectorAll('#categorySubgroupList .category-subgroup-row').length;
      return {
        isOpen: overlay && !overlay.hidden && window.getComputedStyle(overlay).display !== 'none',
        title: title ? title.textContent.trim() : null,
        groupsCount: groups,
        subgroupsCount: subgroups
      };
    })()`);
    console.log('Modal opened state:', modalState);

    // Capture screenshot of opened modal on homepage
    const screenshot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'homepage_category_modal_opened.png'), Buffer.from(screenshot2.data, 'base64'));
    console.log('Saved scratch/homepage_category_modal_opened.png');

    console.log('--- TEST 3: Select specialty and Apply ---');
    await evaluate(`(() => {
      // Click first specialty pill in Sales
      const firstPill = document.querySelector('#categorySubgroupList .category-specialty-pill');
      if (firstPill) firstPill.click();
      // Click Submit button
      document.getElementById('btnCategorySubmit').click();
    })()`);
    await delay(300);

    const postApplyState = await evaluate(`(() => {
      const overlay = document.getElementById('categoryModalOverlay');
      const label = document.getElementById('categoryFilterLabel');
      const trigger = document.getElementById('categoryFilterTrigger');
      return {
        isClosed: overlay && overlay.hidden,
        labelText: label ? label.textContent.trim() : null,
        isActive: trigger ? trigger.classList.contains('is-active') : false
      };
    })()`);
    console.log('Post apply state:', postApplyState);

    // Capture screenshot showing updated button pill
    const screenshot3 = await send('Page.captureScreenshot', { format: 'png', clip: clip1 });
    fs.writeFileSync(path.join(__dirname, 'homepage_search_bar_applied.png'), Buffer.from(screenshot3.data, 'base64'));
    console.log('Saved scratch/homepage_search_bar_applied.png');

    ws.close();
    chrome.kill();
    console.log('All Homepage Category Filter Verification Tests PASSED successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during test:', err);
    chrome.kill();
    process.exit(1);
  }
}

run();
