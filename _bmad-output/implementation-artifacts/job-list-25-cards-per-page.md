# Đặc Tả Triển Khai: Hiển Thị 25 Thẻ Việc Làm Trên 1 Trang (Job List Screen)

Nền tảng: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Màn hình: **Danh sách việc làm (`viec-lam.html`) & Chi tiết việc làm (`chi-tiet-viec-lam.html`)**  
Ngày cập nhật: **03/10/2026**  
Trạng thái: **Hoàn thành & Đã kiểm thử tự động 100% (Passed)**

---

## 1. Yêu Cầu & Bối Cảnh (Requirements & Context)

Người dùng yêu cầu:

> **"Màn list job: tạo mẫu cho tôi 25 thẻ job trên 1 trang"**

Trước đây:

- Kích thước phân trang đang đặt ở mức thấp: `const PAGE_SIZE = 6;`
- Bộ dữ liệu mẫu chỉ gồm 16 việc làm (IDs 1–16).
- Màn hình chỉ hiển thị tối đa 6 thẻ việc làm trên mỗi trang, khiến danh sách bị chia nhỏ rời rạc và ứng viên phải bấm chuyển trang liên tục.

Mục tiêu triển khai:

1. Cấu hình kích thước trang chuẩn hóa: **`PAGE_SIZE = 25`** (hiển thị đúng 25 thẻ việc làm trên 1 trang).
2. Xây dựng và bổ sung bộ dữ liệu mẫu phong phú, chuyên nghiệp gồm **28 việc làm thực tế** (IDs 1–28) bao phủ toàn diện các khối ngành nghề trọng điểm: Công nghệ thông tin / AI / Deep Learning, Tài chính / Ngân hàng / Quản trị rủi ro, Marketing / Thương hiệu, Nhân sự / HRBP, Logistics / Chuỗi cung ứng, Kỹ thuật nhúng / IoT, Kế toán trưởng.
3. Pre-render đầy đủ **25 thẻ việc làm tĩnh** trong mã nguồn HTML (`#jobListingGrid`) của cả `viec-lam.html` và `public/viec-lam.html` để tối ưu SEO, không gây giật khung hình (layout shift) khi tải trang.
4. Đồng bộ hóa 100% dữ liệu sang màn hình chi tiết `chi-tiet-viec-lam.html` và file điều khiển `js/chi-tiet-viec-lam.js` (cũng như bản sao `public/`).
5. Đảm bảo toàn bộ tương tác vi mô: Hover hiển thị nút ứng tuyển màu cam EasyCV (`#FF8A34` -> `#F97316`), Lưu (bookmark), mở chế độ xem 2 cột (Split View), và chuyển trang linh hoạt (`[« Trước] [1] [2] [Sau »]`).

---

## 2. Ma Trận Dữ Liệu 25 Việc Làm Mẫu (Trang 1)

| STT    | Vị trí công việc                               | Doanh nghiệp                | Mức lương     | Địa điểm               | Ngành     | Cấp bậc | Huy hiệu     |
| ------ | ---------------------------------------------- | --------------------------- | ------------- | ---------------------- | --------- | ------- | ------------ |
| **1**  | Senior Fullstack Developer (ReactJS / Node.js) | FPT Software                | 28 - 45 triệu | Hà Nội (Cầu Giấy)      | IT        | Senior  | ⚡ Tuyển gấp |
| **2**  | Chuyên Viên Khách Hàng Doanh Nghiệp (RM)       | Ngân hàng Techcombank       | 20 - 35 triệu | Hồ Chí Minh (Q.1)      | Sales     | Junior  | —            |
| **3**  | Senior Product Designer (UI/UX App/Web)        | VNG Corporation (Zalo Team) | 30 - 50 triệu | Hồ Chí Minh (Q.7)      | IT        | Senior  | Nổi bật      |
| **4**  | Trưởng Nhóm Digital Marketing & Growth Lead    | Viettel                     | 25 - 40 triệu | Hà Nội (Cầu Giấy)      | Marketing | Senior  | —            |
| **5**  | Chuyên Viên Chuỗi Cung Ứng & Vận Hành          | Shopee Vietnam (SPX)        | 18 - 28 triệu | HCM & Bình Dương       | Logistics | Junior  | —            |
| **6**  | DevOps / Cloud Infrastructure Engineer         | Ví MoMo (M-Service)         | 35 - 60 triệu | Toàn quốc (Remote)     | IT        | Senior  | Nổi bật      |
| **7**  | Senior Java Backend Engineer                   | VNPAY                       | 30 - 55 triệu | Hà Nội & Remote        | IT        | Senior  | ⚡ Tuyển gấp |
| **8**  | Chuyên Viên Kế Toán Tổng Hợp & Thuế            | Vingroup (Vinhomes)         | 18 - 28 triệu | Hà Nội (Long Biên)     | Finance   | Junior  | —            |
| **9**  | Nhân Viên Kinh Doanh B2B IT Solutions          | CMC Telecom                 | 16 - 35 triệu | Hà Nội & HCM           | Sales     | Junior  | —            |
| **10** | Content Marketing Specialist & Copywriter      | Base.vn                     | 15 - 22 triệu | Hồ Chí Minh (Q.3)      | Marketing | Junior  | —            |
| **11** | Mobile Developer (Flutter / React Native)      | One Mount Group (VinID)     | 25 - 42 triệu | Hà Nội (Hai Bà Trưng)  | IT        | Senior  | ⚡ Tuyển gấp |
| **12** | QA / QC Automation Test Engineer               | KMS Technology              | 20 - 36 triệu | Đà Nẵng & Remote       | IT        | Junior  | —            |
| **13** | Thực Tập Sinh Lập Trình Frontend ReactJS       | FPT Software Academy        | 6 - 10 triệu  | Hà Nội (Cầu Giấy)      | IT        | Intern  | —            |
| **14** | Chuyên Viên Tuyển Dụng & Đào Tạo (HR)          | Tiki Corporation            | 14 - 20 triệu | Hồ Chí Minh (Tân Bình) | HR        | Junior  | —            |
| **15** | Trưởng Phòng Kinh Doanh Toàn Quốc              | Masan Consumer              | 55 - 80 triệu | HCM & Hà Nội           | Sales     | Manager | Nổi bật      |
| **16** | Fresher Java Web Developer (Spring Boot)       | NashTech Vietnam            | 10 - 15 triệu | Hà Nội (Cầu Giấy)      | IT        | Junior  | —            |
| **17** | Kỹ Sư Trí Tuệ Nhân Tạo & Học Máy (AI/ML)       | VinAI Research              | 40 - 75 triệu | Hà Nội (Nam Từ Liêm)   | IT        | Senior  | ⚡ Tuyển gấp |
| **18** | Chuyên Viên Phân Tích Dữ Liệu Kinh Doanh       | MB Bank                     | 25 - 42 triệu | Hà Nội (Cầu Giấy)      | IT        | Senior  | —            |
| **19** | Trưởng Phòng Nhân Sự Tổng Hợp (HRBP)           | Vinamilk                    | 35 - 55 triệu | Hồ Chí Minh (Q.7)      | HR        | Manager | Nổi bật      |
| **20** | Kỹ Sư Lập Trình Nhúng & IoT (C/C++)            | Bosch Việt Nam              | 22 - 38 triệu | HCM & Đà Nẵng          | IT        | Junior  | ⚡ Tuyển gấp |
| **21** | Giám Đốc Thương Hiệu Sản Phẩm (Brand Manager)  | Unilever Việt Nam           | 45 - 65 triệu | Hồ Chí Minh (Q.7)      | Marketing | Manager | Nổi bật      |
| **22** | Chuyên Viên Quản Trị Rủi Ro Tài Chính          | VPBank                      | 22 - 38 triệu | Hà Nội (Ba Đình)       | Finance   | Junior  | —            |
| **23** | Chuyên Viên Vận Tải Quốc Tế & Forwarding       | Gemadept Logistics          | 16 - 26 triệu | Hải Phòng & HCM        | Logistics | Junior  | ⚡ Tuyển gấp |
| **24** | Kỹ Sư An Toàn Thông Tin & An Ninh Mạng (SOC)   | VNPT Cyber Immune           | 25 - 45 triệu | Hà Nội (Cầu Giấy)      | IT        | Senior  | ⚡ Tuyển gấp |
| **25** | Giám Đốc Sản Phẩm Công Nghệ (Head of Product)  | Tiki Tech Hub               | 50 - 75 triệu | HCM & Remote           | IT        | Manager | Nổi bật      |

_(Trang 2 hiển thị các công việc tiếp theo: Job 26 - FPT Digital ERP Consultant, Job 27 - Dentsu Creative Lead, Job 28 - Tân Á Đại Thành Chief Accountant)._

---

## 3. Các Tệp Mã Nguồn Đã Chỉnh Sửa & Đồng Bộ

1. [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js):
   - Đặt `const PAGE_SIZE = 25;`
   - Bổ sung các bản ghi chi tiết từ Job 17 đến Job 28 vào mảng `JOBS_DATA`.
   - Bổ sung cơ chế fallback cho selector `#paginationWrapper`: `document.getElementById('paginationWrapper') || document.querySelector('.pagination-wrapper')`.
2. [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js): Đồng bộ 100% với `js/viec-lam.js`.
3. [`js/chi-tiet-viec-lam.js`](file:///d:/master%20page/js/chi-tiet-viec-lam.js):
   - Cập nhật toàn bộ mảng `JOBS_DATA` gồm 28 công việc để mọi thẻ click mở tab riêng đều nạp đầy đủ mô tả công việc (JD), yêu cầu và đãi ngộ.
   - Dọn dẹp lỗi cú pháp khai báo trùng lặp `btnToggleFullWidth`.
4. [`public/js/chi-tiet-viec-lam.js`](file:///d:/master%20page/public/js/chi-tiet-viec-lam.js): Đồng bộ 100% với `js/chi-tiet-viec-lam.js`.
5. [`viec-lam.html`](file:///d:/master%20page/viec-lam.html):
   - Cập nhật chỉ số tổng số lượng việc làm: `<strong id="jobCountText">28</strong>`.
   - Bổ sung `id="paginationWrapper"` vào `<div class="pagination-wrapper" id="paginationWrapper">`.
   - Chèn đúng 25 thẻ việc làm tĩnh hoàn chỉnh vào `#jobListingGrid`.
6. [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html): Đồng bộ 100% với `viec-lam.html`.

---

## 4. Kết Quả Kiểm Thử Tự Động (Verification)

1. **Kiểm tra cú pháp Node.js (`node --check`):**
   - Đạt 100% cho cả 4 file JavaScript (`js/viec-lam.js`, `public/js/viec-lam.js`, `js/chi-tiet-viec-lam.js`, `public/js/chi-tiet-viec-lam.js`).
2. **Kiểm tra DOM tĩnh (`scratch/verify_static_html.js`):**
   - Xác nhận đúng 25 thẻ `.job-card` có sẵn trong HTML tĩnh trên cả `viec-lam.html` và bản sao `public/`.
   - Thẻ `#jobCountText` khởi tạo giá trị 28.
   - Thẻ phân trang có ID `#paginationWrapper`.
3. **Kiểm thử trình duyệt tương tác Chrome Headless CDP (`scratch/test_25_job_cards.js`):**
   - **Test 1**: Trang 1 render chính xác 25 thẻ job (PASS).
   - **Test 2**: Header thống kê cập nhật số lượng "28 việc làm đang tuyển dụng" (PASS).
   - **Test 3**: Phân trang hiển thị `« Trước [1] [2] Sau »` với nút 1 active (PASS).
   - **Test 4**: Bấm chuyển sang trang 2 hiển thị 3 việc làm còn lại, nút 2 active (PASS).
   - **Test 5**: Bấm quay lại trang 1 hiển thị mượt mà 25 thẻ việc làm ban đầu (PASS).
   - **Test 6**: Bắt ảnh chụp màn hình thực tế lưu tại `scratch/vieclam_25_cards_page1.png`.
4. **Kiểm thử hiệu ứng Hover (`scratch/verify_hover_25.js`):**
   - Di chuột lên thẻ việc làm: Nút "Ứng tuyển" chuyển trạng thái từ ẩn sang `opacity: 1; visibility: visible` với nền gradient cam thương hiệu `#FF8A34 -> #F97316` chuẩn xác.
5. **Kiểm thử tích hợp tìm kiếm & lọc (`scratch/test_job_search.js`):**
   - Đạt 5/5 bài kiểm tra (100% PASS).
