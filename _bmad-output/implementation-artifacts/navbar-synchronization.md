# Tài Liệu Triển Khai: Đồng Bộ Hóa Thanh Menu (Navbar & Mobile Drawer) Toàn Nền Tảng EasyCV

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Ngày cập nhật: **03/10/2026**  
Màn hình áp dụng: **Trang chủ (`index.html`), Danh sách việc làm (`viec-lam.html`), Chi tiết việc làm (`chi-tiet-viec-lam.html`)**

---

## 1. Bối Cảnh & Vấn Đề Người Dùng Phản Ánh

Người dùng phản ánh:
> *"khi chuyển qua các trang, tại sao thanh menu lại k đồng bộ vậy"*

### Bảng Ma Trận So Sánh Khác Biệt Trước Khi Sửa Lỗi

| Thành phần thanh menu | Trang chủ (`index.html`) | Danh sách việc làm (`viec-lam.html`) | Chi tiết việc làm (`chi-tiet-viec-lam.html`) | Nguyên nhân lỗi |
| :--- | :--- | :--- | :--- | :--- |
| **Cột 1: Tìm việc** | Có dropdown 4 mục (Tìm kiếm, Gợi ý, Đã lưu, Khám phá công ty) | Có dropdown 4 mục | Bị cắt chỉ còn 2 mục | Mã nguồn trang chi tiết copy từ bản phác thảo cũ |
| **Cột 2: Hồ sơ & CV** | Có dropdown 4 mục (Hồ sơ, Tạo CV, Quản lý, Tải lên) | Chỉ có 2 mục | **Không có dropdown** (link trơ) | Thiếu markup thẻ dropdown menu |
| **Cột 3: Ứng tuyển** | Có dropdown 3 mục (Danh sách đơn, Lịch PV, Bài test) | Chỉ có 1 mục | **Không có dropdown** (link trơ) | Thiếu markup thẻ dropdown menu |
| **Cột 4: Công cụ nghề nghiệp** | Có dropdown 4 mục (Gross-Net, BHXH, Báo cáo lương, MBTI) | Chỉ có 1 mục | **Bị mất hoàn toàn** | Bị xóa khỏi thanh menu |
| **Hộp thoại Thông báo** (`#notif-panel`) | Có đầy đủ flyout panel 3 thông báo + nút Đánh dấu đã đọc | **Không có panel** (Click chuông không có tác dụng) | **Không có panel** (Click chuông không có tác dụng) | DOM bị thiếu thẻ `#notif-panel` |
| **Hộp thoại Tin nhắn** (`#message-panel`) | Có đầy đủ flyout panel 2 tin nhắn chat + nút Đánh dấu đã đọc | **Không có panel** (Click icon không có tác dụng) | **Không có panel** (Click icon không có tác dụng) | DOM bị thiếu thẻ `#message-panel` |
| **Menu Tài khoản Người dùng** (`.user-dropdown-menu`) | Có Mega Dropdown 7 nhóm đầy đủ (Tổng quan, Quản lý hồ sơ, CV của tôi, Việc làm của tôi, Cài đặt, Bảo mật, Đăng xuất) | **Không có dropdown** (Click avatar không có tác dụng) | **Không có dropdown** (Click avatar không có tác dụng) | DOM bị thiếu thẻ `.user-dropdown-menu` |
| **Nút Hamburger & Mobile Drawer** | Có nút mở drawer và bảng trượt menu di động | Drawer cũ bị cắt bớt mục, nút quay về trang chủ sai lệch | **Không có nút hamburger, không có Mobile Drawer** | Thao tác trên điện thoại bị mất menu điều hướng |
| **Liên kết Anchor Menu con** | Dùng link cục bộ `#viec-lam-goi-y`, `#ho-so-cua-toi` | Dùng link `index.html#...` nửa vời | Không có | Khi đang ở trang con, click vào link cục bộ `#...` không nhảy về được trang chủ |
| **Trạng thái Active (Current Page)** | Không cần active | "Tìm việc" không hiển thị rõ trạng thái đang xem | "Tìm việc" không hiển thị rõ trạng thái đang xem | Thiếu class nhận diện `.is-current` và CSS active |

---

## 2. Giải Pháp Kỹ Thuật Đã Triển Khai

### 2.1. Cấu Trúc Canonical HTML Chuẩn Hóa
Đã thống nhất 100% cấu trúc HTML của `<header class="site-header">` và `<div id="mobile-drawer-overlay">` trên cả 3 trang và bản sao `public/`:
1. **Logo EasyCV (`.navbar-brand`):** Luôn điều hướng về `index.html` với kích thước chuẩn hiển thị sắc nét.
2. **4 Cột Menu Chính:**
   - **Tìm việc:** Điều hướng đến `viec-lam.html`. Trên `viec-lam.html` và `chi-tiet-viec-lam.html`, link được gán class `is-current` với nền cam nhạt và chữ cam thương hiệu. Dropdown gồm: *Tìm kiếm việc làm (`viec-lam.html`), Việc làm gợi ý (`index.html#viec-lam-goi-y`), Việc làm đã lưu (`index.html#viec-lam-da-luu`), Khám phá công ty (`index.html#kham-pha-cong-ty`)*.
   - **Hồ sơ & CV:** Dropdown gồm: *Hồ sơ của tôi (`index.html#ho-so-cua-toi`), Tạo CV theo mẫu (`index.html#tao-cv-theo-mau`), Quản lý CV (`index.html#quan-ly-cv`), Tải lên CV (`index.html#tai-len-cv`)*.
   - **Ứng tuyển:** Dropdown gồm: *Danh sách đơn ứng tuyển (`index.html#danh-sach-don-ung-tuyen`), Lịch phỏng vấn (`index.html#lich-phong-van`), Bài kiểm tra năng lực (`index.html#bai-kiem-tra-nang-luc`)*.
   - **Công cụ nghề nghiệp:** Dropdown gồm: *Tính lương Gross - Net (`index.html#tinh-luong-gross-net`), Tính bảo hiểm xã hội (`index.html#tinh-bao-hiem-xa-hoi`), Báo cáo thị trường lương (`index.html#khao-sat-muc-luong`), Trắc nghiệm MBTI / DISC (`index.html#trac-nghiem-tinh-cach`)*.
3. **Cụm Tác Vụ Phải (`.navbar-actions`):**
   - Nút **Dành cho Nhà tuyển dụng** (`index.html#nha-tuyen-dung`).
   - Icon **Thông báo** (`#notif-btn`) + Popover Panel (`#notif-panel`) với 3 thông báo chưa đọc, nút đánh dấu đã đọc và liên kết xem tất cả.
   - Icon **Tin nhắn** (`#message-btn`) + Popover Panel (`#message-panel`) với 2 tin nhắn HR tuyển dụng chưa đọc và liên kết mở hộp thư.
   - Khối **Tài khoản cá nhân** (`#account-logged-view`): Avatar trực tuyến, tên Nguyễn Văn A, badge Hồ sơ 85%, kèm Mega Dropdown Menu 7 nhóm chuẩn hóa.
   - Nút **Hamburger di động** (`#mobile-toggle-btn`).
4. **Mobile Navigation Drawer (`#mobile-drawer-overlay`):** Bảng trượt accordion 4 nhóm tính năng và nút chuyển đổi Nhà tuyển dụng.

### 2.2. Nâng Cấp CSS (`css/navbar.css` & `public/css/navbar.css`)
Bổ sung bộ quy tắc CSS nhận diện trạng thái active và hover cho menu link:
```css
.nav-link:hover,
.nav-link.active,
.nav-link.is-current,
.nav-item.open .nav-link {
  color: var(--easycv-orange);
  background: var(--easycv-orange-50);
}

[data-theme="dark"] .nav-link:hover,
[data-theme="dark"] .nav-link.active,
[data-theme="dark"] .nav-link.is-current,
[data-theme="dark"] .nav-item.open .nav-link {
  background: rgba(249, 115, 22, 0.15);
  color: var(--easycv-orange-400);
}

.nav-link.active .chevron-icon,
.nav-link.is-current .chevron-icon {
  color: var(--easycv-orange);
}
```

### 2.3. Nâng Cấp JavaScript (`js/navbar.js` & `public/js/navbar.js`)
- Xử lý mở/đóng an toàn với Optional Chaining (`?.`).
- Thay thế class toggle của dropdown desktop từ `active` sang `open` để không xung đột với trạng thái `.active` / `.is-current` của trang hiện tại.
- Tự động nhận diện URL trang hiện tại để highlight tab phù hợp:
```javascript
const currentPath = window.location.pathname.toLowerCase();
const navLinkTimViec = document.getElementById('navLinkTimViec');
if (currentPath.includes('viec-lam') || currentPath.includes('chi-tiet-viec-lam')) {
  navLinkTimViec?.classList.add('is-current');
}
```

---

## 3. Danh Sách Tệp Đã Cập Nhật

1. [`index.html`](file:///d:/master%20page/index.html) & [`public/index.html`](file:///d:/master%20page/public/index.html)
2. [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) & [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html)
3. [`chi-tiet-viec-lam.html`](file:///d:/master%20page/chi-tiet-viec-lam.html) & [`public/chi-tiet-viec-lam.html`](file:///d:/master%20page/public/chi-tiet-viec-lam.html)
4. [`css/navbar.css`](file:///d:/master%20page/css/navbar.css) & [`public/css/navbar.css`](file:///d:/master%20page/public/css/navbar.css)
5. [`js/navbar.js`](file:///d:/master%20page/js/navbar.js) & [`public/js/navbar.js`](file:///d:/master%20page/public/js/navbar.js)

---

## 4. Kết Quả Kiểm Thử Tự Động (Chrome CDP Test)

Kịch bản kiểm thử độc lập [`scratch/test_navbar_sync.js`](file:///d:/master%20page/scratch/test_navbar_sync.js) chạy trên Google Chrome Headless kết nối cổng HTTP 3000:

| Hạng mục kiểm thử | Trang chủ (`index.html`) | Danh sách việc làm (`viec-lam.html`) | Chi tiết việc làm (`chi-tiet-viec-lam.html`) | Kết quả |
| :--- | :--- | :--- | :--- | :--- |
| **Chiều cao Header chuẩn 72-73px** | 73 px | 73 px | 73 px | **PASS** |
| **Kích thước & Logo link (`index.html`)** | `index.html` | `index.html` | `index.html` | **PASS** |
| **Số lượng cột Menu chính (4 cột)** | 4 | 4 | 4 | **PASS** |
| **Dropdown items chi tiết** | 4 - 4 - 3 - 4 | 4 - 4 - 3 - 4 | 4 - 4 - 3 - 4 | **PASS** |
| **Highlight trang hiện tại (`.is-current`)** | Mặc định không highlight | "Tìm việc" `.is-current` | "Tìm việc" `.is-current` | **PASS** |
| **Mở Flyout Thông báo (`#notif-panel`)** | `isOpen: true` | `isOpen: true` | `isOpen: true` | **PASS** |
| **Mở Flyout Tin nhắn (`#message-panel`)** | `isOpen: true` | `isOpen: true` | `isOpen: true` | **PASS** |
| **Mở Mega Dropdown User Profile** | `isOpen: true` | `isOpen: true` | `isOpen: true` | **PASS** |
| **Hamburger & Mobile Drawer (390x844)** | `isOpen: true` | `isOpen: true` | `isOpen: true` | **PASS** |
