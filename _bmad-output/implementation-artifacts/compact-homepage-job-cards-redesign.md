# Báo Cáo Kỹ Thuật: Đồng Bộ Kích Thước Thẻ Việc Làm Trang Chủ Chuẩn TopCV Reference

- **Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
- **Màn hình**: [Trang chủ EasyCV](file:///d:/master%20page/index.html) (`#viec-lam-noi-bat` & `#viec-lam-phu-hop`)
- **Ngày thực hiện**: 07/10/2026
- **Trạng thái**: Hoàn tất 100% & Đã kiểm thử trực quan qua Headless Chrome CDP

---

## 1. Yêu Cầu & Phân Tích

- **Vấn đề trước khi sửa**:
  1. Thẻ job trên trang chủ bị làm quá to và cồng kềnh (chiều cao lên tới **179px**, padding lớn `16px 18px`, min-height `136px`).
  2. Khung Logo công ty bị phóng đại quá mức (**80px x 80px**), chiếm gần một nửa chiều cao thẻ, làm layout mất cân xứng.
  3. Cụm footer bị nhồi nhét thời gian đăng tin dài dòng ("15 phút trước") kèm nút "Ứng tuyển" khiến các tag lương và địa điểm bị rớt xuống 2 hàng (`pillsH: 51px`), gây nhảy chiều cao không đồng đều.
- **Yêu cầu người dùng**:
  - Học hỏi trực tiếp kích thước và tỷ lệ từ ảnh mẫu TopCV tham chiếu:
    - Thu nhỏ thẻ gọn gàng, thanh thoát.
    - Khung logo công ty vuông nhỏ gọn (~`52px x 52px`), bo góc nhẹ `8px`.
    - Tiêu đề công việc 14px (font-weight 600, tối đa 2 dòng), tên công ty uppercase 12px màu xám `slate-500`.
    - Hàng footer tinh giản: bên trái là 2 tag con nhộng lương & địa điểm nằm gọn gàng trên 1 hàng (`padding: 3px 8px`, `font-size: 11.5px`), bên phải là nút icon trái tim viền tròn thanh mảnh (`28px x 28px`).

---

## 2. Bảng Ma Trận Kỹ Thuật (Trước & Sau Tinh Chỉnh)

| Hạng mục | Trước tinh chỉnh | Sau tinh chỉnh (Chuẩn ảnh mẫu) | File áp dụng |
| :--- | :--- | :--- | :--- |
| **Chiều cao tổng thể thẻ** | **179px** (quá khổ, thô) | **120px** (gọn gàng, chuẩn xác, giảm ~33% chiều cao) | `css/home.css`<br>`index.html` |
| **Khung Logo công ty** | **80px x 80px** | **52px x 52px** (`border: 1px solid #E2E8F0; border-radius: 8px; padding: 3px;`) | `css/home.css`<br>`index.html` |
| **Bo góc thẻ** | `14px` | **`10px`** mềm mại, tinh tế | `css/home.css`<br>`index.html` |
| **Padding thẻ** | `16px 18px` | **`12px 14px`** | `css/home.css`<br>`index.html` |
| **Huy hiệu Tia Sét ⚡** | `24px x 24px` | **`18px x 18px`** (cân đối tỷ lệ với logo 52px) | `css/home.css`<br>`index.html` |
| **Tiêu đề công việc** | `14.5px`, line-clamp 2 | **`14px`**, font-weight 600, line-height 1.35 | `css/home.css`<br>`index.html` |
| **Tên công ty** | `11.5px` | **`12px`**, uppercase, màu `#64748B` | `css/home.css`<br>`index.html` |
| **Tags Pill lương & nơi chốn** | Bị đẩy rớt dòng thành 2 hàng (`51px`) | **Nằm gọn trên 1 hàng** (`20px`), font `11.5px`, bo tròn pill | `css/home.css`<br>`index.html`<br>`js/home.js` |
| **Cụm hành động góc phải** | Icon đồng hồ + 15 phút trước + Nút ứng tuyển to | **Nút Trái tim viền tròn 28px x 28px** thanh thoát, không chiếm chỗ | `css/home.css`<br>`index.html`<br>`js/home.js` |
| **Tương tác Click Thẻ** | Chỉ bấm vào link text | **Click bất kỳ vị trí nào trên thẻ** đều chuyển hướng mượt mà sang `chi-tiet-viec-lam.html?id=...` | `js/home.js` |

---

## 3. Danh Sách Tệp Triển Khai & Đồng Bộ (Root ⇄ Public)

| STT | File Gốc (Root) | File Public Tương Ứng | Trạng thái đồng bộ |
| :---: | :--- | :--- | :---: |
| 1 | [`index.html`](file:///d:/master%20page/index.html) | [`public/index.html`](file:///d:/master%20page/public/index.html) | **100% Khớp tuyệt đối** |
| 2 | [`css/home.css`](file:///d:/master%20page/css/home.css) | [`public/css/home.css`](file:///d:/master%20page/public/css/home.css) | **100% Khớp tuyệt đối** |
| 3 | [`js/home.js`](file:///d:/master%20page/js/home.js) | [`public/js/home.js`](file:///d:/master%20page/public/js/home.js) | **100% Khớp tuyệt đối** |

---

## 4. Kết Quả Đo Đạc Thực Tế Qua Headless Chrome CDP

```json
{
  "cardWidth": 393,
  "cardHeight": 120,
  "padding": "12px 14px",
  "borderRadius": "10px",
  "gap": "10px",
  "logoWrapWidth": 52,
  "logoWrapHeight": 52,
  "titleFontSize": "14px",
  "companyFontSize": "12px",
  "pillsHeight": 20,
  "bookmarkWidth": 28,
  "bookmarkHeight": 28
}
```

- **Bằng chứng chụp màn hình Thẻ đơn lẻ đối chiếu ảnh mẫu**: [`scratch/single_compact_card_result.png`](file:///d:/master%20page/scratch/single_compact_card_result.png)
- **Bằng chứng chụp màn hình Khối Việc làm nổi bật**: [`scratch/verify_featured_jobs_compact.png`](file:///d:/master%20page/scratch/verify_featured_jobs_compact.png)
- **Bằng chứng chụp màn hình Khối Việc làm phù hợp**: [`scratch/matching_compact_cards_result.png`](file:///d:/master%20page/scratch/matching_compact_cards_result.png)
- **Bằng chứng hiển thị Mobile**: [`scratch/verify_mobile_compact_card.png`](file:///d:/master%20page/scratch/verify_mobile_compact_card.png)
