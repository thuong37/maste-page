# Đặc Tả Kỹ Thuật: Tinh Gọn Khối Banner Bento Grid — Chỉ Hiển Thị Ảnh Banner Thuần Túy

- **Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình:** Trang chủ (`index.html`), khối Bento Grid nhà tuyển dụng tiêu biểu ngay dưới thanh tìm kiếm Hero
- **Ngày hoàn thành:** 03/10/2026
- **Trạng thái:** ✅ Đã hoàn thành và kiểm thử trực quan trên Chrome Headless (Desktop & Mobile)

---

## 1. Yêu Cầu Người Dùng

1. **Banner ngoài cùng bên trái:**
   - Bỏ tag badge `"Doanh nghiệp nổi bật"` (kèm badge `"Tài trợ"` và icon ngôi sao).
   - Bỏ toàn bộ thanh ghi chú ở bên dưới (bao gồm logo công ty, slogan, tên tập đoàn Orion và nút `"Khám phá ngay"`).
   - Chỉ giữ lại ảnh banner thuần túy của doanh nghiệp.
2. **Các banner nhỏ bên cạnh:**
   - Bỏ hoàn toàn logo viết tắt (`VN`, `SV`, `HT`).
   - Bỏ tên công ty (`Vietcom Finance`, `Saigon Retail Corp`, `HanTech Group`).
   - Bỏ số lượng vị trí tuyển dụng (`48 vị trí`, `120 vị trí`, `76 vị trí · Đang tuyển gấp`).
   - Bỏ nút CTA (`Xem ngay →`).
   - Bỏ lớp phủ gradient đen tối che mờ ảnh (`.sponsor-mini::before`).
   - Chỉ giữ lại hình ảnh banner rõ nét, nổi bật và sống động.

---

## 2. Giải Pháp Kỹ Thuật & Tối Ưu Bố Cục

### 2.1. Cấu trúc Markup HTML Semantic
- Chuyển đổi `.sponsor-primary` trực tiếp thành thẻ liên kết `<a>` bọc `<img>` với thuộc tính `alt` và `title` chuẩn SEO & Accessibility, thay vì cấu trúc lồng thẻ phức tạp với `.sponsor-primary-media`, `.ad-badge-overlay` và `.spotlight-brand-footer`.
- Tinh gọn 3 thẻ banner phụ `.sponsor-mini` thành các thẻ liên kết `<a>` chứa `<img>`, loại bỏ toàn bộ các thẻ con văn bản thừa.

### 2.2. Kiểm soát Tỷ lệ & Kích thước Pixel-Perfect
- **Vấn đề phát hiện khi đo đạc:** Khi bỏ text và đưa thẻ `<img>` vào `.sponsor-mini`, các ảnh vuông 800×800 kích hoạt intrinsic aspect-ratio khiến hàng 1 cao tới 319px, kéo theo toàn bộ grid cao 653px và làm banner chính bên trái bị ép thành hình dọc, cắt xén ngang chữ "ORION TECHNOLOGIES".
- **Giải pháp:** Thiết lập chiều cao chuẩn desktop `height: 360px !important` cho `.hero-ad-showcase.bento-sponsor-grid`, kết hợp `grid-template-rows: 1fr 1fr !important` và `min-height: 0 !important` cho các grid item.
- **Kích thước thực tế đo đạc qua Chrome CDP:**
  - Tổng grid: **1210px × 360px**
  - Banner chính bên trái: **543px × 360px** (tỷ lệ ~1.51:1, hiển thị trọn vẹn 100% chữ "ORION TECHNOLOGIES INNOVATE THE FUTURE BUILD WHAT MATTERS. JOIN US" và toàn bộ đội ngũ).
  - 2 banner phụ trên: **319px × 173px** (banner chữ nhật ngang cân đối).
  - 1 banner phụ rộng dưới: **653px × 173px** (banner panorama ngang rộng).
  - Khớp phương trình: `173px + 14px (gap) + 173px = 360px` chính xác tuyệt đối.

### 2.3. Hiệu ứng Thị giác & Chuẩn Nhận Diện Thương Hiệu EasyCV
- Viền cam đào nhẹ chuẩn nhận diện EasyCV: `border: 1.5px solid #FED7AA` trên toàn bộ các thẻ banner.
- Bo góc hiện đại `border-radius: 16px` (banner chính) và `14px` (banner phụ).
- Hiệu ứng hover tương tác cao cấp: `transform: translateY(-2px)`, đổi viền sang cam rực rỡ `#F97316`, đổ bóng quầng sáng cam `box-shadow: 0 16px 36px -6px rgba(249, 115, 22, 0.22)`, và zoom nhẹ ảnh mượt mà qua GPU `transform: scale(1.02/1.03)`.
- Bỏ hoàn toàn lớp gradient tối `::before`, giúp các bức ảnh kiến trúc tài chính, kho hàng bán lẻ và xưởng sản xuất hiển thị sáng rõ, màu sắc chân thực.

### 2.4. Bố Cục Đáp Ứng Đa Thiết Bị (Responsive)
- **Tablet (≤1024px):** Giữ bố cục Bento Grid 3 cột, chiều cao `height: 300px !important`.
- **Mobile (≤768px & ≤480px):** Chuyển sang bố cục dạng lưới 2 cột nhịp nhàng `1 -> 2 -> 1`:
  - Hàng 1: Banner chính full-width (`16 / 9` aspect ratio).
  - Hàng 2: 2 banner phụ vuông/ngang đặt cạnh nhau (`16 / 10` aspect ratio).
  - Hàng 3: 1 banner phụ rộng full-width (`21 / 9` aspect ratio).
  - Không phát sinh lỗi tràn ngang (`hasHorizontalScroll = false`, `scrollWidth = viewportWidth = 500px`).

---

## 3. Ma Trận Thay Đổi Mã Nguồn

| STT | Tệp Mã Nguồn | Vùng Thay Đổi | Nội Dung Chi Tiết |
|:---:|:---|:---|:---|
| 1 | `index.html` | `<style>` (dòng ~730–860) | Cập nhật CSS `.hero-ad-showcase.bento-sponsor-grid`, `.sponsor-primary`, `.sponsor-mini`, loại bỏ CSS chết `.ad-badge-overlay`, `.spotlight-brand-*`, `.sponsor-mini-logo/name/sub/cta`. |
| 2 | `index.html` | Markup HTML (dòng ~1900–1930) | Xóa bỏ tag "Doanh nghiệp nổi bật", thanh thông tin/nút Khám phá ngay, và text overlay ở 3 banner phụ; thay bằng thẻ liên kết `<a>` chứa `<img>`. |
| 3 | `public/index.html` | Toàn bộ tệp | Đồng bộ 100% khớp từng byte với `index.html` (kích thước: 165,070 bytes). |

---

## 4. Kết Quả Kiểm Thử (Verification Matrix)

| Kịch Bản Kiểm Thử | Công Cụ & Đo Đạc | Kết Quả | Trạng Thái |
|:---|:---|:---|:---:|
| Xóa sạch tag "Doanh nghiệp nổi bật" | `grep` & DOM inspect | Không còn phần tử `.ad-badge-overlay` | ✅ PASS |
| Xóa sạch thanh ghi chú & nút "Khám phá ngay" | `grep` & DOM inspect | Không còn phần tử `.spotlight-brand-footer` | ✅ PASS |
| Xóa sạch logo, tên công ty, số vị trí, nút ở banner nhỏ | `grep` & DOM inspect | Không còn `.sponsor-mini-logo`, `.sponsor-mini-name`, `.sponsor-mini-sub`, `.sponsor-mini-cta` | ✅ PASS |
| Kích thước & Căn chỉnh Bento Grid Desktop (1440px) | Chrome CDP (`scratch/measure_layout.js`) | Grid: 1210×360px, Primary: 543×360px, Mini A: 319×173px, Mini Wide: 653×173px | ✅ PASS |
| Hiển thị trọn vẹn văn bản ảnh banner Orion | Headless Chrome screenshot (`scratch/banners_updated_desktop.png`) | Toàn bộ text và hình ảnh hiển thị rõ ràng, không bị crop | ✅ PASS |
| Kiểm tra cuộn ngang trên màn hình Mobile (390px/500px) | Chrome CDP (`scratch/test_mobile_scroll.js`) | `hasHorizontalScroll: false`, `scrollWidth = viewportWidth` | ✅ PASS |
| Kiểm thử trực quan giao diện Mobile | Headless Chrome screenshot (`scratch/banners_updated_mobile.png`) | Nhịp hiển thị 1 -> 2 -> 1 cân đối, sắc nét | ✅ PASS |
| Đồng bộ hóa 100% tệp gốc và tệp public | Node.js buffer compare | `f1 === f2: true`, 165,070 bytes | ✅ PASS |
