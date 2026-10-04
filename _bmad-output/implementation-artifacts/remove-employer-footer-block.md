# Tài Liệu Kỹ Thuật: Loại Bỏ Khối "Nhà Tuyển Dụng" Khỏi Chân Trang (Footer)

## 1. Yêu Cầu Của Người Dùng
- **Nội dung yêu cầu:** *"ở footer của trang bỏ khối cho nhà tuyển dụng đi"*.
- **Mục tiêu:** Loại bỏ hoàn toàn cột/khối liên kết "Nhà tuyển dụng" trong chân trang (site footer) của nền tảng, tái cân bằng bố cục 4 cột tinh tế, chuẩn nhận diện thương hiệu EasyCV.

---

## 2. Phân Tích & Giải Pháp Kỹ Thuật

### 2.1. Phân tích hiện trạng
- Trước khi thực hiện, footer tại `index.html` và `public/index.html` đang có cấu trúc 5 cột (`.footer-main-grid` với `grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;`):
  1. Cột 1: Thông tin thương hiệu EasyCV (`.footer-col-brand`)
  2. Cột 2: Về EasyCV (`Về EasyCV`)
  3. Cột 3: Dành cho Ứng viên (`Dành cho Ứng viên`)
  4. Cột 4: Khối Nhà tuyển dụng (`Nhà tuyển dụng` - gồm các liên kết Đăng tin tuyển dụng, Tìm hồ sơ, EasyCV ATS, Headhunt...)
  5. Cột 5: Liên hệ & Trụ sở, Tải ứng dụng Mobile (`Liên hệ & Trụ sở`)
- Trên các trang con khác như `viec-lam.html` và `chi-tiet-viec-lam.html`, footer vốn đã chỉ có 2 khối rút gọn ("Về EasyCV" và "Dành cho Ứng viên") và không chứa khối "Nhà tuyển dụng".

### 2.2. Giải pháp thực hiện
1. **HTML Markup (`index.html` & `public/index.html`):**
   - Xóa bỏ hoàn toàn khối `<div><h4 class="footer-col-title">Nhà tuyển dụng</h4>...</div>`.
   - Cập nhật ghi chú layout từ `Main Footer 5 Columns` thành `Main Footer 4 Columns`.
   - Bổ sung định danh class `.footer-col-contact` cho Cột 4 (Liên hệ & Trụ sở) để dễ dàng kiểm soát responsive.

2. **CSS Layout (`css/home.css` & `public/css/home.css`):**
   - Tinh chỉnh `.footer-main-grid` từ 5 cột sang 4 cột:
     ```css
     .footer-main-grid {
       display: grid;
       grid-template-columns: 2fr 1fr 1fr 1.5fr;
       gap: 40px;
       padding-bottom: 48px;
       border-bottom: 1px solid #1E293B;
     }
     ```
   - **Tỷ lệ hiển thị Desktop:**
     - Cột Brand: ~36% (đủ rộng rãi cho giới thiệu, giấy phép & 2 huy hiệu Bộ Công Thương + ISO 27001).
     - 2 Cột liên kết (Về EasyCV & Dành cho Ứng viên): ~18% mỗi cột.
     - Cột Liên hệ & Tải App: ~27% (vừa vặn cho 2 nút tải ứng dụng App Store & Google Play nằm cạnh nhau không bị vỡ dòng).
   - **Responsive Tablet (`@media (max-width: 1024px)`):**
     - Đặt `.footer-col-contact { grid-column: span 2; }` để khối liên hệ & tải app dàn đều thẩm mỹ ở hàng dưới, không để lại ô trống khập khiễng.
   - **Responsive Mobile (`@media (max-width: 640px)`):**
     - Đặt `grid-template-columns: 1fr;` và `.footer-col-contact { grid-column: span 1; }` để các cột xếp chồng thẳng hàng tự nhiên.

---

## 3. Danh Sách Tệp Đã Chỉnh Sửa

| Tệp | Bản sao đồng bộ | Nội dung thay đổi |
|---|---|---|
| `index.html` | `public/index.html` | Xóa khối HTML "Nhà tuyển dụng", thêm class `.footer-col-contact` cho cột liên hệ |
| `css/home.css` | `public/css/home.css` | Chuyển `grid-template-columns` sang 4 cột (`2fr 1fr 1fr 1.5fr`), hỗ trợ responsive tablet và mobile |

---

## 4. Kết Quả Kiểm Thử (Verification)

Chạy kịch bản tự động Node.js tương tác Chrome Headless CDP (`scratch/verify_footer.js`) trên máy chủ localhost:3000:

```json
{
  "titles": [
    "Về EasyCV",
    "Dành cho Ứng viên",
    "Liên hệ & Trụ sở"
  ],
  "gridCols": "396.359px 198.172px 198.188px 297.281px",
  "numCols": 4,
  "hasNhaTuyenDung": false
}
```

- **Tiêu đề cột còn lại:** Chỉ còn 3 nhóm tiêu đề chuẩn ("Về EasyCV", "Dành cho Ứng viên", "Liên hệ & Trụ sở").
- **Số cột DOM:** 4 cột (gồm cả cột thương hiệu `.footer-col-brand`).
- **Khối Nhà tuyển dụng:** Đã loại bỏ hoàn toàn (`hasNhaTuyenDung: false`).
- **Phân bổ kích thước pixel:** 396px (Brand) - 198px (Về EasyCV) - 198px (Ứng viên) - 297px (Liên hệ & Tải app).
- **Ảnh nghiệm thu visual:** Đã chụp và kiểm tra trực quan tại `scratch/footer_after_removal.png`, đảm bảo thẩm mỹ cân đối, typography sắc nét và không phát sinh lỗi tràn khung.
