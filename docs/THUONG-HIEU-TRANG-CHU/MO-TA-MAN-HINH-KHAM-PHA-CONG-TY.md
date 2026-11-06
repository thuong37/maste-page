# Mô tả màn hình Khám phá công ty (EasyCV)

## 1. Tổng quan

Màn hình giúp người dùng khám phá các công ty đã xác thực trên nền tảng EasyCV. Màn hình gồm, từ trên xuống: phần đầu trang có thanh tìm kiếm, hai tab (Khám phá / Đang theo dõi), hàng chip lĩnh vực, lưới thẻ công ty, phân trang, footer. Bấm vào một công ty thì sang trang giới thiệu công ty đó.

| # | Khối |
| --- | --- |
| 1 | Phần đầu trang: tiêu đề, câu dẫn và thanh tìm kiếm (từ khóa · địa điểm · nút Tìm kiếm) |
| 2 | Bảng chọn địa điểm |
| 3 | Tab Khám phá / Đang theo dõi |
| 4 | Hàng chip lọc theo lĩnh vực |
| 5 | Lưới thẻ công ty |
| 6 | Khi không có kết quả |
| 7 | Phân trang |
| 8 | Footer |

## 2. Quy ước chung

- **Bố cục:** lưới thẻ 3 cột.
- **Cách lọc:** giữa các bộ lọc (từ khóa, địa điểm, lĩnh vực, tab) là "VÀ"; chọn nhiều địa điểm thì là "HOẶC".
- **Tìm không phân biệt dấu và hoa thường.**
- **Đổi bất kỳ bộ lọc, tab nào thì quay về trang 1.**
- **Theo dõi công ty:** trạng thái theo dõi được giữ khi tải lại trang và dùng chung với trang giới thiệu công ty.

## 3. Mô tả từng khối

### 3.1 Phần đầu trang và thanh tìm kiếm

- **Thành phần:** tiêu đề "Khám phá công ty", câu dẫn "Tìm nơi bạn muốn gắn bó. Khám phá cơ hội bạn muốn theo đuổi.", **ô từ khóa** (gợi ý chữ "Tên công ty, lĩnh vực bạn quan tâm..."), **ô địa điểm** (mặc định "Tất cả địa điểm"), nút **Tìm kiếm**.
- **Từ khóa khớp công ty** khi cụm từ xuất hiện trong tên công ty, lĩnh vực hoặc tên công ty trong các việc đang tuyển.
- **Khi bấm Tìm (hoặc Enter):** lưới được lọc ngay trên trang này. Chọn xong địa điểm trong bảng 3.2 cũng lọc ngay, không cần bấm Tìm.
- **Địa điểm khớp** khi công ty có hoạt động tại ít nhất một tỉnh/thành đã chọn.
- **Gợi ý khi bấm vào ô từ khóa:** lịch sử tìm kiếm gần đây, tối đa 10 từ khóa mới nhất. Chọn một từ khóa thì tìm ngay; bấm Tìm thì từ khóa được lưu vào lịch sử.

### 3.2 Bảng chọn địa điểm

- Giống bảng địa điểm ở trang chủ và trang Tra cứu việc làm: chọn cách tìm (Tỉnh – Quận/huyện cũ, hoặc Tỉnh – Phường/xã sau 01/07/2025), 2 cột (Tỉnh/Thành phố, Quận/Huyện), mỗi cột có ô tìm, chọn được nhiều; nút **Bỏ chọn tất cả** và **Áp dụng**.
- Nhãn trên ô địa điểm đổi theo lựa chọn.

### 3.3 Tab Khám phá / Đang theo dõi

- **Khám phá** (mặc định): tất cả công ty đã xác thực trên EasyCV (kể cả công ty hiện chưa mở tin tuyển dụng).
- **Đang theo dõi:** chỉ các công ty người dùng đã theo dõi.
- Tab vẫn áp dụng từ khóa, địa điểm và lĩnh vực đang chọn.

### 3.4 Chip lọc theo lĩnh vực

- Một hàng chip, chọn một lĩnh vực tại một thời điểm; chip **Tất cả lĩnh vực** là mặc định và bỏ lọc.
- Số lượng, tên và thứ tự các chip lĩnh vực được quản lý trong hệ thống CMS (không cố định).
- Chip đang chọn được tô nổi bật.

### 3.5 Lưới thẻ công ty

- **Số lượng:** **50 thẻ mỗi trang**. Hiện cả công ty hiện không mở việc tuyển dụng.
- **Thứ tự hiển thị** được quản lý trong hệ thống CMS.
- **Mỗi thẻ gồm:** ảnh bìa; logo; tên công ty kèm biểu tượng huy hiệu màu cam nếu là công ty có độ uy tín cao (mọi công ty trên màn hình đều đã xác thực, nên biểu tượng này không phải dấu xác thực); dòng "lĩnh vực · quy mô nhân viên"; đoạn giới thiệu ngắn (tối đa 3 dòng) và liên kết **Xem thêm**; nút **Theo dõi** kèm số người theo dõi; nút **Xem trang →**.
- **Hành vi:**
  - Bấm ảnh bìa, tên công ty, Xem thêm hoặc Xem trang → trang giới thiệu công ty.
  - **Theo dõi:** chưa đăng nhập thì yêu cầu đăng nhập trước. Đã đăng nhập thì bấm để theo dõi/bỏ theo dõi; nút đổi giữa "+ Theo dõi (N)" và "✓ Đang theo dõi (N+1)"; hiện thông báo ngắn 3 giây. Số người theo dõi hơn 1.000 được rút gọn dạng "1,2k".
  - Đang ở tab Đang theo dõi mà bỏ theo dõi thì thẻ biến mất khỏi danh sách ngay.

### 3.6 Khi không có kết quả

- Hiện hộp "Chưa tìm thấy công ty", một dòng mô tả và nút **Đặt lại bộ lọc** (xóa từ khóa, địa điểm, lĩnh vực, giữ nguyên tab). Phân trang ẩn.
- Lời mô tả ở tab Đang theo dõi nhắc người dùng theo dõi công ty quan tâm; ở tab Khám phá gợi ý đổi từ khóa hoặc bỏ bớt bộ lọc.

### 3.7 Phân trang

- Gồm nút ‹ (trước), các số trang, nút › (sau). Ở trang đầu nút ‹ bị khóa, ở trang cuối nút › bị khóa. Chỉ có 1 trang thì ẩn hẳn phân trang.
- Chuyển trang thì cuộn màn hình về đầu lưới thẻ.

## 4. Bảng số lượng

| Khối | Số lượng |
| --- | --- |
| Công ty mỗi trang | 50 |
| Cột của lưới thẻ | 3 |
| Lĩnh vực trong hàng chip | không cố định, do CMS quản lý (cộng chip "Tất cả lĩnh vực") |
| Lịch sử tìm kiếm | tối đa 10 từ khóa |
| Tab | 2 |
| Dòng giới thiệu trên thẻ | tối đa 3 |
| Thời gian hiện thông báo theo dõi | 3 giây |

## 5. Câu hỏi còn mở

- Tiêu chí để một công ty được coi là có độ uy tín cao (hiện huy hiệu trên thẻ) chưa xác định; sẽ bổ sung sau.
