const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'viec-lam.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Update sticky search dropdown position
const oldSticky = `.hero-search-sticky-bar.is-sticky .search-suggest-dropdown {
  max-width: var(--container-max-width, 1250px);
  width: calc(100% - 40px);
  left: 0;
  right: 0;
  margin: 0 auto;
  top: calc(100% + 8px);
}`;

const newSticky = `.hero-search-sticky-bar.is-sticky .search-suggest-dropdown {
  left: var(--search-suggest-left, 210px);
  right: var(--search-suggest-right, 0);
  width: auto;
  max-width: none;
  margin: 0;
  top: calc(100% + 8px);
}`;

css = css.replace(oldSticky.replace(/\n/g, '\r\n'), newSticky.replace(/\n/g, '\r\n'));
css = css.replace(oldSticky, newSticky);

// 2. Replace Search Suggest Dropdown block
const startMarker = '/* Search Suggest Dropdown */';
const endMarker = '/* Quick Tags */';

const startIndex = css.indexOf(startMarker);
const endIndex = css.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const replacementSearchCSS = `/* Search Suggest Dropdown - Synchronized with Homepage 2-Column Standard */
.search-suggest-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: var(--search-suggest-left, 210px);
  right: var(--search-suggest-right, 0);
  width: auto;
  max-width: none;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  box-shadow: 0 24px 60px -18px rgba(15, 23, 42, 0.28);
  padding: 22px 26px !important;
  box-sizing: border-box;
  z-index: 1050;
  display: none;
}

.search-suggest-dropdown.is-open {
  display: block;
}

.search-suggest-dropdown > .suggest-divider,
.search-suggest-dropdown > .suggest-industry-section,
.search-suggest-dropdown > .suggest-footer {
  display: none;
}

/* Two-column layout: left (recent / suggestions + popular) | right (recommended jobs) */
.search-format-panel {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
  gap: 28px;
  min-height: 280px;
}

.search-format-left {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.search-format-left .suggest-section {
  gap: 10px;
  display: flex;
  flex-direction: column;
}

.search-format-left .suggest-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.search-format-left .suggest-title,
.popular-keywords h3,
.recommended-jobs h3 {
  margin: 0;
  color: #0F172A;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.search-format-left .btn-clear-history {
  color: #F97316;
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.search-format-left .btn-clear-history:hover {
  color: #EA580C;
  background: #FFF7ED;
  text-decoration: none;
}

/* Danh sách tìm kiếm gần đây (Chuẩn mẫu TopCV: Icon đồng hồ + Tên + Số lượng việc làm + Nút xóa X) */
.recent-chips-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.15s ease;
}

.recent-search-row:hover {
  background: #FFF7ED;
}

.recent-search-row:hover .recent-search-keyword {
  color: #EA580C;
}

.recent-search-icon {
  width: 16px;
  height: 16px;
  color: #94A3B8;
  flex-shrink: 0;
}

.recent-search-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.recent-search-keyword {
  font-size: 13.5px;
  font-weight: 500;
  color: #0F172A;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.recent-search-count {
  font-size: 11.5px;
  color: #94A3B8;
  line-height: 1.2;
}

.recent-search-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #94A3B8;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.recent-search-remove:hover {
  background: #FEE2E2;
  color: #EF4444;
}

.recent-empty-hint {
  font-size: 13px;
  color: #94A3B8;
  padding: 12px 0;
  display: block;
}

/* Từ khóa phổ biến (Pills) */
.popular-keywords {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px dashed #F1F5F9;
}

.popular-keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.popular-keyword-list .suggest-trend-chip {
  min-height: 32px;
  padding: 6px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #FFFFFF;
  color: #334155;
  font: 500 12.5px/1.2 inherit;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.popular-keyword-list .suggest-trend-chip:hover {
  border-color: #F97316;
  color: #EA580C;
  background: #FFF7ED;
}

/* =====================================================================
   TYPING MODE: Khi người dùng gõ phím -> Chuyển sang "Từ khóa gợi ý"
   ===================================================================== */
.search-format-left.is-typing .suggest-recent-section {
  display: none !important;
}

.search-format-left.is-typing .keyword-suggestions-section {
  display: flex !important;
}

.search-format-left.is-typing .popular-keywords {
  display: none !important;
}

.keyword-suggestions-section {
  display: none;
  flex-direction: column;
  gap: 8px;
}

.keyword-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.keyword-suggestion-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #0F172A;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.15s ease;
}

.keyword-suggestion-row:hover {
  background: #FFF7ED;
}

.keyword-suggestion-row:hover .kw-suggest-text {
  color: #EA580C;
}

.kw-suggest-icon {
  width: 16px;
  height: 16px;
  color: #94A3B8;
  flex-shrink: 0;
}

.kw-suggest-text {
  flex: 1;
  font-size: 13.5px;
  font-weight: 500;
  color: #0F172A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kw-suggest-text strong,
.kw-suggest-text em {
  font-style: normal;
  font-weight: 700;
  color: #F97316;
}

.kw-suggest-count {
  font-size: 12px;
  color: #94A3B8;
  white-space: nowrap;
  flex-shrink: 0;
}

.keyword-suggestion-empty {
  padding: 12px 10px;
  font-size: 13.5px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.keyword-suggestion-empty:hover {
  background: #FFF7ED;
  color: #EA580C;
}

.keyword-suggestion-empty strong {
  color: #F97316;
}

/* Right panel: Việc làm có thể bạn quan tâm */
.recommended-jobs {
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #F1F5F9;
  padding-left: 24px;
}

.recommended-jobs h3 {
  margin: 0 0 10px 0;
  color: #0F172A;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.recommended-job-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.recommended-job {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 6px;
  border: 0;
  border-bottom: 1px solid #F8FAFC;
  border-radius: 8px;
  background: transparent;
  color: #0F172A;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.15s ease;
}

.recommended-job:last-child {
  border-bottom: 0;
}

.recommended-job:hover {
  background: #F8FAFC;
}

.recommended-job:hover .recommended-job-title {
  color: #EA580C;
}

.recommended-job-logo {
  width: 50px;
  height: 50px;
  min-width: 50px;
  max-width: 50px;
  min-height: 50px;
  max-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.recommended-job-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}

.recommended-job-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recommended-job-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.35;
}

.recommended-job-company {
  font-size: 12px;
  color: #64748B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.recommended-job-salary {
  font-size: 12px;
  font-weight: 600;
  color: #EA580C;
  line-height: 1.25;
}

/* Dark Theme Support for Search Dropdown */
[data-theme='dark'] .search-suggest-dropdown {
  background: #0F172A;
  border-color: #334155;
  box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.6);
}

[data-theme='dark'] .search-format-left .suggest-title,
[data-theme='dark'] .popular-keywords h3,
[data-theme='dark'] .recommended-jobs h3 {
  color: #F8FAFC;
}

[data-theme='dark'] .recent-search-row:hover {
  background: #1E293B;
}

[data-theme='dark'] .recent-search-keyword {
  color: #E2E8F0;
}

[data-theme='dark'] .popular-keyword-list .suggest-trend-chip {
  background: #1E293B;
  border-color: #334155;
  color: #CBD5E1;
}

[data-theme='dark'] .popular-keyword-list .suggest-trend-chip:hover {
  background: #431407;
  border-color: #F97316;
  color: #FDBA74;
}

[data-theme='dark'] .keyword-suggestion-row {
  color: #F8FAFC;
}

[data-theme='dark'] .keyword-suggestion-row:hover {
  background: #1E293B;
}

[data-theme='dark'] .kw-suggest-text {
  color: #E2E8F0;
}

[data-theme='dark'] .recommended-jobs {
  border-left-color: #334155;
}

[data-theme='dark'] .recommended-job {
  border-bottom-color: #1E293B;
}

[data-theme='dark'] .recommended-job:hover {
  background: #1E293B;
}

[data-theme='dark'] .recommended-job-title {
  color: #F8FAFC;
}

[data-theme='dark'] .recommended-job-company {
  color: #94A3B8;
}

[data-theme='dark'] .recommended-job-logo {
  background: #1E293B;
  border-color: #334155;
}

/* Responsive Search Suggest Panel */
@media (max-width: 900px) {
  .search-suggest-dropdown {
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 16px !important;
  }

  .search-format-panel {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .recommended-jobs {
    border-left: none;
    border-top: 1px solid #F1F5F9;
    padding-left: 0;
    padding-top: 16px;
  }
}

`;

const updatedCSS = css.slice(0, startIndex) + replacementSearchCSS + css.slice(endIndex);
fs.writeFileSync(cssPath, updatedCSS, 'utf8');
console.log('Successfully updated css/viec-lam.css');
