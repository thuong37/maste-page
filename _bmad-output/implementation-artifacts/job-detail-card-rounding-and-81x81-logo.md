# Tài Liệu Triển Khai: Bo Góc Thẻ Việc Làm Liên Quan & Logo 81x81

Màn hình: **Chi tiết việc làm (`chi-tiet-viec-lam.html`) & Chế độ xem 2 cột (`viec-lam.html`)**  
Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Phương pháp luận quản trị: **BMAD (BMM Method)**

---

## 1. Yêu Cầu Người Dùng & Phân Tích Kỹ Thuật

1. **Bo góc thẻ việc làm liên quan khác (`.split-job-card`):**
   - Trước đó thẻ dùng `border-radius: 0;` và tràn viền mép hai bên (`border-right: none`).
   - Cần bổ sung bo góc mềm mại, hiện đại (`border-radius: 14px`), viền sắc nét 4 cạnh (`border: 1px solid #E2E8F0;`), và tạo khoảng đệm lề cho feed (`padding: 12px 14px 20px 14px`) để các góc bo hiển thị rõ rệt, nổi bật trên nền rãnh xám `#F1F5F9`.
   - Giữ vững dải màu cam nhận diện (`border-left: 5px solid #F97316`, `border-radius: 14px`) và hiệu ứng hover nhẹ nhàng (`transform: translateY(-2px);`).

2. **Chuẩn hóa kích thước Logo 81x81 (`.split-company-logo`):**
   - Tăng kích thước logo từ `46x46` lên đúng chuẩn **`81px x 81px`** (`width: 81px; height: 81px; min-width: 81px; min-height: 81px;`).
   - Bo góc logo `border-radius: 12px;`, viền xám nhẹ `border: 1px solid #E2E8F0;`, căn giữa ảnh bằng `object-fit: contain;` với `padding: 6px; box-sizing: border-box;`.
   - Cân đối layout dòng thông tin bên cạnh (`.split-card-info`) để tiêu đề, công ty và mức lương căn đều theo chiều cao 81px của logo.

---

## 2. Danh Sách Tệp Đã Cập Nhật & Đồng Bộ 100%

| STT | Tệp tin | Trạng thái | Nội dung thay đổi |
| :---: | :--- | :---: | :--- |
| 1 | [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) | Cập nhật | Thiết lập `border-radius: 14px` cho `.split-job-card`, `padding: 12px 14px` cho `.split-list-feed`, và logo `.split-company-logo` 81x81 px. |
| 2 | [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css) | Đồng bộ | Đồng bộ 100% với `css/viec-lam.css`. |
| 3 | [`chi-tiet-viec-lam.html`](file:///d:/master%20page/chi-tiet-viec-lam.html) | Cập nhật | Bổ sung critical inline style bo góc 14px, logo 81x81 và nâng cache buster `v=8.4_rounded_cards_81x81_logo`. |
| 4 | [`public/chi-tiet-viec-lam.html`](file:///d:/master%20page/public/chi-tiet-viec-lam.html) | Đồng bộ | Đồng bộ 100% với `chi-tiet-viec-lam.html`. |
| 5 | [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) | Cập nhật | Nâng cache buster `v=8.4_rounded_cards_81x81_logo`. |
| 6 | [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html) | Đồng bộ | Nâng cache buster `v=8.4_rounded_cards_81x81_logo`. |

---

## 3. Kết Quả Kiểm Thử (Verification Matrix)

| Test ID | Nội dung kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Kích thước Logo | `width: 81px; height: 81px;` | Đạt chuẩn 81x81 px trong CSS & Inline style | **PASS** |
| **TC-02** | Bo góc thẻ việc làm | `border-radius: 14px;` | Đã áp dụng cho cả normal, hover và is-selected | **PASS** |
| **TC-03** | Đệm lề khối Feed | Có padding hai bên để góc bo lộ diện | `padding: 12px 14px 20px 14px` | **PASS** |
| **TC-04** | Đồng bộ hệ thống | Trùng khớp 100% giữa file gốc và `public/` | SHA256 / Content trùng khớp 100% | **PASS** |
