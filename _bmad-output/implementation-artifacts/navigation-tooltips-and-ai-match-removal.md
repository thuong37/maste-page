# Tài Liệu Triển Khai: Tooltip Chuẩn (Native Title Trực Tiếp) & Loại Bỏ "AI Match"

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày cập nhật:** 04/10/2026  
**Trạng thái:** Hoàn thành & Đã kiểm thử tự động đạt 100%

---

## 1. Yêu Cầu Người Dùng

Người dùng chỉ đạo cụ thể:
- *"đừng dùng từ hoa mỹ làm gì, dùng đúng từ đang được chỉ thôi"*
- Tooltip hiển thị khi hover là tooltip tiêu chuẩn của trình duyệt (`title="..."`).
- Nội dung tooltip **chính xác 100% là tên/nhãn của mục đang được hover**, không dùng các câu mô tả hay từ ngữ hoa mỹ.
- Loại bỏ hoàn toàn huy hiệu `AI Match` cạnh mục "Việc làm gợi ý".

---

## 2. Danh Sách Thuộc Tính `title` Áp Dụng (Khớp 1:1 Với Nhãn)

### 2.1. Thanh menu chính (.nav-link)
- **Tìm việc:** `title="Tìm việc"`
- **Hồ sơ & CV:** `title="Hồ sơ & CV"`
- **Ứng tuyển:** `title="Ứng tuyển"`
- **Công cụ nghề nghiệp:** `title="Công cụ nghề nghiệp"`

### 2.2. Các mục trong dropdown (.dropdown-item)
- **Menu Tìm việc:**
  - *Tìm kiếm việc làm:* `title="Tìm kiếm việc làm"`
  - *Việc làm gợi ý:* `title="Việc làm gợi ý"` *(đã bỏ badge AI Match)*
  - *Việc làm đã lưu:* `title="Việc làm đã lưu"`
  - *Khám phá công ty:* `title="Khám phá công ty"`
- **Menu Hồ sơ & CV:**
  - *Hồ sơ của tôi:* `title="Hồ sơ của tôi"`
  - *Tạo CV theo mẫu:* `title="Tạo CV theo mẫu"`
  - *Quản lý CV:* `title="Quản lý CV"`
  - *Tải lên CV:* `title="Tải lên CV"`
- **Menu Ứng tuyển:**
  - *Danh sách đơn ứng tuyển:* `title="Danh sách đơn ứng tuyển"`
  - *Lịch phỏng vấn:* `title="Lịch phỏng vấn"`
  - *Bài kiểm tra năng lực:* `title="Bài kiểm tra năng lực"`
- **Menu Công cụ nghề nghiệp:**
  - *Tính lương Gross - Net:* `title="Tính lương Gross - Net"`
  - *Tính bảo hiểm xã hội:* `title="Tính bảo hiểm xã hội"`
  - *Báo cáo thị trường lương:* `title="Báo cáo thị trường lương"`
  - *Trắc nghiệm MBTI / DISC:* `title="Trắc nghiệm MBTI / DISC"`

---

## 3. Danh Sách Tệp Đã Cập Nhật & Đồng Bộ

- [`index.html`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/index.html) & [`public/index.html`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/public/index.html)
- [`viec-lam.html`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/viec-lam.html) & [`public/viec-lam.html`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/public/viec-lam.html)
- [`chi-tiet-viec-lam.html`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/chi-tiet-viec-lam.html) & [`public/chi-tiet-viec-lam.html`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/public/chi-tiet-viec-lam.html)
- `scratch/nav_template.js`

---

## 4. Kết Quả Kiểm Thử (Verification)

Kịch bản kiểm thử tự động Chrome CDP Headless ([`scratch/verify_cdp_titles.js`](file:///d:/ThuongNV_EasyCV_Tài%20liệu/master%20page/scratch/verify_cdp_titles.js)):
- 100% các phần tử có `title === name` (trùng khớp tuyệt đối 1:1, không câu chữ thừa).
- Không còn badge "AI Match" trên thanh menu.
