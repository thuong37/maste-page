# Báo Cáo Triển Khai: Tích Hợp Slider 2 Nút Chuyển Đổi Cho Khối Banner Chính (Trang Chủ)

**Mã tài liệu:** `homepage-sponsor-banner-slider`  
**Ngày cập nhật:** 04/10/2026  
**Trạng thái:** Hoàn tất & Đã nghiệm thu tự động (100% PASS)  

---

## 1. Yêu Cầu Của Người Dùng
- Trên tấm banner to nhất ngoài cùng bên trái (`.sponsor-primary`), thiết kế 2 nút chuyển đổi (Prev & Next) ở 2 bên mép để người dùng bấm chuyển đổi qua lại.
- Tạo thêm 1 tấm banner mẫu thứ 2 để khi bấm chuyển đổi có nội dung hiển thị ngay trong quá trình demo.
- Đảm bảo layout 3 banner cân đối (1 ô chính slider tỷ lệ `1.5fr` + 2 ô phụ xếp dọc `1fr`, chiều cao cố định `360px`).

---

## 2. Giải Pháp Kỹ Thuật & Kiến Trúc Thiết Kế

### 2.1. Cấu Trúc Slider (.sponsor-primary)
Container `.sponsor-primary` được nâng cấp thành Slider tương tác:
- **Danh sách Slide (`.sponsor-slides-wrapper`):**
  - **Slide 1:** Orion Technologies (`assets/banners/employer-spotlight-banner.jpg`), class `.sponsor-slide.active`.
  - **Slide 2:** Sáng tạo Công nghệ & Đổi mới bứt phá (`assets/banners/employer-spotlight-innovation.png`), class `.sponsor-slide.sponsor-slide-innovation`. Đã được căn chỉnh trọng tâm chính xác vào cụm 3 bạn kỹ sư trẻ (`object-position: 16% 68%`, `scale: 1.12`), khắc phục triệt để hiện tượng con người bị dạt ra sát rìa mép khung hình.
- **2 Nút chuyển đổi dính sát mép rìa theo mẫu thiết kế (`.sponsor-slider-btn`):**
  - **Thiết kế dạng bán nguyệt áp sát viền:** Nút nằm dính sát vào đường biên giới ngoài của banner (`left: 0` cho nút Prev, `right: 0` cho nút Next), cạnh ngoài phẳng, cung tròn bo mềm mại vào lòng banner (`border-radius: 0 24px 24px 0` và `24px 0 0 24px`).
  - **Kích thước & Visual:** Rộng `28px`, cao `48px`, nền kính mờ trắng dịu nhẹ (`rgba(255, 255, 255, 0.88)` & `backdrop-filter: blur(6px)`), viền mỏng mờ tinh tế.
  - **Icon thanh mảnh:** Kích thước `15x15px`, nét mảnh `stroke-width: 2`, màu sắc êm mắt `#334155`. Khi hover chuyển sang nền cam EasyCV (`#F97316`) nổi bật.
- **Bộ chỉ số chấm (`.sponsor-slider-dots`):**
  - Đặt ở đáy banner (`bottom: 12px; left: 50%; transform: translateX(-50%)`).
  - Hỗ trợ click trực tiếp vào chấm để nhảy đến slide tương ứng.


### 2.2. Xử Lý Tương Tác (JavaScript - `initHeroSponsorSlider`)
- Điều khiển chuyển slide vòng tròn (Looping).
- Tích hợp Auto-play 5s tự động trượt, tạm dừng khi rê chuột (`mouseenter`) và tiếp tục khi rời chuột (`mouseleave`).
- Ngăn chặn click propagation (`e.preventDefault()`, `e.stopPropagation()`) để không kích hoạt thẻ link điều hướng khi người dùng nhấn nút chuyển đổi.

---

## 3. Tệp Tin Đã Chỉnh Sửa & Đồng Bộ

| STT | Tệp tin | Nội dung thay đổi |
|-----|---------|-------------------|
| 1 | `index.html` | Cập nhật CSS inline slider, markup 2 slide, nút prev/next và dots |
| 2 | `public/index.html` | Đồng bộ toàn bộ layout 3 banner, CSS inline slider và markup slider |
| 3 | `js/home.js` | Thêm hàm `initHeroSponsorSlider()` với đầy đủ tính năng tương tác |
| 4 | `public/js/home.js` | Đồng bộ hàm `initHeroSponsorSlider()` |
| 5 | `scratch/server.js` | Máy chủ Node.js phục vụ localhost:3000 |
| 6 | `scratch/verify_banner_slider.js` | Kịch bản kiểm thử tự động Chrome CDP Headless |

---

## 4. Kết Quả Kiểm Thử Nghiệm Thu (Automated Verification)

Chạy kiểm thử tự động qua Chrome CDP Headless trên máy chủ `localhost:3000`:
- **Khởi tạo:** `hasSlider: true`, `slidesCount: 2`, `activeSlideIndex: 0`, `activeDotIndex: 0`.
- **Nhấn Next:** Chuyển sang slide 2 thành công (`activeSlideIndex: 1`, `activeDotIndex: 1`).
- **Nhấn Prev:** Quay về slide 1 thành công (`activeSlideIndex: 0`, `activeDotIndex: 0`).
- **Ảnh chụp minh chứng:** Đã ghi nhận `scratch/banner_slide1.png` và `scratch/banner_slide2.png`.
