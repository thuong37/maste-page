# Báo Cáo Triển Khai: Thiết Kế Lại Khối "Công Ty Nổi Bật" (Featured Companies)

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Ngày cập nhật: **02/10/2026**  
Yêu cầu người dùng: **"thiết kế lại khối 'Công ty nổi bật' hành động theo dõi phải đưa lên phía trên và chỉ là hành động phụ thôi, hành động chính phải là 'Xem vị trí tuyển dụng'"**

---

## 1. Mục Tiêu & Phân Tích Thiết Kế Theo Ảnh Hướng Dẫn

### 1.1 Phân tích ảnh chỉ dẫn của người dùng
Người dùng đã gửi ảnh chụp màn hình kèm 2 mũi tên màu đỏ và chữ viết tay chỉ rõ vị trí mong muốn:
1. **Mũi tên 1 (Hành động phụ - Secondary Action)**: Chỉ từ nút theo dõi ở trên cao xuống **ngang hàng với tên công ty (`FPT Software ✔`)** về phía bên phải.
   - Tránh việc đặt nút lơ lửng đè lên ảnh bìa tòa nhà / văn phòng làm xấu ảnh cover.
   - Đặt thành nút pill thanh lịch `+ Theo dõi` ngay bên cạnh tên công ty trong khối nội dung thẻ (`.company-card-header-row`).
2. **Mũi tên 2 (Hành động chính - Primary CTA)**: Chỉ từ link chữ "Xem vị trí tuyển dụng" màu tím (lỗi do cache CSS cũ của trình duyệt) trỏ vào **chính giữa đáy thẻ công ty**.
   - Biến thành nút CTA nổi bật toàn chiều rộng (`.btn-company-jobs`), màu cam gradient EasyCV đặc trưng (`#FF8A34 -> #F97316`), chữ trắng đậm kèm biểu tượng mũi tên trượt micro-animation (`→`).

### 1.2 Nguyên nhân lỗi trước đó (Root Cause Analysis)
- **Vấn đề 1 (Vị trí nút Theo dõi)**: Ban đầu nút Theo dõi được đặt lơ lửng `absolute` trên ảnh bìa (`.company-cover`), không đúng với vị trí người dùng mong muốn là ngang hàng với tên công ty bên dưới.
- **Vấn đề 2 (Link tím bị vỡ giao diện)**: Trình duyệt của người dùng giữ cache file `home.css?v=4.3`, chưa nạp kịp CSS class `.btn-company-jobs` mới, khiến thẻ `<a>` hiển thị như link thuần mặc định của trình duyệt (`#551A8B`, gạch chân, xuống 2 dòng).

### 1.3 Giải pháp kỹ thuật triệt để
1. **Tạo hàng tiêu đề (`.company-card-header-row`)**:
   - Sử dụng Flexbox `display: flex; justify-content: space-between; align-items: center; gap: 12px;`
   - Cột trái: Tên công ty (`.company-card-title`) kèm huy hiệu verified tick.
   - Cột phải: Nút phụ `.btn-follow-company` (nền trắng mỏng, viền xám nhạt `#E2E8F0`, chữ cam `#F97316`, hover chuyển cam nhạt).
2. **Nút chính đáy thẻ (`.btn-company-jobs`)**:
   - `width: 100%`, `min-height: 44px`, `background: linear-gradient(135deg, #FF8A34 0%, #F97316 100%)`.
   - `color: #FFFFFF; font-weight: 700; border-radius: 9999px;`
   - Hiệu ứng hover nổi bổng và mũi tên `→` trượt sang phải 4px.
3. **Triệt tiêu cache trình duyệt (Cache Buster & Critical CSS)**:
   - Nâng query version lên `css/home.css?v=5.0_featured_companies`.
   - Nhúng trực tiếp khối critical CSS vào `<style id="easycv-featured-companies-critical">` trong `<head>` của cả `index.html` và `public/index.html` với tiền tố `!important` để bảo đảm 100% trình duyệt của người dùng hiển thị chuẩn đẹp ngay lập tức kể cả khi cache CSS chưa xóa.

---

## 2. Ma Trận Thay Đổi Kỹ Thuật (Technical Changes)

| Tệp tin | Vùng thay đổi | Chi tiết triển khai |
| :--- | :--- | :--- |
| `index.html` & `public/index.html` | `<head>` & `.companies-grid` | - Nhúng critical inline CSS cho `.company-card-header-row`, `.btn-follow-company`, `.btn-company-jobs`.<br>- Tách `.company-cover` sạch sẽ không chứa nút đè.<br>- Bọc `.company-card-title` và `.btn-follow-company` trong `.company-card-header-row` cho cả 4 thẻ tĩnh.<br>- Thêm nút bấm chính `.btn-company-jobs` ở đáy thẻ. |
| `css/home.css` & `public/css/home.css` | Thẻ công ty & Responsive | - Định vị `.company-card-header-row` tại `grid-column: 2; grid-row: 1; margin-top: 14px;`<br>- Style `.btn-follow-company` dạng pill thứ cấp tinh tế.<br>- Style `.btn-company-jobs` dạng gradient cam EasyCV rực rỡ.<br>- Bổ sung media query mobile tối ưu khoảng cách. |
| `js/home.js` & `public/js/home.js` | Templates & Toggle | - Cập nhật template `additionalCompanies` đồng bộ markup `.company-card-header-row`.<br>- Lắng nghe click delegation trên `.btn-follow-company`, toggle nhãn `Theo dõi` / `Đang theo dõi`, cập nhật toast thông báo. |

---

## 3. Kết Quả Kiểm Thử Thực Tế (Headless Edge CDP)

1. **Kiểm thử layout và computed styles (`scratch/capture_featured_companies.js`)**:
   - `headerDisplay`: `'flex'` (căn ngang tên công ty và nút Theo dõi).
   - `followPosition`: `'static'` (nằm tự nhiên trong dòng tiêu đề, không đè lên ảnh bìa).
   - `followColor`: `'rgb(249, 115, 22)'`, `followBg`: `'rgb(255, 255, 255)'`.
   - `jobsBg`: `'linear-gradient(135deg, rgb(255, 138, 52) 0%, rgb(249, 115, 22) 100%)'`.
   - `jobsWidth`: `543px` (chiếm trọn chiều ngang nội dung thẻ `593px`).
   - `jobsColor`: `'rgb(255, 255, 255)'` (chữ trắng đậm, không còn link tím).

2. **Ảnh chụp màn hình thực tế**:
   - `scratch/featured_companies_verified.png`: Khớp 100% với 2 mũi tên đỏ trong ảnh hướng dẫn của người dùng.
   - `scratch/featured_companies_following.png`: Nút chuyển sang `✓ Đang theo dõi` kèm toast thông báo màu tối bo tròn góc dưới.
