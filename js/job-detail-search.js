/**
 * EasyCV Job Detail — canonical smart-search behavior.
 * Keeps the detail page focused on the current job until a search is submitted.
 */
(function () {
  window.EasyCVDetailSearchV2 = true;

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobSearchForm');
    const input = document.getElementById('jobSearchInput');
    const clearButton = document.getElementById('clearSearchInputBtn');
    const dropdown = document.getElementById('searchSuggestDropdown');
    const wrapper = document.getElementById('heroSearchWrapper');
    const categoryTrigger = document.getElementById('categoryFilterTrigger');
    const categoryLabel = document.getElementById('categoryFilterLabel');
    const categoryHidden = document.getElementById('jobCategoryHidden');
    const industryHidden = document.getElementById('jobIndustryHidden');
    const locationSelect = document.getElementById('jobLocationSelect');
    const locationTrigger = document.getElementById('heroLocationTrigger');

    if (!form || !input || !dropdown || !wrapper) return;

    const HISTORY_KEY = 'easycv_recent_searches_v2';
    const DEFAULT_HISTORY = [
      { keyword: 'Kiến trúc sư', count: 94 },
      { keyword: 'ReactJS Developer', count: 156 },
      { keyword: 'Marketing Leader', count: 92 },
      { keyword: 'UI/UX Designer', count: 143 },
      { keyword: 'Java Spring Boot', count: 67 }
    ];
    const POPULAR_KEYWORDS = ['Finance', 'Kinh doanh', 'IT', 'Accountant', 'Marketing', 'Kiến trúc sư'];
    const SUGGESTIONS = [
      ['Kiến trúc sư', 94], ['Kỹ sư kiến trúc', 45], ['Thiết kế nội thất', 86],
      ['ReactJS Developer', 156], ['Frontend Developer', 165], ['Backend Developer (Java/Node)', 142],
      ['Fullstack Developer', 128], ['Mobile Developer (Flutter / iOS)', 96], ['UI/UX Designer', 143],
      ['Product Designer', 88], ['Product Manager', 62], ['Business Analyst (BA)', 143],
      ['Data Analyst', 118], ['Data Engineer', 79], ['AI / Machine Learning Engineer', 95],
      ['Tester / QA QC', 172], ['Marketing Leader', 92], ['Digital Marketing', 215],
      ['Content Marketing', 164], ['SEO Specialist', 98], ['Telesales', 280],
      ['Nhân viên kinh doanh', 420], ['Sales B2B', 165], ['Chăm sóc khách hàng', 310],
      ['Kế toán tổng hợp', 184], ['Kế toán thuế', 125], ['Chuyên viên tuyển dụng (HR)', 152],
      ['Hành chính nhân sự', 205], ['Quản lý nhà hàng', 78], ['Nhân viên xuất nhập khẩu', 132],
      ['Sales Logistics', 110]
    ].map(([keyword, count]) => ({ keyword, count }));
    const RECOMMENDED_JOBS = [
      ['assets/logos/company-mua-he-64.png', 'Kế Toán Tổng Hợp (Mảng Giải Trí)', 'CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ', '20 - 25 triệu'],
      ['assets/logos/company-vikimco-64.svg', 'Giám Đốc Kinh Doanh Vikimco Toàn Quốc', 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO', '$1,000–1,500 / tháng'],
      ['assets/logos/company-fpt-64.svg', 'Senior IT Infrastructure Officer', 'TẬP ĐOÀN CÔNG NGHỆ FPT', 'Thương lượng'],
      ['assets/logos/company-kimmari-64.svg', 'Quản Lý Nhà Hàng Kimmari Chicken', 'CHUỖI NHÀ HÀNG KIMMARI CHICKEN', '15–25tr ₫/tháng'],
      ['assets/logos/company-tanviet-64.svg', 'Technical Service Engineer – Industrial Printer', 'CÔNG TY TNHH THIẾT BỊ CÔNG NGHIỆP TÂN VIỆT', 'Thương lượng']
    ].map(([logo, title, company, salary]) => ({ logo, title, company, salary }));

    const normalize = value => (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLocaleLowerCase('vi')
      .trim();

    const escapeHtml = value => (value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    function highlightMatch(value, query) {
      const escapedValue = escapeHtml(value);
      const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return escapedQuery ? escapedValue.replace(new RegExp(`(${escapedQuery})`, 'gi'), '<strong>$1</strong>') : escapedValue;
    }

    function getKeywordCount(keyword) {
      const exact = SUGGESTIONS.find(item => normalize(item.keyword) === normalize(keyword));
      if (exact) return exact.count;
      let hash = 0;
      for (const char of keyword) hash = (hash * 31 + char.charCodeAt(0)) % 300;
      return 35 + Math.abs(hash);
    }

    function getHistory() {
      try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null');
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === 'string'
            ? { keyword: item, count: getKeywordCount(item) }
            : { keyword: item.keyword, count: item.count || getKeywordCount(item.keyword) }
          ).filter(item => item.keyword);
        }
      } catch (error) {
        console.warn('[Detail Search] Cannot read search history', error);
      }
      return DEFAULT_HISTORY;
    }

    function saveHistory(items) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
      } catch (error) {
        console.warn('[Detail Search] Cannot save search history', error);
      }
    }

    function addHistory(keyword) {
      const clean = (keyword || '').trim();
      if (!clean) return;
      const history = getHistory().filter(item => normalize(item.keyword) !== normalize(clean));
      history.unshift({ keyword: clean, count: getKeywordCount(clean) });
      saveHistory(history.slice(0, 8));
    }

    dropdown.setAttribute('role', 'dialog');
    dropdown.setAttribute('aria-label', 'Gợi ý tìm kiếm việc làm');
    input.setAttribute('aria-haspopup', 'dialog');
    input.setAttribute('aria-controls', 'searchSuggestDropdown');
    input.setAttribute('aria-expanded', 'false');
    dropdown.innerHTML = `
      <div class="search-format-panel">
        <section class="search-format-left" aria-label="Lịch sử và từ khóa gợi ý">
          <div class="suggest-section suggest-recent-section" id="suggestRecentSection">
            <div class="suggest-section-header">
              <h3 class="suggest-title" id="searchSuggestHeaderTitle">Từ khóa tìm kiếm gần đây</h3>
              <button type="button" class="btn-clear-history" id="btnClearSearchHistory">Xóa tất cả</button>
            </div>
            <div class="recent-chips-list" id="recentSearchList"></div>
          </div>
          <div class="keyword-suggestions-section" id="keywordSuggestionsSection" hidden>
            <div class="suggest-section-header"><h3 class="suggest-title">Từ khóa gợi ý</h3></div>
            <div class="keyword-suggestions-list" id="keywordSuggestionsList"></div>
          </div>
          <div class="popular-keywords" id="popularKeywordsWrap">
            <h3>Từ khóa phổ biến</h3>
            <div class="popular-keyword-list">
              ${POPULAR_KEYWORDS.map(keyword => `<button type="button" class="suggest-trend-chip" data-keyword="${escapeHtml(keyword)}">${escapeHtml(keyword)}</button>`).join('')}
            </div>
          </div>
        </section>
        <section class="recommended-jobs" aria-labelledby="recommendedJobsTitle">
          <h3 id="recommendedJobsTitle">Việc làm có thể bạn quan tâm</h3>
          <div class="recommended-job-list">
            ${RECOMMENDED_JOBS.map(job => `
              <button type="button" class="recommended-job" data-keyword="${escapeHtml(job.title)}" aria-label="Tìm ${escapeHtml(job.title)}, công ty ${escapeHtml(job.company)}, mức lương ${escapeHtml(job.salary)}">
                <span class="recommended-job-logo" aria-hidden="true" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
                  <img src="${escapeHtml(job.logo)}" alt="" width="50" height="50" loading="lazy">
                </span>
                <span class="recommended-job-info">
                  <span class="recommended-job-title">${escapeHtml(job.title)}</span>
                  <span class="recommended-job-company">${escapeHtml(job.company)}</span>
                  <span class="recommended-job-salary">${escapeHtml(job.salary)}</span>
                </span>
              </button>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    const recentSection = dropdown.querySelector('#suggestRecentSection');
    const recentList = dropdown.querySelector('#recentSearchList');
    const clearHistoryButton = dropdown.querySelector('#btnClearSearchHistory');
    const keywordSection = dropdown.querySelector('#keywordSuggestionsSection');
    const keywordList = dropdown.querySelector('#keywordSuggestionsList');
    const popularWrap = dropdown.querySelector('#popularKeywordsWrap');

    function executeSearch(keyword) {
      if (typeof keyword === 'string') input.value = keyword;
      const query = input.value.trim();
      if (query) addHistory(query);

      const params = new URLSearchParams();
      if (query) params.set('keyword', query);
      if (locationSelect?.value) params.set('location', locationSelect.value);
      if (categoryHidden?.value) params.set('category', categoryHidden.value);
      if (industryHidden?.value) params.set('industry', industryHidden.value);
      closeDropdown();
      window.location.assign(`viec-lam.html${params.size ? `?${params.toString()}` : ''}`);
    }

    function bindSearchAction(element, keyword) {
      element.addEventListener('click', event => {
        event.preventDefault();
        executeSearch(keyword);
      });
      if (element.tagName === 'BUTTON') return;
      element.addEventListener('keydown', event => {
        if (event.target !== element) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          executeSearch(keyword);
        }
      });
    }

    function renderHistory() {
      const history = getHistory();
      recentList.innerHTML = '';
      clearHistoryButton.hidden = history.length === 0;
      if (!history.length) {
        recentList.innerHTML = '<span class="recent-empty-hint">Chưa có lịch sử tìm kiếm gần đây</span>';
        return;
      }

      history.slice(0, 5).forEach(item => {
        const row = document.createElement('div');
        row.className = 'recent-search-row';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.innerHTML = `
          <svg class="recent-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="recent-search-meta"><span class="recent-search-keyword">${escapeHtml(item.keyword)}</span><span class="recent-search-count">${item.count} việc làm</span></span>
          <button type="button" class="recent-search-remove" aria-label="Xóa từ khóa ${escapeHtml(item.keyword)}" title="Xóa từ khóa này">✕</button>
        `;
        bindSearchAction(row, item.keyword);
        row.querySelector('.recent-search-remove').addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          saveHistory(getHistory().filter(historyItem => normalize(historyItem.keyword) !== normalize(item.keyword)));
          renderHistory();
        });
        recentList.appendChild(row);
      });
    }

    function renderSuggestions(query) {
      const normalizedQuery = normalize(query);
      keywordList.innerHTML = '';
      const matches = SUGGESTIONS.filter(item => normalize(item.keyword).includes(normalizedQuery)).slice(0, 6);
      const items = matches.length ? matches : [{ keyword: query, count: getKeywordCount(query), fallback: true }];

      items.forEach(item => {
        const row = document.createElement('div');
        row.className = item.fallback ? 'keyword-suggestion-empty' : 'keyword-suggestion-row';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.innerHTML = `
          <svg class="kw-suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span class="kw-suggest-text">${item.fallback ? `Tìm kiếm việc làm cho <strong>“${escapeHtml(query)}”</strong>` : highlightMatch(item.keyword, query)}</span>
          ${item.fallback ? '' : `<span class="kw-suggest-count">${item.count} việc làm</span>`}
        `;
        bindSearchAction(row, item.keyword);
        keywordList.appendChild(row);
      });
    }

    function updateMode() {
      const query = input.value.trim();
      const typing = query.length > 0;
      recentSection.hidden = typing;
      keywordSection.hidden = !typing;
      popularWrap.hidden = typing;
      if (typing) renderSuggestions(query);
      else renderHistory();
    }

    function updatePosition() {
      const inputGroup = input.closest('.search-input-group');
      const parentBar = dropdown.parentElement;
      const box = form;
      if (!inputGroup || !parentBar || !box) return;

      const barRect = parentBar.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      dropdown.style.setProperty('--search-suggest-top', `${Math.max(0, Math.round(boxRect.bottom - barRect.top + 8))}px`);

      if (window.innerWidth <= 900) {
        Object.assign(dropdown.style, { left: '0', right: '0', width: '100%', maxWidth: '100%' });
        return;
      }
      const inputRect = inputGroup.getBoundingClientRect();
      const left = Math.max(0, Math.round(inputRect.left - barRect.left));
      const right = Math.max(0, Math.round(barRect.right - boxRect.right));
      dropdown.style.setProperty('--search-suggest-left', `${left}px`);
      dropdown.style.setProperty('--search-suggest-right', `${right}px`);
      Object.assign(dropdown.style, { left: `${left}px`, right: `${right}px`, width: 'auto', maxWidth: 'none' });
    }

    function openDropdown() {
      if (window.EasyCVCategoryModal?.isOpen) window.EasyCVCategoryModal.close(false);
      updatePosition();
      updateMode();
      dropdown.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      dropdown.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
    }

    dropdown.querySelectorAll('.suggest-trend-chip, .recommended-job').forEach(button => {
      bindSearchAction(button, button.dataset.keyword || button.textContent.trim());
    });
    clearHistoryButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      saveHistory([]);
      renderHistory();
    });

    input.addEventListener('focus', openDropdown);
    input.addEventListener('click', event => {
      event.stopPropagation();
      openDropdown();
    });
    input.addEventListener('input', () => {
      if (clearButton) clearButton.style.display = input.value.trim() ? 'flex' : 'none';
      if (!dropdown.classList.contains('is-open')) openDropdown();
      else updateMode();
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        executeSearch(input.value);
      } else if (event.key === 'Escape') {
        closeDropdown();
        input.blur();
      }
    });
    input.closest('.search-input-group')?.addEventListener('click', event => {
      if (!event.target.closest('#clearSearchInputBtn')) input.focus();
    });
    clearButton?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      input.value = '';
      clearButton.style.display = 'none';
      input.focus();
      openDropdown();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      executeSearch(input.value);
    });
    categoryTrigger?.addEventListener('click', closeDropdown);
    locationTrigger?.addEventListener('click', closeDropdown);
    document.addEventListener('click', event => {
      if (!wrapper.contains(event.target)) closeDropdown();
    });
    window.addEventListener('resize', updatePosition, { passive: true });
    window.addEventListener('scroll', updatePosition, { passive: true });

    document.addEventListener('easycv:category-applied', event => {
      const { groups = [], subgroups = [], roles = [], primaryQuery = '' } = event.detail || {};
      const chosen = primaryQuery || roles[0] || subgroups[0] || '';
      if (categoryHidden) categoryHidden.value = groups[0] || '';
      if (industryHidden) industryHidden.value = chosen;
      if (categoryLabel) {
        categoryLabel.textContent = chosen || 'Danh mục Nghề';
        categoryLabel.title = chosen || 'Danh mục Nghề';
      }
    });

    renderHistory();
    updatePosition();
  });
})();
