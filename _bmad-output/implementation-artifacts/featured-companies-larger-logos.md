# Đặc Tả Kỹ Thuật: Tăng Kích Thước Logo & Hạ Thấp Tên Công Ty (Khối Công Ty Nổi Bật)

## 1. Yêu Cầu & Mục Tiêu Thiết Kế
- **Yêu cầu từ người dùng:** "đẩy cái logo to lên, cái tên công ty đẩy dần xuống dưới" trong khối **"Công ty nổi bật"** (`#cong-ty-tieu-bieu` / `.companies-carousel`).
- **Mục tiêu UX/UI:**
  - Tăng độ nhận diện thương hiệu cho các tập đoàn lớn (FPT, VNG, Viettel, Techcombank, MoMo, Shopee, MB Bank, VinAI).
  - Tách bạch không gian giữa Logo và Tên công ty, giúp thẻ có chiều sâu, khoảng thở lớn và sang trọng hơn.
  - Đảm bảo tính thích ứng (responsive) trên mọi độ phân giải màn hình từ Desktop đến Mobile Web.

---

## 2. Thông Số Kỹ Thuật Trước & Sau Thay Đổi

| Phần tử CSS | Trước thay đổi | Sau thay đổi | Ghi chú thiết kế |
| :--- | :--- | :--- | :--- |
| **Kích thước khung Logo (`.company-card-logo-wrap`)** | `65px x 65px` | `88px x 88px` | Tăng ~35% diện tích hiển thị, bo góc `20px`, đổ bóng nhẹ `rgba(15, 23, 42, 0.05)` |
| **Cỡ chữ Logo Mark (`.company-card-logo-mark`)** | `19px` | `24px` | FPT/VNG/MB/Shopee `24-26px`; Viettel/VinAI/MoMo `17-18px` sắc nét |
| **Khoảng cách Logo ➔ Tên (`.company-card-title`)** | `margin-top: 18px` | `margin-top: 24px` | Đẩy tên công ty lùi sâu xuống phía dưới, tạo khoảng thở thanh thoát |
| **Typography Tên công ty** | `13px` / `1.4` | `13.5px` / `1.45` | Chữ đậm 800, tối đa 3 dòng (`min-height: 56px`), cân xứng với logo to |
| **Mobile (`@media max-width: 640px`)** | Logo `65px`, title `12px` | Logo `76px`, title `margin-top: 16px` | Tối ưu hiển thị 2 cột trên điện thoại |

---

## 3. Các Tệp Triển Khai & Đồng Bộ

- **[css/home.css](file:///d:/master%20page/css/home.css#L960-L1015):** Cập nhật kích thước logo, text mark, margin-top tên công ty và mobile media query.
- **[public/css/home.css](file:///d:/master%20page/public/css/home.css#L960-L1015):** Đồng bộ 100% với file gốc.

---

## 4. Kết Quả Kiểm Thử (Verification)

Chạy kiểm thử tự động bằng Chrome DevTools Protocol (`scratch/verify_larger_logos.js`) tại `http://localhost:3000/index.html`:
- **Desktop (1440x1200):** 8/8 thẻ đạt kích thước logo computed `88px x 88px`, title margin-top `24px`, chiều cao thẻ `272px` chuẩn tỷ lệ vàng.
- **Mobile (390x844):** Logo đạt `76px x 76px`, title margin-top `16px`.
- **Ảnh nghiệm thu:** Lưu tại `scratch/companies_larger_logos_desktop.png`.
