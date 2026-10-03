# Đặc Tả Kỹ Thuật: Đồng Bộ Kích Thước Logo Công Ty Trên Trang Chủ (65x65 px)

## 1. Mục Tiêu & Yêu Cầu
- **Yêu cầu:** Màn trang chủ, các logo công ty đồng bộ về kích thước 65x65 (`width: 65px; height: 65px`).
- **Phạm vi:** 
  1. Toàn bộ các thẻ việc làm trên trang chủ (21 thẻ thuộc 3 khối: "Việc làm nổi bật", "Việc làm hấp dẫn", "Việc làm phù hợp với bạn").
  2. Toàn bộ các thẻ công ty thuộc khối "Top Công Ty Hàng Đầu / Công ty nổi bật" (8 thẻ thương hiệu trong carousel).
- **Thiết bị:** Đồng bộ chuẩn xác trên cả màn hình Desktop và Mobile Web.

---

## 2. Chi Tiết Thay Đổi Kỹ Thuật

### 2.1. Thẻ việc làm (Job Cards - `.job-logo-wrapper`)
- **Trước thay đổi:** Kích thước `52px x 52px` (khá nhỏ so với chuẩn nhận diện ngành và chuẩn TopCV).
- **Sau thay đổi:**
  - `width: 65px; height: 65px; min-width: 65px; min-height: 65px;`
  - `border-radius: 10px; border: 1.5px solid #00B14F;` (hoặc border vàng `#F59E0B` cho khối việc làm hấp dẫn).
  - Ảnh logo bên trong (`.job-logo`, `.company-logo`): `width: 100%; height: 100%; object-fit: contain; border-radius: 6px;`.
  - Huy hiệu tia chớp ưu tiên (`.badge-lightning`): Neo góc trên bên trái `top: -5px; left: -5px` giữ nguyên tỷ lệ thẩm mỹ.

### 2.2. Khối Công ty tiêu biểu (Featured Company Cards - `.company-card-logo-wrap`)
- **Trước thay đổi:** Desktop `84px x 84px`, Mobile `64px x 64px`.
- **Sau thay đổi:**
  - Desktop & Mobile: `width: 65px; height: 65px; min-width: 65px; min-height: 65px; border-radius: 16px;`.
  - Text mark (`.company-card-logo-mark`): font-size chuẩn hóa `19px` (Viettel, MoMo, VinAI `14-15px`) đảm bảo hiển thị sắc nét, vừa vặn không bị tràn mép.
  - Tinh chỉnh padding thẻ `.company-card`: `26px 16px 22px` tạo tỷ lệ cân đối hoàn mỹ giữa logo, tên công ty và các pill chân thẻ.

### 2.3. Quản lý Cache & Đồng bộ Tệp
- Nâng cache key stylesheet: `css/home.css?v=6.5_logo_65x65` trên cả `index.html` và `public/index.html`.
- Đồng bộ hóa 100% mã nguồn giữa thư mục gốc và thư mục `public/`:
  - `css/home.css` ⇄ `public/css/home.css`
  - `index.html` ⇄ `public/index.html`

---

## 3. Ma Trận Kiểm Thử Tự Động (Automated Verification)

| STT | Kịch Bản Kiểm Thử | Công Cụ | Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---|:---|:---|:---|:---:|
| 1 | Kiểm tra kích thước computed 21 logo job card (Desktop 1440x950) | Chrome Headless CDP (`Runtime.evaluate`) | `65px x 65px` (100% 21 thẻ) | 21/21 thẻ đạt `65px x 65px` | **PASS** |
| 2 | Kiểm tra kích thước computed 8 logo company card (Desktop 1440x950) | Chrome Headless CDP (`Runtime.evaluate`) | `65px x 65px` (100% 8 thẻ) | 8/8 thẻ đạt `65px x 65px` | **PASS** |
| 3 | Kiểm tra kích thước computed 21 logo job card (Mobile 390x844) | Chrome Headless CDP Emulation | `65px x 65px` (100% 21 thẻ) | 21/21 thẻ đạt `65px x 65px` | **PASS** |
| 4 | Kiểm tra kích thước computed 8 logo company card (Mobile 390x844) | Chrome Headless CDP Emulation | `65px x 65px` (100% 8 thẻ) | 8/8 thẻ đạt `65px x 65px` | **PASS** |
| 5 | Kiểm tra tính nhất quán mã nguồn | SHA256 Hash Compare | Hash root == Hash public | `True` (khớp 100%) | **PASS** |
| 6 | Kiểm tra trực quan bằng hình ảnh | Page.captureScreenshot | Giao diện sắc nét, cân xứng | Lưu tại `scratch/jobs_section_65x65.png` và `scratch/companies_scrolled.png` | **PASS** |
