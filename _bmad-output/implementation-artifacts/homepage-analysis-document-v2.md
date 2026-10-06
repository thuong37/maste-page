# Báo cáo cập nhật tài liệu phân tích Trang chủ EasyCV v2.0

**Ngày:** 06/10/2026
**Phạm vi:** `docs/PHAN-TICH-TRANG-CHU-EASYCV.md`
**Loại thay đổi:** Viết lại tài liệu as-is; không sửa mã chạy của sản phẩm

## 1. Quyết định

Viết lại toàn bộ tài liệu trang chủ theo trạng thái mã nguồn hiện hành, thay vì tiếp tục vá bản 1.6 đã lệch sau nhiều thay đổi. Tài liệu mới vẫn đối soát trực tiếp với PRD, nhưng phân biệt rõ:

1. Yêu cầu nền từ PRD.
2. Quyết định mới đã được triển khai và nghiệm thu.
3. Fixture, route giả và nợ kỹ thuật chưa được coi là production.

## 2. Ma trận thay đổi

| Vấn đề của bản cũ | Bằng chứng hiện hành | Cách xử lý trong v2.0 |
|---|---|---|
| Còn mô tả hero title nhìn thấy | `index.html` chỉ giữ H1 `.sr-only` | Ghi rõ hero title đã gỡ |
| Cấu trúc hero/banner đã cũ | Bento 1 slider chính + 2 banner phụ | Viết lại H02/H03 |
| Search chưa phản ánh popup mới | `js/home.js` dựng popup hai cột, typing mode và 5 recommended jobs | Bổ sung state, history key và căn popup |
| Category vẫn bị hiểu là mega-menu trong search popup | Category modal là overlay riêng, neo dưới search | Tách contract modal, backdrop trong suốt/no blur |
| Còn khối lương cao trong IA | Section hiện hidden/aria-hidden/display none | Chuyển thành H04-Legacy, cấm tự khôi phục |
| Chưa phản ánh logo/card mới | Job logo 65px; company logo 88px/76px | Cập nhật design contract |
| Company/CV chưa phản ánh carousel liên tục | Controller auto-step 2 giây, pause/reduced motion | Cập nhật H05/H08 |
| Còn mô tả matching tabs | Tab đã bị loại bỏ | Ghi rõ danh sách hiển thị trực tiếp |
| Còn khóa học/sự kiện | Markup đã loại khỏi trang chủ | Loại khỏi IA và ghi vào danh sách khối đã gỡ |
| Thiếu ranh giới prototype/production | Nhiều anchor, fixture, toast giả lập | Thêm nợ kỹ thuật, route/data warning và Qwen contract |

## 3. Kết quả kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| File Markdown được tạo lại bằng UTF-8 | PASS |
| Cấu trúc heading và code fence đầy đủ | PASS |
| Đối soát số liệu nguồn: company 8, matching job 6, CV 8, category 8, keyword 12 | PASS |
| Đối soát featured jobs | PASS: 9 card, gồm 8 card thường và 1 card sponsored |
| Có PRD reconciliation và current-state IA | PASS |
| Có acceptance criteria và contract riêng cho Qwen 3.8 27B | PASS |
| `git diff --check` sau khi loại trailing whitespace | PASS |

## 4. Tệp tác động

- `docs/PHAN-TICH-TRANG-CHU-EASYCV.md`: viết lại thành phiên bản 2.0.
- `_bmad-output/implementation-artifacts/homepage-analysis-document-v2.md`: báo cáo thay đổi và kiểm tra.
- `_bmad-output/planning-artifacts/.memlog.md`: nhật ký quyết định, thao tác và xác minh.

Không thay đổi `index.html`, CSS, JavaScript hoặc bản mirror `public/`.
