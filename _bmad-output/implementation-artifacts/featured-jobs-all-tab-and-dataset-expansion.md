# Bổ Sung Tab "Tất Cả", Chuẩn Hóa Nhãn Tab & Mở Rộng Dữ Liệu Khối Việc Làm Nổi Bật (EasyCV Homepage)

- **Màn hình**: [Trang chủ EasyCV](file:///d:/master%20page/index.html)
- **Khu vực**: Khối "Việc làm nổi bật" (`#viec-lam-noi-bat`)
- **Ngày hoàn thành**: 2026-10-07
- **Phiên bản cache buster**: `home.js?v=20261007_featured_all_tab_v2`

---

## 1. Mục Tiêu & Yêu Cầu Cải Tiến

1. **Bổ sung Tab "Tất cả"**: Đặt làm tab đầu tiên và được kích hoạt mặc định khi vào trang chủ (`data-category="all"`).
2. **Loại bỏ số lượng việc làm trên tất cả các tab còn lại**:
   - Thay vì hiển thị badge số lượng như `"IT-Phần mềm 1820 +"`, chuyển sang tên ngành nghề tinh gọn thuần túy: `"IT - Phần mềm"`, `"Kinh doanh / Bán hàng"`, `"Marketing / PR"`, `"Tài chính / Ngân hàng"`, `"Hành chính / Nhân sự"`.
3. **Mở rộng dữ liệu (Data Expansion) đạt chuẩn 4 hàng thẻ, 2 trang dữ liệu**:
   - Layout grid: 3 cột thẻ x 4 hàng thẻ = **12 thẻ / trang** (`JOBS_PER_PAGE = 12`).
   - Tổng dữ liệu hiển thị cho mỗi tab: **24 việc làm** (Trang 1: 12 thẻ, Trang 2: 12 thẻ => trọn vẹn 2 trang dữ liệu, không có trang thứ 3 lẻ hay khuyết dòng).
   - Tổng kho dữ liệu `FEATURED_JOBS_DATA`: 120 việc làm chất lượng cao (24 việc làm x 5 ngành nghề trọng điểm) từ các doanh nghiệp hàng đầu (Viettel, FPT, VNG, Samsung, Techcombank, MB Bank, Shopee, MoMo, VinFast, Sun Group, Masan, Thế Giới Di Động, SSI, v.v.).

---

## 2. Bảng Ma Trận Thay Đổi (Before vs After)

| Thành phần | Trước khi cập nhật | Sau khi cập nhật | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Tab danh mục** | 5 tabs, bắt đầu bằng "Kinh doanh / Bán hàng" (`sales`) | 6 tabs, bắt đầu bằng tab **"Tất cả"** (`all`) làm mặc định | ✅ ĐẠT |
| **Nhãn số lượng trên tab** | Có badge số lượng: `2,450+`, `1,820+`, `1,240+`... | **Đã loại bỏ 100% số lượng**, tab phẳng gọn gàng thanh thoát | ✅ ĐẠT |
| **Số hàng thẻ hiển thị** | 2 hàng thẻ (chỉ có 6 thẻ trên tab sales) | **4 hàng thẻ chuẩn** (12 thẻ / trang, 3 cột x 4 hàng) | ✅ ĐẠT |
| **Số trang dữ liệu** | 1 trang (bị ẩn thanh phân trang và thanh timer) | **2 trang dữ liệu đầy đủ** (Trang 1: 12 thẻ, Trang 2: 12 thẻ) | ✅ ĐẠT |
| **Thanh phân trang** | Bị ẩn do `totalPages <= 1` | Hiển thị cụm nút `<` `1` `2` `>` căn giữa chuẩn đẹp (**đã loại bỏ dòng đếm ngược 10s**) | ✅ ĐẠT |
| **Cơ chế chuyển trang** | Chuyển tự động sau 10s kèm timer progress | **Chuyển thủ công theo click của người dùng**, tắt timer ngầm tránh lật trang bất ngờ | ✅ ĐẠT |
| **Độ phủ ngành trên tab Tất cả** | Không có tab Tất cả | Tuyển chọn cân bằng các ngành nghề hàng đầu (6 IT, 6 Sales, 4 Marketing, 4 Finance, 4 HR) | ✅ ĐẠT |
| **Độ phủ dữ liệu từng tab ngành** | Chỉ có 6 việc làm / ngành | Mỗi ngành sở hữu trọn vẹn 24 việc làm (chuẩn 2 trang x 12 việc làm) | ✅ ĐẠT |

---

## 3. Danh Sách Tệp Triển Khai (Root ⇄ Public 100% Sync)

| Tệp nguồn | Tệp Public | Chi tiết thay đổi |
| :--- | :--- | :--- |
| [`index.html`](file:///d:/master%20page/index.html) | [`public/index.html`](file:///d:/master%20page/public/index.html) | Bổ sung nút tab "Tất cả" (`data-category="all"`), xóa thẻ `.filter-pill-count` trên toàn bộ các nút tab còn lại; gỡ bỏ khối `#autoPageTimerIndicator`, căn giữa `.featured-jobs-footer-bar`; nâng cache buster `home.js?v=20261007_featured_all_tab_v3`. |
| [`js/home.js`](file:///d:/master%20page/js/home.js) | [`public/js/home.js`](file:///d:/master%20page/public/js/home.js) | Mở rộng `FEATURED_JOBS_DATA` lên 120 việc làm phong phú; đặt `currentCategory = 'all'`; phân bổ cân bằng 24 việc làm cho tab "Tất cả" và đúng 24 việc làm cho từng ngành; gỡ bỏ hoàn toàn logic đếm ngược tự động lật trang 10s. |

---

## 4. Kết Quả Kiểm Thử Tự Động (Chrome Headless CDP)

Kịch bản kiểm thử tự động tại [`scratch/verify_featured_tabs_and_data.js`](file:///d:/master%20page/scratch/verify_featured_tabs_and_data.js):

1. **Kiểm tra trạng thái ban đầu (Tab "Tất cả")**:
   - Số lượng tabs: `6` (Tất cả, Kinh doanh / Bán hàng, IT - Phần mềm, Marketing / PR, Tài chính / Ngân hàng, Hành chính / Nhân sự).
   - Tab đang kích hoạt: `Tất cả` (`data-category="all"`, `hasCount: false`).
   - Tổng số thẻ trang 1: `12` thẻ (khớp chính xác 3 cột x 4 hàng).
   - Thanh phân trang: Nút `PREV`, `1`, `2`, `NEXT` căn giữa.
   - Dòng đếm ngược tự động 10s (`#autoPageTimerIndicator`): **Đã loại bỏ hoàn toàn** (`indicatorExists: false`).
2. **Kiểm tra chuyển sang Trang 2**:
   - Click nút `NEXT` / `2`: Số thẻ trang 2 đạt đúng `12` thẻ (4 hàng).
   - Nút trang kích hoạt chuyển sang `2`.
3. **Kiểm tra chuyển sang tab chuyên ngành ("IT - Phần mềm")**:
   - Click tab "IT - Phần mềm": Hiển thị đúng `12` thẻ IT trang 1, phân trang có `2` trang (tổng 24 thẻ IT).
4. **Kiểm tra đồng bộ mã nguồn (SHA-256 Hash Match)**:
   - `index.html === public/index.html`: **MATCH (100% SYNC)**.
   - `js/home.js === public/js/home.js`: **MATCH (100% SYNC)**.
5. **Ảnh chụp màn hình xác thực giao diện**:
   - Chân trang phân trang sạch đẹp không còn dòng timer: [`scratch/featured_pagination_footer.png`](file:///d:/master%20page/scratch/featured_pagination_footer.png)
   - Toàn cảnh khối Việc làm nổi bật: [`scratch/featured_jobs_full_view.png`](file:///d:/master%20page/scratch/featured_jobs_full_view.png)

