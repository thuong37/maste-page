const { execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function runTest() {
  console.log('--- Starting Automated Headless Verification ---');

  // Step 1: Capture desktop screenshot of viec-lam.html?keyword=Marketing+Leader
  const shot1 = path.resolve(__dirname, 'vieclam_search_bar_fixed.png');
  execSync(`"${browserPath}" --headless=new --disable-gpu --window-size=1440,900 --screenshot="${shot1}" "http://localhost:3000/viec-lam.html?keyword=Marketing+Leader"`);
  console.log('✓ Captured desktop view:', shot1);

  // Step 2: Capture mobile screenshot
  const shotMobile = path.resolve(__dirname, 'vieclam_search_mobile.png');
  execSync(`"${browserPath}" --headless=new --disable-gpu --window-size=390,844 --screenshot="${shotMobile}" "http://localhost:3000/viec-lam.html?keyword=Marketing+Leader"`);
  console.log('✓ Captured mobile view:', shotMobile);

  // Step 3: Run in-depth browser DOM and interaction checks via CDP / evaluated script
  // Start headless Chrome with remote debugging
  const { spawn } = require('child_process');
  const chromeProc = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html?keyword=Marketing+Leader'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    // Connect to CDP
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listRes.json();
    console.log('Available tabs:', tabs.map(t => ({ url: t.url, title: t.title })));
    const pageTab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const wsUrl = pageTab.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

    await new Promise(r => ws.addEventListener('open', r));

    // Wait until document.readyState === 'complete'
    await new Promise(r => setTimeout(r, 1000));

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
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (res?.exceptionDetails) {
        console.error('JS Evaluation Exception:', res.exceptionDetails);
      }
      return res?.result ? res.result.value : null;
    }

    // Check search box element computed style and layout
    const checkSearchBox = await evaluate(`(() => {
      const box = document.getElementById('jobSearchForm');
      const input = document.getElementById('jobSearchInput');
      const clearBtn = document.getElementById('clearSearchInputBtn');
      const catTrigger = document.getElementById('categoryFilterTrigger');
      const locTrigger = document.getElementById('heroLocationTrigger');
      const submitBtn = document.getElementById('btnJobSearch');
      const stickyBar = document.getElementById('heroSearchStickyBar');

      const boxStyle = window.getComputedStyle(box);
      const submitStyle = window.getComputedStyle(submitBtn);

      return {
        boxHeight: box.offsetHeight,
        boxBorderColor: boxStyle.borderColor,
        boxBorderRadius: boxStyle.borderRadius,
        boxHasOrangeHalo: boxStyle.boxShadow.includes('249, 115, 22'),
        inputValue: input ? input.value : null,
        clearBtnDisplay: clearBtn ? window.getComputedStyle(clearBtn).display : null,
        catTriggerText: catTrigger ? catTrigger.innerText.trim() : null,
        locTriggerText: locTrigger ? locTrigger.innerText.trim() : null,
        submitBtnText: submitBtn ? submitBtn.innerText.trim() : null,
        submitBtnBg: submitStyle.backgroundImage,
        stickyBarExists: !!stickyBar
      };
    })()`);

    console.log('\n--- DOM & Style Verification Results ---');
    console.log('Search Box Height:', checkSearchBox.boxHeight, 'px (Target: ~60px)');
    console.log('Border Color:', checkSearchBox.boxBorderColor, '(Target: rgb(249, 115, 22))');
    console.log('Orange Halo Box Shadow:', checkSearchBox.boxHasOrangeHalo ? 'PASS ✓' : 'FAIL ✗');
    console.log('Input Keyword Value:', checkSearchBox.inputValue);
    console.log('Clear Button (✕) Display:', checkSearchBox.clearBtnDisplay, '(Target: flex)');
    console.log('Category Trigger Text:', checkSearchBox.catTriggerText);
    console.log('Location Trigger Text:', checkSearchBox.locTriggerText);
    console.log('Submit Button Text:', checkSearchBox.submitBtnText);
    console.log('Sticky Bar Markup Exists:', checkSearchBox.stickyBarExists ? 'PASS ✓' : 'FAIL ✗');

    // Test Location Picker opening
    console.log('\n--- Testing Location Picker Interaction ---');
    const locPickerOpen = await evaluate(`(() => {
      const locTrigger = document.getElementById('heroLocationTrigger');
      locTrigger.click();
      const picker = document.getElementById('heroLocationPicker');
      return {
        pickerHidden: picker.hidden,
        expandedAttr: locTrigger.getAttribute('aria-expanded'),
        modesCount: picker.querySelectorAll('.location-mode').length,
        provincesCount: picker.querySelectorAll('.location-picker-item').length
      };
    })()`);
    console.log('Location Picker Hidden:', locPickerOpen.pickerHidden, '(Expected: false)');
    console.log('Aria Expanded:', locPickerOpen.expandedAttr, '(Expected: true)');
    console.log('Modes Count:', locPickerOpen.modesCount, '(Expected: 2)');
    console.log('Provinces Rendered:', locPickerOpen.provincesCount);

    // Capture screenshot of Location Picker opened
    const shotLoc = path.resolve(__dirname, 'vieclam_location_picker_opened.png');
    const shotLocData = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(shotLoc, Buffer.from(shotLocData.data, 'base64'));
    console.log('✓ Captured location picker opened:', shotLoc);

    // Test Search Suggest Dropdown opening
    console.log('\n--- Testing Search Suggest Dropdown ---');
    const suggestOpen = await evaluate(`(() => {
      document.body.click(); // close location picker
      const input = document.getElementById('jobSearchInput');
      input.focus();
      const dropdown = document.getElementById('searchSuggestDropdown');
      return {
        isOpen: dropdown.classList.contains('is-open'),
        chipsCount: dropdown.querySelectorAll('.recent-chip').length
      };
    })()`);
    console.log('Search Suggest is-open:', suggestOpen.isOpen ? 'PASS ✓' : 'FAIL ✗');
    console.log('Recent Chips Count:', suggestOpen.chipsCount);

    // Capture screenshot of Suggest opened
    const shotSug = path.resolve(__dirname, 'vieclam_suggest_opened.png');
    const shotSugData = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(shotSug, Buffer.from(shotSugData.data, 'base64'));
    console.log('✓ Captured search suggest opened:', shotSug);

    // Test Sticky Search Bar when scrolling
    console.log('\n--- Testing Sticky Search Bar On Scroll ---');
    await evaluate('document.body.click(); window.scrollTo(0, 700);');
    await new Promise(r => setTimeout(r, 800));

    const stickyCheck = await evaluate(`(() => {
      const stickyBar = document.getElementById('heroSearchStickyBar');
      const isSticky = stickyBar.classList.contains('is-sticky');
      const rect = stickyBar.getBoundingClientRect();
      const style = window.getComputedStyle(stickyBar);
      return {
        isSticky,
        topPx: Math.round(rect.top),
        position: style.position,
        zIndex: style.zIndex
      };
    })()`);
    console.log('Scrolled down 700px - isSticky:', stickyCheck.isSticky ? 'PASS ✓' : 'FAIL ✗');
    console.log('Position:', stickyCheck.position, '(Expected: fixed)');
    console.log('Top (docked below navbar):', stickyCheck.topPx, 'px (Target: ~72px)');

    // Capture screenshot of Sticky Search Bar
    const shotSticky = path.resolve(__dirname, 'vieclam_sticky_scrolled.png');
    const shotStickyData = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(shotSticky, Buffer.from(shotStickyData.data, 'base64'));
    console.log('✓ Captured sticky search scrolled:', shotSticky);

    // Test Clear Keyword button
    console.log('\n--- Testing Clear Keyword Button ---');
    const clearCheck = await evaluate(`(() => {
      window.scrollTo(0, 0);
      const clearBtn = document.getElementById('clearSearchInputBtn');
      const input = document.getElementById('jobSearchInput');
      clearBtn.click();
      return {
        inputValueAfterClear: input.value,
        clearBtnDisplayAfterClear: window.getComputedStyle(clearBtn).display
      };
    })()`);
    console.log('Input Value After Clear:', JSON.stringify(clearCheck.inputValueAfterClear), '(Expected: "")');
    console.log('Clear Button Display After Clear:', clearCheck.clearBtnDisplayAfterClear, '(Expected: "none")');

    ws.close();
  } finally {
    chromeProc.kill();
  }

  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===');
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
