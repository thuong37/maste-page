# Đặc Tả Kỹ Thuật: Chuẩn Hóa Tooltip Logo Thẻ Job & Khối Công Ty Nổi Bật

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện:** 05/10/2026  
**Phương pháp luận:** BMAD (BMM Method)  

---

## 1. Yêu Cầu Người Dùng (User Requirement)
- **Trên các thẻ Job:** Khi hover chuột vào logo công ty, phải hiển thị tooltip với cú pháp:  
  `Công ty [Tên công ty] tuyển dụng tại EasyCV`
- **Riêng đối với khối Công ty nổi bật (`#cong-ty-tieu-bieu`):** Khi hover chuột vào logo công ty, chỉ hiển thị tooltip với cú pháp:  
  `Công ty [Tên công ty]` (không có hậu tố "tuyển dụng tại EasyCV").

---

## 2. Giải Pháp Kỹ Thuật (Technical Solution)

### 2.1 Cơ Chế Tooltip Trình Duyệt Native (`title` attribute)
- Sử dụng thuộc tính native `title="..."` của HTML5:
  - Tương thích tuyệt đối trên 100% trình duyệt web (Chrome, Firefox, Safari, Edge).
  - Không bị che khuất bởi các container có `overflow: hidden` (đặc biệt là carousel xoay vòng của khối công ty).
  - Không làm vỡ layout, không phụ thuộc vào thư viện bên ngoài, tốc độ render tức thì.
- Gắn đồng thời thuộc tính `title` lên cả thẻ bọc ngoài (`.job-logo-wrapper` / `.company-card-logo-wrap`) và phần tử ảnh/logo bên trong (`img.job-logo` / `.company-card-logo-mark`), đảm bảo rê chuột vào bất kỳ điểm nào trong khung logo đều kích hoạt tooltip.

### 2.2 Tương Tác Chuột (Cursor Styling)
- Bổ sung `cursor: pointer;` cho `.job-logo-wrapper` và `.company-card-logo-wrap` trong `css/home.css` (và `public/css/home.css`), tạo cảm giác tương tác mượt mà và trực quan cho người dùng.

### 2.3 Bảo Vệ Runtime Động (`initLogoTooltips()`)
- Trong `js/home.js` (và `public/js/home.js`), xây dựng hàm tự động `initLogoTooltips()`:
  - Duyệt qua toàn bộ `.job-card`: nếu logo chưa có title, tự động đọc tên công ty từ `.company-name` hoặc `alt` để gán `Công ty [Tên] tuyển dụng tại EasyCV`.
  - Duyệt qua `#cong-ty-tieu-bieu .company-card`: tự động đọc tên công ty từ `.company-card-title` để gán `Công ty [Tên]`.
  - Cập nhật tooltip cho các logo trong popup tìm kiếm gần đây (`#searchSuggestDropdown`).

---

## 3. Danh Sách Tệp Mã Nguồn Đã Chỉnh Sửa & Đồng Bộ

| STT | Tệp tin | Nội dung thay đổi |
|---|---|---|
| 1 | `index.html` | Gán `title` chuẩn hóa cho 21 thẻ job (9 nổi bật, 6 hấp dẫn, 6 phù hợp) và 8 thẻ công ty nổi bật |
| 2 | `public/index.html` | Đồng bộ 100% markup `title` giống file gốc |
| 3 | `css/home.css` | Thêm `cursor: pointer;` cho `.job-logo-wrapper` và `.company-card-logo-wrap` |
| 4 | `public/css/home.css` | Đồng bộ 100% CSS `cursor: pointer;` |
| 5 | `js/home.js` | Thêm `title` trong search dropdown + hàm tự động bảo vệ `initLogoTooltips()` |
| 6 | `public/js/home.js` | Đồng bộ 100% JavaScript `initLogoTooltips()` |

---

## 4. Bảng Ma Trận Dữ Liệu Kiểm Thử (Verification Matrix)

### 4.1 Khối Việc Làm Nổi Bật (`#viec-lam-noi-bat`) - 9 Jobs
| # | Tên hiển thị | Tooltip trên Logo Wrapper & Img | Trạng thái |
|---|---|---|:---:|
| 1 | Cổ phần Kiến Trúc Việt | `Công ty Cổ phần Kiến Trúc Việt tuyển dụng tại EasyCV` | **PASS** |
| 2 | Samsung SRV | `Công ty Samsung SRV tuyển dụng tại EasyCV` | **PASS** |
| 3 | FPT Software | `Công ty FPT Software tuyển dụng tại EasyCV` | **PASS** |
| 4 | VNG Corporation | `Công ty VNG Corporation tuyển dụng tại EasyCV` | **PASS** |
| 5 | Techcombank | `Công ty Techcombank tuyển dụng tại EasyCV` | **PASS** |
| 6 | Viettel Digital | `Công ty Viettel Digital tuyển dụng tại EasyCV` | **PASS** |
| 7 | Shopee Vietnam | `Công ty Shopee Vietnam tuyển dụng tại EasyCV` | **PASS** |
| 8 | VinAI Research | `Công ty VinAI Research tuyển dụng tại EasyCV` | **PASS** |
| 9 | MB Bank | `Công ty MB Bank tuyển dụng tại EasyCV` | **PASS** |

### 4.2 Khối Việc Làm Hấp Dẫn (`#viec-lam-hap-dan`) - 6 Jobs
| # | Tên hiển thị | Tooltip trên Logo Wrapper & Img | Trạng thái |
|---|---|---|:---:|
| 1 | One Mount Group | `Công ty One Mount Group tuyển dụng tại EasyCV` | **PASS** |
| 2 | MoMo | `Công ty MoMo tuyển dụng tại EasyCV` | **PASS** |
| 3 | Vinamilk | `Công ty Vinamilk tuyển dụng tại EasyCV` | **PASS** |
| 4 | Techcombank | `Công ty Techcombank tuyển dụng tại EasyCV` | **PASS** |
| 5 | VNG Corporation | `Công ty VNG Corporation tuyển dụng tại EasyCV` | **PASS** |
| 6 | Viettel Digital Solutions | `Công ty Viettel Digital Solutions tuyển dụng tại EasyCV` | **PASS** |

### 4.3 Khối Công Ty Nổi Bật (`#cong-ty-tieu-bieu`) - 8 Công Ty
| # | Tên công ty | Tooltip trên Logo Wrapper & Mark | Trạng thái |
|---|---|---|:---:|
| 1 | FPT Software | `Công ty FPT Software` | **PASS** |
| 2 | VNG Corporation | `Công ty VNG Corporation` | **PASS** |
| 3 | Viettel Digital | `Công ty Viettel Digital` | **PASS** |
| 4 | Techcombank | `Công ty Techcombank` | **PASS** |
| 5 | MoMo | `Công ty MoMo` | **PASS** |
| 6 | Shopee Việt Nam | `Công ty Shopee Việt Nam` | **PASS** |
| 7 | MB Bank | `Công ty MB Bank` | **PASS** |
| 8 | VinAI | `Công ty VinAI` | **PASS** |

### 4.4 Khối Việc Làm Phù Hợp Với Bạn (`#viec-lam-phu-hop`) - 6 Jobs
| # | Tên công ty | Tooltip trên Logo Wrapper & Img | Trạng thái |
|---|---|---|:---:|
| 1 | Shopee | `Công ty Shopee tuyển dụng tại EasyCV` | **PASS** |
| 2 | Tiki Corporation | `Công ty Tiki Corporation tuyển dụng tại EasyCV` | **PASS** |
| 3 | KMS Technology | `Công ty KMS Technology tuyển dụng tại EasyCV` | **PASS** |
| 4 | MB Bank | `Công ty MB Bank tuyển dụng tại EasyCV` | **PASS** |
| 5 | FPT Software | `Công ty FPT Software tuyển dụng tại EasyCV` | **PASS** |
| 6 | VNG Corporation | `Công ty VNG Corporation tuyển dụng tại EasyCV` | **PASS** |

---

## 5. Kết Quả Nghiệm Thu (Sign-off)
- **Tự động hóa:** Script `scratch/verify_tooltips.js` chạy kiểm thử trên cả `index.html` và `public/index.html` đạt tỷ lệ **100% PASS** (29/29 thẻ).
- **Quy tắc bộ nhớ BMAD/AGENTS.md:** Tự động đồng bộ vào `.memlog.md` và tài liệu kỹ thuật hoàn chỉnh.
