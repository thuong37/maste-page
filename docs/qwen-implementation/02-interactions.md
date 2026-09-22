# 02 — Hành vi và trạng thái giao diện

Quy ước: **Có trong prototype** nghĩa là JS hiện chạy trên dữ liệu tĩnh. **Khi tích hợp** là hợp đồng UI mong muốn khi dự án đích có dịch vụ tương ứng. Không được thay thế phản hồi từ server bằng toast báo thành công.

| Mã | Trigger và trạng thái | Có trong prototype | Khi tích hợp |
|---|---|---|---|
| I01 | Chọn logged in/guest trên thanh demo | `js/navbar.js` bật/ẩn menu tài khoản và icon; mặc định logged in | Lấy trạng thái từ auth thực; bỏ thanh demo khỏi bản production nếu không có yêu cầu giữ |
| I02 | Mở menu header/tài khoản/thông báo/tin nhắn | Popover đóng khi click ngoài hoặc `Esc`; đánh dấu đã đọc chỉ thay DOM | Nối router và trạng thái thông báo/tin nhắn thật; đồng bộ số chưa đọc |
| I03 | Mở/đóng drawer mobile | Khóa cuộn body, đóng bằng overlay/nút/`Esc` | Giữ focus trong drawer khi mở và trả focus khi đóng |
| I04 | Bật dark mode | Đổi `data-theme` tại `html`, không lưu | Nối theme store của dự án nếu có |
| I05 | Focus/click input tìm kiếm | Mở `.search-suggest-dropdown` với lịch sử và mega menu ngành | Gợi ý từ API nếu có; dùng debounce và trạng thái loading/empty/error |
| I06 | Nhập từ khóa + Enter/nút tìm | `executeSearch()` lọc text toàn bộ `.job-card, .attractive-card`, toast và cuộn tới việc nổi bật | Gửi query và bộ lọc tới trang kết quả/API; đồng bộ URL, phân trang và số kết quả thật |
| I07 | Bấm tag xu hướng/từ khóa | Điền input; một số tag gọi tìm ngay | Giữ cùng một quy tắc tìm kiếm đã quyết định trong dự án đích; tag phải có tên query rõ |
| I08 | Lịch sử tìm kiếm | `localStorage` key `easycv_recent_searches_v2`; có xóa từng/tất cả | Chỉ lưu khi phù hợp chính sách sản phẩm; không lộ tìm kiếm tài khoản khác trên máy chung |
| I09 | Chọn địa điểm | Dialog mẫu chọn nhiều tỉnh/đơn vị cấp dưới; Áp dụng cập nhật trigger và select ẩn | Dùng mã địa bàn chuẩn từ nguồn dữ liệu thật; tách mode địa giới nếu hệ thống hỗ trợ; tìm kiếm phải thực sự lọc địa điểm |
| I10 | Pill ngành ở việc nổi bật | Lọc `data-category` trong card tĩnh | Gửi category code tới nguồn việc làm; hiển thị số kết quả/empty |
| I11 | Tab việc phù hợp | Lọc `data-match-type` trong card tĩnh | Dữ liệu match do backend cung cấp; không tự tính % phù hợp trên frontend |
| I12 | Bookmark việc / theo dõi công ty | Đổi class và toast, mất khi tải lại | Yêu cầu đăng nhập nếu cần; gọi API; rollback trạng thái khi lỗi; hiển thị trạng thái đang xử lý |
| I13 | Banner Orion, dải đối tác, khóa học | Auto chuyển; Orion và khóa học 5 giây, đối tác 4 giây; dừng khi hover/focus/reduced motion | Giữ điều khiển thủ công và dữ liệu/ảnh từ CMS hoặc fixture được duyệt |
| I14 | Form email footer | Validate `type=email`, toast thành công giả và xóa input | Chỉ báo thành công sau khi API chấp nhận; xử lý trùng email/lỗi mạng |
| I15 | Đăng ký sự kiện/VIP | Một số CTA chỉ hiện toast thành công giả | Mở flow thật nếu đã có; nếu chưa có, ghi rõ là demo hoặc vô hiệu hóa có giải thích |
| I16 | Nút AI nổi | Mở/đóng popover mẫu | Không mô tả là AI chạy thật trước khi có API và quy tắc xử lý dữ liệu hồ sơ |

## Máy trạng thái tối thiểu

```text
Search = idle | suggestOpen | submitting | results | empty | error
LocationPicker = closed | open(draftSelection) -> apply(committedSelection) | dismiss
Bookmark/Follow = off | pendingOn | on | pendingOff | error
RemoteSection = loading | ready(data) | empty | error
Overlay = closed | open(trigger) ; Escape/outsideClick -> closed + restoreFocus
```

## Các sai lệch prototype cần xử lý chủ ý

1. Search hiện chỉ lọc chữ trong card, còn `location` chỉ được đưa vào toast; địa điểm **chưa tác động kết quả**.
2. Pill ngành, tab matching và search đều ghi đè `style.display` trên card. Khi port, giữ bộ lọc trong một state chung để tránh bộ lọc sau xóa tác dụng bộ lọc trước.
3. Bookmark, theo dõi, thông báo đã đọc, đăng ký email/sự kiện và VIP chưa lưu phía server.
4. Nhiều `href="#..."` là placeholder; không có trang đích thật trong repository này.
5. Danh sách địa điểm trong `js/location-picker.js` chỉ gồm một số địa phương và không phải dữ liệu hành chính đầy đủ.
6. Các chỉ số AI/match, tổng số việc làm, mức ưu đãi và đếm người tham gia trong HTML là nội dung mẫu.

## Luồng kiểm thử hành vi

1. Guest/đã đăng nhập: header và drawer hiện đúng mục; các nút cần auth dẫn tới flow đăng nhập thật.
2. Tìm từ khóa có/không có kết quả; xóa từ khóa; click tag; `Enter`; mở/đóng gợi ý; lịch sử tìm kiếm.
3. Chọn nhiều địa điểm, bỏ chọn, đổi mode, Áp dụng, đóng bằng `Esc`; URL/query phản ánh bộ lọc nếu đã tích hợp.
4. Lọc ngành rồi tìm từ khóa; đổi tab match; trạng thái kết hợp vẫn đúng.
5. Bookmark/follow thành công và lỗi API; tải lại trang giữ dữ liệu thật.
6. Carousel điều khiển bằng nút/chấm; dừng khi focus, tab ẩn hoặc reduced motion.
7. Mobile 360px, tablet 768px, desktop 1440px: không tràn ngang; drawer và picker dùng được bằng bàn phím.
