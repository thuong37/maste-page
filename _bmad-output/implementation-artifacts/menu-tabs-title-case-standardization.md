# Chuẩn Hóa Định Dạng Tiêu Đề Menu (Title Case) Trên Toàn Bộ Nền Tảng EasyCV

- **Màn hình áp dụng**: [Trang chủ (`index.html`)](file:///d:/master%20page/index.html), [Danh sách việc làm (`viec-lam.html`)](file:///d:/master%20page/viec-lam.html), [Chi tiết việc làm (`chi-tiet-viec-lam.html`)](file:///d:/master%20page/chi-tiet-viec-lam.html), [Xem trước việc làm (`job-preview.html`)](file:///d:/master%20page/job-preview.html)
- **Khu vực**: Thanh điều hướng Desktop (`.site-header .navbar-nav`) và Ngăn kéo di động (`#mobile-drawer-overlay .mobile-drawer-body`)
- **Ngày hoàn thành**: 2026-10-08

---

## 1. Yêu Cầu & Quyết Định Thiết Kế

- **Phản hồi người dùng**: Tab "Tìm việc" trước đây viết thường chữ "việc", trong khi các tab khác có chữ viết hoa (đặc biệt là cụm "CV" trong "Hồ sơ & CV"), dẫn đến cảm giác thiếu nhất quán về mặt thị giác trên thanh điều hướng chính.
- **Quyết định chuẩn hóa**: Thống nhất chuyển đổi toàn bộ 4 tab menu cấp 1 sang chuẩn **Title Case (Viết hoa chữ cái đầu mỗi từ)** để tạo sự sang trọng, đồng bộ và chuyên nghiệp:
  1. `Tìm việc` → **`Tìm Việc`**
  2. `Hồ sơ & CV` → **`Hồ Sơ & CV`**
  3. `Ứng tuyển` → **`Ứng Tuyển`**
  4. `Công cụ nghề nghiệp` → **`Công Cụ Nghề Nghiệp`**

---

## 2. Bảng Ma Trận Thay Đổi (Before vs After)

| Menu Tab | Trạng thái trước cập nhật | Trạng thái sau chuẩn hóa (Title Case) | Thuộc tính đồng bộ (`title` & `aria-label`) |
| :--- | :--- | :--- | :--- |
| **Tab 1** | `Tìm việc` | **`Tìm Việc`** | `title="Tìm Việc"`<br>`aria-label="Tìm Việc"` |
| **Tab 2** | `Hồ sơ & CV` | **`Hồ Sơ & CV`** | `title="Hồ Sơ & CV"` |
| **Tab 3** | `Ứng tuyển` | **`Ứng Tuyển`** | `title="Ứng Tuyển"` |
| **Tab 4** | `Công cụ nghề nghiệp` | **`Công Cụ Nghề Nghiệp`** | `title="Công Cụ Nghề Nghiệp"` |
| **Mobile Drawer (1-4)** | Cả 4 tab viết thường chữ sau | **`Tìm Việc`**, **`Hồ Sơ & CV`**, **`Ứng Tuyển`**, **`Công Cụ Nghề Nghiệp`** | Đồng bộ 100% với giao diện Desktop |

---

## 3. Danh Sách Tệp Triển Khai (Root ⇄ Public 100% Sync)

| Tệp nguồn | Tệp Public tương ứng | Trạng thái đồng bộ SHA-256 |
| :--- | :--- | :--- |
| [`index.html`](file:///d:/master%20page/index.html) | [`public/index.html`](file:///d:/master%20page/public/index.html) | ✅ Khớp 100% |
| [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) | [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html) | ✅ Khớp 100% |
| [`chi-tiet-viec-lam.html`](file:///d:/master%20page/chi-tiet-viec-lam.html) | [`public/chi-tiet-viec-lam.html`](file:///d:/master%20page/public/chi-tiet-viec-lam.html) | ✅ Khớp 100% |
| [`job-preview.html`](file:///d:/master%20page/job-preview.html) | [`public/job-preview.html`](file:///d:/master%20page/public/job-preview.html) | ✅ Khớp 100% |

---

## 4. Kết Quả Kiểm Thử Tự Động (Chrome CDP Headless)

Kịch bản kiểm thử tự động tại [`scratch/verify_menu_title_case.js`](file:///d:/master%20page/scratch/verify_menu_title_case.js):
- **Desktop Navbar**:
  - Tab 1: `text: "Tìm Việc"`, `title: "Tìm Việc"`, `ariaLabel: "Tìm Việc"`
  - Tab 2: `text: "Hồ Sơ & CV"`, `title: "Hồ Sơ & CV"`
  - Tab 3: `text: "Ứng Tuyển"`, `title: "Ứng Tuyển"`
  - Tab 4: `text: "Công Cụ Nghề Nghiệp"`, `title: "Công Cụ Nghề Nghiệp"`
- **Mobile Drawer**:
  - `["Tìm Việc", "Hồ Sơ & CV", "Ứng Tuyển", "Công Cụ Nghề Nghiệp"]`
- **Ảnh nghiệm thu thực tế**: [`scratch/verified_menu_title_case.png`](file:///d:/master%20page/scratch/verified_menu_title_case.png) hiển thị đồng nhất, thanh lịch và cân đối hoàn mỹ.
