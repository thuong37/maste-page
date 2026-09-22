# Bộ tài liệu triển khai giao diện EasyCV cho Qwen

**Phạm vi:** Trang chủ ứng viên hiện có trong thư mục này, tại `index.html`. Tài liệu được lập từ mã nguồn ngày 22/09/2026. Đây là đặc tả để Qwen chuyển giao diện mẫu vào dự án đích; chưa phải đặc tả toàn bộ sàn tuyển dụng.

## Thứ tự đọc bắt buộc

1. `01-screen-spec.md` — bố cục, thành phần, nội dung và responsive.
2. `02-interactions.md` — sự kiện, trạng thái, hành vi hiện có và hành vi cần tích hợp.
3. `03-integration-contract.md` — dữ liệu, API đề xuất, ranh giới prototype và tiêu chí nghiệm thu.
4. `04-qwen-task.md` — lệnh giao việc có thể sao chép cho Qwen.

## Nguồn sự thật và thứ tự ưu tiên

1. Mã chạy thực tế: `index.html`, `css/*.css`, `js/*.js`, `assets/*`.
2. Bộ tài liệu này cho phạm vi trang chủ ứng viên.
3. `assets/design-tokens.css`, `assets/design-tokens.json`, `design-system/easycv/MASTER.md`, `docs/brand-guidelines.md` cho định hướng thương hiệu.

Khi tài liệu thương hiệu mô tả một màu hoặc thành phần khác giao diện đang chạy, Qwen phải giữ giao diện hiện tại khi tái dựng trang này và báo rõ chỗ khác biệt. Ví dụ: `css/location-picker.css` dùng xanh lá ở trạng thái chọn, trong khi màu CTA thương hiệu là cam. Không tự đổi toàn bộ sang cam.

## Cấu trúc nguồn tham chiếu

| Nguồn | Vai trò |
|---|---|
| `index.html` | Cấu trúc DOM, chữ hiển thị, dữ liệu mẫu và khối CSS inline lớn có thể ghi đè CSS ngoài |
| `css/navbar.css` | Header, menu, hero, ô tìm kiếm, banner đối tác, responsive |
| `css/home.css` | Các section bên dưới hero, card, footer, widget |
| `css/location-picker.css` | Bộ chọn địa điểm |
| `js/navbar.js` | Menu, popover, drawer, chuyển trạng thái demo, dark mode |
| `js/home.js` | Tìm kiếm, lọc, bookmark, theo dõi, carousel, toast |
| `js/location-picker.js` | Chọn địa điểm mẫu |
| `js/spotlight-rotation.js`, `js/partner-cards.js` | Banner và dải đối tác tự chuyển |
| `assets/`, `public/assets/` | Logo, banner và token; chọn đường dẫn theo cơ chế public của dự án đích |

`public/index.html`, `public/css`, `public/js` là bản sao phục vụ deploy; đối chiếu với bản gốc trước khi đồng bộ. Không sửa một bản rồi giả định bản kia tự cập nhật.

## Quy tắc cho Qwen

- Dùng stack, router, component và convention đang có trong **dự án đích**. Không tự khởi tạo framework mới nếu dự án đã có stack.
- Giữ tiếng Việt, dấu, thứ tự section, logo và banner hiện có. Nội dung mẫu chỉ là fixture, không được coi là dữ liệu thật.
- Không sao chép các số liệu marketing mẫu thành kết quả API hoặc tuyên bố đã kiểm chứng.
- Mọi liên kết `href="#..."` không có đích thật phải được ánh xạ sang route thực tế hoặc biểu diễn là hành động chưa sẵn sàng; không báo thành công giả.
- Chỉ triển khai trang chủ ứng viên cùng các thành phần cần thiết cho trang này. Trang chi tiết việc làm, CV builder, đăng nhập, thanh toán, AI matching thật và backend cần yêu cầu riêng nếu dự án chưa có.
- Mỗi vòng triển khai hãy báo file đã sửa, hành vi đã nối dữ liệu, phần còn dùng fixture và cách đã kiểm tra.
