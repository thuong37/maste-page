# Tài Liệu Triển Khai: Thanh Tìm Kiếm Cố Định Neo Đầu Trang (Sticky Search Bar) Khi Cuộn Chuột Trên EasyCV

## 1. Mục Đích & Quyết Định
- **Yêu cầu từ người dùng:** "khi tôi kéo cuộn chuột xuống thì thanh tìm kiếm vẫn phải được neo ở phía trên , để người dùng có thể tiếp tục tìm kiếm khi cần thiết mà không cần phải cuộn chuột lên đầu trang".
- **Mục tiêu UX/UI & Trải nghiệm tuyển dụng thông minh:**
  - **Khám phá việc làm liền mạch:** Khi ứng viên cuộn chuột xuống để xem danh sách "Việc làm nổi bật", "Mẫu CV", hay "Ngành nghề xu hướng", thanh tìm kiếm không bị trôi mất mà tự động neo lại cố định ngay bên dưới thanh điều hướng (navbar).
  - **Tìm kiếm tức thì không cần cuộn ngược:** Ứng viên có thể gõ từ khóa, thay đổi tỉnh thành hoặc bấm nút "Tìm việc ngay" bất kỳ lúc nào từ bất kỳ vị trí nào trên trang.
  - **Zero Layout Shift (Không giật khung):** Khung chứa `.hero-search-wrapper` được duy trì placeholder chiều cao chuẩn 60px, đảm bảo khi thanh tìm kiếm chuyển sang trạng thái cố định (`is-sticky`), các thành phần bên dưới (quick-tags, banner quảng cáo) không bị nhảy hay giật khung dù chỉ 1 pixel.
  - **Hiệu ứng Glassmorphism sang trọng:** Thanh neo sử dụng nền trắng mờ cao cấp (`background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px)`), viền cam `#F97316` nổi bật và đổ bóng nhẹ đa tầng, trượt xuống (`slideDownStickyBar`) mượt mà.
  - **Tự động hoàn nguyên:** Khi cuộn ngược lên đầu trang, thanh tìm kiếm tự động trở về vị trí tĩnh trong khu vực Hero.
- **Phương pháp quản trị:** BMAD (BMM Method).

---

## 2. Bảng Phân Tích Kỹ Thuật

| Trạng thái | Phần tử | Thuộc tính CSS & Hành vi |
| :--- | :--- | :--- |
| **Ở đầu trang (`scrollY = 0`)** | `.hero-search-wrapper`<br>`.hero-search-sticky-bar` | Nằm tự nhiên trong luồng tài liệu (static/relative) tại Hero section, `height: 60px`. |
| **Khi cuộn xuống (`scrollY >= 35px`)** | `.hero-search-sticky-bar.is-sticky` | - `position: fixed; top: 72px; width: 100%; z-index: 880`<br>- `background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px)`<br>- Box tìm kiếm giữ nguyên viền cam `#F97316` và độ cao 60px<br>- Dropdown gợi ý và bộ chọn địa điểm mở trực tiếp bên dưới thanh neo |
| **Placeholder giữ chỗ** | `.hero-search-wrapper` | `min-height: 60px` ngăn ngừa hoàn toàn hiện tượng layout shift khi thanh tìm kiếm tách khỏi luồng |
| **Responsive Mobile (< 768px)** | `.hero-search-sticky-bar.is-sticky` | `padding: 6px 0`, box tìm kiếm tự động co dãn linh hoạt, không chiếm dụng màn hình |

---

## 3. Danh Sách Tệp Đã Cập Nhật & Đồng Bộ
1. [`index.html`](file:///d:/master%20page/index.html):
   - Thêm container bọc `<div class="hero-search-sticky-bar" id="heroSearchStickyBar">`.
   - Thêm critical CSS `.hero-search-sticky-bar`, `.is-sticky`, animation `@keyframes slideDownStickyBar`.
2. [`public/index.html`](file:///d:/master%20page/public/index.html): Đồng bộ hóa 100% cấu trúc HTML và CSS với `index.html`.
3. [`js/home.js`](file:///d:/master%20page/js/home.js) & [`public/js/home.js`](file:///d:/master%20page/public/js/home.js):
   - Bổ sung hàm `initStickySearch()` lắng nghe sự kiện `scroll` và `resize`, tính toán động vị trí đáy navbar và kích hoạt trạng thái `.is-sticky`.
4. [`css/home.css`](file:///d:/master%20page/css/home.css) & [`public/css/home.css`](file:///d:/master%20page/public/css/home.css):
   - Đồng bộ quy tắc CSS sticky search bar.
5. [`css/navbar.css`](file:///d:/master%20page/css/navbar.css) & [`public/css/navbar.css`](file:///d:/master%20page/public/css/navbar.css):
   - Đồng bộ quy tắc CSS sticky search bar.
6. [`_bmad-output/planning-artifacts/.memlog.md`](file:///d:/master%20page/_bmad-output/planning-artifacts/.memlog.md): Tự động ghi nhớ quyết định, hành động và kiểm thử.

---

## 4. Kết Quả Kiểm Thử (Verification)
Đã chạy kịch bản tự động CDP qua Chrome Headless (`scratch/test_sticky_search.js`):
1. **Trạng thái ban đầu (`scrollY = 0`):** `isSticky = false` (nằm tĩnh trong Hero).
2. **Trạng thái cuộn xuống (`scrollY = 700`):** `isSticky = true`, `rect.top = 73px` (neo vững vàng ngay dưới navbar), ảnh chụp `scratch/homepage_sticky_scrolled.png` chứng minh thanh tìm kiếm hiển thị tuyệt đẹp, đầy đủ nút bấm và trường nhập liệu.
3. **Trạng thái cuộn ngược lên (`scrollY = 0`):** `isSticky = false` (hoàn nguyên về vị trí ban đầu mượt mà).
