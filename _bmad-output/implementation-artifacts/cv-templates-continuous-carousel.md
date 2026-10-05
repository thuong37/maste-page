# Báo Cáo Triển Khai: Chuyển Đổi Khối "Khám Phá Mẫu CV" Thành Carousel Liên Tục (Continuous CV Template Carousel)

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Ngày cập nhật: **05/10/2026**  
Yêu cầu người dùng: **"tại trang chủ, khối 'Khám phá mẫu CV phù hợp với bạn' cho nó thành dạng carousel với logic như dải công ty trong khối 'Công ty nổi bật'"**

---

## 1. Phân Tích & Đối Soát Yêu Cầu

### 1.1 Khảo sát hiện trạng khối "Khám phá mẫu CV"
- Trước đây, khối `.cv-template-section` sử dụng giao diện phân mảnh:
  - Header dùng `.cv-template-header` riêng biệt với cụm nút điều hướng `.cv-template-actions` (chứa nút mũi tên Prev/Next cố định có trạng thái `disabled`).
  - Thanh phân loại phong cách CV (`.cv-style-filters`) gây hạn chế hiển thị và không thể chạy vô hạn mượt mà.
  - Vùng hiển thị sử dụng cuộn ngang thủ công `overflow-x: auto` kết hợp `scroll-snap-type: x mandatory` thay vì carousel tự động.
- Trải nghiệm chưa đồng nhất với dải công ty tự động chạy trong khối "Công ty nổi bật" (`#cong-ty-tieu-bieu`).

### 1.2 Logic dải công ty trong khối "Công ty nổi bật" (Featured Companies Carousel)
- **Cơ chế dịch chuyển marquee/carousel vô hạn**: Cứ mỗi 2 giây, track trượt sang trái đúng bằng bề rộng 1 thẻ + khoảng cách `gap` (`transform: translateX(-${shiftBy}px)` với hiệu ứng mượt `transition: transform 0.6s ease`).
- **Tái xoay vòng (DOM recycling)**: Khi kết thúc transition (`transitionend`), gỡ bỏ transition, hoàn nguyên `transform: translateX(0)`, đồng thời chuyển thẻ đầu tiên ra cuối danh sách (`track.appendChild(firstCard)`).
- **Kiểm soát tương tác thông minh**:
  - Tự động tạm dừng khi người dùng rê chuột vào khối (`mouseenter` -> `stop`).
  - Tiếp tục chạy lại khi chuột rời khỏi khối (`mouseleave` -> `start`).
  - Tạm dừng khi phần tử bên trong nhận tiêu điểm (`focusin` / `focusout`).
  - Tạm dừng khi chuyển tab trình duyệt (`document.hidden` / `visibilitychange`).
  - Tôn trọng thuộc tính trợ năng giảm chuyển động (`prefers-reduced-motion`).
- **Phân bổ tỷ lệ responsive hoàn hảo**:
  - **Desktop (>1024px)**: 5 thẻ/hàng (`flex: 0 0 calc((100% - 4 * 20px) / 5)`, gap 20px).
  - **Tablet (641px - 1024px)**: 3 thẻ/hàng (`flex-basis: calc((100% - 2 * 16px) / 3)`, gap 16px).
  - **Mobile (≤640px)**: 2 thẻ/hàng (`flex-basis: calc((100% - 1 * 12px) / 2)`, gap 12px).
- **Header đồng bộ chuẩn hệ thống EasyCV**: Dùng tiêu đề chuẩn `.section-header` bên trái và liên kết `.section-view-all` ("Xem tất cả mẫu CV →") bên phải, loại bỏ hoàn toàn các nút mũi tên xám thô cứng.

---

## 2. Ma Trận Thay Đổi Kỹ Thuật (Technical Changes)

| Tệp tin | Vùng thay đổi | Chi tiết triển khai |
| :--- | :--- | :--- |
| `index.html` & `public/index.html` | `<section class="cv-template-section">` | - Chuyển sang header chuẩn `.section-header` (`.section-title` + `.section-view-all`).<br>- Khôi phục và nâng cấp bộ lọc phong cách CV `.cv-style-filters` gồm 6 pill buttons: "Tất cả", "Đơn giản", "Chuyên nghiệp", "Hiện đại", "Ấn tượng", "ATS".<br>- Bọc track trong `.cv-template-carousel` với 8 thẻ mẫu CV chuẩn ATS, Modern, Creative...<br>- Nâng cache buster lên `home.css?v=7.0_cv_carousel` và `home.js?v=20261005_cv_carousel`. |
| `css/home.css` & `public/css/home.css` | `.cv-template-carousel`, `.cv-template-track`, `.cv-template-card`, `.cv-style-filters` | - `.cv-style-filters`: Flexbox bọc các pill filter bo góc mềm mại, pill `.is-active` màu cam EasyCV (`#F97316`) chữ trắng nổi bật, hover shadow nhẹ, tương thích Dark Mode.<br>- `.cv-template-carousel`: `overflow: hidden; position: relative; padding: 8px 2px 14px; margin: -8px -2px -14px;`<br>- `.cv-template-track`: `display: flex; gap: 20px; will-change: transform;`<br>- `.cv-template-card`: flex-basis 5 cột (desktop), 3 cột (tablet), 2 cột (mobile).<br>- Tinh chỉnh shadow và hover `.cv-sheet` bổng nhẹ 5px kèm viền màu nhấn thương hiệu. |
| `js/home.js` & `public/js/home.js` | `DOMContentLoaded` | - Triển khai bộ điều khiển `step()` tự động trượt 1 card mỗi 2000ms.<br>- Hàm `buildTrack(style)`: Lọc thẻ theo phong cách chọn từ `originalTemplates`, tự động nhân bản (re-populate >= 8 thẻ) để luôn lấp đầy 5 cột viewport và duy trì chu kỳ marquee trơn tru.<br>- Gắn sự kiện click cho các nút lọc để kích hoạt ngay tức thì và làm mới timer auto-step.<br>- Lắng nghe `mouseenter`, `mouseleave`, `focusin`, `focusout`, `visibilitychange`, `reducedMotion`. |

---

## 3. Kết Quả Kiểm Thử Toàn Diện (Chrome Headless CDP)

1. **Khởi tạo và cấu trúc phần tử (`scratch/verify_cv_carousel.js`)**:
   - `hasSection`: `true`
   - `hasViewport`: `true`
   - `hasTrack`: `true`
   - `cardCount`: `8` (8 mẫu CV phong phú: Emerald ATS, Professional Teal, Modern Creative, Rose Impact, Executive Slate, Clean Blue, Violet Studio, Minimal Sand)
   - `titleText`: `'Khám phá mẫu CV phù hợp với bạn'`
   - `viewAllText`: `'Xem tất cả mẫu CV'`
   - `trackDisplay`: `'flex'`
   - `trackGap`: `'20px'` (Desktop)
   - `firstCardWidth`: `226px` (chiếm đều 5 cột cân đối)

2. **Kiểm thử bộ lọc phong cách CV & Khả năng lấp đầy track (`scratch/verify_cv_filter_and_carousel.js`)**:
   - Đầy đủ 6 nút lọc phong cách: `["Tất cả", "Đơn giản", "Chuyên nghiệp", "Hiện đại", "Ấn tượng", "ATS"]`. Nút "Tất cả" có class `.is-active`.
   - Click chọn "Đơn giản": Lọc ra đúng các mẫu thuộc style `simple` (Emerald ATS, Clean Blue, Minimal Sand), thuật toán tự động nhân bản lên 9 thẻ, lấp đầy toàn bộ 5 cột hàng ngang mà không để lộ khoảng trống.
   - Vòng lặp tự động chuyển slide vẫn tiếp tục chạy mượt mà ngay cả khi đang ở chế độ lọc (thẻ đầu tiên dịch chuyển từ `Emerald ATS` sang `Clean Blue`).
   - Click quay lại "Tất cả": Khôi phục đầy đủ toàn bộ các mẫu CV.

3. **Kiểm thử tạm dừng khi tương tác (Hover Pause Test)**:
   - Khi kích hoạt sự kiện `mouseenter` hoặc `focusin`: Carousel tạm dừng chuyển động ngay lập tức (`PASS`).
   - Giữ nguyên thẻ đang xem để ứng viên tập trung đọc chi tiết mẫu CV và click chọn. Khi chuột rời khỏi (`mouseleave`), carousel tự động kích hoạt chạy tiếp tục.

4. **Kiểm thử đa thiết bị (Responsive Mobile & Tablet)**:
   - Mobile (390x844): `cardWidth = 228px`, hiển thị chính xác 2 thẻ/hàng (`calc(50% - 6px)`), không phát sinh tràn viền hay thanh cuộn xám.
   - Ảnh chụp minh chứng nghiệm thu trực quan:
     - `scratch/cv_carousel_full_view.png`: Giao diện Desktop sắc nét, hiển thị cả tiêu đề, link xem tất cả, 6 nút filter và 5 card mẫu CV.
     - `scratch/cv_filter_simple_active.png`: Trạng thái lọc "Đơn giản" đang hoạt động và tự động lấp đầy track.
     - `scratch/cv_carousel_mobile.png`: Giao diện Mobile tối ưu, mượt mà.

