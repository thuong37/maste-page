# EasyCV Brand & Logo Asset Directory

Tài liệu hướng dẫn vị trí file logo và cấu trúc thương hiệu của nền tảng tuyển dụng **EasyCV** (tương tự TopCV, ITviec, VietnamWorks).

Các skill thiết kế UI/UX (`ui-ux-pro-max`, `brand`, `design`, `design-system`, `banner-design`) và các framework web (Next.js, Vite, React, HTML) sẽ tự động nhận diện và sử dụng logo từ các đường dẫn chuẩn dưới đây.

---

## 1. Sơ đồ vị trí file Logo (Asset Paths)

```
d:/master page/
├── EASYCV_LOGO_EXACT_FROM_USER_ANCHOR.png    <-- File gốc đối chiếu do người dùng cung cấp
│
├── assets/                                    <-- Thư mục chuẩn cho Brand & Design System Skill
│   ├── design-tokens.json                     <-- Design token định nghĩa màu cam, font, kích thước
│   ├── design-tokens.css                      <-- Biến CSS (:root) cho toàn bộ web
│   └── logos/
│       ├── easycv-logo-transparent.png        <-- [KHUYÊN DÙNG] Logo nền trong suốt, viền mượt
│       ├── easycv-logo-dark.png               <-- Logo chữ trắng cho Navbar tối màu (#0F172A)
│       ├── easycv-logo.png                    <-- Logo nguyên bản chuẩn hóa
│       ├── easycv-icon.png                    <-- Biểu tượng chữ C cam (256x256) làm icon/avatar
│       ├── easycv-logo.svg                    <-- Logo định dạng Vector SVG phóng to không vỡ nét
│       ├── easycv-icon.svg                    <-- Icon định dạng Vector SVG
│       ├── full-horizontal/                   <-- Chuẩn hóa theo skill 'brand'
│       │   ├── logo_easycv_full-horizontal_20260921.png
│       │   ├── logo_easycv_full-horizontal-trans_20260921.png
│       │   └── logo_easycv_full-horizontal-dark_20260921.png
│       ├── icon-only/
│       │   ├── logo_easycv_icon-only_20260921.png
│       │   └── logo_easycv_icon-only-whitebg_20260921.png
│       └── variations/
│           └── logo_easycv_original-anchor_20260921.png
│
├── public/                                    <-- Thư mục phục vụ trực tiếp cho Web (Vite / Next.js / HTML)
│   ├── logo.png                               <-- Đường dẫn /logo.png
│   ├── favicon.png                            <-- Đường dẫn /favicon.png (tab trình duyệt)
│   └── assets/logo/
│       ├── easycv-logo-transparent.png        <-- Đường dẫn /assets/logo/easycv-logo-transparent.png
│       ├── easycv-logo-dark.png               <-- Đường dẫn /assets/logo/easycv-logo-dark.png
│       ├── easycv-logo.png                    <-- Đường dẫn /assets/logo/easycv-logo.png
│       ├── easycv-icon.png                    <-- Đường dẫn /assets/logo/easycv-icon.png
│       ├── easycv-logo.svg                    <-- Đường dẫn /assets/logo/easycv-logo.svg
│       └── easycv-icon.svg                    <-- Đường dẫn /assets/logo/easycv-icon.svg
│
├── src/assets/logo/                           <-- Thư mục cho import nội bộ trong code React/Vite
│   ├── easycv-logo-transparent.png
│   ├── easycv-logo-dark.png
│   ├── easycv-logo.png
│   ├── easycv-icon.png
│   └── easycv-logo.svg
│
├── docs/
│   └── brand-guidelines.md                    <-- Brand Guidelines chuẩn cho skill 'brand'
│
├── design-system/easycv/
│   └── MASTER.md                              <-- Master Design System chuẩn cho skill 'ui-ux-pro-max'
│
└── .assets/
    ├── manifest.json                          <-- Asset registry đăng ký toàn bộ file logo
    ├── tags.json                              <-- Bộ tag phân loại
    └── metadata/logos.json                    <-- Quy chuẩn khoảng cách an toàn, kích thước tối thiểu
```

---

## 2. Thông số màu sắc nhận diện (Brand Colors)

- **Màu cam chủ đạo (Primary Orange):** `#F97316` (Hover: `#EA580C`, Light tint: `#FFF7ED`)
  - Thể hiện sự nhiệt huyết, tốc độ, cơ hội việc làm rộng mở (tương tự màu sắc đặc trưng của các sàn việc làm hàng đầu).
- **Màu xanh đen / Chữ chính (Slate Navy / Text):** `#0F172A`
  - Đảm bảo tính chuyên nghiệp, tin cậy cao cho doanh nghiệp và ứng viên.
- **Màu xanh lá thành công (Success Green):** `#16A34A`
  - Dành cho "CV phù hợp 95%", "Ứng tuyển thành công", "Việc làm gấp".

---

## 3. Cách dùng trong giao diện Web

### HTML / Vanilla CSS
```html
<!-- Navbar nền sáng -->
<header class="navbar bg-white shadow-sm px-6 py-4 flex items-center justify-between">
  <a href="/" class="flex items-center">
    <img src="/assets/logo/easycv-logo-transparent.png" alt="EasyCV" class="h-10 w-auto" />
  </a>
</header>
```

### React / Next.js
```tsx
import Image from 'next/image';

export function Header() {
  return (
    <header className="flex items-center gap-4">
      <Image 
        src="/assets/logo/easycv-logo-transparent.png" 
        alt="EasyCV - Sàn tuyển dụng việc làm" 
        width={180} 
        height={60} 
        priority 
      />
    </header>
  );
}
```

### CSS Variables
```css
@import '/assets/design-tokens.css';

.site-logo {
  background-image: var(--easycv-logo-light);
  width: 180px;
  height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
}
```
