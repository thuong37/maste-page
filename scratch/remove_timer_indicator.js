const fs = require('fs');

function updateJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const hasCRLF = content.includes('\r\n');
  content = content.replace(/\r\n/g, '\n');

  // 1. Remove progressFill and timerIndicator declarations
  content = content.replace(
    "    const progressFill = document.getElementById('autoPageProgressFill');\n    const timerIndicator = document.getElementById('autoPageTimerIndicator');\n",
    ""
  );

  // 2. Remove PAGING_DURATION, autoPageTimer, autoPageProgressInterval, elapsedTimerMs, isPagingPaused
  content = content.replace(
    "    const PAGING_DURATION = 10000; // 10s cho chuyển trang 1 lần\n    let autoPageTimer = null;\n    let autoPageProgressInterval = null;\n    let elapsedTimerMs = 0;\n    let isPagingPaused = false;\n",
    ""
  );

  const newControls = `    // Render thanh điều hướng phân trang
    function renderPaginationControls(totalPages) {
      if (!paginationControls) return;

      if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
      }

      let btnsHtml = \`
        <button type="button" class="featured-page-btn prev-btn" \${currentPage === 1 ? 'disabled' : ''} aria-label="Trang trước" title="Trang trước">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      \`;

      for (let i = 1; i <= totalPages; i++) {
        btnsHtml += \`
          <button type="button" class="featured-page-btn page-num-btn \${i === currentPage ? 'active' : ''}" data-page="\${i}" aria-label="Chuyển đến trang \${i}">
            \${i}
          </button>
        \`;
      }

      btnsHtml += \`
        <button type="button" class="featured-page-btn next-btn" \${currentPage === totalPages ? 'disabled' : ''} aria-label="Trang tiếp theo" title="Trang tiếp theo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      \`;

      paginationControls.innerHTML = btnsHtml;

      // Gắn sự kiện click phân trang
      const prevBtn = paginationControls.querySelector('.prev-btn');
      const nextBtn = paginationControls.querySelector('.next-btn');
      const numBtns = paginationControls.querySelectorAll('.page-num-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            renderJobsGrid();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderJobsGrid();
          }
        });
      }

      numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const page = parseInt(btn.getAttribute('data-page'), 10);
          if (page && page !== currentPage) {
            currentPage = page;
            renderJobsGrid();
          }
        });
      });
    }`;

  const startStr = "    // Render thanh điều hướng phân trang";
  const endStr = "    // Xử lý Popover Preview khi hover vào tên job";

  const startIndex = content.indexOf(startStr);
  const endIndex = content.indexOf(endStr);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find markers in ${filePath}: start=${startIndex}, end=${endIndex}`);
  }

  content = content.slice(0, startIndex) + newControls + "\n\n" + content.slice(endIndex);

  // 4. Remove resetPagingTimer() in tabBtns click and startAutoPagination() at end of initFeaturedJobsSection
  content = content.replace("        resetPagingTimer();\n        renderJobsGrid();", "        renderJobsGrid();");
  content = content.replace("    renderJobsGrid();\n    startAutoPagination();", "    renderJobsGrid();");

  if (hasCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated JS file: ${filePath}`);
}

function updateHtmlCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const hasCRLF = content.includes('\r\n');
  content = content.replace(/\r\n/g, '\n');

  // Remove CSS for auto-page-timer-indicator
  const cssRegex = /\/\* Thanh điều hướng phân trang tự động 10s \*\/[\s\S]*?\.auto-page-timer-indicator\.paused \.auto-page-progress-fill \{[\s\S]*?\}\n/;
  const newCss = `/* Thanh điều hướng phân trang */
    .featured-jobs-footer-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      padding-top: 12px;
    }
    .featured-jobs-pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .featured-page-btn {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: 1px solid var(--border-color, #E2E8F0);
      background: var(--bg-primary, #FFFFFF);
      color: var(--text-primary, #0F172A);
      font-weight: 600;
      font-size: 13.5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .featured-page-btn:hover:not(:disabled) {
      border-color: #F97316;
      color: #F97316;
      background: #FFF7ED;
    }
    .featured-page-btn.active {
      background: #F97316;
      border-color: #F97316;
      color: #FFFFFF;
      box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
    }
    .featured-page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }\n`;

  if (cssRegex.test(content)) {
    content = content.replace(cssRegex, newCss);
  }

  // Bump cache buster for home.js
  content = content.replace('home.js?v=20261007_featured_all_tab_v2', 'home.js?v=20261007_featured_all_tab_v3');

  if (hasCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated HTML/CSS in: ${filePath}`);
}

updateJs('js/home.js');
updateJs('public/js/home.js');
updateHtmlCss('index.html');
updateHtmlCss('public/index.html');
