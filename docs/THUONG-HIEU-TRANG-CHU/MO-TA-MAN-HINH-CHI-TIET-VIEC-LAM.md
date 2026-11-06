# Mô tả màn hình Chi tiết việc làm (EasyCV)

## 1. Tổng quan

Màn hình hiển thị đầy đủ một tin tuyển dụng. Gồm, từ trên xuống: thanh tìm kiếm, rồi 2 cột: bên trái là nội dung tin, bên phải là thông tin công ty và việc làm khác của công ty; cuối trang là footer.

| # | Khối |
| --- | --- |
| 1 | Thanh tìm kiếm |
| 2 | Phần đầu tin: tên việc, lương, thông tin chính, nút hành động |
| 3 | Nội dung tin: Tổng quan, Mô tả công việc, Yêu cầu ứng viên, Quyền lợi, Địa điểm và thời gian |
| 4 | Mức độ cạnh tranh hồ sơ |
| 5 | Báo cáo tin và đánh giá mức minh bạch |
| 6 | Thông tin công ty (cột trái) |
| 7 | Việc làm khác của công ty (cột trái) |
| 8 | Thẻ công ty (cột phải) |
| 9 | Việc làm liên quan (cột phải) |
| 10 | Footer |

## 2. Quy ước chung

- **Bố cục:** 2 cột, nội dung tin bên trái, cột công ty bên phải. Cột phải dính khi cuộn trang nên luôn nhìn thấy.
- **Việc đang xem** do đường dẫn quyết định. Mở từ một thẻ việc ở trang khác thì hiện đúng việc đó; đường dẫn không khớp việc nào thì hiện màn "Không tìm thấy tin tuyển dụng" kèm nút **Quay lại danh sách việc làm**.
- **Tiêu đề tab trình duyệt:** "Tên việc | Tên công ty - Tuyển dụng EasyCV".
- **Mục chưa có dữ liệu:** Mô tả công việc, Yêu cầu ứng viên, Quyền lợi hiện một dòng "Nhà tuyển dụng đang cập nhật …".
- **Lưu tin:** có 2 nút Lưu ở các vị trí khác nhau (phần đầu tin, cuối mục Địa điểm và thời gian); bấm một nút thì các nút còn lại đổi theo. Nút đang lưu hiện chữ **Đã lưu**, chưa lưu hiện **Lưu tin**; mỗi lần bấm có thông báo ngắn. Danh sách tin đã lưu dùng chung với các trang khác của EasyCV.
- **Ứng tuyển:** mọi nút **Ứng tuyển ngay** trên trang (phần đầu tin, cuối mục Địa điểm và thời gian) cùng một hành vi: mở cửa sổ ứng tuyển vị trí đang xem. Trong cửa sổ người dùng chọn một CV có sẵn hoặc tạo thư xin việc (cover letter) để ứng tuyển, và chọn có cho phép EasyCV phân tích CV của mình hay không. Ứng tuyển xong hiện thông báo thành công.
- **Liên kết đến công ty:** mọi liên kết sang công ty (tên công ty, **Xem thêm**, **Xem trang công ty**) dẫn tới trang chủ công ty đó trên EasyCV; công ty chưa đăng ký trên EasyCV thì dẫn tới website của công ty.

## 3. Mô tả từng khối

### 3.1 Thanh tìm kiếm

- Thừa kế từ trang chủ và trang Tra cứu việc làm: nút **Danh mục Nghề**, ô từ khóa (có nút xóa nhanh), ô địa điểm (khung chọn tỉnh/thành, quận/huyện), nút **Tìm kiếm**; lịch sử tìm kiếm và gợi ý khi bấm vào ô từ khóa hoạt động như trang chủ.
- Bấm Tìm (hoặc Enter, chọn một gợi ý) thì **chuyển sang trang Tra cứu việc làm** với kết quả theo từ khóa/địa điểm/nghề vừa chọn.

### 3.2 Phần đầu tin

- **Tên việc** (tiêu đề lớn).
- **Mức lương** kèm liên kết **Xem mức lương thị trường cho vị trí này** → mở màn **Tra cứu lương**.
- 3 ô thông tin: **Địa điểm** (tỉnh/thành), **Kinh nghiệm**, **Hạn ứng tuyển** (ngày/tháng/năm).
- 2 nút: **Ứng tuyển ngay** và **Lưu tin**.

### 3.3 Nội dung tin

Một thẻ gồm các mục theo thứ tự:

| Mục | Nội dung |
| --- | --- |
| Tổng quan | 3 dòng nhãn: **Yêu cầu** (kinh nghiệm, học vấn), **Quyền lợi** (các quyền lợi lấy từ thông tin JD nhà tuyển dụng đã nộp), **Chuyên môn** (các kỹ năng của tin) |
| Mô tả công việc | thẻ tóm tắt "Trọng tâm công việc" (ý đầu tiên của mô tả) và danh sách gạch đầu dòng |
| Yêu cầu ứng viên | thẻ tóm tắt "Yêu cầu cốt lõi" (kinh nghiệm kèm tối đa 3 kỹ năng đầu) và danh sách gạch đầu dòng |
| Quyền lợi | thẻ tóm tắt "Quyền lợi nổi bật" (ý đầu tiên của quyền lợi) và danh sách gạch đầu dòng |
| Địa điểm và thời gian | **Địa điểm làm việc** (tỉnh/thành và địa chỉ), **Thời gian làm việc**, **Cách thức ứng tuyển**, rồi nút **Ứng tuyển ngay**, **Lưu tin**, dòng **Hạn ứng tuyển** |

- **Cách thức ứng tuyển:** một dòng hướng dẫn bấm **Ứng tuyển** để nộp hồ sơ trực tuyến.

### 3.4 Mức độ cạnh tranh hồ sơ

- Nằm trong mục Địa điểm và thời gian, dưới dòng Hạn ứng tuyển.
- **Chỉ hiển thị** khi người dùng đã ứng tuyển tin này và đã dùng chức năng phân tích độ cạnh tranh; chưa thì ẩn cả khối.
- Gồm: tiêu đề, nhãn mức cạnh tranh (**Cạnh tranh thấp / trung bình / cao**), thanh đo 3 mốc Thấp - Trung bình - Cao với điểm đánh dấu vị trí của bạn, một câu mô tả (so với bao nhiêu ứng viên đã ứng tuyển; nếu thấp hơn mặt bằng thì gợi ý cải thiện yếu tố yếu nhất), liên kết **Xem chi tiết thống kê**.
- Mức cạnh tranh theo chênh lệch điểm trung bình giữa hồ sơ của bạn và ứng viên đã ứng tuyển: chênh từ +5 điểm trở lên là cao, từ -5 điểm trở xuống là thấp, còn lại là trung bình.
- **Xem chi tiết thống kê** mở cửa sổ: tiêu đề, dòng "tên việc · công ty · N ứng viên đã ứng tuyển", biểu đồ mạng nhện 2 vùng (**Hồ sơ của bạn**, **Trung bình ứng viên đã ứng tuyển**), bảng 4 cột (Yếu tố, Bạn, TB, Chênh lệch; chênh dương tô màu tăng, âm tô màu giảm) và chú thích thang điểm 0 - 100. Đóng bằng nút ×, bấm ra ngoài hoặc phím Esc.
- Hồ sơ cao hơn mặt bằng ứng viên là có lợi thế so với những người đã ứng tuyển.

### 3.5 Báo cáo tin và đánh giá minh bạch

- **Báo cáo tin:** dòng cảnh báo tin sai hoặc có dấu hiệu lừa đảo kèm liên kết **hãy phản ánh với chúng tôi**; bấm thì hiện thông báo đã ghi nhận phản ánh.
- **Đánh giá "Tin tuyển dụng này minh bạch đến đâu?":** 5 mức bấm chọn, từ 1 **Rất mơ hồ** đến 5 **Rất minh bạch** (Rất mơ hồ, Còn thiếu, Tạm ổn, Khá minh bạch, Rất minh bạch). Chọn một mức thì mức đó được tô sáng và có thông báo "Cảm ơn bạn đã đánh giá tin tuyển dụng này." Dòng gợi ý dưới tiêu đề: "Đánh giá của bạn giúp những người tìm việc khác nhận biết tin đáng tin cậy. Bạn có thể thay đổi bất cứ lúc nào." Mức đã chọn được nhớ khi mở lại tin. Dùng bàn phím: mũi tên để chuyển mức, Home/End về mức đầu/cuối.

### 3.6 Thông tin công ty (cột trái)

- Tên công ty, đoạn giới thiệu ngắn kèm liên kết **Xem thêm** (→ trang chủ công ty, hoặc website công ty nếu chưa đăng ký trên EasyCV).
- **Địa chỉ làm việc:** địa chỉ và hình bản đồ minh họa có nút **Xem trên bản đồ**, mở Google Maps ở tab mới theo địa chỉ đó.

### 3.7 Việc làm khác của công ty (cột trái)

- Danh sách thẻ gồm logo, tên việc, mức lương, tên công ty, các nhãn **tỉnh/thành**, **kinh nghiệm**; tin nổi bật hoặc tuyển gấp có thêm nhãn **HOT**.
- Tối đa **20** thẻ. Ưu tiên việc cùng ngành nghề với tin đang xem; không gồm tin của chính công ty đang xem.
- Bấm thẻ thì mở trang chi tiết của việc đó. Không có việc nào thì ẩn cả khối.

### 3.8 Thẻ công ty (cột phải)

- Logo và tên công ty (bấm vào → trang chủ công ty, hoặc website công ty nếu chưa đăng ký trên EasyCV); 3 dòng thông tin: **Quy mô**, **Địa điểm**, **Ngành nghề**; nút **Xem trang công ty**.

### 3.9 Việc làm liên quan (cột phải)

- Danh sách tối đa **20** thẻ gồm logo, tên việc, mức lương, 2 nhãn **tỉnh/thành** và **kinh nghiệm**; là các việc khác của chính công ty đang tuyển, không trùng với tin đang xem.
- Bấm thẻ thì mở trang chi tiết việc đó. Không có việc nào thì ẩn cả khối.

## 4. Bảng số lượng

| Khối | Số lượng |
| --- | --- |
| Ô thông tin ở phần đầu tin | 3 (Địa điểm, Kinh nghiệm, Hạn ứng tuyển) |
| Nút hành động ở phần đầu tin | 2 (Ứng tuyển ngay, Lưu tin) |
| Dòng nhãn trong Tổng quan | 3 (Yêu cầu, Quyền lợi, Chuyên môn) |
| Mục nội dung tin | 5 (Tổng quan, Mô tả công việc, Yêu cầu ứng viên, Quyền lợi, Địa điểm và thời gian) |
| Thẻ tóm tắt đầu mục | 3 (Mô tả, Yêu cầu, Quyền lợi) |
| Kỹ năng trong thẻ tóm tắt Yêu cầu | tối đa 3 |
| Mục nhỏ trong Địa điểm và thời gian | 3 (Địa điểm làm việc, Thời gian làm việc, Cách thức ứng tuyển) |
| Mức nhãn cạnh tranh | 3 (thấp, trung bình, cao) |
| Yếu tố trong biểu đồ mạng nhện | 6 (Kinh nghiệm, Kỹ năng phù hợp, Học vấn, Chứng chỉ, Mức lương mong muốn, Độ hoàn thiện hồ sơ) |
| Mức đánh giá minh bạch | 5 |
| Thẻ ở Việc làm khác của công ty (cột trái) | tối đa 20 |
| Thẻ ở Việc làm liên quan (cột phải) | tối đa 20 |
| Dòng thông tin trong thẻ công ty | 3 (Quy mô, Địa điểm, Ngành nghề) |
| Cột bố cục | 2 |
