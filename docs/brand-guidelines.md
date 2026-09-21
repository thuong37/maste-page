# EasyCV Brand Guidelines v1.0

> **Platform:** EasyCV - Nền tảng tuyển dụng thông minh & kết nối việc làm hàng đầu  
> **Positioning:** Tương tự TopCV, ITviec, VietnamWorks  
> **Last updated:** 2026-09-21  
> **Status:** Approved  

---

## Quick Reference

| Element | Value |
|---------|-------|
| Brand Name | **EasyCV** |
| Tagline | Kết nối sự nghiệp - Bứt phá tiềm năng |
| Primary Color | `#F97316` (EasyCV Vibrant Orange) |
| Secondary Color | `#0F172A` (Professional Slate Navy) |
| Success / Match Accent | `#16A34A` (Verified / Matched Green) |
| Primary Font | Inter / Plus Jakarta Sans / Be Vietnam Pro |
| Brand Voice | Hiện đại, Đáng tin cậy, Trao quyền, Rõ ràng, Nhanh chóng |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| EasyCV Orange | #F97316 | rgb(249,115,22) | Primary CTAs, brand mark, active tabs, highlight states |
| EasyCV Orange Dark | #EA580C | rgb(234,88,12) | Button hover, active pressed states |
| EasyCV Orange Light | #FFF7ED | rgb(255,247,237) | Badge backgrounds, highlighted job tags, active item tints |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Slate Navy 900 | #0F172A | rgb(15,23,42) | Headings, dark header bar, enterprise employers |
| Slate Navy 800 | #1E293B | rgb(30,41,59) | Secondary headers, dark mode surfaces |
| Tech Blue | #0284C7 | rgb(2,132,199) | Salary badges, tech skill tags, informational indicators |
| Accent Green | #16A34A | rgb(22,163,74) | "Đã ứng tuyển", "CV Phù hợp 95%", "Hot Job" badges |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Background White | #FFFFFF | rgb(255,255,255) | Main layout, card surfaces |
| Surface Light | #F8FAFC | rgb(248,250,252) | Page body background, filter panels |
| Surface Slate | #F1F5F9 | rgb(241,245,249) | Secondary card panels, input search box backgrounds |
| Text Primary | #0F172A | rgb(15,23,42) | Headings, job titles, key salary figures |
| Text Secondary | #64748B | rgb(100,116,139) | Company name, location, time posted, descriptions |
| Border Slate | #E2E8F0 | rgb(226,232,240) | Card borders, dividers, form input borders |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #16A34A | Ứng tuyển thành công, hồ sơ đạt chuẩn, công việc đang mở |
| Warning | #F59E0B | Hạn nộp sắp hết (gấp), lưu ý CV |
| Error | #DC2626 | Lỗi form, việc làm đã đóng |
| Info | #0284C7 | Thông báo hệ thống, lời khuyên nghề nghiệp |

### Accessibility Standards
- Contrast ratio text primary (`#0F172A`) on white (`#FFFFFF`): 16.1:1 (Vượt chuẩn AAA).
- Button CTA white text on EasyCV Orange (`#F97316` / `#EA580C`): Đảm bảo kích thước chữ từ 15px bold trở lên đạt chuẩn WCAG 2.1 AA.
- Toàn bộ button, link, search input đều có focus ring hiển thị rõ ràng: `ring-2 ring-orange-500`.

---

## 2. Typography

### Font Family

```css
--font-sans: 'Plus Jakarta Sans', 'Inter', 'Be Vietnam Pro', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale (Recruitment Optimized)

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|----------------|---------------|--------|-------------|
| H1 (Hero Heading) | 44px | 28px | 800 | 1.2 |
| H2 (Section Title) | 32px | 24px | 700 | 1.25 |
| H3 (Job Title / Card) | 18px | 16px | 600 | 1.4 |
| Body Regular | 15px | 14px | 400 | 1.5 |
| Body Medium | 15px | 14px | 500 | 1.5 |
| Salary / Highlight | 16px | 15px | 700 | 1.3 |
| Small / Badge Tag | 13px | 12px | 500 | 1.4 |
| Caption / Metadata | 12px | 11px | 400 | 1.4 |

---

## 3. Logo Usage & File Locations

### Master Logo Structure
Logo EasyCV bao gồm 2 thành phần chính:
1. **Biểu tượng (Brand Mark):** Hình khối chữ "C" cách điệu màu cam gradient (`#FF8A34` -> `#F95700`) ôm lấy tâm tròn ở giữa, tượng trưng cho hạt nhân năng lực, sự kết nối và điểm hội tụ việc làm.
2. **Chữ thương hiệu (Wordmark):** "EasyCV" theo kiểu chữ Sans-serif hiện đại, dày dặn, tự tin.

### Standard File Locations

| Asset Type | Canonical Workspace Path | Public Web Path (HTML / Next / Vite) | Best Use Case |
|------------|---------------------------|--------------------------------------|---------------|
| **Full Horizontal (Transparent)** | `assets/logos/easycv-logo-transparent.png` | `public/assets/logo/easycv-logo-transparent.png` | Navbar nền sáng, Hero banner, Footer sáng |
| **Full Horizontal (Dark Mode)** | `assets/logos/easycv-logo-dark.png` | `public/assets/logo/easycv-logo-dark.png` | Navbar nền tối (`#0F172A`), Banner sự kiện tuyển dụng |
| **Full Horizontal (Original)** | `assets/logos/easycv-logo.png` | `public/assets/logo/easycv-logo.png` | In ấn, tài liệu PDF, đối tác tuyển dụng |
| **Icon Only (Square 256x256)** | `assets/logos/easycv-icon.png` | `public/assets/logo/easycv-icon.png` | Favicon (`public/favicon.png`), Mobile App icon, Avatar |
| **Vector Scalable (SVG)** | `assets/logos/easycv-logo.svg` | `public/assets/logo/easycv-logo.svg` | Hiển thị responsive không vỡ nét mọi độ phân giải |
| **Vector Icon (SVG)** | `assets/logos/easycv-icon.svg` | `public/assets/logo/easycv-icon.svg` | Compact Header, Sidebar thu gọn, App Header |
| **Original Anchor File** | `EASYCV_LOGO_EXACT_FROM_USER_ANCHOR.png` | *(Root Workspace)* | File gốc do user cung cấp |

### Clear Space & Minimum Sizes
- **Khoảng cách an toàn (Clear Space):** Tối thiểu bằng 50% chiều cao của biểu tượng tròn cam ở cả 4 phía logo.
- **Kích thước tối thiểu trên màn hình (Digital):**
  - Full Logo: Chiều rộng tối thiểu **120px** (chiều cao tương ứng ~40px).
  - Icon Only: Kích thước tối thiểu **24x24px** (tốt nhất là 32px đến 48px trên header).

### Don'ts (Những điều cấm kỵ)
- Không kéo giãn, bóp méo tỷ lệ logo.
- Không tự ý đổi màu cam của biểu tượng sang các màu khác (như tím, đỏ cờ, vàng chanh).
- Không đặt logo chữ đen trên nền xanh đen hoặc nền tối mà không dùng phiên bản `easycv-logo-dark.png`.
- Không tạo hiệu ứng đổ bóng quá gắt hoặc viền neon quanh chữ.

---

## 4. Brand Voice & Messaging (Recruitment Ecosystem)

### Tone of Voice
- **Đáng tin cậy & Chuyên nghiệp (Trustworthy & Professional):** Ứng viên gửi gắm tương lai nghề nghiệp, doanh nghiệp tìm kiếm nhân tài cốt lõi. Dữ liệu công việc và lương thưởng phải minh bạch, chính xác.
- **Tiện lợi & Nhanh chóng (Easy & Fast):** Đúng với tinh thần "EasyCV" — quy trình tạo CV, tìm việc và ứng tuyển phải diễn ra mượt mà, tối giản thao tác phức tạp.
- **Truyền cảm hứng (Empowering):** Khích lệ người tìm việc tự tin ứng tuyển và phát triển sự nghiệp.

### Core Modules for UI/UX
1. **Smart Job Search Bar:** Ô tìm kiếm việc làm nổi bật ngay đầu trang (Vị trí, Địa điểm, Ngành nghề, Mức lương).
2. **Job Listing Card (Thẻ việc làm):** Logo công ty, Tiêu đề việc làm, Mức lương (highlight cam hoặc xanh), Địa điểm, Tag kỹ năng, Nút "Ứng tuyển nhanh".
3. **Company Profile & Review:** Tương tự ITviec/TopCV, có huy hiệu xác thực công ty, đánh giá môi trường làm việc.
4. **CV Builder & CV AI Review:** Công cụ tạo CV chuẩn ATS, gợi ý chỉnh sửa hồ sơ.
