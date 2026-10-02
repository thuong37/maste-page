# Đặc Tả Kỹ Thuật: Bộ Lọc Danh Mục Nghề Chuẩn Mẫu Tham Khảo (Category Filter Modal)

## 1. Quyết Định & Mục Tiêu Thiết Kế (Decision & Intent)

Theo yêu cầu của người dùng cùng ảnh tham khảo trực quan (chuẩn trải nghiệm TopCV), EasyCV đã triển khai bộ lọc **"Danh mục Nghề"** hoàn chỉnh với bố cục Popover/Modal 2 cột chuyên sâu:
- Nút kích hoạt `Danh mục Nghề` tích hợp trực tiếp tại vị trí đầu tiên của thanh tìm kiếm việc làm (trước trường nhập vị trí tuyển dụng).
- Hộp thoại bộ lọc "Chọn Nhóm nghề, Nghề hoặc Chuyên môn" đồng bộ 100% bố cục, trường tìm kiếm, cột Nhóm nghề, cột Nghề kèm vị trí chuyên môn dạng tags/pills, huy hiệu "Cuộn để xem" và cụm nút thao tác chân bảng.
- Giữ vững chuẩn nhận diện thương hiệu EasyCV theo `AGENTS.md`: Màu cam chủ đạo (`#F97316`), nền sáng tinh tế (`#F8FAFC`), font chữ chuẩn Inter, UI cao cấp.

---

## 2. Bảng Ma Trận Thay Đổi Kỹ Thuật (Change Matrix)

| Hạng mục | Trạng thái trước | Giải pháp triển khai mới | Kết quả đạt được |
|---|---|---|---|
| **Thanh tìm kiếm (Search Bar)** | `viec-lam.html` sử dụng thẻ `<select id="jobCategorySelect">` đơn giản và chiếm diện tích | Bổ sung nút trigger `category-filter-trigger` chuẩn mẫu với icon danh mục (3 chấm + 3 gạch), chữ `Danh mục Nghề` và chevron | Bố cục thanh tìm kiếm trực quan, đồng bộ 100% mẫu tham khảo |
| **Bố cục Modal / Popover** | Chưa có modal chọn danh mục nghề chuyên sâu trên trang tìm việc | Tạo component `category-modal-overlay` với 2 cột: Cột trái "NHÓM NGHỀ" (checkbox + tên + chevron), Cột phải "NGHỀ" & "VỊ TRÍ CHUYÊN MÔN" (checkbox + tên nghề + pills chuyên môn) | Trải nghiệm chọn ngành nghề đa cấp cực kỳ rõ ràng, sinh động |
| **Tìm kiếm nội bộ Modal** | Không có | Tích hợp thanh tìm kiếm "Nhập từ khóa tìm kiếm" (pill search) thời gian thực (live search), lọc xuyên suốt các nhóm nghề, nghề và chuyên môn | Ứng viên gõ từ khóa tìm thấy ngay chuyên môn mong muốn |
| **Thao tác & Multi-select** | Chọn 1 ngành duy nhất qua dropdown | Hỗ trợ chọn linh hoạt: chọn cả nhóm nghề, chọn phân nhóm nghề hoặc chọn từng pill vị trí chuyên môn; hỗ trợ "Bỏ chọn tất cả", "Hủy", "Chọn" | Thao tác tự nhiên, mềm dẻo, dễ kiểm soát |
| **Liên kết bộ lọc dữ liệu việc làm** | Dựa trên 6 value cố định của select box | Tích hợp sâu vào `applyJobFilters()` của `viec-lam.js` qua CustomEvent `easycv:category-applied` và URL params `industry` / `category` | Lọc dữ liệu tức thì, hiển thị việc làm khớp tiêu chí và phản hồi Toast |
| **Khả năng tương thích di động (Mobile)** | Dễ bị tràn ngang nếu mở modal lớn | Thiết kế responsive `@media (max-width: 768px)`: modal tự co giãn toàn màn hình, nhóm nghề cuộn ngang, pills tự xuống dòng mượt mà, sticky footer | Chiều rộng cuộn đạt chuẩn 390px, 0 lỗi tràn ngang |
| **Đồng bộ mã nguồn triển khai** | Chỉ có file gốc | Đồng bộ 100% giữa file gốc và thư mục `public/` (hash-checked) | Sẵn sàng triển khai static hosting Vercel / Live Server |

---

## 3. Danh Sách Tệp Triển Khai & Cập Nhật

1. `css/category-filter-modal.css` & `public/css/category-filter-modal.css`: Stylesheet độc lập, chuẩn thiết kế EasyCV Orange, responsive và hỗ trợ Dark Mode.
2. `js/category-filter-modal.js` & `public/js/category-filter-modal.js`: Controller điều phối dữ liệu phân cấp 10 nhóm ngành, quản lý trạng thái chọn, live search, scroll hint, sự kiện phím Escape và click ngoài.
3. `viec-lam.html` & `public/viec-lam.html`: Tích hợp trigger button và modal markup vào Search Hero Header.
4. `js/viec-lam.js` & `public/js/viec-lam.js`: Lắng nghe sự kiện `easycv:category-applied`, kết nối bộ lọc JOBS_DATA, đồng bộ URL parameters.
5. `index.html` & `public/index.html`: Cập nhật tiêu đề cột "NHÓM NGHỀ", "NGHỀ", "VỊ TRÍ CHUYÊN MÔN" và link phản hồi chân trang.
6. `css/home.css` & `public/css/home.css`: Bổ sung styles cho headers 2 cột và subgroup rows trên trang chủ.
7. `js/home.js` & `public/js/home.js`: Tinh chỉnh `renderIndustryContent` hiển thị checkbox tiêu đề nghề và tags chuyên môn.

---

## 4. Bằng Chứng Kiểm Thử Tự Động (Verification Evidence)

- **Cú pháp JavaScript:** `node --check` vượt qua 100% cho `category-filter-modal.js`, `viec-lam.js`, `home.js`.
- **Cú pháp HTML:** Parser chuẩn Python kiểm tra `viec-lam.html` và `index.html`: PASS.
- **Đồng bộ SHA-256:** 7 cặp tệp gốc và `public/` trùng khớp 100%.
- **Kiểm thử E2E Headless Chrome (`scratch/test_category_modal.js`):**
  - Trigger ban đầu: text `Danh mục Nghề`, `aria-expanded = false`.
  - Click mở modal: modal hiển thị, title `Chọn Nhóm nghề, Nghề hoặc Chuyên môn`, 10 nhóm nghề, 6 phân nhóm nghề trang 1, 20 pills chuyên môn, headers "NGHỀ" & "VỊ TRÍ CHUYÊN MÔN", link "Gửi góp ý".
  - Chọn pill `Sales Logistics` và click "Chọn": modal đóng, trigger hiển thị `Sales Logistics`, hệ thống tự động lọc danh sách việc làm.
  - Mobile 390x844: `scrollWidth = 390`, `hasHorizontalOverflow = false`, hiển thị toàn bộ modal trực quan.
- **Ảnh chụp màn hình đối soát:**
  - `scratch/category_filter_vieclam_modal.png` (Modal desktop mở hoàn chỉnh).
  - `scratch/category_filter_vieclam_mobile.png` (Modal mobile 390px).
  - `scratch/vieclam_search_bar_closed.png` (Thanh tìm kiếm hoàn thiện).

---

## 5. Đồng Bộ & Tích Hợp Hoàn Chỉnh Ngoài Trang Chủ (Homepage Integration)

- **Nguyên nhân lỗi giao diện ban đầu ngoài Trang chủ:**
  - Nút trigger cũ `#industryFilterTrigger` chứa mã SVG nội tuyến thiếu thuộc tính `width` và `height`, dẫn đến việc SVG tự co giãn theo mặc định `300x150px`, làm phình to thanh icon và chevron đen thành cột dọc vỡ khung ngoài box tìm kiếm như trong ảnh phản ánh.
- **Giải pháp xử lý:**
  - Thay thế toàn bộ cụm trigger bằng `.category-filter-trigger` (kích thước chuẩn 186x44px, icon 18x18px, chevron 14x14px).
  - Đưa `#categoryModalOverlay` vào [index.html](file:///d:/master%20page/index.html) và [public/index.html](file:///d:/master%20page/public/index.html).
  - Tích hợp [js/category-filter-modal.js](file:///d:/master%20page/js/category-filter-modal.js) vào Trang chủ.
  - Đồng bộ logic tìm kiếm trong [js/home.js](file:///d:/master%20page/js/home.js): khi chọn danh mục và nhấn "Tìm việc ngay", tự động chuyển hướng chính xác đến `viec-lam.html?industry=...` hoặc `?category=...`.
- **Kiểm thử tự động trên Trang chủ (`scratch/test_homepage_category.js` & `scratch/test_search_redirect.js`):**
  - Kích thước trigger: width 186px, height 44px, icon 18x18px, chevron 14x14px (PASS).
  - Mở modal trên trang chủ: 10 nhóm nghề, 6 phân nhóm hiển thị sắc nét (PASS).
  - Chọn `Sales Logistics` và click "Chọn": nút trigger cập nhật `Sales Logistics`, trạng thái `is-active` bật sáng (PASS).
  - Click "Tìm việc ngay": điều hướng thành công sang `http://localhost:3000/viec-lam.html?industry=Sales+Logistics` (PASS).
  - Mobile 390x844: hiển thị responsive hoàn hảo, không có thanh cuộn ngang (PASS).
- **Ảnh chụp màn hình Trang chủ đã sửa:**
  - `scratch/homepage_search_bar_fixed.png` (Thanh tìm kiếm Trang chủ chuẩn đẹp không còn vỡ hình).
  - `scratch/homepage_category_modal_opened.png` (Modal 2 cột chuẩn TopCV mở trên Trang chủ).
  - `scratch/homepage_search_bar_applied.png` (Nút pill đổi tên theo danh mục được chọn).
  - `scratch/homepage_category_modal_mobile.png` (Modal hiển thị trên smartphone 390px).

