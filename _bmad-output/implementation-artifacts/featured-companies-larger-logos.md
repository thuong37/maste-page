# Đặc Tả Kỹ Thuật: Nâng Cấp Kích Thước Logo Công Ty Lên 108px (Khối Công Ty Nổi Bật)

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện:** 07/10/2026  
**Trang áp dụng:** Trang chủ (`index.html` & `public/index.html`)  
**Khối nội dung:** Công ty nổi bật (`#cong-ty-tieu-bieu` / `.top-companies-section`)

---

## 1. Yêu Cầu & Mục Tiêu Thiết Kế
- **Yêu cầu từ người dùng:** *"chỉnh cho cái logo công ty to ra"* trong khối **"Công ty nổi bật"** (`#cong-ty-tieu-bieu` / `.companies-carousel`).
- **Mục tiêu UX/UI:**
  - Nâng cấp độ nhận diện thương hiệu cho 8 tập đoàn/ngân hàng hàng đầu (FPT, VNG, Viettel, Techcombank, MoMo, Shopee, MB Bank, VinAI).
  - Tăng kích thước logo từ `88px x 88px` lên **`108px x 108px`** (tăng thêm ~23% kích thước và ~50% diện tích bề mặt), tạo điểm nhấn thị giác đẳng cấp và sang trọng.
  - Tinh chỉnh cỡ chữ nhận diện bên trong logo mark (`22px - 34px`) đảm bảo rõ nét, không bị tràn viền.
  - Cân đối tỷ lệ thẻ: điều chỉnh padding thẻ thành `24px 14px 20px`, giữ khoảng cách xuống tên công ty là `16px` để chiều cao thẻ đạt `270px` chuẩn xác, không bị thừa thiếu khoảng trống.
  - Bảo đảm responsive hoàn hảo trên thiết bị di động với kích thước `84px x 84px` (bo góc `20px`).

---

## 2. Bảng Đối Soát Thông Số Kỹ Thuật

| Thành Phần | Trước Khi Nâng Cấp | Sau Khi Nâng Cấp (Hiện Tại) | Ghi Chú Thiết Kế |
| :--- | :--- | :--- | :--- |
| **Khung Logo (`.company-card-logo-wrap`)** | `88px x 88px` | **`108px x 108px`** | `min-width: 108px; min-height: 108px; border-radius: 24px;` |
| **Bóng Đổ Khung Logo** | `0 4px 12px rgba(15, 23, 42, 0.05)` | **`0 6px 18px rgba(15, 23, 42, 0.07)`** | Đa tầng, mềm mại; hover nhấc `translateY(-2px)` shadow `0 10px 24px rgba(15, 23, 42, 0.1)` |
| **Font-size Logo Mark chung** | `24px` (weight 800) | **`30px`** (weight 800) | Tỷ lệ chữ to rõ, tương thích hoàn hảo với khung 108px |
| **Logo FPT / VNG / MB** | `26px` / `24px` | **`30px`** | Chữ viết tắt 2–3 ký tự đậm nét, bề thế |
| **Logo Shopee ("S")** | `26px` | **`34px`** | Chữ "S" đơn ký tự phóng lớn cân đối trung tâm |
| **Logo Techcombank ("TCB")** | `24px` | **`28px`** | Căn giữa sắc nét |
| **Logo Viettel / VinAI** | `17px` / `18px` | **`23px`** (`letter-spacing: -0.05em`) | Đảm bảo 7 ký tự "viettel" và 5 ký tự "VinAI" vừa khít không tràn |
| **Logo MoMo ("MOMO")** | `17px` | **`22px`** (`letter-spacing: -0.03em`) | Vừa vặn cân đối |
| **Khoảng Cách Xuống Tên (`margin-top`)**| `24px` | **`16px`** | Tinh gọn, tạo sự gắn kết chặt chẽ giữa logo và tên công ty |
| **Padding Thẻ (`.company-card`)** | `26px 14px 22px` | **`24px 14px 20px`** | Cân đối không gian, chiều cao tổng thể đạt `270px` |
| **Mobile (`@media max-width: 768px`)** | `76px x 76px`, mark `20px` | **`84px x 84px`**, mark `24px` | Tối ưu 2 cột hiển thị trên điện thoại |

---

## 3. Danh Sách Tệp Triển Khai & Đồng Bộ (100% Match)

| STT | Tệp Gốc (Root) | Tệp Công Khai (Public) | Nội Dung Cập Nhật |
|:---:|:---|:---|:---|
| 1 | `css/home.css` | `public/css/home.css` | Cập nhật `.company-card-logo-wrap` (108px, bo góc 24px, shadow), font-size `.company-card-logo-mark`, padding thẻ và mobile media queries. |
| 2 | `js/home.js` | `public/js/home.js` | Tinh chỉnh tooltip thương hiệu trong `initLogoTooltips()`. |
| 3 | `index.html` | `public/index.html` | Đồng bộ toàn bộ markup và thuộc tính tooltip. |

---

## 4. Kết Quả Kiểm Thử Thực Tế (CDP Chrome Headless)

Đã chạy kịch bản kiểm thử tự động trực tiếp trên cổng máy chủ `http://localhost:3000/index.html`:
- **Desktop (1440x1200):**
  - Khung logo computed chính xác `108px x 108px` trên toàn bộ 8 thẻ (`min-width: 108px; min-height: 108px`).
  - Chiều cao các thẻ đồng đều đạt `270px`.
  - Hiệu ứng hover hoạt động mượt mà với `translateY(-2px)`.
- **Mobile (390x844):**
  - Khung logo computed đạt `84px x 84px` (bo góc `20px`), hiển thị 2 cột cân đối.
- **Ảnh chụp màn hình nghiệm thu:**
  - `scratch/actual_108px_slide1.png`: 5 thẻ đầu tiên ở Slide 1.
  - `scratch/actual_108px_slide2.png`: Các thẻ tiếp theo ở Slide 2 (bao gồm MB Bank, Shopee, VinAI).
  - `scratch/actual_108px_mobile.png`: Giao diện hiển thị trên Mobile.
