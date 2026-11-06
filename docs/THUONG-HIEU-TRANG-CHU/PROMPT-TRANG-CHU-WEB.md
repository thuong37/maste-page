# PROMPT TRIỂN KHAI: TRANG CHỦ ỨNG VIÊN EASYCV (BẢN WEB)

> **Dành cho:** Qwen (AI coding agent). Đọc hết tài liệu này trước khi sửa mã.
> **Phạm vi:** Trang chủ `index.html`, màn hình desktop ≥ 1100px. Mobile viết ở tài liệu riêng.
> **Nguồn:** (1) File Google Sheet logic của PO, tab "Trang chủ"; (2) prototype trong project (`index.html`, `css/home.css`, `js/home.js`, …); (3) `AGENTS.md`.
> **Ngày:** 16/10/2026

---

## 0. Quy tắc đọc tài liệu này

1. **Thứ tự ưu tiên khi mâu thuẫn:** Mục "Logic hiển thị" (lấy từ Sheet) > tài liệu này > prototype hiện có. Prototype chỉ cho biết giao diện đang như thế nào, **không** phải đặc tả nghiệp vụ.
2. Tài liệu chỉ nói **có khối nào, ở đâu, chứa gì, hiển thị theo logic nào**. Việc sắp xếp trên/dưới/trái/phải bên trong một khối thì **tự theo prototype và design token**; không tự đổi bố cục nếu không được yêu cầu.
3. **Đường link (quan trọng):** EasyCV chạy domain/route thật khác với prototype (`*.html`). Vì vậy:
   - **Cấm suy luận URL** từ link đang có. Ví dụ thấy `viec-lam.html` thì không được tự suy ra `chi-tiet-viec-lam.html` ⇒ `/viec-lam/chi-tiet`.
   - Mọi link phải lấy từ **Bảng route ở mục 3**. Trong HTML ghi bằng `data-route="<KEY>"` và `href` là giá trị cột "Href tạm (prototype)".
   - Link chưa có trong bảng ⇒ **dừng, ghi vào mục "Cần PO xác nhận" của báo cáo bàn giao**, dùng `href="#"` kèm `data-route="TODO"`. Không tự bịa.
4. **Số liệu, trọng số, thời gian (10s, 2s, 8 vị trí, 25 từ khóa…) phải đặt ở một nơi duy nhất** là object `HOME_CONFIG` ở đầu `js/home.js`. Không rải số rời rạc trong code.
5. Dữ liệu hiện tại là fixture (mock). Không báo "thành công" giả cho thao tác ghi (lưu việc, yêu thích) khi chưa có API.
6. Nếu gặp thứ **bạn thấy cần mà tài liệu chưa có** (tooltip, preview, trạng thái rỗng/lỗi/loading, link mới…), **không tự quyết**. Ghi vào "Cần PO xác nhận".
7. Theo `AGENTS.md`: chỉ sửa ở thư mục gốc, không sửa tay `public/`; header/drawer sửa ở `tools/partials/`; kết thúc bằng `npm run build`, rồi `npm run verify -- index 1440`.

---

## 1. Tổng quan trang

- **Định nghĩa:** Trang chủ giới thiệu các thông tin chính của nền tảng cho **ứng viên đang tìm việc**.
- **URL dự kiến của nhóm menu Việc làm:** `www.easycv.vn/viec-lam` (Sheet, mục Menu).
- **Quản lý nội dung:** Danh mục nhóm nghề/nghề, Banner thương hiệu, Khối quảng bá thương hiệu nhà phát triển và Footer **do CMS quản lý**. Front-end chỉ đọc dữ liệu từ CMS (hiện dùng fixture), không hard-code cố định trong HTML.
- **Trạng thái đăng nhập:** Một số khối có logic khác nhau giữa chưa đăng nhập và đã đăng nhập (mục 4.2, 4.3, 4.7). Prototype hiện chỉ có trạng thái đã đăng nhập. Xem câu hỏi Q1 ở mục 6.

---

## 2. Danh sách khối và vị trí trên màn hình

Thứ tự **từ trên xuống dưới, bắt buộc**:

| # | Tên khối | Vị trí | Selector trong prototype | Nguồn dữ liệu |
|---|---|---|---|---|
| B1 | Menu (header) | Trên cùng, dính khi cuộn | `header.site-header` | Partial `tools/partials/header.html` |
| B2 | Hero Search | Ngay dưới header, rộng hết container | `main.hero-mock-section` (thanh tìm kiếm) | Danh mục từ CMS |
| B3 | Gợi ý xu hướng | Ngay dưới thanh tìm kiếm | `.quick-tags` | Thống kê tìm kiếm |
| B4 | Banner thương hiệu | Dưới B3, 3 ô: 1 lớn bên trái + 2 nhỏ xếp dọc bên phải | `.bento-sponsor-grid` | CMS |
| B5 | Việc làm nổi bật | Dưới B4 | `#viec-lam-noi-bat` | Dữ liệu job |
| B6 | Công ty nổi bật | Dưới B5 | `#cong-ty-tieu-bieu` | Dữ liệu công ty |
| B7 | Banner EasyCV VIP Pro (in-feed) | Dưới B6 | `.infeed-vip-ad-section` | Tĩnh (xem Q3) |
| B8 | Việc làm phù hợp với bạn | Dưới B7 | `#viec-lam-phu-hop` | Dữ liệu người dùng |
| B9 | Khám phá CV | Dưới B8 | `#mau-cv-de-xuat` | Thống kê dùng mẫu CV |
| B10 | Ngành nghề & từ khóa phổ biến | Dưới B9 | `#tu-khoa-pho-bien` | Thống kê job/tìm kiếm |
| B11 | Khối quảng bá thương hiệu nhà phát triển | Dưới B10, ngay trên footer | `#he-sinh-thai` | CMS |
| B12 | Footer | Dưới cùng | `#chan-trang` | CMS |

**Không hiển thị trên trang (đừng khôi phục):** khối "Việc làm lương cao" (`#viec-lam-hap-dan`, đang ẩn), dải logo thương hiệu, khối thống kê, khóa học, sự kiện, tiêu đề hero nhìn thấy được (chỉ giữ `<h1 class="sr-only">`).

**Khối nổi, không thuộc luồng cuộn:** nút AI gợi ý nổi (floating). Prototype có, Sheet chưa nhắc. Xem Q4.

---

## 3. Bảng route (nguồn duy nhất cho mọi link)

Cột "URL thật" để trống = **PO chưa cung cấp**, không được tự điền.

| KEY | Dùng cho | Href tạm (prototype) | URL thật |
|---|---|---|---|
| `HOME` | Logo, về trang chủ | `index.html` | (chưa có) |
| `JOB_SEARCH` | Kết quả tìm kiếm, nút "Xem tất cả việc làm", menu "Tìm kiếm việc làm" | `viec-lam.html` | `/viec-lam` (Sheet) |
| `JOB_DETAIL` | Bấm tên/thẻ job | `chi-tiet-viec-lam.html` | (chưa có) |
| `COMPANY_DIRECTORY` | Menu "Khám phá công ty" | `kham-pha-cong-ty.html` | (chưa có) |
| `COMPANY_DETAIL` | Bấm công ty, bấm banner thương hiệu | `cong-ty.html` | (chưa có) |
| `CV_EDITOR` | Bấm mẫu CV | `/tao-cv/chinh-sua?templateId=<id>` | (chưa có, đang là đường dẫn giả định) |
| `CV_LIBRARY` | "Xem tất cả" mẫu CV | (chưa có trang) | (chưa có) |
| `VIP_UPGRADE` | CTA khối VIP | `#nang-cap-vip` | (chưa có) |
| `FOOTER_*`, `SOCIAL_*`, `APP_*` | Footer | do CMS cấp | (chưa có) |

### 3.1. Hợp đồng tham số tìm kiếm (áp dụng cho `JOB_SEARCH`)

```
<JOB_SEARCH>?keyword=<chuỗi>&location=<chuỗi>&category=<key>&industry=<nhãn>
```

- Chỉ thêm tham số **có giá trị**; dựng bằng `URLSearchParams`, giữ Unicode.
- Tìm rỗng vẫn đi `JOB_SEARCH` (không kèm tham số).
- Mọi nơi khởi phát tìm kiếm (nút Tìm kiếm, Enter, từ khóa gợi ý, tag xu hướng, từ khóa phổ biến, thẻ ngành nghề) **phải dùng chung một hàm** `buildSearchUrl(state)` và một object state `{keyword, location, categoryKey, industryLabel}`.
- Tên tham số là hợp đồng của prototype; PO cần xác nhận nó trùng với route thật (Q2).

---

## 4. Đặc tả từng khối

Mỗi khối gồm: **Thành phần nội dung** → **Logic hiển thị** (từ Sheet, giữ nguyên số) → **Đối tượng bắt buộc** (tooltip, preview…) → **Việc cần PO xác nhận**.

### B1. Menu (header)

- **Thành phần:** logo EasyCV; 4 nhóm menu (Việc làm, Hồ sơ & CV, Ứng tuyển, Công cụ) mỗi nhóm có dropdown; chuông thông báo; tin nhắn; menu tài khoản; lối sang Nhà tuyển dụng.
- **Logic:** Nhóm "Việc làm" → mục "Tìm kiếm việc làm" dẫn tới `JOB_SEARCH` (`/viec-lam`). Nội dung chi tiết từng dropdown **lấy từ partial**, không viết lại.
- **Bắt buộc:** popover thông báo và tin nhắn; dropdown mở khi hover/focus; hiện badge số chưa đọc.
- **Xác nhận:** Q1 (trạng thái chưa đăng nhập của header).

### B2. Hero Search

**Thành phần (theo thứ tự trái → phải):** nút Danh mục nghề → ô nhập từ khóa → bộ chọn địa điểm → nút "Tìm kiếm".

**Logic hiển thị:**

1. **Bộ lọc danh mục nghề** (modal mở từ nút Danh mục nghề)
   - Danh mục nhóm nghề/nghề **lấy từ CMS**.
   - Nhóm nghề có **số lượng job nhiều nhất xếp lên đầu**.
   - Trong mỗi nhóm nghề, hiển thị **tối đa 8 vị trí chuyên môn có lượt tìm kiếm nhiều nhất**.
2. **Box search** (popup gợi ý dưới ô nhập, mở khi focus/click)
   - Gồm hai nhóm: **từ khóa** và **"Việc làm có thể bạn quan tâm"** (5 thẻ job).
   - *Từ khóa khi chưa nhập gì:* "Từ khóa tìm kiếm gần đây", lưu **tối đa 7** từ khóa gần nhất.
   - *Từ khóa khi đã nhập ≥ 2 ký tự:* nhóm "gần đây" **bị thay bằng** nhóm "Từ khóa gợi ý".
   - *Thẻ job khi chưa nhập:* 5 job, sắp theo **điểm tổng** (công thức ở mục 5.1). Điểm cao đứng trước.
   - *Thẻ job khi đang nhập:* 5 job; hệ thống lấy chữ người dùng gõ, **đối chiếu với dữ liệu ngành nghề có sẵn** để sinh ra từ khóa, rồi dùng từ khóa đó lọc job.
3. **Bộ lọc địa điểm:** cho chọn theo hai kiểu địa giới: **Tỉnh/TP + Quận/Huyện (trước 01/07/2025)** và **Tỉnh/TP + Phường/Xã (sau 01/07/2025)**.
4. **Nút Tìm kiếm:** đi tới `JOB_SEARCH` theo mục 3.1. (Sheet chưa mô tả thêm.)

**Đối tượng bắt buộc:** modal Danh mục nghề (có nút Bỏ chọn tất cả / Hủy / Chọn); popup gợi ý (đóng bằng Esc, click ngoài); location picker hai cấp có ô tìm; nút xóa từng từ khóa gần đây và xóa tất cả.

**Sticky:** thanh tìm kiếm dính ngay dưới header khi cuộn (theo prototype).

### B3. Gợi ý xu hướng

- **Thành phần:** nhãn "Xu hướng:" + **5** từ khóa dạng link.
- **Logic:** 5 từ có **lượt tìm kiếm nhiều nhất trong 60 ngày gần nhất**; **tự cập nhật lúc 0h hằng ngày**.
- Bấm một từ ⇒ tìm kiếm theo mục 3.1 với `keyword` = từ đó.

### B4. Banner thương hiệu

- **Thành phần:** 3 ô. **Banner 1 (lớn, bên trái):** nhiều slide. **Banner 2, 3 (nhỏ, bên phải):** cố định.
- **Logic (Sheet):**
  - Banner 1 **tự chuyển sau 10 giây**, animation chuyển **300ms**.
  - **Hover vào banner 1 ⇒ dừng tự chuyển**; rời chuột ⇒ chạy tiếp.
  - **Click banner 1 ⇒ đến trang chủ công ty** (`COMPANY_DETAIL`).
  - Hai banner nhỏ **nằm cứng**; thời gian đổi theo chính sách sau này (hiện không tự đổi).
- **Nội dung do CMS quản lý.**
- **Bắt buộc:** nút trước/sau và chấm trang của banner 1 không được kích hoạt link nền. Có nhãn "Tài trợ" nhận diện quảng cáo. Xem Q5.
- **Lưu ý:** prototype đang đặt 5 giây ⇒ **sửa thành 10 giây** theo Sheet.

### B5. Việc làm nổi bật

- **Thành phần:** tiêu đề, link "Xem tất cả việc làm" (`JOB_SEARCH`), hàng tab ngành nghề, lưới thẻ job, điều khiển chuyển trang.
- **Thẻ job gồm:** logo công ty (kèm **huy hiệu** nếu đạt), tên job, công ty, lương, địa điểm, nút lưu việc.
- **Logic (Sheet):**
  - **Tab lọc theo ngành nghề**, sắp theo **ngành có nhiều việc làm nhất đứng trước**.
  - Lưới **tối đa 3 cột × 4 hàng** (12 thẻ/trang).
  - **Tự chuyển trang mỗi 10 giây.**
  - **Hover vào tên job ⇒ popup xem trước (preview)**.
  - Chọn thẻ để hiển thị:
    - *Chưa đăng nhập:* danh sách trang job; **ngành có nhiều job hơn hiện trước**; **mỗi trang, mỗi ngành lấy 2 thẻ job**.
    - *Đã đăng nhập:* sắp theo điểm tổng (mục 5.1), từ đó đưa ra job thuộc nhóm ngành/nghề và **các nghề liên quan**.
- **Huy hiệu ("Tia sét")**: gắn lên logo công ty của job mà HR tương tác nhiều. Điều kiện, công thức, ví dụ ở **mục 5.2**.
- **Bắt buộc:**
  - Popup **Job Preview** (prototype đã có `.job-preview-popover`, tái sử dụng; không viết mới).
  - **Tooltip** cho huy hiệu Tia sét (giải thích). Chờ Q6 về nội dung.
  - Nút lưu việc có tooltip "Lưu việc làm".
  - Tạm dừng tự chuyển trang khi hover/focus bên trong khối.

### B6. Công ty nổi bật

- **Thành phần:** tiêu đề, carousel thẻ công ty (logo, tên, số job đang tuyển, nút yêu thích).
- **Logic (Sheet):**
  - Chỉ gồm **công ty đã đăng ký xác thực** trên nền tảng.
  - Thứ tự hiển thị: **độ phổ biến công ty (trọng số 0.5)** + **công ty trả phí (trọng số 0.5)**. Công thức độ phổ biến ở mục 5.3.
  - Hiển thị **5 thẻ**; **cứ 2 giây trượt 1 thẻ, từ phải qua trái**.
- **Bắt buộc:** tạm dừng khi hover/focus; tôn trọng `prefers-reduced-motion`; nút yêu thích có tooltip.

### B7. Banner EasyCV VIP Pro

- Khối quảng bá in-feed có tiêu đề, mô tả, 3 quyền lợi và CTA tới `VIP_UPGRADE`.
- **Sheet không nhắc khối này.** Giữ nguyên như prototype, chờ Q3 (giữ hay bỏ, ai quản lý nội dung). Không chỉnh sửa.

### B8. Việc làm phù hợp với bạn

- **Thành phần:** tiêu đề, banner mức hoàn thiện hồ sơ + CTA hoàn thiện hồ sơ, lưới thẻ job (dùng lại thẻ job của B5).
- **Logic (Sheet):** hiển thị theo dữ liệu người dùng, trọng số: **hồ sơ & CV 0.6, tìm kiếm job 0.15, xem job 0.15, lưu job 0.1** (tổng 1.0).
- **Không có tab lọc** (đã gỡ).
- **Bắt buộc:** popup preview khi hover tên job (giống B5).
- **Xác nhận:** Q1 (người dùng chưa đăng nhập thì khối này hiện gì).

### B9. Khám phá CV

- **Thành phần:** tiêu đề, bộ lọc phong cách (Tất cả, Đơn giản, Chuyên nghiệp, Hiện đại, Ấn tượng, ATS), carousel thẻ mẫu CV (ảnh mẫu, tên, nhãn như ATS/Mới).
- **Logic (Sheet):** hiển thị **mẫu CV được nhiều người dùng nhất**; **cập nhật 0h hằng ngày**.
- Bấm mẫu ⇒ `CV_EDITOR` với `templateId` của đúng mẫu đó. Nhân bản thẻ để lấp carousel không được làm sai `templateId`.
- Tốc độ tự chạy: Sheet chưa quy định, giữ theo prototype (2s/thẻ), xem Q7.

### B10. Ngành nghề & từ khóa phổ biến

- **Thành phần:** tiêu đề; **Phần A:** thẻ ngành nghề (có nút trước/sau); **Phần B:** danh sách từ khóa.
- **Logic (Sheet):** cả khối **cập nhật 0h hằng ngày**.
  - Ngành nghề: **sắp theo số lượng job từ nhiều đến ít**.
  - Từ khóa: **sắp theo lượt tra cứu từ nhiều đến ít, tối đa 25 từ**.
- Bấm ngành nghề/từ khóa ⇒ tìm kiếm theo mục 3.1 (ngành nghề đi qua `category`/`industry`, từ khóa đi qua `keyword`).
- **Bắt buộc:** thẻ ngành nghề hiển thị số job, có tooltip khi tên bị cắt.

### B11. Khối quảng bá thương hiệu nhà phát triển

- Khối giới thiệu hệ sinh thái/nhà phát triển (prototype: "Make IT Simple – một hệ sinh thái…", số liệu Softdreams).
- **Logic (Sheet):** do **CMS quản lý**; "nội dung được cấu hình và hiển thị riêng biệt" ⇒ **không hard-code nội dung** trong `index.html`, đọc từ một nguồn cấu hình riêng (hiện dùng fixture).
- Số liệu (14+ năm, 1.000+ nhân sự…) là **fixture chưa xác minh**, đánh dấu để PO duyệt.

### B12. Footer

- **Thành phần:** thương hiệu + mô tả; 3 cột link (Về EasyCV, Dành cho ứng viên, Liên hệ & trụ sở); nút App Store/Google Play; mạng xã hội; bản quyền.
- **Logic:** do **CMS quản lý**. Mọi link lấy từ CMS/Bảng route; link chưa có ⇒ `data-route="TODO"`. Icon mạng xã hội chỉ có icon thì phải có `aria-label`.

---

## 5. Công thức dùng chung

### 5.1. Điểm tổng của job (dùng ở popup gợi ý của B2 và B5 khi đã đăng nhập)

Tổng trọng số = 1.0.

| Thành phần | Trọng số |
|---|---:|
| Gói trả phí | 0.45 |
| Dữ liệu hồ sơ và CV ứng viên | 0.10 |
| Hành vi: dữ liệu tìm kiếm job | 0.05 |
| Hành vi: dữ liệu xem job | 0.05 |
| Hành vi: dữ liệu lưu job | 0.05 |
| Tín hiệu job: mới đăng | 0.05 |
| Độ nhận diện thương hiệu | 0.15 |
| Độ tương tác | 0.10 |

> **Chú ý:** Sheet ghi "dữ liệu người dùng và gói trả phí (trọng số 0.45)". Tổng các dòng còn lại bằng 0.55, nên bảng trên hiểu **0.45 là gói trả phí**. Cần PO xác nhận (Q8). Điểm cao hơn ⇒ xếp trước.

### 5.2. Huy hiệu "Tia sét" của job

Một tin được gắn huy hiệu khi **đồng thời** thỏa:
1. Tin đang hiển thị.
2. Có **tối thiểu 2 CV** ứng tuyển.
3. **Tỷ lệ tương tác ≥ 80%** tại thời điểm hệ thống xét.

- Hệ thống xét **2 lần/ngày** (khoảng 0h và 12h). Đạt ở lần xét ⇒ huy hiệu hiển thị trong khung giờ tiếp theo.
- Công thức: `Tỷ lệ tương tác = (số CV ứng tuyển trong 30 ngày gần nhất đã được NTD đánh giá trong vòng 14 ngày kể từ lúc CV ứng tuyển) / (tổng số CV ứng tuyển trong 30 ngày gần nhất) × 100%`.
- Ví dụ: 10 CV, HR xử lý 8 trong ≤14 ngày ⇒ 8/10 = 80% ⇒ đạt. Sau đó thêm 6 CV chưa xử lý ⇒ 8/16 = 50% ⇒ mất huy hiệu ở lần xét tiếp theo.
- **Front-end không tự tính.** Dữ liệu job có cờ `hasLightningBadge: boolean`; front-end chỉ hiển thị theo cờ.

### 5.3. Độ phổ biến công ty (B6)

`Brand Popularity Score = 35% Search Awareness + 20% Digital Reach + 15% Social Presence + 30% Candidate Interest`

| Thành phần | Cách đo | Tỷ trọng |
|---|---|---:|
| Search Awareness | Mức tìm kiếm tên thương hiệu trên Google Trends tại VN | 35% |
| Digital Reach | Traffic và ranking website | 20% |
| Social Presence | Followers LinkedIn/Facebook/TikTok/YouTube | 15% |
| Candidate Interest | Search, view, follow, lưu job, ứng tuyển trên EasyCV | 30% |

Điểm hiển thị của công ty = 0.5 × độ phổ biến + 0.5 × điểm công ty trả phí. Front-end nhận **danh sách đã xếp sẵn**, không tự tính các điểm này.

---

## 6. Cần PO xác nhận (Qwen cũng cần ghi thêm mục phát sinh vào đây khi bàn giao)

| ID | Câu hỏi | Vì sao cần |
|---|---|---|
| Q1 | Trang chủ có bản **chưa đăng nhập** không? Header và B8 ở bản đó hiện gì? | Sheet có logic cho cả hai trạng thái ở B5; prototype chỉ có bản đã đăng nhập. |
| Q2 | URL thật của các route trong Bảng route mục 3 (chi tiết job, công ty, CV, VIP, footer) và tên tham số tìm kiếm trên URL thật. | Không được suy ra URL từ prototype. |
| Q3 | B7 (VIP Pro) giữ hay bỏ? Nội dung ai quản lý? | Sheet không nhắc. |
| Q4 | Nút AI gợi ý nổi có giữ không? | Sheet không nhắc. |
| Q5 | Nhãn "Tài trợ" trên banner: có bắt buộc không, hiển thị ở đâu? | Minh bạch quảng cáo. |
| Q6 | Nội dung tooltip huy hiệu Tia sét (chữ giải thích gì cho ứng viên)? | Chưa có copy. |
| Q7 | Tốc độ/hành vi tự chạy của B9 và carousel ngành nghề ở B10? | Sheet chỉ nêu 10s (B4, B5) và 2s (B6). |
| Q8 | Xác nhận 0.45 là trọng số gói trả phí (mục 5.1). | Cách đọc Sheet đang mơ hồ. |
| Q9 | B5: "Tất cả" có tab riêng không? Với tab một ngành, hiện cả 12 thẻ của ngành đó? Quy tắc "mỗi ngành 2 thẻ/trang" chỉ áp dụng cho chế độ trộn nhiều ngành? | Sheet chưa nói rõ quan hệ giữa tab và trang. |
| Q10 | Trạng thái rỗng, đang tải, lỗi cho từng khối (danh mục rỗng, không có gợi ý, API lỗi…): dùng chung mẫu hay có thiết kế riêng? | Chưa có trong Sheet. |

---

## 7. Hướng dẫn thực thi cho Qwen

```
BƯỚC 1  Đọc AGENTS.md, tài liệu này, docs/THUONG-HIEU-TRANG-CHU/PHAN-TICH-TRANG-CHU-EASYCV.md (chỉ để biết hiện trạng).
BƯỚC 2  Lập bảng: khối (B1-B12) -> selector -> file CSS/JS -> thay đổi cần làm so với prototype.
BƯỚC 3  Đối chiếu từng khối với mục 4. Chỉ sửa chỗ khác nhau. Khác biệt đã biết:
          - B4: autoplay 5s -> 10s, animation 300ms, click -> COMPANY_DETAIL.
          - B3: đúng 5 từ, nguồn là thống kê 60 ngày, cập nhật 0h.
          - B2: lịch sử từ khóa tối đa 7 (prototype đang là 6); danh mục: tối đa 8 vị trí chuyên môn/nhóm.
          - B5: tab sắp theo số job; 10s/trang; 3x4 thẻ; popup preview; huy hiệu theo cờ.
          - B6: 5 thẻ, 2s/thẻ, phải -> trái.
          - B10: tối đa 25 từ khóa, sắp theo lượt tra cứu.
          - B11, B12: đọc từ cấu hình CMS, không hard-code.
BƯỚC 4  Gom số/thời gian vào HOME_CONFIG; gom link vào bảng route; một hàm buildSearchUrl.
BƯỚC 5  Kiểm tra: node --check js/home.js; npm run build; npm run verify -- index 1440.
BƯỚC 6  Bàn giao: file đã đổi; điểm khác Sheet (nếu có); danh sách "Cần PO xác nhận" đã cập nhật.

CẤM
- Suy URL từ link hiện có. Tự chế route.
- Khôi phục khối đã gỡ (mục 2).
- Tự tính điểm xếp hạng/huy hiệu ở client. Báo thành công giả khi chưa có API.
- Sửa tay public/ hoặc nội dung giữa marker @include.
- Tự thêm tooltip/preview/popup ngoài danh sách mục 4 mà không hỏi.
```

---

## 8. Nghiệm thu

- [ ] Đúng thứ tự B1 → B12; không có khối trong danh sách "không hiển thị".
- [ ] Các con số trong Sheet (7, 8, 5, 25, 60 ngày, 10s, 300ms, 2s, 3×4, 0h/12h) đúng, nằm ở `HOME_CONFIG`.
- [ ] Mọi link có `data-route` khớp Bảng route; không có URL tự suy.
- [ ] Mọi nơi tìm kiếm cùng đi qua `buildSearchUrl` và cho ra URL đúng, giữ Unicode.
- [ ] Popup preview job hiện khi hover tên job ở B5 và B8; có tooltip huy hiệu Tia sét.
- [ ] Banner hover dừng; carousel công ty dừng khi hover/focus; reduced motion dừng tự chạy.
- [ ] Không có lỗi console, không 404 ảnh; `npm run check` sạch.
