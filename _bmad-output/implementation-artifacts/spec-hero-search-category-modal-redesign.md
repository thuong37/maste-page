# Đặc Tả Kỹ Thuật: Nâng Cấp Trải Nghiệm Bộ Lọc Danh Mục Nghề (Hero Search Category Modal)

**Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện:** 06/10/2026  
**Trạng thái:** ✅ Đã hoàn thành & Kiểm thử tự động CDP vượt qua 100%

---

## 1. Yêu Cầu Người Dùng (Requirements)
1. **Hover Nhóm nghề:** Khi di chuột (hover/mouseenter) vào từng nhóm nghề ở cột trái, hệ thống tự động hiển thị danh sách "Nghề" và "Vị trí chuyên môn" tương ứng ở cột phải mà không ép buộc người dùng phải click chọn checkbox.
2. **Căn lề chuẩn xác:** Căn lề lại các vị trí chuyên môn của hàng "Được tìm kiếm nhiều" và các hàng nghề khác sao cho thẳng hàng tuyệt đối 100% theo trục dọc.
3. **Chế độ tìm kiếm chuyển đổi (Search View Mode chuẩn TopCV):** Khi người dùng nhấn/focus vào ô search, modal chuyển đổi giao diện sang chế độ tìm kiếm toàn chiều ngang (Search Mode 1 cột): hiển thị gợi ý tìm kiếm phổ biến và nhóm ngành hot khi ô nhập trống; hiển thị kết quả tìm kiếm đa cấp kèm breadcrumb `[Nhóm nghề] > [Nghề]` và highlight vị trí chuyên môn khi gõ từ khóa; hỗ trợ nút "Quay lại danh mục" để khôi phục giao diện 2 cột ban đầu.
4. **Không neo khối Được tìm kiếm nhiều khi cuộn:** Đưa khối "Được tìm kiếm nhiều" vào bên trong container cuộn của khu vực nghề, khi người dùng cuộn chuột thì khối này cuộn lên cùng nội dung tự nhiên, không bị ghim cứng (pinned/sticky) ở trên đỉnh như trước.
5. **Áp dụng bộ lọc ngay lập tức khi nhấn "Chọn":** Khi người dùng nhấn nút "Chọn", hệ thống lập tức áp dụng danh sách lọc đó vào màn tra cứu việc làm (điều hướng từ Trang chủ hoặc Chi tiết việc làm sang `viec-lam.html?category=...&industry=...`, hoặc kích hoạt bộ lọc và cuộn mượt đến danh sách việc làm trên `viec-lam.html`).

---

## 2. Bảng Ma Trận Giải Pháp Kỹ Thuật (Technical Matrix)

| Hạng mục | Trước khi sửa | Giải pháp triển khai | Kết quả kiểm thử |
|---|---|---|---|
| **Hover xem Nghề** | Phải click chuột vào hàng mới đổi giao diện cột phải | Bổ sung sự kiện `mouseenter` trên từng `.category-group-item`, cập nhật `activeCategoryKey` và render lại cột phải tức thì | ✅ Hover Marketing hiển thị 3 phân nhóm marketing, checkbox không bị tự chọn |
| **Căn lề thẻ chuyên môn** | Khối Được tìm kiếm nhiều không có gap, padding lệch 10px khiến chip bắt đầu lệch ~25px so với các hàng dưới | Đồng bộ layout Grid `220px minmax(0, 1fr)` với `gap: 16px`, `padding: 14px 0` giữa header, Được tìm kiếm nhiều và tất cả hàng con | ✅ Tọa độ ngang của chip và pill trùng khớp 100% (`popChipLeft: 638px`, `pillLeft: 638px`, `deltaX: 0px`) |
| **Ghim cuộn Được tìm kiếm nhiều** | Khối Được tìm kiếm nhiều nằm ngoài container cuộn, bị neo cố định ở đỉnh | Đưa `#categoryPopularWrap` vào làm phần tử đầu tiên của container cuộn `#categorySubgroupList` | ✅ Khi cuộn 150px, khối cuộn lên tự nhiên (`initialTop: 334px -> scrolledTop: 184px`) |
| **Giao diện Search Mode** | Giữ nguyên 2 cột chật chội, chỉ lọc cục bộ ở cột phải | Thêm class `.is-searching` cho dialog: ẩn cột trái, mở rộng 100% chiều ngang, bổ sung gợi ý từ khóa khi trống và kết quả kèm breadcrumb khi gõ | ✅ Focus hiển thị 25 thẻ gợi ý; gõ "Sales" hiển thị 6 nhóm kết quả toàn chiều ngang |
| **Hành vi nút "Chọn"** | Trang chủ chỉ cập nhật label nút bấm, người dùng phải bấm thêm nút "Tìm việc ngay" | Lắng nghe `easycv:category-applied` và tự động gọi `executeSearch()` chuyển hướng ngay sang `viec-lam.html` | ✅ Chọn danh mục và click "Chọn" lập tức áp dụng và chuyển trang |

---

## 3. Danh Sách Tệp Cập Nhật & Đồng Bộ (Files Modified)

- `css/category-filter-modal.css` ⇄ `public/css/category-filter-modal.css`
- `js/category-filter-modal.js` ⇄ `public/js/category-filter-modal.js`
- `index.html` ⇄ `public/index.html`
- `viec-lam.html` ⇄ `public/viec-lam.html`
- `chi-tiet-viec-lam.html` ⇄ `public/chi-tiet-viec-lam.html`
- `js/home.js` ⇄ `public/js/home.js`
- `js/viec-lam.js` ⇄ `public/js/viec-lam.js`
- `js/chi-tiet-viec-lam.js` ⇄ `public/js/chi-tiet-viec-lam.js`

---

## 4. Hình Ảnh & Minh Chứng Kiểm Thử Tự Động (Verification Proof)
- `scratch/category_modal_unscrolled_aligned.png`: Căn lề thẳng hàng tuyệt đối (`deltaX = 0px`) giữa khối Được tìm kiếm nhiều và các nghề con.
- `scratch/category_search_mode_focused.png`: Giao diện Search Suggestions Mode khi click vào ô search.
- `scratch/category_search_mode_results.png`: Giao diện Search Results toàn màn hình kèm breadcrumb danh mục.
