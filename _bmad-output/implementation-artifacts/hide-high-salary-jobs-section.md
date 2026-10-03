# Đặc Tả Kỹ Thuật: Ẩn Khối Việc Làm Lương Cao Trên Trang Chủ

## 1. Bối Cảnh & Yêu Cầu
- **Yêu cầu người dùng:** Tại trang chủ (`index.html`), ẩn khối **"Việc làm lương cao"** (`#viec-lam-hap-dan` / `.attractive-jobs-section`).
- **Mục tiêu UX/UI:**
  - Tinh gọn trải nghiệm trang chủ, tránh cảm giác lặp lại giữa các khối danh sách việc làm.
  - Chuyển tiếp liền mạch từ khối **"Việc làm nổi bật"** (`#viec-lam-noi-bat`) sang **"Công ty nổi bật"** (`#cong-ty-tieu-bieu`).
  - Đảm bảo an toàn DOM và Script, bảo lưu dữ liệu và cấu trúc để có thể tái sử dụng hoặc mở lại trong tương lai mà không làm hỏng layout.

---

## 2. Giải Pháp Kỹ Thuật

| Hạng mục | Tệp tác động | Chi tiết triển khai |
| :--- | :--- | :--- |
| **HTML Markup** | `index.html`<br>`public/index.html` | Thêm thuộc tính `style="display: none !important;" hidden aria-hidden="true"` vào `<section id="viec-lam-hap-dan">`. Ẩn hoàn toàn khỏi Accessibility Tree và Render Tree. |
| **CSS Stylesheet** | `css/home.css`<br>`public/css/home.css` | Khai báo quy tắc `.attractive-jobs-section { display: none !important; }` để đảm bảo không bị giật khung hình (zero FOUC) khi tải trang. |
| **JavaScript Controller** | `js/home.js`<br>`public/js/home.js` | Nâng cấp hàm `createJobPaginator()` kiểm tra điều kiện an toàn: `if (!section || section.hidden || getComputedStyle(section).display === 'none') return null;`, tránh khởi tạo phân trang hoặc gắn sự kiện DOM không cần thiết. |

---

## 3. Kết Quả Kiểm Thử (Verification)

Kịch bản kiểm thử tự động qua Chrome DevTools Protocol (`scratch/verify_hide_luong_cao.js`) tại `http://localhost:3000/index.html`:

| Tiêu chí kiểm tra | Kỳ vọng | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Trạng thái phần tử `#viec-lam-hap-dan`** | `display: "none"`, `height: 0`, `offsetParent: false` | `display: "none"`, `height: 0`, `offsetParent: false`, `hidden: true` | ✅ ĐẠT |
| **Thứ tự khối hiển thị trên Trang chủ** | Việc làm nổi bật ➔ Công ty nổi bật ➔ Infeed VIP Ad ➔ Việc làm phù hợp | Khớp 100% luồng chuẩn | ✅ ĐẠT |
| **Visual Regression / Layout Transition** | Không có khoảng trắng thừa, không bể layout, viền ngăn cách chuẩn | Ảnh nghiệm thu `scratch/section_transition_verification.png` hiển thị mượt mà | ✅ ĐẠT |
| **Đồng bộ hóa thư mục `public/`** | 100% khớp mã nguồn với thư mục gốc | Khớp hoàn toàn cả HTML, CSS, JS | ✅ ĐẠT |
