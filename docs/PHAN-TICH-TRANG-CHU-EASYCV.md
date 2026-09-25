# PHÂN TÍCH VÀ ĐẶC TẢ TRANG CHỦ ỨNG VIÊN EASYCV

> **Loại tài liệu:** Business Analysis + UI/UX Specification + AI Implementation Contract  
> **Phiên bản:** 1.0  
> **Ngày lập:** 25/09/2026  
> **Phạm vi:** Chỉ trang chủ dành cho ứng viên của sàn tuyển dụng EasyCV  
> **Đối tượng đọc:** Ban lãnh đạo, Product Owner, Business Analyst, UI/UX Designer, Frontend Engineer và AI coding agent (ưu tiên Qwen 3.8 27B)

---

## 1. Tóm tắt đề xuất

Trang chủ EasyCV được định hướng là một **trung tâm khám phá việc làm dành cho ứng viên**, không chỉ là landing page giới thiệu thương hiệu. Trong một màn hình cuộn dọc, người dùng có thể:

1. Tìm việc theo từ khóa, ngành nghề và địa điểm.
2. Khám phá việc làm nổi bật, việc lương cao và doanh nghiệp uy tín.
3. Nhận gợi ý việc làm phù hợp dựa trên hồ sơ/CV.
4. Tiếp cận khóa học, sự kiện nghề nghiệp và nội dung hỗ trợ phát triển sự nghiệp.
5. Thực hiện nhanh các hành động cá nhân như lưu việc, theo dõi công ty, xem thông báo và tin nhắn.

Phong cách chung là **hiện đại, tin cậy, sáng, dễ quét thông tin**, kết hợp:

- Cam EasyCV cho hành động chính và điểm nhấn thương hiệu.
- Xanh đen cho nội dung cần độ tin cậy cao và các vùng nền tối.
- Xanh lá cho trạng thái tích cực, lưu việc và mức độ phù hợp.
- Card trắng, viền mảnh, bo góc vừa phải, khoảng trắng rõ ràng.
- Bố cục desktop rộng nhưng có giới hạn, chuyển tuần tự xuống một cột trên mobile.

Kết quả mong muốn là trang chủ giúp người dùng đi từ **nhu cầu → tìm kiếm → đánh giá → hành động** với số bước tối thiểu, đồng thời tạo đủ vị trí thương mại cho doanh nghiệp tài trợ nhưng không làm mất trọng tâm tìm việc.

---

## 2. Quy ước để con người và AI cùng đọc

Các từ khóa sau mang tính bắt buộc:

- **PHẢI:** yêu cầu bắt buộc để được nghiệm thu.
- **NÊN:** ưu tiên thực hiện; chỉ được bỏ khi có lý do kỹ thuật hoặc nghiệp vụ rõ ràng.
- **CÓ THỂ:** tùy chọn, không ảnh hưởng luồng cốt lõi.
- **Dữ liệu mẫu:** nội dung dùng để minh họa giao diện, không phải dữ liệu đã xác thực.
- **Route đích:** đường dẫn logic cần nối với router của hệ thống thật; không mặc định dùng anchor `#`.
- **Trạng thái từ xa:** `loading | ready | empty | error` đối với dữ liệu lấy từ API.

Tài liệu này là đặc tả độc lập. AI không được yêu cầu người đọc mở thêm HTML hoặc nhiều tài liệu khác để hiểu bố cục và hành vi trang chủ.

---

## 3. Mục tiêu, người dùng và phạm vi

### 3.1. Mục tiêu nghiệp vụ

- Tăng tỷ lệ người dùng bắt đầu tìm kiếm việc làm ngay tại trang chủ.
- Tăng lượt xem chi tiết việc làm và tỷ lệ lưu việc.
- Tăng mức hoàn thiện hồ sơ/CV để cải thiện chất lượng matching.
- Tăng mức khám phá doanh nghiệp, khóa học và sự kiện.
- Tạo vị trí hiển thị tài trợ minh bạch cho nhà tuyển dụng/đối tác.
- Tạo cảm nhận EasyCV là nền tảng tuyển dụng có dữ liệu, có cá nhân hóa và đáng tin cậy.

### 3.2. Người dùng chính

| Nhóm | Nhu cầu chính | Hành động ưu tiên trên trang |
|---|---|---|
| Khách chưa đăng nhập | Tìm và xem việc nhanh | Tìm kiếm, lọc, xem chi tiết, đăng nhập/đăng ký |
| Ứng viên đã đăng nhập | Quản lý hành trình tìm việc | Lưu việc, xem gợi ý phù hợp, thông báo, tin nhắn, hồ sơ |
| Ứng viên mới/ít kinh nghiệm | Khám phá định hướng | Ngành phổ biến, khóa học, sự kiện, việc Fresher/Intern |
| Ứng viên có kinh nghiệm | Tìm cơ hội chất lượng/lương cao | Việc nổi bật, việc lương cao, công ty tiêu biểu, AI Match |

### 3.3. Trong phạm vi

- Toàn bộ giao diện trang chủ ứng viên từ header đến footer.
- Hai trạng thái tài khoản: khách và đã đăng nhập.
- Tìm kiếm, gợi ý, chọn địa điểm, lọc nhanh.
- Các danh sách việc làm, công ty, khóa học, sự kiện và banner.
- Bookmark, theo dõi, đăng ký nhận tin ở cấp giao diện.
- Responsive, accessibility, loading/empty/error và dark mode nếu hệ thống đích hỗ trợ.

### 3.4. Ngoài phạm vi

- Backend, thuật toán AI matching thật và mô hình chấm điểm CV.
- Trang chi tiết việc làm/công ty/khóa học/sự kiện.
- CV Builder, đăng nhập, thanh toán VIP và chat hoàn chỉnh.
- CMS quản lý banner.

Các trang/khả năng ngoài phạm vi chỉ được xem là **đích điều hướng hoặc dependency**, không được AI tự ý xây mở rộng khi chưa có yêu cầu.

---

## 4. Phong cách thiết kế tổng quan

### 4.1. Tính cách thị giác

Ba từ khóa bắt buộc: **tin cậy – năng động – dễ sử dụng**.

- Không dùng phong cách quá trang trí, quá nhiều gradient hoặc hiệu ứng kính làm giảm khả năng đọc.
- Nội dung tuyển dụng phải được ưu tiên hơn quảng cáo.
- Mỗi section chỉ có một mục tiêu chính và một CTA “xem tất cả” ở cấp section.
- Card dùng độ cao tương đối đồng đều trong cùng một lưới để người dùng quét theo hàng.
- Không dùng emoji làm icon chức năng. Icon phải là SVG cùng một họ nét, độ dày nét khoảng 1.5–2px.

### 4.2. Màu sắc

| Token | Giá trị | Cách dùng |
|---|---:|---|
| `primary` | `#F97316` | CTA chính, trạng thái active, tiêu đề/chi tiết cần nhấn |
| `primary-hover` | `#EA580C` | Hover/pressed của CTA chính |
| `primary-soft` | `#FFF7ED` | Nền badge/pill cam nhạt |
| `primary-border-soft` | `#FED7AA` | Viền thành phần cam nhạt |
| `secondary` | `#0F172A` | Chữ chính, banner tối, footer |
| `surface` | `#FFFFFF` | Card, input, popover |
| `page-background` | `#F8FAFC` | Nền section xen kẽ |
| `border` | `#E2E8F0` | Viền card, divider, input |
| `text-secondary` | `#64748B` | Mô tả, metadata |
| `text-muted` | `#94A3B8` | Gợi ý, thời gian, thông tin phụ |
| `success/match` | `#16A34A` | Matching, trạng thái tích cực |
| `save-accent` | `#00B14F` | Bookmark và điểm nhấn card việc làm theo bản mẫu |
| `info` | `#0284C7` | Xác thực, thông tin công nghệ |
| `danger` | `#DC2626` | Lỗi, hết hạn, thao tác xóa |

Quy tắc tương phản:

- Chữ thường PHẢI đạt tối thiểu 4.5:1 so với nền.
- Chữ lớn và thành phần UI PHẢI đạt tối thiểu 3:1.
- Không dùng màu là dấu hiệu duy nhất; active/error/success phải kèm icon, chữ hoặc thay đổi viền.
- Xanh lá `#00B14F` trong card việc làm và bộ chọn địa điểm là chủ ý của mẫu hiện tại; không tự đổi tất cả thành cam.

### 4.3. Font chữ và cấp bậc

Font chính: **Plus Jakarta Sans**. Fallback: `Inter`, `Be Vietnam Pro`, `system-ui`, `sans-serif`.

| Vai trò | Desktop | Mobile | Weight | Line-height | Quy tắc |
|---|---:|---:|---:|---:|---|
| H1 Hero | 32px | 26px | 800 | 1.3 | Căn giữa; tối đa 1 dòng ở desktop, cho phép xuống dòng ở mobile |
| H2 section | 26px | 22px | 800 | 1.3 | Căn trái |
| H3/card nổi bật | 18px | 16–18px | 700–800 | 1.35 | Tối đa 2 dòng |
| Tiêu đề job card | 14.5px | 14px | 700 | 1.35 | Tối đa 2 dòng, cắt bằng ellipsis |
| Body chính | 14–15px | 14px | 400–500 | 1.5–1.6 | Không dùng chữ dưới 14px cho nội dung dài |
| Metadata | 11.5–13px | 11.5–13px | 500–600 | 1.3–1.5 | Dùng cho công ty, địa điểm, thời gian |
| Button | 13–15px | 13–15px | 700 | 1.2 | Nhãn động từ rõ ràng |
| Badge | 10.5–12.5px | 10.5–12.5px | 700 | 1.2 | Nội dung ngắn, không quá 2–3 từ |

Quy tắc căn chữ:

- H1 và mô tả hero căn giữa.
- Tiêu đề section, card, footer căn trái.
- Con số thống kê có thể căn giữa trong ô nhưng nhãn vẫn phải dễ đọc.
- Không căn đều hai bên (`text-align: justify`).
- Nội dung card tối đa 2 dòng; metadata một dòng và có ellipsis nếu thiếu chỗ.

### 4.4. Kích thước, lề và nhịp dọc

- Content container: tối đa **1250px**, căn giữa.
- Navbar container: tối đa **1360px**, căn giữa.
- Gutter desktop: **20–24px**; mobile: **16px**.
- Navbar cao **72px**.
- Section tiêu chuẩn: padding dọc **40px**; có divider 1px giữa các section cần phân tách.
- Khoảng cách section header đến nội dung: **20–24px**.
- Khoảng cách lưới card: **16px**; riêng công ty có thể dùng **24px**.
- Hệ spacing ưu tiên: `4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 60px`.
- Không phát sinh khoảng cách lẻ nếu không có lý do căn chỉnh cụ thể.

### 4.5. Bo góc, viền, bóng và chuyển động

| Thành phần | Bo góc | Viền/bóng |
|---|---:|---|
| Button thường | 8–12px | Không bóng hoặc bóng nhẹ |
| Pill/badge | 9999px | Viền 1px cùng tông |
| Card thường | 12–16px | Viền 1px `#E2E8F0` |
| Popover/dropdown | 14–18px | Bóng nổi rõ `0 20px 25px -5px rgba(15,23,42,.10)` |
| Banner lớn | 16px | Viền 1–1.5px, bóng vừa |
| Logo box | 8–12px | Nền trắng, object-fit contain |

Chuyển động:

- Hover/focus nhanh: **160–200ms**.
- Dropdown/carousel chuyển cảnh: **220–300ms**.
- Card hover chỉ nâng `translateY(-2px đến -3px)` và tăng viền/bóng; không làm thay đổi kích thước layout.
- Khi `prefers-reduced-motion: reduce`, dừng auto-play và loại bỏ chuyển động không thiết yếu.

---

## 5. Kiến trúc thông tin của trang

```text
CandidateHomePage
├── H01. DemoBar (chỉ môi trường demo)
├── H02. SiteHeader
│   ├── BrandLogo
│   ├── PrimaryNavigation + Dropdowns
│   ├── EmployerCTA
│   ├── NotificationPopover
│   ├── MessagePopover
│   ├── AccountMenu / GuestActions
│   └── MobileDrawer
├── H03. HeroSearch
│   ├── Heading + Description
│   ├── KeywordInput + ClearButton
│   ├── LocationPicker
│   ├── SearchButton
│   ├── SuggestionPanel
│   └── TrendingTags
├── H04. EmployerSpotlight + PartnerStrip
├── H05. FeaturedJobs
├── H06. HighSalaryJobs
├── H07. FeaturedCompanies
├── H08. VipPromotion
├── H09. MatchedJobs
├── H10. PromotionBanners
├── H11. Courses
├── H12. Events
├── H13. PopularCategoriesAndKeywords
├── H14. SiteFooter
└── H15. FloatingAiWidget
```

Thứ tự trên là bắt buộc trên desktop và mobile. Không đổi thứ tự chỉ để lấp khoảng trống giao diện.

---

## 6. Đặc tả chi tiết từng khối

### H01. Thanh điều khiển demo

**Mục đích:** Cho phép trình diễn nhanh trạng thái đã đăng nhập/chưa đăng nhập và sáng/tối. Đây không phải thành phần production.

**Bố cục và thiết kế:**

- Thanh ngang nền `#0F172A`, chữ trắng/xám sáng, padding `8px 24px`, font 13px.
- Bên trái: badge “EASYCV DEMO” nền cam và mô tả môi trường.
- Bên phải: segmented control “Đã đăng nhập / Chưa đăng nhập” và nút icon đổi theme 28×28px.

**Tương tác:**

- Chuyển trạng thái tài khoản làm thay đổi header, popover và menu mobile.
- Theme switch đặt `data-theme="dark"` trên phần tử gốc.

**Ràng buộc:**

- Production PHẢI bỏ thanh này hoặc chỉ bật bằng feature flag nội bộ.
- Trạng thái production phải lấy từ auth/theme store thật.

### H02. Header và điều hướng chính

**Mục đích:** Nhận diện thương hiệu, dẫn người dùng tới các nghiệp vụ chính và cung cấp các hành động theo tài khoản.

**Bố cục desktop:**

- Header sticky ở `top: 0`, cao 72px, nền trắng 95% + blur 12px, viền đáy 1px.
- Container tối đa 1360px, padding ngang 24px.
- Thứ tự trái → phải: logo; 4 menu nghiệp vụ; khoảng giãn; CTA nhà tuyển dụng; thông báo; tin nhắn; tài khoản.
- Logo hiển thị ngang, cao khoảng 54px, giữ nguyên tỷ lệ.

**Menu chính:**

| Menu | Mục con bắt buộc | Route logic |
|---|---|---|
| Tìm việc | Tìm kiếm việc làm; Việc làm gợi ý; Việc làm đã lưu; Khám phá công ty | `/viec-lam`, `/viec-lam/goi-y`, `/viec-lam/da-luu`, `/cong-ty` |
| Hồ sơ & CV | Hồ sơ của tôi; Tạo CV theo mẫu; Quản lý CV; Tải lên CV | `/ho-so`, `/cv/tao-moi`, `/cv`, `/cv/tai-len` |
| Ứng tuyển | Danh sách đơn; Lịch phỏng vấn; Bài kiểm tra năng lực | `/ung-tuyen`, `/phong-van`, `/danh-gia-nang-luc` |
| Công cụ nghề nghiệp | Gross–Net; Bảo hiểm xã hội; Báo cáo lương; MBTI/DISC | `/cong-cu/...` theo router thực tế |

**Dropdown:**

- Rộng tối thiểu 250px, nền surface, bo 14px, padding 8px, bóng nổi.
- Mỗi item cao tối thiểu 40–44px, icon trái 18px, nhãn phải; badge “AI Match”, “Hot” hoặc số đếm đặt cuối dòng.
- Hover: nền cam nhạt, chữ/icon cam; chevron của menu quay 180°.
- Mở bằng hover trên desktop và click/Enter/Space; `Esc` đóng và trả focus về trigger.

**Khối hành động phải:**

- CTA “Dành cho Nhà tuyển dụng” điều hướng sang cổng nhà tuyển dụng.
- Nút thông báo và tin nhắn là icon 40×40px; badge số chưa đọc neo góc trên phải.
- Popover rộng khoảng 360px, gồm header, “Đánh dấu đã đọc”, danh sách item và link xem tất cả.
- Menu tài khoản hiển thị avatar, tên, mức hoàn thiện hồ sơ; dropdown chia nhóm hồ sơ, công việc và cài đặt/đăng xuất.
- Trạng thái khách chỉ hiển thị “Đăng nhập” và “Đăng ký”; ẩn thông báo, tin nhắn và menu tài khoản.

**Mobile:**

- Ẩn menu desktop; hiện logo thu gọn và hamburger.
- Drawer trượt từ phải, có overlay, nút đóng, các nhóm menu dạng accordion và action đăng nhập/tài khoản.
- Mở drawer phải khóa cuộn body, giữ focus trong drawer; đóng bằng nút, overlay hoặc `Esc`.

### H03. Hero tìm kiếm việc làm

**Mục đích:** Cho người dùng bắt đầu tìm việc ngay lập tức; đây là CTA quan trọng nhất trang.

**Bố cục:**

- Section nền trắng có radial gradient cam/xanh rất nhẹ; padding trên 34px, dưới 28px.
- H1: “Tìm việc chất lượng, chạm đỉnh **sự nghiệp tương lai**”; phần nhấn màu cam.
- Mô tả 15px, màu `#64748B`, căn giữa, cách H1 6px.
- Toàn bộ hero xếp dọc; không dùng bố cục hai cột ở desktop.

**Search box:**

- Rộng 100% container, nền trắng, viền 1.5px, bo 16px, padding 6px, bóng `0 16px 32px -8px rgba(15,23,42,.08)`.
- Khi focus bên trong: viền cam, bóng cam nhẹ.
- Thứ tự: icon tìm kiếm → input từ khóa → nút xóa tròn 22px → divider 1×28px → trigger địa điểm → nút “Tìm kiếm”.
- Input font 14.5px, placeholder “Vị trí tuyển dụng, kỹ năng (vd: Java, React, Marketing...)”.
- Nút tìm kiếm gradient cam, bo 12px, padding khoảng `13px 26px`, chữ 15px/700.

**Hành vi tìm kiếm:**

1. Focus/click input mở bảng gợi ý.
2. Nhập từ khóa có debounce 250–350ms nếu gọi API.
3. Enter hoặc nút Tìm kiếm gửi `keyword + locationCodes + categoryCode`.
4. Nếu là production, đồng bộ query lên URL và điều hướng tới trang kết quả.
5. Nút xóa chỉ xuất hiện khi có nội dung; xóa xong vẫn giữ focus ở input.
6. Không được báo “thành công” bằng toast khi chưa nhận kết quả thật.

**Bảng gợi ý:**

- Neo ngay dưới search box, full width, z-index cao hơn banner; nền trắng, viền cam nhạt, bo 18px, padding `20px 24px`.
- Gồm theo thứ tự:
  - Lịch sử tìm kiếm gần đây: chip pill, cho phép xóa từng mục hoặc xóa tất cả.
  - Mega menu ngành nghề: cột trái rộng 250px là nhóm ngành có phân trang; cột phải là vị trí “hot” và nhóm nghề con dạng pill.
  - Từ khóa thịnh hành.
  - Footer có gợi ý phím và nút “Đóng [Esc]”.
- Mega menu cao tối thiểu 290px; vùng nội dung bên phải cuộn dọc, tối đa 320px.
- Active ngành: nền xanh nhạt, chữ/viền trái xanh `#00B14F`.
- Click chip điền từ khóa; quy tắc “chỉ điền” hay “điền và tìm ngay” phải nhất quán trong toàn trang.

**Bộ chọn địa điểm:**

- Popover dạng dialog rộng tối đa 660px, cao 415px, bo 16px.
- Header có hai chế độ dữ liệu địa giới nếu nghiệp vụ hỗ trợ.
- Nội dung chia 2 cột bằng nhau: Tỉnh/Thành phố và Quận/Huyện hoặc Phường/Xã.
- Mỗi cột có input lọc và danh sách cuộn; cho phép chọn nhiều.
- Item cao tối thiểu 40px; checkbox 20×20px; selected dùng nền và dấu tick xanh.
- Footer có “Bỏ chọn tất cả” bên trái và “Áp dụng” bên phải.
- “Đóng/thoát” không commit lựa chọn nháp; “Áp dụng” mới cập nhật bộ lọc.

**Tag tìm nhanh:**

- Dòng nằm dưới search, label “Tìm kiếm phổ biến:” và các pill.
- Pill font 13px, padding `4px 12px`, viền xám; một pill ưu tiên có nền cam nhạt.

**Mobile:**

- Search box chuyển thành cột.
- Divider dọc bị ẩn; địa điểm có divider ngang phía trên.
- Nút tìm kiếm full width.
- Suggestion panel và location picker không được vượt viewport; hai cột địa điểm vẫn dùng được ở 360px hoặc chuyển thành quy trình 2 bước nếu dự án đích cần.

### H04. Doanh nghiệp tiêu điểm và dải đối tác

**Mục đích:** Tạo vị trí thương mại cao cấp cho nhà tuyển dụng, đồng thời củng cố độ tin cậy của nền tảng.

**Banner doanh nghiệp tiêu điểm:**

- Nằm ngay dưới tag tìm nhanh, cách 12px.
- Khung full width, cao tối thiểu 410px, bo 16px, viền cam nhạt 1.5px, nền xanh đen.
- Phần ảnh chính cao 336px, `object-fit: cover`, ưu tiên `object-position: center top`.
- Chân banner cao tối thiểu 74px, nền `#0B1329`, gồm:
  - Logo doanh nghiệp 46×46px trong hộp trắng bo 10px.
  - Tên chiến dịch 16px/700 và tên doanh nghiệp 13.5px.
  - CTA cam “Khám phá ngay” ở bên phải.
- Có nhãn “Được tài trợ/Quảng cáo” nhìn thấy rõ.
- Có 3 slide và dãy chấm điều hướng; chấm active rộng 20px, màu cam.

**Tương tác carousel:**

- Tự chuyển mỗi 5 giây.
- Dừng khi hover, focus, tab trình duyệt bị ẩn hoặc reduced motion.
- Người dùng có thể chọn từng chấm; focus không tự nhảy khi slide đổi.
- Click ảnh/logo/CTA dẫn tới trang chiến dịch hoặc doanh nghiệp tương ứng.

**Dải đối tác:**

- Cách banner 28px, có divider phía trên.
- Card đối tác rộng khoảng 356px, cao tối thiểu 146px, bo 17px, viền cam nhạt.
- Logo 98×98px bên trái; tên viết hoa 15px/700 và ngành 14px bên phải.
- Auto chuyển mỗi 4 giây nhưng vẫn có điều khiển bằng bàn phím; mobile cho phép cuộn ngang.

### H05. Việc làm nổi bật

**Mục đích:** Hiển thị cơ hội chất lượng cao, đã xác thực hoặc đang được ưu tiên tuyển.

**Bố cục:**

- Nền `#F8FAFC`, padding dọc 40px.
- Header trái gồm H2 và mô tả; link “Xem tất cả … việc làm” ở phải.
- Thanh 6 pill ngành nằm dưới header, cuộn ngang trên mobile.
- Lưới desktop 3 cột, gap 16px; dữ liệu mẫu có 9 card.

**Job card chuẩn:**

- Nền trắng, viền 1px, bo 12px, padding `14px 16px`, min-height 118px.
- Cấu trúc dọc gồm hai hàng:
  1. Hàng trên: logo 52×52px → cụm tiêu đề/công ty.
  2. Hàng dưới: các pill lương/địa điểm/matching → nút bookmark.
- Logo trong hộp trắng, viền xanh 1.5px, bo 8px; có badge tia chớp nhỏ góc trên trái với việc ưu tiên.
- Tiêu đề 14.5px/700, tối đa 2 dòng.
- Tên công ty 11.5px/500, uppercase, một dòng ellipsis.
- Pill cao khoảng 24px, padding `4px 10px`, font 12px.
- Bookmark tròn 32×32px, viền xanh; active nền xanh, icon trắng.
- Hover card: nâng 2px, viền xanh, bóng xanh nhẹ.

**Tương tác:**

- Click vùng card/tiêu đề → `/viec-lam/{slug-or-id}`.
- Click tên/logo công ty → `/cong-ty/{slug-or-id}` và không kích hoạt click card.
- Bookmark → gọi save/unsave API; khi pending khóa nút và hiển thị tiến trình; lỗi phải rollback.
- Filter pill active có nền cam/chữ trắng. Filter phải kết hợp với từ khóa và địa điểm trong một state chung, không ghi đè lẫn nhau.
- Empty state phải ghi “Không tìm thấy việc phù hợp” và có nút xóa bộ lọc.

### H06. Việc làm lương cao

**Mục đích:** Thu hút ứng viên giàu kinh nghiệm bằng lương/phúc lợi và môi trường phát triển.

**Bố cục:**

- Nền trắng, header tương tự H05.
- Lưới 3 cột desktop, gap 16px; dữ liệu mẫu có 6 card.
- Card dùng cùng cấu trúc job card để giảm chi phí nhận thức.

**Khác biệt thiết kế:**

- Viền cam nhạt `#FED7AA`, bóng cam rất nhẹ.
- Hover viền cam `#F97316` và bóng cam.
- Lương/phúc lợi là thông tin nổi bật nhất sau tên công việc.
- Có thể thêm badge “Lương cao”, “Thưởng ký hợp đồng”, “Remote/Hybrid”, nhưng badge phải lấy từ dữ liệu.

**Liên kết/tương tác:** giống H05; CTA section dẫn tới trang kết quả đã áp bộ lọc lương cao.

### H07. Công ty nổi bật

**Mục đích:** Giúp ứng viên khám phá nhà tuyển dụng uy tín trước khi chọn việc.

**Bố cục:**

- Nền `#F8FAFC`; lưới 2 cột desktop, gap 24px; dữ liệu mẫu có 4 card.
- Mỗi card gồm cover ở trên, body ở dưới; logo chồng mép cover/body.

**Company card:**

- Nền trắng, bo 16px, viền 1px, overflow hidden.
- Cover dùng ảnh/gradient có tỷ lệ nhất quán; không cắt logo hoặc chữ trong ảnh.
- Logo khoảng 64×64px, hộp trắng, bo 12px, có bóng; đặt lệch lên cover khoảng 32px.
- Tên công ty 18px/800; badge xác thực đặt ngay cạnh tên.
- Metadata gồm ngành, quy mô/địa điểm nếu có.
- Khối số liệu cho biết số việc đang tuyển và lượt theo dõi; không hiển thị số giả như dữ liệu thật.
- Footer card có nút “Theo dõi” và “Xem việc làm”.

**Tương tác:**

- Click card/tên → `/cong-ty/{slug-or-id}`.
- “Xem việc làm” → `/viec-lam?company={id}`.
- Theo dõi/unfollow dùng optimistic UI có rollback khi lỗi; khách phải đăng nhập và giữ return URL.

### H08. Banner EasyCV VIP Pro

**Mục đích:** Giới thiệu gói trả phí như một giải pháp tăng độ nổi bật hồ sơ, không chen ngang luồng tìm việc quá mức.

**Bố cục:**

- Banner full container, nền gradient tím/xanh đen, bo 16px.
- Trái: icon/nhãn VIP, tiêu đề “Nổi bật hơn với EasyCV VIP Pro”, mô tả ngắn.
- Có 2–3 lợi ích dạng bullet/check.
- Phải: CTA cam “Dùng thử VIP…” và thông tin ưu đãi nếu có.

**Tương tác:**

- CTA → `/vip` hoặc checkout thật.
- Nếu thanh toán chưa sẵn sàng, hiển thị “Sắp ra mắt”; không dùng toast thành công giả.

### H09. Việc làm phù hợp với bạn

**Mục đích:** Cá nhân hóa nội dung dựa trên hồ sơ ứng viên và thúc đẩy hoàn thiện CV.

**Bố cục:**

- Header có H2, mô tả về matching và CTA “Tùy chỉnh tiêu chí gợi ý”.
- Banner hoàn thiện hồ sơ nằm đầu section: icon AI tròn 48px, tiêu đề/mô tả ở giữa, nút “Cập nhật CV” bên phải.
- Thanh tab nằm dưới banner, có divider 2px; tab active chữ và underline cam.
- Lưới job card giống H05; dữ liệu mẫu có 4 card.

**Tab gợi ý:**

- Gợi ý tốt nhất.
- Phù hợp kỹ năng.
- Phù hợp mức lương.
- Gần địa điểm mong muốn.

Tên tab có thể thay đổi theo taxonomy thật nhưng mỗi tab phải ánh xạ tới `matchType` rõ ràng.

**Điểm matching:**

- Badge xanh lá dạng pill, ví dụ “Khớp 95%”.
- Có một dòng lý do ngắn, ví dụ “Khớp 4/5 kỹ năng chính”.
- `matchScore` và `matchReasons` PHẢI do backend cung cấp; frontend không tự suy diễn phần trăm.
- Khi hồ sơ thiếu dữ liệu, thay danh sách bằng CTA hoàn thiện hồ sơ; không bịa kết quả matching.

### H10. Hai banner quảng bá

**Mục đích:** Quảng bá sự kiện tuyển dụng hoặc chương trình học bổng/chứng chỉ liên quan trực tiếp tới nghề nghiệp.

**Bố cục:**

- Dải có padding dọc 24px.
- Desktop chia `1.2fr / 0.8fr`, gap 20px; mobile xếp dọc.
- Card min-height 170px, bo 16px, padding `24px 28px`.
- Banner trái nền xanh đen; banner phải nền cam rất nhạt.
- Trong card: nhãn tài trợ + countdown (nếu có) → tiêu đề 18px → mô tả → CTA.

**Quy tắc:**

- Nhãn “Tài trợ/Đối tác” phải nhìn thấy.
- Countdown lấy thời gian thật, hết hạn phải đổi trạng thái hoặc ẩn.
- CTA dẫn tới landing page có thật; nếu chưa có route, disable kèm giải thích.

### H11. Khóa học nâng cao kỹ năng

**Mục đích:** Đề xuất học tập dựa trên xu hướng tuyển dụng, giúp người dùng bổ sung năng lực.

**Bố cục:**

- Header section + link xem tất cả.
- Carousel: desktop 4 card, tablet 2, mobile 1; gap 16px.
- Dữ liệu mẫu có 4 khóa học.

**Course card:**

- Nền trắng, viền 1px, bo 12–16px, overflow hidden.
- Ảnh tỷ lệ thống nhất ở đầu card, `object-fit: cover`.
- Badge lĩnh vực đặt trên ảnh hoặc đầu body; badge “phù hợp” chỉ hiện nếu có dữ liệu.
- Body theo thứ tự: tiêu đề tối đa 2 dòng → giảng viên/đơn vị → rating + số đánh giá → giá hiện tại + giá cũ gạch ngang.
- Giá hiện tại dùng cam và weight 800; giá cũ dùng xám.

**Tương tác:**

- Click card → `/khoa-hoc/{slug-or-id}`.
- Auto chuyển 5 giây, dừng khi hover/focus/reduced motion.
- Có nút previous/next với accessible name; không chỉ hỗ trợ kéo chuột.

### H12. Sự kiện tuyển dụng

**Mục đích:** Kết nối ứng viên với nhà tuyển dụng và hoạt động phát triển nghề nghiệp.

**Bố cục:**

- Lưới desktop 3 cột; dữ liệu mẫu có 3 sự kiện.
- Card nền trắng, viền 1px, bo 12–16px, padding khoảng 20px; nội dung chia phần chính và footer.

**Event card:**

- Hàng đầu: badge ngày 54×60px bên trái; bên phải là tag Online/Offline và tiêu đề tối đa 2 dòng.
- Badge ngày có viền trên cam 3px; ngày 19px/800, tháng 10px/700 uppercase.
- Dòng tổ chức/địa điểm dùng icon và font 12.5px.
- Mô tả 13px, line-height 1.5.
- Footer có divider nét đứt; số người đăng ký bên trái, CTA “Đăng ký miễn phí” bên phải.

**Tương tác:**

- Click tiêu đề/card → `/su-kien/{slug-or-id}`.
- CTA đăng ký gọi flow thật; pending/đã đăng ký/hết chỗ/hết hạn phải có trạng thái riêng.
- Số người đăng ký là dữ liệu từ server, không tự tăng ở frontend.

### H13. Ngành nghề và từ khóa phổ biến

**Mục đích:** Cung cấp lối vào khám phá dành cho người chưa biết chính xác chức danh cần tìm và hỗ trợ SEO nội bộ.

**Phần A – 8 ngành phổ biến:**

- Lưới desktop 4 cột, tablet 2, mobile 1; gap 16px.
- Card nền trắng, viền 1px, bo 14px, padding 18px.
- Icon 46×46px trong ô nền nhạt theo từng ngành.
- Tên ngành 14.5px/700; số việc 12.5px/600 màu cam.
- Click → `/viec-lam?category={code}`.

Danh mục mẫu: Công nghệ thông tin; Kinh doanh/Bán hàng; Marketing/Truyền thông; Tài chính/Ngân hàng; Kế toán/Kiểm toán; Nhân sự/Hành chính; Thiết kế/Sáng tạo; Logistics/Xuất nhập khẩu.

**Phần B – Hot Search:**

- Hộp nền trắng, bo 16px, viền 1px, padding 24px.
- Header trái “Từ khóa việc làm được tìm kiếm nhiều nhất”; phải là thời gian cập nhật.
- Từ khóa dạng pill wrap, gap 10px; pill có nhãn, số việc và có thể có dấu “hot”.
- Click pill đặt query và chuyển tới trang tìm việc.
- Thống kê số việc và “cập nhật mỗi 15 phút” chỉ được hiển thị nếu có pipeline dữ liệu tương ứng.

### H14. Footer

**Mục đích:** Đăng ký nhận tin, cung cấp thông tin pháp lý, liên kết hệ thống và củng cố niềm tin.

**Thiết kế chung:**

- Nền `#0B1120`, chữ `#94A3B8`, padding top 60px.

**Newsletter:**

- Hộp gradient xanh đen, viền `#334155`, bo 16px, padding `32px 40px`.
- Trái: tiêu đề 20px/800 và mô tả.
- Phải: input email + nút cam; form rộng tối đa 480px.
- Validate định dạng email; chỉ báo thành công sau response server; xử lý email trùng và lỗi mạng.

**Footer chính:**

- Desktop 5 cột theo tỷ lệ `2fr 1fr 1fr 1fr 1.5fr`, gap 40px.
- Cột 1: logo sáng, mô tả EasyCV, thông tin giấy phép/chứng nhận.
- Cột 2: Về EasyCV.
- Cột 3: Dành cho ứng viên.
- Cột 4: Nhà tuyển dụng.
- Cột 5: Liên hệ và trụ sở.
- Footer bottom: copyright, điều khoản, chính sách và social icons.

**Ràng buộc nội dung:**

- Số giấy phép, chứng nhận, địa chỉ và số liệu doanh nghiệp phải được pháp chế/nghiệp vụ xác nhận trước production.
- Social icon phải dẫn tới URL thật và có accessible name.

### H15. Widget gợi ý AI nổi

**Mục đích:** Cung cấp lối vào nhanh tới gợi ý việc làm/cố vấn hồ sơ.

**Thiết kế:**

- Fixed ở góc phải dưới, desktop `right: 30px; bottom: 30px`, z-index 1000.
- Nút gradient cam dạng pill, padding `12px 20px`, chữ 13.5px/700, bóng cam.
- Chấm xanh 8px biểu thị trạng thái sẵn sàng; animation pulse phải tắt khi reduced motion.

**Tương tác:**

- Click mở popover nhỏ có tiêu đề, mô tả và CTA tới tính năng AI.
- Popover đóng bằng nút, click ngoài hoặc `Esc`; trả focus về nút mở.
- Không tuyên bố “AI đang hoạt động” nếu chưa có API/mô hình thật. Nếu chỉ là demo, ghi rõ “Bản xem trước”.

---

## 7. Quy tắc điều hướng và liên kết

| Nguồn thao tác | Đích logic | Yêu cầu |
|---|---|---|
| Logo | `/` | Về đầu trang chủ |
| Tìm kiếm | `/viec-lam?keyword=&locations=&category=` | Encode query; giữ bộ lọc khi back |
| Job card | `/viec-lam/{slug-or-id}` | Route chi tiết thật |
| Company card/logo | `/cong-ty/{slug-or-id}` | Route công ty thật |
| Bookmark/follow | API action; guest → `/dang-nhap?returnUrl=...` | Không dùng link `#` |
| Khóa học | `/khoa-hoc/{slug-or-id}` | Chỉ dùng khi module tồn tại |
| Sự kiện | `/su-kien/{slug-or-id}` | CTA đăng ký có state thật |
| VIP | `/vip` | Không mô phỏng thanh toán thành công |
| Nhà tuyển dụng | Cổng nhà tuyển dụng | Có thể khác domain; mở theo chính sách sản phẩm |
| Thông báo/tin nhắn | `/thong-bao`, `/tin-nhan` | Yêu cầu auth |
| Footer | Route nội dung/pháp lý thật | Không để dead link |

Nếu router hiện hữu dùng cấu trúc khác, AI phải ánh xạ sang route thật và báo bảng mapping; không tạo hàng loạt route mới chỉ để khớp tên trong tài liệu.

---

## 8. Mô hình dữ liệu tối thiểu

Đây là hợp đồng view-model đề xuất, không phải khẳng định API đã tồn tại.

| Model | Trường tối thiểu |
|---|---|
| `Job` | `id`, `slug`, `title`, `companyId`, `companyName`, `companyLogoUrl`, `salaryLabel`, `locationCodes[]`, `locationLabel`, `categoryCodes[]`, `tags[]`, `postedAt`, `isSponsored`, `isSaved`, tùy chọn `matchScore`, `matchReasons[]` |
| `Company` | `id`, `slug`, `name`, `logoUrl`, `coverUrl`, `industryLabel`, `locationLabel`, `isVerified`, `openJobCount`, `followerCount`, `isFollowed` |
| `Course` | `id`, `slug`, `title`, `imageUrl`, `categoryLabel`, `providerLabel`, `rating`, `ratingCount`, `price`, `originalPrice`, `badgeLabel` |
| `Event` | `id`, `slug`, `title`, `startsAt`, `format`, `locationLabel`, `organizers[]`, `summary`, `registrationCount`, `capacity`, `registrationStatus`, `registrationUrl` |
| `Banner` | `id`, `type`, `imageUrl`, `alt`, `headline`, `subline`, `sponsorLabel`, `destinationUrl`, `startsAt`, `endsAt`, `order` |
| `Location` | `code`, `name`, `type`, `parentCode`, `boundaryVersion` |
| `Category` | `code`, `name`, `iconKey`, `openJobCount` |
| `HomePayload` | `featuredJobs[]`, `highSalaryJobs[]`, `featuredCompanies[]`, `matchedJobs[]`, `courses[]`, `events[]`, `categories[]`, `keywords[]`, `banners[]`, `partners[]` |

Tiền, ngày giờ và địa danh phải format theo `vi-VN`. Ảnh thiếu phải có placeholder đúng tỷ lệ; không kéo ảnh ngẫu nhiên từ internet trong production.

---

## 9. Hành vi và máy trạng thái

```text
Search:
idle -> suggestOpen -> submitting -> results | empty | error

LocationPicker:
closed -> open(draftSelection) -> apply(committedSelection) -> closed
                           \-> dismiss(no change) -> closed

Bookmark / Follow:
off -> pendingOn -> on
on  -> pendingOff -> off
pending* -> error -> rollback previous stable state

RemoteSection:
loading -> ready(data) | empty | error

Overlay:
closed -> open(trigger)
open -> Escape | outsideClick | closeButton -> closed + restoreFocus(trigger)
```

Quy tắc bắt buộc:

- Search, ngành, địa điểm và tab matching phải nằm trong state có kiểm soát; không dùng nhiều đoạn code thay nhau ghi `style.display` trên card.
- Mọi thao tác ghi phải có `pending`, `success`, `error`; không báo thành công trước response server.
- Khi request mới bắt đầu, request cũ phải hủy hoặc kết quả cũ không được ghi đè kết quả mới.
- Lỗi một section không làm sập toàn trang; section hiển thị retry riêng.
- Empty state phải có lời giải thích và hành động tiếp theo.

---

## 10. Responsive

| Viewport | Bố cục yêu cầu |
|---|---|
| ≥ 1100px | Header desktop; job 3 cột; company 2 cột; category/course 4 cột; event 3 cột |
| 769–1099px | Điều chỉnh menu hoặc chuyển sớm sang hamburger; job 2 cột; course 2 cột; category 2 cột |
| 641–768px | Header mobile; search xếp dọc; promo 1 cột; card 1–2 cột tùy chiều rộng thực |
| ≤ 640px | Tất cả danh sách chính 1 cột; gutter 16px; carousel 1 card; footer 1 cột |

Điểm kiểm thử bắt buộc: **360px, 375px, 768px, 1024px, 1440px**.

- Không có scroll ngang toàn trang.
- Pill/tab/carousel có thể cuộn ngang bên trong chính nó.
- Nội dung không bị header sticky hoặc widget nổi che khuất.
- Touch target tối thiểu 44×44px; nếu icon nhỏ hơn, mở rộng hit area vô hình.

---

## 11. Accessibility

- Dùng landmark: `header`, `nav`, `main`, `section`, `footer`.
- Chỉ có một H1; các section dùng H2, card dùng H3 khi phù hợp.
- Button dùng cho hành động; link dùng cho điều hướng.
- Icon trang trí có `aria-hidden="true"`; icon-only button có accessible name.
- Dropdown/popover/drawer cập nhật `aria-expanded`; tab dùng role/state phù hợp.
- Thứ tự focus phải trùng thứ tự thị giác.
- Focus ring nhìn thấy rõ, ưu tiên màu cam, dày 2–3px.
- `Esc` đóng overlay; focus quay về trigger.
- Ảnh logo/banner có alt mô tả chức năng/nội dung, không lặp chữ thừa.
- Carousel không được tự đổi khi người dùng đang focus bên trong.
- Hỗ trợ `prefers-reduced-motion`.
- Form lỗi giữ dữ liệu đã nhập, báo lỗi ngay gần field và không chỉ báo bằng màu.

---

## 12. Trạng thái loading, empty và error

| Thành phần | Loading | Empty | Error |
|---|---|---|---|
| Search suggestion | Skeleton 3–5 dòng hoặc spinner nhỏ | “Không có gợi ý phù hợp” | “Không tải được gợi ý” + Thử lại |
| Job list | Skeleton giữ đúng kích thước card | Mô tả + xóa bộ lọc | Error card ở cấp section + Thử lại |
| Company/course/event | Skeleton theo lưới | Ẩn section hoặc empty có chủ ý | Không làm hỏng section khác |
| Bookmark/follow | Nút disabled + spinner | Không áp dụng | Rollback + thông báo ngắn |
| Newsletter/event registration | Nút loading | Không áp dụng | Giữ input/trạng thái và hiện lỗi |
| Banner/carousel | Placeholder đúng tỷ lệ | Ẩn toàn khối, không để khoảng trắng | Fallback tĩnh, không auto-play |

Skeleton không được nhấp nháy mạnh; kích thước phải gần nội dung thật để tránh layout shift.

---

## 13. Nội dung mẫu và dữ liệu cần xác minh

Các nội dung như “1.500+ việc làm”, “50.000 doanh nghiệp”, “Khớp 95%”, mức lương, giá khóa học, số người tham gia, countdown, giấy phép và chứng nhận hiện chỉ nên được xem là **fixture/demo** cho tới khi có nguồn dữ liệu hoặc phê duyệt.

Trước production cần xác minh:

1. Số liệu marketing và thống kê việc làm.
2. Danh sách địa giới hành chính và phiên bản dữ liệu.
3. Logo/ảnh và quyền sử dụng của nhà tuyển dụng/đối tác.
4. Nội dung tài trợ và URL đích.
5. Giấy phép, chứng nhận, địa chỉ, hotline và email.
6. Giá, ưu đãi và điều khoản VIP/khóa học.
7. Công thức/nguồn của điểm matching.

---

## 14. Yêu cầu phi chức năng

- Largest Contentful Paint mục tiêu ≤ 2.5 giây trên kết nối di động tốt.
- Cumulative Layout Shift mục tiêu ≤ 0.1; ảnh/banner phải khai báo tỷ lệ/kích thước.
- Lazy-load ảnh dưới màn hình đầu; không lazy-load logo và ảnh hero quan trọng.
- Không tải đồng thời mọi carousel/banner độ phân giải lớn.
- Debounce search; cache dữ liệu trang chủ theo cơ chế dự án nhưng không làm sai dữ liệu cá nhân.
- Không lưu lịch sử tìm kiếm nhạy cảm ngoài chính sách sản phẩm; nếu lưu local, phải tách theo tài khoản hoặc làm rõ trên máy dùng chung.
- Không đưa token, dữ liệu hồ sơ hoặc thông tin cá nhân vào log phía client.
- Không có runtime error, console error hoặc request asset 404 trong luồng chuẩn.

---

## 15. Component tree đề xuất cho đội triển khai

Tên có thể đổi theo convention dự án, nhưng không nhân bản logic/card markup.

```text
CandidateHomePage
├── DemoBar
├── SiteHeader
│   ├── DesktopNavigation
│   ├── NotificationPopover
│   ├── MessagePopover
│   ├── AccountMenu
│   └── MobileDrawer
├── HeroSearch
│   ├── KeywordInput
│   ├── SearchSuggestionPanel
│   ├── IndustryMegaMenu
│   ├── LocationPicker
│   └── QuickSearchTags
├── EmployerSpotlightCarousel
├── PartnerCarousel
├── FeaturedJobsSection
│   ├── CategoryFilterPills
│   └── JobCard[]
├── HighSalaryJobsSection -> JobCard[]
├── FeaturedCompaniesSection -> CompanyCard[]
├── VipPromotionBanner
├── MatchedJobsSection
│   ├── ProfileCompletionBanner
│   ├── MatchTabs
│   └── JobCard[]
├── PromotionBannerGrid
├── CoursesCarousel -> CourseCard[]
├── EventsSection -> EventCard[]
├── PopularDiscoverySection
│   ├── CategoryCard[]
│   └── KeywordPill[]
├── SiteFooter
└── FloatingAiWidget
```

Các component danh sách PHẢI nhận data qua props/view-model, có stable key và hỗ trợ trạng thái loading/empty/error.

---

## 16. Tiêu chí nghiệm thu

### 16.1. Nghiệm thu giao diện

- [ ] Đúng thứ tự H01–H15; production có thể bỏ H01.
- [ ] Font, màu, container, khoảng cách và hierarchy khớp mục 4.
- [ ] Header sticky và hero không che/chồng nội dung.
- [ ] Card việc làm, công ty, khóa học và sự kiện đúng thứ tự thành phần đã mô tả.
- [ ] Banner có nhãn tài trợ; không làm quảng cáo trông như nội dung hữu cơ.
- [ ] Không có chữ Việt lỗi mã hóa, icon emoji chức năng hoặc ảnh méo tỷ lệ.

### 16.2. Nghiệm thu chức năng

- [ ] Tìm bằng nút và Enter; xóa từ khóa; chọn nhiều địa điểm; lọc ngành.
- [ ] Bộ lọc kết hợp không ghi đè lẫn nhau; URL phản ánh query khi điều hướng.
- [ ] Bookmark/follow có auth, pending, success, error và rollback.
- [ ] Dropdown, popover, drawer, modal đóng đúng bằng `Esc`/click ngoài và trả focus.
- [ ] Carousel có điều khiển thủ công, tự dừng đúng điều kiện.
- [ ] Mọi CTA có route/action thật hoặc trạng thái “chưa sẵn sàng” minh bạch.

### 16.3. Nghiệm thu dữ liệu

- [ ] Mọi section từ xa có `loading | ready | empty | error`.
- [ ] Không tự tính match score; không hiển thị số liệu demo như số liệu thật.
- [ ] Format tiền/ngày/địa điểm theo `vi-VN`.
- [ ] Không báo thành công giả cho newsletter, sự kiện, VIP, bookmark hoặc follow.

### 16.4. Nghiệm thu responsive và accessibility

- [ ] Kiểm tra 360, 375, 768, 1024, 1440px; không tràn ngang.
- [ ] Dùng được hoàn toàn bằng bàn phím.
- [ ] Focus ring, accessible name, `aria-expanded` và thứ tự heading đúng.
- [ ] Chữ và UI đạt yêu cầu tương phản.
- [ ] Touch target ≥44×44px.
- [ ] Reduced motion dừng auto-play/animation không thiết yếu.

### 16.5. Nghiệm thu kỹ thuật

- [ ] Tận dụng stack/router/design system/API client sẵn có; không tự khởi tạo framework mới.
- [ ] Không duplicate card/search/filter logic.
- [ ] Build, lint và test hiện hữu chạy thành công.
- [ ] Không có console error, asset 404 hoặc layout shift lớn.
- [ ] Báo cáo rõ phần đã nối API, phần còn fixture, route còn thiếu và khác biệt có chủ đích.

---

## 17. Chỉ dẫn thực thi dành riêng cho Qwen 3.8 27B

```text
MỤC TIÊU
Triển khai trang chủ ứng viên EasyCV theo duy nhất tài liệu này trong dự án hiện tại.

QUY TRÌNH BẮT BUỘC
1. Khảo sát stack, router, auth, API client, design system và lệnh build/test hiện có.
2. Lập bảng mapping H01–H15 sang component/file của dự án.
3. Dựng layout và token trước, sau đó dựng component, cuối cùng nối state/API.
4. Dùng route và service có sẵn. Không tự tạo backend hoặc framework mới.
5. Nếu thiếu API, dùng fixture tách riêng và ghi nhãn demo trong báo cáo; thao tác ghi không được giả thành công.
6. Duy trì một search/filter state chung cho keyword, locations, category và matchType.
7. Thêm loading, empty, error, auth guard, keyboard/focus và reduced motion.
8. Chạy build/lint/test của dự án; kiểm tra 360/768/1440px.
9. Báo cáo: file đã thay đổi, component đã làm, API đã nối, fixture còn lại, route thiếu, test đã chạy.

KHÔNG ĐƯỢC
- Đổi thứ tự section hoặc bỏ component bắt buộc mà không báo lý do.
- Tự tưởng tượng route/API/điểm AI là đã tồn tại.
- Dùng href="#" cho production.
- Dùng toast thành công giả.
- Dùng emoji làm icon chức năng.
- Hardcode danh sách lặp trực tiếp trong markup nếu có thể đưa vào model/fixture.
- Mở rộng sang backend, trang chi tiết, CV Builder hoặc thanh toán khi chưa được giao.

ƯU TIÊN KHI CÓ MÂU THUẪN
Quy tắc bắt buộc của dự án đích > dữ liệu/API thật > tài liệu này > fixture minh họa.
Mọi khác biệt có chủ đích phải được ghi trong báo cáo bàn giao.
```

---

## 18. Kết luận đề xuất với lãnh đạo

Trang chủ được đề xuất không chỉ làm nhiệm vụ “đẹp và đầy đủ nội dung”, mà tổ chức toàn bộ hành trình đầu phễu của ứng viên: **tìm kiếm nhanh, khám phá cơ hội, đánh giá độ phù hợp và chuyển sang hành động**. Cấu trúc card/lưới giúp quét thông tin nhanh; các khối AI, khóa học và sự kiện tạo khác biệt sản phẩm; các vị trí tài trợ được tách nhãn rõ để bảo toàn niềm tin.

Phương án này có thể triển khai theo từng giai đoạn:

1. **Giai đoạn 1:** Header, hero search, việc làm, công ty và footer với dữ liệu thật.
2. **Giai đoạn 2:** Bookmark/follow, thông báo, tin nhắn, khóa học và sự kiện.
3. **Giai đoạn 3:** AI matching, VIP và cá nhân hóa sâu.

Điều kiện quan trọng nhất trước production là hoàn thiện route/API, xác minh dữ liệu marketing/pháp lý và không biến dữ liệu mẫu thành tuyên bố thật.
