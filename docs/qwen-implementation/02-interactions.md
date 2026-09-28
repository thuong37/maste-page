# 02 — Hành vi và trạng thái giao diện

Quy ước: **Có trong prototype** nghĩa là JS hiện chạy trên dữ liệu tĩnh. **Khi tích hợp** là hợp đồng UI mong muốn khi dự án đích có dịch vụ tương ứng. Không được thay thế phản hồi từ server bằng toast báo thành công.

| Mã | Trigger và trạng thái | Có trong prototype | Khi tích hợp |
|---|---|---|---|
| I01 | Khởi tạo header ứng viên | Không có DemoBar hoặc state switcher; thông báo, tin nhắn và menu tài khoản luôn hiển thị ở trạng thái đã đăng nhập | Lấy dữ liệu ứng viên từ auth/profile thật nhưng không dựng biến thể guest trong màn hình này; phiên hết hạn do auth guard toàn hệ thống xử lý |
| I02 | Mở menu header/tài khoản/thông báo/tin nhắn | Popover đóng khi click ngoài hoặc `Esc`; đánh dấu đã đọc chỉ thay DOM | Nối router và trạng thái thông báo/tin nhắn thật; đồng bộ số chưa đọc |
| I03 | Mở/đóng drawer mobile | Khóa cuộn body, đóng bằng overlay/nút/`Esc` | Giữ focus trong drawer khi mở và trả focus khi đóng |
| I04 | Theme | Không có nút đổi theme trong màn hình | Chỉ phản ánh theme từ hệ thống nếu dự án đích đã có theme store; không tự thêm control |
| I05 | Focus/click input tìm kiếm | Mở `.search-suggest-dropdown` với lịch sử, từ khóa phổ biến và việc làm đề xuất; không còn mega menu ngành trong popup | Gợi ý từ API nếu có; dùng debounce và trạng thái loading/empty/error |
| I06 | Nhập từ khóa + Enter/nút “Tìm việc ngay” | `executeSearch()` tạo query bằng `URLSearchParams` và điều hướng tới `/viec-lam`; `keyword` và `locations` chỉ xuất hiện khi có giá trị | Trang kết quả đọc URL để khởi tạo input/bộ lọc; nối API, phân trang và số kết quả thật; giữ query khi quay lại |
| I07 | Bấm tag xu hướng/từ khóa | Điền input; một số tag gọi tìm ngay | Giữ cùng một quy tắc tìm kiếm đã quyết định trong dự án đích; tag phải có tên query rõ |
| I08 | Lịch sử tìm kiếm | `localStorage` key `easycv_recent_searches_v2`; có xóa từng/tất cả | Chỉ lưu khi phù hợp chính sách sản phẩm; không lộ tìm kiếm tài khoản khác trên máy chung |
| I09 | Chọn địa điểm | Dialog mẫu chọn nhiều tỉnh/đơn vị cấp dưới; Áp dụng cập nhật trigger và select ẩn | Dùng mã địa bàn chuẩn từ nguồn dữ liệu thật; tách mode địa giới nếu hệ thống hỗ trợ; tìm kiếm phải thực sự lọc địa điểm |
| I10 | Pill ngành ở việc nổi bật | Lọc `data-category` trong card tĩnh | Gửi category code tới nguồn việc làm; hiển thị số kết quả/empty |
| I11 | Tab việc phù hợp | Lọc `data-match-type` trong card tĩnh | Dữ liệu match do backend cung cấp; không tự tính % phù hợp trên frontend |
| I12 | Bookmark việc / theo dõi công ty | Đổi class và toast, mất khi tải lại | Yêu cầu đăng nhập nếu cần; gọi API; rollback trạng thái khi lỗi; hiển thị trạng thái đang xử lý |
| I13 | Banner Orion, dải đối tác, khóa học | Auto chuyển; Orion và khóa học 5 giây, đối tác 4 giây; dừng khi hover/focus/reduced motion | Giữ điều khiển thủ công và dữ liệu/ảnh từ CMS hoặc fixture được duyệt |
| I14 | Liên kết footer | Prototype còn dùng nhiều `href="#..."`; không có form đăng ký nhận tin | Ánh xạ theo ma trận footer: route nội bộ, URL cổng nhà tuyển dụng, `tel:`, `mailto:`, bản đồ, app store và social chính thức; mục chưa có đích hợp lệ hiển thị dạng văn bản hoặc ghi dependency |
| I15 | Đăng ký sự kiện/VIP | Một số CTA chỉ hiện toast thành công giả | Mở flow thật nếu đã có; nếu chưa có, ghi rõ là demo hoặc vô hiệu hóa có giải thích |
| I16 | Nút AI nổi | Mở/đóng popover mẫu | Không mô tả là AI chạy thật trước khi có API và quy tắc xử lý dữ liệu hồ sơ |
| I17 | Phân trang Công ty nổi bật | 4 card/trang theo bố cục 2 cột × 2 hàng; tự chuyển vòng sau 5 giây; hiển thị `Trang hiện tại/tổng số trang`, chấm trang và nút trước/sau; dừng khi hover/focus, tab ẩn hoặc reduced motion | Backend/CMS chỉ cấp doanh nghiệp có gói hiển thị còn hiệu lực và thứ tự theo cấu hình gói; không diễn giải danh sách là xếp hạng chất lượng |
| I18 | Lọc/chọn mẫu CV | Chọn một trong 6 filter `all | simple | professional | modern | impressive | ats`; carousel chỉ chuyển thủ công; click card đi tới `/tao-cv/chinh-sua?templateId={templateId}`; “Xem tất cả” đi tới `/tao-cv` | Lấy `CvTemplate` từ API/fixture được duyệt, giữ filter khi loading/error; auth guard phải giữ `returnUrl`; ánh xạ route theo router thật |

## Máy trạng thái tối thiểu

```text
Search = idle | suggestOpen | submitting | results | empty | error
LocationPicker = closed | open(draftSelection) -> apply(committedSelection) | dismiss
Bookmark/Follow = off | pendingOn | on | pendingOff | error
RemoteSection = loading | ready(data) | empty | error
CvTemplateFilter = all | simple | professional | modern | impressive | ats
Overlay = closed | open(trigger) ; Escape/outsideClick -> closed + restoreFocus
```

## Các sai lệch prototype cần xử lý chủ ý

1. Repository này chưa có màn hình `/viec-lam`; prototype chỉ chịu trách nhiệm chuyển `keyword` và `locations` qua URL. Dự án đích phải ánh xạ route và dùng các query này để lọc kết quả thật.
2. Pill ngành và tab matching vẫn ghi đè `style.display` trên card tĩnh. Khi port, giữ bộ lọc trang kết quả trong một state chung; search trang chủ chỉ chuyển input qua URL.
3. Bookmark, theo dõi, thông báo đã đọc, đăng ký sự kiện và VIP chưa lưu phía server.
4. Nhiều `href="#..."` là placeholder; không có trang đích thật trong repository này.
5. Danh sách địa điểm trong `js/location-picker.js` chỉ gồm một số địa phương và không phải dữ liệu hành chính đầy đủ.
6. Các chỉ số AI/match, tổng số việc làm, mức ưu đãi và đếm người tham gia trong HTML là nội dung mẫu.

## Luồng kiểm thử hành vi

1. Header và drawer chỉ hiển thị biến thể ứng viên đã đăng nhập; không có DemoBar, nút đổi trạng thái, “Đăng nhập” hoặc “Đăng ký”.
2. Nhập từ khóa, chọn một/nhiều địa điểm, sau đó click CTA hoặc nhấn `Enter`; xác minh route `/viec-lam` và query `keyword`, `locations` được encode/khôi phục chính xác. Kiểm tra thêm xóa từ khóa, click tag, mở/đóng gợi ý và lịch sử tìm kiếm.
3. Chọn nhiều địa điểm, bỏ chọn, đổi mode, Áp dụng, đóng bằng `Esc`; URL/query phản ánh bộ lọc nếu đã tích hợp.
4. Lọc ngành rồi tìm từ khóa; đổi tab match; trạng thái kết hợp vẫn đúng.
5. Bookmark/follow thành công và lỗi API; tải lại trang giữ dữ liệu thật.
6. Carousel điều khiển bằng nút/chấm; dừng khi focus, tab ẩn hoặc reduced motion.
7. Mobile 360px, tablet 768px, desktop 1440px: không tràn ngang; drawer và picker dùng được bằng bàn phím.
8. Chọn lần lượt 6 phong cách CV; kiểm tra danh sách/empty state, trạng thái `aria-pressed`, nút trước/sau và không có auto-play. Click từng card phải chuyển đúng `templateId`; “Xem tất cả” chỉ mở `/tao-cv`.
