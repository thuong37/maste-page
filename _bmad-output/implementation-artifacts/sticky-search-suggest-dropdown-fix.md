# Báo Cáo Kỹ Thuật: Sửa Lỗi Hiển Thị Popup Gợi Ý Tìm Kiếm Ở Chế Độ Sticky

**Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện**: 04/10/2026  
**Trạng thái**: ✅ Đã giải quyết triệt để & Kiểm thử tự động thành công 100%

---

## 1. Mô Tả Lỗi (Problem Statement)
- **Hiện tượng**: Khi người dùng cuộn chuột xuống các phần nội dung bên dưới trang (ví dụ khối Công ty nổi bật, Việc làm nổi bật), thanh tìm kiếm chuyển sang chế độ neo cố định (`.hero-search-sticky-bar.is-sticky`). Tuy nhiên, khi nhấp chuột vào ô tìm kiếm thì popup gợi ý (`#searchSuggestDropdown`) không xuất hiện bên dưới như ở chế độ bình thường trên đầu trang.
- **Phát hiện qua Chrome Headless CDP**:
  - Khi cuộn trang `scrollY = 600px`, thanh tìm kiếm neo cố định tại `y = 73px`, chiều cao `81px`.
  - Sự kiện focus/click kích hoạt class `.is-open` thành công trên dropdown.
  - **Tuy nhiên**, tọa độ của dropdown lại nằm ở `y = -425px` (bị kéo vượt ra khỏi đỉnh màn hình 425px) do dropdown không thuộc quyền quản lý của thanh sticky mà thuộc phần tử tử cha `#heroSearchWrapper` nằm ở vị trí ban đầu của tài liệu.

---

## 2. Nguyên Nhân Gốc Rễ (Root Cause)
1. **Lỗi Cấu Trúc DOM**:
   - Thẻ đóng `</div>` của `#heroSearchStickyBar` trong `index.html` bị đóng sớm ngay sau `#heroSearchBox`, dẫn đến `#searchSuggestDropdown` nằm ngoài `#heroSearchStickyBar`.
   - Khi cuộn trang, chỉ `#heroSearchStickyBar` nhận `position: fixed; top: 72px;`, trong khi `#searchSuggestDropdown` vẫn giữ `position: absolute` neo vào `#heroSearchWrapper` (vốn đã bị cuộn lên đỉnh và khuất khỏi màn hình).
2. **Xung Đột CSS Transform & Centering**:
   - Quy tắc CSS cũ:
     ```css
     .hero-search-sticky-bar.is-sticky .search-suggest-dropdown {
       max-width: var(--container-max-width, 1250px);
       width: calc(100% - 40px);
       left: 50%;
       transform: translateX(-50%);
     }
     ```
   - Khi dropdown mở, `.search-suggest-dropdown.is-open` áp dụng `transform: translateY(0)`, thuộc tính này ghi đè (override) mất `transform: translateX(-50%)`, làm dropdown bị lệch tâm sang phải 50% màn hình.

---

## 3. Giải Pháp Triển Khai (Implemented Solution)
1. **Tái Cấu Trúc DOM**:
   - Di chuyển thẻ đóng `</div>` của `#heroSearchStickyBar` xuống sau `#searchSuggestDropdown`, đảm bảo dropdown là con trực tiếp của thanh sticky bar trong cả `index.html` và `public/index.html`.
2. **Cơ Chế Căn Giữa Tuyệt Đối Mới**:
   - Sử dụng cơ chế căn giữa tự nhiên không phụ thuộc vào `translateX`:
     ```css
     .hero-search-sticky-bar.is-sticky .search-suggest-dropdown {
       max-width: var(--container-max-width, 1250px);
       width: calc(100% - 40px);
       left: 0;
       right: 0;
       margin: 0 auto;
       top: calc(100% + 8px);
     }
     ```
   - Đồng bộ hóa trên toàn bộ hệ thống tệp: `index.html`, `public/index.html`, `css/home.css`, `public/css/home.css`, `css/navbar.css`, `public/css/navbar.css`, `css/viec-lam.css`, `public/css/viec-lam.css`.
   - Giúp animation `translateY(-8px) -> translateY(0)` của `.is-open` hoạt động mượt mà và chuẩn xác 100%.

---

## 4. Kết Quả Kiểm Thử (Verification & Testing)

| Kịch Bản | Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
| :--- | :--- | :--- | :---: |
| **Đầu trang (`scrollY = 0`)** | Popup mở ngay dưới ô search, căn giữa | `isOpen: true`, `x: 99`, `y: 175`, `w: 1210`, `h: 500` | ✅ PASS |
| **Cuộn trang (`scrollY = 600`)** | Sticky bar cố định dưới Navbar (top 73px) | `isSticky: true`, `y: 73`, `w: 1407`, `h: 81` | ✅ PASS |
| **Click Search khi Sticky** | Popup mở ngay dưới Sticky Bar (y ~160px), căn giữa | `isOpen: true`, `x: 79`, `y: 161`, `w: 1250`, `h: 500` | ✅ PASS |
| **DOM Hierarchy** | Parent của dropdown phải là sticky bar | `dropdownParentId: "heroSearchStickyBar"` | ✅ PASS |
| **Ảnh chụp kiểm tra** | Trực quan sắc nét, chuẩn thương hiệu | `scratch/sticky_suggest_test.png`, `scratch/top_suggest_test.png` | ✅ PASS |
