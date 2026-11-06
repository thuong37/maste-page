---
name: mo-ta-man-hinh
description: Viết hoặc cập nhật file markdown mô tả một màn hình/trang của EasyCV (các khối, logic hiển thị, số lượng, chu kỳ) để giao cho agent khác triển khai. Dùng khi người dùng gọi /mo-ta-man-hinh, hoặc nói "mô tả màn hình", "viết tài liệu trang chủ/trang X", "xây dựng lại file mô tả trang".
---

# Mô tả màn hình cho agent khác triển khai

Mục tiêu: một file markdown nêu **sơ bộ các khối của trang và logic hiển thị**, đủ để agent khác hiểu cách triển khai. Không ghi kích thước, màu, khoảng cách (đã có `assets/design-tokens.css`, `docs/THUONG-HIEU-TRANG-CHU/brand-guidelines.md`).

## Bước 1 - thu thập từ CẢ HAI nguồn, không bỏ nguồn nào
1. **Đặc tả (đích đến):** link Google Sheet/tài liệu người dùng đưa. Thử `WebFetch` bản export CSV (`.../export?format=csv&gid=<gid>`), theo redirect nếu có. Nếu bị chặn hoặc chỉ ra tóm tắt, nói rõ cho người dùng và đề nghị dán nội dung hoặc cấp quyền. Không tự suy đoán phần thiếu.
2. **Sản phẩm đã dựng:** đọc file HTML/JS/CSS của trang trong project (thư mục gốc, **không** `public/`). Trang chủ: `index.html`, `js/home.js`, `css/home.css`. Tìm khối bằng `Grep` các marker `<section`, comment `VÙNG`, rồi đọc theo đoạn; các file rất lớn, không đọc hết một lần.
   - Lấy số thật: số thẻ, số cột/hàng, phân trang, chu kỳ `setInterval`, `slice(0, n)`, hằng số, key `localStorage`, điều kiện đổi theo đăng nhập (bỏ qua phần riêng cho mobile/giảm chuyển động). Đếm bằng `grep -c`, không ước chừng.
   - Kiểm tra khối ẩn (`hidden`, `display:none`) và khối chỉ có HTML tĩnh.

## Bước 2 - cấu trúc file (tiếng Việt)
Lưu ở `docs/THUONG-HIEU-TRANG-CHU/` (hoặc thư mục tài liệu phù hợp). Tên dạng `MO-TA-MAN-HINH-<TRANG>.md`. Không ghi đè file có sẵn của người khác; hỏi nếu trùng tên.

Bắt đầu thẳng từ tiêu đề rồi tới mục 1, không có khối mở đầu về trạng thái/nguồn/quy ước đọc.

1. **Tổng quan:** một câu nói trang gồm những gì, bảng thứ tự khối (số, tên khối). Không cột mã neo/class.
2. **Quy ước chung:** những hành vi người dùng thấy được (bố cục, cách lọc, cách giữ trạng thái).
3. **Từng khối:** thành phần, số lượng, cách xếp thứ tự, hành vi khi thao tác, trạng thái rỗng.
4. **Bảng số lượng** (tên gọi theo cách người dùng hiểu, vd "Lựa chọn trong menu sắp xếp", không viết tắt cộc lốc).
5. **Câu hỏi còn mở.**

## Quy tắc quan trọng
- **Không mô tả phiên bản điện thoại/màn hẹp/cảm ứng**: chỉ nêu bố cục và hành vi của màn hình máy tính, không có câu "trên điện thoại thì...", không nêu số cột theo từng độ rộng màn.
- **Tài liệu này do người mô tả viết, nhưng người dùng làm prototype để mình đọc và ghi lại.** Vì vậy chỉ nêu những gì người nhìn vào giao diện demo thấy hoặc thao tác được. Viết như một bản mô tả thông thường, người đọc bình thường hiểu được.
- **Tuyệt đối không nêu thông tin ẩn bên dưới:** tên class/mã neo (`#paginationWrapper`), tên file code, tên hàm, khóa `localStorage`, tên tham số URL, lệnh build/verify, mã dữ liệu nội bộ. Hỏi chính mình: "người dùng cần biết cái này để làm gì?"; nếu không thấy được trên giao diện thì bỏ.
- **Logic lấy theo đặc tả (Sheet và quyết định của người dùng); dữ liệu mẫu trong code chỉ là hiện trạng.** Không coi danh sách gõ cứng (từ khóa, công ty, mẫu CV...) là quy tắc. Ví dụ sai đã gặp: ghi "5 từ khóa cố định" cho khối xu hướng trong khi đặc tả là top 5 tìm nhiều nhất trong 60 ngày.
- **Không tách "Logic" và "Hiện trạng bản dựng", không có bảng đối chiếu, không nhắc demo đang làm sai/thiếu gì.** Viết thẳng cách màn hình phải hoạt động. Phần nguồn nói chưa rõ thì ghi vào Câu hỏi còn mở hoặc `[Cần xác nhận]`.
- Phần Sheet ghi "quản lý trong CMS" hay "thừa kế từ trang X" thì chỉ ghi đúng vậy (vd "Các bộ lọc nâng cao được quản lý trong hệ thống CMS"), không tự liệt kê chi tiết, không mô tả bộ lọc gõ cứng trong code.
- Không mô tả tính năng có trong code nhưng không có trên giao diện (mã chết).
- Phải có **số lượng cụ thể mỗi khối** (tối đa bao nhiêu thẻ, mấy cột, mấy giây, mấy trang). Đây là điều người dùng yêu cầu.
- Mô tả ngắn, theo khối; không dán mã, không liệt kê từng đối tượng nhỏ.
- Khi người dùng đưa quyết định mới, ghi thẳng thành quy tắc, không chú thích "đã chốt".
- Sau mỗi lần sửa file, đọc lại bằng `Read` trước khi sửa tiếp (file từng bị đổi trên đĩa).
- Mở đầu tin nhắn giao file nêu đối tượng đọc. Kết thúc nêu các chỗ cần người dùng chốt (nếu có), ngắn gọn.

## Mẫu tham chiếu
`docs/THUONG-HIEU-TRANG-CHU/MO-TA-MAN-HINH-TRA-CUU-VIEC-LAM.md` là bản mới nhất theo phong cách người dùng muốn (ngắn, chỉ thông tin nhìn thấy được). `MO-TA-MAN-HINH-TRANG-CHU.md` là bản cũ hơn; khi hai bản khác nhau về mức chi tiết, theo quy tắc ở trên.
