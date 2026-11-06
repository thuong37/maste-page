# Mô tả màn hình Trang chủ công ty (EasyCV)

## 1. Tổng quan

Màn hình là trang giới thiệu một công ty: thương hiệu, thông tin chung, hình ảnh, phúc lợi, địa chỉ, các tin đang tuyển và gợi ý công ty tương tự. Người dùng vào từ thẻ công ty ở màn hình Khám phá công ty. Màn hình chia hai cột: cột nội dung chính bên trái, cột thông tin bên phải; phía trên là khối thương hiệu rộng toàn trang.

| # | Khối |
| --- | --- |
| 1 | Khối thương hiệu (ảnh bìa, logo, tên, lĩnh vực, website, nút Theo dõi) |
| 2 | Thanh điều hướng nội dung (Giới thiệu · Việc làm) |
| 3 | Về công ty |
| 4 | Hình ảnh công ty |
| 5 | Phúc lợi & cuộc sống tại công ty |
| 6 | Địa chỉ công ty |
| 7 | Tin tuyển dụng |
| 8 | Công ty bạn có thể quan tâm |
| 9 | Cột phải: Thông tin chung |
| 10 | Cột phải: Chia sẻ công ty |
| 11 | Khi không tìm thấy công ty |

## 2. Quy ước chung

- **Bố cục:** cột nội dung chính (khối 3–8) bên trái, cột phải (khối 9–10) cố định theo khi cuộn trang.
- **Tên trang** hiển thị trên thẻ trình duyệt theo tên công ty.
- **Theo dõi công ty:** dùng chung với màn hình Khám phá công ty; theo dõi ở đâu thì trạng thái và số người theo dõi cập nhật ở đó.
- **Tìm không phân biệt dấu và hoa thường.**
- **Thông báo ngắn** hiện 3 giây rồi tự tắt, xuất hiện ở hai thao tác: bấm Theo dõi/Bỏ theo dõi ("Đã theo dõi <tên công ty>" / "Đã bỏ theo dõi <tên công ty>") và sao chép đường dẫn ("Đã sao chép liên kết công ty").

## 3. Mô tả từng khối

### 3.1 Khối thương hiệu

- **Thành phần:** ảnh bìa; logo; tên công ty kèm biểu tượng huy hiệu màu cam nếu là công ty có độ uy tín cao (mọi công ty trên EasyCV đều đã được xác thực, nên biểu tượng này không phải dấu xác thực); hàng thông tin ngắn gồm các lĩnh vực hoạt động và liên kết website (mở tab mới); nút **Theo dõi**.
- **Nút Theo dõi:** giống thẻ công ty ở màn hình Khám phá. Chưa đăng nhập thì yêu cầu đăng nhập trước. Đã đăng nhập thì bấm để theo dõi/bỏ theo dõi; nút đổi giữa "+ Theo dõi (N)" và "✓ Đang theo dõi (N+1)". Số người theo dõi hơn 1.000 được rút gọn dạng "1,2k".
- Công ty chưa có website thì không hiện liên kết.

### 3.2 Thanh điều hướng nội dung

- **2 mục:** **Giới thiệu** và **Việc làm (N)** với N là tổng số tin đang tuyển.
- Bấm mục nào thì cuộn tới khối tương ứng; khi cuộn trang, mục của khối đang xem được tô nổi bật.

### 3.3 Về công ty

- Tiêu đề "Về <tên công ty>" và phần giới thiệu gồm một hoặc nhiều đoạn văn.
- Công ty chỉ có giới thiệu ngắn thì hiện đoạn đầu và nút **Xem thêm ↓**; bấm để mở thêm đoạn còn lại, nút đổi thành **Thu gọn ↑**.

### 3.4 Hình ảnh công ty

- Lưới ảnh **3 cột**, tối đa **6 ảnh** (2 hàng). Ảnh do công ty đăng tải trên nền tảng dành cho nhà tuyển dụng.
- Công ty chưa đăng ảnh thì ẩn cả khối, không hiển thị ảnh thay thế.

### 3.5 Phúc lợi & cuộc sống tại công ty

- Lưới **3 cột**, mỗi ô gồm biểu tượng và tên phúc lợi. Tối đa **9 ô** (3 hàng).
- Danh sách phúc lợi do công ty đăng tải trên nền tảng dành cho nhà tuyển dụng.

### 3.6 Địa chỉ công ty

- Liệt kê **tất cả địa chỉ làm việc** của công ty, không giới hạn số lượng. Chỉ **trụ sở công ty** có **bản đồ** nhúng và liên kết **Nhấn để xem bản đồ** (mở bản đồ ở tab mới); các địa chỉ còn lại chỉ hiện dạng chữ.
- Địa chỉ làm việc từ xa (Remote) không được liệt kê.

### 3.7 Tin tuyển dụng

- **Tiêu đề** "Tin tuyển dụng" kèm số vị trí đang tuyển.
- **Thanh tìm việc trong công ty:** ô từ khóa ("Tên công việc, vị trí ứng tuyển..."), ô chọn địa điểm (mặc định "Tất cả tỉnh/thành phố", các lựa chọn là những tỉnh/thành công ty đang có hoạt động) và nút **Tìm kiếm**.
  - Từ khóa khớp khi xuất hiện trong tên vị trí hoặc kỹ năng của tin.
  - Chọn địa điểm thì lọc ngay; từ khóa lọc khi bấm Tìm kiếm hoặc Enter. Hai điều kiện kết hợp "VÀ".
- **Dòng đếm:** khi chưa lọc ghi "N việc làm đang tuyển"; khi đang lọc ghi "N việc làm phù hợp với tìm kiếm".
- **Danh sách:** mỗi tin là một thẻ gồm logo công ty, tên vị trí, mức lương, tên công ty, thẻ địa điểm, thẻ số năm kinh nghiệm và nút lưu việc làm (hình trái tim, bấm để lưu/bỏ lưu). Hiện toàn bộ tin phù hợp, không phân trang.
- Bấm tên vị trí thì mở trang chi tiết việc làm.
- **Khi không có tin phù hợp:** hộp "Chưa có việc phù hợp", một dòng gợi ý bỏ bớt bộ lọc và nút **Xem tất cả việc làm** (xóa từ khóa và địa điểm).

### 3.8 Công ty bạn có thể quan tâm

- Tối đa **6 thẻ công ty** cùng lĩnh vực hoạt động với công ty đang xem (không gồm chính công ty này) và có địa điểm hoạt động nằm trong tỉnh/thành mà người dùng thường xuyên tìm kiếm. Xếp theo số lượt theo dõi từ cao xuống thấp. Người dùng chưa có tỉnh/thành tìm kiếm thì chỉ lọc theo lĩnh vực hoạt động, vẫn xếp theo số lượt theo dõi. Dùng đúng kiểu thẻ ở màn hình Khám phá công ty.
- Không có công ty phù hợp thì ẩn cả khối.

### 3.9 Cột phải: Thông tin chung

- 4 dòng: **Quy mô** (số nhân viên), **Địa điểm** (các tỉnh/thành hoạt động), **Ngành nghề**, **Website** (liên kết mở tab mới; chưa có thì ghi "Chưa cập nhật").

### 3.10 Cột phải: Chia sẻ công ty

- **Sao chép đường dẫn:** ô hiển thị đường dẫn trang (chỉ đọc) và nút sao chép; bấm thì sao chép và hiện thông báo "Đã sao chép liên kết công ty".
- **Chia sẻ qua mạng xã hội:** 3 nút Facebook, X, LinkedIn, mỗi nút mở cửa sổ chia sẻ ở tab mới.

### 3.11 Khi không tìm thấy công ty

- Thay toàn bộ nội dung bằng hộp "Không tìm thấy công ty", một dòng mô tả và nút **Khám phá công ty** quay về màn hình Khám phá.

## 4. Bảng số lượng

| Khối | Số lượng |
| --- | --- |
| Mục trong thanh điều hướng nội dung | 2 |
| Ảnh trong hình ảnh công ty | tối đa 6 (lưới 3 cột) |
| Ô phúc lợi | tối đa 9 (lưới 3 cột) |
| Địa chỉ làm việc hiển thị | tất cả (chỉ trụ sở có bản đồ) |
| Công ty gợi ý "Công ty bạn có thể quan tâm" | tối đa 6 |
| Dòng trong Thông tin chung | 4 |
| Nút chia sẻ mạng xã hội | 3 |
| Thời gian hiện thông báo sau khi theo dõi/bỏ theo dõi hoặc sao chép liên kết | 3 giây |

## 5. Câu hỏi còn mở

- Chưa có đặc tả (Google Sheet) cho màn hình này; nội dung dựa trên bản dựng hiện tại. Cần xác nhận lại theo đặc tả khi có.
- Tiêu chí để một công ty được coi là có độ uy tín cao (hiện huy hiệu) chưa xác định; sẽ bổ sung sau.
