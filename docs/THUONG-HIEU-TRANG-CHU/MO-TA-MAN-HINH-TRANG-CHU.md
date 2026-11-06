# Mô tả màn hình Trang chủ ứng viên (EasyCV)

## 1. Tổng quan

Trang chủ giới thiệu một số thông tin có trên nền tảng đến người dùng là ứng viên tìm việc. Nội dung trang được quản lý trong hệ thống CMS.

| # | Khối |
| --- | --- |
| 1 | Hero Search (bộ lọc danh mục nghề, ô tìm kiếm, bộ lọc địa điểm, nút tìm kiếm) |
| 2 | Gợi ý xu hướng |
| 3 | Banner thương hiệu |
| 4 | Việc làm nổi bật |
| 5 | Công ty nổi bật |
| 6 | Quảng cáo nâng cấp VIP |
| 7 | Việc làm phù hợp với bạn |
| 8 | Khám phá CV |
| 9 | Ngành nghề và từ khóa phổ biến |
| 10 | Quảng bá thương hiệu nhà phát triển |
| 11 | Chân trang |

## 2. Quy ước chung

- Thanh tìm kiếm bám dưới thanh menu khi người dùng cuộn trang qua vị trí ban đầu của nó.
- Các khối tự chạy (banner lớn, công ty nổi bật, việc làm nổi bật, mẫu CV) tạm dừng khi rê chuột vào vùng đó.
- Nút lưu trên thẻ việc làm dùng chung cho mọi khối việc làm; việc đã lưu được giữ lại khi tải lại trang.
- Rê chuột vào tên việc làm hiện cửa sổ xem trước (preview); bấm vào tên việc mở trang chi tiết việc làm.
- **Chú thích khi rê chuột (tooltip):**
  - Banner (lớn và nhỏ): hiện tên banner (tên chương trình/quảng cáo của banner đó).
  - Logo công ty trên thẻ việc: "Công ty [Tên công ty] tuyển dụng tại EasyCV". Nếu tên đã bắt đầu bằng "Công ty" thì không thêm lần nữa.
  - Logo công ty trong khối Công ty nổi bật: "Công ty [Tên công ty]". Nếu tên đã bắt đầu bằng "Công ty" hoặc "Ngân hàng" thì giữ nguyên tên.
  - Tên việc làm: hiện tên việc đầy đủ. Tên công ty: hiện tên công ty đầy đủ.
  - Nút lưu: "Lưu"; khi việc đã lưu: "Đã Lưu".
  - Huy hiệu Tia Sét: hiện hộp giải thích riêng (xem mục 3.4).
  - Các nút trước/sau: "Banner trước" / "Banner tiếp theo", "Ngành nghề trước" / "Ngành nghề tiếp theo", "Công ty trước" / "Công ty tiếp theo", "Mẫu CV trước" / "Mẫu CV tiếp theo".
  - Nút "Danh mục Nghề": "Mở bộ lọc theo danh mục nghề". Nút xóa trong ô từ khóa: "Xóa từ khóa".
- **Cách xếp thứ tự bằng điểm:** nhiều khối xếp việc làm theo điểm, việc nào điểm cao hơn được đưa lên trước. Điểm là tổng các nhóm dữ liệu nhân với trọng số ghi ở từng khối.

## 3. Từng khối

### 3.1 Hero Search

**Bộ lọc danh mục ngành nghề:** nút "Danh mục Nghề" mở cửa sổ hai cột (nhóm nghề bên trái, nghề/vị trí chuyên môn của nhóm đang chọn bên phải). Chọn xong, tên nhóm hiện trên nút và được truyền sang trang kết quả.
- Danh mục nhóm nghề/nghề được xây dựng và quản lý trong hệ thống CMS.
- Nhóm ngành nghề nào có số lượng việc làm nhiều nhất thì được xếp lên đầu.
- Trong mỗi nhóm hiển thị tối đa 8 vị trí chuyên môn có số lượng tìm kiếm nhiều nhất.

**Ô tìm kiếm (box search)** có bảng gợi ý với hai trạng thái:

*Chưa nhập gì:*
- **Từ khóa tìm kiếm gần đây:** lưu tối đa 7 từ khóa tìm kiếm gần nhất.
- **Việc làm có thể bạn quan tâm:** 5 thẻ việc. Điểm của việc làm gồm gói trả phí (trọng số 0.45) và dữ liệu người dùng (tổng trọng số 0.55), trong đó dữ liệu người dùng gồm:
  - Hành vi gần đây: dữ liệu tìm việc (0.05), dữ liệu xem việc (0.05), dữ liệu lưu việc (0.05).
  - Dữ liệu hồ sơ và CV ứng viên (0.1).
  - Tín hiệu của việc làm: mới đăng (0.05), độ nhận diện thương hiệu (0.15), độ tương tác (0.1).
  - Việc nào điểm cao hơn được xếp trước.

*Đã nhập (từ ký tự thứ 2):*
- Nhóm "Từ khóa tìm kiếm gần đây" được thay bằng nhóm **"Từ khóa gợi ý"**.
- Hệ thống truy xuất dữ liệu ngành nghề có sẵn để đưa ra tối đa 5 từ khóa gợi ý theo chữ đã nhập.
- Hiển thị 5 thẻ việc; việc được đề xuất dựa vào từ khóa người dùng nhập, dùng từ khóa gợi ý ở trên để lọc ra.

**Bộ lọc địa điểm:** cho chọn theo Tỉnh/thành phố – Quận/huyện đối với dữ liệu trước ngày 01/07/2025, và Tỉnh/thành phố – Phường/xã đối với dữ liệu sau ngày 01/07/2025.

**Nút Tìm kiếm** (hoặc Enter, hoặc bấm một gợi ý): chuyển sang trang Tra cứu việc làm kèm từ khóa, địa điểm, danh mục nghề đã chọn; từ khóa được thêm vào lịch sử tìm kiếm.

### 3.2 Gợi ý xu hướng

Dòng "Xu hướng:" gồm 5 từ khóa có lượt tìm kiếm nhiều nhất trong 60 ngày gần nhất, tự động cập nhật lúc 0h hằng ngày. Bấm một từ khóa mở trang Tra cứu việc làm với từ khóa đó.

### 3.3 Banner thương hiệu

Nội dung do CMS quản lý. Chia làm 3 khối:
- **Banner thứ nhất (to nhất, bên trái):** số banner có thể hiển thị do CMS quản lý; tự động chuyển sau 10 giây, hiệu ứng chuyển 300ms. Rê chuột vào thì ngừng tự chuyển. Bấm vào chuyển đến trang chủ công ty. Có nút trước/sau và chấm điều hướng.
- **Hai banner nhỏ bên cạnh:** đặt cố định. Thời gian đổi dựa vào chính sách sau này.

### 3.4 Việc làm nổi bật

- **Tab theo ngành nghề:** sắp xếp theo nhóm ngành nghề có số lượng việc làm nhiều nhất; số tab không giới hạn và được quản lý trong hệ thống CMS; có thanh tab cuộn ngang bằng nút trước/sau.
- **Lưới thẻ:** tối đa 3 cột × 4 hàng; phân trang. **Cứ 10 giây tự chuyển trang một lần.** Rê chuột vào tên việc hiện cửa sổ xem trước.
- **Thẻ việc:** logo công ty (kèm huy hiệu nếu có), tên việc, tên công ty, mức lương, tỉnh/thành, nút lưu.
- **Thứ tự việc:**
  - *Chưa đăng nhập:* hiển thị danh sách các trang việc; ngành nghề có lượng việc lớn hơn hiển thị trước; trong mỗi trang, mỗi ngành nghề lấy 2 thẻ việc. Tab "Tất cả" cũng theo quy tắc này.
  - *Đã đăng nhập:* điểm gồm gói trả phí (trọng số 0.45) và dữ liệu người dùng (tổng trọng số 0.55), trong đó dữ liệu người dùng gồm hành vi gần đây (tìm việc 0.05, xem việc 0.05, lưu việc 0.05), hồ sơ và CV ứng viên (0.1), tín hiệu của việc làm (mới đăng 0.05, độ nhận diện thương hiệu 0.15, độ tương tác 0.1). Việc điểm cao hơn xếp trước. Từ đó đưa ra các việc trong nhóm ngành/nghề và các nghề liên quan.
- **Huy hiệu Tia Sét ⚡** gắn lên logo công ty, dành cho tin mà nhà tuyển dụng (HR) tương tác nhiều. Tin được gắn huy hiệu khi thỏa đồng thời:
  - Tin đang hiển thị.
  - Có tối thiểu 2 CV ứng tuyển.
  - Tỷ lệ tương tác từ 80% trở lên tại thời điểm hệ thống xét.
  - Hệ thống xét 2 lần mỗi ngày, vào khoảng 0h và 12h. Nếu đạt ở lần xét đó thì huy hiệu hiển thị trong khung giờ tiếp theo.
  - **Tỷ lệ tương tác** = số CV ứng tuyển trong 30 ngày gần nhất đã được nhà tuyển dụng đánh giá trong vòng 14 ngày kể từ lúc CV ứng tuyển ÷ tổng số CV ứng tuyển trong 30 ngày gần nhất × 100%.
  - **Hộp giải thích khi rê chuột vào huy hiệu:** tiêu đề "⚡ Huy hiệu Tia Sét" kèm trạng thái "Đang hiển thị"; dòng "Tỷ lệ tương tác: X%" kèm số CV đã đánh giá trên tổng số CV (ví dụ 8/10 CV đã đánh giá); các điều kiện (tin đang hiển thị và có tối thiểu 2 CV ứng tuyển trong 30 ngày gần nhất; tỷ lệ tương tác từ 80% trở lên, tính theo CV được nhà tuyển dụng đánh giá trong vòng 14 ngày kể từ lúc nộp; hệ thống xét 2 lần mỗi ngày lúc 0h và 12h); dòng cuối cho biết lần xét gần nhất lúc mấy giờ và huy hiệu được giữ trong khung giờ tiếp theo.
  - Ví dụ: Tin A có 10 CV trong 30 ngày gần nhất, HR xử lý 8 CV trong ≤14 ngày → 8/10 = 80% → đạt huy hiệu. Sau đó có thêm 6 CV HR chưa xử lý → 8/16 = 50% → mất huy hiệu ở lần xét tiếp theo.

### 3.5 Công ty nổi bật

- Chỉ gồm các công ty đã đăng ký xác thực trên nền tảng.
- Thứ tự hiển thị theo độ phổ biến của công ty (trọng số 0.5) và công ty trả phí (trọng số 0.5).
- **Điểm độ phổ biến thương hiệu** = 35% Search Awareness + 20% Digital Reach + 15% Social Presence + 30% Candidate Interest, trong đó:

| Thành phần | Cách đo | Trọng số |
| --- | --- | --- |
| Search Awareness | Mức độ tìm kiếm tên thương hiệu trên Google Trends tại Việt Nam | 35% |
| Digital Reach | Lượng truy cập website, thứ hạng website | 20% |
| Social Presence | Số người theo dõi trên LinkedIn, Facebook, TikTok, YouTube | 15% |
| Candidate Interest | Lượt tìm kiếm, xem, theo dõi, lưu việc, ứng tuyển trên chính EasyCV | 30% |

- Hiển thị 5 thẻ; cứ 2 giây chuyển một thẻ từ phải qua trái. Có nút trước/sau và liên kết "Xem tất cả".

### 3.6 Quảng cáo nâng cấp VIP

Một thẻ ngang gồm tiêu đề, mô tả, 3 quyền lợi (huy hiệu Ứng viên nổi bật, xem ai đã đọc CV, ưu tiên phỏng vấn) và nút "Dùng thử VIP 14 ngày miễn phí".

### 3.7 Việc làm phù hợp với bạn

Hiển thị theo dữ liệu người dùng, mỗi nhóm dữ liệu có trọng số:
- Dữ liệu tìm việc: 0.15
- Dữ liệu xem việc: 0.15
- Dữ liệu lưu việc: 0.1
- Dữ liệu hồ sơ và CV ứng viên: 0.6

Hiển thị tối đa 12 thẻ mỗi trang. Thẻ việc, cửa sổ xem trước và nút lưu giống khối Việc làm nổi bật. Có liên kết "Xem tất cả" sang trang Tra cứu việc làm.

### 3.8 Khám phá CV

- Hiển thị các mẫu CV được nhiều người sử dụng nhất, cập nhật lúc 0h hằng ngày.
- Các nút lọc phong cách: Tất cả, Cổ điển, Sáng tạo, Tối giản, Hiện đại, Chuyên nghiệp. Một mẫu có thể thuộc nhiều phong cách.
- Dải mẫu chạy vòng liên tục, cứ 2 giây dịch một thẻ, có nút trước/sau.
- Bấm một mẫu mở trang chỉnh sửa CV với mẫu đó.

### 3.9 Ngành nghề và từ khóa phổ biến

Cả hai phần cập nhật lúc 0h hằng ngày.
- **Khối ngành nghề:** sắp xếp theo số lượng việc làm từ nhiều đến ít; mỗi thẻ gồm tên ngành và số việc làm. Số thẻ ngành nghề được quản lý trong hệ thống CMS. Hiển thị 4 cột × 2 hàng = 8 thẻ mỗi trang, chuyển trang bằng nút trước/sau.
- **Khối từ khóa:** sắp xếp theo số lượt tra cứu từ nhiều đến ít, tối đa 25 từ khóa. Mỗi nhãn gồm từ khóa và số việc. Bấm một từ khóa chạy tìm kiếm như ở khối Hero Search.

### 3.10 Quảng bá thương hiệu nhà phát triển

Được quản lý trong hệ thống CMS. Nội dung được cấu hình và hiển thị riêng biệt.

### 3.11 Chân trang

Được quản lý trong hệ thống CMS.

## 4. Bảng số lượng

| Khối | Số lượng | Chu kỳ |
| --- | --- | --- |
| Từ khóa tìm kiếm gần đây | tối đa 7 | không |
| Việc làm có thể bạn quan tâm (trong ô tìm kiếm) | 5 thẻ | không |
| Từ khóa gợi ý khi đang nhập | tối đa 5 | không |
| Việc đề xuất khi đang nhập từ khóa | 5 thẻ | không |
| Vị trí chuyên môn hiển thị trong mỗi nhóm nghề | tối đa 8 | không |
| Từ khóa xu hướng | 5 | cập nhật 0h hằng ngày (dữ liệu 60 ngày gần nhất) |
| Banner lớn | do CMS quản lý | tự chuyển 10 giây, hiệu ứng 300ms |
| Banner nhỏ | 2 | theo chính sách sau này |
| Tab ngành của Việc làm nổi bật | không giới hạn, do CMS quản lý | không |
| Lưới việc làm nổi bật | tối đa 3 cột × 4 hàng | tự chuyển trang 10 giây |
| Thẻ việc mỗi ngành trong mỗi trang (chưa đăng nhập) | 2 | không |
| Công ty nổi bật | 5 thẻ | 2 giây chuyển một thẻ |
| Thẻ việc của Việc làm phù hợp với bạn | tối đa 12 mỗi trang | không |
| Mẫu CV | theo mức sử dụng nhiều nhất | dịch một thẻ mỗi 2 giây; cập nhật 0h hằng ngày |
| Thẻ ngành nghề | do CMS quản lý; 8 mỗi trang (4 cột × 2 hàng) | cập nhật 0h hằng ngày |
| Từ khóa phổ biến | tối đa 25 | cập nhật 0h hằng ngày |
| Huy hiệu Tia Sét | điều kiện ≥2 CV, tương tác ≥80% | xét 2 lần mỗi ngày (0h và 12h) |

## 5. Câu hỏi còn mở

- Số mẫu CV hiển thị cùng lúc trong khối Khám phá CV chưa ghi trong đặc tả.
