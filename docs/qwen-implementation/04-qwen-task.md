# 04 — Lệnh triển khai cho Qwen

Sao chép nội dung dưới đây vào task của Qwen sau khi đặt bộ tài liệu và mã nguồn tham chiếu trong workspace mà Qwen truy cập được.

```text
Bạn là kỹ sư frontend triển khai trang chủ ứng viên EasyCV vào dự án hiện tại.

Đọc theo thứ tự:
1. docs/qwen-implementation/README.md
2. docs/qwen-implementation/01-screen-spec.md
3. docs/qwen-implementation/02-interactions.md
4. docs/qwen-implementation/03-integration-contract.md
5. Mã tham chiếu: index.html, css/navbar.css, css/home.css,
   css/location-picker.css, js/navbar.js, js/home.js,
   js/location-picker.js, js/spotlight-rotation.js,
   js/partner-cards.js, assets/design-tokens.css.

Nhiệm vụ:
- Khảo sát stack, router, auth, API client, design system và lệnh build/test của dự án hiện tại.
- Dựng đúng thứ tự H01–H13, giữ nội dung tiếng Việt và asset thương hiệu hiện có.
- Chuyển các hành vi trong tài liệu 02 sang state có kiểm soát; tránh nhiều bộ lọc ghi đè DOM trực tiếp.
- Ánh xạ dữ liệu theo tài liệu 03 tới service đang có. Nếu thiếu API, dùng fixture có nhãn demo và báo rõ phần chưa tích hợp; không báo thành công giả cho thao tác ghi.
- Thực hiện responsive, bàn phím, focus, empty/loading/error và reduced motion.
- Chạy kiểm tra/build phù hợp dự án. Hoàn thành bằng báo cáo: file thay đổi, màn hình/hành vi đã làm, API đã nối, fixture còn lại, route thiếu, kết quả kiểm tra.

Không mở rộng sang backend, trang chi tiết hoặc module khác khi chưa cần cho trang chủ này.
Nếu tài liệu mâu thuẫn với mã nguồn đang chạy, giữ hành vi giao diện nguồn và ghi lại mâu thuẫn; nếu dự án đích có quy tắc bắt buộc, tuân theo quy tắc dự án đích.
```
