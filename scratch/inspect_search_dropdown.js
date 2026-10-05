const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9250;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('index.html')) || tabs[0];
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
    await send('DOM.enable');

    // TEST 1: Default mode (click into search input)
    console.log('--- TEST 1: Click input (Default mode) ---');
    const t1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('heroSearchInput');
        input.focus();
        input.click();
        const dropdown = document.getElementById('searchSuggestDropdown');
        const box = document.getElementById('heroSearchBox');
        const inputGroup = input.closest('.search-input-group');
        const recentTitle = document.getElementById('searchSuggestHeaderTitle');
        const clearBtn = document.getElementById('btnClearSearchHistory');
        const recentRows = document.querySelectorAll('.recent-search-row');
        const dRect = dropdown.getBoundingClientRect();
        const bRect = box.getBoundingClientRect();
        const gRect = inputGroup.getBoundingClientRect();

        return {
          isOpen: dropdown.classList.contains('is-open'),
          recentTitle: recentTitle ? recentTitle.textContent : '',
          clearBtnVisible: clearBtn ? getComputedStyle(clearBtn).display : '',
          recentCount: recentRows.length,
          firstRowText: recentRows[0] ? recentRows[0].textContent.trim().replace(/\s+/g, ' ') : '',
          dropdownLeft: Math.round(dRect.left),
          groupLeft: Math.round(gRect.left),
          boxLeft: Math.round(bRect.left),
          dropdownRight: Math.round(dRect.right),
          boxRight: Math.round(bRect.right),
          dropdownWidth: Math.round(dRect.width),
          leftAlignedWithInput: Math.abs(dRect.left - gRect.left) < 5,
          rightAlignedWithBox: Math.abs(dRect.right - bRect.right) < 5
        };
      })()`,
      returnByValue: true
    });
    console.log('Test 1 Result:', t1.result.value);

    await new Promise(r => setTimeout(r, 400));
    const shot1 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 750, scale: 1 }
    });
    fs.writeFileSync('scratch/test_dropdown_default.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/test_dropdown_default.png');

    // TEST 2: Type "java"
    console.log('--- TEST 2: Typing "java" (Suggestion mode) ---');
    const t2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('heroSearchInput');
        input.value = 'java';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        const kwSection = document.getElementById('keywordSuggestionsSection');
        const recentSection = document.getElementById('suggestRecentSection');
        const popularWrap = document.getElementById('popularKeywordsWrap');
        const kwRows = document.querySelectorAll('.keyword-suggestion-row');

        return {
          kwSectionVisible: kwSection ? getComputedStyle(kwSection).display : '',
          recentSectionVisible: recentSection ? getComputedStyle(recentSection).display : '',
          popularWrapVisible: popularWrap ? getComputedStyle(popularWrap).display : '',
          kwCount: kwRows.length,
          firstKwText: kwRows[0] ? kwRows[0].textContent.trim().replace(/\\s+/g, ' ') : '',
          firstKwHtml: kwRows[0] ? kwRows[0].querySelector('.kw-suggest-text').innerHTML : ''
        };
      })()`,
      returnByValue: true
    });
    console.log('Test 2 Result:', t2.result.value);

    await new Promise(r => setTimeout(r, 400));
    const shot2 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 750, scale: 1 }
    });
    fs.writeFileSync('scratch/test_dropdown_typing.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/test_dropdown_typing.png');

    // TEST 3: Clear input with clear button
    console.log('--- TEST 3: Clear input ---');
    const t3 = await send('Runtime.evaluate', {
      expression: `(() => {
        const clearBtn = document.getElementById('clearSearchInputBtn');
        if (clearBtn) clearBtn.click();

        const kwSection = document.getElementById('keywordSuggestionsSection');
        const recentSection = document.getElementById('suggestRecentSection');
        const popularWrap = document.getElementById('popularKeywordsWrap');

        return {
          kwSectionVisible: kwSection ? getComputedStyle(kwSection).display : '',
          recentSectionVisible: recentSection ? getComputedStyle(recentSection).display : '',
          popularWrapVisible: popularWrap ? getComputedStyle(popularWrap).display : ''
        };
      })()`,
      returnByValue: true
    });
    console.log('Test 3 Result:', t3.result.value);

    // TEST 4: Sticky mode
    console.log('--- TEST 4: Sticky mode (scrollY = 600) ---');
    const t4 = await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo(0, 600);
        window.dispatchEvent(new Event('scroll'));
        const input = document.getElementById('heroSearchInput');
        input.focus();
        input.click();

        const stickyBar = document.getElementById('heroSearchStickyBar');
        const dropdown = document.getElementById('searchSuggestDropdown');
        const inputGroup = input.closest('.search-input-group');
        const dRect = dropdown.getBoundingClientRect();
        const gRect = inputGroup.getBoundingClientRect();

        const box = document.getElementById('heroSearchBox');
        const bRect = box.getBoundingClientRect();

        return {
          isSticky: stickyBar.classList.contains('is-sticky'),
          isOpen: dropdown.classList.contains('is-open'),
          dropdownLeft: Math.round(dRect.left),
          groupLeft: Math.round(gRect.left),
          dropdownRight: Math.round(dRect.right),
          boxRight: Math.round(bRect.right),
          dropdownTop: Math.round(dRect.top),
          dropdownBottom: Math.round(dRect.bottom),
          leftAlignedWithInput: Math.abs(dRect.left - gRect.left) < 5,
          rightAlignedWithBox: Math.abs(dRect.right - bRect.right) < 5
        };
      })()`,
      returnByValue: true
    });
    console.log('Test 4 Result:', t4.result.value);

    await new Promise(r => setTimeout(r, 400));
    const shot4 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 600, width: 1440, height: 600, scale: 1 }
    });
    fs.writeFileSync('scratch/test_dropdown_sticky.png', Buffer.from(shot4.data, 'base64'));
    console.log('Saved scratch/test_dropdown_sticky.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
