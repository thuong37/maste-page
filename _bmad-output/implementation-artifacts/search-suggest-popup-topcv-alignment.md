# Báo Cáo Kỹ Thuật: Căn Chỉnh Vị Trí Popup Gợi Ý Tìm Kiếm & Chuyển Đổi Chế Độ Gõ Phím (Chuẩn TopCV)

**Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện**: 05/10/2026  
**Trạng thái**: ✅ Hoàn thành 100% & Kiểm thử tự động thành công toàn diện

---

## 1. Yêu Cầu Người Dùng (Requirements)
1. **Căn lại vị trí hiển thị popup gợi ý tìm kiếm trên Trang chủ (`index.html`)**:
   - **Bên TRÁI**: Thu gọn căn thẳng hàng với ô nhập tìm kiếm vị trí/kỹ năng (`#heroSearchInput` / `.search-input-group`), để lộ nút "Danh mục Nghề" ở bên trái chuẩn theo ảnh TopCV.
   - **Bên PHẢI**: **GIỮ NGUYÊN**, kéo dài ra hết mép phải của thanh tìm kiếm (`#heroSearchBox` / `.btn-hero-search`), không bị giới hạn 840px gây hẹp ở bên phải.
2. **Chuyển đổi linh hoạt chế độ tìm kiếm khi người dùng bắt đầu gõ phím**:
   - **Khi chưa gõ / ô tìm kiếm trống**: Chế độ **"Từ khóa tìm kiếm gần đây"** với nút "Xóa tất cả", danh sách các từ khóa đã tìm kiếm (kèm icon đồng hồ, tên từ khóa, số lượng việc làm ví dụ `156 việc làm`, nút `✕` xóa từng mục) và khối "Từ khóa phổ biến" dạng thẻ pill (Finance, Kinh doanh, IT, Accountant, Marketing).
   - **Khi bắt đầu gõ phím (input text > 0)**: Tự động chuyển ngay sang chế độ **"Từ khóa gợi ý"** (ẩn nút "Xóa tất cả" và "Từ khóa phổ biến"), hiển thị danh sách các từ khóa gợi ý khớp với từ người dùng đang nhập (tô đậm màu cam `#F97316` phần ký tự khớp, hiển thị icon tìm kiếm và số lượng việc làm tương ứng).
   - **Khi xóa hết chữ trong ô tìm kiếm**: Tự động hoàn nguyên về chế độ "Từ khóa tìm kiếm gần đây".

---

## 2. Giải Pháp Kỹ Thuật (Architecture & Implementation)

### 2.1. Căn Chỉnh Tọa Độ Động (Dynamic Alignment & CSS Variables)
- Sử dụng cặp thuộc tính `left` và `right` kết hợp `width: auto` và `max-width: none` để giữ nguyên mép phải chạm cạnh phải của thanh tìm kiếm:
  ```css
  .search-suggest-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: var(--search-suggest-left, 210px);
    right: var(--search-suggest-right, 0);
    width: auto;
    max-width: none;
    /* ... */
  }
  .hero-search-sticky-bar.is-sticky .search-suggest-dropdown {
    left: var(--search-suggest-left, 210px);
    right: var(--search-suggest-right, 0);
    width: auto;
    max-width: none;
    margin: 0;
    top: calc(100% + 8px);
  }
  @media (max-width: 900px) {
    .search-suggest-dropdown,
    .hero-search-sticky-bar.is-sticky .search-suggest-dropdown {
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  ```
- Hàm JavaScript `updateDropdownPosition()`:
  - Tính khoảng cách mép trái (từ ô input):
    `leftOffset = Math.max(0, Math.round(groupRect.left - barRect.left))`
  - Tính khoảng cách mép phải (đến mép phải của `#heroSearchBox`):
    `rightOffset = Math.max(0, Math.round(barRect.right - boxRect.right))`
  - Cập nhật đồng bộ:
    `searchSuggestDropdown.style.left = leftOffset + 'px';`
    `searchSuggestDropdown.style.right = rightOffset + 'px';`
    `searchSuggestDropdown.style.width = 'auto';`
    `searchSuggestDropdown.style.maxWidth = 'none';`
  - Hoạt động chuẩn xác ở cả chế độ thông thường (width 1000px, mép phải chạm nút Tìm việc ngay) và chế độ Sticky.

### 2.2. Bố Cục 2 Cột & Thiết Kế Item Chuẩn TopCV
- **Cột Trái (Left Panel)**:
  - Danh sách tìm kiếm gần đây (`.recent-search-row`):
    - Icon đồng hồ (`.recent-search-icon`).
    - Khối thông tin gồm Tên từ khóa và Số lượng việc làm (dưới dạng `X việc làm`).
    - Nút xóa riêng lẻ `✕` (`.recent-search-remove`).
  - Danh sách từ khóa gợi ý (`.keyword-suggestion-row`):
    - Icon kính lúp (`.kw-suggest-icon`).
    - Tên từ khóa được tô đậm (`<strong>` cam) phần trùng khớp với từ khóa người dùng nhập.
    - Số lượng việc làm tương ứng ở bên phải.
  - Khối từ khóa phổ biến (`.popular-keywords`):
    - Hiển thị 5 chip xu hướng (Finance, Kinh doanh, IT, Accountant, Marketing).
- **Cột Phải (Right Panel)**:
  - Tiêu đề: "Việc làm có thể bạn quan tâm"
  - Danh sách 5 thẻ việc làm chất lượng cao với logo doanh nghiệp bo góc sắc nét, tiêu đề việc làm, tên công ty và mức lương màu xanh lá `#10B981`.

### 2.3. Chuyển Đổi Chế Độ Gõ Phím (Typing State Machine)
- Lắng nghe sự kiện `input` trên `#heroSearchInput`:
  - `query.length > 0`: Kích hoạt `.search-format-left.is-typing`, ẩn `.suggest-recent-section` và `.popular-keywords`, hiển thị `.keyword-suggestions-section`, gọi hàm `renderKeywordSuggestions(query)`.
  - `query.length === 0`: Gỡ bỏ `is-typing`, hiển thị lại `.suggest-recent-section` và `.popular-keywords`, gọi `renderHistory()`.
- Hỗ trợ phím tắt `Enter` để thực thi tìm kiếm, phím `Esc` để đóng dropdown, và nút xóa nhanh `✕` trên ô input để quay lại chế độ lịch sử.

---

## 3. Các Tệp Tin Đã Chỉnh Sửa & Đồng Bộ

1. `index.html` & `public/index.html`: Cập nhật CSS định vị `.search-suggest-dropdown`, đồng bộ sticky bar và media query mobile.
2. `css/home.css` & `public/css/home.css`: Bổ sung toàn bộ style 2 cột, `.recent-search-row`, `.keyword-suggestion-row`, trạng thái `.is-typing`, và responsive 900px.
3. `css/navbar.css` & `public/css/navbar.css`: Cập nhật căn lề và độ rộng của dropdown ở chế độ sticky.
4. `js/home.js` & `public/js/home.js`: Triển khai cấu trúc HTML động, bộ lọc từ khóa gợi ý tiếng Việt thông minh, định vị tọa độ thời gian thực, quản lý localStorage và các trình xử lý sự kiện.

---

## 4. Kết Quả Kiểm Thử Tự Động (Verification Matrix)

| Kịch Bản Kiểm Thử | Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
| :--- | :--- | :--- | :---: |
| **Mở popup ở chế độ mặc định** | Căn thẳng hàng ô input (`left ≈ 310px`), hiện "Từ khóa tìm kiếm gần đây", 5 mục kèm số việc làm + nút X | `isOpen: true`, `dropdownLeft: 310px`, `groupLeft: 310px`, `alignedWithInput: true`, `recentCount: 5` | ✅ PASS |
| **Gõ từ khóa "java"** | Chuyển sang "Từ khóa gợi ý", tô cam chữ "Java", ẩn nút Xóa tất cả & Từ khóa phổ biến | `kwSectionVisible: 'flex'`, `recentSectionVisible: 'none'`, `firstKwText: 'Java Spring Boot 128 việc làm'`, `firstKwHtml: '<strong>Java</strong> Spring Boot'` | ✅ PASS |
| **Bấm nút xóa ✕ trên ô input** | Trở về ngay chế độ "Từ khóa tìm kiếm gần đây" | `kwSectionVisible: 'none'`, `recentSectionVisible: 'flex'`, `popularWrapVisible: 'block'` | ✅ PASS |
| **Cuộn trang sang chế độ Sticky** | Dropdown neo cố định theo thanh sticky, vẫn căn thẳng hàng ô input | `isSticky: true`, `dropdownLeft: 290px`, `groupLeft: 290px`, `alignedWithInput: true` | ✅ PASS |
| **Responsive trên Mobile (375px)** | Dropdown full width 100%, không bị tràn ngang | `dropdownLeft: 16px`, `dropdownWidth: 468px`, bố cục dọc co giãn hoàn hảo | ✅ PASS |
