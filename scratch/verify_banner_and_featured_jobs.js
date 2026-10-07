const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verify() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9225;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://127.0.0.1:8000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));

    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    console.log('Connected to target page:', page.title, page.url);

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let msgIdCounter = 1;

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = msgIdCounter++;
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

    // Kích hoạt DOM, Page, Runtime
    await send('Page.enable');
    await send('DOM.enable');

    // 1. KIỂM TRA BANNER
    console.log('\n--- [1] KIỂM TRA BANNER THƯƠNG HIỆU ---');
    const bannerInfo = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const slider = document.getElementById('heroSponsorSlider');
          const slides = Array.from(slider ? slider.querySelectorAll('.sponsor-slide') : []);
          const dots = Array.from(slider ? slider.querySelectorAll('.sponsor-dot') : []);
          const miniA = document.querySelector('.sponsor-mini-a');
          const miniB = document.querySelector('.sponsor-mini-b');

          const firstSlide = slides[0];
          const style = firstSlide ? window.getComputedStyle(firstSlide) : null;

          return {
            totalSlides: slides.length,
            slideHrefs: slides.map(s => s.getAttribute('href')),
            totalDots: dots.length,
            transitionDuration: style ? style.transitionDuration : null,
            hasMiniA: !!miniA,
            hasMiniB: !!miniB,
            miniAHref: miniA ? miniA.getAttribute('href') : null,
            miniBHref: miniB ? miniB.getAttribute('href') : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Banner result:', JSON.stringify(bannerInfo?.result?.value, null, 2));

    // 2. KIỂM TRA KHỐI VIỆC LÀM NỔI BẬT
    console.log('\n--- [2] KIỂM TRA KHỐI VIỆC LÀM NỔI BẬT ---');
    const featuredInfo = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const tabs = Array.from(document.querySelectorAll('#featuredIndustryTabs .filter-pill-btn'));
          const cards = Array.from(document.querySelectorAll('#featuredJobsGrid .job-card'));
          const lightningBadges = Array.from(document.querySelectorAll('#featuredJobsGrid .badge-lightning'));
          const activeTab = tabs.find(t => t.classList.contains('active'));
          const paginationControls = document.getElementById('featuredPaginationControls');
          const timerIndicator = document.getElementById('autoPageTimerIndicator');

          return {
            totalTabs: tabs.length,
            tabs: tabs.map(t => ({
              category: t.getAttribute('data-category'),
              text: t.querySelector('span')?.textContent.trim(),
              count: t.querySelector('.filter-pill-count')?.textContent.trim()
            })),
            activeCategory: activeTab ? activeTab.getAttribute('data-category') : null,
            totalCards: cards.length,
            lightningCount: lightningBadges.length,
            hasPagination: !!paginationControls,
            hasAutoTimer: !!timerIndicator,
            firstCard: {
              title: cards[0]?.querySelector('.job-title')?.textContent.trim(),
              company: cards[0]?.querySelector('.company-name')?.textContent.trim(),
              salary: cards[0]?.querySelector('.job-pill-salary')?.textContent.trim(),
              hasLightning: !!cards[0]?.querySelector('.badge-lightning')
            }
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Featured Jobs result:', JSON.stringify(featuredInfo?.result?.value, null, 2));

    // 3. KIỂM TRA HOVER VÀO TÊN JOB -> HIỂN THỊ POPUP PREVIEW
    console.log('\n--- [3] KIỂM TRA POPUP PREVIEW KHI HOVER ---');
    const hoverPreviewRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const firstTitle = document.querySelector('#featuredJobsGrid .job-title');
          if (!firstTitle) return 'NO_TITLE';

          // Kích hoạt sự kiện mouseenter giả lập
          const event = new MouseEvent('mouseenter', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          firstTitle.dispatchEvent(event);

          const popup = document.getElementById('jobPreviewPopup');
          return {
            popupFound: !!popup,
            isVisible: popup ? popup.classList.contains('is-visible') : false,
            title: popup ? popup.querySelector('.job-preview-title')?.textContent.trim() : null,
            company: popup ? popup.querySelector('.job-preview-company')?.textContent.trim() : null,
            salary: popup ? popup.querySelector('.job-preview-badge-salary')?.textContent.trim() : null,
            hasApplyBtn: popup ? !!popup.querySelector('.job-preview-btn-apply') : false,
            hasDetailBtn: popup ? !!popup.querySelector('.job-preview-btn-detail') : false
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Hover preview result:', JSON.stringify(hoverPreviewRes?.result?.value, null, 2));

    // 4. KIỂM TRA TOOLTIP TIA SÉT TOPCV
    console.log('\n--- [4] KIỂM TRA TOOLTIP TIA SÉT CHUẨN TOPCV ---');
    const tooltipRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const box = document.querySelector('#featuredJobsGrid .badge-lightning .lightning-tooltip-box');
          return box ? box.innerText : null;
        })()
      `,
      returnByValue: true
    });

    console.log('Lightning Tooltip content:\n' + tooltipRes?.result?.value);

    // Chụp ảnh màn hình toàn trang
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'verified_banner_featured_full.png'), Buffer.from(shot.data, 'base64'));
    console.log('\n-> Đã lưu ảnh chụp toàn bộ: scratch/verified_banner_featured_full.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

verify().catch(console.error);
