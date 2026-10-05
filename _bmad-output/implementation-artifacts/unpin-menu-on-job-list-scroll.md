# Tài Liệu Kỹ Thuật: Bỏ Neo Thanh Menu Đầu Trang Khi Cuộn Trên Màn Hình Danh Sách Việc Làm

- **Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình:** Danh sách việc làm (`viec-lam.html`)
- **Ngày thực hiện:** 05/10/2026
- **Trạng thái:** ✅ Đã hoàn thành & Kiểm thử tự động 100% PASS

---

## 1. Yêu Cầu & Bối Cảnh

### Phản hồi từ người dùng:
> *"trong màn list job khi cuộn màn hình xuống thì k được neo thanh menu ở trên cùng nữa"*

### Hiện trạng trước khi sửa:
- Trước đó, thẻ điều hướng đầu trang (`.site-header` / navbar chứa Logo EasyCV, Tìm việc, Hồ sơ & CV, Ứng tuyển, Công cụ nghề nghiệp, Dành cho Nhà tuyển dụng, Thông báo, Tin nhắn, Avatar) được thiết lập `position: sticky; top: 0;` trong `css/navbar.css`.
- Khi người dùng cuộn màn hình xuống trên `viec-lam.html`, thanh menu này vẫn neo ở `top: 0` (chiều cao 73px), phía dưới là thanh tìm kiếm thông minh (`.hero-search-sticky-bar`) neo ở `top: 73px` (chiều cao 133px).
- Tổng chiều cao vùng cố định lên đến **206px**, chiếm dụng hơn 25% chiều cao khung nhìn trên màn hình desktop và gây chật chội trên mobile, che khuất một phần nội dung thẻ việc làm và làm giảm không gian hiển thị danh sách job.

---

## 2. Giải Pháp Kỹ Thuật

```
TRƯỚC KHI SỬA (CUỘN XUỐNG):
+---------------------------------------------------------------------------------------+
|  SITE-HEADER (Sticky, top: 0, cao 73px) - Logo | Menu điều hướng | Avatar             |
+---------------------------------------------------------------------------------------+
|  STICKY SEARCH BAR (Sticky, top: 73px, cao 133px) - Ô tìm kiếm + Bộ lọc ngang         |
+-------------------------------------------------------------+-------------------------+
|  DANH SÁCH VIỆC LÀM (Bị che khuất 206px chiều cao)          |  ADS SIDEBAR            |

SAU KHI SỬA (CUỘN XUỐNG):
[ SITE-HEADER CUỘN TRÔI KHỎI MÀN HÌNH ] (position: relative, không còn neo ở trên cùng)
+---------------------------------------------------------------------------------------+
|  STICKY SEARCH BAR (Neo sát mép trên cùng, top: 0px, cao 133px)                       |
+-------------------------------------------------------------+-------------------------+
|  DANH SÁCH VIỆC LÀM (Giải phóng 73px chiều cao)             |  ADS SIDEBAR (top: 145) |
|  - Không gian thoáng đãng, tập trung duyệt tin tuyển dụng   |  - Không bị đè lấp      |
+-------------------------------------------------------------+-------------------------+
```

### 2.1. Cấu hình CSS (`css/viec-lam.css` & `public/css/viec-lam.css`)
- Ghi đè thuộc tính của `.site-header` trên trang việc làm:
  ```css
  .site-header {
    position: relative !important;
    top: auto !important;
  }
  ```
- Điều chỉnh biến vị trí neo mặc định của thanh tìm kiếm sang `0px`:
  ```css
  .hero-search-sticky-bar.is-sticky {
    position: fixed;
    top: var(--sticky-search-top, 0px);
    ...
  }
  ```
- Điều chỉnh tọa độ neo của các thành phần con để tránh đè lấp khi thanh menu cuộn trôi:
  - Khối quảng cáo doanh nghiệp bên phải: `.ads-sidebar-container { top: 145px; }`
  - Khối chi tiết 2 cột (split view): `.split-detail-pane { top: 145px; max-height: calc(100vh - 165px); }`
  - Khối danh sách 2 cột: `.split-list-pane { top: 145px; max-height: calc(100vh - 165px); }`

### 2.2. Cấu hình JavaScript (`js/viec-lam.js` & `public/js/viec-lam.js`)
- Cập nhật hàm `updateStickyState()` bên trong `initStickySearch()`:
  - Đặt `--sticky-search-top` về `0px`.
  - Giám sát điều kiện `wrapperRect.top <= 0` thay cho điều kiện phụ thuộc `headerHeight` cũ, đảm bảo thanh tìm kiếm chuyển sang sticky ngay khi mép trên của nó chạm đỉnh viewport (`top: 0`).
  - Hoàn nguyên mượt mà về vị trí ban đầu khi người dùng cuộn ngược về đầu trang (`scrollY = 0`).

### 2.3. Tối ưu Critical Inline Style & Cache Buster (`viec-lam.html` & `public/viec-lam.html`)
- Nhúng quy tắc `.site-header { position: relative !important; top: auto !important; }` vào thẻ critical `<style>` trong `<head>` để triệt tiêu hoàn toàn hiện tượng nháy khung (FOUC).
- Cập nhật cache buster query string sang `?v=13.0_unpin_menu`.

---

## 3. Danh Sách Tệp Triển Khai & Đồng Bộ

| STT | Tệp Gốc | Tệp Bản Sao (`public/`) | Nội dung thay đổi |
|:---:|:---|:---|:---|
| 1 | [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) | [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css) | Thêm quy tắc `.site-header` `position: relative !important; top: auto !important;`, cập nhật default `--sticky-search-top: 0px`, căn chỉnh `.ads-sidebar-container` và split panes sang `top: 145px`. |
| 2 | [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) | [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js) | Cập nhật `initStickySearch()`: gán `stickyBar.style.setProperty('--sticky-search-top', '0px')`, kích hoạt `.is-sticky` khi `wrapperRect.top <= 0`. |
| 3 | [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) | [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html) | Thêm inline critical style cho `.site-header`, nâng cache buster `css/viec-lam.css?v=13.0_unpin_menu` và `js/viec-lam.js?v=13.0_unpin_menu`. |

---

## 4. Báo Cáo Kiểm Thử Tự Động (Verification)

Kiểm thử được thực hiện tự động qua Chrome Headless CDP (`scratch/check_scroll.js`):

| Kịch bản kiểm thử | Trạng thái mong đợi | Kết quả thực tế | Đánh giá |
|:---|:---|:---|:---:|
| **1. Trạng thái ở đỉnh trang (`scrollY = 0`)** | Header hiển thị đầy đủ, vị trí tự nhiên | `headerPosition: 'relative'`, `headerTop: '0px'`, `isSticky: false` | ✅ PASS |
| **2. Cuộn chuột xuống (`scrollY = 600px`)** | Header cuộn trôi khỏi màn hình, KHÔNG neo | `headerPosition: 'relative'`, `headerRectTop: -600px` (đã trôi hoàn toàn) | ✅ PASS |
| **3. Điểm neo thanh tìm kiếm khi cuộn** | Neo chính xác sát mép đỉnh trên cùng | `isSticky: true`, `stickyBarTop: 0px`, `stickyBarHeight: 133px` | ✅ PASS |
| **4. Tọa độ Sidebar quảng cáo** | Neo bên dưới thanh tìm kiếm, không đè lấp | `adsSidebarTop: 145px` (cách mép dưới thanh tìm kiếm 12px) | ✅ PASS |
| **5. Chế độ Mobile (390x844)** | Header không bị neo giữ, cuộn trôi tự nhiên | `headerRectTop: -400px`, `headerPosition: 'relative'` | ✅ PASS |
| **6. Tương tác thẻ việc làm** | Lưu việc, Ứng tuyển, Ẩn thẻ, Xem nhanh | 100% tương tác và Toast phản hồi chính xác | ✅ PASS |
| **7. Đồng bộ tệp 100%** | Khớp dữ liệu giữa thư mục gốc và `public/` | `viec-lam.html` (true), `css/viec-lam.css` (true), `js/viec-lam.js` (true) | ✅ PASS |

### Ảnh chụp màn hình nghiệm thu:
- [`scratch/vieclam_unpinned_menu_top.png`](file:///d:/master%20page/scratch/vieclam_unpinned_menu_top.png): Giao diện đầu trang với thanh menu đầy đủ.
- [`scratch/vieclam_unpinned_menu_scrolled.png`](file:///d:/master%20page/scratch/vieclam_unpinned_menu_scrolled.png): Khi cuộn xuống, thanh menu đã biến mất hoàn toàn, giải phóng tối đa không gian cho danh sách việc làm.
- [`scratch/vieclam_unpinned_menu_mobile.png`](file:///d:/master%20page/scratch/vieclam_unpinned_menu_mobile.png): Chế độ mobile khi cuộn xuống không còn thanh menu chiếm chỗ.
