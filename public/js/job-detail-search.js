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
    const RECOMMENDED_JOBS_POOL = [
      // 1. Sales & Kinh doanh
      {
        logo: 'assets/logos/company-vikimco-64.svg',
        title: 'Giám Đốc Kinh Doanh Vikimco Toàn Quốc',
        company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO',
        salary: '$1,000–1,500 / tháng',
        category: 'sales',
        skills: ['Sales', 'Kinh doanh', 'B2B', 'Quản lý']
      },
      {
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Khách Hàng Doanh Nghiệp (RM)',
        company: 'Ngân hàng Techcombank',
        salary: '20 - 35 triệu',
        category: 'sales',
        skills: ['Sales B2B', 'Quan hệ khách hàng', 'Tài chính']
      },
      {
        logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Trưởng Phòng Kinh Doanh (B2B Sales Lead)',
        company: 'Tập đoàn Mai Linh',
        salary: '25 - 40 triệu',
        category: 'sales',
        skills: ['Sales B2B', 'Kinh doanh', 'Quản lý đội ngũ']
      },
      {
        logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Telesales Chuyên Nghiệp (Kinh Doanh & CSKH)',
        company: 'Công ty Cổ phần VNPAY',
        salary: '12 - 22 triệu',
        category: 'sales',
        skills: ['Telesales', 'Bán hàng', 'Tư vấn', 'Sales']
      },
      {
        logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Sales Logistics & Cước Vận Tải Quốc Tế',
        company: 'Bee Logistics Corporation',
        salary: '15 - 30 triệu',
        category: 'sales',
        skills: ['Sales Logistics', 'Xuất nhập khẩu', 'Cước tàu', 'Sales']
      },
      {
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Kinh Doanh Bất Động Sản',
        company: 'Tập đoàn Đất Xanh',
        salary: '15 - 50 triệu',
        category: 'sales',
        skills: ['Bất động sản', 'Sales BĐS', 'Môi giới']
      },
      // 2. IT & Phần mềm
      {
        logo: 'assets/logos/company-fpt-64.svg',
        title: 'Senior IT Infrastructure Officer',
        company: 'TẬP ĐOÀN CÔNG NGHỆ FPT',
        salary: 'Thương lượng',
        category: 'it',
        skills: ['IT Infrastructure', 'System', 'Network', 'DevOps']
      },
      {
        logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Senior ReactJS Frontend Developer',
        company: 'KMS Technology',
        salary: '30 - 45 triệu',
        category: 'it',
        skills: ['ReactJS', 'TypeScript', 'Frontend', 'Next.js']
      },
      {
        logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Backend Java / Spring Boot Engineer',
        company: 'Tiki Corporation',
        salary: '35 - 50 triệu',
        category: 'it',
        skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL']
      },
      {
        logo: 'https://images.unsplash.com/photo-1534972195531-a756b1129f63?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Senior UI/UX & Product Designer',
        company: 'MoMo E-Wallet',
        salary: '25 - 40 triệu',
        category: 'it',
        skills: ['UI/UX', 'Figma', 'Design System', 'User Research']
      },
      // 3. Kế toán & Tài chính
      {
        logo: 'assets/logos/company-mua-he-64.png',
        title: 'Kế Toán Tổng Hợp (Mảng Giải Trí)',
        company: 'CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ',
        salary: '20 - 25 triệu',
        category: 'finance',
        skills: ['Kế toán tổng hợp', 'Báo cáo tài chính', 'Thuế']
      },
      {
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Kế Toán Thuế & Kiểm Toán Nội Bộ',
        company: 'PwC Vietnam',
        salary: '22 - 32 triệu',
        category: 'finance',
        skills: ['Kế toán thuế', 'Kiểm toán', 'Báo cáo thuế']
      },
      // 4. Marketing & Truyền thông
      {
        logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Trưởng Phòng Marketing & Truyền Thông',
        company: 'Masan Consumer Holdings',
        salary: '35 - 55 triệu',
        category: 'marketing',
        skills: ['Marketing', 'Brand', 'Chiến lược', 'Quản lý']
      },
      {
        logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Digital Marketing & Performance Ads Lead',
        company: 'VinFast Auto',
        salary: '25 - 40 triệu',
        category: 'marketing',
        skills: ['Digital Marketing', 'Facebook Ads', 'Google Ads', 'SEO']
      },
      {
        logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Content Marketing Lead & Sáng Tạo Nội Dung',
        company: 'VCCorp Corporation',
        salary: '18 - 28 triệu',
        category: 'marketing',
        skills: ['Content Marketing', 'Copywriting', 'Social Media']
      },
      // 5. Ngành nghề khác
      {
        logo: 'assets/logos/company-kimmari-64.svg',
        title: 'Quản Lý Nhà Hàng Kimmari Chicken',
        company: 'CHUỖI NHÀ HÀNG KIMMARI CHICKEN',
        salary: '15–25tr ₫/tháng',
        category: 'hospitality',
        skills: ['Quản lý', 'Nhà hàng', 'F&B', 'Dịch vụ']
      },
      {
        logo: 'assets/logos/company-tanviet-64.svg',
        title: 'Technical Service Engineer – Industrial Printer',
        company: 'CÔNG TY TNHH THIẾT BỊ CÔNG NGHIỆP TÂN VIỆT',
        salary: 'Thương lượng',
        category: 'eng',
        skills: ['Kỹ thuật', 'Bảo trì', 'Cơ điện']
      },
      {
        logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Tuyển Dụng & Đào Tạo (HR Specialist)',
        company: 'Vinamilk Corporation',
        salary: '18 - 26 triệu',
        category: 'hr',
        skills: ['Tuyển dụng', 'HR', 'Nhân sự', 'Đào tạo']
      }
    ];

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
          <div class="recommended-job-list" id="recommendedJobList"></div>
        </section>
      </div>
    `;

    const recentSection = dropdown.querySelector('#suggestRecentSection');
    const recentList = dropdown.querySelector('#recentSearchList');
    const clearHistoryButton = dropdown.querySelector('#btnClearSearchHistory');
    const keywordSection = dropdown.querySelector('#keywordSuggestionsSection');
    const keywordList = dropdown.querySelector('#keywordSuggestionsList');
    const popularWrap = dropdown.querySelector('#popularKeywordsWrap');
    const recommendedJobList = dropdown.querySelector('#recommendedJobList');

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

    function renderRecommendedJobs(query = '') {
      if (!recommendedJobList) return;
      const clean = normalize(query);

      let jobsToDisplay = [];
      if (!clean) {
        jobsToDisplay = RECOMMENDED_JOBS_POOL.slice(0, 5);
      } else {
        const matched = RECOMMENDED_JOBS_POOL.filter(job => {
          const titleNorm = normalize(job.title);
          const companyNorm = normalize(job.company);
          const catNorm = normalize(job.category || '');
          const skillsNorm = normalize((job.skills || []).join(' '));
          return titleNorm.includes(clean) || companyNorm.includes(clean) || catNorm.includes(clean) || skillsNorm.includes(clean);
        });

        if (matched.length > 0) {
          matched.sort((a, b) => {
            const aTitle = normalize(a.title).includes(clean);
            const bTitle = normalize(b.title).includes(clean);
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            return 0;
          });
          jobsToDisplay = matched.slice(0, 5);
        } else {
          const words = clean.split(/\s+/).filter(w => w.length > 1);
          const partialMatches = RECOMMENDED_JOBS_POOL.filter(job => {
            const fullText = normalize(`${job.title} ${job.company} ${job.category || ''} ${(job.skills || []).join(' ')}`);
            return words.some(w => fullText.includes(w));
          });
          jobsToDisplay = (partialMatches.length > 0 ? partialMatches : RECOMMENDED_JOBS_POOL).slice(0, 5);
        }
      }

      recommendedJobList.innerHTML = jobsToDisplay.map(job => `
        <button type="button" class="recommended-job" data-keyword="${escapeHtml(job.title)}" aria-label="Tìm ${escapeHtml(job.title)}, công ty ${escapeHtml(job.company)}, mức lương ${escapeHtml(job.salary)}">
          <span class="recommended-job-logo" aria-hidden="true" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
            <img src="${escapeHtml(job.logo)}" alt="" width="50" height="50" loading="lazy">
          </span>
          <span class="recommended-job-info">
            <span class="recommended-job-title">${highlightMatch(job.title, query)}</span>
            <span class="recommended-job-company">${escapeHtml(job.company)}</span>
            <span class="recommended-job-salary">${escapeHtml(job.salary)}</span>
          </span>
        </button>
      `).join('');

      recommendedJobList.querySelectorAll('.recommended-job').forEach(button => {
        bindSearchAction(button, button.dataset.keyword || button.textContent.trim());
      });
    }

    renderRecommendedJobs('');

    function updateMode() {
      const query = input.value.trim();
      const typing = query.length > 0;
      recentSection.hidden = typing;
      keywordSection.hidden = !typing;
      popularWrap.hidden = typing;
      if (typing) {
        renderSuggestions(query);
        renderRecommendedJobs(query);
      } else {
        renderHistory();
        renderRecommendedJobs('');
      }
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

    dropdown.querySelectorAll('.suggest-trend-chip').forEach(button => {
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
