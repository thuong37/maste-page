---
title: EasyCV - Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh
version: 1.0.0
status: draft
created: 2026-09-29
updated: 2026-09-29
author: John (Product Manager, BMAD)
module: bmm
---

# PRD: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh

## 0. Document Purpose

Tài liệu Đặc tả Yêu cầu Sản phẩm (PRD) này được xây dựng bởi **John (Product Manager)** trong khung làm việc **BMAD Method (Planning Phase)** nhằm chuẩn hóa toàn bộ tầm nhìn, hành trình người dùng và yêu cầu chức năng (FRs) cho hệ thống tuyển dụng dành cho ứng viên **EasyCV**.

* **Đối tượng tiếp nhận:** 
  * **Sally (UX Designer):** Cơ sở để chuẩn hóa DESIGN.md & EXPERIENCE.md.
  * **Winston (System Architect):** Thiết kế kiến trúc module, dữ liệu và routing.
  * **Amelia (Senior Developer):** Phân tách thành Epics/Stories và triển khai kiểm thử - code.
  * **Ban Lãnh đạo & Stakeholders:** Nghiệm thu phạm vi tính năng MVP v1.
* **Tài liệu tham chiếu gốc:** [`docs/PHAN-TICH-TRANG-CHU-EASYCV.md`](file:///d:/master%20page/docs/PHAN-TICH-TRANG-CHU-EASYCV.md), [`docs/brand-guidelines.md`](file:///d:/master%20page/docs/brand-guidelines.md).

---

## 1. Vision & Value Proposition

**EasyCV** được định vị là **Trung tâm khám phá việc làm và kết nối nghề nghiệp thông minh hàng đầu**, không đơn thuần là một website đăng tin tuyển dụng tĩnh. Nền tảng giải quyết triệt để vấn đề "bội thực thông tin nhưng thiếu việc làm phù hợp" của thị trường tuyển dụng Việt Nam hiện nay.

### Tuyên ngôn giá trị:
1. **Tìm việc siêu tốc & chính xác:** Giúp ứng viên đi từ *Nhu cầu → Tìm kiếm → So sánh/Đánh giá → Ứng tuyển* với số lượt click tối thiểu (< 3 bước).
2. **Khám phá cơ hội theo dữ liệu & AI:** Tối ưu matching dựa trên kỹ năng, địa điểm, mức lương thực tế và hồ sơ ứng viên (AI Match Score).
3. **Thương hiệu tuyển dụng tin cậy:** Doanh nghiệp xác thực, thông tin minh bạch, đãi ngộ rõ ràng, tạo niềm tin cho người tìm việc.

---

## 2. Target User & User Journeys

### 2.1 Jobs To Be Done (JTBD)

* **Ứng viên đã đi làm (Experienced Candidate):** *"Khi tôi muốn nâng tầm sự nghiệp hoặc tìm kiếm mức đãi ngộ xứng đáng hơn, tôi muốn nhanh chóng lọc được các công việc lương cao từ 25-50 triệu, chế độ Hybrid/Remote và doanh nghiệp xác thực, để tôi không lãng phí thời gian nộp hồ sơ vào các tin ảo."*
* **Ứng viên trẻ / Mới ra trường (Junior / Fresher):** *"Khi tôi chưa có nhiều kinh nghiệm, tôi muốn tìm kiếm các cơ hội việc làm tiếp nhận Fresher, có hướng dẫn đào tạo và chuẩn bị một bộ CV chuẩn ATS đẹp mắt để tự tin ứng tuyển."*
* **Ứng viên chủ động theo dõi thị trường:** *"Tôi muốn lưu lại các công việc hấp dẫn, theo dõi doanh nghiệp yêu thích và nhận thông báo khi có việc làm mới khớp với hồ sơ của mình."*

### 2.2 Non-Users (v1)

* **Nhà tuyển dụng quản lý tin đăng & ứng viên chuyên sâu:** Phân hệ tuyển dụng nhà tuyển dụng (Recruiter ATS Portal) nằm ở phân hệ riêng, v1 chỉ cung cấp các điểm chạm dẫn link và hiển thị thương hiệu tài trợ trên trang ứng viên.
* **Ứng viên lao động phổ thông không yêu cầu CV:** EasyCV tập trung vào nhóm nhân sự tri thức, văn phòng, kỹ thuật công nghệ, kinh doanh, tài chính, marketing và logistics.

### 2.3 Key User Journeys (UJ)

#### UJ-1: Tìm kiếm việc làm nhanh theo vị trí từ Trang chủ (Minh - Senior Frontend Developer)
* **Bối cảnh:** Minh đang tìm việc làm ReactJS tại Hà Nội với mức lương từ 30 triệu.
* **Điểm vào:** Đang mở Trang chủ EasyCV trên máy tính hoặc điện thoại.
* **Luồng thực hiện:**
  1. Minh gõ từ khóa `"React"` vào ô tìm kiếm Hero Search trên Trang chủ.
  2. Bấm nút **"Tìm việc ngay"** (hoặc nhấn phím Enter).
  3. Hệ thống chuyển hướng ngay sang màn hình [`viec-lam.html?keyword=React`](file:///d:/master%20page/viec-lam.html).
  4. Màn hình kết quả tự động lọc ra các công việc chứa kỹ năng ReactJS/Node.js, hiển thị huy hiệu `Từ khóa: "React"` và số lượng việc làm tìm thấy.
  5. Minh bấm vào thẻ công việc của FPT Software để xem modal chi tiết (JD, yêu cầu, quyền lợi) và bấm **"Ứng tuyển"**.
* **Đích đến:** Minh nhận thông báo ứng tuyển thành công, có thể lưu công việc hoặc quay lại trang chủ bằng cách click vào Logo trên thanh menu.

#### UJ-2: Khám phá theo ngành nghề & bộ lọc thông minh (Hương - Chuyên viên Marketing)
* **Bối cảnh:** Hương muốn khảo sát các vị trí Digital Marketing và Content tại TP. Hồ Chí Minh.
* **Điểm vào:** Trang chủ EasyCV, click vào ô tìm kiếm.
* **Luồng thực hiện:**
  1. Hộp gợi ý thông minh (Smart Search Suggestion) mở ra, Hương xem qua lịch sử tìm kiếm và danh mục ngành **Marketing / PR / Quảng cáo**.
  2. Hương bấm vào tag vị trí `"Digital Marketing"`.
  3. Hệ thống tự động chuyển sang trang kết quả tìm việc với từ khóa Digital Marketing.
  4. Hương chọn thêm bộ lọc địa điểm `"Hồ Chí Minh"` và mức lương `> 25 triệu`.
  5. Danh sách việc làm cập nhật tức thì theo thời gian thực (Live Filtering).
* **Đích đến:** Hương chọn được 3 công việc ưng ý và nhấn biểu tượng Bookmark (❤️) để lưu việc làm.

#### UJ-3: Điều hướng xuyên suốt & Quản lý thông tin (Đức - Kỹ sư DevOps)
* **Bối cảnh:** Đức đang ở trang danh sách việc làm muốn quay về trang chủ để xem các mẫu CV hoặc chỉnh sửa hồ sơ cá nhân.
* **Điểm vào:** Trang [`viec-lam.html`](file:///d:/master%20page/viec-lam.html).
* **Luồng thực hiện:**
  1. Đức nhấn vào **Logo EasyCV** hoặc menu **"Tìm việc" / "Tìm kiếm việc làm"** trên thanh điều hướng.
  2. Trang lập tức điều hướng về trang chủ [`index.html`](file:///d:/master%20page/index.html).
  3. Đức xem phần "Mẫu CV chuyên nghiệp" hoặc click vào avatar tài khoản để xem độ hoàn thiện hồ sơ (85%).

---

## 3. Glossary (Thuật ngữ chuẩn hóa)

* **Candidate (Ứng viên):** Người tìm việc sử dụng nền tảng EasyCV.
* **Job Card (Thẻ công việc):** Khối hiển thị tóm tắt thông tin tuyển dụng (Tiêu đề, Công ty, Logo, Mức lương, Địa điểm, Thời gian đăng, Tags kỹ năng, Nút Lưu việc, Nút Ứng tuyển).
* **Hero Search Box (Khối tìm kiếm trọng tâm):** Khối tìm kiếm thông minh tại đầu trang chủ gồm ô nhập từ khóa, bộ chọn địa điểm 2 cấp và nút hành động "Tìm việc ngay".
* **Smart Suggest Dropdown (Menu gợi ý tìm kiếm):** Cửa sổ popover mở khi focus vào ô tìm kiếm, hiển thị lịch sử tìm kiếm gần đây và Mega-Menu ngành nghề đa cấp.
* **Live Filtering (Lọc thời gian thực):** Khả năng lọc và cập nhật ngay lập tức danh sách thẻ việc làm trên giao diện mà không cần reload toàn bộ trang web.
* **AI Match Score:** Chỉ số phần trăm mức độ tương thích giữa hồ sơ ứng viên và yêu cầu công việc.
* **Employer Spotlight (Tiêu điểm doanh nghiệp):** Khu vực hiển thị nổi bật dành cho các doanh nghiệp hàng đầu có xác thực và tài trợ tuyển dụng.

---

## 4. Features & Functional Requirements

### 4.1 Header & Điều hướng toàn cục (Global Navigation)

**Mô tả:** Thanh điều hướng cố định trên cùng màn hình (Sticky Navbar) với thiết kế hiện đại, hỗ trợ Dark/Light mode, menu dropdown đa cấp và Mobile Drawer.

#### FR-1: Logo Brand Navigation
* **Mô tả:** Người dùng nhấn vào Logo EasyCV (`.navbar-brand`) tại bất kỳ trang nào đều được chuyển hướng về Trang chủ [`index.html`](file:///d:/master%20page/index.html).
* **Điều kiện kiểm thử (Testable):**
  * Tại `viec-lam.html` hoặc bất kỳ trang con nào: Click logo → Điều hướng về `index.html`.
  * Tại chính `index.html`: Click logo → Cuộn mượt (smooth scroll) lên vị trí đầu trang `(top: 0)`.

#### FR-2: Điều hướng Menu "Tìm việc" / "Tìm kiếm việc làm"
* **Mô tả:** Menu "Tìm việc" và mục dropdown "Tìm kiếm việc làm" được thiết kế làm điểm neo truy cập trung tâm trang chủ.
* **Điều kiện kiểm thử (Testable):**
  * Trên `viec-lam.html` hoặc trang con: Click "Tìm việc" hoặc "Tìm kiếm việc làm" → Chuyển hướng về `index.html`.
  * Trên `index.html`: Click "Tìm việc" hoặc "Tìm kiếm việc làm" → Cuộn mượt đến ngay `#heroSearchBox` và tự động focus con trỏ vào ô nhập từ khóa.
  * Trên thiết bị di động (Mobile Drawer): Click "Tìm kiếm việc làm" → Đóng drawer và thực hiện luồng điều hướng tương ứng.

#### FR-3: Trung tâm tài khoản, thông báo và tin nhắn
* **Mô tả:** Hiển thị trạng thái đăng nhập của ứng viên, avatar có chỉ số hoàn thiện hồ sơ (85%), popover thông báo tuyển dụng và tin nhắn từ nhà tuyển dụng.

---

### 4.2 Khối Tìm kiếm Thông minh (Hero Smart Search Engine)

**Mô tả:** Khối tìm kiếm tại vị trí trung tâm Hero Section, tích hợp gợi ý lịch sử tìm kiếm từ `localStorage` và Mega-Menu ngành nghề 2 cột chuẩn TopCV.

#### FR-4: Nhập từ khóa & Gợi ý tìm kiếm gần đây
* **Mô tả:** Cho phép nhập vị trí, chức danh hoặc kỹ năng (Java, React, Marketing...).
* **Hành vi:**
  * Khi focus vào ô tìm kiếm: Mở dropdown hiển thị tối đa 5 lịch sử tìm kiếm gần nhất.
  * Hỗ trợ nút "Xóa tất cả" để xóa sạch lịch sử lưu trong `localStorage`.
  * Hỗ trợ nút xóa nhanh từ khóa (✕) khi ô nhập có dữ liệu.

#### FR-5: Bộ chọn địa điểm 2 cấp (Location Picker)
* **Mô tả:** Hỗ trợ chọn Tỉnh/Thành phố và Quận/Huyện theo 2 chế độ:
  * Đơn vị hành chính hiện tại (cũ).
  * Đơn vị hành chính mới cập nhật.
* **Hành vi:** Lưu giá trị địa điểm đã chọn vào select ẩn và hiển thị tóm tắt trên nút trigger.

#### FR-6: Mega-Menu Ngành nghề & Vị trí HOT
* **Mô tả:** Cung cấp 5 trang danh mục ngành nghề (mỗi trang 6 ngành lớn).
* **Hành vi:** Hover hoặc click vào ngành lớn bên trái sẽ render ngay danh sách các vị trí HOT và các nhóm chuyên môn bên phải. Click vào bất kỳ tag vị trí nào sẽ tự động điền và kích hoạt tìm kiếm.

#### FR-7: Chuyển hướng kết quả tìm kiếm (Search Submission)
* **Mô tả:** Khi người dùng nhấn nút "Tìm việc ngay" hoặc nhấn phím Enter trong ô tìm kiếm:
* **Điều kiện kiểm thử (Testable):**
  * Hệ thống mã hóa query param và chuyển hướng sang:
    `viec-lam.html?keyword=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
  * Nếu ô tìm kiếm trống, vẫn cho phép chuyển hướng sang `viec-lam.html` để xem toàn bộ danh sách việc làm.

---

### 4.3 Màn hình Danh sách & Kết quả Tìm việc (`viec-lam.html`)

**Mô tả:** Trang hiển thị kết quả tìm việc với đầy đủ bộ lọc nâng cao bên trái, thanh công cụ sắp xếp, lưới thẻ việc làm phong phú và modal xem chi tiết.

#### FR-8: Bộ lọc thời gian thực (Live Search & Filter Engine)
* **Mô tả:** Khi trang được tải hoặc khi người dùng thay đổi tiêu chí lọc, hệ thống tự động lọc danh sách thẻ việc làm ngay trên giao diện.
* **Hỗ trợ tìm kiếm thông minh:**
  * Chuẩn hóa tiếng Việt (hỗ trợ tìm kiếm không dấu như "ke toan" vẫn khớp với "Kế toán").
  * Tìm kiếm theo từ đơn hoặc cụm từ trên tiêu đề, tên công ty, danh sách kỹ năng và địa điểm.
  * Lọc theo địa điểm (Hà Nội, Hồ Chí Minh, Đà Nẵng, Remote...).
  * Lọc theo thẻ nhanh (Việc làm Remote, Lương > 25 triệu, Fresher, Tuyển gấp...).
  * Lọc theo cấp bậc (Thực tập sinh, Nhân viên, Trưởng nhóm / Leader).
  * Lọc theo hình thức (Toàn thời gian, Bán thời gian, Remote).

#### FR-9: Cập nhật chỉ số và Huy hiệu từ khóa đang lọc
* **Mô tả:**
  * Hiển thị chính xác số lượng việc làm tìm thấy: `Tìm thấy X việc làm đang tuyển dụng`.
  * Nếu có từ khóa tìm kiếm: Hiển thị badge `Từ khóa: "<keyword>" [✕]`. Người dùng bấm vào nút `[✕]` sẽ xóa bộ lọc từ khóa và hiển thị lại toàn bộ danh sách.

#### FR-10: Trạng thái không có kết quả (Empty State)
* **Mô tả:** Khi từ khóa tìm kiếm không khớp với bất kỳ công việc nào:
  * Ẩn danh sách công việc.
  * Hiển thị khối `#noResultsBox` với icon tìm kiếm, tiêu đề "Không tìm thấy việc làm phù hợp".
  * Cung cấp các thẻ gợi ý từ khóa phổ biến (ReactJS, Java Backend, Marketing, Sales B2B, Kế toán, UI/UX Designer).
  * Nút "Xem tất cả 12 việc làm" để reset nhanh bộ lọc.

#### FR-11: Lưu việc làm yêu thích (Bookmark Feature)
* **Mô tả:** Người dùng click vào icon bookmark trên từng card:
  * Trạng thái đổi màu (trái tim cam/đỏ).
  * Hiển thị Toast thông báo tương ứng ("Đã lưu vào danh sách yêu thích" hoặc "Đã bỏ lưu").

#### FR-12: Xem chi tiết việc làm & Ứng tuyển nhanh (Job Detail Modal)
* **Mô tả:** Click vào thẻ việc làm hoặc nút "Ứng tuyển":
  * Mở modal popover chứa đầy đủ tiêu đề công việc, công ty, mức lương, địa điểm, mô tả công việc (JD), yêu cầu ứng viên và quyền lợi.
  * Nút "Nộp hồ sơ ngay" kích hoạt toast thông báo ứng tuyển thành công.

---

### 4.4 Khối Nội dung Trang chủ (Homepage Modules)

#### FR-13: Tiêu điểm Nhà tuyển dụng (Spotlight Carousel)
* Hiển thị banner lớn của các doanh nghiệp đối tác tài trợ, luân chuyển slide tự động kèm các quyền lợi nổi bật và việc làm đang mở.

#### FR-14: Khối Việc làm Nổi bật & Việc làm Hấp dẫn
* Bố cục lưới thẻ việc làm chuẩn UX với nhãn "HOT", "Tuyển gấp", "AI Match", mức lương hiển thị nổi bật và icon verified cho nhà tuyển dụng uy tín.

#### FR-15: Showcase Mẫu CV chuyên nghiệp
* Hiển thị các mẫu CV chuẩn ATS (Emerald, Modern Creative, Executive Slate...) có thể chuyển slide và lọc theo phong cách (Đơn giản, Hiện đại, Ấn tượng).

---

## 5. Non-Goals (Explicit for v1)

* **Không tích hợp cổng thanh toán trực tiếp:** Ứng viên sử dụng toàn bộ tính năng tìm việc, nộp CV và lưu việc làm hoàn toàn miễn phí.
* **Không nhúng công cụ biên tập CV phức tạp (WYSIWYG editor nặng) trong trang chủ:** Trang chủ và trang tìm việc chỉ đóng vai trò showcase và điều hướng sang route tạo CV.
* **Không xây dựng video phỏng vấn trực tiếp nội tuyến (WebRTC):** Hệ thống chỉ quản lý lịch hẹn phỏng vấn.

---

## 6. MVP Scope (Phạm vi nghiệm thu v1)

### 6.1 In Scope (Bắt buộc hoàn thành v1)
* [x] Sticky Header điều hướng đa nền tảng, Logo và menu "Tìm việc" điều hướng chuẩn về `index.html`.
* [x] Hero Search Box với lịch sử tìm kiếm và Mega-Menu danh mục ngành nghề 2 cột.
* [x] Chuyển hướng tìm kiếm mượt mà từ trang chủ sang trang kết quả `viec-lam.html?keyword=...`.
* [x] Trang `viec-lam.html` với bộ lọc Live Filtering thông minh, xử lý tiếng Việt không dấu, đếm kết quả động và Empty State.
* [x] Dữ liệu mẫu 12 công việc thực tế thuộc đầy đủ các ngành nghề trọng điểm.
* [x] Modal xem nhanh chi tiết JD và ứng tuyển công việc.
* [x] Tính năng lưu việc làm (Bookmark) và Toast thông báo phản hồi.
* [x] Hỗ trợ giao diện responsive trên mọi thiết bị (Desktop, Tablet, Mobile).

### 6.2 Out of Scope (Dành cho v2 / v3)
* Hệ thống backend API kết nối cơ sở dữ liệu thực (PostgreSQL / MongoDB).
* Thuật toán AI matching dựa trên vector embeddings so khớp văn bản CV và JD thực tế.
* Hệ thống chat trực tiếp thời gian thực giữa ứng viên và nhà tuyển dụng (WebSocket).

---

## 7. Success Metrics & Counter-Metrics

### 7.1 Primary Success Metrics
* **Search Interaction Rate:** $\ge 50\%$ người dùng truy cập trang chủ thực hiện tương tác với ô tìm kiếm hoặc click vào các thẻ ngành nghề.
* **Search-to-Apply Conversion Rate:** $\ge 8.5\%$ người dùng xem danh sách kết quả tìm việc thực hiện hành động bấm "Ứng tuyển" hoặc "Lưu việc làm".
* **Navigation Clarity:** $0\%$ lỗi điều hướng liên quan đến việc click Logo hoặc Menu bị kẹt hoặc 404.

### 7.2 Counter-Metrics (Chỉ số cảnh báo)
* **Zero-Result Rate:** Tỷ lệ tìm kiếm không ra kết quả phải $< 5\%$ (nhờ bộ gợi ý từ khóa thông minh và cơ chế tìm kiếm mờ).
* **Search Drop-off Rate:** Tỷ lệ người dùng thoát ngay sau khi sang trang kết quả tìm kiếm phải $< 25\%$.

---

## 8. Non-Functional Requirements (NFR)

* **Performance:** Thời gian tải trang (LCP) $< 1.8$ giây; tốc độ phản hồi lọc tìm kiếm trực tiếp trên giao diện $< 50$ms.
* **Accessibility:** Đạt chuẩn WCAG 2.1 AA (độ tương phản màu sắc rõ ràng, hỗ trợ phím điều hướng Tab/Enter/Escape, aria-label đầy đủ).
* **Compatibility:** Hoạt động hoàn hảo trên các trình duyệt hiện đại (Chrome, Edge, Safari, Firefox) và tương thích hoàn toàn khi chạy local hoặc deploy static server (Vercel, GitHub Pages).

---

## 9. Indexed Assumptions & Open Items

* `[ASSUMPTION-1]`: Cố định trạng thái ứng viên đã đăng nhập (Nguyễn Văn A - Hồ sơ 85%) trên giao diện để tối ưu hóa trải nghiệm kiểm thử tính năng matching và lưu việc.
* `[ASSUMPTION-2]`: Sử dụng client-side live filtering trên tập dữ liệu mẫu 12 việc làm cho bản MVP hiện tại trước khi tích hợp REST API phân trang từ server.
* `[ASSUMPTION-3]`: Menu "Tìm việc" / "Tìm kiếm việc làm" đóng vai trò là điểm quay về trung tâm trang chủ khám phá, còn hành vi tìm việc cụ thể được kích hoạt bởi ô tìm kiếm Hero.

---
*Tài liệu PRD được tạo và quản lý bởi BMAD Framework — Sẵn sàng cho các bước tiếp theo: Sally (UX Design) & Winston (Architecture).*
