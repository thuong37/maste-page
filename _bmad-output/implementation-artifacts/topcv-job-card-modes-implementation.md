# Báo Cáo Kỹ Thuật: Thiết Kế Thẻ Việc Làm Chuẩn Mẫu TopCV (Chế Độ Chưa Hover & Đã Hover)

- **Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình**: [Danh sách việc làm](file:///d:/master%20page/viec-lam.html)
- **Ngày thực hiện**: 05/10/2026
- **Tài liệu tham khảo**: Hình ảnh mẫu unhovered (`media_1791171197399.png`) và hovered (`media_1791171205492.png`).

---

## 1. Yêu Cầu & Đặc Tả Thiết Kế

### 1.1. Chế độ CHƯA HOVER (Unhovered Mode)

- **Góc trên bên phải**:
  - Mức lương màu xanh lá đậm (`#00B14F`), font-weight 700 (ví dụ: `Từ 40 triệu` / `30 – 50 triệu`).
  - **Không có bất kỳ nút nào phía dưới mức lương**.
- **Cấu trúc nội dung thân thẻ**:
  - Logo công ty: Khung vuông bo tròn 12px, nền trắng, viền xám tinh tế `#E5E7EB`.
  - Tên việc làm: Chữ đen slate `#0F172A`, font-weight 700, font-size 16px.
  - Tên doanh nghiệp: Chữ in hoa màu xám `#64748B`, font-weight 600, kèm huy hiệu xác thực xanh dương `#0284C7`.
  - Quick pills: Pills màu xám nhẹ `#F1F5F9` hiển thị Địa điểm (ví dụ: `Hà Nội`, `Hồ Chí Minh`) và Kinh nghiệm (ví dụ: `2 năm`, `3 – 5 năm`).
- **Đường kẻ phân cách**:
  - Vạch ngang mỏng `#F1F5F9` ngăn cách thân thẻ và chân thẻ.
- **Chân thẻ**:
  - **Bên trái**: Dòng text tóm tắt kỹ năng chuyên môn: `${Kinh nghiệm} chuyên môn | ${Kỹ năng chính} | +${Số kỹ năng còn lại}`.
  - **Bên phải**:
    - Thời gian đăng tin (ví dụ: `Đăng 2 giờ trước`, `Đăng hôm nay`).
    - Huy hiệu `Đã xem` (nền xám nhẹ `#F1F5F9`, chữ xám `#64748B`, font 11.5px).
    - Nút Lưu hình trái tim tròn 32x32px, viền xanh lá `#00B14F`, icon trái tim xanh lá `#00B14F`.

---

### 1.2. Chế độ ĐÃ HOVER (Hovered Mode)

- **Hiệu ứng thẻ**:
  - Viền thẻ chuyển sang màu xanh lá `#00B14F` với quầng đổ bóng nhẹ `0 6px 20px rgba(0, 177, 79, 0.1)`.
  - Tiêu đề việc làm chuyển sang màu xanh lá `#00B14F`.
- **Góc trên bên phải**:
  - Mức lương giữ nguyên vị trí.
  - Ngay phía dưới mức lương xuất hiện nút **"Xem nhanh »"** (`.btn-quick-view`): nền xanh pastel `#E6F7ED`, chữ và icon xanh lá `#00B14F`, bo tròn con nhộng pill.
- **Chân thẻ bên phải**:
  - Thời gian đăng và huy hiệu `Đã xem` tự động ẩn đi.
  - Thay thế bằng cụm 3 nút hành động:
    1. **Nút "Ứng tuyển"** (`.btn-card-apply`): Nền xanh lá `#00B14F`, chữ trắng bold, bo tròn pill, đổ bóng nổi bật.
    2. **Nút "Ẩn việc làm"** (`.btn-card-hide`): Hình tròn 32x32px viền `#CBD5E1`, nền trắng, icon mắt gạch chéo màu xám.
    3. **Nút "Lưu"** (`.btn-card-bookmark`): Giữ nguyên vị trí ngoài cùng góc phải.

---

## 2. Danh Sách Tệp Triển Khai & Đồng Bộ

| STT | Đường Dẫn Tệp                                                               | Mô Tả Thay Đổi                                                           |
| --- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | [css/viec-lam.css](file:///d:/master%20page/css/viec-lam.css)               | Xây dựng bộ quy tắc CSS TopCV card, transition hover/unhover             |
| 2   | [public/css/viec-lam.css](file:///d:/master%20page/public/css/viec-lam.css) | Đồng bộ bản build production                                             |
| 3   | [js/viec-lam.js](file:///d:/master%20page/js/viec-lam.js)                   | Render DOM 2 chế độ trong `renderCurrentPage()`, gán event listeners     |
| 4   | [public/js/viec-lam.js](file:///d:/master%20page/public/js/viec-lam.js)     | Đồng bộ bản build production                                             |
| 5   | [viec-lam.html](file:///d:/master%20page/viec-lam.html)                     | Chuyển đổi 25 thẻ job tĩnh, cập nhật critical CSS & cache buster `v12.0` |
| 6   | [public/viec-lam.html](file:///d:/master%20page/public/viec-lam.html)       | Đồng bộ bản build production                                             |

---

## 3. Kết Quả Kiểm Thử (Verification)

1. **Kiểm thử trực quan (Visual Fidelity Test)**:
   - Chế độ chưa hover: `scratch/live_card_unhovered.png` đạt chuẩn 100%.
   - Chế độ đã hover: `scratch/live_card_hovered.png` đạt chuẩn 100%.
   - Thẻ kép đối chiếu trực tiếp: `scratch/final_two_cards_modes.png` chứng minh chuyển đổi mượt mà giữa 2 trạng thái.

2. **Kiểm thử tương tác người dùng**:
   - `btn-quick-view`: Mở chi tiết việc làm hoặc kích hoạt Split View.
   - `btn-card-hide`: Hiệu ứng mờ dần (fade out 0.3s) và ẩn thẻ kèm Toast `Đã ẩn việc làm này khỏi danh sách gợi ý`.
   - `btn-card-apply`: Bật Toast `Ứng tuyển thành công vị trí ...! Nhà tuyển dụng sẽ phản hồi sớm.`
   - `btn-card-bookmark`: Toggle trạng thái Lưu, đồng bộ `localStorage` và đổi icon trái tim filled/outline.
