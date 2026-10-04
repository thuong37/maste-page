const fs = require('fs');

// Generate the canonical header and drawer for a given page
function getCanonicalHeader(pageType) {
  const isTimViecCurrent = (pageType === 'viec-lam' || pageType === 'chi-tiet-viec-lam');
  const timViecClass = isTimViecCurrent ? 'nav-link is-current' : 'nav-link';
  const timViecAria = isTimViecCurrent ? 'aria-label="Tìm việc (Trang hiện tại)"' : 'aria-label="Tìm việc"';

  return `  <!-- Header & Navigation Bar -->
  <header class="site-header">
    <nav class="navbar" aria-label="Menu chính">

      <!-- 1. Logo Brand -->
      <a href="index.html" class="navbar-brand" id="navbarBrandLogo" aria-label="Trang chủ EasyCV">
        <img src="assets/logos/easycv-logo-transparent.png" alt="EasyCV Logo" class="brand-logo-img logo-light" />
        <img src="assets/logos/easycv-logo-dark.png" alt="EasyCV Logo Dark" class="brand-logo-img logo-dark" />
      </a>

      <!-- 2. Primary Nav Items (Left Menu) -->
      <ul class="navbar-nav">

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

      </ul>

      <!-- 3. Actions Right (Notifications, Messages, Account / Login) -->
      <div class="navbar-actions">

        <!-- Employer Portal Quick Link (TopCV/ITviec style) -->
        <a href="index.html#nha-tuyen-dung" class="btn-employer" title="Dành cho nhà tuyển dụng">
          Dành cho Nhà tuyển dụng
        </a>

        <!-- Cột 5: Thông báo (Notification Icon & Flyout) -->
        <div style="position: relative;">
          <button id="notif-btn" class="action-icon-btn" aria-label="Xem thông báo" title="Thông báo mới">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span id="notif-badge" class="action-badge">3</span>
          </button>

          <!-- Popover Panel Thông báo -->
          <div id="notif-panel" class="popover-panel">
            <div class="popover-header">
              <div class="popover-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span>Thông báo</span>
              </div>
              <button id="notif-mark-read" class="popover-action">Đánh dấu đã đọc</button>
            </div>
            <div class="popover-body">
              <a href="index.html#notif-1" class="popover-item unread">
                <div class="popover-item-icon" style="background: #F97316;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <div class="popover-item-title">Nhà tuyển dụng <strong>FPT Software</strong> đã xem hồ sơ CV của bạn</div>
                  <div class="popover-item-time">15 phút trước</div>
                </div>
              </a>
              <a href="index.html#notif-2" class="popover-item unread">
                <div class="popover-item-icon" style="background: #16A34A;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <div class="popover-item-title">Lời mời phỏng vấn vị trí <strong>Senior Frontend</strong> từ <strong>VNG Corp</strong></div>
                  <div class="popover-item-time">2 giờ trước</div>
                </div>
              </a>
              <a href="index.html#notif-3" class="popover-item unread">
                <div class="popover-item-icon" style="background: #0284C7;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                </div>
                <div>
                  <div class="popover-item-title">Có <strong>8 việc làm mới</strong> phù hợp 95% với kỹ năng React/TypeScript của bạn</div>
                  <div class="popover-item-time">Hôm qua</div>
                </div>
              </a>
            </div>
            <div class="popover-footer">
              <a href="index.html#xem-tat-ca-thong-bao" class="popover-footer-link">Xem tất cả thông báo</a>
            </div>
          </div>
        </div>

        <!-- Cột 6: Tin nhắn (Messages Icon & Flyout) -->
        <div style="position: relative;">
          <button id="message-btn" class="action-icon-btn" aria-label="Xem tin nhắn" title="Tin nhắn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span id="message-badge" class="action-badge">2</span>
          </button>

          <!-- Popover Panel Tin nhắn -->
          <div id="message-panel" class="popover-panel">
            <div class="popover-header">
              <div class="popover-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Tin nhắn tuyển dụng</span>
              </div>
              <button id="message-mark-read" class="popover-action">Đánh dấu đã đọc</button>
            </div>
            <div class="popover-body">
              <a href="index.html#chat-1" class="popover-item unread">
                <div class="popover-item-icon" style="background: #1E293B;">
                  <span style="font-weight: 700; font-size: 13px;">HR</span>
                </div>
                <div>
                  <div class="popover-item-title">HR Viettel Digital: <em>"Chào bạn, hồ sơ của bạn rất ấn tượng, bên mình muốn trao đổi thêm..."</em></div>
                  <div class="popover-item-time">10 phút trước</div>
                </div>
              </a>
              <a href="index.html#chat-2" class="popover-item unread">
                <div class="popover-item-icon" style="background: #0284C7;">
                  <span style="font-weight: 700; font-size: 13px;">MS</span>
                </div>
                <div>
                  <div class="popover-item-title">Mai Chi (Techcombank): <em>"Bạn có thể tham gia buổi technical interview vào thứ 5 tuần này không?"</em></div>
                  <div class="popover-item-time">1 giờ trước</div>
                </div>
              </a>
            </div>
            <div class="popover-footer">
              <a href="index.html#hop-thu-den" class="popover-footer-link">Mở hộp thư ứng tuyển</a>
            </div>
          </div>
        </div>

        <!-- Cột 7: Tài khoản (ĐÃ ĐĂNG NHẬP) -->
        <div id="account-logged-view" class="account-logged-view">
          <button id="user-profile-btn" class="user-profile-btn" aria-expanded="false" aria-label="Menu tài khoản cá nhân">
            <div class="user-avatar-wrap">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" alt="Avatar" class="user-avatar" />
              <span class="avatar-badge-online" title="Đang trực tuyến"></span>
            </div>
            <div class="user-meta">
              <span class="user-name">Nguyễn Văn A</span>
              <span class="user-role-badge">Hồ sơ <span>85%</span></span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--text-muted);"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          <!-- User Mega Dropdown Menu -->
          <div class="user-dropdown-menu" role="menu">

            <!-- Card tóm tắt hồ sơ người dùng -->
            <div class="user-dropdown-header">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" alt="Avatar lớn" class="dropdown-user-avatar" />
              <div class="dropdown-user-info">
                <div class="dropdown-user-name">Nguyễn Văn A</div>
                <div class="dropdown-user-email">nguyen.vana@easycv.vn</div>
                <div class="profile-completion-wrap">
                  <div class="completion-bar">
                    <div class="completion-progress"></div>
                  </div>
                  <span class="completion-percent">85% Hoàn thiện</span>
                </div>
              </div>
            </div>

            <div class="user-dropdown-body">

              <!-- 1. Tổng quan hoạt động -->
              <div class="menu-group">
                <a href="index.html#tong-quan-hoat-dong" class="menu-group-link" style="font-weight: 700;">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                    <span>Tổng quan hoạt động</span>
                  </div>
                  <span class="link-tag tag-orange">Dashboard</span>
                </a>
              </div>

              <!-- 2. Quản lý hồ sơ -->
              <div class="menu-group">
                <div class="menu-group-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                  <span>Quản lý hồ sơ</span>
                </div>
                <a href="index.html#ho-so-cua-toi" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Hồ sơ của tôi</span>
                  </div>
                  <span class="link-tag tag-green">Đã xác thực</span>
                </a>
                <a href="index.html#quan-ly-phien-ban-ho-so" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    <span>Quản lý phiên bản hồ sơ</span>
                  </div>
                  <span style="font-size: 11.5px; color: var(--text-muted);">2 phiên bản</span>
                </a>
              </div>

              <!-- 3. CV của tôi -->
              <div class="menu-group">
                <div class="menu-group-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/></svg>
                  <span>CV của tôi</span>
                </div>
                <a href="index.html#quan-ly-cv" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                    <span>Quản lý CV</span>
                  </div>
                  <span class="link-tag tag-orange">CV chính</span>
                </a>
                <a href="index.html#nha-tuyen-dung-xem-cv" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span>Nhà tuyển dụng xem CV</span>
                  </div>
                  <span class="link-tag tag-green">24 lượt xem</span>
                </a>
              </div>

              <!-- 4. Việc làm của tôi -->
              <div class="menu-group">
                <div class="menu-group-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <span>Việc làm của tôi</span>
                </div>
                <a href="index.html#viec-da-ung-tuyen" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Việc đã ứng tuyển</span>
                  </div>
                  <span class="badge-pill badge-count">5</span>
                </a>
                <a href="index.html#viec-da-luu" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    <span>Việc đã lưu</span>
                  </div>
                  <span style="font-size: 11.5px; color: var(--text-muted);">12</span>
                </a>
                <a href="index.html#viec-phu-hop" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                    <span>Việc phù hợp</span>
                  </div>
                  <span class="link-tag tag-orange">Top Match</span>
                </a>
                <a href="index.html#loi-moi-cong-viec" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
                    <span>Lời mời công việc</span>
                  </div>
                  <span class="link-tag tag-green">2 lời mời</span>
                </a>
                <a href="index.html#cai-dat-goi-y-viec-lam" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span>Cài đặt gợi ý việc làm</span>
                  </div>
                </a>
              </div>

              <!-- 5. Cài đặt -->
              <div class="menu-group">
                <div class="menu-group-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <span>Cài đặt</span>
                </div>
                <a href="index.html#cai-dat-thong-bao-viec-lam" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                    <span>Cài đặt thông báo việc làm</span>
                  </div>
                </a>
                <a href="index.html#cai-dat-nhan-email" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <span>Cài đặt nhận email</span>
                  </div>
                </a>
              </div>

              <!-- 6. Cá nhân và bảo mật -->
              <div class="menu-group">
                <div class="menu-group-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Cá nhân và bảo mật</span>
                </div>
                <a href="index.html#cai-dat-thong-tin-ca-nhan" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Cài đặt thông tin cá nhân</span>
                  </div>
                </a>
                <a href="index.html#cai-dat-bao-mat" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>Cài đặt bảo mật</span>
                  </div>
                </a>
                <a href="index.html#doi-mat-khau" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L10 10l-1.5-1.5L6 11l-4 4v5h5l4-4 2.5 2.5L16 13l-1.5-1.5 3.5-3.5 2-2Z"/></svg>
                    <span>Đổi mật khẩu</span>
                  </div>
                </a>
                <a href="index.html#xac-minh-2-buoc" class="menu-group-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Xác minh 2 bước</span>
                  </div>
                  <span class="link-tag tag-green">Bật</span>
                </a>
              </div>

              <!-- 7. Đăng xuất -->
              <div class="menu-group">
                <a href="index.html#dang-xuat" class="menu-group-link menu-logout-link">
                  <div class="menu-group-link-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    <span>Đăng xuất</span>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>

        <!-- Mobile Menu Toggle Button (Hamburger) -->
        <button id="mobile-toggle-btn" class="mobile-toggle-btn" aria-label="Mở menu trên điện thoại">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

      </div>
    </nav>
  </header>`;
}

function getCanonicalDrawer() {
  return `  <!-- Mobile Navigation Drawer -->
  <div id="mobile-drawer-overlay" class="mobile-drawer-overlay">
    <div class="mobile-drawer">
      <div class="mobile-drawer-header">
        <a href="index.html" aria-label="Trang chủ EasyCV">
          <img src="assets/logos/easycv-logo-transparent.png" alt="EasyCV Logo" style="height: 32px; width: auto;" />
        </a>
        <button id="mobile-drawer-close" class="mobile-drawer-close" aria-label="Đóng menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </button>
      </div>

      <div class="mobile-drawer-body">
        <!-- 1. Tìm việc -->
        <div class="mobile-nav-item">
          <div class="mobile-nav-title">
            <span>Tìm việc</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="mobile-sub-menu">
            <a href="viec-lam.html" class="mobile-sub-link" id="mobileLinkTimKiemViecLam">Tìm kiếm việc làm</a>
            <a href="index.html#viec-lam-goi-y" class="mobile-sub-link">Việc làm gợi ý</a>
            <a href="index.html#viec-lam-da-luu" class="mobile-sub-link">Việc làm đã lưu</a>
            <a href="index.html#kham-pha-cong-ty" class="mobile-sub-link">Khám phá công ty</a>
          </div>
        </div>

        <!-- 2. Hồ sơ & CV -->
        <div class="mobile-nav-item">
          <div class="mobile-nav-title">
            <span>Hồ sơ & CV</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="mobile-sub-menu">
            <a href="index.html#ho-so-cua-toi" class="mobile-sub-link">Hồ sơ của tôi</a>
            <a href="index.html#tao-cv-theo-mau" class="mobile-sub-link">Tạo CV theo mẫu</a>
            <a href="index.html#quan-ly-cv" class="mobile-sub-link">Quản lý CV</a>
            <a href="index.html#tai-len-cv" class="mobile-sub-link">Tải lên CV</a>
          </div>
        </div>

        <!-- 3. Ứng tuyển -->
        <div class="mobile-nav-item">
          <div class="mobile-nav-title">
            <span>Ứng tuyển</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="mobile-sub-menu">
            <a href="index.html#danh-sach-don-ung-tuyen" class="mobile-sub-link">Danh sách đơn ứng tuyển</a>
            <a href="index.html#lich-phong-van" class="mobile-sub-link">Lịch phỏng vấn</a>
            <a href="index.html#bai-kiem-tra-nang-luc" class="mobile-sub-link">Bài kiểm tra năng lực</a>
          </div>
        </div>

        <!-- 4. Công cụ nghề nghiệp -->
        <div class="mobile-nav-item">
          <div class="mobile-nav-title">
            <span>Công cụ nghề nghiệp</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="mobile-sub-menu">
            <a href="index.html#tinh-luong-gross-net" class="mobile-sub-link">Tính lương Gross - Net</a>
            <a href="index.html#tinh-bao-hiem-xa-hoi" class="mobile-sub-link">Tính bảo hiểm xã hội</a>
            <a href="index.html#khao-sat-muc-luong" class="mobile-sub-link">Khảo sát mức lương</a>
            <a href="index.html#trac-nghiem-tinh-cach" class="mobile-sub-link">Trắc nghiệm tính cách MBTI</a>
          </div>
        </div>

        <div style="margin: 20px 0; border-top: 1px solid var(--border-color);"></div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="index.html#nha-tuyen-dung" class="btn-employer" style="text-align: center; border: 1px solid var(--border-color);">
            Dành cho Nhà tuyển dụng
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

module.exports = { getCanonicalHeader, getCanonicalDrawer };
console.log('Canonical templates defined.');
