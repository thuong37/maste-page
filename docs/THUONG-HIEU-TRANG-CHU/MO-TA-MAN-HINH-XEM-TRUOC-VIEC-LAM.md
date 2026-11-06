# Mô tả màn hình Xem trước việc làm (EasyCV)

## 1. Tổng quan

Màn hình mở ra khi người dùng bấm vào một việc ở trang Tra cứu việc làm (vùng trống của thẻ hoặc nút Xem nhanh). Gồm, từ trên xuống: thanh tìm kiếm, rồi 2 cột: bên trái là danh sách việc làm phù hợp, bên phải là nội dung của việc đang xem; cuối trang là footer.

| # | Khối |
| --- | --- |
| 1 | Thanh tìm kiếm |
| 2 | Danh sách việc làm phù hợp (cột trái) |
| 3 | Phân trang danh sách |
| 4 | Phần đầu việc đang xem: tên, lương, địa điểm, nhãn, nút hành động |
| 5 | Các mục nội dung việc làm |
| 6 | Thanh Ứng tuyển cuối khung |
| 7 | Footer |

## 2. Quy ước chung

- **Bố cục:**
  - Màn hình rộng: 2 cột, danh sách bên trái, nội dung việc bên phải. Khung nội dung dính dưới thanh tìm kiếm và cuộn riêng bên trong, nên cuộn trang vẫn thấy việc đang xem.
  - Màn hẹp (máy tính bảng, điện thoại): còn 1 cột, **nội dung việc nằm trên**, danh sách việc phù hợp nằm dưới.
  - Trên màn hình rộng, thanh tìm kiếm dính mép trên khi cuộn xuống; trên điện thoại thì không dính.
- **Giữ kết quả tìm kiếm:** trang nhận lại từ khóa, địa điểm, nghề, bộ lọc và cách sắp xếp từ trang Tra cứu. Danh sách bên trái theo đúng kết quả và thứ tự đó. Thanh tìm kiếm hiện sẵn từ khóa, địa điểm, nghề đã chọn.
- **Đổi việc đang xem không rời trang:** bấm một thẻ ở danh sách thì khung bên phải đổi sang việc đó và cuộn về đầu; đường dẫn đổi theo việc đang xem (gửi đường dẫn cho người khác là mở đúng việc đó).
- **Nút Back/Forward:** lùi lại về việc đã xem trước đó; lùi tiếp thì về trang Tra cứu với đúng kết quả tìm kiếm/bộ lọc cũ. Mở trang trực tiếp từ đường dẫn (tab mới) thì bấm Back vẫn về trang Tra cứu.
- **Điện thoại/cảm ứng:** không có hiệu ứng rê chuột; chạm vào thẻ ở danh sách thì màn hình cuộn lên khung nội dung của việc vừa chọn. Thanh Ứng tuyển cố định ở đáy màn hình.

## 3. Mô tả từng khối

### 3.1 Thanh tìm kiếm

- Thừa kế từ trang Tra cứu việc làm: nút **Danh mục Nghề**, ô từ khóa (có nút xóa nhanh), ô địa điểm, nút **Tìm kiếm**; lịch sử tìm kiếm và gợi ý khi bấm vào ô từ khóa hoạt động như trang chủ.
- **Khác trang Tra cứu:** bấm Tìm (hoặc Enter, chọn một gợi ý) hay chọn xong Danh mục Nghề thì **chuyển sang trang Tra cứu việc làm** với kết quả mới, không lọc tại chỗ.

### 3.2 Danh sách việc làm phù hợp (cột trái)

- **Tiêu đề:** "Việc làm phù hợp" và dòng "Tìm thấy **N** việc làm đang tuyển dụng phù hợp".
- **Thứ tự:** như trang Tra cứu (cùng cách sắp xếp đã chọn ở đó). Việc khớp tìm kiếm/bộ lọc đứng trước. `[Cần xác nhận]` có hiện tiếp các việc không khớp ở phía sau không (xem câu hỏi 1).
- **Số lượng:** 1 cột, **10 việc mỗi trang**. Khi mở trang, danh sách tự mở đúng trang có chứa việc đang xem.
- **Mỗi thẻ việc gồm:** logo công ty; tên việc; tên công ty (chữ hoa) kèm dấu xác thực nếu đã xác thực; mức lương; 2 nhãn **tỉnh/thành · kinh nghiệm**; dòng chuyên môn gồm kinh nghiệm, **1 kỹ năng** đầu tiên và "+N" cho phần còn lại; thời gian đăng; nút **lưu việc**. Tin nổi bật có kiểu thẻ riêng.
- **Việc đang xem** được đánh dấu nổi bật trong danh sách.
- **Hành vi:**
  - Bấm vào thẻ (kể cả tên việc) → đổi khung bên phải sang việc đó, không rời trang. Giữ Ctrl/Cmd khi bấm tên việc → mở trang chi tiết việc ở tab mới.
  - Rê chuột vào thẻ: dòng thời gian đăng được thay bằng nút **Ẩn việc**. Việc đang xem không có nút này.
  - **Ẩn việc:** thẻ mờ dần rồi biến mất, hiện thông báo "Đã ẩn việc làm này khỏi danh sách gợi ý"; số N giảm theo. Hiệu lực như Ẩn việc ở trang Tra cứu.
  - **Lưu việc:** bấm để lưu/bỏ lưu, có thông báo; dùng chung danh sách việc đã lưu với trang Tra cứu và nút Lưu ở khung bên phải (đổi một chỗ thì chỗ kia cập nhật).

### 3.3 Phân trang danh sách

- Gồm nút "« Trước", các số trang, nút "Sau »". Ở trang đầu thì "Trước" bị khóa, ở trang cuối thì "Sau" bị khóa. Chỉ có 1 trang thì ẩn hẳn phân trang.
- Chuyển trang thì cuộn về đầu danh sách. Đổi trang danh sách không đổi việc đang xem.

### 3.4 Phần đầu việc đang xem

- **Tên việc**; nhãn **lương**; **địa điểm** (tỉnh/thành kèm quận/huyện); **thời gian cập nhật**.
- 3 nhãn: **kinh nghiệm**, **cấp bậc**, **hình thức làm việc**; cạnh đó là nút **Xem chi tiết** → trang chi tiết việc làm (giữ kết quả tìm kiếm/bộ lọc để quay lại).
- 2 nút: **Ứng tuyển ngay** (dùng luồng ứng tuyển như ở trang chi tiết việc) và **Lưu** (đã lưu thì đổi thành "Đã Lưu").
- Tiêu đề tab trình duyệt: "Tên việc | Tên công ty - Tuyển dụng EasyCV".

### 3.5 Các mục nội dung việc làm

Theo thứ tự:

| Mục | Nội dung |
| --- | --- |
| Tổng quan | 3 dòng nhãn: **Yêu cầu** (kinh nghiệm, học vấn, giới tính), **Quyền lợi** (các phúc lợi chính), **Chuyên môn** (tối đa 5 kỹ năng) |
| Mô tả công việc | danh sách gạch đầu dòng |
| Yêu cầu ứng viên | danh sách gạch đầu dòng |
| Quyền lợi & Chế độ đãi ngộ | danh sách gạch đầu dòng |
| Địa điểm làm việc | địa chỉ làm việc |
| Thời gian làm việc | ngày và giờ làm theo lịch nghỉ thứ 7 của tin; tin không ghi thì hiện "Thời gian làm việc trao đổi trực tiếp trong quá trình phỏng vấn." |
| Kỹ năng chuyên môn | toàn bộ kỹ năng của tin |
| Về doanh nghiệp tuyển dụng | logo, tên công ty, mô tả ngắn, liên kết **Xem hồ sơ công ty →** |

### 3.6 Thanh Ứng tuyển cuối khung

- Gồm tên việc, mức lương và nút **Ứng tuyển ngay** (cùng luồng với nút ở phần đầu).
- Màn rộng: luôn hiện ở đáy khung nội dung. Điện thoại: cố định ở đáy màn hình, tên việc dài thì cắt bớt bằng dấu "…".

## 4. Bảng số lượng

| Khối | Số lượng |
| --- | --- |
| Việc mỗi trang ở danh sách bên trái | 10 |
| Nhãn trên thẻ danh sách | 2 (tỉnh/thành, kinh nghiệm) + mức lương |
| Kỹ năng hiện trên thẻ danh sách | 1 (phần còn lại hiện "+N") |
| Nhãn ở phần đầu việc đang xem | 3 (kinh nghiệm, cấp bậc, hình thức) |
| Nút hành động ở phần đầu | 3 (Xem chi tiết, Ứng tuyển ngay, Lưu) |
| Mục nội dung việc làm | 8 |
| Nhãn Yêu cầu trong Tổng quan | 3 |
| Kỹ năng trong Tổng quan | tối đa 5 |
| Cột bố cục | 2 trên màn rộng, 1 trên máy tính bảng/điện thoại |

## 5. Câu hỏi còn mở

1. Danh sách bên trái chỉ hiện việc khớp tìm kiếm/bộ lọc (giống trang Tra cứu), hay hiện việc khớp trước rồi đến các việc khác? Số N tính theo cách nào?
2. Danh sách bên trái 10 việc/trang trong khi trang Tra cứu 25 việc/trang: giữ 10 hay đồng bộ 25?
3. Thẻ ở danh sách bên trái có cần nút **Ứng tuyển** cạnh nút Ẩn việc khi rê chuột, như trang Tra cứu không?
4. Nhãn **Quyền lợi** trong Tổng quan lấy từ trường nào của tin, tối đa bao nhiêu nhãn?
