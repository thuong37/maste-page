# Đặc Tả Kiến Trúc & Thiết Kế: Áp Dụng Phong Cách Thiết Kế Structured, Tokenized, Content-First (Bảo Lưu Nhận Diện EasyCV)

- **Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Phiên bản:** v2.0 (Design Tokens & Foundations Standardization)
- **Ngày hoàn thành:** 2026-10-06
- **Trạng thái:** Hoàn tất & Kiểm thử thành công (100% Pass)

---

## 1. Bối Cảnh & Yêu Cầu Cốt Lõi

Người dùng cung cấp bộ thông số phong cách thiết kế:
```text
## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: font.family.primary=Inter, font.family.stack=Inter, sans-serif, font.size.base=14px, font.weight.base=500, font.lineHeight.base=22px
- Typography scale: font.size.xs=12px, font.size.sm=13px, font.size.md=14px, font.size.lg=15px, font.size.xl=16px, font.size.2xl=18px, font.size.3xl=20px
- Color palette: color.text.primary=#263a4d, color.text.secondary=#212f3f, color.text.tertiary=#15bf61, color.text.inverse=#516171, color.surface.base=#000000, color.surface.muted=#ffffff, color.surface.raised=#e3faed, color.surface.strong=#f0f0f0
- Spacing scale: space.1=2px, space.2=4px, space.3=5px, space.4=6px, space.5=8px, space.6=10px, space.7=11px, space.8=12px
- Radius/shadow/motion tokens: radius.xs=6px, radius.sm=8px, radius.md=10px, radius.lg=22px, radius.xl=32.29px, radius.2xl=44px, radius.step7=50px, radius.step8=56px | shadow.1=rgba(0, 0, 0, 0.1) 0px 0px 12px 0px | motion.duration.instant=200ms
```

Kèm chỉ đạo trọng yếu:
> **"Áp dụng phong cách thiết kế mà tôi vừa gửi, không sử dụng màu giống là được để không bị người dùng nghĩ là copy trang khác."**

---

## 2. Ma Trận Chuyển Đổi & Ánh Xạ Tokens (Semantic Token Mapping)

Hệ màu của trang tham khảo (TopCV) mang đặc trưng xanh lá và dark teal cyan. Để giữ trọn vẹn triết lý kiến trúc *structured, tokenized, content-first* nhưng **bảo vệ 100% bản sắc thương hiệu EasyCV** (theo `AGENTS.md`: Cam chủ đạo `#F97316`, Nền sáng tinh tế `#F8FAFC`, Font chữ Inter), hệ thống được ánh xạ như sau:

| Token vai trò | Giá trị tham chiếu gốc | Token ánh xạ EasyCV | Vai trò & Ứng dụng trong giao diện |
| :--- | :--- | :--- | :--- |
| **`color.text.primary`** | `#263a4d` (Dark cyan) | `#1E293B` (Deep slate) | Tiêu đề chính, tên công việc, body text sắc sảo |
| **`color.text.secondary`**| `#212f3f` | `#475569` (Slate neutral) | Tên công ty, địa điểm, metadata phụ |
| **`color.text.tertiary`** | `#15bf61` (Green brand) | `#F97316` (EasyCV Orange) | Màu nhận diện thương hiệu, mức lương, icon active |
| **`color.text.inverse`**  | `#516171` | `#64748B` / `#FFFFFF` | Chú thích thứ cấp / Chữ trắng trên nền cam |
| **`color.surface.base`**  | `#000000` | `#FFFFFF` | Nền thẻ việc làm, dialog modal, dropdown suggestions |
| **`color.surface.muted`** | `#ffffff` | `#F8FAFC` | Nền trang toàn cục (Slate 50 chuẩn AGENTS.md) |
| **`color.surface.raised`**| `#e3faed` (Green tint) | `#FFF7ED` (Warm Peach) | Nền pill lương, nút xem nhanh, highlight tag |
| **`color.surface.strong`**| `#f0f0f0` | `#F1F5F9` (Slate strong) | Khung phân vùng, container structural |
| **`color.border`**        | Generic border | `#E2E8F0` | Đường viền thanh thoát, tối ưu tương phản |
| **`color.accent`**        | `#15bf61` | `#16A34A` (Semantic Green)| Huy hiệu khách quan "Khớp 95% CV", tích Verified |

---

## 3. Hệ Thống Typography, Spacing, Radius & Motion

### 3.1. Typography
- **Font chính:** Inter (`font-family: var(--font-family-stack, 'Inter', sans-serif)`)
- **Metrics cơ sở:** `font-size: 14px`, `font-weight: 500`, `line-height: 22px`
- **Thang tỉ lệ kích thước (Typography Scale):**
  - `font.size.xs`: `12px`
  - `font.size.sm`: `13px`
  - `font.size.md`: `14px` (chuẩn cơ sở)
  - `font.size.lg`: `15px`
  - `font.size.xl`: `16px`
  - `font.size.2xl`: `18px`
  - `font.size.3xl`: `20px`

### 3.2. Spacing Scale
- `space.1 = 2px`, `space.2 = 4px`, `space.3 = 5px`, `space.4 = 6px`
- `space.5 = 8px`, `space.6 = 10px`, `space.7 = 11px`, `space.8 = 12px`
- Mở rộng macro: `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`

### 3.3. Radius, Shadow & Motion
- **Radius Scale:** `6px`, `8px`, `10px`, `22px`, `32.29px`, `44px`, `50px`, `56px`, `9999px (full)`
- **Shadow Token:** `shadow.1: 0 0 12px rgba(0, 0, 0, 0.1)`
- **Motion Token:** `motion.duration.instant: 200ms` với timing `cubic-bezier(0.16, 1, 0.3, 1)`

---

## 4. Các Tệp Mã Nguồn Đã Cập Nhật & Đồng Bộ (Root <-> Public Parity)

1. **`assets/design-tokens.css` & `public/assets/design-tokens.css`**: Khởi tạo toàn bộ biến `:root` theo chuẩn foundations mới.
2. **`assets/design-tokens.json` & `public/assets/design-tokens.json`**: Cập nhật lược đồ JSON tokens v2.0.0.
3. **`css/navbar.css` & `public/css/navbar.css`**: Cập nhật `@import` Google Fonts Inter, gắn font cơ sở Inter 14px/500/22px, hệ màu text `#1E293B` và background `#F8FAFC`.
4. **`css/home.css` & `public/css/home.css`**: Thay thế toàn bộ mã màu xanh lá cũ (`#00B14F`, `#009643`) tại job card hover, logo border, badge lightning, bookmark sang sắc cam thương hiệu EasyCV `#F97316` và quầng sáng `rgba(249, 115, 22, 0.14)`.
5. **`css/viec-lam.css` & `public/css/viec-lam.css`**: Loại bỏ biến `--tc-green`, chuyển đổi thẻ job card, mức lương, nút xem nhanh (`#FFF7ED`), nút ứng tuyển, nút lưu tin sang EasyCV Brand Orange.
6. **`index.html` & `public/index.html`**: Nhúng link Google Fonts Inter, cập nhật bộ phân trang danh mục mega nav sang sắc cam `#F97316`.
7. **`viec-lam.html` & `public/viec-lam.html`**: Nhúng Inter font, định nghĩa lại critical style `#easycv-job-card-hover-style` theo hệ cam `#F97316`.
8. **`chi-tiet-viec-lam.html` & `public/chi-tiet-viec-lam.html`**: Nhúng Inter font, đồng bộ cache key tokens.
9. **`design-system/easycv/MASTER.md`**: Cập nhật tài liệu thiết kế gốc của dự án.

---

## 5. Kết Quả Kiểm Thử Toàn Diện (Test Matrix)

| Hạng mục kiểm thử | Công cụ kiểm tra | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Token Integrity** | `scratch/verify_design_foundation.js` | 37/37 tokens khớp chính xác cú pháp & giá trị | **PASS** (100%) |
| **Root/Public Parity** | SHA-256 / Byte parity | Trùng khớp 100% giữa file gốc và thư mục `public/` | **PASS** (100%) |
| **Competitor Green Cleanup** | AST Regex Scanner | 0 màu `#00B14F`, 0 màu `#009643`, 0 màu `#E6F7ED` trong CSS/HTML | **PASS** (100%) |
| **Live Computed Font (Body)** | Chrome Headless CDP | `fontFamily = "Inter, sans-serif"`, `fontSize = "14px"`, `lineHeight = "22px"` | **PASS** (100%) |
| **Live Computed Colors** | Chrome Headless CDP | `salaryColor = rgb(249, 115, 22)`, `bookmarkBorder = rgb(249, 115, 22)` | **PASS** (100%) |
| **Tương thích Job Search** | `scratch/test_job_search.js` | 5/5 kịch bản tìm kiếm & sắp xếp giữ nguyên vẹn | **PASS** (100%) |
| **Tương thích Chi tiết việc làm** | `scratch/verify_chi_tiet_suite.js` | Modal, feed, sticky search, mobile responsive 375px PASS | **PASS** (100%) |
