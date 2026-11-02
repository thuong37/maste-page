# Tạo CV mẫu TopCV (tools/topcv)

Tạo CV trên TopCV từ một mẫu (nội dung gợi ý), tải PDF miễn phí về `Downloads` với **tên file = tên CV**, rồi **xóa CV khỏi kho /quan-ly-cv**. Một lệnh, ~40 giây/mẫu. Đây là nguồn duy nhất của skill Qwen `topcv-create-cv` (skill chỉ gọi sang đây).

## Chạy
```
cd "D:\master page"
npm run topcv -- --template "Senior" --lang vi
```
Chạy nền (`is_background: true`). Tham số (đều tùy chọn):

| Tham số | Mặc định | Ý nghĩa |
|---|---|---|
| `--template <slug hoặc tên mẫu>` | mẫu đầu tiên trên /mau-cv | slug (`default_v2`, `senior_v2`…) HOẶC tên hiển thị khớp chính xác (`"Senior"`, `"Tiêu chuẩn"`; `Senior` ≠ `Senior 2`). Không thấy → in danh sách 73 mẫu |
| `--lang <vi\|en\|jp\|cn>` | `vi` | ngôn ngữ nội dung; mẫu không hỗ trợ → báo lỗi (vd Senior chỉ có vi/en/cn; jp cần mẫu có jp như "Tiêu chuẩn") |
| `--phone` / `--address` / `--name` | giá trị test | điền vào các trường TopCV bắt buộc |
| `--position` | Nhân viên kinh doanh | dùng cho `--verify` |
| `--position-slug` / `--category-id` / `--level` | theo ngôn ngữ (bảng `LANG_CONTENT`) | ghi đè nội dung gợi ý theo vị trí (xem "Nội dung gợi ý theo ngôn ngữ") |
| `--keep-cv` | tắt | giữ CV trên TopCV (mặc định xóa sau khi tải) |
| `--verify` | tắt | đọc PDF bằng `pdf-parse`, kiểm SĐT + vị trí (chậm hơn, cần `pdf-parse`) |
| `--copy` | tắt | copy thêm 1 bản PDF vào `--out` |
| `--out <dir>` | `scratch/topcv` | nơi ghi `topcv-last-result.json` (+ bản copy nếu `--copy`, ảnh lỗi) |
| `--profile <dir>` / `--temp-profile` | `~\.qwen\topcv-profile` | profile Edge bền (giữ đăng nhập) / profile tạm |

**Đăng nhập (lần đầu hoặc hết phiên):** thêm `--email <gmail> --google-password <mk>` (hỏi user; KHÔNG ghi mật khẩu vào file/skill/memory), script đăng nhập qua Google và lưu phiên vào profile. Hoặc `--manual-login`: chờ user tự đăng nhập trong cửa sổ Edge (`--login-wait` ms). Đăng nhập thẳng email/mật khẩu TopCV bị reCAPTCHA chặn → luôn dùng Google. Google báo "Wrong password" → hỏi lại user.

## Kết quả
- PDF: `C:\Users\Admin\Downloads\<tên CV>.pdf` (trùng tên → ` (2)`, ` (3)`…, không ghi đè).
- `topcv-last-result.json` (trong `--out`): `{ dest, source, verify, cvId, deleted, deleteError }`. **Luôn đọc file này và báo `dest` + `deleted` cho user.** `verify` = null nếu không bật `--verify`.
- Log có mốc `+12.3s`. `✓ HOÀN TẤT` = đã tải + đổi tên. `⚠`/`LỖI` → xem `topcv-error.png` trong `--out`. Xóa CV lỗi → exit code 1, báo user xóa tay ở /quan-ly-cv.

## LUÔN dùng "Nội dung CV mẫu TopCV gợi ý" — không bao giờ mẫu trống
Mẫu trống (`/viet-cv/<slug>?lang=..` không có `type=content_library`, hoặc "Tạo CV từ đầu") thiếu gần hết thông tin nên TopCV **không cho lưu**. Chế độ gợi ý đã điền sẵn hầu hết nội dung, chỉ còn vài trường bổ sung (SĐT, địa chỉ).

## Nội dung gợi ý theo ngôn ngữ (đọc từ URL thật của hộp "Tạo CV")
Mỗi ngôn ngữ có danh sách vị trí + `category_id`/`level` RIÊNG; dùng cặp của ngôn ngữ khác → HTTP 500 (đã gặp). Bảng `LANG_CONTENT` trong script:

| lang | category_id | slug | level |
|---|---|---|---|
| vi, en | 10001 | nhan-vien-kinh-doanh | 3 |
| cn | 1 | nhan-vien-kinh-doanh | 1 |
| jp | 10001 | nhan-vien-ban-hang | 1 (jp không có "Nhân viên kinh doanh") |

Cách lấy cặp mới: /mau-cv → "Dùng mẫu" → chọn "Nội dung CV mẫu TopCV gợi ý" → chọn ngôn ngữ → chọn vị trí (jp: mở dropdown "Chọn mẫu CV theo vị trí", là select2) → "Tạo CV" → đọc URL editor.

## Tên CV = `{phong cách}-{tên mẫu}-{ngôn ngữ}`
`Đơn giản-Tiêu chuẩn-Tiếng Việt`, `Đơn giản-Thanh lịch-Tiếng Anh`, `Hiện đại-Ấn tượng 6-Tiếng Trung`, `Đơn giản-Senior-Tiếng Việt`. KHÔNG có ngành nghề. Phong cách = tag đầu tiên (bỏ ATS/Harvard) trong `data-template.tags` của nút "Dùng mẫu"; tên mẫu = `title`; ngôn ngữ = `available_languages[].name` — đọc tự động từ /mau-cv.

## Luồng (script làm đúng như vậy)
1. Mở Edge (CDP :9222, profile bền), vào `/mau-cv`, nhận cookie, kiểm tra đã đăng nhập.
2. Tra mẫu trong `a.btn-use-now[data-template]` (slug / title / tags / ngôn ngữ), rồi **goto thẳng** `https://www.topcv.vn/viet-cv/<slug>?type=content_library&ta_source=CVPreviewModalInTemplateHome&lang=<vi|en|jp|cn>&category_id=10001&slug=nhan-vien-kinh-doanh&level=3` (nhanh hơn bấm "Dùng mẫu"; thiếu `type=content_library` CV sẽ trống).
3. Editor Quill: hộp "khôi phục dữ liệu chưa lưu" → **Không**. **Điền sẵn SĐT + địa chỉ** (ô `.ql-blank` theo `data-placeholder`) rồi chờ 1,5s cho editor ghi nhận → bấm **Lưu CV** (thường 1 lần; nếu toast báo thiếu trường khác thì điền theo `REQUIRED_MAP`, tối đa 4 vòng).
4. Hộp "Đặt tên cho CV" → gõ tên → **Tiếp tục**. Nếu mẫu có mục trống (vd cn thiếu "Dự án") TopCV hiện hộp "Lưu ý" → bấm **"Lưu CV, tôi sẽ hoàn thiện sau"** (nút cam, không phải `<button>`). Rồi vào `/save-cv-success/<cvId>?type=create` (lấy `cvId` từ URL). **Không có `cvId` = CV chưa lưu → script dừng**, không tải/xóa gì.
5. Bấm **Tải về** → modal → **"Tải CV miễn phí"** (nút xanh; KHÔNG bấm nút vàng 20.000 VND). Chờ nút đứng yên rồi mới bấm.
6. Edge tải PDF vào `Downloads`; script lấy file MỚI (so snapshot trước/sau khi lưu), **đổi tên ngay trong Downloads** thành tên CV.
7. Xóa CV: `POST /delete-cv {_token, cv_id}` gửi từ chính trang đang mở (token ở `meta[name=csrf-token]`), kiểm chứng bằng thẻ `.btn-download-cv[data-cv-id]` trong HTML `/quan-ly-cv`. Lỗi → rơi về luồng UI (hover → `…` → "Xóa" → modal `#confirmDelete` kiểm tra `#cv_id` → `.btn-delete-cv`). Chỉ xóa đúng `cvId` vừa tạo.

## Bài học (đã gặp, đừng lặp lại)
- `--download-dir` phải là đường dẫn kiểu Windows (`\`): nếu truyền `D:/a/b` thì Edge nhận request `download-cv` (200, application/pdf) nhưng báo "Download error" và không có file → script báo "Không có file PDF mới" và để lại CV tạm trên TopCV. Script nay tự `path.resolve` tham số này. Kiểm tra bằng `edge://downloads/all` trong profile.
- Mẫu có ô ảnh (`#cvo-profile-avatar`): phải tải ảnh qua hộp chọn file của `a.btn-choose-image`, chờ `.cropper-container`, bấm `button.btn-save-image`. Nạp thẳng input ẩn `#cvoFormImageFile` chỉ đóng hộp, ảnh không vào CV (PDF mất mục ảnh). Kiểm ô ảnh không còn `no_avatar`.
- Click "Dùng mẫu" bằng toạ độ không đáng tin (nút chỉ hiện khi hover) → dùng URL ở bước 2.
- TopCV **không tự tải PDF** sau khi lưu: luôn phải bấm "Tải về". Đừng thêm bước chờ file tự xuất hiện.
- "Tải CV miễn phí" xuất hiện 2 lần (tiêu đề + nút) và modal có hiệu ứng trượt: chờ vị trí nút ổn định giữa 2 lần đo; chỉ chờ chữ xuất hiện sẽ bấm trượt (y=374 thay vì 471) và mất thêm 25s.
- Bấm Lưu ngay sau khi gõ địa chỉ → TopCV vẫn báo thiếu: cần chờ ~1,5s sau khi điền.
- Sau POST xóa, danh sách có độ trễ: kiểm chứng bằng thẻ CV thật (không tìm chuỗi `cvId` thô) và thử lại ~6s.
- `new Function('return ' + src)()` mới trả về hàm; editor có `beforeunload` → luôn `page.on('dialog', d => d.accept())`; viewport phải 1440×900.
- Download không bắt được qua CDP → đọc thư mục Downloads, chỉ nhận file mới (từng lấy nhầm PDF cũ).
- Mẫu khác có thể bắt buộc trường khác → đọc toast lỗi; toast nhắc trường chưa có trong `REQUIRED_MAP` thì script báo lỗi rõ → thêm dòng vào `REQUIRED_MAP`.
- Không bao giờ fallback sang "card đầu tiên" của /quan-ly-cv: từng tải nhầm CV có sẵn của user rồi đặt tên theo mẫu. Chỉ thao tác trên đúng `cvId` vừa tạo.
- **Hộp "Lần tạo mới CV cuối cùng của bạn chưa được lưu, bạn có muốn khôi phục lại không?" (Bỏ qua | Khôi phục)** chặn editor và nút "Lưu CV". Nút "Bỏ qua" là thẻ `<a class="btn">`, KHÔNG phải `<button>` → `dismissRestoreDialog` phải quét `button, a.btn`. Triệu chứng khi không bấm được: URL editor mất tham số `type=content_library`, log "không có ô trống Địa chỉ", sau "Lưu CV" báo "Không có hộp đặt tên CV" rồi "CV chưa được lưu" (~95s/mẫu). Hộp hiện ở nhiều mẫu (senior_2, software_engineer, modern_5…), mẫu "Tiêu chuẩn" thì không. Đừng đổ lỗi cho chạy song song trước khi xem ảnh `topcv-error.png` và dò selector thật bằng puppeteer.
- Chạy song song 2 phong cách được: mỗi tiến trình một cổng CDP (9311, 9312…), một profile bản sao (`~.qwen	opcv-profile-<tag>`), một `--download-dir` và `--result` riêng, lệch nhau ~15s; mỗi tiến trình chỉ xóa `cvId` của nó. `topcv:plan -- assign` chỉ cho 1 phong cách/phiên nên không dùng được cho việc này; dùng `node tools/topcv/topcv-run-style.js "<phong cách>" <tag> <cổng> <trễ giây>` (không ghi vào `cv-plan/state`, nên `PLAN.md` không cập nhật). Mẫu lỗi thì bỏ qua mẫu đó, chỉ dừng khi 3 mẫu liên tiếp lỗi. Không chạy lại nhiều tiến trình cùng tag (log/summary bị ghi đè lẫn nhau).
- Không còn dùng cờ `--headless`; `waitForLogin` chỉ chạy ở chế độ `--manual-login`.

## Đổi vị trí nghề (chưa tự động hóa)
Lấy cặp `category_id`/`slug`/`level` của vị trí khác theo cách ở trên rồi truyền `--category-id --position-slug --level` (và `--position`).

## Phụ thuộc
`puppeteer-core` (luôn cần), `pdf-parse` (chỉ khi `--verify`). Script tự tìm trong `.qwen/tmp/node_modules` hoặc `node_modules/` của repo; thiếu thì tự `npm install` vào `tools/topcv/` (đã git-ignore).
