const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9460;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:' + port + '/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const msgId = id++;
        const handler = (e) => {
          const m = JSON.parse(e.data);
          if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Enable Page and Runtime
    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Check Initial State on Tab "Tất cả"
    const initialState = await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll("#featuredIndustryTabs .filter-pill-btn")).map(t => ({
          cat: t.getAttribute("data-category"),
          active: t.classList.contains("active"),
          text: t.innerText.replace(/\\s+/g, ' ').trim(),
          hasCount: !!t.querySelector(".filter-pill-count")
        }));
        const cards = Array.from(document.querySelectorAll("#featuredJobsGrid .job-card"));
        const pagBtns = Array.from(document.querySelectorAll("#featuredPaginationControls .featured-page-btn")).map(b => b.innerText.trim() || (b.classList.contains('prev-btn') ? 'PREV' : 'NEXT'));
        const timer = document.getElementById("autoPageTimerIndicator");
        const timerDisplay = timer ? window.getComputedStyle(timer).display : null;

        // Check grid rows and columns
        const grid = document.getElementById("featuredJobsGrid");
        const gridComputed = window.getComputedStyle(grid);

        return {
          tabs,
          totalCards: cards.length,
          activeTab: tabs.find(t => t.active)?.text,
          pagBtns,
          timerDisplay,
          gridColumns: gridComputed.gridTemplateColumns.split(' ').length,
          first3Cards: cards.slice(0, 3).map(c => ({
            title: c.querySelector('.job-title')?.textContent.trim(),
            company: c.querySelector('.company-name')?.textContent.trim(),
            category: c.getAttribute('data-category'),
            salary: c.querySelector('.job-pill-salary')?.textContent.trim(),
            city: c.querySelector('.job-pill-location')?.textContent.trim()
          }))
        };
      })()`,
      returnByValue: true
    });

    console.log('--- [1] INITIAL STATE (TAB "TẤT CẢ") ---');
    console.log(JSON.stringify(initialState.result.value, null, 2));

    // 2. Click Next Page on Tab "Tất cả" -> Check Page 2
    const page2State = await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector("#featuredPaginationControls .next-btn");
        if (nextBtn) nextBtn.click();
        const cards = Array.from(document.querySelectorAll("#featuredJobsGrid .job-card"));
        const activePageBtn = document.querySelector("#featuredPaginationControls .page-num-btn.active")?.innerText.trim();
        return {
          page2CardsCount: cards.length,
          activePage: activePageBtn,
          firstCardPage2: cards[0]?.querySelector('.job-title')?.textContent.trim()
        };
      })()`,
      returnByValue: true
    });

    console.log('\n--- [2] PAGE 2 STATE ---');
    console.log(JSON.stringify(page2State.result.value, null, 2));

    // 3. Click Tab "IT - Phần mềm"
    const itTabState = await send('Runtime.evaluate', {
      expression: `(() => {
        const itBtn = document.querySelector('#featuredIndustryTabs .filter-pill-btn[data-category="it"]');
        if (itBtn) itBtn.click();
        const cards = Array.from(document.querySelectorAll("#featuredJobsGrid .job-card"));
        const activePage = document.querySelector("#featuredPaginationControls .page-num-btn.active")?.innerText.trim();
        const pagBtns = Array.from(document.querySelectorAll("#featuredPaginationControls .featured-page-btn")).map(b => b.innerText.trim() || (b.classList.contains('prev-btn') ? 'PREV' : 'NEXT'));
        return {
          itCardsCount: cards.length,
          activePage,
          pagBtns,
          firstCard: cards[0]?.querySelector('.job-title')?.textContent.trim()
        };
      })()`,
      returnByValue: true
    });

    console.log('\n--- [3] TAB "IT - PHẦN MỀM" STATE ---');
    console.log(JSON.stringify(itTabState.result.value, null, 2));

    // 4. Click back to Tab "Tất cả" & scroll to element for screenshot
    await send('Runtime.evaluate', {
      expression: `(() => {
        const allBtn = document.querySelector('#featuredIndustryTabs .filter-pill-btn[data-category="all"]');
        if (allBtn) allBtn.click();
        const sec = document.getElementById('viec-lam-noi-bat');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    if (screenshot?.data) {
      fs.writeFileSync('scratch/verify_featured_all_tab.png', Buffer.from(screenshot.data, 'base64'));
      console.log('\nScreenshot saved to scratch/verify_featured_all_tab.png');
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

test().catch(console.error);
