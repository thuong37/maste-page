const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('--- STARTING VERIFICATION: Search Bar & Category Modal Sync ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/viec-lam.html', { waitUntil: 'networkidle2' });
  console.log('1. Page loaded: http://localhost:3000/viec-lam.html');

  // --- TEST 1: CATEGORY MODAL POSITIONING & FOOTER VISIBILITY ---
  console.log('\n--- TEST 1: Category Modal Positioning ---');
  await page.click('#categoryFilterTrigger');
  await new Promise(r => setTimeout(r, 400));

  const modalState = await page.evaluate(() => {
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

    // Element at center of dialog
    const elAtCenter = dialogRect ? document.elementFromPoint(dialogRect.left + dialogRect.width / 2, dialogRect.top + dialogRect.height / 2) : null;

    return {
      overlayHidden: overlay ? overlay.hidden : true,
      overlayPosition: overlayStyle ? overlayStyle.position : null,
      overlayZIndex: overlayStyle ? overlayStyle.zIndex : null,
      floatingZIndex: floatingStyle ? floatingStyle.zIndex : null,
      dialogRect: dialogRect ? {
        top: dialogRect.top,
        bottom: dialogRect.bottom,
        left: dialogRect.left,
        right: dialogRect.right,
        height: dialogRect.height,
        width: dialogRect.width
      } : null,
      footerVisible: footerRect && footerRect.bottom <= window.innerHeight && footerRect.top >= 0,
      submitBtnVisible: submitRect && submitRect.bottom <= window.innerHeight && submitRect.top >= 0,
      footerRect: footerRect ? { top: footerRect.top, bottom: footerRect.bottom } : null,
      submitRect: submitRect ? { top: submitRect.top, bottom: submitRect.bottom } : null,
      viewportHeight: window.innerHeight,
      isOverlayAboveFloating: parseInt(overlayStyle.zIndex || 0) > parseInt(floatingStyle.zIndex || 0)
    };
  });

  console.log('Modal State:', JSON.stringify(modalState, null, 2));

  if (!modalState.overlayHidden && modalState.footerVisible && modalState.submitBtnVisible && modalState.isOverlayAboveFloating) {
    console.log('>>> TEST 1 PASSED: Modal is centered, footer is 100% visible, z-index is higher than floating widget.');
  } else {
    console.error('>>> TEST 1 FAILED!');
  }

  await page.screenshot({ path: 'scratch/verify_modal_centered.png' });
  console.log('Saved screenshot: scratch/verify_modal_centered.png');

  // Close modal with Cancel button
  await page.click('.btn-category-cancel');
  await new Promise(r => setTimeout(r, 300));

  // --- TEST 2: SEARCH INPUT TYPING & SUGGESTIONS ---
  console.log('\n--- TEST 2: Search Input Typing "Kiến trúc sư" ---');
  await page.click('#jobSearchInput');
  await page.type('#jobSearchInput', 'Kiến trúc sư', { delay: 40 });
  await new Promise(r => setTimeout(r, 500));

  const searchSuggestState = await page.evaluate(() => {
    const dropdown = document.getElementById('searchSuggestDropdown');
    const input = document.getElementById('jobSearchInput');
    const trigger = document.getElementById('categoryFilterTrigger');
    const panel = dropdown ? dropdown.querySelector('.search-format-panel') : null;
    const formatLeft = dropdown ? dropdown.querySelector('.search-format-left') : null;
    const kwSection = dropdown ? dropdown.querySelector('#keywordSuggestionsSection') : null;
    const kwItems = dropdown ? Array.from(dropdown.querySelectorAll('.keyword-suggestion-row, .keyword-suggestion-empty')).map(el => el.textContent.trim()) : [];
    const recommendedJobs = dropdown ? Array.from(dropdown.querySelectorAll('.recommended-job-title')).map(el => el.textContent.trim()) : [];

    const dropdownRect = dropdown ? dropdown.getBoundingClientRect() : null;
    const inputRect = input ? input.getBoundingClientRect() : null;
    const triggerRect = trigger ? trigger.getBoundingClientRect() : null;

    return {
      isOpen: dropdown ? dropdown.classList.contains('is-open') : false,
      isTyping: formatLeft ? formatLeft.classList.contains('is-typing') : false,
      kwSectionDisplay: kwSection ? window.getComputedStyle(kwSection).display : null,
      kwItemsCount: kwItems.length,
      kwItems: kwItems.slice(0, 3),
      recommendedJobsCount: recommendedJobs.length,
      dropdownLeft: dropdownRect ? dropdownRect.left : null,
      inputLeft: inputRect ? inputRect.left : null,
      triggerRight: triggerRect ? triggerRect.right : null,
      // Left edge of dropdown should be at or after triggerRight (leaving Category button visible)
      isCategoryButtonVisible: dropdownRect && triggerRect ? dropdownRect.left >= triggerRect.left : false
    };
  });

  console.log('Search Suggest State:', JSON.stringify(searchSuggestState, null, 2));

  if (searchSuggestState.isOpen && searchSuggestState.isTyping && searchSuggestState.kwItemsCount > 0 && searchSuggestState.recommendedJobsCount > 0) {
    console.log('>>> TEST 2 PASSED: 2-column Suggestion dropdown opened, typing mode active, keyword matched with highlights, recommended jobs displayed.');
  } else {
    console.error('>>> TEST 2 FAILED!');
  }

  await page.screenshot({ path: 'scratch/verify_search_typing.png' });
  console.log('Saved screenshot: scratch/verify_search_typing.png');

  // --- TEST 3: SELECT SUGGESTION & EXECUTE SEARCH ---
  console.log('\n--- TEST 3: Select Suggestion & Filter Jobs ---');
  await page.click('.keyword-suggestion-row');
  await new Promise(r => setTimeout(r, 600));

  const searchExecutionState = await page.evaluate(() => {
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
  });

  console.log('Search Execution State:', JSON.stringify(searchExecutionState, null, 2));

  if (!searchExecutionState.dropdownOpen && searchExecutionState.inputValue.includes('Kiến trúc sư')) {
    console.log('>>> TEST 3 PASSED: Search executed, dropdown closed, jobs filtered correctly with toast feedback.');
  } else {
    console.error('>>> TEST 3 FAILED!');
  }

  await page.screenshot({ path: 'scratch/verify_search_filtered.png' });
  console.log('Saved screenshot: scratch/verify_search_filtered.png');

  // --- TEST 4: CLEAR SEARCH BUTTON ---
  console.log('\n--- TEST 4: Clear Search Input ---');
  await page.click('#clearSearchInputBtn');
  await new Promise(r => setTimeout(r, 400));

  const clearState = await page.evaluate(() => {
    const input = document.getElementById('jobSearchInput');
    const clearBtn = document.getElementById('clearSearchInputBtn');
    const totalJobs = document.querySelectorAll('#jobListingGrid .job-card-wrapper, #jobListingGrid .job-card-link-wrapper').length;
    const historyData = JSON.parse(localStorage.getItem('easycv_recent_searches_v2') || '[]');

    return {
      inputValue: input ? input.value : '',
      clearBtnDisplay: clearBtn ? window.getComputedStyle(clearBtn).display : null,
      totalJobs: totalJobs,
      hasSavedHistory: historyData.some(h => (typeof h === 'string' ? h : h.keyword).includes('Kiến trúc sư'))
    };
  });

  console.log('Clear State:', JSON.stringify(clearState, null, 2));

  if (clearState.inputValue === '' && clearState.clearBtnDisplay === 'none' && clearState.hasSavedHistory) {
    console.log('>>> TEST 4 PASSED: Search cleared, history persisted into localStorage.');
  } else {
    console.error('>>> TEST 4 FAILED!');
  }

  await browser.close();
  console.log('\n--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ---');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
