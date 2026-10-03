const fs = require('fs');

// 1. Read JOBS_DATA from js/chi-tiet-viec-lam.js
const ctJs = fs.readFileSync('js/chi-tiet-viec-lam.js', 'utf8');
const match = ctJs.match(/const JOBS_DATA = (\[[\s\S]*?\]);\s*\n\s*\/\/ Helper Toast/);
if (!match) {
  console.error('Cannot find JOBS_DATA');
  process.exit(1);
}
const JOBS_DATA = eval(match[1]);

// 2. Generate 16 demo cards for splitListFeed (Flush edge-to-edge)
const relatedCardsHtml = JOBS_DATA.slice(0, 16).map(job => {
  const isSelected = job.id === 1;
  const salaryOrangeClass = job.salaryIsOrange ? 'orange' : '';
  const safeTitle = job.title.replace(/"/g, '&quot;');
  const urlTitle = encodeURIComponent(job.title);

  return `          <div class="split-job-card ${isSelected ? 'is-selected' : ''}" data-id="${job.id}">
            ${isSelected ? '<span class="split-active-badge">👁 Đang xem</span>\n' : ''}            <div class="split-card-top">
              <img src="${job.logo}" alt="${job.company}" class="split-company-logo" loading="lazy" />
              <div class="split-card-info">
                <h4 class="split-card-title">
                  <a href="chi-tiet-viec-lam.html?id=${job.id}&title=${urlTitle}" class="job-title-link">${safeTitle}</a>
                </h4>
                <div class="split-card-company">${job.company}</div>
                <div class="split-card-badges">
                  <span class="job-salary-badge ${salaryOrangeClass}" style="font-size: 12px; padding: 2px 7px;">${job.salaryBadge}</span>
                  <span class="badge-ai-match" style="font-size: 11px; padding: 2px 6px;">🎯 ${job.aiMatch}%</span>
                </div>
              </div>
            </div>
            <div class="split-card-bottom">
              <span class="split-card-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${job.city}</span>
              </span>
              <span style="font-size: 11.5px; color: #94A3B8;">${job.updated}</span>
            </div>
          </div>`;
}).join('\n');

const defaultJob = JOBS_DATA[0];
const descItems = defaultJob.jd.desc.map(d => `              <li>${d}</li>`).join('\n');
const reqItems = defaultJob.jd.reqs.map(r => `              <li>${r}</li>`).join('\n');
const perkItems = defaultJob.jd.perks.map(p => `              <li>${p}</li>`).join('\n');
const skillItems = defaultJob.skills.map(s => `              <span class="detail-skill-tag">${s}</span>`).join('\n');

const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="pageTitle">${defaultJob.title} | ${defaultJob.company} - Tuyển dụng EasyCV</title>
  <meta name="description" content="Xem chi tiết mô tả công việc, yêu cầu ứng viên, chế độ đãi ngộ và nộp hồ sơ ứng tuyển trực tuyến nhanh chóng trên EasyCV.">
  <link rel="icon" type="image/png" href="assets/logos/easycv-icon.png">
  <link rel="stylesheet" href="assets/design-tokens.css?v=1.1">
  <link rel="stylesheet" href="css/navbar.css?v=6.0_no_scrollbar">
  <link rel="stylesheet" href="css/home.css?v=4.3_cv_templates">
  <link rel="stylesheet" href="css/location-picker.css?v=2.0">
  <link rel="stylesheet" href="css/category-filter-modal.css?v=1.2_highlight">
  <link rel="stylesheet" href="css/viec-lam.css?v=8.2_clean_detail">
  <style>
    .single-job-hero {
      background: linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 50%, #F8FAFC 100%);
      border-bottom: 1px solid #E2E8F0;
      padding: 24px 0 24px 0;
    }
    .full-width-mode .job-split-container {
      grid-template-columns: 1fr !important;
    }
    .full-width-mode .split-list-pane {
      display: none !important;
    }
  </style>
  <!-- Khử triệt để thanh cuộn dọc/ngang xám trên Mobile Web và Simulator -->
  <style id="easycv-mobile-scrollbar-killer">
    @media (max-width: 1024px) {
      html, body, * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    }
    html.in-simulator,
    body.in-simulator,
    html.in-simulator *,
    body.in-simulator * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    html.in-simulator::-webkit-scrollbar,
    body.in-simulator::-webkit-scrollbar,
    .in-simulator ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }
  </style>
</head>
<body>

  <!-- Header & Navigation Bar -->
  <header class="site-header">
    <nav class="navbar" aria-label="Menu chính">
      <!-- 1. Logo Brand -->
      <a href="index.html" class="navbar-brand" aria-label="Trang chủ EasyCV">
        <img src="assets/logos/easycv-logo-transparent.png" alt="EasyCV Logo" class="brand-logo-img logo-light" />
        <img src="assets/logos/easycv-logo-dark.png" alt="EasyCV Logo Dark" class="brand-logo-img logo-dark" />
      </a>

      <!-- 2. Primary Nav Items -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="viec-lam.html" class="nav-link" aria-label="Tìm việc">
            <span>Tìm việc</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </a>
          <div class="dropdown-menu">
            <a href="viec-lam.html" class="dropdown-item">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Tìm kiếm việc làm</span>
              </div>
            </a>
            <a href="index.html#viec-lam-goi-y" class="dropdown-item">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Việc làm gợi ý</span>
              </div>
              <span class="badge-pill badge-new">AI Match</span>
            </a>
          </div>
        </li>

        <li class="nav-item">
          <a href="index.html#tao-cv-theo-mau" class="nav-link">
            <span>Hồ sơ & CV</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="index.html#danh-sach-don-ung-tuyen" class="nav-link">
            <span>Ứng tuyển</span>
          </a>
        </li>
      </ul>

      <!-- 3. Actions Right -->
      <div class="navbar-actions">
        <a href="#nha-tuyen-dung" class="btn-employer" title="Dành cho nhà tuyển dụng">
          Dành cho Nhà tuyển dụng
        </a>

        <!-- Thông báo -->
        <button id="notif-btn" class="action-icon-btn" aria-label="Xem thông báo" title="Thông báo mới">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="action-badge">3</span>
        </button>

        <!-- Tin nhắn -->
        <button id="message-btn" class="action-icon-btn" aria-label="Xem tin nhắn" title="Tin nhắn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span class="action-badge">2</span>
        </button>

        <!-- Tài khoản -->
        <div id="account-logged-view" class="account-logged-view">
          <button id="user-profile-btn" class="user-profile-btn" aria-label="Menu tài khoản cá nhân">
            <div class="user-avatar-wrap">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" alt="Avatar" class="user-avatar" />
              <span class="avatar-badge-online"></span>
            </div>
            <div class="user-meta">
              <span class="user-name">Nguyễn Văn A</span>
              <span class="user-role-badge">Hồ sơ <span>85%</span></span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  </header>

  <main class="page-wrapper" id="mainContainer">

    <!-- Hero Header / Breadcrumb & Smart Search Bar -->
    <section class="single-job-hero job-search-hero">
      <div class="job-search-container">
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
          <a href="index.html">Trang chủ</a>
          <span class="sep">/</span>
          <a href="viec-lam.html">Tìm kiếm việc làm</a>
          <span class="sep">/</span>
          <span class="current" id="breadcrumbJobTitle">${defaultJob.title}</span>
        </nav>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 20px;">
          <div>
            <h1 class="job-search-title" id="pageHeaderTitle" style="font-size: 24px; margin-bottom: 4px;">${defaultJob.title}</h1>
            <p class="job-search-subtitle" style="margin: 0;">Khám phá cơ hội nghề nghiệp và nộp hồ sơ trực tuyến trực tiếp tới nhà tuyển dụng</p>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a href="viec-lam.html" class="btn-back-to-grid" style="text-decoration: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Về danh sách việc làm</span>
            </a>
            <button type="button" class="btn-detail-action" id="btnToggleFullWidth" title="Chuyển đổi giao diện toàn màn hình">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              <span id="fullWidthToggleText">Xem toàn trang</span>
            </button>
          </div>
        </div>

        <!-- Search Input Form (Kế thừa thanh tìm kiếm thông minh từ Trang chủ) -->
        <div class="hero-search-wrapper job-search-wrapper" id="heroSearchWrapper">
          <div class="hero-search-sticky-bar" id="heroSearchStickyBar">
            <form class="hero-search-box job-search-box" id="jobSearchForm" action="viec-lam.html" method="GET">
              <!-- 1. Danh mục Nghề Button Trigger -->
              <button type="button" class="category-filter-trigger" id="categoryFilterTrigger" aria-haspopup="dialog" aria-expanded="false" aria-controls="categoryModalOverlay" title="Mở bộ lọc theo danh mục nghề">
                <svg class="category-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <circle cx="3.5" cy="6" r="1.5" fill="currentColor"></circle>
                  <circle cx="3.5" cy="12" r="1.5" fill="currentColor"></circle>
                  <circle cx="3.5" cy="18" r="1.5" fill="currentColor"></circle>
                </svg>
                <span id="categoryFilterLabel" class="category-label">Danh mục Nghề</span>
                <svg class="category-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              <div class="search-divider"></div>

              <!-- 2. Keyword input -->
              <div class="search-input-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" id="jobSearchInput" name="keyword" class="search-input" placeholder="Vị trí tuyển dụng, kỹ năng (vd: Java, React, Marketing...)" autocomplete="off" />
                <button type="button" id="clearSearchInputBtn" class="clear-search-btn" title="Xóa từ khóa" style="display: none;">✕</button>
              </div>

              <div class="search-divider"></div>

              <!-- 3. Location select & picker -->
              <div class="search-input-group search-location-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <button type="button" class="location-trigger" id="heroLocationTrigger" aria-haspopup="dialog" aria-expanded="false" aria-controls="heroLocationPicker">Tất cả địa điểm <span aria-hidden="true">⌄</span></button>
                <select class="search-select" id="jobLocationSelect" name="location" hidden aria-hidden="true">
                  <option value="">Tất cả địa điểm</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Remote">Remote / Toàn quốc</option>
                </select>
              </div>

              <!-- Location Picker Dialog / Popover 2 Cột -->
              <div class="location-picker" id="heroLocationPicker" role="dialog" aria-label="Chọn địa điểm" hidden>
                <div class="location-picker-modes">
                  <span>Tìm theo:</span>
                  <button type="button" class="location-mode is-active" data-mode="old" aria-pressed="true">◉ &nbsp; Tỉnh, Quận/huyện cũ</button>
                  <button type="button" class="location-mode" data-mode="new" aria-pressed="false">◯ &nbsp; Tỉnh, Phường/xã sau 1/7/2025 <b>Mới</b></button>
                </div>
                <div class="location-picker-columns">
                  <section class="location-picker-column">
                    <label class="location-picker-search">
                      <span aria-hidden="true">⌕</span>
                      <input id="locationProvinceSearch" type="search" placeholder="Nhập Tỉnh/Thành phố" autocomplete="off">
                    </label>
                    <div class="location-picker-list" id="locationProvinceList"></div>
                  </section>
                  <section class="location-picker-column">
                    <label class="location-picker-search">
                      <span aria-hidden="true">⌕</span>
                      <input id="locationDistrictSearch" type="search" placeholder="Nhập Quận/Huyện" autocomplete="off">
                    </label>
                    <div class="location-picker-list" id="locationDistrictList"></div>
                  </section>
                </div>
                <div class="location-picker-footer">
                  <button type="button" id="locationClearAll">Bỏ chọn tất cả</button>
                  <button type="button" id="locationApply">Áp dụng</button>
                </div>
              </div>

              <!-- Hidden inputs -->
              <input type="hidden" id="jobCategoryHidden" name="category" value="" />
              <input type="hidden" id="jobIndustryHidden" name="industry" value="" />

              <!-- 4. Submit button -->
              <button type="submit" class="btn-hero-search btn-search-submit" id="btnJobSearch">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>Tìm kiếm</span>
              </button>
            </form>

            <!-- Search Suggest Dropdown -->
            <div class="search-suggest-dropdown" id="searchSuggestDropdown">
              <div class="suggest-section suggest-recent-section">
                <div class="suggest-section-header">
                  <div class="suggest-title-group">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span class="suggest-title">Lịch sử tìm kiếm gần đây</span>
                  </div>
                  <button type="button" class="btn-clear-history" id="btnClearSearchHistory">Xóa tất cả</button>
                </div>
                <div class="recent-chips-list" id="recentSearchList"></div>
              </div>
              <div class="suggest-footer">
                <div class="suggest-footer-tip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span>Nhấn <strong>Enter</strong> để tìm kiếm • Bấm <strong>Esc</strong> để đóng</span>
                </div>
                <button type="button" class="btn-close-suggest" id="btnCloseSuggest">Đóng [Esc]</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Popover / Modal: Chọn Nhóm nghề, Nghề hoặc Chuyên môn -->
        <div class="category-modal-overlay" id="categoryModalOverlay" role="dialog" aria-modal="true" aria-labelledby="categoryModalTitle" hidden>
          <div class="category-modal-backdrop" id="categoryModalBackdrop"></div>
          <div class="category-modal-dialog">
            <div class="category-modal-header">
              <h2 class="category-modal-title" id="categoryModalTitle">Chọn Nhóm nghề, Nghề hoặc Chuyên môn</h2>
              <button type="button" class="category-modal-close" id="categoryModalClose" aria-label="Đóng bộ lọc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div class="category-modal-search-wrap">
              <div class="category-modal-search-box">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                <input type="search" id="categoryModalSearchInput" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off" />
                <button type="button" class="category-search-clear" id="categorySearchClear" title="Xóa tìm kiếm" hidden>✕</button>
              </div>
            </div>
            <div class="category-modal-body">
              <div class="category-panel-left">
                <div class="category-column-header">NHÓM NGHỀ</div>
                <div class="category-group-list" id="categoryGroupList"></div>
              </div>
              <div class="category-panel-right">
                <div class="category-right-headers">
                  <div class="category-column-header col-role">NGHỀ</div>
                  <div class="category-column-header col-specialty">VỊ TRÍ CHUYÊN MÔN</div>
                </div>
                <div class="category-subgroup-list" id="categorySubgroupList"></div>
                <div class="category-scroll-hint" id="categoryScrollHint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"></path></svg>
                  <span>Cuộn để xem</span>
                </div>
              </div>
            </div>
            <div class="category-modal-footer">
              <div class="category-footer-feedback">
                <span>Bạn gặp vấn đề với Danh mục Nghề?</span>
                <a href="javascript:void(0)" class="category-feedback-link" id="categoryFeedbackLink">Gửi góp ý</a>
              </div>
              <div class="category-footer-actions">
                <button type="button" class="btn-category-clear-all" id="btnCategoryClearAll">Bỏ chọn tất cả</button>
                <div class="action-divider"></div>
                <button type="button" class="btn-category-cancel" id="btnCategoryCancel">Hủy</button>
                <button type="button" class="btn-category-submit" id="btnCategorySubmit">Chọn</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 2 MAIN BLOCKS: KHỐI TRÁI LÀ DANH SÁCH JOB, KHỐI PHẢI LÀ MÔ TẢ JOB ĐÓ -->
    <div class="job-split-container">

      <!-- KHỐI BÊN TRÁI: DANH SÁCH JOB (Vừa khít 100% không padding 2 bên) -->
      <aside class="split-list-pane" id="splitListPane" aria-label="Danh sách việc làm phù hợp">
        <div class="split-list-header">
          <div class="split-list-title-group">
            <h3>Việc làm liên quan khác</h3>
            <div class="split-list-count">
              <strong id="splitJobCount">${JOBS_DATA.length}</strong> việc làm gợi ý
            </div>
          </div>
        </div>

        <div class="split-list-feed" id="splitListFeed">
${relatedCardsHtml}
        </div>
      </aside>

      <!-- KHỐI BÊN PHẢI: MÔ TẢ JOB ĐÓ (Đã gỡ bỏ top nav card như ảnh yêu cầu) -->
      <section class="split-detail-pane" id="splitDetailPane" aria-label="Mô tả chi tiết công việc">

        <div class="detail-scroll-area" id="detailScrollArea">
          <!-- Hero Section -->
          <div class="detail-hero-box">
            <div class="detail-hero-header">
              <img id="detailCompanyLogo" src="${defaultJob.logo}" alt="${defaultJob.company}" class="detail-company-logo" />
              <div class="detail-hero-info">
                <h2 id="detailJobTitle" class="detail-job-title">${defaultJob.title}</h2>
                <div class="detail-company-line">
                  <span id="detailCompanyName">${defaultJob.company}</span>
                  <span class="badge-verified" title="Doanh nghiệp xác thực">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#FFF" stroke-width="2"/></svg>
                  </span>
                </div>
                <div class="detail-badges-row">
                  <span id="detailAiMatchBadge" class="badge-ai-match">🎯 ${defaultJob.aiMatch}% Match</span>
                  <span id="detailSalaryBadge" class="job-salary-badge">${defaultJob.salaryBadge}</span>
                  <span class="job-meta-item" style="font-size: 13px; color: #64748B;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span id="detailLocationText">${defaultJob.location}</span>
                  </span>
                  <span class="job-meta-item" style="font-size: 13px; color: #64748B;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span id="detailUpdatedText">Cập nhật ${defaultJob.updated}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-cta-group">
              <button type="button" class="btn-detail-apply-main" id="btnDetailApply">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                <span>Nộp hồ sơ ứng tuyển ngay</span>
              </button>
              <button type="button" class="btn-detail-save-main" id="btnDetailSaveCard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                <span id="detailSaveBtnText">Lưu việc làm</span>
              </button>
              <button type="button" class="btn-detail-share-btn" id="btnCopyJobLink" title="Sao chép liên kết công việc">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="detail-metrics-grid">
            <div class="detail-metric-card">
              <div class="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Mức thu nhập</span>
                <span class="metric-value" id="metricSalary">${defaultJob.salaryBadge}</span>
              </div>
            </div>

            <div class="detail-metric-card">
              <div class="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Kinh nghiệm</span>
                <span class="metric-value" id="metricExp">3 - 5 năm</span>
              </div>
            </div>

            <div class="detail-metric-card">
              <div class="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Cấp bậc</span>
                <span class="metric-value" id="metricLevel">Senior / Leader</span>
              </div>
            </div>

            <div class="detail-metric-card">
              <div class="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Hình thức</span>
                <span class="metric-value" id="metricType">Kết hợp (Hybrid)</span>
              </div>
            </div>
          </div>

          <!-- Section: Mô tả công việc (JD) -->
          <div class="detail-section">
            <h3 class="detail-section-title">Mô tả công việc (Job Description)</h3>
            <ul class="detail-bullet-list" id="detailDescList">
${descItems}
            </ul>
          </div>

          <!-- Section: Yêu cầu ứng viên -->
          <div class="detail-section">
            <h3 class="detail-section-title">Yêu cầu ứng viên</h3>
            <ul class="detail-bullet-list" id="detailReqsList">
${reqItems}
            </ul>
          </div>

          <!-- Section: Quyền lợi & Đãi ngộ -->
          <div class="detail-section">
            <h3 class="detail-section-title">Quyền lợi & Chế độ đãi ngộ</h3>
            <ul class="detail-bullet-list" id="detailPerksList">
${perkItems}
            </ul>
          </div>

          <!-- Section: Kỹ năng chuyên môn -->
          <div class="detail-section">
            <h3 class="detail-section-title">Kỹ năng chuyên môn</h3>
            <div class="detail-skills-wrap" id="detailSkillsWrap">
${skillItems}
            </div>
          </div>

          <!-- Section: Công ty tuyển dụng -->
          <div class="detail-section" style="margin-bottom: 0;">
            <h3 class="detail-section-title">Về doanh nghiệp tuyển dụng</h3>
            <div class="detail-company-card">
              <div class="company-card-left">
                <img id="detailCompanyCardLogo" src="${defaultJob.logo}" alt="${defaultJob.company}" style="width: 48px; height: 48px; border-radius: 10px; border: 1px solid #E2E8F0; padding: 4px; object-fit: contain;" />
                <div class="company-card-info">
                  <h4 id="detailCompanyCardTitle">${defaultJob.company}</h4>
                  <p>Tập đoàn công nghệ hàng đầu Việt Nam - Doanh nghiệp đã xác thực trên EasyCV</p>
                </div>
              </div>
              <a href="index.html#kham-pha-cong-ty" class="btn-detail-action" style="white-space: nowrap;">Xem hồ sơ công ty →</a>
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Bar -->
        <div class="detail-sticky-apply-bar">
          <div class="sticky-bar-left">
            <div class="sticky-bar-title" id="stickyJobTitle">${defaultJob.title}</div>
            <div class="sticky-bar-salary" id="stickySalary">${defaultJob.salaryBadge}</div>
          </div>
          <button type="button" class="btn-detail-apply-main" id="btnStickyApply" style="padding: 10px 22px; font-size: 14px; flex: none;">
            <span>Ứng tuyển ngay</span>
          </button>
        </div>
      </section>

    </div>
  </main>

  <!-- Toast Message -->
  <div class="toast-msg" id="toastMsg"></div>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col-brand">
          <img src="assets/logos/easycv-logo-dark.png" alt="EasyCV Logo Footer" class="footer-brand-logo" />
          <p class="footer-brand-desc">
            <strong>EasyCV</strong> là hệ sinh thái công nghệ nhân sự và sàn giao dịch việc làm thông minh hàng đầu tại Việt Nam.
          </p>
        </div>
        <div>
          <h4 class="footer-col-title">Về EasyCV</h4>
          <ul class="footer-links-list">
            <li><a href="index.html#gioi-thieu" class="footer-link">Giới thiệu nền tảng</a></li>
            <li><a href="index.html#co-hoi-nghe-nghiep" class="footer-link">Tuyển dụng tại EasyCV</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Dành cho Ứng viên</h4>
          <ul class="footer-links-list">
            <li><a href="viec-lam.html" class="footer-link">Tìm kiếm việc làm mới</a></li>
            <li><a href="index.html#tao-cv-online" class="footer-link">Tạo CV online chuẩn ATS</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <div>© 2026 EasyCV Corporation. Toàn bộ bản quyền được bảo lưu.</div>
      </div>
    </div>
  </footer>

  <script src="js/location-picker.js?v=2.0"></script>
  <script src="js/category-filter-modal.js?v=1.0"></script>
  <script src="js/navbar.js?v=6.0_no_scrollbar"></script>
  <script src="js/chi-tiet-viec-lam.js?v=2.1_search_bar"></script>

  <!-- Floating View Mode Switcher Box (Rìa bên phải màn hình) -->
  <div class="floating-view-mode-box" id="floatingViewModeBox" role="region" aria-label="Bộ chuyển đổi chế độ xem Web và Mobile Web">
    <div class="floating-box-header">
      <div class="floating-box-title">
        <span class="floating-box-status-dot" id="floatingStatusDot"></span>
        <span>Chế độ xem</span>
      </div>
      <button type="button" class="floating-box-min-btn" id="floatingMinBtn" title="Thu gọn box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>

    <div class="floating-minimized-pill" id="floatingMinimizedPill" title="Bấm để mở rộng bảng điều khiển">
      <span class="floating-box-status-dot" id="floatingMiniStatusDot"></span>
      <span id="floatingMiniLabel">Web</span>
    </div>

    <div class="floating-mode-switcher">
      <button type="button" class="floating-mode-btn active" data-mode="web" id="floatingBtnWeb" title="Xem phiên bản Web Desktop">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        <span>Web</span>
      </button>
      <button type="button" class="floating-mode-btn" data-mode="mobile" id="floatingBtnMobile" title="Xem phiên bản Mobile Web">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
        <span>Mobile Web</span>
      </button>
    </div>

    <div class="floating-mobile-controls" id="floatingMobileControls">
      <div class="floating-preset-label">Thiết bị mô phỏng</div>
      <div class="floating-presets-grid">
        <button type="button" class="floating-preset-item active" data-width="390" data-height="844" title="iPhone 16 Pro (390 x 844)">
          <span>iPhone 16</span>
          <small>390×844</small>
        </button>
        <button type="button" class="floating-preset-item" data-width="412" data-height="915" title="Galaxy S24 (412 x 915)">
          <span>Galaxy S24</span>
          <small>412×915</small>
        </button>
        <button type="button" class="floating-preset-item" data-width="375" data-height="667" title="iPhone SE (375 x 667)">
          <span>iPhone SE</span>
          <small>375×667</small>
        </button>
      </div>

      <div class="floating-actions-row">
        <button type="button" class="floating-action-mini-btn" id="floatingRotateBtn" title="Xoay thiết bị ngang / dọc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Xoay</span>
        </button>
        <button type="button" class="floating-action-mini-btn" id="floatingRefreshBtn" title="Tải lại trang mobile">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          <span>Tải lại</span>
        </button>
      </div>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync('chi-tiet-viec-lam.html', fullHtml, 'utf8');
fs.writeFileSync('public/chi-tiet-viec-lam.html', fullHtml, 'utf8');
console.log('Successfully wrote chi-tiet-viec-lam.html and public/chi-tiet-viec-lam.html');
