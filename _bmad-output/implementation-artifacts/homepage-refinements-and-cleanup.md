# Tài Liệu Triển Khai: Tinh Gọn Giao Diện Trang Chủ EasyCV (Homepage Refinements)

## 1. Yêu Cầu & Quyết Định Kỹ Thuật

Trang chủ EasyCV (`index.html`) được tinh chỉnh theo 4 mục tiêu nhằm tối ưu trải nghiệm người dùng, giảm tải thông tin thứ yếu và tăng cường tính trực quan:

1. **Gỡ bỏ 2 khối phụ:** "Khóa học nâng cao kỹ năng" (`#goi-y-khoa-hoc`) và "Sự kiện tuyển dụng" (`#goi-y-su-kien`).
2. **Gỡ bỏ dòng chú thích (subtitle) bên dưới các tiêu đề lớn:** Cụ thể ở 2 khối "Công ty nổi bật" và "Việc làm phù hợp với bạn" để giao diện thoáng, tinh gọn, hiện đại và tập trung ngay vào nội dung thẻ việc làm / doanh nghiệp.
3. **Cập nhật nội dung thông điệp gợi ý hoàn thiện hồ sơ:** Trong khối "Việc làm phù hợp với bạn", sửa câu hướng dẫn thành:
   > *"Cập nhật hồ sơ để tăng cơ hội nhận lời mời phỏng vấn trực tiếp từ HR."*
4. **Cập nhật tab điều hướng việc làm:** Trong khối "Việc làm phù hợp với bạn", đổi nhãn tab đầu tiên từ "Gợi ý AI thông minh" sang "Tất cả".

---

## 2. Bảng Ma Trận Thay Đổi Chi Tiết

| Thành phần / Vị trí | Tệp tin tác động | Trạng thái trước | Trạng thái sau cập nhật |
| :--- | :--- | :--- | :--- |
| **Khối Khóa học** | `index.html`<br>`public/index.html` | Section `#goi-y-khoa-hoc` chứa 4 thẻ khóa học đối tác | Đã gỡ bỏ hoàn toàn khỏi DOM |
| **Khối Sự kiện** | `index.html`<br>`public/index.html` | Section `#goi-y-su-kien` chứa 3 thẻ webinar / job fair | Đã gỡ bỏ hoàn toàn khỏi DOM |
| **Subtitle "Công ty nổi bật"** | `index.html`<br>`public/index.html` | `<p class="section-subtitle">Khám phá doanh nghiệp uy tín và cơ hội việc làm phù hợp với bạn.</p>` | Đã gỡ bỏ, chỉ giữ lại thẻ `<h2 class="section-title">Công ty nổi bật</h2>` |
| **Subtitle "Việc làm phù hợp với bạn"** | `index.html`<br>`public/index.html` | `<p class="section-subtitle">Thuật toán AI đối chiếu tự động kinh nghiệm...</p>` | Đã gỡ bỏ, chỉ giữ lại thẻ `<h2 class="section-title">Việc làm phù hợp với bạn</h2>` |
| **Thông điệp hồ sơ AI** | `index.html`<br>`public/index.html` | "Bổ sung thêm 1 chứng chỉ ngoại ngữ hoặc dự án gần nhất để tăng thêm 40% cơ hội..." | "Cập nhật hồ sơ để tăng cơ hội nhận lời mời phỏng vấn trực tiếp từ HR." |
| **Tab lọc việc làm** | `index.html`<br>`public/index.html` | `<button class="matching-tab-btn active" data-tab="all">...<span>Gợi ý AI thông minh</span></button>` | `<button class="matching-tab-btn active" data-tab="all">...<span>Tất cả</span></button>` |

---

## 3. Danh Sách Tệp Đã Chỉnh Sửa Đồng Bộ
- [`index.html`](file:///d:/master%20page/index.html)
- [`public/index.html`](file:///d:/master%20page/public/index.html)
- [`_bmad-output/planning-artifacts/.memlog.md`](file:///d:/master%20page/_bmad-output/planning-artifacts/.memlog.md)

---

## 4. Kết Quả Kiểm Thử (Verification)
1. **Kiểm thử tự động mã nguồn & Server:**
   - Đã chạy kiểm thử HTTP request trực tiếp tới `http://localhost:3000/index.html`: Xác nhận toàn bộ 4 điều kiện đều đạt chuẩn (Status 200, PASS 100%).
2. **Kiểm thử giao diện thực tế (Headless Chrome):**
   - Đã kết xuất ảnh chụp giao diện màn hình lớn 1440px (`scratch/homepage_updated_verification.png` và `scratch/homepage_bottom_verification.png`).
   - Khối "Công ty nổi bật" và "Việc làm phù hợp với bạn" có tiêu đề thoáng đãng, cân đối hoàn hảo trên thẻ nội dung.
   - Tab "Tất cả" hiển thị rõ ràng, giữ nguyên trạng thái active và icon AI.
   - Trang kết nối liền mạch từ khu vực mẫu CV (`.cv-template-section`) trực tiếp sang khối ngành nghề phổ biến (`#tu-khoa-pho-bien`).
