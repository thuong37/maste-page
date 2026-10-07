# Đồng bộ trang Chi tiết việc làm với trang Việc làm

Ngày: 2026-10-07 · Trang: `chi-tiet-viec-lam.html` ↔ `viec-lam.html`

## Ma trận lệch & giải pháp

| #   | Điểm lệch                                                                                             | Giải pháp                                                                                                                                                                                        | File                                                                     |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1   | Trang chi tiết vẫn hiện badge `🎯 xx% Match` (hero + list), trang list đã ẩn                          | Bỏ `#detailAiMatchBadge`, ẩn `.badge-ai-match`, bỏ code gán text                                                                                                                                 | `chi-tiet-viec-lam.html`, `js/chi-tiet-viec-lam.js`                      |
| 2   | Thẻ "Việc làm liên quan khác" dùng style split cũ (badge lương nền, tên công ty thường, không có tim) | Card mới theo ngôn ngữ `.job-card`: công ty IN HOA + tick xác thực, lương cam `.job-salary-text`, pill thành phố/kinh nghiệm, "Đăng {thời gian}", badge "Đang xem", nút tim `.btn-card-bookmark` | `chi-tiet-viec-lam.html` (CSS), `js/chi-tiet-viec-lam.js` (`renderList`) |
| 3   | Nút "Lưu" dùng icon bookmark, list dùng icon tim                                                      | Đổi sang icon tim; nút tim trên card & nút hero đồng bộ qua `easycv_saved_job_ids`                                                                                                               | `chi-tiet-viec-lam.html`, `js/chi-tiet-viec-lam.js` (`toggleBookmark`)   |
| 4   | Từ khóa tìm kiếm mất khi mở chi tiết (ô tìm kiếm trống)                                               | `viec-lam.js` thêm `&keyword=` vào link chi tiết; trang chi tiết prefill `#jobSearchInput`                                                                                                       | `js/viec-lam.js` (`getDetailKeywordParam`), `js/chi-tiet-viec-lam.js`    |
| 5   | Danh sách liên quan không liên quan (thứ tự cố định theo id)                                          | `getRelatedJobs()`: job đang xem → khớp từ khóa → cùng ngành → còn lại; tính 1 lần để list không nhảy                                                                                            | `js/chi-tiet-viec-lam.js`                                                |

## Kết quả test

- `node --check` cả 2 file JS: PASS.
- Desktop 1440px: link từ `viec-lam.html?keyword=sale` mang `&keyword=sale`; chi tiết prefill "sale", 3 job Sales đứng đầu list; lưu/bỏ lưu đồng bộ; chọn job khác cập nhật URL + giữ thứ tự; console sạch.
- Mobile 375px: không tràn ngang.

## Còn tồn

- Khối HTML tĩnh 16 thẻ `.split-job-card` cũ trong `chi-tiet-viec-lam.html` (bị JS render đè) chưa được xoá.

## Đợt 2 (2026-10-07): lấy `viec-lam.html` làm gốc

| #   | Điểm lệch                                                                              | Giải pháp                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | Thứ tự danh sách bên trái tự chế (đang xem → khớp từ khóa → cùng ngành) khác trang gốc | Port nguyên `applyJobFilters()` + `sortJobs()` (kể cả `?sort=`), thứ tự trùng 100%                                                                         |
| 7   | Card bên trái là bản rút gọn riêng                                                     | Dùng nguyên markup `.job-card` của trang gốc + CSS thu gọn theo cột 460px; hover "Ứng tuyển"/"Ẩn việc làm"                                                 |
| 8   | Chỉ truyền `keyword`                                                                   | Truyền đủ keyword, location, category, industry, exp, salary, level, type, saturday, sort; trang chi tiết khôi phục ô địa điểm, danh mục nghề, pill bộ lọc |
| 9   | Toast/nhãn `chi-tiet-filter.js` viết không dấu                                         | Khôi phục tiếng Việt có dấu, câu chữ giống `viec-lam.js`                                                                                                   |
| 10  | Nút "Ứng tuyển" trên card bị `home.css` ẩn                                             | Override `display: inline-flex !important` như inline style của trang gốc                                                                                  |

Kết quả: thứ tự 25 job đầu giống hệt trang gốc với `keyword=sele` và với `keyword=sele&exp=1-3&location=Hà Nội`; console sạch; mobile không tràn.
