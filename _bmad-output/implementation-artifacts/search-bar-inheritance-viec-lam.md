# Tài Liệu Triển Khai: Kế Thừa Thanh Tìm Kiếm Trang Chủ Sang Màn Tìm Kiếm Việc Làm (viec-lam.html)

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Phương pháp luận quản trị: **BMAD (BMM Method)**  
Tài liệu tham chiếu: [`_bmad-output/planning-artifacts/prd.md`](../planning-artifacts/prd.md)

---

## 1. Bối Cảnh & Yêu Cầu Người Dùng

Người dùng yêu cầu:
> *"kế thừa thanh tìm kiếm của màn trang chủ sang màn [Tìm kiếm việc làm mới nhất 2026 - Lương cao, Đãi ngộ tốt | EasyCV](http://localhost:3000/viec-lam.html?keyword=Marketing+Leader)"*  
> Kèm hình ảnh tham chiếu mô tả thanh tìm kiếm chuẩn:
> - Nút trigger **"Danh mục Nghề"** dạng pill cam nhạt bo góc bên trái.
> - Vạch ngăn cách dọc (`search-divider`).
> - Ô nhập từ khóa tìm kiếm (kèm icon kính lúp cam và nút xóa ✕ tự động ẩn/hiện theo nội dung nhập).
> - Bộ chọn địa điểm dạng dropdown 2 cột chuyên nghiệp với icon ghim vị trí cam.
> - Nút hành động chính **"Tìm kiếm"** bo góc màu cam chuẩn EasyCV (`#F97316`).
> - Viền cam highlight rực rỡ kết hợp hiệu ứng quầng sáng halo (`box-shadow`) đa tầng.

---

## 2. Bảng Ma Trận So Sánh & Kế Thừa Kỹ Thuật

| Thành phần | Trước khi kế thừa (`viec-lam.html` cũ) | Sau khi kế thừa (Đồng bộ từ `index.html`) | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Bao bọc & Chiều cao** | Thẻ form `.job-search-box` thường, chiều cao ~48px, viền xám mờ | `.hero-search-box.job-search-box` cao **60px** cố định trên Desktop, viền cam `#F97316` 1.5px, quầng sáng halo cam `#EA580C` | **Đã hoàn thành 100%** |
| **Nút Danh mục Nghề** | Không có (hoặc chỉ có nút rời bên ngoài) | Nút trigger `.category-filter-trigger` dạng pill nền `#FFF7ED`, viền `#FDBA74`, liên kết `#categoryModalOverlay` 2 cột (Nhóm nghề & Vị trí chuyên môn) | **Đã hoàn thành 100%** |
| **Nút Xóa từ khóa ✕** | Không có nút xóa nhanh | Nút `.search-clear-btn` (✕) tự động hiển thị `display: flex` khi ô input có text (ví dụ: "Marketing Leader"), click xóa trắng text và focus lại input | **Đã hoàn thành 100%** |
| **Bộ chọn Địa điểm** | Thẻ `<select id="jobLocationSelect">` cơ bản của trình duyệt | Bộ chọn Popover 2 cột `.location-picker-group` (`#heroLocationPickerDropdown` / `#locationPickerDropdown`) với 22 tỉnh thành và quận huyện, tìm kiếm theo tên, checkbox & tag pill | **Đã hoàn thành 100%** |
| **Lịch sử tìm kiếm gợi ý** | Không có gợi ý tìm kiếm | Dropdown `#searchSuggestDropdown` bật khi focus input, hiển thị lịch sử từ khóa gần đây (`easycv_recent_searches_v2`), hỗ trợ chọn nhanh hoặc xóa lịch sử | **Đã hoàn thành 100%** |
| **Nút Tìm kiếm CTA** | Nút xám/xanh thường cao ~40px | Nút cam thương hiệu `.btn-hero-search.btn-search-submit` cao 46px, gradient cam `#F97316` -> `#EA580C`, icon kính lúp và chữ "Tìm kiếm" đậm nét | **Đã hoàn thành 100%** |
| **Sticky Search Bar** | Không có tính năng sticky khi cuộn | Khối `.hero-search-sticky-bar` tự động neo cố định dưới navbar (`top: 72px`) khi cuộn qua khỏi vùng Hero/Header, duy trì placeholder chống giật layout | **Đã hoàn thành 100%** |
| **Mobile Web** | Bị tràn ngang hoặc vỡ khung | Tự động chuyển đổi layout stacked (`height: auto !important;`) tại `@media (max-width: 768px)`, trải nghiệm chạm vuốt tối ưu | **Đã hoàn thành 100%** |

---

## 3. Danh Sách Tệp Đã Nâng Cấp & Đồng Bộ

Hệ thống đã cập nhật và đồng bộ 100% qua 10 tệp mã nguồn:

1. [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) & [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html):
   - Nhúng stylesheet `css/location-picker.css?v=2.0`.
   - Nâng cấp phiên bản stylesheet `css/viec-lam.css?v=7.0_hero_search`.
   - Bổ sung cấu trúc HTML `.hero-search-wrapper.job-search-wrapper` bọc `.hero-search-sticky-bar`.
   - Bố cục lại form tìm kiếm `.hero-search-box.job-search-box` thành 4 khối chức năng liền mạch:
     1. Trigger Danh mục Nghề (`.category-filter-trigger`).
     2. Ô nhập từ khóa + icon kính lúp + nút xóa nhanh ✕ (`#clearSearchInputBtn`).
     3. Nhóm chọn địa điểm chuyên nghiệp (`.location-picker-group`) tích hợp popover dialog 2 cột.
     4. Nút bấm submit cam (`.btn-hero-search.btn-search-submit`).
   - Bổ sung dropdown lịch sử tìm kiếm `#searchSuggestDropdown`.
   - Nhúng script `js/location-picker.js?v=2.0`.

2. [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) & [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css):
   - Tinh chỉnh `.hero-search-box.job-search-box`: chiều cao 60px, padding `5px 6px`, viền `#F97316` 1.5px, box-shadow halo cam đa tầng, hover/focus `#EA580C`.
   - Định kiểu cho nút xóa từ khóa `.search-clear-btn` dạng tròn nền xám nhạt với icon ✕ sắc nét.
   - Định kiểu cho Sticky Search Bar (`.hero-search-sticky-bar.is-sticky`): vị trí `fixed`, `top: 72px`, nền mờ Glassmorphism `rgba(255, 255, 255, 0.95)`, `z-index: 900`.
   - Định kiểu cho Search Suggest Dropdown (`#searchSuggestDropdown`): bo tròn 12px, bóng đổ mềm mại, danh sách lịch sử với icon đồng hồ và nút xóa item.
   - Tối ưu hóa responsive `@media (max-width: 768px)` cho phép các trường tự động giãn cách và xếp dọc.

3. [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) & [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js):
   - Quản lý lịch sử tìm kiếm qua `localStorage` khóa `easycv_recent_searches_v2`.
   - Tự động điều khiển ẩn/hiện `#searchSuggestDropdown` khi focus ô input và đóng khi click outside hoặc phím `Esc`.
   - Xử lý sự kiện click nút xóa từ khóa `#clearSearchInputBtn`: làm sạch input, ẩn nút ✕ và tự động kích hoạt lọc lại.
   - Bổ sung hàm `initStickySearch()` giám sát scroll vị trí để kích hoạt hoặc hoàn nguyên thanh sticky.
   - Đồng bộ giá trị tham số URL (`keyword`, `location`, `industry`) hiển thị đúng trên thanh tìm kiếm khi tải trang.

4. [`css/location-picker.css`](file:///d:/master%20page/css/location-picker.css) & [`public/css/location-picker.css`](file:///d:/master%20page/public/css/location-picker.css):
   - Chuyển đổi toàn bộ màu sắc popover địa điểm sang nhận diện cam EasyCV: viền highlight `#FDBA74`, nút Áp dụng gradient `#FF8A34` -> `#F97316`, checkbox active `#F97316`.
   - Đảm bảo `z-index: 920` để hiển thị trên cả thanh sticky và danh sách việc làm.

5. [`js/location-picker.js`](file:///d:/master%20page/js/location-picker.js) & [`public/js/location-picker.js`](file:///d:/master%20page/public/js/location-picker.js):
   - Hỗ trợ cả 2 định dạng id (`heroLocationPicker` trên Home và `jobLocationPicker` trên trang Việc làm).
   - Phát sự kiện `change` trên hidden select khi người dùng bấm "Áp dụng", giúp bộ lọc `viec-lam.js` tự động cập nhật danh sách việc làm mà không cần tải lại trang.

---

## 4. Bằng Chứng & Kết Quả Kiểm Thử (Verification)

### 4.1. Kiểm thử cú pháp & tính toàn vẹn (Syntax & Integrity)
- Lệnh kiểm tra cú pháp: `node --check js/viec-lam.js`, `node --check js/location-picker.js` -> **PASS 100%**.
- Đồng bộ mã nguồn gốc và thư mục `public/`: Khớp 100%.

### 4.2. Kịch bản kiểm thử tự động Chrome CDP Headless (`scratch/test_vieclam_search_inheritance.js`)
Đã thực thi kiểm thử toàn diện trên trình duyệt Chrome headless kết nối trực tiếp đến URL `http://localhost:3000/viec-lam.html?keyword=Marketing+Leader`:

1. **Kích thước & Thẩm mỹ Desktop (1440x1200):**
   - Chiều cao Search Box: Đúng **60px** (`box.offsetHeight === 60`).
   - Đường viền: Sắc cam chuẩn thương hiệu `rgb(249, 115, 22)`.
   - Box-Shadow: Hiệu ứng quầng sáng halo cam đa tầng sáng rõ.
   - Ảnh chụp minh chứng: `scratch/vieclam_search_bar_fixed.png`.

2. **Dữ liệu từ khóa & Nút xóa ✕:**
   - Giá trị input đọc từ URL: `"Marketing Leader"`.
   - Nút ✕ (`#clearSearchInputBtn`): Hiển thị trạng thái `display: flex`.

3. **Bộ chọn Địa điểm Popover 2 cột:**
   - Kích hoạt click vào `#locationPickerTrigger`: Popover mở ra với 22 tỉnh thành và danh sách quận huyện kèm tag pills.
   - Ảnh chụp minh chứng: `scratch/vieclam_location_picker_opened.png`.

4. **Gợi ý Tìm kiếm Gần đây (Search Suggest Dropdown):**
   - Kích hoạt focus ô tìm kiếm: Dropdown mở ra hiển thị các từ khóa gợi ý và lịch sử tìm kiếm gần đây.
   - Ảnh chụp minh chứng: `scratch/vieclam_suggest_opened.png`.

5. **Sticky Search Bar khi cuộn:**
   - Cuộn trang xuống `scrollY = 700`: Thanh tìm kiếm kích hoạt lớp `.is-sticky` và neo cố định tại `top: 73px` (ngay dưới navbar 72px) với nền mờ Glassmorphism.
   - Ảnh chụp minh chứng: `scratch/vieclam_sticky_scrolled.png`.

6. **Responsive Mobile Web (390x844):**
   - Kiểm thử tại kích thước màn hình điện thoại iPhone: Thanh tìm kiếm tự động chuyển sang layout xếp dọc mềm mại, vừa vặn khung hình 390px, không xuất hiện thanh cuộn ngang.
   - Ảnh chụp minh chứng: `scratch/vieclam_search_mobile.png`.

---

## 5. Kết Luận
Thanh tìm kiếm trên màn hình **Tìm kiếm việc làm** (`viec-lam.html`) đã được nâng cấp kế thừa toàn diện và hoàn hảo 100% từ màn Trang chủ:
- Đồng bộ nhận diện thương hiệu EasyCV cam (`#F97316`).
- Tích hợp trọn vẹn bộ công cụ tìm kiếm tiên tiến (Danh mục nghề, Nút xóa từ khóa ✕, Bộ chọn địa điểm 2 cột, Lịch sử tìm kiếm gợi ý, và Sticky bar).
- Sẵn sàng phục vụ người dùng trải nghiệm thực tế mượt mà trên cả Desktop và Mobile.
