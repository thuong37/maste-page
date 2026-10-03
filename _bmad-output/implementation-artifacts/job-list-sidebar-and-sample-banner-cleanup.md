# Tài Liệu Triển Khai: Tinh Gọn Màn Hình Danh Sách Việc Làm (viec-lam.html)

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Ngày cập nhật: **2026-10-03**  
Trạng thái: **Hoàn thành (Verified)**

---

## 1. Yêu Cầu Người Dùng

1. **Màn list job:** Bỏ khối thông báo dữ liệu mẫu (ảnh chụp: *"💡 Chế độ dữ liệu mẫu EasyCV: Không tìm thấy công việc nào khớp chính xác với yêu cầu lọc. Hệ thống đang hiển thị toàn bộ 16 việc làm có sẵn để bạn tham khảo và trải nghiệm tính năng."*).
2. **Khối doanh nghiệp tiêu biểu bên cạnh (Right Sidebar):**
   - Bỏ tag `"★ DOANH NGHIỆP TIÊU BIỂU"`.
   - Bỏ khối đề xuất đăng tin tuyển dụng ngay dưới khối này (*"EASYCV FOR BUSINESS - Bạn đang tìm kiếm nhân tài đột phá? / Đăng tin tuyển dụng ngay"*).
   - Bỏ luôn tag `"Tài trợ"` bên cạnh (loại bỏ hoàn toàn dải header `.ad-badge-top` để ảnh bìa chạm mép trên của thẻ).
3. **Kích thước logo trên các thẻ job:** Chỉnh sửa lại kích cỡ logo là `100x100px` trên các thẻ việc làm.

---

## 2. Ma Trận Thay Đổi Kỹ Thuật

| Hạng mục | Vị trí / Phần tử | Tệp tác động | Chi tiết xử lý kỹ thuật |
| :--- | :--- | :--- | :--- |
| **Khối thông báo dữ liệu mẫu** | `#sampleDataBanner`<br>`.sample-data-banner` | `viec-lam.html`<br>`public/viec-lam.html`<br>`js/viec-lam.js`<br>`public/js/viec-lam.js` | - Xóa bỏ phần tử HTML `<div id="sampleDataBanner">`.<br>- Loại bỏ logic DOM injection thông báo dữ liệu mẫu trong hàm tìm kiếm/lọc.<br>- Giữ nguyên thuật toán fallback hiển thị việc làm có sẵn mượt mà không làm phát sinh lỗi. |
| **Tag Doanh nghiệp & Tag Tài trợ** | `.ad-badge-top`<br>`.badge-vip-sponsor`<br>`.badge-ad-tag` | `viec-lam.html`<br>`public/viec-lam.html` | - Xóa bỏ toàn bộ dải header `.ad-badge-top` gồm cả hai tag "★ DOANH NGHIỆP TIÊU BIỂU" và "Tài trợ".<br>- Khối `.vip-employer-cover` hiển thị ngay ở đỉnh thẻ, các góc trên được bo tròn tự nhiên theo `border-radius: 16px` của thẻ. |
| **Khối đề xuất đăng tin tuyển dụng** | `.b2b-recruiter-card`<br>`EASYCV FOR BUSINESS` | `viec-lam.html`<br>`public/viec-lam.html` | - Gỡ bỏ hoàn toàn thẻ quảng cáo B2B recruiter dưới khối Samsung SRV.<br>- Cột phải hiển thị tinh gọn gồm: Thẻ Showcase Doanh nghiệp VIP + Thẻ Dịch vụ AI CV Coach. |
| **Kích thước Logo thẻ job** | `.job-company-logo` | `css/viec-lam.css`<br>`public/css/viec-lam.css`<br>`viec-lam.html`<br>`public/viec-lam.html` | - Nâng kích thước từ `58x58px` lên chuẩn `100x100px` (`width: 100px; height: 100px; min-width: 100px; min-height: 100px; padding: 6px; border-radius: 14px;`).<br>- Áp dụng đồng bộ cho cả Desktop và Mobile (`@media (max-width: 768px)`).<br>- Nâng version stylesheet `viec-lam.css?v=8.1_logo_100`. |

---

## 3. Kết Quả Kiểm Thử (Verification)

Kịch bản kiểm tra tự động kết nối máy chủ `http://localhost:3000/viec-lam.html`:
- **Check 1:** `ad-badge-top` hoàn toàn không tồn tại trong mã nguồn HTML (`false`).
- **Check 2:** Tag `Tài trợ` và `DOANH NGHIỆP TIÊU BIỂU` hoàn toàn không tồn tại trong thẻ VIP (`false`).
- **Check 3:** `.vip-employer-cover` nằm trực tiếp ngay trong `.vip-employer-card` (`true`).
- **Check 4:** CSS Desktop & Mobile đều thiết lập `.job-company-logo` đạt chính xác `100px × 100px` (`true`).
- **Check 5:** Khối `.b2b-recruiter-card` / *"Bạn đang tìm kiếm nhân tài đột phá?"* và `#sampleDataBanner` hoàn toàn bị loại bỏ (`false`).
- **Cú pháp JS:** `node -c js/viec-lam.js` và `node -c public/js/viec-lam.js` đạt Exit Code 0.
