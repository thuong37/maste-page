# Báo Cáo Kỹ Thuật: Tối Ưu Avatar Thẻ Việc Làm (80x80px) & Cơ Chế Chuyển Đổi Nút Ứng Tuyển Khi Hover

- **Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình**: [Trang chủ EasyCV](file:///c:/code/easycv/maste-page/index.html) (Khối Việc làm nổi bật `#viec-lam-noi-bat`)
- **Ngày thực hiện**: 07/10/2026
- **Trạng thái**: Hoàn tất 100% & Đã kiểm thử trực quan CDP thành công

---

## 1. Yêu Cầu & Mục Tiêu

1. **Avatar (Logo công ty) của job**: Tăng kích thước to rõ, sắc nét (`80x80px`), bo góc mượt mà 12px, viền xám tinh tế đổi sang viền cam khi hover thẻ. Căn chỉnh lại Huy hiệu Tia Sét ⚡ (24x24px) cân đối ở góc trên bên trái logo.
2. **Nút Ứng tuyển**: Tăng kích cỡ to đẹp đồng bộ với các nút hành động chính của hệ thống (`height: 34px`, padding `7px 20px`, bo tròn con nhộng pill, gradient cam thương hiệu `#FF8A34` -> `#F97316`, chữ trắng bold 700).
3. **Cơ chế tương tác Hover kinh điển**:
   - **Chưa hover (Unhovered)**: Hiển thị thời gian đăng tin (icon đồng hồ + "15 phút trước", "Hôm nay",...) và ẩn nút Ứng tuyển.
   - **Đang hover (Hovered)**: Tự động ẩn thời gian đăng tin và làm xuất hiện nút Ứng tuyển to rõ, nổi bật kèm hiệu ứng chuyển động mượt mà. Nút Bookmark trái tim giữ nguyên vị trí ngoài cùng bên phải.

---

## 2. Ma Trận Thay Đổi Kỹ Thuật

| Thành phần | Trước khi sửa | Sau khi hoàn thiện | File triển khai |
| :--- | :--- | :--- | :--- |
| **Kích thước Avatar Logo** | `65x65px` (nhỏ, khó nhìn thương hiệu) | **`80x80px`** (`padding: 6px`, `border-radius: 12px`, logo trong `border-radius: 8px`) | [css/home.css](file:///c:/code/easycv/maste-page/css/home.css)<br>[index.html](file:///c:/code/easycv/maste-page/index.html) |
| **Huy hiệu Tia Sét ⚡** | `17x20px`, top -5px, left -5px | **`24x24px`**, top -7px, left -7px, border trắng 2px, đổ bóng sắc nét | [css/home.css](file:///c:/code/easycv/maste-page/css/home.css)<br>[index.html](file:///c:/code/easycv/maste-page/index.html) |
| **Thời gian đăng tin** | Cố định hoặc không có | **`.job-posted-time`** (hiển thị khi unhover, `display: none !important` khi hover) | [css/home.css](file:///c:/code/easycv/maste-page/css/home.css)<br>[js/home.js](file:///c:/code/easycv/maste-page/js/home.js) |
| **Nút Ứng tuyển** | Nhỏ gọn hoặc ẩn hoàn toàn | **`.btn-card-apply`** cao 34px, pill gradient cam (ẩn khi unhover, xuất hiện khi hover thẻ) | [css/home.css](file:///c:/code/easycv/maste-page/css/home.css)<br>[js/home.js](file:///c:/code/easycv/maste-page/js/home.js) |
| **Nút Bookmark** | 32x32px | **34x34px** tròn viền cam, ăn khớp với chiều cao nút Ứng tuyển | [css/home.css](file:///c:/code/easycv/maste-page/css/home.css) |

---

## 3. Danh Sách Tệp Triển Khai & Kiểm Tra Đồng Bộ

| STT | File Root | File Public tương ứng | Trạng thái SHA-256 Parity |
| :---: | :--- | :--- | :---: |
| 1 | [index.html](file:///c:/code/easycv/maste-page/index.html) | [public/index.html](file:///c:/code/easycv/maste-page/public/index.html) | **100% Khớp tuyệt đối** (`6C460A...`) |
| 2 | [css/home.css](file:///c:/code/easycv/maste-page/css/home.css) | [public/css/home.css](file:///c:/code/easycv/maste-page/public/css/home.css) | **100% Khớp tuyệt đối** (`0F12C4...`) |
| 3 | [js/home.js](file:///c:/code/easycv/maste-page/js/home.js) | [public/js/home.js](file:///c:/code/easycv/maste-page/public/js/home.js) | **100% Khớp tuyệt đối** (`5CA1BD...`) |

---

## 4. Kết Quả Kiểm Thử Thực Tế Qua CDP

Dữ liệu đo đạc thực tế từ trình duyệt Chrome Headless:

```json
UNHOVERED CARD STATS: {
  "logoWidth": 80,
  "logoHeight": 80,
  "timeDisplay": "flex",
  "timeVisible": true,
  "timeText": "15 phút trước",
  "applyDisplay": "none",
  "applyVisible": false
}

HOVERED CARD STATS: {
  "timeDisplay": "none",
  "timeVisible": false,
  "applyDisplay": "flex",
  "applyVisible": true,
  "applyWidth": 124,
  "applyHeight": 34,
  "applyText": "Ứng tuyển"
}
```

- **Bằng chứng chụp màn hình trạng thái chưa hover**: [`scratch/verified_featured_section.png`](file:///c:/code/easycv/maste-page/scratch/verified_featured_section.png)
- **Bằng chứng chụp màn hình trạng thái đã hover (nút ứng tuyển hiện, thời gian đăng ẩn)**: [`scratch/verified_featured_hovered_full.png`](file:///c:/code/easycv/maste-page/scratch/verified_featured_hovered_full.png)
