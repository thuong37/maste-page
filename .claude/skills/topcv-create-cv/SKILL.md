---
name: topcv-create-cv
description: Tạo CV trên TopCV từ một mẫu (template) bằng "Nội dung CV mẫu TopCV gợi ý", tải PDF miễn phí về Downloads với tên file = tên CV (vd "Đơn giản-Senior-Tiếng Việt.pdf"), rồi tự xóa CV khỏi kho quản lý CV. Dùng khi user nói "tạo CV trên TopCV", "tải template/mẫu CV TopCV", "lấy mẫu CV TopCV về", "chạy lại skill lấy template CV". ~40 giây/mẫu; hỗ trợ ngôn ngữ vi, en, cn, jp.
---

# TopCV Create CV

Mã nguồn và tài liệu kỹ thuật đầy đủ nằm ở [tools/topcv/](../../../tools/topcv/) (đọc `tools/topcv/README.md` khi cần chi tiết hoặc khi script lỗi). Skill này chỉ chỉ cách gọi và các quy tắc phải giữ. Skill cùng tên cho Qwen (`~/.qwen/skills/topcv-create-cv`) cũng gọi vào cùng script, nên sửa logic ở `tools/topcv/`, không sửa ở hai skill.

Đây là công cụ vận hành, không phải thay đổi giao diện: không thuộc tầng S/M/L trong `AGENTS.md`, và không cần `npm run build`.

## Chạy
Chạy nền (Bash `run_in_background: true`, ~40 giây), cwd = gốc repo:
```
npm run topcv -- --template "Senior" --lang vi
```
- `--template`: slug (`senior_v2`) hoặc tên hiển thị khớp chính xác (`"Senior"`, `"Tiêu chuẩn"`, `"Thanh lịch"`, `"Ấn tượng 6"`; `Senior` ≠ `Senior 2`). Sai tên → script in danh sách 73 mẫu; chọn lại, đừng đoán.
- `--lang`: `vi` (mặc định) | `en` | `cn` | `jp`. Mẫu không hỗ trợ ngôn ngữ đó → script báo lỗi, đổi mẫu hoặc ngôn ngữ (vd Senior không có jp; dùng "Tiêu chuẩn").
- Khác: `--keep-cv` (giữ CV trên TopCV), `--verify` (đọc PDF kiểm SĐT/vị trí), `--copy` (thêm 1 bản vào `--out`), `--out`.

Cần nhiều mẫu cùng cổng :9222 thì chạy **tuần tự**. Chạy song song chỉ được khi mỗi tiến trình có cổng + profile riêng, như cách dưới đây.

## Mặc định khi user gọi skill: phóng ngay 2 agent
Mỗi lần user gọi `/topcv-create-cv` (không chỉ định mẫu cụ thể), **không hỏi lại, phóng ngay 2 subagent nền** (một message, `run_in_background: true`), mỗi agent một phong cách, chạy cùng lúc, agent thứ 2 xuất phát sau agent 1 khoảng 15s, mỗi agent chỉ chịu trách nhiệm CV của mình. Mỗi agent chạy đúng một lệnh (nền, chờ thông báo, không poll):
- Agent A: `node tools/topcv/topcv-run-style.js "<phong cách 1>" A 9311 0`
- Agent B: `node tools/topcv/topcv-run-style.js "<phong cách 2>" B 9312 15`

Phong cách: lấy từ lời user nếu có; không có thì chọn 2 phong cách còn nhiều job nhất chưa có PDF trong `assets/cv-templates` (xem `tools/topcv/cv-plan/PLAN.md`; hiện là Đơn giản + Hiện đại). Script lo cả 4 ngôn ngữ, bỏ qua mẫu đã có PDF, bỏ qua mẫu lỗi, dừng khi 3 mẫu liên tiếp lỗi, ghi `scratch/topcv/workers/<A|B>/summary.json`. Mỗi agent báo: số PDF, mẫu lỗi, CV `deleted:false` kèm `cvId`. Nếu user chỉ định một mẫu cụ thể thì chạy `npm run topcv` như mục "Chạy", không phóng agent. Không chạy lại nhiều tiến trình cùng tag (summary/log bị ghi đè). Agent chạy chưa xong mà bạn đã kết luận là sai: đọc `summary.json` và đếm PDF thật trước khi báo.

## Quy tắc (không tự đổi)
- **Điền hết ô trống trước khi lưu**: ngoài trường bắt buộc (SĐT, địa chỉ, email), mọi ô còn trống sau khi nạp nội dung gợi ý cũng phải điền (`fillRemainingBlanks` trong script; dùng chữ gợi ý của ô nếu không phải trường quen thuộc). Không để CV lưu ra còn mục trống. Log có `WARN: ô trống không có chữ gợi ý` thì xem lại mẫu đó.
- **Mẫu có ô ảnh chân dung phải tải ảnh lên trước khi lưu** (`uploadAvatar` trong script, ảnh mặc định `tools/topcv/assets/avatar.png`, đổi bằng `--avatar <đường dẫn>`). Để trống thì PDF mất luôn mục ảnh. Phải chọn file qua hộp chọn của nút `a.btn-choose-image` (nạp thẳng input ẩn `#cvoFormImageFile` không kích hoạt cropper nên ảnh không vào CV), chờ cropper rồi bấm "Xong". Log có `WARN` về ảnh (cropper không hiện, ô ảnh vẫn `no_avatar`) thì PDF thiếu ảnh: xử lý mẫu đó, đừng coi là xong. Mẫu không có ô ảnh thì script tự bỏ qua. PDF tạo trước khi có bước này không quét lại.
- **Luôn mở bằng "Nội dung CV mẫu TopCV gợi ý"** (script đã làm). Tuyệt đối không dùng mẫu trống / "Tạo CV từ đầu": thiếu gần hết thông tin và TopCV không cho lưu. Mỗi ngôn ngữ có `category_id`/`level` riêng (`LANG_CONTENT` trong script); ghép tham số của ngôn ngữ này cho ngôn ngữ khác sẽ bị HTTP 500. Gặp 500 thì đọc URL thật từ hộp "Bạn muốn tạo CV từ?", đừng chuyển sang mẫu trống.
- **Tên CV = tên file PDF = `{phong cách}-{tên mẫu}-{ngôn ngữ}`**, vd `Đơn giản-Tiêu chuẩn-Tiếng Việt`, `Hiện đại-Ấn tượng 6-Tiếng Trung`. Không ghi ngành nghề. Script tự suy ra từ dữ liệu mẫu trên /mau-cv.
- PDF nằm ở `C:\Users\Admin\Downloads\<tên CV>.pdf` (trùng tên → ` (2)`…). Không xóa hay đổi tên file khác trong Downloads.
- Sau khi tải, script tự xóa CV vừa tạo khỏi /quan-ly-cv, chỉ đúng `cvId` của nó. Không bao giờ thêm bước "lấy CV đầu tiên trong /quan-ly-cv" để tải hoặc xóa: đã từng tải nhầm CV có sẵn của user. CV chưa lưu được (không có `cvId`) thì script phải dừng.
- Không bấm nút vàng 20.000 VND ("Tải CV miễn phí" là nút xanh; script đã xử lý).

- **Đổi thương hiệu khi điền: "TopCV" → "EasyCV"**: mọi cụm "TopCV" trong nội dung CV (chữ có sẵn của mẫu gợi ý lẫn chữ tự điền) phải thành "EasyCV" trước khi lưu (`replaceBrandText` + `brand()` trong script; log `Đã đổi "TopCV" → "EasyCV"`). Chỉ áp cho nội dung CV, không đụng tên CV/PDF hay giao diện TopCV.

## Chế độ "làm lại mẫu từ assets/cv-style" (user yêu cầu)
Khi user nói "vào `assets/cv-style`, với mỗi template lên TopCV kéo lại, kéo về rồi xóa cái cũ":
- **Phạm vi hiện tại: chỉ CV tiếng Việt** (`Tiếng Việt`). Ngôn ngữ khác chỉ làm khi user bảo.
- Danh sách job: `tools/topcv/cv-plan/restyle-vi.json` (sinh từ thư mục `assets/cv-style/<nhóm>/<mẫu>/Tiếng Việt/`, ghép tên mẫu → slug qua `cv-plan/jobs.json`).
- Dùng **màu mặc định của TopCV** (không đổi màu), **điền hết mọi ô trống**, và **ảnh phải là chân dung người thật**, không dùng ảnh hoạt hình/giả (`tools/topcv/assets/avatar.png` là hình hoạt hình, đừng dùng). Ảnh người thật xoay vòng nằm ở `scratch/topcv/avatars/up-*.png` (tải từ randomuser.me rồi phóng 512px); mất thì tải lại 4-6 ảnh, hỏi/được user đồng ý.
- **Tên file trong `assets/cv-style` = đúng tên CV tạo trên nền tảng** (`{phong cách}-{mẫu}-{ngôn ngữ}.pdf`, vd `Đơn giản-Senior-Tiếng Việt.pdf`), đặt trong cùng thư mục `<nhóm>/<mẫu>/Tiếng Việt/`; file cũ (tiền tố `ATS-`) bị xóa.
- "Xóa cái cũ" = thay PDF cũ trong `assets/cv-style` bằng PDF mới (chỉ khi log xác nhận ảnh đã lên), và CV tạm trên TopCV được xóa theo `cvId`.
- Chạy 2 worker nền: `node tools/topcv/topcv-restyle.js A 9311 0 0 2` và `node tools/topcv/topcv-restyle.js B 9312 15 1 2`. Tiến độ ở `scratch/topcv/restyle/<A|B>/summary.json`; chạy lại thì bỏ qua mẫu đã xong. Đổi script `topcv-create-cv.js` giữa chừng thì dừng worker và xóa summary để các mẫu xong trước đó không thiếu bước mới.

## Lỗi hay gặp
- Hộp "Lần tạo mới CV cuối cùng chưa được lưu… khôi phục?" phải bấm **"Bỏ qua"** (là thẻ `<a>`, không phải `<button>`; script đã xử lý). Nếu nhiều mẫu cùng lỗi "CV chưa được lưu" thì xem `topcv-error.png` và dò selector trước khi kết luận do chạy song song.
- Song song nhiều phong cách: mỗi tiến trình cổng CDP/profile/download-dir riêng, lệch ~15s (xem "Bài học" trong `tools/topcv/README.md`).

## Đăng nhập
Profile Edge bền ở `~\.qwen\topcv-profile`, thường đã đăng nhập sẵn. Hết phiên (script chờ rồi báo lỗi login):
- Hỏi user email + mật khẩu **Google**, rồi thêm `--email <gmail> --google-password <mk>`. Không ghi mật khẩu vào file, skill hay memory.
- Hoặc `--manual-login` (+ `--login-wait <ms>`) để user tự đăng nhập trong cửa sổ Edge đang mở.
- Đăng nhập thẳng email/mật khẩu TopCV bị reCAPTCHA chặn → luôn dùng Google. Google báo "Wrong password" → hỏi lại user, không đoán.

## Sau khi chạy
1. Đọc `scratch/topcv/topcv-last-result.json`: `dest` (đường dẫn PDF), `deleted` (CV đã xóa khỏi TopCV chưa), `deleteError`, `cvId`.
2. Báo user `dest` và `deleted`. `deleted:false` → báo user xóa tay ở https://www.topcv.vn/quan-ly-cv, kèm `cvId`.
3. Log có `LỖI` hoặc `⚠` → xem `scratch/topcv/topcv-error.png` (Read ảnh) để biết TopCV đang hiện gì, rồi đọc phần "Bài học" trong `tools/topcv/README.md` trước khi sửa script.
4. Lệnh thoát khác 0 mà chưa có file `dest` mới thì coi là thất bại, đừng báo thành công theo kết quả cũ trong JSON (file JSON chỉ được ghi khi chạy xong).

## Phạm vi
Script thao tác trên tài khoản TopCV thật của user (tạo rồi xóa CV, tải PDF). Chỉ chạy khi user yêu cầu. Mỗi lần chạy thêm một CV tạm vào tài khoản trong ~40 giây rồi xóa.
