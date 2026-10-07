# Đặc Tả Kỹ Thuật: Chuẩn Hóa Tên Công Ty & Nâng Cấp Typography Khối "Công Ty Nổi Bật"

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện:** 07/10/2026  
**Trang áp dụng:** Trang chủ (`index.html` & `public/index.html`)  
**Khối nội dung:** Công ty nổi bật (`#cong-ty-tieu-bieu` / `.top-companies-section`)

---

## 1. Yêu Cầu Người Dùng

> *"ở màn trang chủ : khối Công ty nổi bật*  
> *Fix: bỏ đuôi tên công ty, ví dụ 'Ngân Hàng TMCP Quân Đội - MB Bank' thì đổi thành 'Ngân Hàng TMCP Quân Đội', rồi điều chỉnh lại cách thể hiện tên công ty cho nó to, rõ ràng"*

---

## 2. Phân Tích Thực Trạng & Vấn Đề (Problem Analysis)

1. **Tên công ty chứa đuôi trùng lặp gây chật chội, dài dòng:**
   - Trước đây, cả 8 thẻ thương hiệu trong carousel đều có cấu trúc: `[Tên pháp nhân đầy đủ] - [Tên thương hiệu/viết tắt tiếng Anh]` (ví dụ: `Ngân Hàng TMCP Quân Đội - MB Bank`, `Công ty TNHH Phần Mềm FPT - FPT Software`, `Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến - Ví MoMo`...).
   - Do phía trên tên công ty đã có khung logo thương hiệu lớn `88px x 88px` hiển thị rõ chữ viết tắt (MB, FPT, TCB, MOMO, VNG...), việc lặp lại đuôi tên này khiến văn bản bị dài lê thê, đẩy xuống tới 3 dòng chữ nhỏ.
2. **Kích thước chữ tên công ty quá nhỏ và thiếu điểm nhấn:**
   - CSS cũ đặt `font-size: 13.5px`, `line-height: 1.45`, `min-height: 56px` với `-webkit-line-clamp: 3`.
   - Cỡ chữ `13.5px` khiến tên doanh nghiệp bị lọt thỏm dưới logo to `88px`, khó đọc lướt nhanh và làm giảm độ trang trọng của các tập đoàn/ngân hàng hàng đầu.
3. **Căn chỉnh dòng và thẩm mỹ:**
   - Các tên công ty có độ dài khác nhau dẫn tới tình trạng có thẻ 1 dòng, có thẻ 3 dòng lắt nhắt; một số từ rơi vào tình trạng "từ mồ côi" (orphan word) như từ "Đội" đứng riêng lẻ 1 dòng.

---

## 3. Giải Pháp Kỹ Thuật (Technical Implementation)

### 3.1. Chuẩn Hóa Danh Sách 8 Công Ty Nổi Bật (Loại Bỏ Đuôi Thừa)

| STT | Logo Mark | Tên Trước Khi Sửa | Tên Sau Khi Sửa (Chuẩn Hóa) |
|:---:|:---:|:---|:---|
| 1 | **FPT** | Công ty TNHH Phần Mềm FPT - FPT Software | **Công ty TNHH Phần Mềm FPT** |
| 2 | **VNG** | Công ty Cổ Phần VNG - VNG Corporation | **Công ty Cổ Phần VNG** |
| 3 | **viettel** | Tổng Công ty Dịch Vụ Số Viettel - Viettel Digital | **Tổng Công ty Dịch Vụ Số Viettel** |
| 4 | **TCB** | Ngân Hàng TMCP Kỹ Thương Việt Nam - Techcombank | **Ngân Hàng TMCP Kỹ Thương Việt Nam** |
| 5 | **MOMO** | Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến - Ví MoMo | **Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến** |
| 6 | **S** | Công ty TNHH Shopee - Shopee Việt Nam | **Công ty TNHH Shopee** |
| 7 | **MB** | Ngân Hàng TMCP Quân Đội - MB Bank | **Ngân Hàng TMCP Quân Đội** |
| 8 | **VinAI** | Công ty Cổ Phần VinAI - VinAI Research | **Công ty Cổ Phần VinAI** |

### 3.2. Nâng Cấp Typography `.company-card-title` To & Rõ Ràng

1. **Tăng kích cỡ và trọng lượng chữ (Font Size & Weight):**
   - Nâng `font-size` từ `13.5px` lên **`15.5px`** (tăng ~15% kích thước hiển thị).
   - Đặt `font-weight: 750` (chuẩn Semi-Bold/Bold cao cấp trong họ font Inter), màu sắc tương phản cao `#1E293B` (`var(--text-main)`), chế độ tối tự động chuyển sang `#F8FAFC`.
2. **Bố cục Flexbox căn giữa 2 chiều hoàn hảo:**
   - Chuyển sang `display: flex; align-items: center; justify-content: center; text-align: center;`.
   - Chiều cao tối thiểu `min-height: 46px` (vừa vặn đúng 2 dòng chữ). Nhờ đó, các tên 1 dòng (VNG, Shopee, VinAI) hay 2 dòng (MB Bank, FPT, Viettel, Techcombank, MoMo) đều được căn giữa tự nhiên, thẳng hàng tăm tắp với chiều cao thẻ `256px`.
3. **Cân bằng dòng chữ tự động (Text-Wrap Balance):**
   - Tích hợp `text-wrap: balance;` và `word-break: break-word;` giúp trình duyệt tự động ngắt dòng đều đặn, triệt tiêu hoàn toàn hiện tượng từ mồ côi (ví dụ "Ngân Hàng" / "TMCP Quân Đội").
4. **Khoảng cách và đệm thẻ tối ưu:**
   - Điều chỉnh padding `.company-card` thành `26px 14px 22px` (tăng chiều rộng khả dụng bên trong thẻ lên ~200px).
   - Khoảng cách từ logo xuống tên công ty: `margin-top: 18px` thanh thoát, hài hòa.
5. **Tối ưu hiển thị Responsive Mobile (`@media (max-width: 768px)`):**
   - `font-size: 13.5px`, `line-height: 1.35`, `margin-top: 14px`, `min-height: 40px`.

---

## 4. Danh Sách Tệp Đã Cập Nhật (Đồng Bộ 100%)

| STT | Tệp Gốc (Root) | Tệp Công Khai (Public) | Nội Dung Thay Đổi |
|:---:|:---|:---|:---|
| 1 | `index.html` | `public/index.html` | Cập nhật tên 8 thẻ công ty nổi bật (bỏ đuôi tiếng Anh/viết tắt). |
| 2 | `css/home.css` | `public/css/home.css` | Tinh chỉnh padding thẻ `.company-card`, kiểu chữ to rõ `.company-card-title` (`15.5px`, `weight: 750`, `flex center`, `text-wrap: balance`), dark mode và media query mobile. |
| 3 | `js/home.js` | `public/js/home.js` | Tối ưu logic tooltip thương hiệu cho logo khối công ty nổi bật. |

---

## 5. Kết Quả Kiểm Thử Thực Tế (CDP Chrome Headless)

- **Kiểm tra DOM thực tế trên `http://localhost:3000/index.html`:**
  - 8/8 thẻ công ty hiển thị đúng 100% tên mới (không còn đuôi `- MB Bank`, `- FPT Software`...).
  - Cỡ chữ thực tế: `15.5px` (weight `750`, line-height `21.39px`).
  - Chiều cao thẻ đồng đều: `256px` trên toàn bộ 8 thẻ.
- **Ảnh minh chứng kiểm thử:**
  - `scratch/actual_production_slide1.png`: Xác nhận hiển thị 5 thẻ đầu tiên trên Desktop.
  - `scratch/actual_production_slide2.png`: Xác nhận chuyển động carousel mượt mà và hiển thị thẻ "Ngân Hàng TMCP Quân Đội" to, rõ, cân đối.
  - `scratch/actual_production_mobile.png`: Xác nhận hiển thị responsive trên thiết bị di động.
