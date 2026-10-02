# Đặc Tả Tính Năng: Box Chuyển Đổi Trạng Thái Web / Mobile Web Lơ Lửng Rìa Phải Màn Hình

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Vị trí: **Box lơ lửng cố định ở rìa bên phải màn hình (`#floatingViewModeBox`)**  
Cập nhật: 02/10/2026 (Phiên bản 2.0 Floating Widget)

---

## 1. Mục Tiêu Thiết Kế & Yêu Cầu Cải Tiến
- **Loại bỏ tình trạng chật chội trên thanh menu:** Nút chuyển đổi trước đây đặt trong `.navbar-actions` khiến thanh menu trên di động bị tràn ngang (overflow-x) và che mất nút hamburger (`mobile-toggle-btn`).
- **Chuyển thành Box lơ lửng ở rìa bên phải màn hình:** Thiết kế floating widget cố định ở rìa phải (`position: fixed; right: 18px; top: 50%; transform: translateY(-50%)`), luôn sẵn sàng truy cập từ mọi độ sâu cuộn trang mà không ảnh hưởng đến bất kỳ thành phần điều hướng nào của website.
- **Chuyển đổi màn hình về trạng thái Mobile Web mượt mà:** Khi bật Mobile Web, màn hình ngay lập tức chuyển đổi về không gian mô phỏng thiết bị di động chuẩn quốc tế (iPhone 16 Pro, Samsung Galaxy S24, iPhone SE), kích hoạt 100% các truy vấn CSS Responsive `@media (max-width: 768px)`, loại bỏ hoàn toàn thanh cuộn ngang, hiển thị trọn vẹn menu hamburger, thẻ việc làm, bộ lọc và thanh tìm kiếm tối ưu cho cảm ứng.

---

## 2. Chi Tiết Giao Diện Box Lơ Lửng (Floating Widget UI/UX)
- **Vị trí & Hiệu ứng:**
  - Cố định ở rìa bên phải màn hình với `z-index: 2000000`, nổi bật trên mọi layer.
  - Thiết kế Glassmorphism đẳng cấp: Nền mờ kính bán trong suốt (`rgba(255, 255, 255, 0.96)`, backdrop blur `18px`), viền mờ tinh tế `#E2E8F0`, bóng đổ đa tầng sang trọng `0 12px 36px rgba(15, 23, 42, 0.14)`.
  - Hỗ trợ đầy đủ Dark Mode (`rgba(17, 24, 39, 0.92)`).
- **Thành phần bên trong Box:**
  1. **Thanh tiêu đề:**
     - Đèn LED trạng thái: Xanh lá cây khi ở bản Web Desktop, Cam EasyCV nhấp nháy khi ở bản Mobile Web.
     - Tiêu đề "CHẾ ĐỘ XEM".
     - Nút thu gọn (`#floatingMinBtn`): Cho phép gập box thành một tab con nhộng gọn gàng `[📱/💻 Chế độ xem]` bám sát cạnh phải nếu muốn giải phóng tầm nhìn.
  2. **Bộ chuyển đổi phân đoạn (Segmented Switcher):**
     - Nút **[ 💻 Web ]**: Bản Web Desktop toàn màn hình 100%.
     - Nút **[ 📱 Mobile Web ]**: Dải màu cam EasyCV `linear-gradient(135deg, #FF8A34 0%, #F97316 100%)`, chữ trắng `#FFFFFF`, kích hoạt giao diện mobile.
  3. **Bảng điều khiển thiết bị di động (Tự động mở khi chọn Mobile Web):**
     - Bộ chọn 3 kích thước thiết bị thịnh hành:
       - **iPhone 16 Pro** (390 × 844 px)
       - **Galaxy S24** (412 × 915 px)
       - **iPhone SE** (375 × 667 px)
     - Nút **[ 🔄 Xoay ]**: Đảo chiều màn hình giữa Dọc (Portrait) và Ngang (Landscape).
     - Nút **[ 🔄 Tải lại ]**: Làm mới khung hiển thị mobile.
     - Nút **Quay lại bản Web** (hoặc bấm phím `ESC` bất kỳ lúc nào).

---

## 3. Khắc Phục Lỗi Hiển Thị Tràn Ngang & Tối Ưu Hóa Responsive
- **Giải quyết triệt để lỗi tràn ngang trên Mobile:**
  - Gỡ bỏ hoàn toàn cụm nút cũ khỏi `.navbar-actions` trên tất cả các trang (`viec-lam.html`, `index.html`, `chi-tiet-viec-lam.html` và thư mục `public/`).
  - Thanh header mobile giờ đây vừa vặn hoàn hảo trong 320px - 390px: Logo EasyCV (`38px`) + icon thông báo + icon tin nhắn + avatar cá nhân + nút hamburger (`mobile-toggle-btn`) được căn chỉnh cân đối, không còn hiện tượng đẩy hamburger ra ngoài màn hình.
  - Bổ sung gói CSS Responsive `@media (max-width: 768px)` cho `css/viec-lam.css`:
    - Thanh tìm kiếm xếp dọc (column layout) không bị gò bó `max-width`.
    - Thẻ việc làm tự động co giãn 100% chiều rộng, logo doanh nghiệp `44px`, tiêu đề và huy hiệu lương xếp gọn.
    - Thanh thông tin kết quả và dropdown sắp xếp tự động co giãn.
    - Đảm bảo `overflow-x: hidden` xuyên suốt trang, thanh cuộn ngang dưới đáy màn hình điện thoại đã biến mất 100%.

---

## 4. Cơ Chế Xử Lý Iframe Đa Nền Tảng (Universal Protocol Handling)
- Khi chạy trên máy chủ nội bộ (`http://localhost:3000` hoặc HTTPS): Khung điện thoại tải trực tiếp URL trang hiện tại thông qua `iframe.src = window.location.href`.
- Khi người dùng mở tệp trực tiếp (`file:///`): Tránh lỗi chặn bảo mật tài nguyên cục bộ của Chrome/Edge bằng cơ chế dự phòng nạp cấu trúc tài liệu qua `iframe.srcdoc = document.documentElement.outerHTML`.
- Khi khung con đang chạy giả lập: Tự động kích hoạt lớp `body.in-simulator`, ẩn box lơ lửng bên trong khung điện thoại để trải nghiệm nhìn từ màn hình ngoài hoàn toàn giống hệt một chiếc điện thoại thật.

---

## 5. Loại Bỏ Triệt Để Thanh Cuộn Dọc Trên Mobile Web (Scrollbar Elimination)
- **Vấn đề đã xử lý:** Trình duyệt Windows mặc định vẽ thanh cuộn dọc dày 17px màu xám kèm mũi tên điều hướng bên trong khung iframe giả lập, làm mất tính chân thực của giao diện di động.
- **Giải pháp đa tầng (Bulletproof Multi-Layer Architecture):**
  1. **Inline Critical CSS `<style id="easycv-mobile-scrollbar-killer">`:** Nhúng trực tiếp vào thẻ `<head>` của tất cả các file HTML, triệt tiêu hoàn toàn độ trễ hiển thị và không phụ thuộc vào bộ nhớ đệm (cache) của trình duyệt.
  2. **Quy tắc CSS toàn diện trên WebKit / Blink / Gecko:**
     - `::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; background: transparent !important; }`
     - `* { scrollbar-width: none !important; -ms-overflow-style: none !important; }`
     - Áp dụng trên cả `@media (max-width: 1024px)` và class `.in-simulator`.
  3. **Bộ tiêm động (Dynamic Injector) trong `js/navbar.js`:** Ngay khi iframe được nạp hoặc làm mới (load event), tự động gắn style killer và class `.in-simulator` vào DOM con.
  4. **Nâng version cache buster:** Cập nhật toàn bộ link CSS và JS thành `?v=6.0_no_scrollbar` để đảm bảo trình duyệt người dùng luôn lấy phiên bản mới nhất ngay lập tức.
- **Kết quả:** Thanh cuộn dọc màu xám biến mất hoàn toàn, người dùng cuộn/vuốt nội dung trang cực kỳ mượt mà tựa như trên màn hình iPhone/Android thật.

---

## 6. Danh Mục Các Tệp Mã Nguồn Đã Cập Nhật
1. `css/navbar.css` & `public/css/navbar.css`: Xây dựng toàn bộ giao diện `.floating-view-mode-box`, thiết lập `z-index: 2000000`, tối ưu kích thước logo & actions di động, bổ sung quy tắc khử thanh cuộn cho `.in-simulator` và `@media (max-width: 1024px)`.
2. `js/navbar.js` & `public/js/navbar.js`: Tự động khởi tạo box lơ lửng, quản lý chuyển đổi chế độ xem Web / Mobile Web, kích thước khung thiết bị, chức năng xoay ngang/dọc, phím tắt ESC và tiêm dynamic scroll killer vào iframe.
3. `css/viec-lam.css` & `public/css/viec-lam.css`: Bổ sung toàn diện quy tắc responsive cho di động `@media (max-width: 768px)`, loại bỏ lỗi tràn ngang và ẩn scrollbar.
4. `viec-lam.html`, `index.html`, `chi-tiet-viec-lam.html` (và bản sao trong `public/`): Làm sạch hoàn toàn thanh menu, nhúng inline `<style id="easycv-mobile-scrollbar-killer">` và nâng version `?v=6.0_no_scrollbar`.

