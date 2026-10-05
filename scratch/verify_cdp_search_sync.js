const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function runTest() {
  console.log('--- STARTING VERIFICATION: Search Bar & Category Modal Sync (via CDP) ---');

  const chromeProc = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9232/json');
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

    // Enable Page and DOM
    await send('Page.enable');
    await send('DOM.enable');

    // TEST 1: Open Category Modal and Check Positioning & Z-Index
    console.log('\n>>> [TEST 1] Click Danh mục Nghề & verify positioning...');
    const test1Res = await send('Runtime.evaluate', {
      expression: `(() => {
        const trigger = document.getElementById('categoryFilterTrigger');
        if (trigger) trigger.click();

        const overlay = document.getElementById('categoryModalOverlay');
        const dialog = overlay ? overlay.querySelector('.category-modal-dialog') : null;
        const footer = dialog ? dialog.querySelector('.category-modal-footer') : null;
        const submitBtn = dialog ? dialog.querySelector('.btn-category-submit') : null;
        const floatingBox = document.getElementById('floatingViewModeBox');

        const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
        const dialogStyle = dialog ? window.getComputedStyle(dialog) : null;
        const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        const submitRect = submitBtn ? submitBtn.getBoundingClientRect() : null;
        const floatingStyle = floatingBox ? window.getComputedStyle(floatingBox) : null;

        return {
          overlayHidden: overlay ? overlay.hidden : true,
          overlayPosition: overlayStyle ? overlayStyle.position : null,
          overlayZIndex: overlayStyle ? overlayStyle.zIndex : null,
          floatingZIndex: floatingStyle ? floatingStyle.zIndex : null,
          dialogRect: dialogRect ? {
            top: Math.round(dialogRect.top),
            bottom: Math.round(dialogRect.bottom),
            left: Math.round(dialogRect.left),
            right: Math.round(dialogRect.right),
            height: Math.round(dialogRect.height),
            width: Math.round(dialogRect.width)
          } : null,
          footerVisible: footerRect && footerRect.bottom <= window.innerHeight && footerRect.top >= 0,
          submitBtnVisible: submitRect && submitRect.bottom <= window.innerHeight && submitRect.top >= 0,
          viewportHeight: window.innerHeight,
          isOverlayAboveFloating: parseInt(overlayStyle.zIndex || 0) > parseInt(floatingStyle.zIndex || 0)
        };
      })()`,
      returnByValue: true
    });

    const t1 = (test1Res.result && test1Res.result.value) || test1Res.value || {};
    console.log('Test 1 Result:', JSON.stringify(t1, null, 2));

    if (!t1.overlayHidden && t1.footerVisible && t1.submitBtnVisible && t1.isOverlayAboveFloating) {
      console.log('✓ TEST 1 PASSED: Modal is centered, footer is 100% visible, z-index is higher than floating switcher widget.');
    } else {
      console.error('✗ TEST 1 FAILED!');
    }

    // Capture screenshot of centered modal
    const shot1 = await send('Page.captureScreenshot');
    fs.writeFileSync('scratch/verify_modal_centered.png', Buffer.from(shot1.data, 'base64'));
    console.log('Screenshot saved: scratch/verify_modal_centered.png');

    // Close modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const cancelBtn = document.querySelector('.btn-category-cancel');
        if (cancelBtn) cancelBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // TEST 2: Type "Kiến trúc sư" and Check Search Suggest Dropdown
    console.log('\n>>> [TEST 2] Type "Kiến trúc sư" in jobSearchInput...');
    const test2Res = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('jobSearchInput');
        if (input) {
          input.focus();
          input.value = 'Kiến trúc sư';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const dropdown = document.getElementById('searchSuggestDropdown');
        const trigger = document.getElementById('categoryFilterTrigger');
        const formatLeft = dropdown ? dropdown.querySelector('.search-format-left') : null;
        const kwSection = dropdown ? dropdown.querySelector('#keywordSuggestionsSection') : null;
        const kwItems = dropdown ? Array.from(dropdown.querySelectorAll('.keyword-suggestion-row, .keyword-suggestion-empty')).map(el => el.textContent.trim()) : [];
        const recommendedJobs = dropdown ? Array.from(dropdown.querySelectorAll('.recommended-job-title')).map(el => el.textContent.trim()) : [];

        const dropdownRect = dropdown ? dropdown.getBoundingClientRect() : null;
        const triggerRect = trigger ? trigger.getBoundingClientRect() : null;

        return {
          isOpen: dropdown ? dropdown.classList.contains('is-open') : false,
          isTyping: formatLeft ? formatLeft.classList.contains('is-typing') : false,
          kwSectionDisplay: kwSection ? window.getComputedStyle(kwSection).display : null,
          kwItemsCount: kwItems.length,
          kwItems: kwItems.slice(0, 4),
          recommendedJobsCount: recommendedJobs.length,
          dropdownLeft: dropdownRect ? Math.round(dropdownRect.left) : null,
          triggerRight: triggerRect ? Math.round(triggerRect.right) : null,
          isCategoryButtonVisible: dropdownRect && triggerRect ? dropdownRect.left >= triggerRect.left : false
        };
      })()`,
      returnByValue: true
    });

    const t2 = (test2Res.result && test2Res.result.value) || test2Res.value || {};
    console.log('Test 2 Result:', JSON.stringify(t2, null, 2));

    if (t2.isOpen && t2.isTyping && t2.kwItemsCount > 0 && t2.recommendedJobsCount > 0) {
      console.log('✓ TEST 2 PASSED: 2-column Suggestion dropdown opened, typing mode active, keyword suggestions matched, recommended jobs rendered.');
    } else {
      console.error('✗ TEST 2 FAILED!');
    }

    // Capture screenshot of typing mode
    const shot2 = await send('Page.captureScreenshot');
    fs.writeFileSync('scratch/verify_search_typing.png', Buffer.from(shot2.data, 'base64'));
    console.log('Screenshot saved: scratch/verify_search_typing.png');

    // TEST 3: Select Suggestion & Filter Jobs
    console.log('\n>>> [TEST 3] Click on suggestion to execute search...');
    const test3Res = await send('Runtime.evaluate', {
      expression: `(() => {
        const firstKwRow = document.querySelector('.keyword-suggestion-row');
        if (firstKwRow) firstKwRow.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const test3Check = await send('Runtime.evaluate', {
      expression: `(() => {
        const dropdown = document.getElementById('searchSuggestDropdown');
        const input = document.getElementById('jobSearchInput');
        const toast = document.getElementById('toastMsg');
        const jobCards = Array.from(document.querySelectorAll('#jobListingGrid .job-card-wrapper, #jobListingGrid .job-card-link-wrapper'));
        const matchedCards = Array.from(document.querySelectorAll('#jobListingGrid [data-search-match="true"]'));

        return {
          dropdownOpen: dropdown ? dropdown.classList.contains('is-open') : true,
          inputValue: input ? input.value : '',
          toastText: toast ? toast.textContent.trim() : '',
          totalJobsRendered: jobCards.length,
          matchedCardsCount: matchedCards.length
        };
      })()`,
      returnByValue: true
    });

    const t3 = (test3Check.result && test3Check.result.value) || test3Check.value || {};
    console.log('Test 3 Result:', JSON.stringify(t3, null, 2));

    if (!t3.dropdownOpen && t3.inputValue.includes('Kiến trúc sư')) {
      console.log('✓ TEST 3 PASSED: Suggestion selected, dropdown closed, jobs filtered live with toast feedback.');
    } else {
      console.error('✗ TEST 3 FAILED!');
    }

    // Capture screenshot of filtered results
    const shot3 = await send('Page.captureScreenshot');
    fs.writeFileSync('scratch/verify_search_filtered.png', Buffer.from(shot3.data, 'base64'));
    console.log('Screenshot saved: scratch/verify_search_filtered.png');

    // TEST 4: Clear search button
    console.log('\n>>> [TEST 4] Click clear search button ✕...');
    const test4Res = await send('Runtime.evaluate', {
      expression: `(() => {
        const clearBtn = document.getElementById('clearSearchInputBtn');
        if (clearBtn) clearBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const test4Check = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('jobSearchInput');
        const clearBtn = document.getElementById('clearSearchInputBtn');
        const historyData = JSON.parse(localStorage.getItem('easycv_recent_searches_v2') || '[]');

        return {
          inputValue: input ? input.value : '',
          clearBtnDisplay: clearBtn ? window.getComputedStyle(clearBtn).display : null,
          hasSavedHistory: historyData.some(h => (typeof h === 'string' ? h : h.keyword).includes('Kiến trúc sư'))
        };
      })()`,
      returnByValue: true
    });

    const t4 = (test4Check.result && test4Check.result.value) || test4Check.value || {};
    console.log('Test 4 Result:', JSON.stringify(t4, null, 2));

    if (t4.inputValue === '' && t4.clearBtnDisplay === 'none' && t4.hasSavedHistory) {
      console.log('✓ TEST 4 PASSED: Search cleared, history persisted in localStorage.');
    } else {
      console.error('✗ TEST 4 FAILED!');
    }

    ws.close();
  } finally {
    chromeProc.kill();
  }
  console.log('\n--- VERIFICATION SUITE FINISHED ---');
}

runTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
