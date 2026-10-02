const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function runVerification() {
  console.log('=== STARTING AUTOMATED TEST: TOP FILTER BAR & ADS SIDEBAR ===');

  // Step 1: Capture initial desktop screenshot
  const shotDesktop = path.resolve(__dirname, 'vieclam_top_filter_desktop.png');
  execSync(`"${browserPath}" --headless=new --disable-gpu --window-size=1440,1000 --screenshot="${shotDesktop}" "http://localhost:3000/viec-lam.html"`);
  console.log('✓ Captured desktop overview:', shotDesktop);

  // Step 2: Capture mobile screenshot (390 x 844)
  const shotMobile = path.resolve(__dirname, 'vieclam_top_filter_mobile.png');
  execSync(`"${browserPath}" --headless=new --disable-gpu --window-size=390,844 --screenshot="${shotMobile}" "http://localhost:3000/viec-lam.html"`);
  console.log('✓ Captured mobile overview:', shotMobile);

  // Step 3: Launch CDP instance for interactive testing
  const port = 9225;
  const chromeProc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1000',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 1600));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const wsUrl = pageTab.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
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
      return res.result?.value;
    }

    // Wait for DOM
    await new Promise(r => setTimeout(r, 800));

    // Test 1: Check elements presence
    const elementsCheck = await evaluate(`(() => {
      const topBar = document.getElementById('topFilterBar');
      const expBtn = document.getElementById('expFilterBtn');
      const salaryBtn = document.getElementById('salaryFilterBtn');
      const levelBtn = document.getElementById('levelFilterBtn');
      const typeBtn = document.getElementById('typeFilterBtn');
      const sortSelect = document.getElementById('sortSelect');
      const adsSidebar = document.getElementById('adsSidebar');
      const vipCard = document.querySelector('.vip-employer-card');
      const b2bCard = document.querySelector('.b2b-recruiter-card');
      const cvCard = document.querySelector('.cv-coach-card');
      const oldSidebar = document.getElementById('filterSidebar');

      return {
        hasTopBar: !!topBar,
        hasExpBtn: !!expBtn,
        hasSalaryBtn: !!salaryBtn,
        hasLevelBtn: !!levelBtn,
        hasTypeBtn: !!typeBtn,
        hasSortSelect: !!sortSelect,
        hasAdsSidebar: !!adsSidebar,
        hasVipCard: !!vipCard,
        hasB2bCard: !!b2bCard,
        hasCvCard: !!cvCard,
        oldSidebarGone: !oldSidebar,
        topBarDisplay: window.getComputedStyle(topBar).display,
        adsSidebarDisplay: window.getComputedStyle(adsSidebar).display
      };
    })()`);

    console.log('Test 1 (Elements presence):', elementsCheck);
    if (!elementsCheck.hasTopBar || !elementsCheck.hasAdsSidebar || !elementsCheck.oldSidebarGone) {
      throw new Error('Elements presence verification failed!');
    }

    // Test 2: Click salary button to open dropdown
    await evaluate(`document.getElementById('salaryFilterBtn').click()`);
    await new Promise(r => setTimeout(r, 300));

    const dropdownOpenCheck = await evaluate(`(() => {
      const menu = document.getElementById('salaryDropdownMenu');
      const isVisible = !menu.hidden;
      const wrap = document.getElementById('salaryDropdownWrap');
      const hasIsOpen = wrap.classList.contains('is-open');
      const items = Array.from(menu.querySelectorAll('.dropdown-item')).map(i => i.textContent.trim().replace(/\\s+/g, ' '));
      return { isVisible, hasIsOpen, itemsCount: items.length, items };
    })()`);

    console.log('Test 2 (Salary dropdown opened):', dropdownOpenCheck);

    // Capture screenshot with dropdown open
    const shotDropdown = path.resolve(__dirname, 'vieclam_top_filter_dropdown.png');
    const { data: shotData1 } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(shotDropdown, Buffer.from(shotData1, 'base64'));
    console.log('✓ Captured dropdown open view:', shotDropdown);

    if (!dropdownOpenCheck.isVisible || !dropdownOpenCheck.hasIsOpen) {
      throw new Error('Dropdown open verification failed!');
    }

    // Test 3: Click item "15 - 25 triệu"
    await evaluate(`(() => {
      const item = document.querySelector('.dropdown-item[data-type="salary"][data-value="15-25"]');
      if (item) item.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    // Test 4: Also click Experience "1 - 3 năm"
    await evaluate(`(() => {
      document.getElementById('expFilterBtn').click();
    })()`);
    await new Promise(r => setTimeout(r, 200));
    await evaluate(`(() => {
      const item = document.querySelector('.dropdown-item[data-type="exp"][data-value="1-3"]');
      if (item) item.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    const filterAppliedCheck = await evaluate(`(() => {
      const salaryBtn = document.getElementById('salaryFilterBtn');
      const expBtn = document.getElementById('expFilterBtn');
      const chipsRow = document.getElementById('activeFilterChipsRow');
      const chipsList = document.getElementById('activeChipsList');
      const clearBtn = document.getElementById('btnClearTopFilters');
      const countText = document.getElementById('jobCountText')?.textContent;
      const jobCards = document.querySelectorAll('.job-card').length;

      const chips = Array.from(chipsList.querySelectorAll('.filter-chip')).map(c => c.textContent.trim().replace(/\\s+/g, ' '));

      return {
        salaryBtnText: salaryBtn.textContent.trim().replace(/\\s+/g, ' '),
        salaryIsActive: salaryBtn.classList.contains('is-active'),
        expBtnText: expBtn.textContent.trim().replace(/\\s+/g, ' '),
        expIsActive: expBtn.classList.contains('is-active'),
        chipsRowVisible: chipsRow.style.display !== 'none',
        chips,
        clearBtnVisible: clearBtn.style.display !== 'none',
        countText,
        renderedJobCards: jobCards
      };
    })()`);

    console.log('Test 3 & 4 (Filter applied & Active chips):', filterAppliedCheck);

    // Capture screenshot with filters applied
    const shotApplied = path.resolve(__dirname, 'vieclam_top_filter_applied.png');
    const { data: shotData2 } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(shotApplied, Buffer.from(shotData2, 'base64'));
    console.log('✓ Captured filter applied view:', shotApplied);

    if (!filterAppliedCheck.salaryIsActive || !filterAppliedCheck.expIsActive || !filterAppliedCheck.chipsRowVisible) {
      throw new Error('Filter applied verification failed!');
    }

    // Test 5: Test Clear All button
    await evaluate(`document.getElementById('btnClearTopFilters').click()`);
    await new Promise(r => setTimeout(r, 400));

    const resetCheck = await evaluate(`(() => {
      const salaryBtn = document.getElementById('salaryFilterBtn');
      const expBtn = document.getElementById('expFilterBtn');
      const chipsRow = document.getElementById('activeFilterChipsRow');
      const clearBtn = document.getElementById('btnClearTopFilters');
      const jobCards = document.querySelectorAll('.job-card').length;

      return {
        salaryIsActive: salaryBtn.classList.contains('is-active'),
        expIsActive: expBtn.classList.contains('is-active'),
        chipsRowHidden: chipsRow.style.display === 'none',
        clearBtnHidden: clearBtn.style.display === 'none',
        totalRenderedJobs: jobCards
      };
    })()`);

    console.log('Test 5 (Reset all filters):', resetCheck);
    if (resetCheck.salaryIsActive || resetCheck.expIsActive || !resetCheck.chipsRowHidden) {
      throw new Error('Reset filters verification failed!');
    }

    ws.close();
    chromeProc.kill();

    console.log('=== ALL AUTOMATED TESTS PASSED 100%! ===');
  } catch (err) {
    console.error('Test error:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

runVerification();
