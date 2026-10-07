# Báo Cáo Kỹ Thuật: Đồng Bộ Biểu Tượng Lưu (Trái Tim) & Căn Chỉnh Nằm Phía Dưới Mức Lương

- **Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình**: Danh sách việc làm (`viec-lam.html`) & Máy chủ cục bộ (`http://localhost:3000/viec-lam.html`)
- **Ngày thực hiện**: 05/10/2026
- **Trạng thái**: Hoàn thành 100% & Đã kiểm thử tự động toàn diện (PASS)

---

## 1. Yêu Cầu & Bối Cảnh Người Dùng (User Requirement & Context)

Người dùng yêu cầu qua 2 chỉ đạo trực quan:

1. _"trong các thẻ job, cho biểu tượng lưu job lên phía trên như trong ảnh tôi mô tả và đổi nó thành biểu tượng trái tym cho đồng bộ với các thẻ job ở màn khác"_
2. _"cho bên dưới tiền chứ sao lại cho bên cạnh tiền làm gì"_

### Ma Trận Lỗi & Giải Pháp (Bug Matrix & Technical Solution):

| Vấn đề ban đầu                                    | Nguyên nhân kỹ thuật                                                            | Giải pháp triển khai                                                                                                             | Kết quả kiểm thử                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Icon bookmark ribbon nằm ở đáy thẻ                | DOM ban đầu đặt `.btn-card-bookmark` trong `.job-card-bottom .job-card-actions` | Dời `.btn-card-bookmark` lên `.job-badges-group` ở góc trên bên phải                                                             | 25/25 thẻ tĩnh và toàn bộ thẻ động đều có nút lưu ở góc trên (PASS)        |
| Icon hình ruy băng lệch chuẩn nhận diện           | Thẻ SVG dùng path `m19 21-7-4-7 4V5...` thay vì trái tim                        | Thay thế 100% bằng Lucide SVG trái tim `M19 14c1.49-1.46...` đồng bộ với Trang chủ                                               | Icon trái tim chuẩn xác, hover đỏ hồng, active tô đặc đỏ (PASS)            |
| Trái tim bị nằm **ngang hàng bên cạnh** mức lương | `.job-badges-group` ban đầu dùng `flex-direction: row; align-items: center;`    | Đổi `.job-badges-group` thành `flex-direction: column; align-items: flex-end; gap: 8px;`, bọc mức lương trong `.job-salary-wrap` | Trái tim nằm **ngay phía dưới** mức lương, căn phải thẳng hàng 100% (PASS) |
| Cache trình duyệt vẫn hiển thị giao diện cũ       | Trình duyệt lưu cache file tĩnh `.css` và `.js`                                 | Bổ sung critical CSS inline trong `<head>`, nâng cache buster lên `?v=11.0_heart_below_salary`                                   | Trình duyệt luôn tải layout mới nhất ngay lập tức (PASS)                   |

---

## 2. Giải Pháp Bố Cục 2 Tầng (2-Tier Badges Layout)

1. **Bố cục góc trên bên phải thẻ job (`.job-badges-group`)**:
   - **Tầng 1 (Trên)**: `.job-salary-wrap` chứa huy hiệu mức lương (ví dụ: `55 - 80 triệu`) và huy hiệu khớp tìm kiếm (nếu có: `✨ Khớp tìm kiếm`).
   - **Tầng 2 (Dưới)**: Nút Lưu hình trái tim (`.btn-card-bookmark`), kích thước tròn 32x32px, căn lề phải thẳng tắp (`align-items: flex-end`), cách mức lương đúng 8px.
   - Nút trái tim nằm đối xứng ngang hàng với tên công ty (`.job-company-row`), lấp đầy khoảng trống thị giác một cách tự nhiên và cân đối hoàn hảo với logo 100x100px bên trái.

2. **Quy tắc CSS cốt lõi**:

   ```css
   .job-title-row {
     display: flex;
     align-items: flex-start;
     justify-content: space-between;
     gap: 12px;
     margin-bottom: 6px;
   }
   .job-badges-group {
     display: flex;
     flex-direction: column;
     align-items: flex-end;
     gap: 8px;
     flex-shrink: 0;
   }
   .job-salary-wrap {
     display: flex;
     align-items: center;
     gap: 8px;
   }
   @media (max-width: 768px) {
     .job-badges-group {
       flex-direction: row !important;
       align-items: center !important;
       justify-content: space-between !important;
       width: 100% !important;
     }
     .job-salary-wrap {
       display: flex !important;
       align-items: center !important;
       gap: 6px !important;
     }
   }
   ```

3. **Cập nhật Template Render Động (`renderCurrentPage()` trong `js/viec-lam.js`)**:
   ```javascript
   <div class="job-badges-group">
     <div class="job-salary-wrap">
       $
       {job._isSearchMatch
         ? `<span class="badge-search-match" title="Việc làm khớp chính xác với tiêu chí tìm kiếm">✨ Khớp tìm kiếm</span>`
         : ''}
       <span class="job-salary-badge ${salaryOrangeClass}">
         ${job.salaryBadge}
       </span>
     </div>
     <button
       type="button"
       class="btn-card-bookmark ${isSaved ? 'saved' : ''}"
       data-id="${job.id}"
       aria-label="Lưu công việc"
       title="${isSaved ? 'Đã Lưu' : 'Lưu công việc'}"
     >
       <svg
         width="17"
         height="17"
         viewBox="0 0 24 24"
         fill="${isSaved ? 'currentColor' : 'none'}"
         stroke="currentColor"
         stroke-width="2"
       >
         <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
       </svg>
     </button>
   </div>
   ```

---

## 3. Danh Sách Tệp Đã Chỉnh Sửa & Đồng Bộ

| STT | Tệp tin                                                                       | Mô tả thay đổi                                                                                                                                           |
| --- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [`viec-lam.html`](file:///d:/master%20page/viec-lam.html)                     | Bổ sung inline critical CSS căn chỉnh dọc, bọc 25 thẻ mức lương vào `.job-salary-wrap`, nâng cache buster `?v=11.0_heart_below_salary`.                  |
| 2   | [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html)       | Đồng bộ 100% với `viec-lam.html`.                                                                                                                        |
| 3   | [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css)               | Đặt `.job-title-row { align-items: flex-start; }`, `.job-badges-group { flex-direction: column; align-items: flex-end; gap: 8px; }`, `.job-salary-wrap`. |
| 4   | [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css) | Đồng bộ 100% với `css/viec-lam.css`.                                                                                                                     |
| 5   | [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js)                   | Cập nhật template thẻ job trong `renderCurrentPage()` bọc mức lương vào `.job-salary-wrap` và đặt nút trái tim phía dưới.                                |
| 6   | [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js)     | Đồng bộ 100% với `js/viec-lam.js`.                                                                                                                       |

---

## 4. Kết Quả Kiểm Thử Toàn Diện (Pure Production CDP Verification)

Kiểm thử tự động được thực hiện qua Chrome Headless CDP trực tiếp trên máy chủ `http://localhost:3000/viec-lam.html` không có bất kỳ style tiêm tạm thời nào:

1. **Đo đạc tọa độ pixel thẻ Card 15 (Masan Consumer)**:
   - `salaryRight`: 914.5px
   - `bookmarkRight`: 914.5px (Căn phải thẳng hàng 100%)
   - `salaryBottom`: 1740.75px
   - `bookmarkTop`: 1748.75px (`isDirectlyBelow: true`, khoảng cách đứng chính xác `8px`)
   - `companyRowTop`: 1786.75px
2. **Kiểm tra click toggle Lưu**:
   - Nút nhận class `.saved`, `fill="currentColor"`, hiển thị Toast: `❤️ Đã lưu "Trưởng Phòng Kinh Doanh Toàn Quốc (Sales Director)" vào mục yêu thích!`: **PASS**
3. **Kiểm tra Tìm kiếm Động (`?keyword=React`)**:
   - Cả 3 thẻ khớp tìm kiếm hiển thị huy hiệu `✨ Khớp tìm kiếm` cùng mức lương ở hàng trên, nút trái tim nằm ngay phía dưới mức lương thẳng hàng mép phải: **PASS**
4. **Kiểm tra Responsive Tablet (850px) & Mobile (390px)**:
   - Trên màn hình 850px: tiêu đề và các badge co giãn tự nhiên không bị tràn khung hay chèn ép chữ: **PASS**
   - Trên màn hình di động: mức lương bên trái, nút trái tim bên phải đối xứng, nút ứng tuyển ở đáy thẻ: **PASS**
5. **Hình ảnh nghiệm thu trực quan**:
   - Ảnh chụp Pure Production Desktop: `scratch/pure_prod_desktop.png`
   - Ảnh chụp Pure Production Hover: `scratch/pure_prod_hover.png`
   - Ảnh chụp Pure Production Search React: `scratch/pure_prod_search_react.png`
   - Ảnh chụp Tablet 850px: `scratch/test_tablet_opt1.png`
