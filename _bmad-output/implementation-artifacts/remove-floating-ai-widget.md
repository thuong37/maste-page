# Tài Liệu Kỹ Thuật: Loại Bỏ Nút Nổi "Gợi ý AI (x việc mới)"

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Thời gian thực hiện:** 2026-10-07  
**Yêu cầu:** Loại bỏ nút floating widget "Gợi ý AI (x việc mới)" xuất hiện ở góc dưới bên phải màn hình Trang chủ (`index.html`).

---

## 1. Bối Cảnh & Phân Tích Hiện Trạng

- **Phần tử giao diện:** Nút bấm pill màu cam nổi góc phải màn hình (`.floating-ai-btn`), chứa chấm tín hiệu xung nhịp màu xanh lá (`.floating-ai-pulse-dot`), biểu tượng tia sáng ✦ và nhãn text `"Gợi ý AI (3 việc mới)"`.
- **Thành phần đi kèm:** Hộp thoại popover hiển thị danh sách việc làm phù hợp khớp hồ sơ (`.floating-ai-popover`).
- **Tác động:** Widget cố định tại `bottom: 30px; right: 30px` che khuất một phần nội dung và không còn cần thiết trên giao diện Trang chủ mới.

---

## 2. Giải Pháp Triển Khai

1. **Loại bỏ Markup:**
   - Xóa bỏ toàn bộ khối thẻ HTML container `.floating-ai-widget` (bao gồm `.floating-ai-popover` và `.floating-ai-btn`) trong cả hai tệp:
     - [index.html](file:///d:/master%20page/index.html)
     - [public/index.html](file:///d:/master%20page/public/index.html)
   - Nâng cache-buster script `home.js` lên phiên bản `v=20261007_remove_floating_ai`.

2. **Dọn dẹp JavaScript:**
   - Gỡ bỏ khối xử lý sự kiện Section 8 (mở/đóng popover khi bấm trigger hoặc bấm bên ngoài) trong:
     - [js/home.js](file:///d:/master%20page/js/home.js)
     - [public/js/home.js](file:///d:/master%20page/public/js/home.js)

---

## 3. Ma Trận Thay Đổi Tệp

| Tệp tin | Vị trí / Section | Thay đổi |
| :--- | :--- | :--- |
| `index.html` | Cuối trang trước thẻ `<script>` | Xóa bỏ khối thẻ `.floating-ai-widget` |
| `public/index.html` | Cuối trang trước thẻ `<script>` | Xóa bỏ khối thẻ `.floating-ai-widget` |
| `js/home.js` | Section 8 | Gỡ bỏ event listeners của `.floating-ai-btn` và `.floating-ai-popover` |
| `public/js/home.js` | Section 8 | Gỡ bỏ event listeners của `.floating-ai-btn` và `.floating-ai-popover` |

---

## 4. Kết Quả Kiểm Thử (Verification)

Chạy kiểm thử tự động CDP qua Chrome Headless (`scratch/verify_floating_ai_removal.js`):
- **Kiểm tra DOM:**
  - `hasWidget`: `false`
  - `hasBtn`: `false`
  - `hasPopover`: `false`
  - `foundAiSuggestionTexts`: `[]` (Không còn văn bản "Gợi ý AI" nào trên trang)
- **Kiểm tra Lỗi JavaScript:** `0 console errors / runtime exceptions`
- **Tính toàn vẹn tệp:** SHA-256 xác nhận 2/2 cặp tệp Root ⇄ Public khớp 100%.
- **Giao diện thực tế:** Góc dưới bên phải trang web hoàn toàn sạch sẽ, thoáng đãng.
