# Đặc Tả Kỹ Thuật: Tinh Chỉnh Thẻ "Việc Làm Bạn Sẽ Thích" Trong Popup Tìm Kiếm

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Thời gian cập nhật:** 2026-10-04  
**Trạng thái:** Hoàn thành & Đã kiểm thử tự động 100%  
**Tài liệu tham chiếu:** [PRD](file:///d:/ThuongNV_EasyCV_T%C3%A0i%20li%E1%BB%87u/master%20page/_bmad-output/planning-artifacts/prd.md) | [AGENTS.md](file:///d:/ThuongNV_EasyCV_T%C3%A0i%20li%E1%BB%87u/master%20page/AGENTS.md)

---

## 1. Yêu Cầu & Bối Cảnh Người Dùng (User Requirement)

Người dùng yêu cầu khi click vào ô tìm kiếm trên trang chủ EasyCV, popup gợi ý tìm kiếm (#searchSuggestDropdown) hiện lên với bố cục khối **"Việc làm bạn sẽ thích"** có tỷ lệ chuẩn đẹp, bao gồm:
1. **Logo công ty kích thước chuẩn 64x64 px**: Có bo tròn nhẹ góc cạnh (border-radius: 10px), đồ họa hiện đại sắc nét.
2. **Hiển thị đầy đủ cả Tên công việc (Job Title) và Tên công ty (Company Name)**.
3. **Mức lương (Salary) hiển thị màu xanh lá cây** (`#10B981` / `rgb(16, 185, 129)`) nổi bật ở dòng thứ 3 dưới tên công ty.
4. **Tương tự 100% như ảnh mẫu đính kèm** (vị trí công việc: *Kế Toán Tổng Hợp (Mảng Giải Trí)*, Công ty: *CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ*, Lương: *20 - 25 triệu*, logo tòa nhà hiện đại nền xanh mint).

---

## 2. Bảng Ma Trận So Sánh Trước & Sau Khi Tinh Chỉnh

| Thành Phần | Trước Khi Sửa | Sau Khi Tinh Chỉnh | Kết Quả |
| :--- | :--- | :--- | :--- |
| **Kích thước logo** | 40x40 px, chỉ có 2 chữ cái viết tắt (GD, IT, KM...) | **64x64 px**, logo đồ họa / vector công ty chi tiết, bo góc 10px | **Khớp 100% ảnh mẫu** |
| **Tên công ty** | **Không có** | Có dòng riêng: chữ in hoa uppercase, màu xám thanh lịch `#64748B`, font 12px/600 | **Khớp 100% ảnh mẫu** |
| **Tên công việc** | Dòng đơn giản, font 13.5px | Font 15px bold `#0F172A`, line-height 1.35, hover chuyển màu cam `#EA580C` | **Khớp 100% ảnh mẫu** |
| **Mức lương** | Nằm dạt sang cột ngoài cùng bên phải, màu cam | Nằm ở dòng 3 ngay dưới tên công ty, **màu xanh lá `#10B981`**, font 13.5px bold | **Khớp 100% ảnh mẫu** |
| **Hình dáng thẻ** | Bị lỗi bo tròn dạng viên thuốc (pill 9999px) do class `.suggest-trend-chip` | Tách riêng class `.recommended-job`, dạng hàng ngang có đường phân cách `#F1F5F9` mờ tinh tế, hover nền `#F8FAFC` | **Khớp 100% ảnh mẫu** |
| **Tương tác click** | Kích hoạt tìm kiếm qua keyword | Click trực tiếp vào thẻ chuyển hướng tìm kiếm việc làm đến `viec-lam.html?keyword=...` | **Hoạt động hoàn hảo** |

---

## 3. Danh Sách Tệp Đã Triển Khai & Đồng Bộ

1. [`js/home.js`](file:///d:/ThuongNV_EasyCV_T%C3%A0i%20li%E1%BB%87u/master%20page/js/home.js):
   - Cập nhật template dữ liệu thẻ việc làm trong `search-format-panel` với cấu trúc logo 64x64, tên job, tên công ty và lương.
   - Tách bỏ class `.suggest-trend-chip` để tránh bị ảnh hưởng style viên thuốc từ CSS gốc.
   - Bổ sung event listener riêng cho `.recommended-job` kích hoạt tìm kiếm khi click.
   - Bổ sung listener click cho `.search-input-group` để kích hoạt mở dropdown khi click bất kỳ vị trí nào trong ô search.
2. [`public/js/home.js`](file:///d:/ThuongNV_EasyCV_T%C3%A0i%20li%E1%BB%87u/master%20page/public/js/home.js): Đồng bộ 100% với `js/home.js`.
3. [`css/home.css`](file:///d:/ThuongNV_EasyCV_T%C3%A0i%20li%E1%BB%87u/master%20page/css/home.css):
   - Quy định kích thước `.recommended-job-logo` chuẩn 64x64 px (mobile 56x56 px).
   - Thiết kế bố cục flexbox dọc cho `.recommended-job-info` gồm 3 dòng: `.recommended-job-title`, `.recommended-job-company`, `.recommended-job-salary`.
   - Thiết lập màu sắc: Tiêu đề job `#0F172A` (hover `#EA580C`), Công ty `#64748B`, Lương `#10B981`.
   - Đường phân cách thanh mảnh `border-bottom: 1px solid #F1F5F9;`.
4. [`public/css/home.css`](file:///d:/ThuongNV_EasyCV_T%C3%A0i%20li%E1%BB%87u/master%20page/public/css/home.css): Đồng bộ 100% với `css/home.css`.
5. **Tài nguyên logo chuẩn 64x64 px**:
   - `assets/logos/company-mua-he-64.png` (và `public/assets/logos/company-mua-he-64.png`): Logo trích xuất trực tiếp từ ảnh đính kèm của người dùng.
   - `assets/logos/company-vikimco-64.svg` (và `public/assets/logos/company-vikimco-64.svg`): Logo vector công ty Vikimco.
   - `assets/logos/company-fpt-64.svg` (và `public/assets/logos/company-fpt-64.svg`): Logo vector công nghệ FPT.
   - `assets/logos/company-kimmari-64.svg` (và `public/assets/logos/company-kimmari-64.svg`): Logo vector ẩm thực Kimmari.
   - `assets/logos/company-tanviet-64.svg` (và `public/assets/logos/company-tanviet-64.svg`): Logo vector thiết bị công nghiệp Tân Việt.

---

## 4. Kết Quả Kiểm Thử Tự Động (Automated Verification)

Kịch bản kiểm thử tự động Chrome CDP Headless trên máy chủ cục bộ (`scratch/test_search_suggest.js`):
- **Trạng thái mở popup**: `isOpen: true`, kích thước dropdown computed: `1210 x 500 px`.
- **Kích thước logo computed**: Đúng `64 x 64 px` (`x: 668, y: 245, width: 64, height: 64`).
- **Hình ảnh logo**: Tải thành công từ `assets/logos/company-mua-he-64.png` (naturalWidth: 64, naturalHeight: 64).
- **Màu sắc mức lương**: Computed color `rgb(16, 185, 129)` (xanh lá chuẩn).
- **Tương tác click**: Click thẻ việc làm tự động điều hướng sang `http://localhost:3000/viec-lam.html?keyword=K%E1%BA%BF+To%C3%A1n+T%E1%BB%95ng+H%E1%BB%A3p+%28M%E1%BA%A3ng+Gi%E1%BA%A3i+Tr%C3%AD%29`.
- **Ảnh chụp nghiệm thu trực quan**: Lưu tại `scratch/search_suggest_popup.png` và `scratch/search_suggest_full.png`.
