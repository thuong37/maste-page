# 01 — Đặc tả màn hình trang chủ ứng viên

## 1. Mục tiêu và đối tượng

Màn hình giúp ứng viên tìm việc theo từ khóa/địa điểm, khám phá việc làm và công ty, xem khóa học/sự kiện. Trang là một landing page dài, ngôn ngữ Việt và luôn được đặc tả trong trạng thái **ứng viên đã đăng nhập**. Không triển khai DemoBar, nút chuyển guest/logged-in hoặc guest actions trong header/drawer.

## 2. Bản đồ màn hình theo thứ tự DOM

| ID | Vùng | Thành phần chính | Nguồn DOM |
|---|---|---|---|
| H01 | Header | Logo; 4 menu chính; CTA nhà tuyển dụng; thông báo, tin nhắn, tài khoản ứng viên đã đăng nhập; menu mobile | `index.html` → `.site-header`, `.mobile-drawer-overlay` |
| H02 | Hero | H1, mô tả, ô từ khóa, chọn địa điểm, nút tìm, gợi ý tìm kiếm, tag xu hướng | `.hero-mock-section` |
| H03 | Quảng bá đầu trang | Banner Orion 3 ảnh, dấu điều hướng, chân banner doanh nghiệp, dải card đối tác | `.hero-ad-showcase`, `.hero-brand-strip` |
| H04 | Việc làm nổi bật | Tiêu đề, mô tả, link xem tất cả, 6 pill ngành, lưới job card | `#viec-lam-noi-bat` |
| H05 | Việc làm lương cao | Tiêu đề, link xem thêm, lưới card có đãi ngộ/lương | `#viec-lam-hap-dan` |
| H06 | Công ty nổi bật | Vị trí theo gói hiển thị; 4 card/trang (2 cột × 2 hàng), tự chuyển 5 giây, có chỉ báo trang; card có cover, logo, ngành, xác thực, theo dõi và số việc | `#cong-ty-tieu-bieu` |
| H07 | Quảng bá VIP | Khối infeed giới thiệu VIP Pro, CTA dùng thử | `.infeed-vip-ad-section` |
| H08 | Việc làm phù hợp | Banner hoàn thiện hồ sơ, tab gợi ý, job card với mức khớp mẫu | `#viec-lam-phu-hop` |
| H09 | Đề xuất mẫu CV | Chỉ hiển thị tiêu đề “Khám phá mẫu CV phù hợp với bạn” (không có eyebrow “Tạo CV nhanh chóng”), bộ lọc Tất cả/Đơn giản/Chuyên nghiệp/Hiện đại/Ấn tượng/ATS, carousel preview CV và CTA “Xem tất cả” | Component `CvTemplateRecommendations`; thay hoàn toàn `.promo-banners-grid` cũ |
| H10 | Khóa học | Chỉ hiển thị tiêu đề “Khóa học nâng cao kỹ năng”, không có dòng mô tả phụ; card khóa học, ảnh, tag, giảng viên, đánh giá, giá; carousel | `#goi-y-khoa-hoc` |
| H11 | Sự kiện | Chỉ hiển thị tiêu đề “Sự kiện tuyển dụng”, không có dòng mô tả phụ; card ngày, hình thức, đơn vị tổ chức, mô tả, số người, CTA | `#goi-y-su-kien` |
| H12 | Ngành nghề/từ khóa | Chỉ hiển thị tiêu đề “Ngành nghề & từ khóa phổ biến”, không có dòng mô tả phụ; lưới ngành và các từ khóa tìm kiếm nhanh | `#tu-khoa-pho-bien` |
| H13 | Footer | Footer 5 cột: thương hiệu/pháp lý, Về EasyCV, Ứng viên, Nhà tuyển dụng, Liên hệ & ứng dụng; thanh copyright/social; không có form nhận tin | `#chan-trang` |
| H14 | AI nổi | Nút gợi ý AI và popover danh sách việc làm phù hợp | `.floating-ai-widget` |

## 3. Header và hero

- Header nền sáng, logo EasyCV. Logo trong `index.html` và footer dùng asset dưới `assets/logos/`; khi đưa vào Vite/Next hoặc thư mục `public`, kiểm tra lại đường dẫn thực.
- Bốn menu chính: **Việc làm**, **Hồ sơ & CV**, **Ứng tuyển**, **Công cụ nghề nghiệp**. Mỗi menu mở dropdown với nhiều mục. Menu tài khoản đã đăng nhập có nhóm hồ sơ, công việc, cài đặt và đăng xuất.
- Header luôn hiển thị thông báo, tin nhắn và menu tài khoản ứng viên đã đăng nhập. Mobile dùng drawer tương đương và không có nút đăng nhập/đăng ký.
- Hero hiện dùng `.hero-stack-layout`: H1 căn giữa, tiếp theo là ô tìm kiếm, tag xu hướng, banner doanh nghiệp rồi dải đối tác, xếp dọc cả trên màn lớn. CSS inline đầu `index.html` đặt `flex-direction: column !important`, ghi đè tên class/layout cũ trong CSS ngoài. Giữ bố cục dọc này khi tái dựng.
- Ô tìm kiếm gồm input từ khóa, nút xóa, trigger địa điểm, nút **Tìm kiếm**. Gợi ý bao gồm lịch sử gần đây, xu hướng và mega menu ngành nghề nhiều trang.
- Bộ chọn địa điểm có 2 chế độ địa giới mẫu: tỉnh/quận huyện cũ và tỉnh/phường xã sau 01/07/2025. Hai cột tỉnh và đơn vị cấp dưới, tìm kiếm từng cột, chọn nhiều nơi, **Bỏ chọn tất cả**, **Áp dụng**.

## 4. Card và nội dung

- `job-card`: logo công ty, tên vị trí, công ty, metadata (lương/địa điểm/thời gian/tags), badge và nút bookmark. Phần chi tiết chính xác của từng card lấy từ DOM hiện tại; dữ liệu thật phải đi qua model ở tài liệu 03.
- `attractive-card`: biến thể job card cho việc lương cao, giữ mức nhấn thị giác mạnh hơn.
- `company-card`: cover, logo, tên công ty, nhãn xác thực, ngành, dữ liệu tuyển dụng và nút theo dõi.
- `course-card`: ảnh, lĩnh vực, mức phù hợp mẫu, tiêu đề, giảng viên, đánh giá, giá hiện tại/giá cũ.
- `event-card`: nhãn ngày và hình thức, tên, tổ chức, mô tả, số tham gia mẫu, nút đăng ký.
- Khu vực mẫu CV dùng ảnh preview tỷ lệ A4, desktop 5 mẫu, tablet 3 mẫu, mobile 1–2 mẫu; không tự chuyển carousel. Click card mở editor bằng đúng `templateId`; “Xem tất cả” mở trang tạo CV.

## 5. Footer và điều hướng

- Cột thương hiệu/pháp lý: logo về `/`; mô tả, giấy phép và chứng nhận là văn bản trừ khi có URL tra cứu chính thức được duyệt.
- Cột **Về EasyCV**: Giới thiệu, Ban điều hành & Cố vấn, Tuyển dụng tại EasyCV, Quy chế hoạt động sàn, Giải quyết khiếu nại, Chính sách bảo mật, Báo chí và Truyền thông.
- Cột **Dành cho Ứng viên**: tìm việc `/viec-lam`; tạo/xem mẫu CV `/tao-cv`; các route thật của công cụ Gross–Net, MBTI, Cẩm nang và Báo cáo lương.
- Cột **Nhà tuyển dụng**: đăng tin, tìm hồ sơ, ATS, Headhunter, bảng giá, Employer Branding và liên hệ tư vấn; tất cả đi qua URL cổng nhà tuyển dụng được cấu hình.
- Cột **Liên hệ & Trụ sở**: địa chỉ có thể mở URL bản đồ đã duyệt; hotline dùng `tel:`; email dùng `mailto:`; App Store/Google Play dùng listing chính thức.
- Thanh cuối: copyright; Điều khoản/Chính sách nếu có; Facebook, LinkedIn, YouTube, TikTok dùng URL kênh EasyCV chính thức.
- Route cụ thể phải ánh xạ theo router hiện hữu. Không dùng `href="#"`, không tạo trang rỗng và không hiển thị item bên ngoài khi chưa có URL chính thức. Liên kết ngoài mở tab mới với `rel="noopener noreferrer"`.
- Prototype hiện không có form đăng ký nhận tin trong footer; không tự bổ sung form.

## 6. Hệ thị giác

- Font chính: Plus Jakarta Sans với fallback hệ thống. Lấy token từ `assets/design-tokens.css`.
- Màu thương hiệu: cam `#F97316`, hover `#EA580C`, xanh đen `#0F172A`, nền phụ `#F8FAFC`, viền `#E2E8F0`. Giữ các màu riêng của thành phần trong CSS nguồn nếu mục tiêu là bám sát bản mẫu.
- Vùng nội dung chính tối đa `1250px` (`--container-max-width`); navbar có giới hạn riêng khoảng `1360px`. Các card dùng nền trắng, bo góc, viền mỏng và khoảng trắng rõ.
- CSS nguồn có breakpoint `1100`, `1024`, `992`, `900`, `768`, `700`, `640px`. Tái dựng theo hành vi thực thay vì chọn duy nhất một breakpoint chung.
- Màn desktop: grid job/công ty nhiều cột. Tablet: giảm số cột. Mobile: card một cột, bộ tìm kiếm và menu đủ rộng, không tràn ngang. Carousel khóa học hiển thị 4/2/1 card theo độ rộng >1100 / 641–1100 / ≤640px.
- CSS nguồn còn hỗ trợ `[data-theme="dark"]` nhưng màn hình không có nút chuyển theme. Chỉ nối dark mode khi dự án đích đã có theme store/điều khiển thật.

## 7. Accessibility và nội dung

- Dùng landmark `header`, `nav`, `main`, `section`, `footer`; mỗi trang chỉ có một H1.
- Nút icon có tên dễ hiểu; dropdown/drawer/picker cập nhật `aria-expanded`, trạng thái chọn dùng `aria-pressed` hoặc cấu trúc phù hợp. `Esc` đóng lớp nổi, focus quay về nút mở.
- Có focus ring thấy được, điều hướng bàn phím đầy đủ, các carousel dừng khi hover/focus và khi `prefers-reduced-motion: reduce`.
- Trạng thái không có kết quả phải có thông điệp và cách xóa/sửa bộ lọc; không để lưới trắng trống.
- Các số như 1.500+, 50.000, 95%, 85%, 14 ngày, số người tham gia và mức giá là **dữ liệu trình diễn** trong HTML; chỉ hiện dưới dạng dữ liệu thật khi được nguồn dữ liệu cung cấp.
