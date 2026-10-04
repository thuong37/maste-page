const fs = require('fs');
const path = require('path');

function getDropdownMarkup(isTimViecCurrent) {
  const timViecClass = isTimViecCurrent ? 'nav-link is-current' : 'nav-link';
  const timViecAria = isTimViecCurrent ? 'aria-label="Tìm việc (Trang hiện tại)"' : 'aria-label="Tìm việc"';

  return `      <ul class="navbar-nav">

        <!-- Cột 1: Tìm việc -->
        <li class="nav-item">
          <a href="viec-lam.html" class="${timViecClass}" id="navLinkTimViec" ${timViecAria} title="Tìm việc">
            <span>Tìm việc</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </a>
          <div class="dropdown-menu">
            <a href="viec-lam.html" class="dropdown-item" id="dropdownItemTimKiemViecLam" title="Tìm kiếm việc làm">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Tìm kiếm việc làm</span>
              </div>
            </a>

            <a href="index.html#viec-lam-goi-y" class="dropdown-item" title="Việc làm gợi ý">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Việc làm gợi ý</span>
              </div>
            </a>

            <a href="index.html#viec-lam-da-luu" class="dropdown-item" title="Việc làm đã lưu">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Việc làm đã lưu</span>
              </div>
            </a>

            <div class="dropdown-divider"></div>

            <a href="index.html#kham-pha-cong-ty" class="dropdown-item" title="Khám phá công ty">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Khám phá công ty</span>
              </div>
            </a>
          </div>
        </li>

        <!-- Cột 2: Hồ sơ & CV -->
        <li class="nav-item">
          <button class="nav-link" aria-expanded="false" title="Hồ sơ & CV">
            <span>Hồ sơ & CV</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="dropdown-menu">
            <a href="index.html#ho-so-cua-toi" class="dropdown-item" title="Hồ sơ của tôi">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Hồ sơ của tôi</span>
              </div>
            </a>

            <a href="index.html#tao-cv-theo-mau" class="dropdown-item" title="Tạo CV theo mẫu">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Tạo CV theo mẫu</span>
              </div>
              <span class="badge-pill badge-hot">Hot</span>
            </a>

            <a href="index.html#quan-ly-cv" class="dropdown-item" title="Quản lý CV">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Quản lý CV</span>
              </div>
            </a>

            <a href="index.html#tai-len-cv" class="dropdown-item" title="Tải lên CV">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Tải lên CV</span>
              </div>
            </a>
          </div>
        </li>

        <!-- Cột 3: Ứng tuyển -->
        <li class="nav-item">
          <button class="nav-link" aria-expanded="false" title="Ứng tuyển">
            <span>Ứng tuyển</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="dropdown-menu">
            <a href="index.html#danh-sach-don-ung-tuyen" class="dropdown-item" title="Danh sách đơn ứng tuyển">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Danh sách đơn ứng tuyển</span>
              </div>
              <span class="badge-pill badge-count">3</span>
            </a>

            <a href="index.html#lich-phong-van" class="dropdown-item" title="Lịch phỏng vấn">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Lịch phỏng vấn</span>
              </div>
              <span class="badge-pill badge-new">1 mới</span>
            </a>

            <a href="index.html#bai-kiem-tra-nang-luc" class="dropdown-item" title="Bài kiểm tra năng lực">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Bài kiểm tra năng lực</span>
              </div>
            </a>
          </div>
        </li>

        <!-- Cột 4: Công cụ nghề nghiệp -->
        <li class="nav-item">
          <button class="nav-link" aria-expanded="false" title="Công cụ nghề nghiệp">
            <span>Công cụ nghề nghiệp</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="dropdown-menu">
            <a href="index.html#tinh-luong-gross-net" class="dropdown-item" title="Tính lương Gross - Net">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Tính lương Gross - Net</span>
              </div>
            </a>

            <a href="index.html#tinh-bao-hiem-xa-hoi" class="dropdown-item" title="Tính bảo hiểm xã hội">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Tính bảo hiểm xã hội</span>
              </div>
            </a>

            <a href="index.html#khao-sat-muc-luong" class="dropdown-item" title="Báo cáo thị trường lương">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Báo cáo thị trường lương</span>
              </div>
            </a>

            <a href="index.html#trac-nghiem-tinh-cach" class="dropdown-item" title="Trắc nghiệm MBTI / DISC">
              <div class="dropdown-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3.08A2.49 2.49 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3.08A2.49 2.49 0 0 0 14.5 2Z"/></svg>
              </div>
              <div class="dropdown-item-content">
                <span class="dropdown-item-title">Trắc nghiệm MBTI / DISC</span>
              </div>
            </a>
          </div>
        </li>

      </ul>`;
}

function updateFile(filePath, isTimViecCurrent) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCRLF = content.includes('\r\n');
  const newline = isCRLF ? '\r\n' : '\n';

  const startTag = '<ul class="navbar-nav">';
  const endTag = '</ul>';

  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    throw new Error(`Cannot find ${startTag} in ${filePath}`);
  }
  const endIndex = content.indexOf(endTag, startIndex) + endTag.length;

  const newMarkup = getDropdownMarkup(isTimViecCurrent).replace(/\r?\n/g, newline);
  content = content.slice(0, startIndex) + newMarkup + content.slice(endIndex);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath} successfully!`);
}

const targets = [
  { file: 'index.html', isTimViecCurrent: false },
  { file: 'viec-lam.html', isTimViecCurrent: true },
  { file: 'chi-tiet-viec-lam.html', isTimViecCurrent: true },
  { file: 'public/index.html', isTimViecCurrent: false },
  { file: 'public/viec-lam.html', isTimViecCurrent: true },
  { file: 'public/chi-tiet-viec-lam.html', isTimViecCurrent: true },
];

targets.forEach(({ file, isTimViecCurrent }) => {
  updateFile(path.resolve(__dirname, '..', file), isTimViecCurrent);
});

console.log('All files updated with exact direct titles successfully!');
