---
title: Báo Cáo Triển Khai Giao Diện 2 Khối (Split View) Cho Trang Việc Làm EasyCV
version: 1.2.0
status: completed_and_verified
created: 2026-09-30
updated: 2026-09-30
module: bmm
panel:
  - John (Product Manager)
  - Sally (UX/UI Designer)
  - Winston (System Architect)
  - Amelia (Senior Developer)
---

# BÁO CÁO TRIỂN KHAI GIAO DIỆN 2 KHỐI (SPLIT VIEW) CHO TRANG VIỆC LÀM EASYCV

## 1. Yêu Cầu Của Người Dùng (User Requirement)

> *"Sau khi người dùng điền nội dung của vị trí việc làm, ... và nhấn nút tìm kiếm thì mở ra trang chứa list job, khi click vào thẻ job (không phải click thẳng vào tên job) thì mở ra trang chứa 2 khối chính, bên phải là danh sách job, bên trái là mô tả job đó"*

---

## 2. Phân Tích & Giải Pháp Kiến Trúc (Architecture & UX Design)

Dựa trên phương pháp luận **BMAD (BMM Method)** và quy chuẩn nhận diện thương hiệu EasyCV, đội ngũ chuyên gia đã thiết lập hành trình người dùng (User Flow) tối ưu:

```mermaid
graph TD
    A["Trang chủ index.html<br/>Điền vị trí, địa điểm..."] -->|Bấm 'Tìm việc ngay' hoặc Enter| B["Trang kết quả viec-lam.html<br/>(Trang chứa list job)"]
    B -->|Click thẳng vào Tên Job| C["Mở tab riêng chi-tiet-viec-lam.html?id=...<br/>(Toàn trang chi tiết)"]
    B -->|Click vào Thẻ Job<br/>(vùng thân/thông tin card)| D["Kích hoạt chế độ 2 Khối Chính<br/>(Split-View Layout)"]
    D --> E["BÊN TRÁI: Danh sách job (#splitListPane, 460px)<br/>Scrollable Feed, Card đang xem được highlight cam & badge '👁 Đang xem'"]
    D --> F["BÊN PHẢI: Mô tả job đó (#splitDetailPane, 1fr)<br/>Sticky JD, Quick Metrics, Yêu cầu, Quyền lợi, Skills, Apply Bar"]
    E -->|Click card khác trong danh sách bên trái| F["Cập nhật ngay Mô tả job bên phải<br/>(Không cần reload trang)"]
    F -->|Click '← Quay lại dạng lưới'| B
```

### 2.1. Phân biệt tương tác Click trên Job Card:
1. **Click thẳng vào tên công việc (`.job-title-link`):**
   - Đóng vai trò là một liên kết điều hướng trực tiếp (`<a href="chi-tiet-viec-lam.html?id=..." target="_blank">`).
   - Mở trang chi tiết độc lập toàn màn hình sang một tab mới.
2. **Click vào bất kỳ vị trí nào khác trên Job Card (vùng thân card, padding, thông tin công ty, lương...):**
   - Không chuyển trang mà kích hoạt ngay chế độ **Giao diện 2 khối chính (2-Block Split View)**:
     - **Bên trái:** Danh sách các công việc (`#splitListPane`, 460px) dạng cuộn dọc (scrollable feed), thẻ công việc đang chọn được viền cam đậm (`#F97316`), nền cam nhạt gradient và huy hiệu `👁 Đang xem`.
     - **Bên phải:** Khối mô tả chi tiết công việc (`#splitDetailPane`, 1fr) dạng cố định (sticky) với đầy đủ thông tin: Logo, Tiêu đề, Công ty, Điểm tương thích AI Match, Mức lương, 4 ô thông số tóm tắt (Lương, Kinh nghiệm, Cấp bậc, Hình thức), JD chi tiết, Yêu cầu ứng viên, Quyền lợi, Kỹ năng, Thông tin công ty và thanh nút ứng tuyển cố định.
3. **Nút chuyển đổi chế độ xem (View Mode Toggles):**
   - Bổ sung nhóm nút `[⊞ Dạng lưới]` và `[◫ 2 Cột (List + Chi tiết)]` ngay trên thanh công cụ kết quả để ứng viên có thể chủ động chuyển qua lại giữa 2 chế độ hiển thị bất kỳ lúc nào.
4. **Hỗ trợ URL Query Parameter & Browser History:**
   - Khi chọn việc làm ở chế độ 2 khối, URL tự động cập nhật `viec-lam.html?jobId=...` thông qua `window.history.pushState`.
   - Hỗ trợ lưu trữ bookmark, chia sẻ link trực tiếp và điều hướng Back/Forward trên trình duyệt.

---

## 3. Danh Mục Các Tệp Mã Nguồn Đã Triển Khai (Source Code Changes)

| Tệp tin | Loại thay đổi | Chi tiết chức năng |
| :--- | :--- | :--- |
| [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) | Markup HTML | Thêm ID `#jobDefaultLayout`, thêm cụm nút chuyển chế độ xem `btnViewGrid`/`btnViewSplit`, và thêm cấu trúc `#jobSplitContainer` chứa 2 khối: `#splitListPane` (trái, 460px) và `#splitDetailPane` (phải, 1fr). |
| [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) | Styling CSS | Định nghĩa bố cục lưới `.job-split-container` (`460px minmax(0, 1fr)`), kiểu dáng thẻ chọn `.split-job-card.is-selected`, huy hiệu `👁 Đang xem`, thanh cuộn feed bên trái và khu vực chi tiết bên phải. |
| [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) | Logic JS | Thêm `openSplitView()`, `closeSplitView()`, `renderSplitDetail()`, `renderSplitList()`, xử lý phân tách click giữa tên job và thẻ job, đồng bộ URL `jobId`. |
| [`chi-tiet-viec-lam.html`](file:///d:/master%20page/chi-tiet-viec-lam.html) | Trang mới | Trang chi tiết độc lập mở ra khi click tên việc làm, có bố cục 2 khối (Khối trái: danh sách liên quan 460px; Khối phải: chi tiết tuyển dụng 1fr) và nút chuyển xem toàn trang. |
| [`js/chi-tiet-viec-lam.js`](file:///d:/master%20page/js/chi-tiet-viec-lam.js) | Script mới | Khởi tạo hiển thị dữ liệu job theo `?id=...`, chuyển đổi job động khi click danh sách liên quan và hỗ trợ nút xem toàn trang. |
| [`vercel.json`](file:///d:/master%20page/vercel.json) | Config | Thêm quy tắc định tuyến sạch `/chi-tiet-viec-lam` -> `/chi-tiet-viec-lam.html`. |

---

## 4. Kết Quả Kiểm Thử Nghiệm Thu (Verification Matrix)

Bộ kiểm thử tự động Node.js đã thực thi xác thực 100% các tiêu chí:

| STT | Kịch bản kiểm thử | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :---: |
| 1 | Click thẳng vào tên Job (`.job-title-link`) | Trình duyệt mở `chi-tiet-viec-lam.html?id=...` trong tab mới | **PASS** |
| 2 | Click vào vùng thân thẻ Job (`.job-card`) | Ẩn giao diện lưới `#jobDefaultLayout`, mở giao diện 2 khối `#jobSplitContainer` | **PASS** |
| 3 | Vị trí các khối trong giao diện 2 khối | Khối trái: Danh sách job (`#splitListPane`, 460px)<br/>Khối phải: Mô tả job (`#splitDetailPane`, 1fr) | **PASS** |
| 4 | Trạng thái thẻ đang chọn ở danh sách bên trái | Thẻ được viền cam đậm (`#F97316`), nền cam nhạt gradient và có huy hiệu `👁 Đang xem` | **PASS** |
| 5 | Tương tác chọn thẻ khác trong danh sách bên trái | Bấm vào thẻ khác lập tức cập nhật toàn bộ JD khối bên phải không cần reload | **PASS** |
| 6 | Nút "← Quay lại dạng lưới" và nút "Dạng lưới" | Thu gọn chế độ 2 khối, hiển thị lại giao diện lưới tiêu chuẩn kèm bộ lọc sidebar | **PASS** |
| 7 | Đồng bộ URL `?jobId=...` | URL cập nhật tức thì, hỗ trợ chia sẻ link và Back/Forward trình duyệt | **PASS** |
| 8 | Hành động Ứng tuyển & Lưu tin trong khối chi tiết | Phản hồi thông báo Toast trực quan, lưu trạng thái vào `localStorage` | **PASS** |

---

*Hội đồng BMAD nghiệm thu tính năng hoàn thành — Sẵn sàng bàn giao cho người dùng.*
