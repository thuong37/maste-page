# Đặc Tả Kỹ Thuật: Thiết Kế Lại Khối Banner Nhà Tuyển Dụng Tiêu Biểu (Bento Grid)

- **Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình:** Trang chủ (`index.html`), khối ngay dưới thanh tìm kiếm Hero
- **Ngày hoàn thành:** 02/10/2026
- **Trạng thái:** ✅ Đã triển khai vào mã nguồn thật — ⚠️ Kiểm thử trực quan tự động CHƯA chạy được (xem mục 4)

---

## 1. Bối Cảnh & Yêu Cầu Người Dùng

### Diễn tiến yêu cầu
1. Người dùng muốn thiết kế lại khối banner "Doanh nghiệp tiêu biểu" ở trang chủ — ban đầu yêu cầu đề xuất phương án trước khi code thật.
2. Đã trình bày 9 phương án (A–I) qua artifact mockup (Split Showcase, Bento, Editorial, Featured Carousel, Culture Spotlight, Minimal Kinetic, Hero+Rail, Hero+Strip, Bento 1-lớn-3-nhỏ), có tham khảo cách làm của SEEK/Naukri/Jobstreet, Welcome to the Jungle và xu hướng thiết kế 2026.
3. Người dùng chọn hướng **"1 banner lớn + nhiều banner nhỏ"**, cụ thể là **Phương án I — Bento Grid**, và yêu cầu dùng ảnh đẹp thay vì placeholder gradient.
4. Người dùng chốt: **"sửa thẳng vào file code dự án đi"** → triển khai trực tiếp vào `index.html` (không chỉ dừng ở mockup).

### Vấn đề của thiết kế cũ
- Khối `.hero-ad-showcase` cũ chỉ phục vụ **1 nhà tài trợ duy nhất** (Orion Technologies), xoay vòng 3 ảnh qua `js/spotlight-rotation.js`.
- Không có không gian bán thêm gói quảng cáo cho nhà tuyển dụng khác → giới hạn nguồn thu.
- Toàn bộ khối là 1 hình chữ nhật đơn điệu, không có nhịp điệu thị giác.

---

## 2. Giải Pháp Kiến Trúc & Bố Cục Mới

```
+-------------------------------------------------------------+------------+------------+
|                                                               |            |            |
|   Ô CHÍNH (.sponsor-primary) — Orion Technologies            |  Ô PHỤ A   |  Ô PHỤ B   |
|   Ảnh banner thật (assets/banners/employer-spotlight-        |  Vietcom   |  Saigon    |
|   banner.jpg) + badge "Tài trợ" + thanh thương hiệu           |  Finance   |  Retail    |
|   (logo, slogan, tên DN, nút "Khám Phá Ngay")                 |  48 vị trí |  120 vị trí|
|                                                               +------------+------------+
|                                                               |  Ô PHỤ RỘNG (.sponsor-mini-wide)       |
|                                                               |  HanTech Group · 76 vị trí · Tuyển gấp |
+-------------------------------------------------------------+-----------------------------------------+
```

- **Lưới CSS Grid** `1.7fr 1fr 1fr` × 2 hàng (`grid-template-rows: auto auto`), khoảng cách `gap: 14px`.
- **Ô chính** (`.sponsor-primary`) chiếm cột 1, trải 2 hàng (`grid-row: 1 / 3`) — giữ nguyên 100% ảnh gốc, badge "Tài trợ" và thanh thương hiệu đã có từ thiết kế cũ (tái sử dụng toàn bộ class `.spotlight-brand-*`, `.ad-badge-overlay`).
- **3 ô phụ** (`.sponsor-mini`) dùng ảnh nền thật qua `background-image` + lớp phủ gradient tối `::before` để chữ trắng luôn đọc rõ, gồm logo viết tắt, tên công ty, số vị trí.
- Responsive 3 bậc: ≥1025px (bento 3 cột đầy đủ) → ≤1024px (giữ bố cục, giảm min-height) → ≤768px (2 cột, ô chính trải full hàng trên) → ≤480px (xếp dọc 1 cột hoàn toàn).

### Ảnh sử dụng
| Ô | File | Nguồn |
|---|---|---|
| Ô chính (Orion) | `assets/banners/employer-spotlight-banner.jpg` | Tái sử dụng ảnh thương hiệu đã có sẵn của dự án (không đổi) |
| Ô phụ A (Vietcom Finance) | `assets/banners/employer-spotlight-finance.jpg` | Ảnh minh hoạ (Unsplash License — miễn phí sử dụng) |
| Ô phụ B (Saigon Retail) | `assets/banners/employer-spotlight-retail.jpg` | Ảnh minh hoạ (Unsplash License — miễn phí sử dụng) |
| Ô phụ rộng (HanTech) | `assets/banners/employer-spotlight-manufacturing.jpg` | Ảnh minh hoạ (Unsplash License — miễn phí sử dụng) |

> **Lưu ý quan trọng:** Vietcom Finance, Saigon Retail Corp, HanTech Group là **nhà tuyển dụng demo** để minh hoạ bố cục "1 lớn + 3 nhỏ". Trước khi lên production thật, cần thay bằng dữ liệu/ảnh của nhà tuyển dụng trả phí thật và nối với hệ thống quản lý gói tài trợ (nếu có).

---

## 3. Danh Sách Tệp Thay Đổi & Đồng Bộ

| STT | Tệp | Nội dung thay đổi |
|:---:|:---|:---|
| 1 | `index.html` / `public/index.html` | Thay toàn bộ khối `.hero-ad-showcase` (1 banner + slide dots) bằng `.bento-sponsor-grid` (1 ô chính + 3 ô phụ); xoá CSS/markup cũ của `.employer-spotlight-card`, `.spotlight-banner-media`, `.spotlight-slide-*`; thêm CSS mới `.sponsor-primary`, `.sponsor-mini*`; cập nhật responsive ở 3 breakpoint (1024px, 768px, 480px mới). |
| 2 | `js/spotlight-rotation.js`, `public/js/spotlight-rotation.js` | **Đã xoá** — không còn phần tử `.spotlight-slide-dot`/`.spotlight-banner-img` để điều khiển (khối chính giờ tĩnh, không rotate qua 3 ảnh nữa). |
| 3 | `assets/banners/employer-spotlight-finance.jpg`, `*-retail.jpg`, `*-manufacturing.jpg` (+ bản sao trong `public/assets/banners/`) | Ảnh minh hoạ mới cho 3 ô phụ. |

**Ghi chú về mã chết đã rà soát:** khối JS trong `js/home.js` (mục "Hero VIP Employer Spotlight Switcher & Rotator", dòng ~396–469) phụ thuộc vào `.ad-dot`/`.ad-tab-btn` — các phần tử này **không tồn tại** trong HTML hiện tại lẫn trước đây, nên khối này vốn đã bất hoạt (guard `if ((adDots.length || adTabs.length) && adCards.length)` luôn `false`). Không bị ảnh hưởng bởi thay đổi lần này, giữ nguyên không đụng tới.

---

## 4. Kiểm Thử — Giới Hạn Môi Trường & Khuyến Nghị

⚠️ **Môi trường thực thi lần này không có Python lẫn công cụ trình duyệt headless** (`chromium-cli`, Playwright, Puppeteer đều không cài đặt sẵn, và không có quyền cài thêm theo quy tắc an toàn của hệ thống). Do đó:

| Hạng mục kiểm thử | Phương pháp đã làm | Kết quả |
|---|---|---|
| Cân bằng thẻ HTML (mở/đóng) | Rà soát thủ công từng khối markup đã sửa (không chạy được `deep_check.py` do thiếu Python) | ✅ Khớp, không phát hiện lỗi lồng thẻ |
| Không còn tham chiếu class cũ (`spotlight-banner-media`, `employer-spotlight-card`, `ad-cards-wrapper`...) | `grep` toàn bộ `index.html` | ✅ 0 kết quả còn sót |
| Đồng bộ `index.html` ⇄ `public/index.html` | So sánh `diff` sau khi copy | ✅ Giống hệt nhau |
| Ảnh minh hoạ hiển thị đúng chủ đề (văn phòng công nghệ, tài chính, kho vận bán lẻ, sản xuất) | Xem trực tiếp từng ảnh đã tải trước khi đưa vào dự án | ✅ Đạt yêu cầu thẩm mỹ |
| **Hiển thị thực tế trên trình duyệt (chụp ảnh màn hình desktop/mobile)** | **CHƯA chạy được** — không có công cụ headless browser trong môi trường này | ⚠️ **Cần người dùng tự xác nhận bằng mắt tại `http://localhost:8080/`** |

**Khuyến nghị:** Người dùng vui lòng refresh `http://localhost:8080/` (hard refresh để xoá cache CSS cũ nếu cần) và kiểm tra trực quan khối banner mới ở cả desktop và mobile. Nếu phát hiện lệch bố cục, báo lại để sửa ngay trong lượt tiếp theo.

---

## 5. Hướng Mở Rộng Tiếp Theo (Chưa làm trong lượt này)

- Kết nối 3 ô phụ với dữ liệu nhà tuyển dụng thật (CMS/Admin) thay vì nội dung tĩnh demo.
- Cân nhắc bổ sung cơ chế xoay vòng khi có nhiều hơn 3 nhà tài trợ phụ muốn mua slot (theo mô hình Phương án D — Featured Carousel đã đề xuất trước đó).
- Thiết kế Dark Mode riêng cho khối bento nếu EasyCV kích hoạt toggle giao diện tối trên trang chủ (hiện khối này tự dùng nền tối cố định nên đã tương thích cả 2 theme, nhưng nên rà lại khi trang có toggle dark mode tổng thể).
