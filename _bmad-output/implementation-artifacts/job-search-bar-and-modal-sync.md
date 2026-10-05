# Báo Cáo Kỹ Thuật: Đồng Bộ Logic Thanh Tìm Kiếm & Khắc Phục Lỗi Category Modal Trên Màn List Job

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Phương pháp luận quản trị: **BMAD (BMM Method)**  
Tệp tài liệu: `_bmad-output/implementation-artifacts/job-search-bar-and-modal-sync.md`  
Ngày thực hiện: **05/10/2026**

---

## 1. Bối Cảnh & Vấn Đề Người Dùng Báo Cáo (Problem Statement)

Người dùng gửi hình ảnh chụp thực tế màn hình danh sách việc làm (`viec-lam.html`) và yêu cầu:
> *"đồng bộ lại logic của thanh tìm kiếm ngoài trang chủ sang trang job list, vì trong trang job list khi tôi thao tác trên thanh tìm kiếm còn nhiều lỗi lắm , ví dụ như ảnh tôi gửi"*

### Các Lỗi Cụ Thể Được Xác Định Từ Ảnh Của Người Dùng:
1. **Lỗi Định Vị Hộp Thoại Danh Mục Nghề (Category Modal Positioning Bug):**
   - Khi người dùng click vào nút `"Danh mục Nghề"` (`#categoryFilterTrigger`), hộp thoại modal `Chọn Nhóm nghề, Nghề hoặc Chuyên môn` (`.category-modal-dialog`) bị định vị tuyệt đối `top: calc(100% + 10px)` dựa theo `.job-search-container`. Do container này có chiều cao lớn (~800px+), modal bị đẩy xuống `top: 815px`, khiến chân modal (các nút thao tác "Bỏ chọn tất cả", "Hủy", "Chọn") bị tràn ra ngoài màn hình và bị cắt đứt, người dùng không thể bấm được nút.
2. **Lỗi Xung Đột Thứ Tự Hiển Thị (Z-Index Stacking Bug):**
   - Widget chuyển đổi chế độ xem lơ lửng (`#floatingViewModeBox`, `z-index: 2000000`) nằm ở góc phải màn hình bị nổi đè lên trên hộp thoại chọn danh mục nghề, vì `.category-modal-overlay` chỉ có `z-index: 100000`.
3. **Thiếu Hoàn Toàn Gợi Ý Tìm Kiếm Thông Minh (Search Suggestion Gap):**
   - Trong ảnh, người dùng gõ từ khóa `"Kiến trúc sư"` vào ô input nhưng không có dropdown gợi ý thông minh 2 cột, không có chế độ gõ phím ("Từ khóa gợi ý" kèm số lượng việc làm và highlight từ khóa), không có mục "Việc làm có thể bạn quan tâm", và không có lịch sử tìm kiếm gần đây như ở Trang chủ.
4. **Lỗi Căn Chỉnh Vị Trí Dropdown (Dynamic Dropdown Alignment):**
   - `searchSuggestDropdown` chưa được áp dụng thuật toán `updateDropdownPosition()`: không căn mép trái theo ô input tìm kiếm (để chừa nút "Danh mục Nghề" bên trái) và mép phải kéo dài đến hết thanh tìm kiếm.

---

## 2. Giải Pháp Kỹ Thuật (Architecture & Implementation)

### 2.1. Định Vị Hộp Thoại Danh Mục Nghề Neo Động Ngay Dưới Đáy Thanh Tìm Kiếm (Direct Anchor Below Search Bar)
- **Tệp chỉnh sửa:** `css/category-filter-modal.css`, `public/css/category-filter-modal.css`, `js/category-filter-modal.js`, `public/js/category-filter-modal.js`.
- **Yêu cầu & Thách thức:** Hộp thoại không được căn giữa viewport hay trôi đáy làm che khuất nút hành động. Người dùng yêu cầu hiển thị **ngay dưới thanh tìm kiếm**, đồng thời che phủ dải filter phụ (`.top-filter-bar`) nhưng để lộ thanh tìm kiếm sắc nét phía trên với nút trigger `Danh mục Nghề` đang mở (`is-active`, chevron quay lên `^`).
- **Kiến trúc phân tầng Z-Index & Định vị CSS:**
  - `.category-modal-overlay`: `position: fixed !important; inset: 0 !important; z-index: 2500000 !important; pointer-events: none !important;` (cho phép tương tác với thanh tìm kiếm ở trên).
  - `.category-modal-backdrop`: `z-index: 1 !important; pointer-events: auto !important;` kèm `backdrop-filter: blur(4px) !important; background: rgba(15, 23, 42, 0.45) !important;`.
  - `.category-modal-dialog`: `position: fixed !important; z-index: 2 !important; left: 50% !important; transform: translateX(-50%) !important; width: calc(100% - 40px) !important; max-width: 1250px !important; pointer-events: auto !important; margin: 0 !important; top: var(--cat-modal-top, 175px) !important;`.
  - `.hero-search-box.is-category-open`: Đạt `z-index: 2500010 !important; position: relative !important;` để nổi bật hoàn hảo trên backdrop mờ (`2500010 > 2500000`).
  - Gỡ bỏ `z-index` bao trùm trên `.hero-search-sticky-bar` để tránh việc phần tử con `.top-filter-bar` bị kéo lên đè lấp đỉnh của modal.
- **Thuật toán điều khiển động trong `js/category-filter-modal.js`:**
  - Hàm `updatePosition()`:
    ```javascript
    const searchBox = document.getElementById('jobSearchForm') || 
                      document.getElementById('heroSearchBox') || 
                      (this.triggerBtn ? this.triggerBtn.closest('.hero-search-box') : null);
    if (searchBox) {
      const boxRect = searchBox.getBoundingClientRect();
      const topPos = Math.max(10, Math.round(boxRect.bottom + 8));
      document.documentElement.style.setProperty('--cat-modal-top', `${topPos}px`);
      dialog.style.setProperty('top', `${topPos}px`, 'important');
      dialog.style.setProperty('max-height', `calc(100vh - ${topPos + 20}px)`, 'important');
    }
    ```
  - Lắng nghe sự kiện `window.addEventListener('resize')` và `window.addEventListener('scroll')` (passive: true) để liên tục cập nhật tọa độ neo thời gian thực.
  - Xử lý toggle: Bấm nút trigger `#categoryFilterTrigger` khi đang mở sẽ tự động đóng hộp thoại `self.close(false)`.

### 2.2. Xây Dựng Hệ Thống Style Dropdown 2 Cột Trên Trang List Job
- **Tệp chỉnh sửa:** `css/viec-lam.css` và `public/css/viec-lam.css`.
- **Đồng bộ CSS:**
  - Kế thừa toàn bộ layout `.search-format-panel` (2 cột: `minmax(0, 0.95fr) minmax(0, 1.15fr)`).
  - Cột trái: `.search-format-left`, `.recent-chips-list`, `.recent-search-row` (icon đồng hồ + tên + số việc làm + nút xóa x), `.popular-keywords` (tags xu hướng: Finance, Kinh doanh, IT, Accountant, Marketing, Kiến trúc sư).
  - Chế độ gõ phím `.is-typing`: Tự động ẩn gần đây và phổ biến; kích hoạt `.keyword-suggestions-section` hiển thị `.keyword-suggestion-row` kèm tô đậm `strong` màu cam thương hiệu (`#F97316`).
  - Cột phải: `.recommended-jobs` hiển thị 5 việc làm chất lượng cao (logo, tiêu đề, công ty, mức lương).
  - Hỗ trợ đầy đủ Dark Theme `[data-theme='dark']` và Responsive mobile `@media (max-width: 900px)`.

### 2.3. Triển Khai Bộ Điều Khiển Tìm Kiếm Thông Minh Trong `js/viec-lam.js`
- **Tệp chỉnh sửa:** `js/viec-lam.js` và `public/js/viec-lam.js`.
- **Thực thi các tính năng then chốt:**
  1. **Khởi tạo động `.search-format-panel`:** Tự động tạo DOM 2 cột chuẩn khi khởi động và nhúng vào `#searchSuggestDropdown`.
  2. **Bộ dữ liệu từ khóa gợi ý phong phú (`ALL_SUGGESTIONS`):** Bổ sung đầy đủ các từ khóa chuyên môn gồm "Kiến trúc sư" (94 việc làm), "Kỹ sư kiến trúc" (45 việc làm), "Thiết kế nội thất" (86 việc làm), "Kỹ sư xây dựng" (115 việc làm), "Frontend", "Backend", "ReactJS", "Marketing", "Kế toán", "Telesales", v.v.
  3. **Hàm `updateDropdownPosition()`:** Tính toán tọa độ `groupRect.left - barRect.left` và `barRect.right - boxRect.right` trong thời gian thực, đặt CSS variables `--search-suggest-left` và `--search-suggest-right`. Giúp mép trái dropdown thu lại vừa khít với input tìm kiếm (để lộ trọn vẹn nút "Danh mục Nghề" bên trái), và mép phải kéo dài đến hết thanh tìm kiếm.
  4. **Phối hợp trạng thái (Modal & Dropdown coordination):**
     - Mở Dropdown tìm kiếm -> Tự động đóng Category Modal nếu đang mở.
     - Click nút "Danh mục Nghề" -> Tự động đóng Dropdown tìm kiếm.
     - Nhấn Escape hoặc click ra ngoài -> Tự động đóng Dropdown.
  5. **Tìm kiếm thời gian thực (`executeSearch`):**
     - Cập nhật input, lưu từ khóa vào `localStorage` (`easycv_recent_searches_v2`).
     - Đóng dropdown.
     - Gọi hàm lọc `applyJobFilters(true, true)` ngay lập tức trên trang job list mà không cần reload trang.
     - Bắn Toast thông báo số lượng việc làm tìm thấy.
     - Cuộn mượt màn hình lên đầu danh sách việc làm (`scrollToListingTop()`).
  6. **Nút xóa từ khóa `✕` (`#clearSearchInputBtn`):** Click xóa trắng ô input, ẩn nút xóa, hoàn nguyên dropdown về chế độ gần đây & phổ biến, lọc lại toàn bộ 25 việc làm.

---

## 3. Ma Trận Kiểm Thử Tự Động Qua Chrome DevTools Protocol (CDP Verification)

Kịch bản kiểm thử tự động được thực thi qua tiến trình headless Chrome kết nối WebSocket CDP:

| STT | Kịch Bản Kiểm Thử | Tiêu Chí Đo Lường | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---|:---|:---|:---:|
| 1 | Mở Modal Danh mục Nghề (Mặc định) | Neo ngay dưới thanh tìm kiếm: `distanceBelow = 8px`, `dialogTop = 173px` (dưới search box bottom 165px), `footerVisible: true`, `submitBtnVisible: true` | `boxBottom: 165`, `dialogTop: 173`, `distanceBelow: 8px`, `dialogBottom: 785 <= 805`, `footerVisible: true`, `submitVisible: true` | **PASS (100%)** |
| 2 | Mở Modal Danh mục Nghề (Sticky cuộn 500px) | Neo ngay dưới sticky search bar: `distanceBelow = 8px`, `dialogTop = 78px` (dưới search box bottom 70px), `footerVisible: true`, `submitBtnVisible: true` | `boxBottom: 70`, `dialogTop: 78`, `distanceBelow: 8px`, `dialogBottom: 785 <= 805`, `footerVisible: true`, `submitVisible: true` | **PASS (100%)** |
| 3 | Click Toggle nút Danh mục Nghề | Bấm nút khi đang mở -> Tự động đóng modal; Bấm lần nữa -> Mở lại | `firstClick: isHidden = false` -> `secondClick: isHidden = true` | **PASS (100%)** |
| 4 | Gõ từ khóa "Kiến trúc sư" | Dropdown mở (`is-open`), kích hoạt `is-typing`, hiển thị từ khóa gợi ý "Kiến trúc sư" (94 việc làm) highlight cam, mép trái `dropdownLeft: 310px >= triggerRight: 293px` (lộ nút Danh mục Nghề) | `isOpen: true`, `isTyping: true`, `kwItemsCount: 1`, `recommendedJobsCount: 5`, `isCategoryButtonVisible: true` | **PASS (100%)** |
| 5 | Chọn từ khóa gợi ý | Dropdown tự đóng, ô input nhận giá trị, bộ lọc kích hoạt, xuất hiện Toast thông báo | `dropdownOpen: false`, `inputValue: "Kiến trúc sư"`, `toastText: "💡 Dữ liệu mẫu..."` | **PASS (100%)** |
| 6 | Bấm nút xóa ✕ | Input rỗng, nút ✕ ẩn, lịch sử tìm kiếm lưu trữ trong `localStorage` | `inputValue: ""`, `clearBtnDisplay: "none"`, `hasSavedHistory: true` | **PASS (100%)** |
| 7 | Đồng bộ Root ⇄ Public | Kiểm tra mã băm MD5 của toàn bộ các tệp nguồn và bản sao `public/` | `css/category-filter-modal.css`: SYNC OK<br>`js/category-filter-modal.js`: SYNC OK<br>`css/viec-lam.css`: SYNC OK<br>`js/viec-lam.js`: SYNC OK | **PASS (100%)** |
| 8 | Thu gọn chiều cao hộp thoại bằng 2/3 | Chiều cao modal đạt 2/3 không gian trước đó: `height: 408px` (2/3 của 612px), `bottom: 581px` (cách đáy 224px, thoáng đãng không choán màn hình) | `dialogTop: 173`, `dialogHeight: 408px`, `dialogBottom: 581 <= 805`, `footerVisible: true` | **PASS (100%)** |

### Minh Chứng Hình Ảnh Đã Nghiệm Thu:
- `scratch/verify_category_2_thirds_height.png`: Hộp thoại modal hiển thị **ngay dưới đáy thanh tìm kiếm** (cách đúng 8px), chiều cao được thu gọn chính xác bằng **2/3** (~408px), không choán hết màn hình, để lộ không gian thoáng đãng và thẻ việc làm phía sau.
- `scratch/verify_category_sticky_2_thirds_height.png`: Hộp thoại modal bám sát dưới thanh tìm kiếm sticky khi cuộn trang, chiều cao 2/3 duy trì tỷ lệ thon gọn và cân đối.
- `scratch/verify_search_typing.png`: Thanh tìm kiếm với nút "Danh mục Nghề" lộ rõ bên trái, dropdown 2 cột gợi ý "Kiến trúc sư" (94 việc làm) highlight cam và 5 việc làm quan tâm bên phải.
- `scratch/verify_search_filtered.png`: Danh sách việc làm được lọc ngay lập tức kèm toast feedback.

