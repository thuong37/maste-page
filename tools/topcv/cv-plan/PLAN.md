# Kế hoạch tổng thể lấy mẫu CV TopCV

> File sinh tự động bởi `npm run topcv:plan -- status`. Không sửa tay.

Cập nhật: 11:05:17 19/10/2026  
Phiên hiện tại: **Đơn giản** — mỗi phiên chỉ một phong cách.  
Thư mục đích: `assets/cv-templates/<phong cách>/<tên mẫu>/<ngôn ngữ>/<phong cách>-<tên mẫu>-<ngôn ngữ>.pdf`

## Tổng quan theo phong cách

| Phong cách | Tổng job | Đã có PDF | Còn lại | Trạng thái |
|---|---:|---:|---:|---|
| Đơn giản | 64 | 59 | 5 | ▶ đang làm |
| Hiện đại | 21 | 16 | 5 | dở dang |
| Chuyên nghiệp | 57 | 41 | 16 | dở dang |
| Ấn tượng | 95 | 77 | 18 | dở dang |
| **Tổng** | **237** | **193** | **44** | |

## Worker — phiên "Đơn giản"

| Worker | Cổng | Giao | Xong | Lỗi | Đang chạy | Chờ |
|---|---:|---:|---:|---:|---|---:|
| W1 | 9301 | 29 | 27 | 2 | - | 0 |
| W2 | 9302 | 29 | 1 | 2 | - | 26 |
| W3 | 9303 | 1 | 1 | 0 | - | 0 |
| W4 | 9304 | 0 | 0 | 0 | - | 0 |

## Chi tiết từng job của phiên hiện tại

| Job | Worker | Trạng thái | Ghi chú |
|---|---|---|---|
| Tiêu chuẩn / Tiếng Việt | - | ✅ done |  |
| Tiêu chuẩn / Tiếng Anh | - | ✅ done |  |
| Tiêu chuẩn / Tiếng Nhật | W2 | ✅ done |  |
| Tiêu chuẩn / Tiếng Trung | W3 | ✅ done |  |
| Tiêu chuẩn (ít kinh nghiệm) / Tiếng Việt | - | ✅ done |  |
| Tiêu chuẩn (ít kinh nghiệm) / Tiếng Anh | W1 | ✅ done |  |
| Tiêu chuẩn (ít kinh nghiệm) / Tiếng Nhật | W1 | ✅ done |  |
| Tiêu chuẩn (ít kinh nghiệm) / Tiếng Trung | W1 | ✅ done |  |
| Thanh lịch / Tiếng Việt | W1 | ✅ done |  |
| Thanh lịch / Tiếng Anh | W1 | ✅ done |  |
| Thanh lịch / Tiếng Nhật | W1 | ✅ done |  |
| Thanh lịch / Tiếng Trung | W1 | ✅ done |  |
| Senior / Tiếng Việt | W1 | ✅ done |  |
| Senior / Tiếng Anh | W1 | ✅ done |  |
| Senior / Tiếng Trung | W1 | ✅ done |  |
| Hiện Đại 1 / Tiếng Việt | W1 | ✅ done |  |
| Hiện Đại 1 / Tiếng Anh | W1 | ✅ done |  |
| Hiện Đại 1 / Tiếng Nhật | W1 | ✅ done |  |
| Hiện Đại 1 / Tiếng Trung | W1 | ✅ done |  |
| Ấn tượng 4 / Tiếng Việt | W1 | ✅ done |  |
| Ấn tượng 4 / Tiếng Anh | W1 | ✅ done |  |
| Ấn tượng 4 / Tiếng Nhật | W1 | ✅ done |  |
| Ấn tượng 4 / Tiếng Trung | W1 | ✅ done |  |
| Chuyên gia / Tiếng Việt | W1 | ✅ done |  |
| Chuyên gia / Tiếng Anh | W1 | ✅ done |  |
| Chuyên gia / Tiếng Nhật | - | ✅ done |  |
| Chuyên gia / Tiếng Trung | - | ✅ done |  |
| Dòng Thời Gian / Tiếng Việt | W1 | ✅ done |  |
| Dòng Thời Gian / Tiếng Anh | W1 | ✅ done |  |
| Dòng Thời Gian / Tiếng Nhật | W1 | ✅ done |  |
| Dòng Thời Gian / Tiếng Trung | W1 | ✅ done |  |
| Hiện Đại 2 / Tiếng Việt | W1 | ✅ done |  |
| Hiện Đại 2 / Tiếng Anh | W1 | ✅ done |  |
| Hiện Đại 2 / Tiếng Trung | W1 | ✅ done |  |
| Kỹ Sư Phần Mềm / Tiếng Việt | W1 | ❌ failed | [topcv +88.1s] LỖI: %s Error: CV chưa được lưu (không vào được /save-cv-success) |
| Kỹ Sư Phần Mềm / Tiếng Anh | W1 | ❌ failed | [topcv +130.7s] LỖI: %s Error: CV chưa được lưu (không vào được /save-cv-success |
| Cổ Điển 1 / Tiếng Việt | W2 | ❌ failed | [topcv +89.4s] LỖI: %s Error: CV chưa được lưu (không vào được /save-cv-success) |
| Cổ Điển 1 / Tiếng Anh | W2 | ❌ failed | [topcv +85.2s] LỖI: %s Error: CV chưa được lưu (không vào được /save-cv-success) |
| Senior 2 / Tiếng Việt | W2 | ✅ done |  |
| Senior 2 / Tiếng Anh | W2 | ✅ done |  |
| Một Trang Cổ Điển / Tiếng Việt | W2 | ✅ done |  |
| Một Trang Cổ Điển / Tiếng Anh | W2 | ✅ done |  |
| Lập trình viên 2 / Tiếng Việt | W2 | ✅ done |  |
| Lập trình viên 2 / Tiếng Anh | W2 | ✅ done |  |
| Lập trình viên 2 / Tiếng Nhật | W2 | ✅ done |  |
| Màu sắc / Tiếng Việt | W2 | ✅ done |  |
| Màu sắc / Tiếng Anh | W2 | ✅ done |  |
| Màu sắc / Tiếng Nhật | W2 | ✅ done |  |
| Sinh Viên / Tiếng Việt | W2 | ⬜ pending |  |
| Sinh Viên / Tiếng Anh | W2 | ⬜ pending |  |
| Basic 2 / Tiếng Việt | W2 | ✅ done |  |
| Basic 2 / Tiếng Anh | W2 | ✅ done |  |
| Basic 2 / Tiếng Nhật | W2 | ✅ done |  |
| Ấn tượng 5 / Tiếng Việt | W2 | ✅ done |  |
| Ấn tượng 5 / Tiếng Anh | W2 | ✅ done |  |
| Ấn tượng 5 / Tiếng Nhật | W2 | ✅ done |  |
| Outstanding 2 / Tiếng Việt | W2 | ✅ done |  |
| Outstanding 2 / Tiếng Anh | W2 | ✅ done |  |
| Outstanding 2 / Tiếng Nhật | W2 | ✅ done |  |
| Lập Trình Viên / Tiếng Việt | W2 | ✅ done |  |
| Lập Trình Viên / Tiếng Anh | W2 | ✅ done |  |
| Fresher / Tiếng Việt | W2 | ⬜ pending |  |
| Fresher / Tiếng Anh | W2 | ⬜ pending |  |
| Fresher / Tiếng Nhật | W2 | ⬜ pending |  |
