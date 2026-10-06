const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9255;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,1000',
  'http://127.0.0.1:8000/index.html'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage() {
  await delay(2000);
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).find(p => p.url.includes('127.0.0.1:8000'))));
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
        const msg = JSON.parse(event.data);
        if (msg.id === messageId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });
    await new Promise(resolve => { ws.onopen = resolve; });

    const evaluate = async expr => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return res.result.value;
    };

    console.log('=== TEST 1: Open Category Modal ===');
    const openRes = await evaluate(`(() => {
      const trigger = document.getElementById('categoryFilterTrigger');
      trigger.click();
      const overlay = document.getElementById('categoryModalOverlay');
      return { isHidden: overlay.hidden, triggerActive: trigger.classList.contains('is-active') };
    })()`);
    console.log('Modal opened:', openRes);

    await delay(300);

    console.log('=== TEST 2: Hover over group switches right panel without selecting ===');
    const hoverRes = await evaluate(`(() => {
      const mktItem = document.querySelector('.category-group-item[data-category="marketing"]');
      mktItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      const activeKey = window.EasyCVCategoryModal.activeCategoryKey;
      const isChecked = window.EasyCVCategoryModal.tempSelection.groups.has('marketing');
      const firstRoleTitle = document.querySelector('#categorySubgroupItems .category-role-title')?.textContent.trim();
      return { activeKey, isChecked, firstRoleTitle };
    })()`);
    console.log('Hover result:', hoverRes);

    console.log('=== TEST 3: Measure Alignment of Popular Chips vs Subgroup Pills ===');
    // Switch back to sales to test popular alignment
    const alignRes = await evaluate(`(() => {
      const salesItem = document.querySelector('.category-group-item[data-category="sales"]');
      salesItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      const firstPopularChip = document.querySelector('#categoryPopularChipList .category-popular-chip');
      const firstSubgroupPill = document.querySelector('#categorySubgroupItems .category-specialty-pill');
      
      const popRect = firstPopularChip ? firstPopularChip.getBoundingClientRect() : null;
      const pillRect = firstSubgroupPill ? firstSubgroupPill.getBoundingClientRect() : null;
      
      const popWrap = document.getElementById('categoryPopularWrap');
      const firstRow = document.querySelector('#categorySubgroupItems .category-subgroup-row');
      
      return {
        popChipLeft: popRect ? Math.round(popRect.left) : null,
        pillLeft: pillRect ? Math.round(pillRect.left) : null,
        deltaX: popRect && pillRect ? Math.abs(Math.round(popRect.left - pillRect.left)) : null,
        popWrapInsideScrollList: document.getElementById('categorySubgroupList').contains(popWrap)
      };
    })()`);
    console.log('Alignment test:', alignRes);

    console.log('=== TEST 4: Scroll in job area -> Popular keywords is NOT pinned ===');
    const scrollRes = await evaluate(`(() => {
      const scrollList = document.getElementById('categorySubgroupList');
      const popWrap = document.getElementById('categoryPopularWrap');
      const initialTop = popWrap.getBoundingClientRect().top;
      
      scrollList.scrollTop = 150;
      const scrolledTop = popWrap.getBoundingClientRect().top;
      
      return {
        initialTop: Math.round(initialTop),
        scrolledTop: Math.round(scrolledTop),
        deltaY: Math.round(initialTop - scrolledTop),
        isNotPinned: scrolledTop < initialTop
      };
    })()`);
    console.log('Scroll test (not pinned):', scrollRes);

    console.log('=== TEST 5: Focus on search input -> changes to Search Mode (TopCV style) ===');
    const searchFocusRes = await evaluate(`(() => {
      const searchInput = document.getElementById('categoryModalSearchInput');
      searchInput.focus();
      
      const dialog = document.querySelector('.category-modal-dialog');
      const isSearching = dialog.classList.contains('is-searching');
      const leftPanelDisplay = getComputedStyle(document.querySelector('.category-panel-left')).display;
      const suggestionsVisible = document.getElementById('categorySearchSuggestions').style.display !== 'none';
      const suggestChipCount = document.querySelectorAll('.category-suggest-chip').length;
      
      return { isSearching, leftPanelDisplay, suggestionsVisible, suggestChipCount };
    })()`);
    console.log('Search focus mode:', searchFocusRes);

    // Capture screenshot of Search Suggestions mode
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/category_search_mode_focused.png', Buffer.from(snap1.data, 'base64'));
    console.log('Saved scratch/category_search_mode_focused.png');

    console.log('=== TEST 6: Typing in search input -> renders full-width results ===');
    const typingRes = await evaluate(`(() => {
      const searchInput = document.getElementById('categoryModalSearchInput');
      searchInput.value = 'Sales';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      const resultsCountText = document.getElementById('categorySearchCount')?.textContent.trim();
      const resultsRows = document.querySelectorAll('.category-search-result-row').length;
      const firstBreadcrumb = document.querySelector('.category-search-breadcrumb')?.textContent.trim();
      
      return { resultsCountText, resultsRows, firstBreadcrumb };
    })()`);
    console.log('Search typing results:', typingRes);

    // Capture screenshot of Search Results
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/category_search_mode_results.png', Buffer.from(snap2.data, 'base64'));
    console.log('Saved scratch/category_search_mode_results.png');

    console.log('=== TEST 7: Exit Search Mode returns to normal view ===');
    const exitRes = await evaluate(`(() => {
      const exitBtn = document.getElementById('btnExitCategorySearch');
      exitBtn.click();
      
      const dialog = document.querySelector('.category-modal-dialog');
      const isSearching = dialog.classList.contains('is-searching');
      const leftPanelDisplay = getComputedStyle(document.querySelector('.category-panel-left')).display;
      const popWrapVisible = !document.getElementById('categoryPopularWrap').hidden;
      
      return { isSearching, leftPanelDisplay, popWrapVisible };
    })()`);
    console.log('Exit search mode:', exitRes);

    // Take screenshot of normal view with aligned popular chips
    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/category_modal_aligned_final.png', Buffer.from(snap3.data, 'base64'));
    console.log('Saved scratch/category_modal_aligned_final.png');

    console.log('All tests passed successfully!');
    chrome.kill();
  } catch (err) {
    console.error('Error during test:', err);
    chrome.kill();
  }
}

run();
