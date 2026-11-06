# Kết quả đối chiếu nghề × template

> Sinh bởi `node tools/jd/build-match.js`.

## Cách tính điểm (tối đa 100)

- **Phong cách (60/30/0 điểm):** style của mẫu trùng style ưu tiên của nghề = 60, trùng style phụ = 30, khác = 0. Style ưu tiên/phụ của từng nghề do người dùng gán sẵn (`vi-tri-chuyen-mon_style_cv.csv`, tri thức trong [TRI-THUC-PHONG-CACH-CV-THEO-NGANH.md](../PHONG-CACH-CV/TRI-THUC-PHONG-CACH-CV-THEO-NGANH.md)); với nghề có nhiều vị trí khác style, lấy cặp phổ biến nhất. Style của mẫu lấy từ `style_cv.csv`.
- **Nội dung (tối đa 40 điểm):** 40 × (trọng số các mục nghề cần mà mẫu có ÷ tổng trọng số nghề cần; cốt lõi=3, nên=1, tùy chọn=0,25), trừ 2×điểm phạt. Phạt: thiếu mục cốt lõi 2; có mục "không cần" 0,5; mẫu ≥3 trang 0,75; mẫu dày đặc 0,5; ảnh lớn khi nghề không nhấn mạnh ảnh 0,5 (hai mức phạt dài/dày nhân đôi với nhóm nghề cần CV ngắn: lao động phổ thông, tài xế, sản xuất, bán lẻ, nhà hàng). Chỉ chấm các mục mà ít nhất một mẫu có thành mục riêng (bỏ: ngoai-ngu, ky-nang-mem, thanh-tich-kpi, cong-cu-phan-mem, portfolio-link, giay-phep); mọi mẫu đều điền dữ liệu mẫu của nhân viên kinh doanh nên không so từ khóa. Mức mục = max(nền CV thông thường, JD), có thể bị đánh giá chuyên gia ghi đè (cv-content-overrides.json) — xem [CV-THONG-THUONG.md](CV-THONG-THUONG.md).
- **Cách đọc:** phong cách quyết định nhóm mẫu hợp; nội dung chọn mẫu cụ thể trong nhóm đó. So hạng trong cùng một nghề, không so điểm giữa các nghề.
- **Độ tin cậy gồm hai phần:** `co_so_style` (Nguồn / Suy từ nguồn / Suy luận, của việc gán style cho nghề) và `do_tin_cay_jd` (cao/vua/thap, của nội dung). Nghề "Suy luận" hoặc `thap` chỉ là gợi ý.

## Mẫu hạng 1–3 theo từng nghề, nhóm theo nhóm nghề

Trong ngoặc là style của mẫu. Chi tiết điểm từng mẫu nằm trong `assets/data/cv-style-mapping/nghe_template.csv`.

### Kinh doanh/Bán hàng (17 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 1 | Sales Xuất nhập khẩu/Logistics | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 2 | Sales Bất động sản | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 3 | Sales Xây dựng | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 4 | Sales Giáo dục/Khoá học | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 5 | Sales Admin/Sales Support | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 6 | Sales Tài chính/Ngân hàng/Bảo hiểm | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 7 | Sales Bán lẻ/Dịch vụ tiêu dùng | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 8 | Sales Sản xuất | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 9 | Sales Kỹ thuật (Sales Engineer) | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 10 | Sales Nhà hàng/Khách sạn/Du lịch | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 11 | Sales Dược/Y tế/Sức khoẻ/Làm đẹp | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 12 | Sales IT Phần mềm | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 13 | Sales Điện/Điện tử/Viễn thông | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 14 | Sales dịch vụ Quảng cáo/Triển lãm/Sự kiện | Modern / Creative | Suy từ nguồn | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 15 | Sales Thương mại điện tử | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 16 | Quản lý kinh doanh | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 17 | Kinh doanh/Bán hàng khác | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Marketing/PR/Quảng cáo (7 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 18 | Marketing | Modern / Creative | Nguồn | cao | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 19 | Quảng cáo/Sáng tạo | Creative / Modern | Nguồn | vua | Lập Trình Viên (Creative); Sáng tạo (Creative); Lập trình viên 2 (Creative) |
| 20 | Quan hệ Công chúng (PR) | Modern / Professional | Suy từ nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 21 | Quan hệ Chính phủ | Professional / Classic | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 22 | Market Research and Analysis | Modern / Professional | Suy từ nguồn | cao | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 23 | Sales dịch vụ Quảng cáo/Triển lãm/Sự kiện | Modern / Creative | Suy từ nguồn | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 24 | Marketing/PR/Quảng cáo khác | Modern / Creative | Nguồn | thap | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Chăm sóc khách hàng (Customer Service)/Vận hành (5 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 25 | Chăm sóc khách hàng (Customer Service) | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 26 | Vận hành Thương mại điện tử | Modern / Minimalist | Suy luận | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 27 | Business Operation (Vận hành kinh doanh) | Professional / Modern | Suy từ nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 28 | Quản lý vận hành | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 29 | Dịch vụ khách hàng/Vận hành khác | Modern / Minimalist | Suy luận | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Nhân sự/Hành chính/Pháp chế (4 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 30 | Nhân sự | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 31 | Hành chính | Modern / Minimalist | Suy từ nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 32 | Dịch vụ pháp chế (In-house) | Professional / Classic | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 33 | Nhân sự/Hành chính/Pháp chế khác | Modern / Minimalist | Nguồn | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Công nghệ Thông tin (14 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 34 | Software Engineering | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 35 | Software Testing | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 36 | Artificial Intelligence (AI) | Modern / Minimalist | Suy từ nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 37 | Data Science | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 38 | IT Infrastructure and Operations | Modern / Minimalist | Nguồn | vua | Basic 2 (Modern); Dòng Thời Gian 2 (Modern); Hiện Đại 3 (Modern) |
| 39 | Information Security | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 40 | IoT/Embedded Engineer | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 41 | IT Project Management | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 42 | IT Management/Specialist | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 43 | Software Design | Creative / Modern | Suy từ nguồn | vua | Lập Trình Viên (Creative); Sáng tạo (Creative); Lập trình viên 2 (Creative) |
| 44 | Product Management | Modern / Professional | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 45 | Game Development | Modern / Creative | Suy luận | cao | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 46 | Sales IT Phần mềm | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 47 | Công nghệ thông tin khác | Modern / Minimalist | Nguồn | thap | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Lao động phổ thông (12 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 48 | Công nhân | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 49 | Tài xế | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 50 | Kho vận/Giao hàng | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 51 | Bảo vệ/Bảo trì/Sửa chữa | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 52 | Vệ sinh/Giúp việc/Bảo mẫu | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 53 | Chăm sóc sức khoẻ/Làm đẹp | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 54 | Nhà hàng/Dịch vụ ăn uống | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 55 | Khách sạn/Dịch vụ cư trú | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 56 | Tiếp thị/Bán hàng | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 57 | Thợ thủ công | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 58 | Gia công cơ khí | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 59 | Thợ xây dựng | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |

### Tài chính/Ngân hàng/Bảo hiểm (8 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 60 | Tài chính | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 61 | Ngân hàng | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 62 | Chứng khoán | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 63 | Thẩm định và quản trị rủi ro | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 64 | Đầu tư và Tài trợ | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 65 | Bảo hiểm | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 66 | Sales Tài chính/Ngân hàng/Bảo hiểm | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 67 | Tài chính/Ngân hàng/Bảo hiểm khác | Professional / Modern | Nguồn | thap | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Bất động sản (4 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 68 | Quản lý vận hành bất động sản | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 69 | Quy hoạch và phát triển bất động sản | Professional / Modern | Suy từ nguồn | thap | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 70 | Sales Bất động sản | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 71 | Bất động sản khác | Professional / Modern | Suy từ nguồn | thap | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Xây dựng (5 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 72 | Quản lý dự án xây dựng | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 73 | Thiết kế và Kiến trúc | Professional / Creative | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 74 | Công nhân Xây dựng/Cải tạo | Minimalist / Classic | Suy luận | thap | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 75 | Sales Xây dựng | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 76 | Xây dựng khác | Professional / Creative | Suy từ nguồn | thap | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Kế toán/Kiểm toán/Thuế (4 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 77 | Kế toán | Professional / Classic | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 78 | Kiểm toán | Professional / Classic | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 79 | Thuế | Professional / Classic | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 80 | Kế toán/Kiểm toán/Thuế khác | Professional / Classic | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Sản xuất (12 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 81 | Gia công cơ khí | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 82 | Thiết kế/chế tạo máy | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 83 | Hoá chất/Hoá mỹ phẩm | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 84 | May mặc/Dệt may/Da | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 85 | R&D/Sản xuất ô tô | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 86 | Thợ kỹ thuật | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 87 | Vận hành thiết bị vận tải/thiết bị nặng | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 88 | Quản lý chất lượng | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 89 | Vận hành sản xuất | Professional / Minimalist | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 90 | Bảo trì, sửa chữa | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 91 | Sales Sản xuất | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 92 | Sản xuất khác | Minimalist / Professional | Suy luận | thap | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |

### Giáo dục/Đào tạo (8 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 93 | Giáo viên/Giảng viên/Gia sư | Modern / Minimalist | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 94 | Văn hoá/Nghệ thuật/Khoa học | Creative / Modern | Suy từ nguồn | vua | Lập Trình Viên (Creative); Lập trình viên 2 (Creative); Màu sắc (Creative) |
| 95 | Thể chất/Thể hình | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 96 | Quản lý giáo dục | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 97 | Trợ giảng | Minimalist / Modern | Suy từ nguồn | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 98 | Quản lý/Hỗ trợ lớp học | Minimalist / Modern | Suy từ nguồn | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 99 | Sales Giáo dục/Khoá học | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 100 | Giáo dục/Đào tạo khác | Modern / Minimalist | Nguồn | thap | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Bán lẻ/Dịch vụ đời sống (11 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 101 | Bán lẻ | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 102 | Dịch vụ làm đẹp | Creative / Modern | Suy từ nguồn | vua | Lập Trình Viên (Creative); Lập trình viên 2 (Creative); Màu sắc (Creative) |
| 103 | Dịch vụ chăm sóc sức khoẻ | Minimalist / Modern | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 104 | Dịch vụ vệ sinh/nhà cửa | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 105 | Thể chất/Thể hình | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 106 | Tài xế/Lái xe | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 107 | Dịch vụ an ninh và bảo trì | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 108 | Dịch vụ bà mẹ trẻ em | Minimalist / Modern | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 109 | Dịch vụ ô tô/xe máy/xe điện | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 110 | Dịch vụ thú cưng | Minimalist / Modern | Suy luận | thap | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 111 | Bán lẻ/Dịch vụ đời sống khác | Minimalist / Modern | Suy luận | thap | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |

### Phim và truyền hình/Báo chí/Xuất bản (3 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 112 | Biên tập/Viết/Xuất bản | Modern / Professional | Suy từ nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 113 | Phim và truyền hình | Creative / Modern | Nguồn | vua | Lập Trình Viên (Creative); Sáng tạo (Creative); Lập trình viên 2 (Creative) |
| 114 | Phim và truyền hình/Báo chí/Xuất bản khác | Creative / Modern | Nguồn | vua | Lập Trình Viên (Creative); Sáng tạo (Creative); Lập trình viên 2 (Creative) |

### Điện/Điện tử/Viễn thông (9 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 115 | Điện/Tự động hoá | Professional / Modern | Suy từ nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 116 | Điện tử/Phần cứng | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 117 | Nhiệt/Gió/Điều hoà (HVAC-R) | Professional / Modern | Suy từ nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 118 | Chất bán dẫn/Chip | Professional / Modern | Suy từ nguồn | thap | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 119 | Quản lý/Vận hành dự án kỹ thuật | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 120 | Viễn thông | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 121 | Vận hành và bảo trì/Hỗ trợ kỹ thuật | Minimalist / Professional | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 122 | Sales Điện/Điện tử/Viễn thông | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 123 | Điện/Điện tử/Viễn thông khác | Professional / Modern | Suy từ nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Logistics/Thu mua/Kho/Vận tải (8 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 124 | Sales Xuất nhập khẩu/Logistics | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 125 | Xuất nhập khẩu/Logistics | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 126 | Vận tải | Minimalist / Professional | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist); Tiêu chuẩn (Minimalist) |
| 127 | Giao nhận | Minimalist / Professional | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist); Tiêu chuẩn (Minimalist) |
| 128 | Kho vận | Minimalist / Professional | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist); Tiêu chuẩn (Minimalist) |
| 129 | Thu mua/Mua hàng | Professional / Minimalist | Suy luận | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 130 | Chuỗi cung ứng | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 131 | Logistics khác | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Tư vấn chuyên môn (1 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 132 | Tư vấn/Phân tích chuyên môn | Professional / Modern | Nguồn | thap | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Dược/Y tế/Sức khoẻ/Công nghệ sinh học (7 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 133 | Nghề Y tá/Điều dưỡng | Modern / Professional | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 134 | Bác sĩ/Kỹ thuật viên | Modern / Professional | Nguồn | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 135 | Vật lý trị liệu và chăm sóc sức khỏe | Modern / Professional | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 136 | Dược phẩm/Công nghệ sinh học | Modern / Professional | Nguồn | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 137 | Thiết bị y tế | Modern / Professional | Nguồn | cao | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 138 | Sales Dược/Y tế/Sức khoẻ/Làm đẹp | Professional / Modern | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 139 | Dược/Y tế/Sức khoẻ/Công nghệ sinh học khác | Modern / Professional | Nguồn | thap | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Thiết kế (8 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 140 | Thiết kế Đồ hoạ/Giao diện/Trải nghiệm | Creative / Modern | Nguồn | cao | Lập Trình Viên (Creative); Lập trình viên 2 (Creative); Màu sắc (Creative) |
| 141 | Thiết kế Nhà/Nội thất/Môi trường | Creative / Modern | Nguồn | cao | Lập Trình Viên (Creative); Sáng tạo (Creative); Lập trình viên 2 (Creative) |
| 142 | Thiết kế Công nghiệp | Creative / Modern | Suy từ nguồn | cao | Lập Trình Viên (Creative); Lập trình viên 2 (Creative); Màu sắc (Creative) |
| 143 | Thiết kế Thời trang | Creative / Modern | Nguồn | cao | Lập Trình Viên (Creative); Sáng tạo (Creative); Lập trình viên 2 (Creative) |
| 144 | Nghệ thuật/Hoạt hình/Game | Creative / Modern | Suy từ nguồn | vua | Lập Trình Viên (Creative); Lập trình viên 2 (Creative); Màu sắc (Creative) |
| 145 | Nghiên cứu người dùng | Modern / Minimalist | Suy luận | thap | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 146 | Quản lý thiết kế | Modern / Creative | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Sinh viên 3 (Modern) |
| 147 | Thiết kế khác | Creative / Modern | Suy từ nguồn | thap | Lập Trình Viên (Creative); Lập trình viên 2 (Creative); Màu sắc (Creative) |

### Nhà hàng/Khách sạn/Du lịch (5 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 148 | Nhà hàng/Dịch vụ ăn uống | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 149 | Khách sạn/Dịch vụ cư trú | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 150 | Dịch vụ du lịch | Modern / Minimalist | Suy luận | vua | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |
| 151 | Sales Nhà hàng/Khách sạn/Du lịch | Professional / Modern | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 152 | Nhà hàng/Khách sạn/Du lịch khác | Modern / Minimalist | Suy luận | thap | Bright (Modern); Thanh nhã (Modern); Basic 2 (Modern) |

### Năng lượng/Môi trường/Nông nghiệp (4 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 153 | Năng lượng/Địa chất | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 154 | An toàn lao động/Môi trường | Professional / Minimalist | Suy luận | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 155 | Nông/Lâm/Ngư nghiệp | Professional / Minimalist | Suy luận | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 156 | Năng lượng/Môi trường/Nông nghiệp khác | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Tài xế (2 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 157 | Vận tải | Minimalist / Classic | Suy luận | cao | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 158 | Đưa đón | Minimalist / Classic | Suy luận | vua | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |

### Biên phiên dịch (1 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 159 | Nghề Biên phiên dịch | Professional / Minimalist | Suy luận | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Luật (2 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 160 | Dịch vụ pháp lý (Agency/Firm) | Professional / Classic | Nguồn | vua | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |
| 161 | Dịch vụ pháp chế (In-house) | Professional / Classic | Nguồn | cao | Ấn tượng 6 (Professional); Basic 1 (Professional); Clarity (Professional) |

### Nhóm nghề khác (2 nghề)

| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |
|---|---|---|---|---|---|
| 162 | Hàng hải | Minimalist / Modern | Suy từ nguồn | thap | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist) |
| 163 | NGO/Phi chính phủ/Phi lợi nhuận | Minimalist / Modern | Suy từ nguồn | thap | Kỹ Sư Phần Mềm (Minimalist); Tiêu chuẩn (ít kinh nghiệm) (Minimalist); Tiêu chuẩn (Minimalist) |

## Cần lưu ý

- Nghề độ tin cậy JD thấp (19): #24 Marketing/PR/Quảng cáo khác; #47 Công nghệ thông tin khác; #67 Tài chính/Ngân hàng/Bảo hiểm khác; #69 Quy hoạch và phát triển bất động sản; #71 Bất động sản khác; #74 Công nhân Xây dựng/Cải tạo; #76 Xây dựng khác; #92 Sản xuất khác; #100 Giáo dục/Đào tạo khác; #110 Dịch vụ thú cưng; #111 Bán lẻ/Dịch vụ đời sống khác; #118 Chất bán dẫn/Chip; #132 Tư vấn/Phân tích chuyên môn; #139 Dược/Y tế/Sức khoẻ/Công nghệ sinh học khác; #145 Nghiên cứu người dùng; #147 Thiết kế khác; #152 Nhà hàng/Khách sạn/Du lịch khác; #162 Hàng hải; #163 NGO/Phi chính phủ/Phi lợi nhuận.
