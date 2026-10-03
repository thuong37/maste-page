# Tài Liệu Kỹ Thuật: Liên Kết Màn Chi Tiết Việc Làm & Đồng Bộ Dữ Liệu Mẫu

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Màn hình: **Danh sách việc làm (`viec-lam.html`) & Chi tiết việc làm (`chi-tiet-viec-lam.html`)**  
Phương pháp luận: **BMAD (BMM Method)**  

---

## 1. Mục Tiêu & Yêu Cầu Người Dùng

1. **Ở màn list job (`viec-lam.html`)**:
   - Khi click vào tên job, link trực tiếp đến màn chi tiết việc làm (`chi-tiet-viec-lam.html`).
   - Mock data lấy đúng tên job đã click để đưa vào khối hiển thị chi tiết job.
   - Tạo dữ liệu mẫu đầy đủ vào luôn (pre-populated mock data).
2. **Khối Việc làm liên quan khác (`#splitListFeed`) trên màn chi tiết**:
   - Cung cấp dữ liệu demo phong phú vào khối danh sách việc làm gợi ý.
   - Thẻ đang xem hiển thị huy hiệu `👁 Đang xem` và highlight viền cam nhận diện.
   - Cho phép click chuyển đổi mượt mà giữa các việc làm liên quan ngay trên màn chi tiết mà không cần tải lại trang.

---

## 2. Giải Pháp Kỹ Thuật Triển Khai

### 2.1. Cập Nhật Màn Hình Danh Sách Việc Làm (`viec-lam.html` & `js/viec-lam.js`)
- **Tối ưu hóa liên kết tiêu đề công việc (`.job-title-link`)**:
  - Gỡ bỏ thuộc tính `target="_blank"` để điều hướng mượt mà trong cùng cửa sổ trình duyệt (hỗ trợ mở tab mới tự nhiên khi người dùng nhấn chuột giữa hoặc Ctrl + Click).
  - Bổ sung cả tham số `id` và `title` được mã hóa URL:
    `href="chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}"`
  - Đồng bộ hóa toàn bộ 25 thẻ HTML tĩnh trong `viec-lam.html` và hàm sinh giao diện động `renderCurrentPage()` trong `js/viec-lam.js`.
  - Bảo đảm sự kiện click vào tên job không bị chặn hay xung đột với tính năng mở 2-block split view.

### 2.2. Nhúng SẴn Dữ Liệu Mẫu Tĩnh Trong `chi-tiet-viec-lam.html`
- Triệt tiêu hoàn toàn tình trạng thẻ HTML rỗng (`Tên vị trí việc làm`, `Tên công ty`, `src=""`, empty `<ul>`):
  - Pre-render đầy đủ dữ liệu mẫu cho vị trí mặc định (`Senior Fullstack Developer (ReactJS / Node.js)` - FPT Software):
    - Breadcrumb và Header trang.
    - Hero chi tiết: Logo FPT Software, tên vị trí, tên công ty với huy hiệu xác thực, badge mức lương `28 - 45 triệu`, địa điểm `Hà Nội (Cầu Giấy)`, cập nhật `25 phút trước`.
    - Lưới chỉ số nhanh: Mức thu nhập, Kinh nghiệm `3 - 5 năm`, Cấp bậc `Senior / Leader`, Hình thức `Kết hợp (Hybrid)`.
    - Danh sách mô tả công việc (JD), yêu cầu ứng viên, quyền lợi & đãi ngộ, kỹ năng chuyên môn, thẻ thông tin doanh nghiệp tuyển dụng và thanh Sticky bar chân trang.
- Pre-render 16 thẻ việc làm mẫu trong khối **"Việc làm liên quan khác"** (`#splitListFeed`) với thẻ đầu tiên có class `.is-selected` và huy hiệu `👁 Đang xem`.

### 2.3. Nâng Cấp Engine Điều Phối Dữ Liệu (`js/chi-tiet-viec-lam.js`)
- **Hỗ trợ đa cơ chế phân giải tham số (Multi-Resolution Fallback)**:
  1. Đọc cả `id` / `jobId` và `title` / `jobTitle` / `q` từ `window.location.search`.
  2. Tìm kiếm chính xác theo `id` trong catalog 28 việc làm chuẩn hóa `JOBS_DATA`.
  3. Nếu không tìm thấy theo `id`, tìm kiếm theo `title` (sử dụng thuật toán chuẩn hóa dấu tiếng Việt `normalizeText`).
  4. Nếu người dùng nhập hoặc truyền một tên việc làm hoàn toàn mới, hệ thống tự động sinh đối tượng Mock Data hoàn chỉnh với đúng tên vị trí đó và chèn vào đầu catalog để ứng viên khám phá tức thì.
- **Tương tác thời gian thực trên khối "Việc làm liên quan khác"**:
  - Gắn sự kiện click `e.preventDefault()`, cập nhật `activeJobId`, render lại khối chi tiết bên phải, cập nhật huy hiệu `👁 Đang xem` và đồng bộ `window.history.pushState` thay đổi URL mà không gây giật lag trình duyệt.
  - Tự động cuộn mượt `#detailScrollArea` lên đầu trang.

---

## 3. Ma Trận Tệp Thay Đổi & Đồng Bộ

| STT | Tệp Mã Nguồn | Trạng Thái | Mô Tả Thay Đổi |
|:---:|:---|:---:|:---|
| 1 | [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) | Cập nhật | Cập nhật 25 thẻ job static với liên kết `?id=...&title=...`, bỏ `target="_blank"`. |
| 2 | [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html) | Đồng bộ | Đồng bộ 100% với `viec-lam.html`. |
| 3 | [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) | Cập nhật | Template tạo thẻ job động bổ sung `&title=${encodeURIComponent(job.title)}`, bỏ `target="_blank"`. |
| 4 | [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js) | Đồng bộ | Đồng bộ 100% với `js/viec-lam.js`. |
| 5 | [`chi-tiet-viec-lam.html`](file:///d:/master%20page/chi-tiet-viec-lam.html) | Cập nhật | Pre-render toàn bộ dữ liệu mẫu tĩnh cho khối chi tiết job và 16 thẻ demo liên quan. |
| 6 | [`public/chi-tiet-viec-lam.html`](file:///d:/master%20page/public/chi-tiet-viec-lam.html) | Đồng bộ | Đồng bộ 100% với `chi-tiet-viec-lam.html`. |
| 7 | [`js/chi-tiet-viec-lam.js`](file:///d:/master%20page/js/chi-tiet-viec-lam.js) | Cập nhật | Hỗ trợ đọc `title`, `normalizeText`, dynamic mock generator, click liên quan không reload. |
| 8 | [`public/js/chi-tiet-viec-lam.js`](file:///d:/master%20page/public/js/chi-tiet-viec-lam.js) | Đồng bộ | Đồng bộ 100% với `js/chi-tiet-viec-lam.js`. |
| 9 | [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) | Tinh chỉnh | Thêm `padding-right: 78px` cho `.split-card-title` khi selected để không đè badge `👁 Đang xem`. |
| 10 | [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css) | Đồng bộ | Đồng bộ 100% với `css/viec-lam.css`. |

---

## 4. Kết Quả Kiểm Thử Tự Động (Automated Testing Suite)

Kiểm thử được thực hiện qua Chrome Headless kết nối trực tiếp cổng HTTP 3000 (`scratch/test_full_suite.js`):

| Test Case | Mô Tả Kịch Bản | Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---|:---|:---|:---:|
| **TC-01** | Kiểm tra liên kết trên `viec-lam.html` | 25/25 thẻ có liên kết dạng `chi-tiet-viec-lam.html?id=...&title=...` không có `target="_blank"` | 25/25 thẻ khớp 100% | **PASS** |
| **TC-02** | Điều hướng đến `chi-tiet-viec-lam.html?id=2` | Khối chi tiết hiển thị đúng vị trí "Chuyên Viên Khách Hàng Doanh Nghiệp (RM)", Techcombank, 20-35 triệu; danh sách liên quan có huy hiệu `👁 Đang xem` | Hiển thị chính xác 100% tiêu đề, thông số, 3 JD bullets, 3 yêu cầu, 3 đãi ngộ, 4 skills | **PASS** |
| **TC-03** | Click việc làm liên quan khác (chọn Card 3) | Khối chi tiết cập nhật ngay lập tức sang "Senior Product Designer (UI/UX App/Web)", VNG, 30-50 triệu, URL đổi sang `?id=3&title=...` | Chuyển đổi mượt mà, không giật lag, URL cập nhật chính xác | **PASS** |
| **TC-04** | Mở chi tiết với tên job tùy biến | Hệ thống sinh dữ liệu mẫu phù hợp và đưa đúng tên job vào khối hiển thị chi tiết | Khối chi tiết hiển thị chuẩn xác tiêu đề "Giám Đốc Chuyển Đổi Số & AI" | **PASS** |
| **TC-05** | Kiểm tra cú pháp mã nguồn JS | Kiểm tra `node -c` toàn bộ các file JavaScript | Không có lỗi cú pháp (exit code 0) | **PASS** |
