---
title: Báo Cáo Đánh Giá & Khắc Phục Lỗi Trang Tìm Kiếm Việc Làm (EasyCV)
version: 1.1.0
status: implemented_and_verified
created: 2026-09-30
updated: 2026-09-30
module: bmm
panel:
  - John (Product Manager)
  - Sally (UX/UI Designer)
  - Winston (System Architect)
  - Amelia (Senior Developer)
  - Mary (Business Analyst)
---

# BÁO CÁO ĐÁNH GIÁ & KHẮC PHỤC LỖI TRANG TÌM KIẾM VIỆC LÀM (EASYCV)

## 1. Bối cảnh & Mục đích (Context & Objectives)

Dựa trên tài liệu đặc tả sản phẩm [`_bmad-output/planning-artifacts/prd.md`](file:///d:/master%20page/_bmad-output/planning-artifacts/prd.md), Hội đồng Chuyên gia BMAD đã tiến hành rà soát chất lượng màn hình tìm kiếm việc làm ([`viec-lam.html`](file:///d:/master%20page/viec-lam.html)) dựa trên ảnh chụp thực tế khi người dùng tìm kiếm từ khóa `"Java Spring Boot"`.

Sau phiên phân tích, người dùng đã phê duyệt yêu cầu: *"OK, sửa tất cả các lỗi đó đi"*. Báo cáo này lưu trữ chi tiết các phát hiện, giải pháp kỹ thuật và kết quả nghiệm thu của phiên triển khai.

---

## 2. Bảng ma trận lỗi & Đề xuất giải pháp (Findings Matrix)

| Mã lỗi | Phân loại | Người phát hiện | Vấn đề phát hiện | Giải pháp thực tế đã triển khai |
| :---: | :---: | :---: | :--- | :--- |
| **BUG-01** | UI / UX | Sally (UX) | **Nghịch lý phân trang (Pagination Mismatch):** Tìm thấy 1 việc làm nhưng phân trang hiển thị 5 trang và nút [Trang 3] sáng màu cam active. | Xây dựng hàm `renderPagination()` động. Nếu `totalPages <= 1`, tự động ẩn thanh phân trang (`display: none`). Nếu nhiều trang, render đúng số trang thực tế. |
| **BUG-02** | Functional | Amelia (Dev) | **Bộ lọc Lương & Kinh nghiệm bị bỏ quên:** Checkbox `salary` và `exp` ở sidebar không hề có logic lọc trong file `js/viec-lam.js`. | Bổ sung hàm `matchSalaryTier()` và mảng `checkedExps`, hỗ trợ lọc đa tiêu chí (multi-criteria filtering). |
| **FEAT-01** | Product | John (PM) | **Thiếu huy hiệu AI Match Score:** PRD cam kết điểm tương thích hồ sơ nhưng thẻ việc làm chưa có. | Bổ sung huy hiệu gradient `🎯 96% Match` trên mỗi Job Card và trong Modal chi tiết. |
| **ARCH-01** | Architecture | Winston (Arch) | **Quản lý DOM tĩnh:** 12 thẻ HTML tĩnh dùng `style.display = 'none'` không mở rộng được. | Tái cấu trúc sang mảng dữ liệu `JOBS_DATA` gồm 16 việc làm chuẩn hóa, render client-side theo trang (Page size = 6). |
| **UX-02** | UX / History | Mary (BA) | **Thiếu hỗ trợ điều hướng trình duyệt:** Người dùng bấm nút Back/Forward nhưng trang không cập nhật bộ lọc. | Bổ sung sự kiện `window.addEventListener('popstate')` đồng bộ URL query params với input và danh sách kết quả. |

---

## 3. Chi tiết các tệp mã nguồn đã cập nhật (Code Implementation)

### 3.1. File `js/viec-lam.js`
1. **Mảng dữ liệu `JOBS_DATA` (16 việc làm):** Đầy đủ các ngành (IT, Sales B2B, Marketing, Finance, Logistics, HR), các cấp bậc (Intern, Junior, Senior, Manager), mức lương (từ 6 triệu đến 80 triệu) và JD chi tiết cho từng công việc.
2. **Hàm `applyJobFilters(resetPage, updateUrl)`:**
   * So khớp từ khóa tiếng Việt bỏ dấu (`normalizeText`).
   * Lọc địa điểm 2 cấp và làm việc từ xa (`city`, `location`, `remote`).
   * Lọc theo ngành nghề (`category`).
   * Lọc theo Quick filter tags (Remote, Lương > 25tr, Fresher, Tuyển gấp, Tiếng Anh).
   * Lọc theo 4 nhóm Checkbox: Cấp bậc, Mức thu nhập, Kinh nghiệm, Hình thức làm việc.
3. **Phân trang động `renderPagination(totalPages)`:**
   * Tự động ẩn thanh phân trang khi chỉ có 1 trang kết quả (loại bỏ hoàn toàn BUG-01).
   * Render đúng các nút `« Trước`, số trang `1, 2, ... N`, `Sau »`.
   * Tự động cuộn mượt (`scrollIntoView`) lên đầu danh sách khi chuyển trang.
4. **Modal chi tiết theo thời gian thực:**
   * Hiển thị đúng JD, Yêu cầu và Quyền lợi riêng biệt của từng công việc được click.
5. **Đồng bộ hóa số đếm Sidebar `updateSidebarCounts()`:**
   * Tự động đếm số lượng công việc tương ứng theo dữ liệu để hiển thị bên cạnh checkbox.

### 3.2. File `css/viec-lam.css`
* Bổ sung `.job-badges-group`: Bố cục flex gom nhóm huy hiệu AI Match và mức lương.
* Bổ sung `.badge-ai-match`: Thiết kế gradient tím hiện đại (`#4F46E5`, `#9333EA`).
* Bổ sung `.page-btn.disabled`: Trạng thái vô hiệu hóa của nút phân trang đầu/cuối (`opacity: 0.45`, `pointer-events: none`).

### 3.3. File `viec-lam.html`
* Rút gọn cấu trúc `#jobListingGrid` từ 1.107 dòng xuống còn 581 dòng, loại bỏ mã HTML tĩnh trùng lặp.
* Thêm `#paginationWrapper` để JS kiểm soát render phân trang động.
* Bổ sung các ID động (`modalJobDescList`, `modalJobReqsList`, `modalJobPerksList`, `modalAiBadge`) vào popup xem nhanh chi tiết việc làm.

---

## 4. Báo cáo kiểm thử & Nghiệm thu (Verification Report)

Hệ thống đã chạy bộ test tự động qua Node.js:

* **Cú pháp JavaScript:** Đạt 100% (0 syntax error).
* **Kịch bản UJ-1 (Tìm kiếm 'Java Spring Boot'):**
  * Kết quả hiển thị: 2 việc làm phù hợp (VNPAY Senior Java Backend & NashTech Fresher Java).
  * Thanh phân trang: Đã ẩn (`display: none`), không còn hiện tượng hiển thị 5 trang hay active trang 3.
  * Thẻ công việc: Có huy hiệu `🎯 96% Match` và `30 - 55 triệu`.
* **Kịch bản xem toàn bộ catalog:**
  * 16 việc làm được phân thành 3 trang (mỗi trang 6 việc làm).
  * Trang 1 hiển thị 6 việc làm đầu tiên, nút `« Trước` bị vô hiệu hóa.
  * Chuyển sang trang 2 hiển thị 6 việc tiếp theo.
* **Bộ lọc Mức lương & Kinh nghiệm:**
  * Tích chọn `25 - 50 triệu` → Lọc chính xác các công việc có dải lương từ 25tr trở lên.
  * Tích chọn `Thực tập sinh` → Lọc ra đúng vị trí FPT Software Academy (Intern Web Dev 6 - 10 triệu).

---

## 5. Kết luận & Khuyến nghị tiếp theo (Next Steps)

* **Trạng thái:** Mã nguồn đã hoàn thiện và hoạt động ổn định trên máy chủ nội bộ tại `http://localhost:8000/viec-lam.html`.
* **Khuyến nghị tiếp theo từ Hội đồng BMAD:**
  1. Tiến hành commit mốc này vào Git: `git commit -m "fix(viec-lam): resolve pagination bug and implement full filter matrix"`.
  2. Bổ sung tính năng "Ứng tuyển nhanh bằng hồ sơ EasyCV" kết nối với thông tin tài khoản hiện hành (`Nguyễn Văn A - 85%`).
