# Tài Liệu Triển Khai: Tinh Chỉnh Header, Breadcrumb Dưới Box Tìm Kiếm & Điều Hướng Nút Back Trình Duyệt

Màn hình: **Chi tiết việc làm (`chi-tiet-viec-lam.html`) & Danh sách việc làm (`viec-lam.html`)**  
Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Phương pháp luận quản trị: **BMAD (BMM Method)**

---

## 1. Yêu Cầu Người Dùng & Phân Tích Kỹ Thuật

### 1.1. Yêu Cầu Cốt Lõi
1. **Loại bỏ thanh header trên cùng:** Xóa hoàn toàn thanh chứa tiêu đề lớn (`#pageHeaderTitle`), dòng phụ đề "Khám phá cơ hội nghề nghiệp...", cùng cụm nút "Về danh sách việc làm" và "Xem toàn trang" như ảnh chụp cung cấp.
2. **Di chuyển mô tả đường dẫn (Breadcrumb):** Đưa đường dẫn điều hướng phân cấp dạng `Trang chủ / Tìm kiếm việc làm / Chuyên Viên Quản Lý Chuỗi Cung Ứng & Vận Hành (Logistics)` xuống vị trí **bên dưới box tìm kiếm thông minh**.
3. **Đảm bảo điều hướng nút Back của trình duyệt:** Khi đã loại bỏ nút cứng "Về danh sách việc làm" trên giao diện, việc nhấn nút Back trên thanh địa chỉ/công cụ của trình duyệt (`← Back`) **bắt buộc phải cho phép người dùng quay đầu về lại trang danh sách việc làm (`viec-lam.html`)** một cách tự nhiên và ổn định.

---

## 2. Giải Pháp Triển Khai Chi Tiết

### 2.1. Cấu Trúc HTML & Vị Trí Breadcrumb Mới
- Đã gỡ bỏ khối tiêu đề và cụm nút trên cùng khỏi `chi-tiet-viec-lam.html` và `public/chi-tiet-viec-lam.html`.
- Định vị thẻ `<nav class="breadcrumb-nav detail-breadcrumb-below-search">` ngay bên dưới khối `.hero-search-wrapper`:
  - `margin-top: 14px; margin-bottom: 0; padding: 0 4px; font-size: 13.5px;`
  - Thẻ `<span>` với `id="breadcrumbJobTitle"` tự động cập nhật theo tên việc làm đang xem (`job.title`), đảm bảo đồng bộ với cả 28 việc làm chuẩn trong dataset.

### 2.2. Xử Lý Điều Hướng Nút Back Trình Duyệt (Browser Back / Popstate Engine)
- **Vấn đề đã nhận diện:** Trước đây tại chế độ xem 2 cột trên `viec-lam.js`, thẻ liên kết tên việc làm sử dụng thuộc tính `target="_blank"`, khiến trình duyệt mở tab mới có lịch sử trống (`history.length = 1`), làm cho nút Back của trình duyệt bị vô hiệu hóa (xám màu).
- **Giải pháp xử lý triệt để:**
  1. **Loại bỏ `target="_blank"`:** Tại `js/viec-lam.js` và `public/js/viec-lam.js`, liên kết tiêu đề việc làm được đổi thành điều hướng trong cùng cửa sổ:
     ```html
     <a href="chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}" class="job-title-link" title="Xem chi tiết ${job.title}">${job.title}</a>
     ```
  2. **Khởi tạo mốc lịch sử gốc (Root History Entry):** Tại `js/chi-tiet-viec-lam.js` và `public/js/chi-tiet-viec-lam.js`, khi người dùng truy cập trực tiếp bằng URL hoặc tab mới:
     ```javascript
     if (!cameFromViecLam && window.history.length <= 1) {
       const currentUrl = window.location.href;
       window.history.replaceState({ page: 'job_list_root' }, '', 'viec-lam.html');
       window.history.pushState({ page: 'job_detail', id: activeJobId, title: initialJob.title }, '', currentUrl);
     }
     ```
     Cơ chế này giúp nút Back trên trình duyệt luôn sáng đèn và hoạt động được ngay lập tức.
  3. **Lắng nghe sự kiện `popstate`:**
     - Khi người dùng bấm nút Back, nếu trạng thái rơi về `job_list_root` hoặc URL là `viec-lam.html`, hệ thống tự động điều hướng quay đầu về `viec-lam.html`.
     - Nếu người dùng duyệt qua lại các việc làm liên quan ở cột trái (`split-list-feed`), sự kiện `popstate` cập nhật lại nội dung JD mà không gây reload trang.

---

## 3. Danh Sách Tệp Đã Cập Nhật & Đồng Bộ 100%

| STT | Tệp tin | Trạng thái | Nội dung thay đổi |
| :---: | :--- | :---: | :--- |
| 1 | [`chi-tiet-viec-lam.html`](file:///d:/master%20page/chi-tiet-viec-lam.html) | Cập nhật | Gỡ bỏ header bar cũ; chèn breadcrumb bên dưới box tìm kiếm; bổ sung CSS `.detail-breadcrumb-below-search`. |
| 2 | [`public/chi-tiet-viec-lam.html`](file:///d:/master%20page/public/chi-tiet-viec-lam.html) | Đồng bộ | Đồng bộ 100% với `chi-tiet-viec-lam.html`. |
| 3 | [`js/chi-tiet-viec-lam.js`](file:///d:/master%20page/js/chi-tiet-viec-lam.js) | Cập nhật | Bổ sung engine khởi tạo root history, xử lý sự kiện `popstate` đón nút Back của trình duyệt. |
| 4 | [`public/js/chi-tiet-viec-lam.js`](file:///d:/master%20page/public/js/chi-tiet-viec-lam.js) | Đồng bộ | Đồng bộ 100% với `js/chi-tiet-viec-lam.js`. |
| 5 | [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) | Cập nhật | Gỡ bỏ `target="_blank"` trong hàm render split card title để điều hướng cùng tab. |
| 6 | [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js) | Đồng bộ | Đồng bộ 100% với `js/viec-lam.js`. |

---

## 4. Kết Quả Kiểm Thử (Verification Matrix)

| Test ID | Nội dung kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Kiểm tra gỡ bỏ tag cũ | Không còn `pageHeaderTitle`, `btn-back-to-grid`, `btnToggleFullWidth` | Đã xóa sạch 100% | **PASS** |
| **TC-02** | Kiểm tra vị trí Breadcrumb | Nằm trực tiếp bên dưới box tìm kiếm (`heroSearchWrapper`) | `breadcrumbTagPos > heroSearchPos` (14540 > 7360) | **PASS** |
| **TC-03** | Kiểm tra nội dung Breadcrumb | Hiển thị đủ `Trang chủ / Tìm kiếm việc làm / [Tên công việc]` | Đầy đủ 3 cấp phân tầng | **PASS** |
| **TC-04** | Kiểm tra nút Back trình duyệt | Có `popstate` listener và cơ chế điều hướng quay về `viec-lam.html` | Đã tích hợp đầy đủ | **PASS** |
| **TC-05** | Loại bỏ `target="_blank"` | Không còn mở tab mới làm đứt gãy lịch sử duyệt trình duyệt | `targetBlank: false` | **PASS** |
