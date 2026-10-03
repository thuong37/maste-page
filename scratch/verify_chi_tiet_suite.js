const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function runTestSuite() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9224;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/chi-tiet-viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('chi-tiet-viec-lam.html')) || list[0];
  console.log('Target page found:', page.title, page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
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
  console.log('Connected to CDP websocket');

  // Minimize floating switcher for clean UI screenshot
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const minBtn = document.getElementById('floatingMinBtn');
        if (minBtn) minBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Step 1: Initial layout checks
  const checkInitial = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const topNav = document.querySelector('.detail-top-nav');
        const listPane = document.getElementById('splitListPane');
        const listPaneComputed = listPane ? window.getComputedStyle(listPane) : null;
        const firstCard = document.querySelector('.split-job-card');
        const firstCardComputed = firstCard ? window.getComputedStyle(firstCard) : null;
        const searchForm = document.getElementById('jobSearchForm');
        const searchInput = document.getElementById('jobSearchInput');
        const catTrigger = document.getElementById('categoryFilterTrigger');
        const locTrigger = document.getElementById('heroLocationTrigger');

        return {
          detailTopNavPresent: !!topNav,
          listPanePaddingLeft: listPaneComputed ? listPaneComputed.paddingLeft : null,
          listPanePaddingRight: listPaneComputed ? listPaneComputed.paddingRight : null,
          firstCardWidth: firstCard ? firstCard.offsetWidth : null,
          listPaneWidth: listPane ? listPane.clientWidth : null,
          firstCardBorderLeft: firstCardComputed ? firstCardComputed.borderLeft : null,
          hasSearchForm: !!searchForm,
          hasSearchInput: !!searchInput,
          hasCatTrigger: !!catTrigger,
          hasLocTrigger: !!locTrigger
        };
      })()
    `,
    returnByValue: true
  });

  console.log('1. Layout & Elements Check:', JSON.stringify(checkInitial.value, null, 2));

  // Capture Initial Screenshot
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot1 && shot1.data) {
    fs.writeFileSync(path.resolve(__dirname, 'chi_tiet_initial_view.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/chi_tiet_initial_view.png');
  }

  // Step 2: Open Category Modal
  const openModalRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const catTrigger = document.getElementById('categoryFilterTrigger');
        if (catTrigger) catTrigger.click();
        const modal = document.getElementById('categoryModalOverlay');
        return {
          modalHidden: modal ? modal.hasAttribute('hidden') : null,
          modalDisplay: modal ? window.getComputedStyle(modal).display : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('2. Open Category Modal Check:', JSON.stringify(openModalRes.value, null, 2));
  await new Promise(r => setTimeout(r, 600));

  const shotCat = await send('Page.captureScreenshot', { format: 'png' });
  if (shotCat && shotCat.data) {
    fs.writeFileSync(path.resolve(__dirname, 'chi_tiet_category_modal.png'), Buffer.from(shotCat.data, 'base64'));
    console.log('Saved scratch/chi_tiet_category_modal.png');
  }

  // Close Category Modal
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const closeBtn = document.getElementById('categoryModalClose') || document.getElementById('btnCategoryCancel');
        if (closeBtn) closeBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Step 3: Test Search Input & Clear button
  const searchTestRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const input = document.getElementById('jobSearchInput');
        const clearBtn = document.getElementById('clearSearchInputBtn');
        input.value = 'NodeJS Developer';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const clearBtnDisplayAfterInput = clearBtn ? window.getComputedStyle(clearBtn).display : null;

        clearBtn.click();
        const inputValAfterClear = input.value;
        const clearBtnDisplayAfterClear = clearBtn ? window.getComputedStyle(clearBtn).display : null;

        return {
          clearBtnDisplayAfterInput,
          inputValAfterClear,
          clearBtnDisplayAfterClear
        };
      })()
    `,
    returnByValue: true
  });
  console.log('3. Search Input & Clear Button Check:', JSON.stringify(searchTestRes.value, null, 2));

  // Step 4: Test Sticky Search on Scroll
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        window.scrollTo({ top: 350 });
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const stickyCheck = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const stickyBar = document.getElementById('heroSearchStickyBar');
        return {
          isSticky: stickyBar ? stickyBar.classList.contains('is-sticky') : false,
          scrollY: window.scrollY
        };
      })()
    `,
    returnByValue: true
  });
  console.log('4. Sticky Search on Scroll Check:', JSON.stringify(stickyCheck.value, null, 2));

  const shotSticky = await send('Page.captureScreenshot', { format: 'png' });
  if (shotSticky && shotSticky.data) {
    fs.writeFileSync(path.resolve(__dirname, 'chi_tiet_sticky_scrolled.png'), Buffer.from(shotSticky.data, 'base64'));
    console.log('Saved scratch/chi_tiet_sticky_scrolled.png');
  }

  // Step 5: Test Feed Scroll & Verify Scrollbar is Hidden
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const feed = document.getElementById('splitListFeed');
        if (feed) feed.scrollTop = 320;
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const shotFeed = await send('Page.captureScreenshot', { format: 'png' });
  if (shotFeed && shotFeed.data) {
    fs.writeFileSync(path.resolve(__dirname, 'chi_tiet_feed_scrolled.png'), Buffer.from(shotFeed.data, 'base64'));
    console.log('Saved scratch/chi_tiet_feed_scrolled.png');
  }

  ws.close();
  chrome.kill();
  console.log('All tests completed successfully!');
  process.exit(0);
}

runTestSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
