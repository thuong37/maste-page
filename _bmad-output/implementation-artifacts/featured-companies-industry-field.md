# Đặc Tả Kỹ Thuật: Bổ Sung Lĩnh Vực Công Ty Trong Khối "Công Ty Nổi Bật"

> **Trạng thái:** *ĐÃ HOÀN NGUYÊN (REVERTED)* theo yêu cầu người dùng ("quay lại như cũ, k cần thêm lĩnh vực nữa"). Toàn bộ các thẻ công ty đã khôi phục về trạng thái sạch sẽ ban đầu.

## 1. Mục Tiêu & Yêu Cầu
- **Yêu cầu:** Tại khối **"Công ty nổi bật"** (`#cong-ty-tieu-bieu` / `.companies-carousel`) trên Trang chủ (`index.html`), bổ sung thông tin **lĩnh vực hoạt động của công ty** đặt ngay bên dưới tên công ty.
- **Tiêu chuẩn UI/UX:**
  - Font Inter, kích cỡ `12px` (weight `500`), màu sắc dịu nhẹ `var(--text-muted, #64748B)`.
  - Phù hợp hệ thống phân cấp thị giác (Logo 65x65 -> Tên công ty 13px weight 800 -> Lĩnh vực 12px weight 500 -> Số lượng việc làm & Yêu thích).
  - Tự động rút gọn dấu 3 chấm (`text-overflow: ellipsis`) khi tên lĩnh vực dài, tooltip đầy đủ với `title`.
  - Hỗ trợ Dark Mode (`#94A3B8`) và Mobile breakpoint (thu gọn `11px`).

---

## 2. Danh Sách Doanh Nghiệp & Lĩnh Vực

| STT | Doanh nghiệp | Tên hiển thị đầy đủ | Lĩnh vực áp dụng |
| :---: | :--- | :--- | :--- |
| 1 | **FPT Software** | Công ty TNHH Phần Mềm FPT - FPT Software | `Công nghệ thông tin` |
| 2 | **VNG Corporation** | Công ty Cổ Phần VNG - VNG Corporation | `Internet & Phần mềm` |
| 3 | **Viettel Digital** | Tổng Công ty Dịch Vụ Số Viettel - Viettel Digital | `Viễn thông & Dịch vụ số` |
| 4 | **Techcombank** | Ngân Hàng TMCP Kỹ Thương Việt Nam - Techcombank | `Tài chính / Ngân hàng` |
| 5 | **Ví MoMo** | Công ty Cổ Phần Dịch Vụ Di Động Trực Tuyến - Ví MoMo | `Fintech & Thanh toán số` |
| 6 | **Shopee Việt Nam** | Công ty TNHH Shopee - Shopee Việt Nam | `Thương mại điện tử` |
| 7 | **MB Bank** | Ngân Hàng TMCP Quân Đội - MB Bank | `Tài chính / Ngân hàng` |
| 8 | **VinAI Research** | Công ty Cổ Phần VinAI - VinAI Research | `Trí tuệ nhân tạo (AI)` |

---

## 3. Các Tệp Triển Khai & Đồng Bộ

1. **`index.html` & `public/index.html`:**
   - Chèn `<span class="company-card-industry" title="Lĩnh vực: ...">...</span>` ngay sau `<a class="company-card-title">...</a>` trong 8 thẻ công ty.
2. **`css/home.css` & `public/css/home.css`:**
   - Thêm quy tắc `.company-card-industry` (display block, `12px`, `weight: 500`, `color: #64748B`, `margin-top: 6px`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`).
   - Thêm quy tắc Dark Mode `[data-theme="dark"] .company-card-industry { color: #94A3B8; }`.
   - Cân đối khoảng cách footer `.company-card-footer { padding-top: 14px; }`.
   - Media query `@media (max-width: 640px)`: `.company-card-industry { font-size: 11px; margin-top: 4px; }`.

---

## 4. Kết Quả Kiểm Thử (Verification)

Kịch bản kiểm thử tự động Node.js CDP Chrome Headless (`scratch/verify_company_industries.js`) tại `http://localhost:3000/index.html`:
- **Số thẻ được đánh giá:** 8/8 thẻ.
- **Tính chính xác dữ liệu:** 100% hiển thị đúng lĩnh vực chuẩn ngành nghề.
- **Thẩm mỹ:** Bố cục thẻ cân đối, chiều cao đồng nhất, chữ hiển thị rõ ràng trên cả Desktop và Mobile.
- **Ảnh nghiệm thu:** `scratch/companies_with_industry_desktop.png` và `scratch/companies_with_industry_mobile.png`.
