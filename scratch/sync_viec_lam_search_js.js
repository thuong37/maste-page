const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'js', 'viec-lam.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Vị trí bắt đầu thay thế: dòng 2408
const startMarker = '// =========================================================================\r\n  // RECENT SEARCHES & SUGGEST DROPDOWN (Kế thừa từ Trang chủ)';
const startMarkerLF = '// =========================================================================\n  // RECENT SEARCHES & SUGGEST DROPDOWN (Kế thừa từ Trang chủ)';

// Vị trí kết thúc thay thế: trước '// Clear Keyword button'
const endMarker = '  // Clear Keyword button';

let startIndex = js.indexOf(startMarker);
if (startIndex === -1) startIndex = js.indexOf(startMarkerLF);

const endIndex = js.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const replacementJS = `// =========================================================================
  // RECENT SEARCHES & SUGGEST DROPDOWN (Đồng bộ hoàn chỉnh từ Trang chủ)
  // =========================================================================
  const RECENT_SEARCH_KEY = 'easycv_recent_searches_v2';
  const DEFAULT_HISTORY = [
    { keyword: 'Kiến trúc sư', count: 94 },
    { keyword: 'ReactJS Developer', count: 156 },
    { keyword: 'Marketing Leader', count: 92 },
    { keyword: 'UI/UX Designer', count: 143 },
    { keyword: 'Java Spring Boot', count: 67 },
    { keyword: 'Kế toán tổng hợp', count: 184 }
  ];

  const POPULAR_KEYWORDS = ['Finance', 'Kinh doanh', 'IT', 'Accountant', 'Marketing', 'Kiến trúc sư'];

  const ALL_SUGGESTIONS = [
    { keyword: 'Kiến trúc sư', count: 94 },
    { keyword: 'Kỹ sư kiến trúc', count: 45 },
    { keyword: 'Thiết kế nội thất', count: 86 },
    { keyword: 'Kỹ sư xây dựng', count: 115 },
    { keyword: 'Chỉ huy trưởng công trình', count: 52 },
    { keyword: 'Tư vấn thiết kế xây dựng', count: 48 },
    { keyword: 'Kinh doanh thiết bị/vật liệu xây dựng', count: 64 },
    { keyword: 'Kinh doanh nội thất', count: 72 },
    { keyword: 'ReactJS Developer', count: 156 },
    { keyword: 'Frontend Developer', count: 165 },
    { keyword: 'Backend Developer (Java/Node)', count: 142 },
    { keyword: 'Fullstack Developer', count: 128 },
    { keyword: 'Mobile Developer (Flutter / iOS)', count: 96 },
    { keyword: 'UI/UX Designer', count: 143 },
    { keyword: 'Product Designer', count: 88 },
    { keyword: 'Business Analyst (BA)', count: 143 },
    { keyword: 'Data Analyst', count: 118 },
    { keyword: 'Data Engineer', count: 79 },
    { keyword: 'AI / Machine Learning Engineer', count: 95 },
    { keyword: 'Tester / QA QC', count: 172 },
    { keyword: 'Marketing Leader', count: 92 },
    { keyword: 'Digital Marketing', count: 215 },
    { keyword: 'Content Marketing', count: 164 },
    { keyword: 'SEO Specialist', count: 98 },
    { keyword: 'Telesales', count: 280 },
    { keyword: 'Nhân viên kinh doanh', count: 420 },
    { keyword: 'Sales B2B', count: 165 },
    { keyword: 'Chăm sóc khách hàng', count: 310 },
    { keyword: 'Kế toán tổng hợp', count: 184 },
    { keyword: 'Kế toán thuế', count: 125 },
    { keyword: 'Chuyên viên tuyển dụng (HR)', count: 152 },
    { keyword: 'Hành chính nhân sự', count: 205 },
    { keyword: 'Quản lý nhà hàng', count: 78 },
    { keyword: 'Nhân viên xuất nhập khẩu', count: 132 },
    { keyword: 'Sales Logistics', count: 110 }
  ];

  const RECOMMENDED_JOBS_PREVIEW = [
    {
      logo: 'assets/logos/company-mua-he-64.png',
      title: 'Kế Toán Tổng Hợp (Mảng Giải Trí)',
      company: 'CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ',
      salary: '20 - 25 triệu'
    },
    {
      logo: 'assets/logos/company-vikimco-64.svg',
      title: 'Giám Đốc Kinh Doanh Vikimco Toàn Quốc',
      company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO',
      salary: '$1,000–1,500 / tháng'
    },
    {
      logo: 'assets/logos/company-fpt-64.svg',
      title: 'Senior IT Infrastructure Officer',
      company: 'TẬP ĐOÀN CÔNG NGHỆ FPT',
      salary: 'Thương lượng'
    },
    {
      logo: 'assets/logos/company-kimmari-64.svg',
      title: 'Quản Lý Nhà Hàng Kimmari Chicken',
      company: 'CHUỖI NHÀ HÀNG KIMMARI CHICKEN',
      salary: '15–25tr ₫/tháng'
    },
    {
      logo: 'assets/logos/company-tanviet-64.svg',
      title: 'Technical Service Engineer – Industrial Printer',
      company: 'CÔNG TY TNHH THIẾT BỊ CÔNG NGHIỆP TÂN VIỆT',
      salary: 'Thương lượng'
    }
  ];

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const qClean = query.trim();
    const escaped = qClean.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escaped + ')', 'gi');
    return escapeHtml(text).replace(regex, '<strong>$1</strong>');
  }

  function getKeywordJobCount(keyword) {
    const found = ALL_SUGGESTIONS.find(s => s.keyword.toLowerCase() === keyword.toLowerCase());
    if (found) return found.count;
    const norm = normalizeText(keyword);
    const count = JOBS_DATA.filter(j => normalizeText(\`\${j.title} \${j.skills.join(' ')}\`).includes(norm)).length;
    return count > 0 ? count * 12 + 15 : 68;
  }

  function getRecentSearches() {
    try {
      const raw = localStorage.getItem(RECENT_SEARCH_KEY);
      if (!raw) return DEFAULT_HISTORY;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => {
          if (typeof item === 'string') {
            return { keyword: item, count: getKeywordJobCount(item) };
          }
          return { keyword: item.keyword, count: item.count || getKeywordJobCount(item.keyword) };
        });
      }
      return DEFAULT_HISTORY;
    } catch (e) {
      return DEFAULT_HISTORY;
    }
  }

  function saveRecentSearch(keyword) {
    if (!keyword || !keyword.trim()) return;
    const term = keyword.trim();
    try {
      let history = getRecentSearches();
      history = history.filter(h => h.keyword.toLowerCase() !== term.toLowerCase());
      history.unshift({ keyword: term, count: getKeywordJobCount(term) });
      if (history.length > 8) history = history.slice(0, 8);
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(history));
      renderRecentSearches();
    } catch (e) {}
  }

  function removeRecentSearch(keyword) {
    try {
      let history = getRecentSearches();
      history = history.filter(h => h.keyword.toLowerCase() !== keyword.toLowerCase());
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(history));
      renderRecentSearches();
    } catch (e) {}
  }

  function clearAllRecentSearches() {
    try {
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify([]));
      renderRecentSearches();
      showToast('Đã xóa toàn bộ lịch sử tìm kiếm', '🗑️');
    } catch (e) {}
  }

  // Inject 2-column search panel into searchSuggestDropdown if not already structured
  let searchFormatLeftEl = null;
  let suggestRecentSectionEl = null;
  let keywordSuggestionsSectionEl = null;
  let keywordSuggestionsListEl = null;
  let popularKeywordsWrapEl = null;
  let recentListEl = null;

  if (searchSuggestDropdown) {
    searchSuggestDropdown.setAttribute('role', 'dialog');
    searchSuggestDropdown.setAttribute('aria-label', 'Gợi ý tìm kiếm việc làm');
    searchSuggestDropdown.innerHTML = '';

    const compactSearchPanel = document.createElement('div');
    compactSearchPanel.className = 'search-format-panel';
    compactSearchPanel.innerHTML = \`
      <section class="search-format-left" aria-label="Lịch sử và từ khóa gợi ý">
        <div class="suggest-section suggest-recent-section" id="suggestRecentSection">
          <div class="suggest-section-header">
            <h3 class="suggest-title" id="searchSuggestHeaderTitle">Từ khóa tìm kiếm gần đây</h3>
            <button type="button" class="btn-clear-history" id="btnClearSearchHistory">Xóa tất cả</button>
          </div>
          <div class="recent-chips-list" id="recentSearchList"></div>
        </div>

        <div class="keyword-suggestions-section" id="keywordSuggestionsSection" style="display: none;">
          <div class="suggest-section-header">
            <h3 class="suggest-title">Từ khóa gợi ý</h3>
          </div>
          <div class="keyword-suggestions-list" id="keywordSuggestionsList"></div>
        </div>

        <div class="popular-keywords" id="popularKeywordsWrap">
          <h3>Từ khóa phổ biến</h3>
          <div class="popular-keyword-list">
            \${POPULAR_KEYWORDS.map(kw => \`
              <button type="button" class="suggest-trend-chip" data-keyword="\${kw}">\${kw}</button>
            \`).join('')}
          </div>
        </div>
      </section>

      <section class="recommended-jobs" aria-labelledby="recommendedJobsTitle">
        <h3 id="recommendedJobsTitle">Việc làm có thể bạn quan tâm</h3>
        <div class="recommended-job-list">
          \${RECOMMENDED_JOBS_PREVIEW.map(job => \`
            <button type="button" class="recommended-job" data-keyword="\${job.title}" aria-label="Tìm \${job.title}, công ty \${job.company}, mức lương \${job.salary}">
              <span class="recommended-job-logo" aria-hidden="true" title="Công ty \${job.company} tuyển dụng tại EasyCV">
                <img src="\${job.logo}" alt="\${job.company}" width="50" height="50" loading="lazy" title="Công ty \${job.company} tuyển dụng tại EasyCV">
              </span>
              <div class="recommended-job-info">
                <span class="recommended-job-title">\${job.title}</span>
                <span class="recommended-job-company">\${job.company}</span>
                <span class="recommended-job-salary">\${job.salary}</span>
              </div>
            </button>
          \`).join('')}
        </div>
      </section>
    \`;

    searchSuggestDropdown.appendChild(compactSearchPanel);

    searchFormatLeftEl = compactSearchPanel.querySelector('.search-format-left');
    suggestRecentSectionEl = compactSearchPanel.querySelector('#suggestRecentSection');
    keywordSuggestionsSectionEl = compactSearchPanel.querySelector('#keywordSuggestionsSection');
    keywordSuggestionsListEl = compactSearchPanel.querySelector('#keywordSuggestionsList');
    popularKeywordsWrapEl = compactSearchPanel.querySelector('#popularKeywordsWrap');
    recentListEl = compactSearchPanel.querySelector('#recentSearchList');

    const clearHistoryBtn = compactSearchPanel.querySelector('#btnClearSearchHistory');
    clearHistoryBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearAllRecentSearches();
    });

    compactSearchPanel.querySelectorAll('.suggest-trend-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || btn.textContent.trim();
        executeSearch(kw);
      });
    });

    compactSearchPanel.querySelectorAll('.recommended-job').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || '';
        executeSearch(kw);
      });
    });
  }

  function renderRecentSearches() {
    if (!recentListEl) return;
    recentListEl.innerHTML = '';
    const searches = getRecentSearches();
    const clearHistoryBtn = searchSuggestDropdown?.querySelector('#btnClearSearchHistory');

    if (!searches || searches.length === 0) {
      recentListEl.innerHTML = '<span class="recent-empty-hint">Chưa có lịch sử tìm kiếm gần đây</span>';
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
      return;
    }

    if (clearHistoryBtn) clearHistoryBtn.style.display = 'inline-block';

    searches.slice(0, 5).forEach(item => {
      const kw = typeof item === 'string' ? item : item.keyword;
      const cnt = typeof item === 'object' && item.count ? item.count : getKeywordJobCount(kw);

      const row = document.createElement('div');
      row.className = 'recent-search-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.innerHTML = \`
        <svg class="recent-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <div class="recent-search-meta">
          <span class="recent-search-keyword">\${escapeHtml(kw)}</span>
          <span class="recent-search-count">\${cnt} việc làm</span>
        </div>
        <button type="button" class="recent-search-remove" aria-label="Xóa từ khóa \${escapeHtml(kw)}" title="Xóa từ khóa này">✕</button>
      \`;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.recent-search-remove')) {
          e.stopPropagation();
          removeRecentSearch(kw);
          return;
        }
        executeSearch(kw);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeSearch(kw);
        }
      });

      recentListEl.appendChild(row);
    });
  }

  function renderKeywordSuggestions(query, container) {
    if (!container) return;
    container.innerHTML = '';
    const clean = normalizeText(query);
    if (!clean) return;

    const matches = ALL_SUGGESTIONS.filter(item => {
      return normalizeText(item.keyword).includes(clean);
    }).slice(0, 6);

    if (matches.length === 0) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'keyword-suggestion-empty';
      emptyRow.setAttribute('role', 'button');
      emptyRow.setAttribute('tabindex', '0');
      emptyRow.innerHTML = \`
        <svg class="kw-suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span class="kw-suggest-text">Tìm kiếm việc làm cho <strong>"\${escapeHtml(query)}"</strong></span>
      \`;
      emptyRow.addEventListener('click', () => {
        executeSearch(query);
      });
      emptyRow.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch(query);
      });
      container.appendChild(emptyRow);
      return;
    }

    matches.forEach(item => {
      const row = document.createElement('div');
      row.className = 'keyword-suggestion-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.innerHTML = \`
        <svg class="kw-suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span class="kw-suggest-text">\${highlightMatch(item.keyword, query)}</span>
        <span class="kw-suggest-count">\${item.count} việc làm</span>
      \`;
      row.addEventListener('click', () => {
        executeSearch(item.keyword);
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch(item.keyword);
      });
      container.appendChild(row);
    });
  }

  function handleSearchInputMode(rawQuery) {
    const query = (rawQuery || '').trim();
    const isTyping = query.length > 0;

    if (isTyping) {
      searchFormatLeftEl?.classList.add('is-typing');
      if (suggestRecentSectionEl) suggestRecentSectionEl.style.display = 'none';
      if (keywordSuggestionsSectionEl) keywordSuggestionsSectionEl.style.display = 'flex';
      if (popularKeywordsWrapEl) popularKeywordsWrapEl.style.display = 'none';
      renderKeywordSuggestions(query, keywordSuggestionsListEl);
    } else {
      searchFormatLeftEl?.classList.remove('is-typing');
      if (suggestRecentSectionEl) suggestRecentSectionEl.style.display = 'flex';
      if (keywordSuggestionsSectionEl) keywordSuggestionsSectionEl.style.display = 'none';
      if (popularKeywordsWrapEl) popularKeywordsWrapEl.style.display = 'block';
      renderRecentSearches();
    }
  }

  function updateDropdownPosition() {
    if (!heroSearchWrapper || !searchSuggestDropdown) return;
    if (window.innerWidth <= 900) {
      searchSuggestDropdown.style.removeProperty('--search-suggest-left');
      searchSuggestDropdown.style.removeProperty('--search-suggest-right');
      searchSuggestDropdown.style.left = '0';
      searchSuggestDropdown.style.right = '0';
      searchSuggestDropdown.style.width = '100%';
      searchSuggestDropdown.style.maxWidth = '100%';
      return;
    }

    const inputGroup = searchInput ? searchInput.closest('.search-input-group') : null;
    const heroBox = document.getElementById('jobSearchForm') || document.getElementById('heroSearchBox') || (searchInput ? searchInput.closest('.hero-search-box') : null);
    const parentBar = searchSuggestDropdown.parentElement;

    if (inputGroup && parentBar && heroBox) {
      const barRect = parentBar.getBoundingClientRect();
      const groupRect = inputGroup.getBoundingClientRect();
      const boxRect = heroBox.getBoundingClientRect();

      // Mép trái: Thu gọn căn thẳng hàng với ô input tìm kiếm (để lộ nút "Danh mục Nghề" bên trái)
      const leftOffset = Math.max(0, Math.round(groupRect.left - barRect.left));

      // Mép phải: Kéo dài đến hết mép phải của thanh tìm kiếm
      const rightOffset = Math.max(0, Math.round(barRect.right - boxRect.right));

      searchSuggestDropdown.style.setProperty('--search-suggest-left', \`\${leftOffset}px\`);
      searchSuggestDropdown.style.setProperty('--search-suggest-right', \`\${rightOffset}px\`);
      searchSuggestDropdown.style.left = \`\${leftOffset}px\`;
      searchSuggestDropdown.style.right = \`\${rightOffset}px\`;
      searchSuggestDropdown.style.width = 'auto';
      searchSuggestDropdown.style.maxWidth = 'none';
    }
  }

  function openSuggest() {
    if (!searchSuggestDropdown) return;
    // Đóng Category Modal nếu đang mở
    if (window.EasyCVCategoryModal && window.EasyCVCategoryModal.isOpen) {
      window.EasyCVCategoryModal.close(false);
    }
    updateDropdownPosition();
    searchSuggestDropdown.classList.add('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
    handleSearchInputMode(searchInput?.value || '');
  }

  function closeSuggest() {
    if (!searchSuggestDropdown) return;
    searchSuggestDropdown.classList.remove('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
  }

  function executeSearch(keyword) {
    if (typeof keyword === 'string') {
      if (searchInput) searchInput.value = keyword;
      if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'flex';
    }
    const query = searchInput ? searchInput.value.trim() : '';
    if (query) {
      saveRecentSearch(query);
    }
    closeSuggest();
    searchInput?.blur();

    applyJobFilters(true, true);
    const matchCount = currentFilteredJobs.filter(j => j._isSearchMatch).length;
    if (query && matchCount > 0) {
      showToast(\`Tìm kiếm "\${query}": Tìm thấy \${matchCount} việc làm phù hợp nhất!\`, '🎯');
    } else if (query && matchCount === 0) {
      showToast(\`Dữ liệu mẫu: Đang hiển thị toàn bộ việc làm có sẵn trên hệ thống\`, '💡');
    } else {
      showToast(\`Đang hiển thị toàn bộ \${JOBS_DATA.length} việc làm có sẵn\`, '🔍');
    }
    scrollToListingTop();
  }

  // Input Events
  searchInput?.addEventListener('focus', () => {
    openSuggest();
  });

  searchInput?.addEventListener('click', (e) => {
    e.stopPropagation();
    openSuggest();
  });

  const searchInputGroup = searchInput?.closest('.search-input-group');
  if (searchInputGroup) {
    searchInputGroup.addEventListener('click', (e) => {
      if (e.target !== clearSearchInputBtn) {
        searchInput?.focus();
        openSuggest();
      }
    });
  }

  let searchDebounceTimer;
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (clearSearchInputBtn) {
      clearSearchInputBtn.style.display = query ? 'flex' : 'none';
    }
    if (!searchSuggestDropdown.classList.contains('is-open')) {
      openSuggest();
    }
    handleSearchInputMode(query);

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      applyJobFilters(true, true);
    }, 250);
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch(searchInput.value);
    } else if (e.key === 'Escape') {
      closeSuggest();
      searchInput.blur();
    }
  });

  clearSearchInputBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchInput) searchInput.value = '';
    clearSearchInputBtn.style.display = 'none';
    searchInput?.focus();
    handleSearchInputMode('');
    applyJobFilters(true, true);
    showToast('Đã xóa từ khóa tìm kiếm', 'ℹ️');
  });

  // Search Form Submit
  jobSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch(searchInput?.value || '');
  });

  // Explicit click handler for Search Button
  btnJobSearch?.addEventListener('click', (e) => {
    e.preventDefault();
    executeSearch(searchInput?.value || '');
  });

  // Khi click vào nút Danh mục Nghề: đóng search suggest dropdown
  const categoryFilterTriggerBtn = document.getElementById('categoryFilterTrigger');
  categoryFilterTriggerBtn?.addEventListener('click', () => {
    closeSuggest();
  });

  document.addEventListener('click', (e) => {
    if (searchSuggestDropdown && !searchSuggestDropdown.contains(e.target) && e.target !== searchInput && !e.target.closest('.search-input-group')) {
      closeSuggest();
    }
  });

  window.addEventListener('resize', updateDropdownPosition, { passive: true });
  window.addEventListener('scroll', updateDropdownPosition, { passive: true });

  updateDropdownPosition();
  renderRecentSearches();

`;

const updatedJS = js.slice(0, startIndex) + replacementJS + js.slice(endIndex);
fs.writeFileSync(jsPath, updatedJS, 'utf8');
console.log('Successfully updated js/viec-lam.js');
