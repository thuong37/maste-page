# Mô tả màn hình Tra cứu việc làm (EasyCV)

## 1. Tổng quan

Màn hình gồm, từ trên xuống: thanh tìm kiếm, cột bộ lọc bên trái, thanh kết quả (số việc + sắp xếp), danh sách việc làm, phân trang, footer. Bấm vào một việc thì sang trang xem trước hoặc trang chi tiết.

| # | Khối |
| --- | --- |
| 1 | Thanh tìm kiếm (Danh mục Nghề · từ khóa · địa điểm · nút Tìm) và gợi ý khi bấm vào ô từ khóa |
| 2 | Bảng chọn Danh mục Nghề |
| 3 | Bộ lọc nâng cao (cột trái) |
| 4 | Thanh kết quả: số việc tìm thấy + sắp xếp |
| 5 | Danh sách việc làm |
| 6 | Khi không có kết quả |
| 7 | Phân trang |
| 8 | Footer |

## 2. Quy ước chung

- **Bố cục:** màn hình rộng là 2 cột, bộ lọc bên trái (cuộn trang vẫn thấy), danh sách bên phải. Màn hẹp thì bộ lọc nằm phía trên danh sách. Trên màn hình rộng, thanh tìm kiếm dính mép trên khi cuộn xuống; trên điện thoại thì không dính.
- **Cách lọc:** giữa các bộ lọc là "VÀ" (việc phải thỏa tất cả); trong một bộ lọc cho chọn nhiều giá trị thì là "HOẶC".
- **Tìm không phân biệt dấu và hoa thường.**
- **Giữ trạng thái:** từ khóa, địa điểm, nghề, bộ lọc, cách sắp xếp và số trang được giữ trên đường dẫn; mở lại đường dẫn hoặc bấm Back/Forward thì quay lại đúng kết quả đó.
- **Điện thoại/cảm ứng:** chạm vào việc là mở trang xem trước, không có hiệu ứng rê chuột.

## 3. Mô tả từng khối

### 3.1 Thanh tìm kiếm

- **Thành phần:** nút **Danh mục Nghề** (mở bảng 3.2), **ô từ khóa** (có nút xóa nhanh), **ô địa điểm** (chọn Tỉnh/thành rồi Quận/huyện, chọn được nhiều), nút **Tìm kiếm**.
- **Thừa kế từ trang chủ:** lịch sử tìm kiếm tối đa 7 mục; địa điểm theo mốc 01/07/2025 (trước đó: Tỉnh – Quận/huyện, sau đó: Tỉnh – Phường/xã); gợi ý khi bấm vào ô từ khóa hoạt động như trang chủ.
- **Khi bấm Tìm (hoặc Enter, hoặc chọn một gợi ý):** danh sách được lọc ngay trên trang này, không chuyển sang trang khác; từ khóa được lưu vào lịch sử và hiện thông báo số việc tìm được. Esc đóng gợi ý.
- **Gợi ý:**
  - Chưa gõ (dưới 2 ký tự): lịch sử tìm kiếm gần đây + 5 việc đề xuất.
  - Đang gõ (từ 2 ký tự): tối đa 10 gợi ý từ khóa (tên công ty và tên việc) + 5 việc đề xuất theo từ khóa.
- **Từ khóa khớp việc** khi mọi từ trong cụm đều xuất hiện trong tên việc, tên công ty, địa điểm hoặc kỹ năng (không tìm trong phần mô tả công việc). Địa điểm khớp theo tỉnh/thành, nếu có chọn quận/huyện thì khớp thêm quận/huyện; "Remote" khớp việc làm từ xa.

### 3.2 Bảng chọn Danh mục Nghề

- Giống trang chủ: 2 cột, nhóm nghề bên trái, nghề/vị trí chuyên môn bên phải; có ô tìm, nút Bỏ chọn tất cả, Hủy, Chọn và liên kết "Gửi góp ý". Nhóm có nhiều tin xếp trước, mỗi nhóm hiện tối đa 8 vị trí tìm nhiều nhất.
- Sau khi chọn, nhãn trên nút Danh mục Nghề đổi theo lựa chọn và danh sách được lọc theo nghề đó. Lựa chọn được nhớ khi tải lại trang.
- Lựa chọn trong bảng này còn quyết định cột bộ lọc bên trái hiện những bộ lọc nào (do CMS quản lý, xem 3.3).

### 3.3 Bộ lọc nâng cao (cột trái)

Các bộ lọc nâng cao được quản lý trong hệ thống CMS.

Nút **Xóa lọc** chỉ hiện khi có ít nhất một bộ lọc đang bật; bấm là bỏ hết.

### 3.4 Thanh kết quả

- **Số việc:** dòng "Tìm thấy **N** việc làm đang tuyển dụng phù hợp", N là số việc khớp từ khóa, địa điểm, nghề và bộ lọc.
- **Sắp xếp:** menu có 5 kiểu, mặc định là **Search by AI**. Đổi kiểu thì quay về trang 1.

| Kiểu | Cách xếp |
| --- | --- |
| Search by AI (mặc định) | việc phù hợp nhất với người dùng lên trước, việc nổi bật ưu tiên |
| Ngày đăng | mới đăng lên trước |
| Ngày cập nhật | mới cập nhật lên trước |
| Lương cao đến thấp | mức lương cao lên trước; tin "thỏa thuận" được coi như mức lương trung bình của thị trường để xếp chung với các tin có lương |
| Cần tuyển gấp | tin tuyển gấp lên trước |

### 3.5 Danh sách việc làm

- **Số lượng:** 1 cột, **25 việc mỗi trang**. Chỉ hiện việc khớp với tìm kiếm và bộ lọc.
- **Mỗi thẻ việc gồm:** logo công ty; tên việc; tên công ty (chữ hoa) kèm dấu xác thực nếu công ty đã xác thực; 3 nhãn **lương · kinh nghiệm · tỉnh/thành**; chuyên môn và tối đa **2 kỹ năng** (phần còn lại hiện "+N"); thời gian đăng; nút **Xem nhanh**; nút **lưu việc**. Tin nổi bật có kiểu thẻ riêng.
- **Hành vi:**
  - Bấm tên việc hoặc logo → trang chi tiết việc. Bấm vùng trống của thẻ hoặc nút Xem nhanh → trang xem trước. Cả hai giữ nguyên kết quả tìm kiếm/lọc để quay lại.
  - Rê chuột vào thẻ: dòng thời gian đăng được thay bằng 2 nút **Ứng tuyển** và **Ẩn việc**.
  - **Lưu việc:** bấm để lưu/bỏ lưu, tải lại trang vẫn còn.
  - **Ứng tuyển:** dùng luồng ứng tuyển như ở trang chi tiết việc.
  - **Ẩn việc:** người dùng không thấy việc đó nữa (kể cả khi tải lại) và việc đó cũng không còn xuất hiện trong các gợi ý (việc đề xuất trong ô tìm kiếm, việc phù hợp ở trang chủ).

### 3.6 Khi không có kết quả

- Hiện hộp thông báo: tiêu đề "Không tìm thấy việc làm phù hợp", một dòng mô tả ngắn, 6 từ khóa gợi ý bấm vào là tìm ngay, và nút "Xem tất cả … việc làm" (xóa từ khóa và bộ lọc, quay về danh sách đầy đủ). Phân trang ẩn.
- 6 từ khóa gợi ý hiện là: ReactJS, Java Backend, Marketing, Sales B2B, Kế toán, UI/UX Designer.

### 3.7 Phân trang

- Gồm nút "« Trước", các số trang, nút "Sau »". Ở trang đầu thì "Trước" bị khóa, ở trang cuối thì "Sau" bị khóa. Chỉ có 1 trang thì ẩn hẳn phân trang.
- Khi nhiều trang, hiện dãy số rút gọn (có dấu …).
- Đổi từ khóa, bộ lọc hoặc cách sắp xếp thì quay về trang 1. Số trang được giữ trên đường dẫn.
- Chuyển trang hoặc bấm Tìm thì cuộn màn hình về đầu danh sách.

## 4. Bảng số lượng

| Khối | Số lượng |
| --- | --- |
| Việc mỗi trang | 25 |
| Kiểu sắp xếp | 5 |
| Lịch sử tìm kiếm | tối đa 7 |
| Việc đề xuất trong ô tìm | 5 |
| Gợi ý từ khóa khi gõ | tối đa 10 (từ 2 ký tự) |
| Kỹ năng hiện trên thẻ | 2 (phần còn lại hiện "+N") |
| Từ khóa gợi ý khi không có kết quả | 6 |

## 5. Câu hỏi còn mở

1. Mức lương trung bình của thị trường (dùng để xếp tin lương thỏa thuận) lấy theo cách nào, từ đâu?
2. Việc đã ẩn có cách bỏ ẩn không?
3. 6 từ khóa gợi ý khi không có kết quả có lấy từ từ khóa xu hướng của trang chủ không?
