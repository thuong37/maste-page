# Tài Liệu Triển Khai: Gỡ Bỏ Dòng Tiêu Đề Đầu Trang (Hero Title) Khỏi Trang Chủ EasyCV

## 1. Mục Đích & Quyết Định
- **Yêu cầu từ người dùng:** Bỏ tiêu đề đầu trang ("Tìm việc chất lượng, chạm đỉnh sự nghiệp tương lai") khỏi Trang chủ EasyCV.
- **Mục tiêu UX/UI:**
  - Tối giản hóa tối đa phần mở đầu (Hero section), đưa thanh tìm kiếm thông minh và từ khóa xu hướng lên ngay sát thanh điều hướng (navbar).
  - Tăng tốc độ tương tác cho ứng viên: Ngay khi vào trang, ứng viên nhìn thấy ngay công cụ tìm kiếm và banner tiêu điểm doanh nghiệp mà không cần cuộn trang.
  - Chuẩn hóa SEO & Trợ năng (Accessibility): Ẩn thị giác (visual hide) bằng utility `.sr-only` chuẩn CSS cho thẻ `<h1>` để giữ nguyên cấu trúc ngữ nghĩa phân cấp (heading hierarchy) cho công cụ tìm kiếm và trình đọc màn hình, không làm mất điểm SEO của trang.
- **Phương pháp quản trị:** BMAD (BMM Method).

---

## 2. Bảng Phân Tích & Ma Trận Xử Lý

| Khối / Thành phần | Mã định danh (ID/Class) | Tệp tin ảnh hưởng | Tình trạng trước xử lý | Giải pháp kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| **Tiêu đề Hero đầu trang** | `.hero-header-box`<br>`.hero-title`<br>`.highlight-orange` | [`index.html`](file:///d:/master%20page/index.html)<br>[`public/index.html`](file:///d:/master%20page/public/index.html) | Hiển thị dòng chữ lớn: `<h1>Tìm việc chất lượng, chạm đỉnh <span class="highlight-orange">sự nghiệp tương lai</span></h1>` trên thanh tìm kiếm. | Gỡ bỏ hoàn toàn thẻ `<div class="hero-header-box">` và thẻ `<h1>` hiển thị trên giao diện. |
| **Tiêu chuẩn SEO & Accessibility** | `.sr-only`<br>`<h1>` | [`index.html`](file:///d:/master%20page/index.html)<br>[`public/index.html`](file:///d:/master%20page/public/index.html) | Chỉ có thẻ H1 hiển thị trực quan. | Bổ sung tiện ích chuẩn `.sr-only` và thẻ `<h1 class="sr-only">EasyCV - Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh</h1>` (ẩn thị giác 0x0px, giữ trọn vẹn ngữ nghĩa HTML5). |
| **CSS Styles & Media Queries** | `.hero-header-box`<br>`.hero-title`<br>`.hero-desc` | [`index.html`](file:///d:/master%20page/index.html)<br>[`public/index.html`](file:///d:/master%20page/public/index.html) | Khối CSS style inline và media queries responsive (1024px, 768px). | Dọn sạch các quy tắc CSS dư thừa không còn sử dụng để giữ mã nguồn gọn gàng, tải trang nhanh hơn. |
| **Bố cục Hero** | `.hero-stack-layout` | [`index.html`](file:///d:/master%20page/index.html)<br>[`public/index.html`](file:///d:/master%20page/public/index.html) | Khối tìm kiếm nằm dưới dòng tiêu đề lớn. | Đưa trực tiếp `.hero-search-wrapper` lên vị trí đầu tiên trong `.hero-stack-layout`, tạo khoảng cách padding 32px tinh tế từ thanh navbar. |

---

## 3. Danh Sách Tệp Đã Sửa Đổi
1. [`index.html`](file:///d:/master%20page/index.html):
   - Bổ sung CSS utility `.sr-only`.
   - Gỡ bỏ markup `.hero-header-box` và `.hero-title`.
   - Bổ sung `<h1 class="sr-only">` ẩn kỹ thuật cho SEO/A11y.
   - Dọn sạch các CSS rules và media queries liên quan đến `hero-title`.
2. [`public/index.html`](file:///d:/master%20page/public/index.html): Đồng bộ hóa 100% các sửa đổi với `index.html`.
3. [`_bmad-output/planning-artifacts/.memlog.md`](file:///d:/master%20page/_bmad-output/planning-artifacts/.memlog.md): Tự động ghi nhớ quyết định (decision), hành động (action) và kiểm thử (verification).

---

## 4. Kết Quả Kiểm Thử (Verification)
Đã thực thi kịch bản kiểm thử tự động trực tiếp trên máy chủ HTTP cổng 3000 (`scratch/verify_header_removal.py`) và chụp ảnh thực tế qua Chrome Headless:

1. **Kiểm tra DOM máy chủ:**
   - `<div class="hero-header-box">`: **False (Đã gỡ bỏ)**
   - `class="hero-title"`: **False (Đã gỡ bỏ)**
   - `class="sr-only"`: **True (Đã bổ sung chuẩn SEO)**
   - `class="hero-search-wrapper"`: **True (Bảo toàn thanh tìm kiếm thông minh)**

2. **Kiểm tra hiển thị giao diện qua ảnh chụp (`scratch/homepage_no_brand_strip.png`):**
   - Vùng đầu trang hiển thị trực tiếp thanh tìm kiếm trung tâm cùng các từ khóa xu hướng (Frontend Dev, Java Spring, Marketing, UI/UX Designer, Data AI, Việc làm Remote).
   - Ngay phía dưới là Banner Tiêu điểm (Orion Technologies) và danh sách Việc làm nổi bật.
   - Giao diện liền mạch, hiện đại và chuẩn thẩm mỹ cao cấp.
