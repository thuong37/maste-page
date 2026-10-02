# Đặc Tả Kỹ Thuật: Bộ Lọc Đầu Danh Sách Việc Làm (Top Filter Bar) & Khối Banner Quảng Cáo Doanh Nghiệp (Ads Sidebar)

- **Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình:** Tìm kiếm việc làm (`viec-lam.html`)
- **Ngày hoàn thành:** 02/10/2026
- **Trạng thái:** ✅ Đã triển khai & Kiểm thử tự động 100% PASS

---

## 1. Bối Cảnh & Yêu Cầu Người Dùng

### Yêu cầu ban đầu
Người dùng yêu cầu: *"Đối với màn này, thiết kế bộ lọc phía trên đầu danh sách job"* kèm thỏa thuận bổ sung: *"cộng thêm thiết kế khối banner bên phải list job phục vụ quảng cáo cho doanh nghiệp"*.

### Vấn đề của thiết kế cũ
- Bộ lọc cũ nằm ở cột bên trái (`.filter-sidebar`), chiếm mất 280px chiều ngang màn hình, khiến vùng hiển thị danh sách việc làm bị co hẹp.
- Không có không gian dành cho việc hiển thị banner quảng cáo tuyển dụng hoặc tiêu điểm doanh nghiệp VIP bên cạnh danh sách job.
- Thiếu các thẻ lọc nhanh (Active Filter Chips) trực quan cho phép ứng viên thấy ngay các tiêu chí đã chọn và xóa nhanh từng tiêu chí.

---

## 2. Giải Pháp Kiến Trúc & Bố Cục Mới

```
+---------------------------------------------------------------------------------------+
|  EASYCV NAVBAR (Logo, Menu, Đăng tin, Thông báo, Avatar, Switcher)                   |
+---------------------------------------------------------------------------------------+
|  STICKY SEARCH BAR (Danh mục Nghề | Từ khóa việc làm ✕ | Địa điểm | Tìm kiếm)       |
+---------------------------------------------------------------------------------------+
|  TOP FILTER BAR (#topFilterBar)                                                       |
|  [ Kinh nghiệm ▾ ] [ Mức lương ▾ ] [ Cấp bậc ▾ ] [ Hình thức ▾ ]  |  Xóa lọc   Sắp xếp: ▾ |
|  Active Chips: (💰 Trên 30 triệu ✕) (💼 3 - 5 năm ✕)               [ Xóa tất cả ]    |
+-------------------------------------------------------------+-------------------------+
|  DANH SÁCH VIỆC LÀM (.listings-content - Chiếm đa số)        |  ADS SIDEBAR (Sticky)   |
|  - Banner dữ liệu mẫu thông minh (#sampleDataBanner)        |  - VIP Employer         |
|  - Lưới danh sách việc làm (#jobListingGrid)                |    Samsung R&D (SRV)    |
|    + Card Job 1 (✨ Khớp tìm kiếm | AI Match 96%)            |    3 việc làm hot       |
|    + Card Job 2 ...                                         |    [Xem 28 việc làm →]  |
|  - Phân trang tự động (#paginationWrapper)                  |  - B2B EasyCV Business  |
|                                                             |    ⚡ 85% có CV 3 ngày  |
|                                                             |  - AI CV Coach ATS      |
+-------------------------------------------------------------+-------------------------+
```

### 2.1. Thanh Lọc Ngang Đầu Trang (`.top-filter-bar`)
- **4 Dropdown Pills đa năng:**
  1. **Kinh nghiệm (`#expFilterBtn`):** Tất cả kinh nghiệm, Chưa có kinh nghiệm, Dưới 1 năm, 1 - 3 năm, 3 - 5 năm, Trên 5 năm.
  2. **Mức lương (`#salaryFilterBtn`):** Tất cả mức lương, Dưới 10 triệu, 10 - 15 triệu, 15 - 20 triệu, 20 - 30 triệu, Trên 30 triệu, Thỏa thuận.
  3. **Cấp bậc (`#levelFilterBtn`):** Tất cả cấp bậc, Thực tập sinh / Intern, Nhân viên, Trưởng nhóm / Leader, Trưởng phòng / Manager, Giám đốc & Cấp cao.
  4. **Hình thức làm việc (`#typeFilterBtn`):** Tất cả hình thức, Toàn thời gian (Full-time), Bán thời gian (Part-time), Làm việc từ xa (Remote), Hybrid linh hoạt.
- **Nút "Xóa lọc" (`#btnClearTopFilters`):** Tự động sáng khi có ít nhất 1 bộ lọc được chọn; click để reset toàn bộ về mặc định.
- **Dropdown Sắp xếp (`#sortSelect`):** Tích hợp tinh tế ở góc phải (Phù hợp nhất, Lương cao đến thấp, Mới nhất, Cần tuyển gấp).
- **Hàng Active Filter Chips (`#activeFilterChipsRow`):** Hiển thị các tag bo tròn màu cam nhạt (`#FFF7ED`), viền cam (`#FDBA74`), chữ cam đậm (`#C2410C`) kèm nút `✕` gỡ bỏ từng tiêu chí trong 1 click.

### 2.2. Khối Banner Quảng Cáo Doanh Nghiệp Bên Phải (`.ads-sidebar-container`)
Được thiết kế dạng **Sticky** (`top: 90px`), cố định êm ái khi cuộn chuột:
1. **VIP Employer Showcase (`.vip-employer-card`):**
   - Tiêu điểm **Samsung Electronics R&D Institute Vietnam (SRV)**.
   - Ảnh bìa công nghệ cao cấp, logo vuông nổi 3D, huy hiệu Xác thực xanh `✔ Đối tác chiến lược VIP`.
   - Danh sách 3 vị trí hot đang tuyển dụng gấp kèm mức lương hấp dẫn:
     - *Senior AI/ML Research Engineer* — 45 - 70 Triệu
     - *Embedded Firmware Tech Lead* — 35 - 55 Triệu
     - *Cloud Solutions Architect* — 40 - 60 Triệu
   - Nút Primary CTA: `"Xem 28 việc làm đang tuyển →"` (tự động lọc danh sách job theo Samsung khi bấm).
2. **B2B Recruiter Banner (`.b2b-recruiter-card`):**
   - Background gradient tối cao cấp (`#0F172A` -> `#1E293B`), hiệu ứng quầng sáng cam.
   - Thông điệp: *"Tiếp cận 2.500.000+ ứng viên chất lượng cao cùng EasyCV AI Matching"*.
   - Chỉ số ấn tượng: `⚡ 85% có CV trong 3 ngày` & `🎯 3.5x Matching ATS`.
   - Nút CTA: `"Đăng tin tuyển dụng ngay"`.
3. **AI CV Coach Banner (`.cv-coach-card`):**
   - Dịch vụ tối ưu CV chuẩn ATS bằng trí tuệ nhân tạo, điểm số phân tích tức thì.
   - Nút CTA: `"Tạo CV chuẩn ATS miễn phí →"`.

---

## 3. Danh Sách Tệp Triển Khai & Đồng Bộ

| STT | Tệp Gốc | Tệp Bản Sao (`public/`) | Nội dung thay đổi |
|:---:|:---|:---|:---|
| 1 | [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) | [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html) | Thay thế filter sidebar bằng `.top-filter-bar`, thiết lập bố cục 2 cột `.job-main-columns`, chèn `.ads-sidebar-container`. |
| 2 | [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) | [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css) | Thêm styling Top Filter Bar, Pill Badges, Dropdown Menus, Active Chips, Sticky Ads Cards và Responsive Media Queries. |
| 3 | [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) | [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js) | Thêm `initTopFilterBar()`, `updateFilterCounts()`, `renderActiveFilterChips()`, tích hợp engine lọc `applyJobFilters()` và URL search params. |

---

## 4. Bảng Ma Trận Kiểm Thử Tự Động (Automated Test Matrix)

Kịch bản kiểm thử tự động toàn diện được thực thi qua Chrome/Edge Headless CDP (`scratch/test_top_filter_bar.js`):

| Test ID | Nội dung kiểm thử | Kỳ vọng | Kết quả | Trạng thái |
|:---:|:---|:---|:---|:---:|
| **TEST-01** | Kiểm tra sự hiện diện của Top Filter Bar & Ads Sidebar | Có `#topFilterBar`, 4 nút pill, nút xóa lọc, `#adsSidebar` và 3 thẻ ad cards | Xuất hiện đầy đủ, không còn class sidebar cũ | ✅ PASS |
| **TEST-02** | Tương tác mở / đóng Dropdown Menu | Click `#salaryFilterBtn` thêm class `active` và menu hiển thị `display: block` | Dropdown mở mượt mà, bounding box hợp lệ | ✅ PASS |
| **TEST-03** | Áp dụng bộ lọc & Hiển thị Active Chips | Chọn lương "Trên 30 triệu" + kinh nghiệm "3 - 5 năm" | Hiển thị 2 chip cam, danh sách job lọc còn các vị trí lương >30M và 3-5 năm | ✅ PASS |
| **TEST-04** | Gỡ bỏ từng Tag Lọc (Single Chip Removal) | Click nút `✕` trên chip lương "Trên 30 triệu" | Chip lương biến mất, chip kinh nghiệm được bảo toàn, danh sách cập nhật | ✅ PASS |
| **TEST-05** | Nút "Xóa tất cả" (Reset Filters) | Click `#btnClearAllChips` | Cả 2 chip biến mất, 4 pill hoàn nguyên nhãn ban đầu, danh sách hoàn nguyên 16 jobs | ✅ PASS |

---

## 5. Bằng Chứng Xác Thực Bằng Hình Ảnh (Screenshots)

1. **Giao diện Desktop tổng quan:**
   - Đường dẫn: `scratch/vieclam_top_filter_desktop.png`
   - Xác nhận: Top Filter Bar nằm ngay trên danh sách job; cột banner quảng cáo bên phải thẳng hàng và cân đối.
2. **Trạng thái mở Dropdown chọn tiêu chí:**
   - Đường dẫn: `scratch/vieclam_top_filter_dropdown.png`
   - Xác nhận: Menu dropdown đổ bóng tinh tế, hiển thị radio checkmark rõ ràng.
3. **Trạng thái đã chọn bộ lọc & Active Chips:**
   - Đường dẫn: `scratch/vieclam_top_filter_applied.png`
   - Xác nhận: 2 chip cam viền nổi bật, các job khớp được ghim lên đầu với huy hiệu `✨ Khớp tìm kiếm`.
4. **Toàn cảnh kèm cột quảng cáo VIP Samsung & B2B Recruiter:**
   - Đường dẫn: `scratch/vieclam_top_filter_full.png`
   - Xác nhận: Thẻ Samsung R&D nổi bật với 3 việc làm hot và CTA cam bắt mắt, thẻ EasyCV for Business tối sang trọng.
5. **Giao diện Di Động (Mobile 390x844):**
   - Đường dẫn: `scratch/vieclam_top_filter_mobile.png`
   - Xác nhận: Các pill filter vuốt cuộn ngang mượt mà không có thanh cuộn xấu; banner quảng cáo chuyển xuống dưới danh sách việc làm theo chuẩn mobile-first.
