# Tài Liệu Kỹ Thuật: Tinh Chỉnh Giao Diện Chi Tiết Việc Làm & Kế Thừa Thanh Tìm Kiếm Hero (EasyCV)

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện:** 03/10/2026  
**Trạng thái:** Hoàn thành & Đã kiểm thử tự động (Verified via Chrome Headless CDP)  
**Phương pháp:** BMAD / BMM Framework  

---

## 1. Yêu Cầu Người Dùng & Bối Cảnh (User Requirements)

1. **Bỏ card như ảnh:** Gỡ bỏ hoàn toàn thanh điều hướng phụ đầu trang của cột chi tiết bên phải (`.detail-top-nav` — chứa các nút "← Quay lại trang tìm việc", "Chia sẻ", "Lưu tin").
2. **Khối các việc làm liên quan khác:** Các thẻ job (`.split-job-card`) trong danh sách gợi ý bên trái không cần padding 2 bên như hiện tại, mở rộng vừa khít 100% với khối chứa (`.split-list-pane` flush edge-to-edge).
3. **Kế thừa thanh tìm kiếm job từ màn trang chủ sang màn này:** Tích hợp thanh tìm kiếm thông minh từ Homepage / `viec-lam.html` (gồm nút trigger Danh mục Nghề mở Modal 2 cột, ô nhập từ khóa có nút xóa ✕, bộ chọn địa điểm 2 cột, nút Tìm kiếm submit sang `viec-lam.html`, dropdown gợi ý tìm kiếm gần đây và cơ chế Sticky Search Bar khi cuộn) vào phần Hero của `chi-tiet-viec-lam.html`.

---

## 2. Giải Pháp Kỹ Thuật (Architecture & Implementation)

### 2.1. Loại Bỏ `.detail-top-nav` & Tối Ưu Hóa Cụm Nút CTA
- **Vấn đề:** Khối `.detail-top-nav` lặp lại nút "Quay lại trang tìm việc" (đã có ở breadcrumb và nút back trên hero) và nút "Lưu tin" (đã có ở `.detail-hero-box`), chiếm dụng 62px chiều cao quý giá ở đầu cột chi tiết.
- **Giải pháp:**
  - Gỡ bỏ hoàn toàn phần tử `.detail-top-nav` khỏi mã nguồn HTML và DOM.
  - Cột chi tiết bên phải (`.split-detail-pane`) bắt đầu ngay lập tức từ `.detail-hero-box` với logo công ty, tiêu đề công việc, các badge lương, địa điểm, thời gian.
  - Chuyển nút **"Chia sẻ"** (`.btn-detail-share-btn` / `#btnCopyJobLink`) vào hàng CTA chính của `.detail-hero-box` cùng với **"Nộp hồ sơ ứng tuyển ngay"** và **"Lưu việc làm"**.
  - Bổ sung quy tắc CSS cho `.btn-detail-share-btn`:
    ```css
    .btn-detail-share-btn {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      color: #334155;
      border-radius: 12px;
      padding: 13px 18px;
      font-size: 14.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .btn-detail-share-btn:hover {
      border-color: #F97316;
      color: #F97316;
      background: #FFF7ED;
    }
    ```

### 2.2. Khối Việc Làm Liên Quan Tràn Viền Vừa Khít (Edge-to-Edge Flush Cards)
- **Vấn đề:** Các thẻ job con trong khối gợi ý bên trái trước đây bị thụt lề 2 bên do padding của container và margin của thẻ con, tạo cảm giác thẻ bị lọt thỏm và lãng phí diện tích hiển thị.
- **Giải pháp:**
  - Thiết lập `.split-list-pane` có `padding: 18px 0 0 0; overflow: hidden;`.
  - Tiêu đề khối `.split-list-header` giữ padding ngang `0 20px 14px 20px;` để chữ căn chuẩn lề mắt nhìn.
  - Danh sách `.split-list-feed` có `gap: 0; padding: 0;`.
  - Thẻ job `.split-job-card` có `border: none; border-bottom: 1px solid #F1F5F9; border-radius: 0; width: 100%; box-sizing: border-box; padding: 16px 20px;`.
  - Thẻ được chọn (`.is-selected`) hiển thị vạch cam đặc trưng `border-left: 4px solid #F97316 !important;` và nền chuyển sắc nhẹ `linear-gradient(90deg, #FFF7ED 0%, #FFFFFF 100%)`.

### 2.3. Kế Thừa Thanh Tìm Kiếm Thông Minh (Search Bar Inheritance)
- **Markup & Styling:**
  - Bổ sung khối `#heroSearchWrapper` và `#heroSearchStickyBar` vào Hero của `chi-tiet-viec-lam.html`.
  - Nút trigger `#categoryFilterTrigger` với icon danh mục và nhãn "Danh mục Nghề".
  - Hộp thoại Modal 2 cột `#categoryModalOverlay` đồng bộ với `js/category-filter-modal.js` và `css/category-filter-modal.css`.
  - Ô input `#jobSearchInput` có nút xóa nhanh `#clearSearchInputBtn` (✕).
  - Bộ chọn địa điểm 2 cột `#heroLocationTrigger` & `#heroLocationPicker` đồng bộ với `js/location-picker.js`.
  - Form tìm kiếm `#jobSearchForm` đặt `action="viec-lam.html" method="GET"` để khi ứng viên tìm kiếm từ trang chi tiết, kết quả sẽ chuyển hướng sang trang danh sách việc làm với query parameters tương ứng.
- **Logic Tương Tác & Sticky Search:**
  - Bổ sung controller `initStickySearch()` trong `js/chi-tiet-viec-lam.js`: tự động tính toán chiều cao navbar (72px) và neo dính thanh tìm kiếm khi cuộn trang vượt qua Hero.
  - Dropdown lịch sử tìm kiếm gần đây `#searchSuggestDropdown` với các chips tìm kiếm nhanh.
  - Lắng nghe CustomEvent `easycv:category-applied` để tự động cập nhật nhãn nút Danh mục và lưu giá trị vào hidden inputs.

---

## 3. Ma Trận Thay Đổi Tệp Tin (File Matrix)

| Tệp Tin | Bản Sao Đồng Bộ | Thay Đổi Chính |
|---|---|---|
| `chi-tiet-viec-lam.html` | `public/chi-tiet-viec-lam.html` | Gỡ bỏ `.detail-top-nav`; thêm `#btnCopyJobLink` vào CTA group; chèn khối search hero hoàn chỉnh, modal category, location picker và suggest dropdown; nhúng các stylesheet và script cần thiết. |
| `css/viec-lam.css` | `public/css/viec-lam.css` | Thiết lập `.split-list-pane` và `.split-job-card` tràn viền 100% không padding ngoài; bổ sung `.btn-detail-share-btn` hover cam và `white-space: nowrap`. |
| `js/chi-tiet-viec-lam.js` | `public/js/chi-tiet-viec-lam.js` | Tích hợp `initStickySearch()`, logic clear search input, render recent search chips, và lắng nghe sự kiện `easycv:category-applied`. |

---

## 4. Kết Quả Kiểm Thử Tự Động (Verification Results)

- **Kịch bản kiểm thử:** `scratch/verify_chi_tiet_suite.js` chạy trên nền Google Chrome headless qua giao thức CDP WebSocket.
- **Kết quả:**
  1. `detailTopNavPresent`: **false** (Khối card điều hướng phụ đầu trang đã bị xóa sạch 100%).
  2. `listPanePaddingLeft`: **0px**, `listPanePaddingRight`: **0px** (Khối việc làm liên quan tràn viền vừa khít).
  3. `firstCardWidth` khớp 100% `listPaneWidth` (**458px / 458px**).
  4. Thanh tìm kiếm Hero hiển thị đầy đủ, nút Danh mục Nghề mở Modal 2 cột mượt mà.
  5. Nhập từ khóa hiển thị nút ✕; click nút ✕ xóa sạch từ khóa và trả focus về ô input.
  6. Cuộn trang kích hoạt `is-sticky = true` cho thanh tìm kiếm với `top: 72px`.
- **Hình ảnh nghiệm thu:**
  - `scratch/chi_tiet_initial_view.png`: Giao diện tổng thể sắc nét, không còn card thừa, thẻ liên quan vừa khít.
  - `scratch/chi_tiet_category_modal.png`: Modal danh mục nghề 2 cột phân cấp chuẩn xác.
  - `scratch/chi_tiet_sticky_scrolled.png`: Thanh tìm kiếm neo dính trên cùng khi cuộn trang.

---

## 5. Đồng Bộ Đầy Đủ Tính Năng Tìm Kiếm — 2026-10-06

| Hạng mục | Trạng thái cũ | Giải pháp kỹ thuật | Kết quả kiểm thử |
|---|---|---|---|
| Popup gợi ý | Chỉ hiển thị chip lịch sử đơn giản | Bổ sung controller `job-detail-search.js` dựng popup 2 cột theo chuẩn hiện tại | Hiển thị 5 lịch sử, 6 từ khóa phổ biến và 5 việc làm gợi ý |
| Gợi ý khi nhập | Không có chế độ gợi ý động | Lọc kho từ khóa không phân biệt dấu, hiển thị số việc làm và tô đậm phần khớp | Gõ `Product` trả 2 kết quả và highlight đúng |
| Quản lý lịch sử | Dùng key cũ, chỉ xóa tất cả | Dùng chung `easycv_recent_searches_v2`, hỗ trợ xóa từng dòng và xóa toàn bộ | Từ khóa submit được đưa lên đầu và còn nguyên khi quay lại trang |
| Điều hướng tìm kiếm | Form cơ bản, chưa xác nhận đủ tham số | Tạo URLSearchParams từ keyword, location, category và industry | Chuyển sang `viec-lam.html` với đủ 4 tham số |
| Phối hợp popup | Gợi ý và modal có thể hoạt động độc lập | Đóng popup gợi ý khi mở Danh mục nghề/Địa điểm; đóng Danh mục nghề khi focus từ khóa | Không chồng lớp popup |
| Accessibility | Chưa đồng bộ trạng thái expanded | Bổ sung `role=dialog`, `aria-controls`, `aria-haspopup`, `aria-expanded` và keyboard Enter/Space/Escape | Trạng thái ARIA và bàn phím PASS |
| Responsive | Chưa có kiểm thử popup giàu nội dung trên màn nhỏ | Căn lại popup theo viewport tại breakpoint 900px | Mobile 375px: popup rộng 335px, không tràn |
| Đồng bộ triển khai | Controller chỉ nằm trong file chi tiết lớn | Tách module và mirror sang `public/`; guard controller cũ làm fallback | Root/public có SHA-256 trùng khớp |

Kiểm thử tự động: `scratch/verify_job_detail_search_sync.js` — Chrome headless PASS trên URL công việc `id=3`, root/public, desktop/mobile và luồng redirect đầy đủ.

### Điều chỉnh backdrop Danh mục nghề — 2026-10-06

Popup Danh mục nghề trên màn Chi tiết đã được đồng bộ hoàn toàn với Trang chủ và Job List: không phủ tối, không blur giao diện xung quanh, vẫn giữ click ngoài để đóng và không tràn trên mobile 375px. Chi tiết ma trận kiểm thử nằm tại `spec-job-detail-category-modal-transparent-backdrop.md`.
