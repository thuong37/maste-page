# 01 — Đặc tả màn hình trang chủ ứng viên

## 1. Mục tiêu và đối tượng

Màn hình giúp ứng viên tìm việc theo từ khóa/địa điểm, khám phá việc làm và công ty, xem khóa học/sự kiện. Trang hiện là một landing page dài, ngôn ngữ Việt, trạng thái mặc định là **ứng viên đã đăng nhập** để trình diễn đầy đủ menu. Thanh chuyển trạng thái đăng nhập và dark mode ở đầu trang chỉ là công cụ demo.

## 2. Bản đồ màn hình theo thứ tự DOM

| ID | Vùng | Thành phần chính | Nguồn DOM |
|---|---|---|---|
| H01 | Thanh demo + header | Chuyển logged in/guest, theme; logo; 4 menu chính; CTA nhà tuyển dụng; thông báo, tin nhắn, tài khoản; menu mobile | `index.html` → `.demo-control-bar`, `.site-header`, `.mobile-drawer-overlay` |
| H02 | Hero | H1, mô tả, ô từ khóa, chọn địa điểm, nút tìm, gợi ý tìm kiếm, tag xu hướng | `.hero-mock-section` |
| H03 | Quảng bá đầu trang | Banner Orion 3 ảnh, dấu điều hướng, chân banner doanh nghiệp, dải card đối tác | `.hero-ad-showcase`, `.hero-brand-strip` |
| H04 | Việc làm nổi bật | Tiêu đề, mô tả, link xem tất cả, 6 pill ngành, lưới job card | `#viec-lam-noi-bat` |
| H05 | Việc làm lương cao | Tiêu đề, link xem thêm, lưới card có đãi ngộ/lương | `#viec-lam-hap-dan` |
| H06 | Công ty nổi bật | Card có cover, logo, ngành, xác thực, theo dõi và số việc | `#cong-ty-tieu-bieu` |
| H07 | Quảng bá VIP | Khối infeed giới thiệu VIP Pro, CTA dùng thử | `.infeed-vip-ad-section` |
| H08 | Việc làm phù hợp | Banner hoàn thiện hồ sơ, tab gợi ý, job card với mức khớp mẫu | `#viec-lam-phu-hop` |
| H09 | Hai banner quảng bá | Sự kiện tuyển dụng và học bổng/chứng chỉ đối tác | `.promo-banners-grid` |
| H10 | Khóa học | Card khóa học, ảnh, tag, giảng viên, đánh giá, giá; carousel | `#goi-y-khoa-hoc` |
| H11 | Sự kiện | Card ngày, hình thức, đơn vị tổ chức, mô tả, số người, CTA | `#goi-y-su-kien` |
| H12 | Ngành nghề/từ khóa | Lưới ngành và các từ khóa tìm kiếm nhanh | `#tu-khoa-pho-bien` |
| H13 | Footer + AI nổi | Form nhận tin, các cột liên kết, liên hệ, social; nút gợi ý AI và popover | `#chan-trang`, `.floating-ai-widget` |

## 3. Header và hero

- Header nền sáng, logo EasyCV. Logo trong `index.html` và footer dùng asset dưới `assets/logos/`; khi đưa vào Vite/Next hoặc thư mục `public`, kiểm tra lại đường dẫn thực.
- Bốn menu chính: **Việc làm**, **Hồ sơ & CV**, **Ứng tuyển**, **Công cụ nghề nghiệp**. Mỗi menu mở dropdown với nhiều mục. Menu tài khoản đã đăng nhập có nhóm hồ sơ, công việc, cài đặt và đăng xuất.
- Guest chỉ thấy đăng nhập/đăng ký; thông báo và tin nhắn ẩn. Mobile dùng drawer với các nhóm tương đương.
- Hero hiện dùng `.hero-stack-layout`: H1 căn giữa, tiếp theo là ô tìm kiếm, tag xu hướng, banner doanh nghiệp rồi dải đối tác, xếp dọc cả trên màn lớn. CSS inline đầu `index.html` đặt `flex-direction: column !important`, ghi đè tên class/layout cũ trong CSS ngoài. Giữ bố cục dọc này khi tái dựng.
- Ô tìm kiếm gồm input từ khóa, nút xóa, trigger địa điểm, nút **Tìm kiếm**. Gợi ý bao gồm lịch sử gần đây, xu hướng và mega menu ngành nghề nhiều trang.
- Bộ chọn địa điểm có 2 chế độ địa giới mẫu: tỉnh/quận huyện cũ và tỉnh/phường xã sau 01/07/2025. Hai cột tỉnh và đơn vị cấp dưới, tìm kiếm từng cột, chọn nhiều nơi, **Bỏ chọn tất cả**, **Áp dụng**.

## 4. Card và nội dung

- `job-card`: logo công ty, tên vị trí, công ty, metadata (lương/địa điểm/thời gian/tags), badge và nút bookmark. Phần chi tiết chính xác của từng card lấy từ DOM hiện tại; dữ liệu thật phải đi qua model ở tài liệu 03.
- `attractive-card`: biến thể job card cho việc lương cao, giữ mức nhấn thị giác mạnh hơn.
- `company-card`: cover, logo, tên công ty, nhãn xác thực, ngành, dữ liệu tuyển dụng và nút theo dõi.
- `course-card`: ảnh, lĩnh vực, mức phù hợp mẫu, tiêu đề, giảng viên, đánh giá, giá hiện tại/giá cũ.
- `event-card`: nhãn ngày và hình thức, tên, tổ chức, mô tả, số tham gia mẫu, nút đăng ký.
- Banner tài trợ cần có dấu nhận diện quảng cáo/tài trợ như giao diện hiện tại.

## 5. Hệ thị giác

- Font chính: Plus Jakarta Sans với fallback hệ thống. Lấy token từ `assets/design-tokens.css`.
- Màu thương hiệu: cam `#F97316`, hover `#EA580C`, xanh đen `#0F172A`, nền phụ `#F8FAFC`, viền `#E2E8F0`. Giữ các màu riêng của thành phần trong CSS nguồn nếu mục tiêu là bám sát bản mẫu.
- Vùng nội dung chính tối đa `1250px` (`--container-max-width`); navbar có giới hạn riêng khoảng `1360px`. Các card dùng nền trắng, bo góc, viền mỏng và khoảng trắng rõ.
- CSS nguồn có breakpoint `1100`, `1024`, `992`, `900`, `768`, `700`, `640px`. Tái dựng theo hành vi thực thay vì chọn duy nhất một breakpoint chung.
- Màn desktop: grid job/công ty nhiều cột. Tablet: giảm số cột. Mobile: card một cột, bộ tìm kiếm và menu đủ rộng, không tràn ngang. Carousel khóa học hiển thị 4/2/1 card theo độ rộng >1100 / 641–1100 / ≤640px.
- Dark mode tồn tại dưới `[data-theme="dark"]`, nhưng nút bật chỉ ở thanh demo. Nếu dự án đích có theme thật, nối vào hệ theme đó.

## 6. Accessibility và nội dung

- Dùng landmark `header`, `nav`, `main`, `section`, `footer`; mỗi trang chỉ có một H1.
- Nút icon có tên dễ hiểu; dropdown/drawer/picker cập nhật `aria-expanded`, trạng thái chọn dùng `aria-pressed` hoặc cấu trúc phù hợp. `Esc` đóng lớp nổi, focus quay về nút mở.
- Có focus ring thấy được, điều hướng bàn phím đầy đủ, các carousel dừng khi hover/focus và khi `prefers-reduced-motion: reduce`.
- Trạng thái không có kết quả phải có thông điệp và cách xóa/sửa bộ lọc; không để lưới trắng trống.
- Các số như 1.500+, 50.000, 95%, 85%, 14 ngày, số người tham gia và mức giá là **dữ liệu trình diễn** trong HTML; chỉ hiện dưới dạng dữ liệu thật khi được nguồn dữ liệu cung cấp.
