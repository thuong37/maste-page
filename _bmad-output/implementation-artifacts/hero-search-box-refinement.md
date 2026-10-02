# Tài Liệu Triển Khai: Highlight & Tinh Chỉnh Độ Cao Box Tìm Kiếm 60px Trang Chủ EasyCV

## 1. Mục Đích & Quyết Định
- **Yêu cầu từ người dùng:** "chỉnh lại độ cao lên 60 cho tôi" (sau khi đã áp dụng viền cam highlight thương hiệu EasyCV).
- **Mục tiêu UX/UI & Nhận diện thương hiệu EasyCV:**
  - **Độ cao chuẩn 60px:** Cố định `height: 60px; min-height: 60px; box-sizing: border-box;` cho `.hero-search-box` trên Desktop, tạo cảm giác bề thế, đĩnh đạc và cực kỳ sang trọng cho thanh tìm kiếm trung tâm.
  - **Nút Tìm Việc Ngay 46px:** Nâng chiều cao nút lên 46px, chữ 15px đậm nét (`font-weight: 700`), bo góc 10px, căn giữa hoàn hảo icon và văn bản.
  - **Highlight nổi bật EasyCV:** Bảo lưu nguyên vẹn đường viền màu cam thương hiệu EasyCV (`#F97316`, độ dày 1.5px) kết hợp dải quầng sáng halo đa tầng (`box-shadow: 0 4px 20px -2px rgba(249, 115, 22, 0.16), 0 2px 6px -1px rgba(15, 23, 42, 0.06), 0 0 0 3px rgba(249, 115, 22, 0.08)`). Khi hover và focus-within, quầng sáng tự động chuyển tiếp mượt sang sắc cam đậm `#EA580C`.
  - **Responsive linh hoạt:** Trên thiết bị di động (màn hình < 768px), box tự động co giãn (`height: auto !important; min-height: auto !important;`) và xếp chồng (stacked) dọc mượt mà.
- **Phương pháp quản trị:** BMAD (BMM Method).

---

## 2. Bảng Phân Tích & Ma Trận Xử Lý Chi Tiết

| Thành phần | Selector CSS | Thông số cũ (~48px) | Thông số mới chuẩn (60px) | Hiệu quả đạt được |
| :--- | :--- | :--- | :--- | :--- |
| **Khung ngoài Search Box** | `.hero-search-box` | - `height`: tự co (~48px)<br>- `padding: 4px`<br>- `border-radius: 12px` | - `height: 60px; min-height: 60px;`<br>- `padding: 5px 6px`<br>- `border-radius: 14px`<br>- `border: 1.5px solid #F97316`<br>- Quầng sáng halo cam đa lớp | Box đạt độ cao chính xác **60px**, dáng vẻ thanh thoát, sang trọng và thu hút thị giác hàng đầu. |
| **Nút Tìm Việc Ngay** | `.btn-hero-search` | - `height: 38px`<br>- `font-size: 14px`<br>- `border-radius: 9px` | - `height: 46px`<br>- `padding: 0 24px`<br>- `font-size: 15px`<br>- `font-weight: 700`<br>- `border-radius: 10px` | Nút bấm lớn, bề thế, dễ bấm, tạo điểm nhấn CTA mạnh mẽ. |
| **Nhóm Input từ khóa** | `.search-input-group`<br>`.search-input` | - `padding: 6px 12px`<br>- `font-size: 14px` | - `height: 100%`<br>- `padding: 0 12px`<br>- `font-size: 14.5px`<br>- `line-height: 24px` | Khoảng không nhập liệu rộng rãi, thoáng mắt. |
| **Vạch ngăn cách** | `.search-divider` | - `height: 20px` | - `height: 28px` | Tương xứng hoàn hảo với độ cao khung 60px. |
| **Trigger Chọn địa điểm** | `.location-trigger` | - `padding: 6px 4px`<br>- `font-size: 13.5px` | - `padding: 8px 6px`<br>- `font-size: 14px`<br>- `gap: 8px` | Căn giữa tuyệt đối với input và nút tìm kiếm. |

---

## 3. Danh Sách Tệp Đã Sửa Đổi & Đồng Bộ
1. [`index.html`](file:///d:/master%20page/index.html):
   - Cập nhật khối inline critical CSS `.hero-search-box` (height: 60px, padding: 5px 6px, btn: 46px, divider: 28px).
   - Tối ưu media query di động `height: auto !important; min-height: auto !important;`.
2. [`public/index.html`](file:///d:/master%20page/public/index.html): Đồng bộ 100% với `index.html`.
3. [`css/home.css`](file:///d:/master%20page/css/home.css) & [`public/css/home.css`](file:///d:/master%20page/public/css/home.css):
   - Cập nhật quy tắc `.hero-search-box` chuẩn 60px và responsive mobile.
4. [`css/navbar.css`](file:///d:/master%20page/css/navbar.css) & [`public/css/navbar.css`](file:///d:/master%20page/public/css/navbar.css):
   - Cập nhật quy tắc `.hero-search-box` chuẩn 60px và responsive mobile.
5. [`css/location-picker.css`](file:///d:/master%20page/css/location-picker.css) & [`public/css/location-picker.css`](file:///d:/master%20page/public/css/location-picker.css):
   - Tinh chỉnh `.location-trigger` chuẩn 14px, padding 8px 6px.
6. [`_bmad-output/planning-artifacts/.memlog.md`](file:///d:/master%20page/_bmad-output/planning-artifacts/.memlog.md): Tự động ghi nhớ quyết định (decision), hành động (action) và kiểm thử (verification).

---

## 4. Kết Quả Kiểm Thử (Verification)
Đã thực thi kiểm thử và chụp ảnh màn hình bằng Chrome Headless kết nối trực tiếp đến máy chủ localhost:3000:

1. **Giao diện Desktop (1440x1200 - file `scratch/homepage_no_brand_strip.png`):**
   - Thanh tìm kiếm đạt đúng độ cao **60px**, các thành phần bên trong (icon, input, divider, địa điểm và nút CTA) thẳng hàng chuẩn xác trên trục ngang.
   - Viền cam `#F97316` kết hợp quầng sáng halo tạo độ tương phản cao, làm nổi bật thanh tìm kiếm ngay vị trí trung tâm.
2. **Giao diện Mobile (390x844 - file `scratch/homepage_mobile.png`):**
   - Box tìm kiếm tự động chuyển sang bố cục xếp chồng dọc mượt mà (`height: auto`), không bị bó cứng kích thước, đảm bảo trải nghiệm tương tác chạm vuốt dễ dàng.
