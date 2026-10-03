# Tài Liệu Kỹ Thuật: Đồng Bộ Tỷ Lệ Font Chữ Tiêu Đề Các Khối & Loại Bỏ Khối Thông Số Tổng Hợp

**Dự án:** EasyCV  
**Trang:** Trang chủ (`index.html` & `public/index.html`)  
**Ngày thực hiện:** 03/10/2026  
**Phương pháp luận:** BMAD (BMM Method)

---

## 1. Mục Tiêu & Yêu Cầu Người Dùng

1. **Đồng bộ tỷ lệ font chữ các tiêu đề lớn (H2) giữa các khối trên trang chủ:**
   - Khắc phục sự bất đối xứng giữa khối Mẫu CV (`Khám phá mẫu CV phù hợp với bạn` trước đó dùng `clamp(24px, 2.3vw, 32px)` -> đạt tới `32px` trên Desktop và font-weight `700`) với các khối việc làm, công ty, ngành nghề khác (dùng `26px`, font-weight `800`).
   - Khắc phục lỗi thiếu quy tắc co giãn responsive trên Mobile: trước đó các khối khác giữ nguyên `26px` trên màn hình điện thoại 390px gây thô, trong khi khối Mẫu CV tự co về `22px`.
   - Thiết lập chuẩn Typography Scale đồng bộ cho toàn bộ 6 khối lớn trên trang chủ ở cả Desktop (`26px`, font-weight `800`, tracking `-0.02em`, line-height `1.3`), Tablet (`23px`) và Mobile (`20px`, line-height `1.35`).

2. **Loại bỏ khối thông số tổng hợp nền tảng (Stats Counter Strip):**
   - Xóa bỏ khối chứa 4 thẻ chỉ số:
     - `52.400+ Việc làm đang tuyển dụng`
     - `12.500+ Doanh nghiệp hàng đầu`
     - `380.000+ CV ứng viên đã kết nối`
     - `98.6% Phản hồi hồ sơ trong 48h`
   - Nối liền mạch trực tiếp từ khối "Việc làm phù hợp với bạn" sang "Khám phá mẫu CV phù hợp với bạn".

---

## 2. Bảng Ma Trận Thay Đổi (Before vs After)

| Khối / Phần tử | Trước Khi Sửa (Desktop / Mobile) | Sau Khi Sửa (Desktop / Mobile) | Trạng Thái |
| :--- | :--- | :--- | :--- |
| **Việc làm nổi bật** | `26px` (weight 800) / `26px` | `26px` (weight 800) / `20px` (weight 800) | ✅ Đồng bộ |
| **Việc làm lương cao** | `26px` (weight 800) / `26px` | `26px` (weight 800) / `20px` (weight 800) | ✅ Đồng bộ |
| **Công ty nổi bật** | `26px` (weight 800) / `26px` | `26px` (weight 800) / `20px` (weight 800) | ✅ Đồng bộ |
| **Việc làm phù hợp với bạn** | `26px` (weight 800) / `26px` | `26px` (weight 800) / `20px` (weight 800) | ✅ Đồng bộ |
| **Khám phá mẫu CV phù hợp** | `32px` (weight 700) / `22px` | `26px` (weight 800) / `20px` (weight 800) | ✅ Đồng bộ |
| **Ngành nghề & từ khóa** | `26px` (weight 800) / `26px` | `26px` (weight 800) / `20px` (weight 800) | ✅ Đồng bộ |
| **Infeed VIP Card Title** | `24px` / `24px` | `24px` / `19px` | ✅ Cân đối |
| **Khối Thông Số Tổng Hợp** | Hiển thị 4 thẻ chỉ số (chiều cao 139px) | **Đã xóa bỏ hoàn toàn** | ✅ Đã gỡ bỏ |

---

## 3. Các Tệp Đã Chỉnh Sửa & Đồng Bộ

1. [`index.html`](file:///d:/master%20page/index.html) & [`public/index.html`](file:///d:/master%20page/public/index.html):
   - Xóa bỏ markup khối `.hero-stats-strip` (4 thẻ chỉ số 52.400+, 12.500+, 380.000+, 98.6%).
   - Thêm class `.section-title` cho `<h2 id="cv-template-title" class="section-title">Khám phá mẫu CV phù hợp với bạn</h2>`.
   - Nâng phiên bản stylesheet lên `css/home.css?v=6.4_unified_titles`.

2. [`css/home.css`](file:///d:/master%20page/css/home.css) & [`public/css/home.css`](file:///d:/master%20page/public/css/home.css):
   - Cập nhật `.section-title`: font-size `26px`, font-weight `800`, letter-spacing `-0.02em`, line-height `1.3`, color `var(--text-main)`, margin `0`.
   - Cập nhật `.cv-template-header h2`: đồng bộ 100% thuộc tính với `.section-title` (`26px`, font-weight `800`, letter-spacing `-0.02em`).
   - Cập nhật `.cv-template-header`: margin-bottom `24px` (khớp với `.section-header`).
   - Cập nhật `.cv-template-section`: padding `40px 0` (khớp chuẩn `.home-section`).
   - Bổ sung Media Queries đồng bộ:
     - `@media (max-width: 900px)`: `.section-title, .cv-template-header h2 { font-size: 23px; line-height: 1.3; }`.
     - `@media (max-width: 640px)`: `.section-title, .cv-template-header h2 { font-size: 20px; line-height: 1.35; letter-spacing: -0.01em; }`.
     - `@media (max-width: 640px)`: `.infeed-vip-title { font-size: 19px; }`.

---

## 4. Kết Quả Kiểm Thử (Verification)

- Đo lường trực tiếp qua Chrome Headless CDP (`scratch/measure_titles.js`):
  - **Tại 1440x950 (Desktop):** Cả 6 tiêu đề khối đạt chính xác `26px`, font-weight `800`, line-height `33.8px`, letter-spacing `-0.52px` (-0.02em), màu `rgb(15, 23, 42)`.
  - **Tại 390x844 (Mobile):** Cả 6 tiêu đề khối co giãn mượt mà về đúng `20px`, font-weight `800`, không còn tình trạng tràn dòng thô ráp.
  - **Khối chỉ số nền tảng:** `statsPresent: false` (xác nhận 0 phần tử tồn tại trong DOM).
- Hai bản sao `root` và `public` đồng bộ 100% ký tự (`diff` / hash trùng khớp).
