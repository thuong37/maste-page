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

    const HISTORY_KEY = 'easycv_recent_searches_v2';    const DEFAULT_HISTORY = [
      { keyword: 'ReactJS Developer', count: 156 },
      { keyword: 'Telesales', count: 280 },
      { keyword: 'Marketing Leader', count: 92 },
      { keyword: 'UI/UX Designer', count: 143 },
      { keyword: 'Java Spring Boot', count: 67 },
      { keyword: 'Kế toán tổng hợp', count: 184 }
    ];
    const POPULAR_KEYWORDS = ['Telesales', 'Kinh doanh', 'Java Spring', 'Marketing', 'Kế toán'];

    const POPULAR_COMPANIES = [
      { name: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)', shortName: 'Viettel' },
      { name: 'Tập đoàn Công nghiệp Viettel', shortName: 'Viettel' },
      { name: 'Tổng Công ty Viễn thông Viettel (Viettel Telecom)', shortName: 'Viettel Telecom' },
      { name: 'Tổng Công ty Cổ phần Bưu chính Viettel (Viettel Post)', shortName: 'Viettel Post' },
      { name: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel (Viettel Solutions)', shortName: 'Viettel Solutions' },
      { name: 'FPT Software', shortName: 'FPT Software' },
      { name: 'TẬP ĐOÀN CÔNG NGHỆ FPT', shortName: 'FPT' },
      { name: 'Công ty Cổ phần Viễn thông FPT (FPT Telecom)', shortName: 'FPT Telecom' },
      { name: 'FPT Digital (Tập đoàn FPT)', shortName: 'FPT Digital' },
      { name: 'VNG Corporation (Zalo Team)', shortName: 'VNG' },
      { name: 'Zalo Group (VNG)', shortName: 'Zalo' },
      { name: 'Ngân hàng Techcombank', shortName: 'Techcombank' },
      { name: 'Ngân hàng TMCP Quân Đội (MB Bank)', shortName: 'MB Bank' },
      { name: 'Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)', shortName: 'VPBank' },
      { name: 'Shopee Vietnam (SPX Express)', shortName: 'Shopee' },
      { name: 'Ví điện tử MoMo (M-Service)', shortName: 'MoMo' },
      { name: 'Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)', shortName: 'VNPAY' },
      { name: 'Tập đoàn Vingroup (Vinhomes)', shortName: 'Vingroup' },
      { name: 'VinFast Auto', shortName: 'VinFast' },
      { name: 'VinAI Research (Tập đoàn Vingroup)', shortName: 'VinAI' },
      { name: 'Tiki Corporation (Tiki Tech Hub)', shortName: 'Tiki' },
      { name: 'Tập đoàn Masan (Masan Consumer)', shortName: 'Masan' },
      { name: 'Masan Consumer Holdings', shortName: 'Masan' },
      { name: 'CMC Telecom', shortName: 'CMC' },
      { name: 'Base.vn (Nền tảng Quản trị Doanh nghiệp)', shortName: 'Base.vn' },
      { name: 'One Mount Group (Hệ sinh thái VinID & VinShop)', shortName: 'One Mount' },
      { name: 'KMS Technology Vietnam', shortName: 'KMS Technology' },
      { name: 'NashTech Vietnam', shortName: 'NashTech' },
      { name: 'Bosch Global Software Technologies (Bosch Việt Nam)', shortName: 'Bosch' },
      { name: 'Unilever Việt Nam', shortName: 'Unilever' },
      { name: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)', shortName: 'Vinamilk' },
      { name: 'Công ty Cổ phần Chứng khoán SSI', shortName: 'SSI' },
      { name: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO', shortName: 'Vikimco' },
      { name: 'Tập đoàn Mai Linh', shortName: 'Mai Linh' },
      { name: 'Tập đoàn Đất Xanh', shortName: 'Đất Xanh' },
      { name: 'Tập đoàn Tân Á Đại Thành', shortName: 'Tân Á Đại Thành' },
      { name: 'Grab Việt Nam', shortName: 'Grab' },
      { name: 'Bee Logistics Corporation', shortName: 'Bee Logistics' },
      { name: 'Samsung Electronics HCMC', shortName: 'Samsung' },
      { name: 'VCCorp Corporation', shortName: 'VCCorp' },
      { name: 'Dentsu Creative Vietnam', shortName: 'Dentsu' },
      { name: 'Gemadept Logistics', shortName: 'Gemadept' }
    ];

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
        id: 1,
        logo: 'assets/logos/company-vikimco-64.svg',
        title: 'Giám Đốc Kinh Doanh Vikimco Toàn Quốc',
        company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO',
        salary: '$1,000–1,500 / tháng',
        location: 'Hà Nội & Toàn quốc',
        category: 'sales',
        skills: ['Sales', 'Kinh doanh', 'B2B', 'Quản lý'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 96
      },
      {
        id: 2,
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Khách Hàng Doanh Nghiệp (RM)',
        company: 'Ngân hàng Techcombank',
        salary: '20 - 35 triệu',
        location: 'Hà Nội',
        category: 'sales',
        skills: ['Sales B2B', 'Quan hệ khách hàng', 'Tài chính'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 94
      },
      {
        id: 3,
        logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Trưởng Phòng Kinh Doanh (B2B Sales Lead)',
        company: 'Tập đoàn Mai Linh',
        salary: '25 - 40 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'sales',
        skills: ['Sales B2B', 'Kinh doanh', 'Quản lý đội ngũ'],
        isPartner: true,
        postedDaysAgo: 3,
        interactionScore: 88
      },
      {
        id: 4,
        logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Telesales Chuyên Nghiệp (Kinh Doanh & CSKH)',
        company: 'Công ty Cổ phần VNPAY',
        salary: '12 - 22 triệu',
        location: 'Hà Nội',
        category: 'sales',
        skills: ['Telesales', 'Bán hàng', 'Tư vấn', 'Sales'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 92
      },
      {
        id: 5,
        logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Sales Logistics & Cước Vận Tải Quốc Tế',
        company: 'Bee Logistics Corporation',
        salary: '15 - 30 triệu',
        location: 'Hải Phòng & TP. HCM',
        category: 'sales',
        skills: ['Sales Logistics', 'Xuất nhập khẩu', 'Cước tàu', 'Sales'],
        isPartner: false,
        postedDaysAgo: 2,
        interactionScore: 85
      },
      {
        id: 6,
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Kinh Doanh Bất Động Sản',
        company: 'Tập đoàn Đất Xanh',
        salary: '15 - 50 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'sales',
        skills: ['Bất động sản', 'Sales BĐS', 'Môi giới'],
        isPartner: true,
        postedDaysAgo: 4,
        interactionScore: 82
      },
      // 2. IT & Phần mềm
      {
        id: 10,
        logo: 'assets/logos/company-fpt-64.svg',
        title: 'Senior IT Infrastructure Officer',
        company: 'TẬP ĐOÀN CÔNG NGHỆ FPT',
        salary: 'Thương lượng',
        location: 'Hà Nội & Đà Nẵng',
        category: 'it',
        skills: ['IT Infrastructure', 'System', 'Network', 'DevOps'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 98
      },
      {
        id: 11,
        logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Senior ReactJS Frontend Developer',
        company: 'KMS Technology',
        salary: '30 - 45 triệu',
        location: 'Đà Nẵng & Hà Nội',
        category: 'it',
        skills: ['ReactJS', 'TypeScript', 'Frontend', 'Next.js'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 95
      },
      {
        id: 14,
        logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Backend Java / Spring Boot Engineer',
        company: 'Tiki Corporation',
        salary: '35 - 50 triệu',
        location: 'Hà Nội',
        category: 'it',
        skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 96
      },
      {
        id: 12,
        logo: 'https://images.unsplash.com/photo-1534972195531-a756b1129f63?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Senior UI/UX & Product Designer',
        company: 'MoMo E-Wallet',
        salary: '25 - 40 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'it',
        skills: ['UI/UX', 'Figma', 'Design System', 'User Research'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 93
      },
      // 3. Kế toán & Tài chính
      {
        id: 7,
        logo: 'assets/logos/company-mua-he-64.png',
        title: 'Kế Toán Tổng Hợp (Mảng Giải Trí)',
        company: 'CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ',
        salary: '20 - 25 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'finance',
        skills: ['Kế toán tổng hợp', 'Báo cáo tài chính', 'Thuế'],
        isPartner: false,
        postedDaysAgo: 2,
        interactionScore: 86
      },
      {
        id: 8,
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Kế Toán Thuế & Kiểm Toán Nội Bộ',
        company: 'PwC Vietnam',
        salary: '22 - 32 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'finance',
        skills: ['Kế toán thuế', 'Kiểm toán', 'Báo cáo thuế'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 97
      },
      // 4. Marketing & Truyền thông
      {
        id: 15,
        logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Trưởng Phòng Marketing & Truyền Thông',
        company: 'Masan Consumer Holdings',
        salary: '35 - 55 triệu',
        location: 'Bình Dương & TP. HCM',
        category: 'marketing',
        skills: ['Marketing', 'Brand', 'Chiến lược', 'Quản lý'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 92
      },
      {
        id: 16,
        logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Digital Marketing & Performance Ads Lead',
        company: 'VinFast Auto',
        salary: '25 - 40 triệu',
        location: 'Hải Phòng & Hà Nội',
        category: 'marketing',
        skills: ['Digital Marketing', 'Facebook Ads', 'Google Ads', 'SEO'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 89
      },
      {
        id: 17,
        logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Content Marketing Lead & Sáng Tạo Nội Dung',
        company: 'VCCorp Corporation',
        salary: '18 - 28 triệu',
        location: 'Hà Nội',
        category: 'marketing',
        skills: ['Content Marketing', 'Copywriting', 'Social Media'],
        isPartner: false,
        postedDaysAgo: 3,
        interactionScore: 84
      },
      // 5. Ngành nghề khác
      {
        id: 18,
        logo: 'assets/logos/company-kimmari-64.svg',
        title: 'Quản Lý Nhà Hàng Kimmari Chicken',
        company: 'CHUỖI NHÀ HÀNG KIMMARI CHICKEN',
        salary: '15–25tr ₫/tháng',
        location: 'TP. Hồ Chí Minh',
        category: 'hospitality',
        skills: ['Quản lý', 'Nhà hàng', 'F&B', 'Dịch vụ'],
        isPartner: false,
        postedDaysAgo: 2,
        interactionScore: 81
      },
      {
        id: 19,
        logo: 'assets/logos/company-tanviet-64.svg',
        title: 'Technical Service Engineer – Industrial Printer',
        company: 'CÔNG TY TNHH THIẾT BỊ CÔNG NGHIỆP TÂN VIỆT',
        salary: 'Thương lượng',
        location: 'Bình Dương',
        category: 'eng',
        skills: ['Kỹ thuật', 'Bảo trì', 'Cơ điện'],
        isPartner: false,
        postedDaysAgo: 4,
        interactionScore: 78
      },
      {
        id: 20,
        logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Tuyển Dụng & Đào Tạo (HR Specialist)',
        company: 'Vinamilk Corporation',
        salary: '18 - 26 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'hr',
        skills: ['Tuyển dụng', 'HR', 'Nhân sự', 'Đào tạo'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 87
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
      saveHistory(history.slice(0, 6));
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

      history.slice(0, 6).forEach(item => {
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
      const clean = normalize(query);
      keywordList.innerHTML = '';

      // 1. Thu thập và tìm kiếm Công ty phù hợp
      const matchedCompanies = [];
      const seenCompanyKeys = new Set();

      const allCompaniesList = [...POPULAR_COMPANIES];
      RECOMMENDED_JOBS_POOL.forEach(j => {
        if (j.company && !allCompaniesList.some(c => c.name.toLowerCase() === j.company.toLowerCase())) {
          allCompaniesList.push({ name: j.company, shortName: j.company });
        }
      });

      allCompaniesList.forEach(comp => {
        const normName = normalize(comp.name);
        const normShort = normalize(comp.shortName || '');
        if (normName.includes(clean) || normShort.includes(clean)) {
          const key = comp.name.toLowerCase();
          if (!seenCompanyKeys.has(key)) {
            seenCompanyKeys.add(key);
            matchedCompanies.push({
              type: 'company',
              keyword: comp.shortName || comp.name,
              label: comp.name,
              searchKey: comp.shortName || comp.name
            });
          }
        }
      });

      // 2. Thu thập và tìm kiếm Việc làm phù hợp
      const matchedJobs = [];
      const seenJobKeys = new Set();

      // 2a. Việc làm từ dataset khớp theo title hoặc thuộc công ty được tìm
      RECOMMENDED_JOBS_POOL.forEach(job => {
        const normTitle = normalize(job.title);
        const normCompany = normalize(job.company || '');
        const isTitleMatch = normTitle.includes(clean);
        const isCompanyMatch = normCompany.includes(clean);

        if (isTitleMatch || isCompanyMatch) {
          const uniqueKey = `${job.title}__${job.company}`.toLowerCase();
          if (!seenJobKeys.has(uniqueKey)) {
            seenJobKeys.add(uniqueKey);
            matchedJobs.push({
              type: 'job',
              keyword: job.title,
              label: isCompanyMatch && !isTitleMatch ? `${job.title} — ${job.company}` : job.title,
              searchKey: job.title
            });
          }
        }
      });

      // 2b. Vai trò/vị trí chuẩn từ SUGGESTIONS
      SUGGESTIONS.forEach(item => {
        if (normalize(item.keyword).includes(clean)) {
          const key = item.keyword.toLowerCase();
          if (!seenJobKeys.has(key)) {
            seenJobKeys.add(key);
            matchedJobs.push({
              type: 'job',
              keyword: item.keyword,
              label: item.keyword,
              searchKey: item.keyword
            });
          }
        }
      });

      // 3. Phân bổ thông minh: hiển thị cả Công ty và Việc làm (tối đa 10 mục)
      let finalMatches = [];
      if (matchedCompanies.length > 0 && matchedJobs.length > 0) {
        const isCompanySearch = matchedCompanies.some(c => normalize(c.keyword) === clean || normalize(c.label).startsWith(clean));
        if (isCompanySearch) {
          finalMatches = [
            ...matchedCompanies.slice(0, 4),
            ...matchedJobs.slice(0, 6)
          ];
        } else {
          finalMatches = [
            ...matchedJobs.slice(0, 6),
            ...matchedCompanies.slice(0, 4)
          ];
        }
      } else {
        finalMatches = [...matchedCompanies, ...matchedJobs];
      }

      finalMatches = finalMatches.slice(0, 10);

      if (finalMatches.length === 0) {
        const row = document.createElement('div');
        row.className = 'keyword-suggestion-empty';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.innerHTML = `
          <svg class="kw-suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span class="kw-suggest-text">Tìm kiếm việc làm cho <strong>“${escapeHtml(query)}”</strong></span>
        `;
        bindSearchAction(row, query);
        keywordList.appendChild(row);
        return;
      }

      finalMatches.forEach(item => {
        const row = document.createElement('div');
        row.className = `keyword-suggestion-row is-${item.type}`;
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.innerHTML = `
          <div class="kw-suggest-left">
            ${item.type === 'company' ? `
              <svg class="kw-suggest-icon kw-icon-company" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M3 21h18M3 7v14M21 7v14M6 10h2M6 14h2M6 18h2M11 10h2M11 14h2M11 18h2M16 10h2M16 14h2M16 18h2M9 3h6v4H9z"/>
              </svg>
            ` : `
              <svg class="kw-suggest-icon kw-icon-job" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            `}
            <span class="kw-suggest-text" title="${escapeHtml(item.label)}">${highlightMatch(item.label, query)}</span>
          </div>
        `;
        bindSearchAction(row, item.searchKey || item.keyword);
        keywordList.appendChild(row);
      });
    }

    function extractIndustryKeywords(query) {
      const normQ = normalize(query || '');
      if (!normQ) return [];
      const keywordsSet = new Set();
      const taxData = window.EasyCVCategoryData || [];

      taxData.forEach(cat => {
        const catNameNorm = normalize(cat.name || '');
        const popMatches = (cat.popularKeywords || []).filter(pk => normalize(pk).includes(normQ));

        if (catNameNorm.includes(normQ) || popMatches.length > 0) {
          keywordsSet.add(cat.name);
          (cat.popularKeywords || []).forEach(pk => keywordsSet.add(pk));
          (cat.subgroups || []).forEach(sg => {
            (sg.roles || []).slice(0, 3).forEach(r => keywordsSet.add(r));
          });
        } else {
          (cat.subgroups || []).forEach(sg => {
            const titleMatch = normalize(sg.title || '').includes(normQ);
            const roleMatches = (sg.roles || []).filter(r => normalize(r).includes(normQ));
            if (titleMatch || roleMatches.length > 0) {
              keywordsSet.add(cat.name);
              keywordsSet.add(sg.title);
              roleMatches.forEach(r => keywordsSet.add(r));
            }
          });
        }
      });

      return Array.from(keywordsSet);
    }

    function renderRecommendedJobs(query = '') {
      if (!recommendedJobList) return;
      const clean = normalize(query);
      const isTyping = clean.length >= 2;

      let jobsToDisplay = [];
      if (!isTyping) {
        // 1. Khi chưa nhập: Đề xuất dựa trên hành vi search, view, save, CV và tín hiệu job
        let recentKws = [];
        try {
          recentKws = getHistory().map(item => normalize(typeof item === 'string' ? item : item.keyword));
        } catch (e) {}

        let savedJobIds = [];
        try {
          const rawSaved = localStorage.getItem('easycv_saved_jobs') || '[]';
          savedJobIds = JSON.parse(rawSaved);
        } catch (e) {}

        const scoredJobs = RECOMMENDED_JOBS_POOL.map(job => {
          let score = 50;
          const jobTextNorm = normalize(`${job.title} ${job.company} ${job.category || ''} ${(job.skills || []).join(' ')}`);

          const matchedRecent = recentKws.some(kw => kw && jobTextNorm.includes(kw));
          if (matchedRecent) score += 35;

          if (Array.isArray(savedJobIds) && (savedJobIds.includes(job.id) || savedJobIds.includes(String(job.id)))) {
            score += 30;
          }

          if (['sales', 'it', 'marketing', 'finance'].includes(job.category)) {
            score += 25;
          }

          if (job.isPartner) score += 20;
          if (job.postedDaysAgo && job.postedDaysAgo <= 2) score += 15;
          if (job.interactionScore) score += Math.round(job.interactionScore / 10);

          return { ...job, totalScore: score };
        });

        scoredJobs.sort((a, b) => b.totalScore - a.totalScore);
        jobsToDisplay = scoredJobs.slice(0, 5);
      } else {
        // 2. Khi đã nhập: Đề xuất dựa vào từ khóa nhập và truy xuất vào taxonomy ngành nghề
        const industryKeywords = extractIndustryKeywords(clean).map(kw => normalize(kw));

        const scoredJobs = RECOMMENDED_JOBS_POOL.map(job => {
          let score = 0;
          const titleNorm = normalize(job.title);
          const companyNorm = normalize(job.company);
          const catNorm = normalize(job.category || '');
          const skillsNorm = normalize((job.skills || []).join(' '));
          const fullJobText = `${titleNorm} ${companyNorm} ${catNorm} ${skillsNorm}`;

          if (titleNorm.includes(clean)) score += 60;
          if (skillsNorm.includes(clean)) score += 45;

          const matchedTaxonomy = industryKeywords.some(ikw => ikw && fullJobText.includes(ikw));
          if (matchedTaxonomy) score += 35;

          if (catNorm.includes(clean)) score += 25;
          if (companyNorm.includes(clean)) score += 15;

          const words = clean.split(/\s+/).filter(w => w.length > 1);
          const wordMatchCount = words.filter(w => fullJobText.includes(w)).length;
          score += wordMatchCount * 10;

          if (score > 0 && job.isPartner) score += 10;

          return { ...job, totalScore: score };
        });

        const matched = scoredJobs.filter(j => j.totalScore > 0);
        if (matched.length > 0) {
          matched.sort((a, b) => b.totalScore - a.totalScore);
          jobsToDisplay = matched.slice(0, 5);
        } else {
          jobsToDisplay = RECOMMENDED_JOBS_POOL.slice(0, 5);
        }
      }

      recommendedJobList.innerHTML = jobsToDisplay.map(job => `
        <button type="button" class="recommended-job" data-keyword="${escapeHtml(job.title)}" aria-label="Tìm ${escapeHtml(job.title)}, công ty ${escapeHtml(job.company)}, mức lương ${escapeHtml(job.salary)}, địa điểm ${escapeHtml(job.location || 'Toàn quốc')}">
          <span class="recommended-job-logo" aria-hidden="true" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
            <img src="${escapeHtml(job.logo)}" alt="" width="50" height="50" loading="lazy">
          </span>
          <span class="recommended-job-info">
            <span class="recommended-job-title">${highlightMatch(job.title, query)}</span>
            <span class="recommended-job-company">${escapeHtml(job.company)}</span>
            <div class="recommended-job-meta">
              <span class="recommended-job-salary">${escapeHtml(job.salary)}</span>
              <span class="recommended-job-loc" title="${escapeHtml(job.location || 'Toàn quốc')}">📍 ${escapeHtml(job.location || 'Toàn quốc')}</span>
            </div>
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
      const typing = query.length >= 2;
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
