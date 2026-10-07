const fs = require('fs');

// 1. Read existing chi-tiet-viec-lam.html to preserve head, header, footer, floating box
const originalHtml = fs.readFileSync('chi-tiet-viec-lam.html', 'utf8');

// 2. Read JOBS_DATA
const ctJs = fs.readFileSync('js/chi-tiet-viec-lam.js', 'utf8');
const match = ctJs.match(/const JOBS_DATA = (\[[\s\S]*?\]);\s*\n\s*\/\/ Helper Toast/);
if (!match) {
  console.error('Cannot find JOBS_DATA');
  process.exit(1);
}
const JOBS_DATA = eval(match[1]);

// 3. Generate 16 demo cards for splitListFeed
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

// 4. Default job detail mock content
const defaultJob = JOBS_DATA[0];
const descItems = defaultJob.jd.desc.map(d => `              <li>${d}</li>`).join('\n');
const reqItems = defaultJob.jd.reqs.map(r => `              <li>${r}</li>`).join('\n');
const perkItems = defaultJob.jd.perks.map(p => `              <li>${p}</li>`).join('\n');
const skillItems = defaultJob.skills.map(s => `              <span class="detail-skill-tag">${s}</span>`).join('\n');

// Replace the main block inside originalHtml
const startTag = '<main class="page-wrapper" id="mainContainer">';
const endTag = '</main>';

const startIndex = originalHtml.indexOf(startTag);
const endIndex = originalHtml.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('Cannot locate <main> tag in chi-tiet-viec-lam.html');
  process.exit(1);
}

const beforeMain = originalHtml.substring(0, startIndex);
const afterMain = originalHtml.substring(endIndex + endTag.length);

const newMain = `<main class="page-wrapper" id="mainContainer">

    <!-- Hero Header / Breadcrumb -->
    <section class="single-job-hero">
      <div class="job-search-container">
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
          <a href="index.html">Trang chủ</a>
          <span class="sep">/</span>
          <a href="viec-lam.html">Tìm kiếm việc làm</a>
          <span class="sep">/</span>
          <span class="current" id="breadcrumbJobTitle">Senior Fullstack Developer (ReactJS / Node.js)</span>
        </nav>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div>
            <h1 class="job-search-title" id="pageHeaderTitle" style="font-size: 24px; margin-bottom: 4px;">Senior Fullstack Developer (ReactJS / Node.js)</h1>
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
      </div>
    </section>

    <!-- 2 MAIN BLOCKS: KHỐI TRÁI LÀ DANH SÁCH JOB, KHỐI PHẢI LÀ MÔ TẢ JOB ĐÓ -->
    <div class="job-split-container">

      <!-- KHỐI BÊN TRÁI: DANH SÁCH JOB -->
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

      <!-- KHỐI BÊN PHẢI: MÔ TẢ JOB ĐÓ -->
      <section class="split-detail-pane" id="splitDetailPane" aria-label="Mô tả chi tiết công việc">
        <div class="detail-top-nav">
          <a href="viec-lam.html" class="btn-back-to-grid" style="text-decoration: none;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Quay lại trang tìm việc</span>
          </a>
          <div class="detail-top-actions">
            <button type="button" class="btn-detail-action" id="btnCopyJobLink" title="Sao chép liên kết công việc">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Chia sẻ</span>
            </button>
            <button type="button" class="btn-detail-action btn-bookmark-action" id="btnDetailBookmark" title="Lưu công việc">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              <span id="detailBookmarkText">Lưu tin</span>
            </button>
          </div>
        </div>

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
                <span>Ứng tuyển ngay</span>
              </button>
              <button type="button" class="btn-detail-save-main" id="btnDetailSaveCard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                <span id="detailSaveBtnText">Lưu việc làm</span>
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
  </main>`;

// Also update page title tag in head
let finalHtml = beforeMain + newMain + afterMain;
finalHtml = finalHtml.replace(
  /<title id="pageTitle">.*?<\/title>/,
  `<title id="pageTitle">${defaultJob.title} | ${defaultJob.company} - Tuyển dụng EasyCV</title>`
);

fs.writeFileSync('chi-tiet-viec-lam.html', finalHtml, 'utf8');
fs.writeFileSync('public/chi-tiet-viec-lam.html', finalHtml, 'utf8');
console.log('Successfully generated chi-tiet-viec-lam.html and public/chi-tiet-viec-lam.html');
