# Đề xuất phân loại lại style cho 65 template CV (ĐÃ ÁP DỤNG 2026-10-22)

Ngày: 2026-10-22. Tiêu chí: [DINH-NGHIA-PHONG-CACH-CV.md](DINH-NGHIA-PHONG-CACH-CV.md) (bảng mục 1), cụ thể hóa bằng các quy tắc trong [PHAN-LOAI-ATS-THEO-STYLE.md](PHAN-LOAI-ATS-THEO-STYLE.md). Tên mẫu giữ nguyên như TopCV đặt, không dùng tên để suy ra style (ví dụ "Tối giản 2" không phải Minimalist).

Cách làm: xem lại hình trang 1 của cả 65 PDF tiếng Việt hiện có, đối chiếu với số liệu đo được (số cột, thanh kỹ năng, cỡ ảnh từ `cv-template-sections.json` đã kiểm bằng hình; font có chân đo trực tiếp từ PDF). Người dùng đã duyệt và 6 thay đổi dưới đây đã áp dụng vào `style_cv.csv`, `assets/cv-style/`, `vi-tri-chuyen-mon_style_cv.csv` (cột mẫu), `restyle-vi.json`, `cv-template-sections.json`; bảng nghề → style (style ưu tiên/phụ của từng nghề) không đổi.

## Kết luận: 59/65 mẫu giữ nguyên, 6 mẫu đề nghị đổi

| Style | Hiện tại | Đề xuất |
|---|---|---|
| Creative | 19 | 19 |
| Modern | 26 | 30 |
| Professional | 12 | 8 |
| Classic | 3 | 3 |
| Minimalist | 5 | 5 |

| Mẫu | Hiện tại | Đề xuất | Lý do | Mức chắc |
|---|---|---|---|---|
| Professional / Kỹ Sư Phần Mềm | Professional | **Minimalist** | 1 cột, nền trắng, chữ đen/xám, font không chân, không khối màu hay sidebar; chỉ tên màu xanh | ⚠ vừa |
| Professional / Tiêu chuẩn (ít kinh nghiệm) | Professional | **Minimalist** | 1 cột, nền trắng, chữ đen/xám, tiêu đề căn giữa, không khối màu | ⚠ vừa |
| Professional / Thanh nhã | Professional | **Modern** | Khối nền hồng pastel, tiêu đề màu, icon; cùng kiểu với Modern/Hiện đại 6 (sidebar hồng, đã xếp Modern). Không phải bảng màu trung tính | ⚠ vừa |
| Professional / Trang trọng | Professional | **Modern** | Khối nền hồng pastel, mốc thời gian chấm màu; cùng lý do với Thanh nhã | ⚠ vừa |
| Minimalist / Hiện Đại 1 | Minimalist | **Modern** | Màu nhấn đỏ ở tiêu đề và icon, có thanh kỹ năng, ảnh tròn viền màu; Minimalist yêu cầu ít hoặc không có màu nhấn | ⚠ vừa |
| Minimalist / Thanh lịch | Minimalist | **Modern** | Tiêu đề đỏ có gạch chân, icon đỏ, mốc thời gian chấm màu | ⚠ thấp |

## Các mẫu giữ nguyên nhưng sát ranh giới (cần bạn biết)
- **Classic (3 mẫu):** chắc. Cả 3 là những mẫu duy nhất dùng font có chân (Times New Roman), 1 cột, đen trắng.
- **Creative, nhóm mô phỏng giao diện hoặc nền màu lớn** (TikTop, Topinstar, Twittop, Toptify, Outstanding, Chrome, Ấn tượng, Outstanding 5, Thời đại, Gradient 1, Hello): chắc.
- **Creative, nhóm sát Modern:** `Sáng tạo` (nền trắng, nhấn cam, hình khối cong trang trí), `Màu sắc` (nền trắng, vạch nhấn nhiều màu), `Basic 3`, `Basic 5`, `Đam mê`, `Lập trình viên 2` (kiểu chữ mã nguồn), `Lập Trình Viên` (đen trắng, chữ mã nguồn). Giữ Creative vì có hình khối trang trí, gradient hoặc kiểu chữ không quy ước, nhưng ranh giới với Modern mỏng.
- **Professional còn lại (8 mẫu):** Basic 1, Cao Cấp, Clarity, Tham vọng, Tham vọng 1, Thành đạt, Tối giản 2, Ấn tượng 6. Nền sidebar/header tối hoặc xám đơn sắc, không thanh kỹ năng. `Tham vọng`, `Tham vọng 1`, `Thành đạt` có màu nhấn cam trên nền tối, vẫn giữ Professional vì phần lớn diện tích là màu trung tính.
- **Modern có nền tối đơn sắc nhưng giữ Modern vì có thanh/chấm kỹ năng:** Hiện Đại 3, Ấn tượng 2, Chuyên Nghiệp 3.
- **Modern không có thanh kỹ năng, giữ Modern vì có màu nhấn hoặc khối màu:** Outstanding 2, 3, 7, 9, 10, 11, Ấn tượng 5, Basic 2, Basic 4, Tinh tế 1, Sinh viên 3, Hiện đại 6.

## Hạn chế
- Nguồn không có ngưỡng định lượng (xem mục "Đọc trước khi dùng" của DINH-NGHIA). Quy tắc Modern/Professional/Minimalist ở trên là cách cụ thể hóa của tôi, không phải định nghĩa của nguồn. Ranh giới Modern ↔ Professional ↔ Minimalist là chỗ dễ lệch nhất.
- Quy tắc "thanh kỹ năng → Modern" hơi cứng: một mẫu nền tối đơn sắc như `Ấn tượng 2` thành Modern chỉ vì có thanh kỹ năng, trong khi mẫu tương tự không có thanh lại là Professional.
- Tôi chỉ xem trang 1 ở độ phân giải thấp (75dpi) qua ảnh ghép; trang 2 chỉ xem qua dữ liệu kiểm kê của giai đoạn 3.
- DINH-NGHIA-PHONG-CACH-CV.md chưa cập nhật từ 2026-10-21: bước 4 của file đó (ghi mục "Quy đổi TopCV ↔ nguồn") chưa được làm. Các quy tắc cụ thể hóa hiện nằm ở PHAN-LOAI-ATS-THEO-STYLE.md (sinh 2026-10-22).
