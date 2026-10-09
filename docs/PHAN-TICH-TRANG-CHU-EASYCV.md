# PHÂN TÍCH VÀ ĐẶC TẢ TRANG CHỦ ỨNG VIÊN EASYCV

> **Loại tài liệu:** Business Analysis + UI/UX Specification + AI Implementation Contract
> **Phiên bản:** 2.0
> **Ngày cập nhật:** 06/10/2026
> **Phạm vi:** Trang chủ ứng viên `index.html`
> **Đối tượng đọc:** Product Owner, BA, UX/UI, Frontend, QA và AI coding agent; ưu tiên Qwen 3.8 27B
> **Trạng thái:** As-is đã đối soát với mã nguồn hiện hành và PRD

---

## 1. Mục đích và cách sử dụng

Tài liệu này mô tả **trạng thái trang chủ EasyCV sau các lần tinh chỉnh gần nhất**, đồng thời quy định cách tiếp tục triển khai mà không khôi phục nhầm các khối đã bị loại bỏ hoặc biến dữ liệu mẫu thành chức năng production.

Trang chủ hiện tại là một **trung tâm tìm kiếm và khám phá việc làm dành cho ứng viên đã đăng nhập**, tập trung vào năm nhiệm vụ:

1. Tìm việc theo từ khóa, danh mục nghề và địa điểm.
2. Khám phá việc làm nổi bật, việc làm phù hợp và doanh nghiệp nổi bật.
3. Tiếp cận mẫu CV theo phong cách.
4. Khám phá ngành nghề và từ khóa phổ biến.
5. Truy cập các chức năng tài khoản, thông báo, tin nhắn và điều hướng toàn hệ thống.

Trước khi sửa mã, Agent **PHẢI** đối chiếu lại các tệp nguồn tại mục 2 vì đây là prototype HTML/CSS/JavaScript tĩnh đang tiếp tục thay đổi.

### 1.1. Từ khóa quy phạm

- **PHẢI:** Điều kiện bắt buộc để nghiệm thu.
- **KHÔNG ĐƯỢC:** Hành vi bị cấm hoặc không được tự ý triển khai.
- **NÊN:** Phương án ưu tiên; chỉ thay đổi khi có lý do rõ ràng.
- **CÓ THỂ:** Phương án tùy chọn.
- **Fixture/demo:** Dữ liệu minh họa, chưa phải dữ liệu đã xác minh hoặc lấy từ API.
- **Route thật:** URL/route có hợp đồng điều hướng rõ ràng; không phải anchor `#...` minh họa.
- **Khối đang hiển thị:** Có mặt trong render tree và người dùng nhìn thấy.
- **Khối lưu trữ nhưng đang ẩn:** Còn markup/logic để bảo lưu nhưng không thuộc trải nghiệm hiện tại.

---

## 2. Nguồn đối soát và thứ tự ưu tiên

| Mức | Nguồn | Vai trò |
|---:|---|---|
| 1 | Quyết định mới nhất của người dùng | Yêu cầu và thay đổi có chủ đích cần ưu tiên |
| 2 | `index.html`, `css/home.css`, `css/navbar.css`, `css/location-picker.css`, `css/category-filter-modal.css` | Cấu trúc và giao diện as-is |
| 3 | `js/home.js`, `js/navbar.js`, `js/location-picker.js`, `js/category-filter-modal.js` | Hành vi as-is |
| 4 | `assets/design-tokens.css`, `docs/brand-guidelines.md` | Token và chuẩn nhận diện |
| 5 | Thư mục `public/` | Bản mirror triển khai tĩnh; phải đồng bộ khi sửa mã tương ứng |

### 2.1. Xử lý mâu thuẫn

1. Không bỏ qua PRD; mọi thay đổi phải chỉ ra FR/Journey liên quan.
2. Quyết định mới có artifact và kết quả nghiệm thu có thể thay đổi cách thể hiện so với PRD.
3. Nếu PRD và mã khác nhau nhưng không có quyết định rõ, ghi nhận là **điểm cần Product Owner xác nhận**.
4. Không phục hồi module chỉ vì CSS, JavaScript hoặc markup cũ còn tồn tại.
5. Không coi anchor, toast mô phỏng hoặc số liệu hard-code là tích hợp nghiệp vụ hoàn chỉnh.

### 2.2. Ma trận PRD và hiện trạng

| PRD | Trạng thái hiện tại | Kết luận |
|---|---|---|
| FR-1: Logo về trang chủ/đầu trang | Đã có | Giữ; tại trang chủ click logo cuộn lên đầu |
| FR-2: Menu Tìm việc đưa về search | Đã có | Giữ trên desktop và mobile drawer |
| FR-3: Tài khoản, thông báo, tin nhắn | Có UI fixture, trạng thái đã đăng nhập | Chưa phải tích hợp backend |
| FR-4: Từ khóa và lịch sử | Đã có; key `easycv_recent_searches_v2` | Giữ popup hai cột và chế độ đổi khi gõ |
| FR-5: Địa điểm hai cấp | Đã có hai chế độ địa giới | Dữ liệu phải xác minh trước production |
| FR-6: Danh mục nghề đa cấp | Đã thành modal riêng neo dưới search | Không đưa mega-menu ngành vào popup từ khóa |
| FR-7: Điều hướng kết quả | Đã có | Dùng `keyword`, `location`, `category`, `industry` |
| FR-13: Employer Spotlight | Đã thành bento banner ảnh thuần | Một slider chính + hai banner phụ |
| FR-14: Việc làm nổi bật/hấp dẫn | Nổi bật hiển thị; hấp dẫn/lương cao ẩn | Không tự mở lại khối ẩn |
| FR-15: Mẫu CV | Carousel liên tục có bộ lọc | Giữ auto-run và reduced motion |
| AI Match | Khối phù hợp còn hiển thị; tab lọc đã gỡ | Không khôi phục tab cũ |

---

## 3. Mục tiêu, người dùng và phạm vi

### 3.1. Mục tiêu nghiệp vụ

- Tăng tỷ lệ người dùng bắt đầu tìm việc từ trang chủ.
- Rút ngắn luồng từ nhu cầu đến danh sách kết quả còn tối đa ba thao tác chính.
- Tăng lượt xem việc làm, lưu việc và khám phá doanh nghiệp.
- Khuyến khích ứng viên hoàn thiện hồ sơ/CV.
- Tạo vị trí thương mại cho doanh nghiệp tài trợ nhưng không làm mất trọng tâm tìm việc.
- Củng cố nhận diện EasyCV: hiện đại, đáng tin cậy, có dữ liệu và dễ quét.

### 3.2. Trạng thái người dùng mặc định

Trang cố định ở ngữ cảnh **ứng viên đã đăng nhập** theo `[ASSUMPTION-1]` của PRD:

- Tên mẫu: Nguyễn Văn A; hồ sơ mẫu hoàn thiện 85%.
- Có thông báo, tin nhắn, avatar và menu tài khoản.
- Không có DemoBar chuyển guest/logged-in.
- Không hiển thị nút Đăng nhập/Đăng ký trong bản trang chủ này.

### 3.3. Trong phạm vi

- Header desktop/mobile drawer.
- Hero search, popup gợi ý, modal danh mục nghề, location picker.
- Banner tài trợ bento.
- Việc làm nổi bật, công ty nổi bật, quảng bá VIP, việc làm phù hợp.
- Carousel mẫu CV; danh mục/từ khóa phổ biến.
- Footer, floating AI widget và phản hồi UI mức prototype.
- Responsive, keyboard, focus và reduced motion.

### 3.4. Ngoài phạm vi

- Backend, database, xác thực thật và phân quyền.
- AI matching thực; thanh toán VIP; CV editor WYSIWYG; chat realtime.
- CMS banner và các trang chi tiết ngoài điểm điều hướng.
- Tự xác nhận thao tác ghi thành công khi chưa có API.

---

## 4. Kiến trúc thông tin hiện hành

```text
CandidateHomePage
├── H01. SiteHeader
│   ├── BrandLogo + DesktopNavigation
│   ├── EmployerPortalLink
│   ├── NotificationPopover + MessagePopover
│   ├── AccountMenu
│   └── MobileDrawer
├── H02. HeroDiscovery
│   ├── VisuallyHiddenH1
│   ├── StickySmartSearch
│   │   ├── CategoryTrigger + CategoryModal
│   │   ├── KeywordInput + SmartSuggestionDropdown
│   │   ├── LocationTrigger + TwoLevelLocationPicker
│   │   └── SearchCTA
│   ├── TrendingQuickTags
│   └── SponsorBento: PrimarySlider[2] + SecondaryBanner[2]
├── H03. FeaturedJobs
├── H04. FeaturedCompaniesCarousel
├── H05. VipPromotion
├── H06. MatchedJobs
├── H07. CvTemplateCarousel
├── H08. PopularCategoriesAndKeywords
├── H09. SiteFooter
├── H10. FloatingAiRecommendation
└── H11. PrototypeViewModeSwitcher
```

### 4.1. Thứ tự hiển thị bắt buộc

Header → Search/quick tags/bento → Việc làm nổi bật → Công ty nổi bật → VIP Pro → Việc làm phù hợp → Mẫu CV → Ngành/từ khóa phổ biến → Footer → Widget nổi.

### 4.2. Khối không còn thuộc trải nghiệm hiển thị

- Hero title/subtitle nhìn thấy đã gỡ; chỉ còn H1 `.sr-only`.
- Dải logo thương hiệu dưới hero và khối thống kê đã gỡ.
- Khóa học và sự kiện tuyển dụng đã gỡ.
- `#viec-lam-hap-dan` còn DOM nhưng có `hidden`, `aria-hidden="true"`, `display: none !important`.
- Tab trong `#viec-lam-phu-hop` đã gỡ.
- Banner quảng bá cũ trong vùng mẫu CV đã gỡ.

Agent **KHÔNG ĐƯỢC** phục hồi các khối trên nếu không có yêu cầu mới.

---

## 5. Ngôn ngữ thiết kế

### 5.1. Nguyên tắc

- Ba thuộc tính: **tin cậy – năng động – dễ sử dụng**.
- Nội dung tuyển dụng nổi bật hơn quảng cáo; giao diện sáng, nhiều khoảng thở.
- Cam EasyCV cho CTA/active; slate cho chữ/cấu trúc; xanh lá cho trạng thái tích cực đặc thù.
- Không dùng emoji làm icon chức năng mới; emoji còn trong fixture không phải tiền lệ.
- Một section có một tiêu đề chính và tối đa một CTA cấp section.

### 5.2. Token chính

| Nhóm | Giá trị | Cách dùng |
|---|---:|---|
| Primary | `#F97316` | CTA, active, focus, điểm nhấn |
| Primary hover | `#EA580C` | Hover CTA |
| Primary soft | `#FFF7ED` | Nền cam nhạt |
| Slate 900 | `#0F172A` | Chữ đậm/vùng tối |
| Text primary | `#1E293B` | Nội dung chính |
| Text secondary | `#475569` | Nội dung phụ |
| Text muted | `#94A3B8` | Metadata |
| Surface | `#FFFFFF` | Card/input/modal |
| Page background | `#F8FAFC` | Nền xen kẽ |
| Border | `#E2E8F0` | Viền/divider |
| Positive | `#16A34A` | Verified/match hợp lệ |
| Font | `Inter` | Giao diện chính |

### 5.3. Kích thước

- Navbar: `72px`, max-width `1360px`.
- Content max-width `1250px`; gutter desktop `20px`, mobile `16px`.
- Section padding dọc `40px`.
- Search box cao `60px`, viền cam `1.5px`, bo `14px`.
- Job card bo `12px`; logo `65 × 65px`.
- Company card bo `18px`; logo desktop `88 × 88px`, mobile `76 × 76px`.
- Grid gap `16px`; carousel company/CV gap `20px` desktop.
- Motion nhanh khoảng `160–240ms`.

### 5.4. Typography

- Chỉ một H1 và đang ẩn thị giác; section chính dùng H2 căn trái.
- Tên job tối đa hai dòng; metadata có ellipsis khi thiếu chỗ.
- Body dài không nhỏ hơn 14px; không dùng `text-align: justify`.

---

## 6. Đặc tả từng khối

### H01. Header và điều hướng

**Desktop:** Header sticky; thứ tự trái sang phải: logo, bốn menu, employer link, thông báo, tin nhắn, tài khoản. Bốn menu là Tìm việc, Hồ sơ & CV, Ứng tuyển, Công cụ nghề nghiệp.

- Logo cuộn về đầu trang.
- “Tìm việc”/“Tìm kiếm việc làm” cuộn tới search và focus input.
- Notification/message dùng fixture; badge hiện tại là 3 và 2.
- Account menu thể hiện người dùng đã đăng nhập, hồ sơ 85%.

**Mobile:** Ẩn desktop nav, dùng hamburger; drawer trượt từ trái, rộng `320px`, tối đa `85vw`, có overlay và accordion. Mở drawer phải khóa cuộn; Escape/click overlay đóng và quản lý focus.

**Không được:** Tạo lại DemoBar, tự thêm guest variant, hoặc coi employer link là recruiter portal hoàn chỉnh.

### H02. Hero Discovery và Smart Search

#### H02.1. Cấu trúc

Thứ tự: nút Danh mục Nghề → input từ khóa → bộ chọn địa điểm → CTA “Tìm việc ngay”. Hero không còn heading nhìn thấy; H1 `.sr-only` là “EasyCV - Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh”.

#### H02.2. Sticky search

- Khi wrapper chạm đáy header, `.hero-search-sticky-bar` nhận `is-sticky`.
- Top lấy theo chiều cao header thực, mặc định 72px.
- Wrapper giữ chiều cao để tránh layout shift.
- Popup gợi ý và modal danh mục vẫn neo đúng khi sticky.

#### H02.3. Keyword popup

Mở khi focus/click input; đóng bằng Escape, nút “Đóng [Esc]”, click ngoài hoặc sau search.

**Input rỗng:** cột trái có tối đa sáu lịch sử, xóa từng mục/xóa tất cả, năm keyword Finance/Kinh doanh/IT/Accountant/Marketing; cột phải có năm job fixture.

**Đang gõ:** ẩn lịch sử/keyword phổ biến, hiển thị tối đa sáu gợi ý khớp không dấu, tô đậm phần khớp; nếu không có thì cho tìm đúng chuỗi. Cột job bên phải giữ nguyên.

**History contract:** key `easycv_recent_searches_v2`, tối đa sáu, mới nhất đứng đầu, loại trùng không phân biệt hoa thường. Số lượng việc làm hiện là fixture/tính giả lập.

**Vị trí:** desktop căn mép trái popup với input để lộ nút danh mục, mép phải bám search box; `≤900px` rộng 100% wrapper.

#### H02.4. Modal Danh mục Nghề

- Trigger riêng, không thuộc popup từ khóa.
- Gồm header, search, cột Nhóm nghề, vùng Nghề/Vị trí chuyên môn, nhóm phổ biến và footer.
- Neo **8px dưới search box**, kể cả sticky.
- Desktop rộng tối đa `1250px`; cao khoảng `2/3` phần khả dụng.
- Mobile `≤768px` chuyển một cột/toàn viewport phù hợp.
- Backdrop trang chủ **trong suốt, không blur**, vẫn bắt click ngoài.
- Actions: Bỏ chọn tất cả, Hủy, Chọn.
- Apply phát `easycv:category-applied` để đồng bộ search state.

#### H02.5. Location picker

- Hai chế độ: Tỉnh/Quận-huyện cũ và Tỉnh/Phường-xã sau 01/07/2025.
- Có search riêng cho hai cấp, clear all và apply.
- Desktop tối đa khoảng `660px × 415px`, hai cột; mobile rộng 100%, cao tối đa `70vh`.
- `#heroLocationSelect` ẩn là cầu nối tới search controller.

#### H02.6. Search submission

Enter và CTA dùng cùng luồng:

```text
viec-lam.html?keyword=<...>&location=<...>&category=<...>&industry=<...>
```

- Chỉ thêm param có giá trị và dùng `URLSearchParams`.
- `category` chỉ dùng cho key trang kết quả hỗ trợ.
- Lựa chọn chuyên môn/không ánh xạ category truyền qua `industry`.
- Search rỗng vẫn đi `viec-lam.html`.

#### H02.7. Quick tags

Frontend Dev, Java Spring, Marketing, UI/UX Designer, Data AI, Việc làm Remote. Click phải dùng cùng search contract.

### H03. Bento Sponsor Banner

- Một banner chính bên trái, hai banner phụ xếp dọc bên phải.
- Banner chính có hai slide, previous/next, hai dots, autoplay `5 giây`, pause khi hover.
- Nút/dot không được click xuyên vào link slide.
- Ảnh có alt có nghĩa, không méo; route hiện là anchor fixture cần thay trước production.
- Nội dung tài trợ phải được nhận diện minh bạch khi production.

### H04. Việc làm nổi bật

- ID `#viec-lam-noi-bat`; chín job fixture; desktop ba cột, gap `16px`.
- Pill: Tất cả; IT; Marketing; Kinh doanh B2B; Tài chính; Remote.
- Card gồm logo, badge ưu tiên/tài trợ, title, company, salary, location, bookmark.
- Logo luôn `65 × 65px`; pill chỉ lọc section này.
- Bookmark hiện chỉ đổi UI và toast.

**Cảnh báo:** Link `#job-...`/`#company-...` chưa phải route; ảnh Unsplash là placeholder; không báo lưu thành công production khi chưa có API/auth.

#### H04-Legacy. Việc làm hấp dẫn/lương cao

`#viec-lam-hap-dan` đang ẩn có chủ đích: không hiển thị, không chiếm chỗ, không khởi tạo pagination, không vào accessibility tree. Không sửa/khôi phục nếu không được giao riêng.

### H05. Công ty nổi bật

- ID `#cong-ty-tieu-bieu`; tám fixture: FPT, VNG, Viettel Digital, Techcombank, MoMo, Shopee, MB Bank, VinAI.
- Carousel mỗi `2 giây` dịch một card; sau transition chuyển card đầu xuống cuối.
- Pause khi hover/focus/tab ẩn; tôn trọng reduced motion.
- Desktop/tablet/mobile hiển thị 5/3/2 card.
- Logo desktop 88px, mobile 76px; tên tối đa ba dòng.
- Không hiển thị “lĩnh vực công ty”; thay đổi này đã được hoàn nguyên.
- Footer có số job và nút yêu thích.

Route company dùng query `q` là fixture và cần thống nhất contract trước production.

### H06. EasyCV VIP Pro

Banner in-feed gồm tiêu đề, mô tả, ba quyền lợi và CTA. “12.500+ nhà tuyển dụng”, phân tích CV và sửa CV 1-1 là claim fixture cho tới khi xác minh. CTA `#nang-cap-vip` chưa phải thanh toán; không tạo success giả.

### H07. Việc làm phù hợp với bạn

- ID `#viec-lam-phu-hop`; có CTA hồ sơ, banner 85%/34 việc và sáu job card.
- **Không còn tab** Tất cả/Khớp CV/Lương cao/Remote; danh sách đi thẳng sau banner.
- Dùng lại hệ thống job card H04.
- 85%, 34 việc và logic phù hợp chưa đến từ AI/backend; không tính match score ở client.

### H08. Mẫu CV phù hợp

- ID `#mau-cv-de-xuat`; tám mẫu: Emerald ATS, Professional Teal, Modern Creative, Rose Impact, Executive Slate, Clean Blue, Violet Studio, Minimal Sand.
- Filter: Tất cả, Đơn giản, Chuyên nghiệp, Hiện đại, Ấn tượng, ATS.
- Auto-step `2 giây`, vòng lặp như company carousel; hiển thị 5/3/2 card.
- Filter ít mẫu có thể clone đủ track, nhưng clone không được sai `templateId`.
- Pause hover/focus/tab ẩn/reduced motion.
- Route card: `/tao-cv/chinh-sua?templateId=<id>`; “Xem tất cả” hiện cần route thật.

### H09. Ngành nghề và từ khóa phổ biến

Tám category: IT, Kinh doanh, Marketing, Tài chính, Kế toán, Nhân sự, Thiết kế, Logistics. Có 12 keyword fixture như Java, React, Sales B2B, Digital Marketing, Data Analyst, Kế toán, UI/UX, Tuyển dụng, Flutter, Product Owner, tiếng Anh, Intern.

- Keyword dùng `data-keyword` và search contract.
- Số đếm `1.4k`, `4.5k`... là fixture.
- Category anchor chưa phải route thật.
- Emoji lửa fixture phải thay bằng SVG/icon hệ thống khi production.

### H10. Footer

Bốn cột: Brand; Về EasyCV; Dành cho ứng viên; Liên hệ/trụ sở/app. Cuối footer có copyright và social.

- Link phải có destination thật trước production.
- Pháp nhân, giấy phép, địa chỉ, hotline, email phải được xác minh.
- App Store/Google Play chỉ hiển thị khi có URL phát hành.
- Social icon-only link phải có accessible name.

### H11. Widget nổi

**Floating AI:** Nút mở popover ba job fixture, có close và link đến `#viec-lam-phu-hop`; đây là UI discovery, không chứng minh AI đã tích hợp.

**View Mode Switcher:** Công cụ demo/QA có Web/Mobile, preset iPhone 16 Pro, Galaxy S24, iPhone SE, rotate/refresh. **PHẢI ẩn hoặc loại khỏi production build** nếu không có quyết định khác.

---

## 7. State và dữ liệu

### 7.1. Search state chuẩn

```ts
type HomeSearchState = {
  keyword: string;
  location: string;
  categoryKey: string;
  industryLabel: string;
};
```

Một nguồn state phải điều phối input, category modal, location picker, quick tags và URL.

### 7.2. Remote state bắt buộc khi nối API

`idle | loading | ready | empty | error`

| Section | Loading | Empty | Error |
|---|---|---|---|
| Search suggestion | Skeleton dòng | Không có gợi ý + tìm chuỗi hiện tại | Thử lại, giữ input |
| Jobs | Skeleton đúng card | Gợi ý bỏ filter/xem tất cả | Error cấp section |
| Companies | Skeleton carousel | Ẩn hoặc empty có chủ ý | Không phá section khác |
| CV | Skeleton đúng tỷ lệ | Giữ filter, báo không có | Thử lại, giữ filter |
| Banner | Placeholder đúng tỷ lệ | Ẩn cả khối | Fallback tĩnh |
| Bookmark/favorite | Disable + spinner | N/A | Rollback |

### 7.3. Fixture phải xác minh

Số job, lương/địa điểm/doanh nghiệp, hồ sơ 85%, 34 việc phù hợp, 12.500+ nhà tuyển dụng, keyword count, logo/ảnh/quyền sử dụng, thông tin pháp lý và các route CV/VIP/company/social/app.

---

## 8. Hợp đồng tương tác

### 8.1. Overlay coordination

- Mở category modal đóng search suggestion/location picker.
- Mở location picker đóng overlay cạnh tranh.
- Escape đóng lớp trên cùng; khi đóng trả focus về trigger.
- Drawer/popover cùng cấp phải có quy tắc loại trừ rõ.

### 8.2. Button và link

- Button cho action/state; link cho navigation.
- Không dùng `javascript:void(0)` hoặc `#...` trong production nếu cần route/API.
- Không gắn click lên container không focus được nếu thiếu semantics bàn phím.

### 8.3. Bookmark/favorite thật

Kiểm tra auth → disable khi pending → optimistic update có rollback → lỗi rõ → persist sau reload khi backend xác nhận.

### 8.4. Carousel

- Manual controls khi thiết kế có cung cấp.
- Pause hover/focus/`document.hidden`; dừng khi reduced motion.
- Không dịch khi người dùng thao tác bên trong.
- Clone không được tạo chuỗi tab/accessibility lặp vô hạn.

---

## 9. Responsive

Breakpoint kiểm thử: `360`, `375`, `390`, `768`, `1024`, `1440px`.

- Không horizontal scroll toàn trang.
- Header/sticky search/popup/widget không che action.
- Touch target tối thiểu `44 × 44px`.
- Pill có thể cuộn ngang bên trong.
- Job grid chuyển 3 → 2 → 1 cột.
- Company/CV carousel 5 → 3 → 2 card.
- Search được đổi layout mobile nhưng không đổi thứ tự nghiệp vụ.
- Modal/category/location nằm trọn viewport; footer không ép/tràn chữ.

---

## 10. Accessibility

- Dùng đúng `header`, `nav`, `main`, `section`, `footer`; chỉ một H1.
- Icon trang trí `aria-hidden`; icon-only button có accessible name.
- Trigger cập nhật `aria-expanded`; dialog có role/label phù hợp.
- Tab order trùng thứ tự thị giác; focus ring màu cam rõ.
- Escape đóng và trả focus; popup search dùng được bằng Enter/Escape.
- Contrast chữ thường ≥4.5:1, UI lớn ≥3:1; không dùng màu làm tín hiệu duy nhất.
- Hỗ trợ reduced motion; alt text ảnh không lặp thừa.

---

## 11. Phi chức năng

### 11.1. Hiệu năng

- Mục tiêu PRD: LCP `<1.8s`; ngưỡng chấp nhận tạm thời không quá 2.5s ở kết nối di động tốt.
- CLS `≤0.1`; banner/logo có kích thước/aspect ratio.
- Lazy-load ảnh dưới fold; không tải trước mọi ảnh carousel lớn.
- Debounce suggestion khi nối API; sticky search không gây layout shift.

### 11.2. Bảo mật/riêng tư

- Không log token, CV, hồ sơ hoặc PII.
- Đánh giá lịch sử localStorage trên máy dùng chung.
- Escape dữ liệu người dùng trước khi đưa vào `innerHTML`.
- Link ngoài mở tab mới có `rel` phù hợp.

### 11.3. Tương thích

Chrome, Edge, Safari, Firefox hiện đại; static hosting của dự án; không console error, runtime error hoặc asset 404 trong luồng chuẩn.

---

## 12. Nợ kỹ thuật cần kiểm soát

| ID | Hiện trạng | Rủi ro | Hướng xử lý |
|---|---|---|---|
| TD-01 | Nhiều CTA dùng `#...` | Hiểu nhầm route | Lập route matrix, thay URL thật |
| TD-02 | Fixture/ảnh placeholder | Sai dữ liệu/quyền ảnh | CMS/API và asset duyệt |
| TD-03 | High-salary DOM còn nhưng ẩn | Phục hồi nhầm | Giữ chú thích hoặc story xóa riêng |
| TD-04 | JS còn selector logic module đã gỡ | Dead code/regression | Refactor có test |
| TD-05 | Hai khai báo `getHistory()` | Khó bảo trì | Hợp nhất sau regression test |
| TD-06 | Count hard-code/sinh từ hash | Số giả giống thật | Thay API, gắn nhãn fixture |
| TD-07 | Bookmark chỉ UI toast | Mất trạng thái | Auth/API + rollback |
| TD-08 | VIP/AI wording vượt prototype | Niềm tin/pháp lý | Xác minh hoặc hạ claim |
| TD-09 | View Mode Switcher hiện trên trang | Tool QA lọt production | Chặn theo environment |
| TD-10 | Root/public sửa song song | Lệch phiên bản | Parity check/build mirror |

Không tự mở rộng một yêu cầu nhỏ để xử lý toàn bộ nợ; mỗi mục cần story/chỉ đạo rõ.

---

## 13. Tiêu chí nghiệm thu

### 13.1. Cấu trúc/UI

- [ ] Đúng thứ tự H01–H11.
- [ ] Không xuất hiện hero title nhìn thấy, brand strip, stats, khóa học, sự kiện, matching tabs.
- [ ] High-salary section không hiển thị/chiếm chỗ.
- [ ] Inter, `#F97316`, `#F8FAFC`, container 1250px nhất quán.
- [ ] Job logo 65px; company logo 88px desktop/76px mobile.
- [ ] Không lỗi encoding hoặc ảnh méo.

### 13.2. Search

- [ ] Search cao 60px và sticky đúng dưới header.
- [ ] Focus/click mở popup; Enter tìm; Escape đóng.
- [ ] Input rỗng có history/popular; đang gõ có suggestion động; cột phải có 5 jobs.
- [ ] Xóa một/xóa tất cả history và persist reload.
- [ ] Popup desktop căn với input, không che category trigger.
- [ ] Category modal cách search 8px; backdrop homepage trong suốt/no blur.
- [ ] Location picker có hai địa giới, clear/apply.
- [ ] URL giữ Unicode và đúng bốn query param.

### 13.3. Discovery

- [ ] Bento có slider 2 ảnh + 2 ảnh phụ; prev/next/dot/autoplay 5s/pause hover hoạt động.
- [ ] Featured filter chỉ ảnh hưởng H04; bookmark không điều hướng sai.
- [ ] Company carousel auto-step 2s, pause hover/focus/reduced motion.
- [ ] Matching không có tab cũ.
- [ ] CV filter đúng và carousel kín track.
- [ ] Keyword click dùng search contract.

### 13.4. Responsive/accessibility

- [ ] Không tràn ngang ở 360/375/390/768/1024/1440px.
- [ ] Dùng được bằng keyboard; focus ring/name/aria-expanded đúng.
- [ ] Overlay đóng bằng Escape và trả focus.
- [ ] Touch target ≥44px; reduced motion dừng autoplay không thiết yếu.
- [ ] Floating controls không che CTA/card mobile.

### 13.5. Kỹ thuật

- [ ] `node --check` thành công cho JS liên quan.
- [ ] Không console error/asset 404.
- [ ] Root/public mirror khớp sau thay đổi.
- [ ] `git diff --check` sạch.
- [ ] Không thêm framework/backend ngoài phạm vi.
- [ ] Báo cáo rõ API, fixture, route thiếu và khác biệt có chủ đích.

---

## 14. Chỉ dẫn cho Qwen 3.8 27B

```text
MỤC TIÊU
Sửa/mở rộng trang chủ ứng viên EasyCV mà không làm mất quyết định UI/UX hiện hành.

TRƯỚC KHI CODE
1. Đọc AGENTS.md và mọi AGENTS.md gần file đích.
2. Đọc PRD và toàn bộ tài liệu này.
3. Khảo sát index.html, CSS/JS và mirror public/.
4. Tra implementation artifact mới nhất của khu vực sửa.
5. Lập bảng yêu cầu -> selector/component -> file -> test.

QUY TẮC
1. Dùng stack/token hiện có; không tạo framework mới.
2. Một search state chung cho keyword/location/category/industry.
3. Không đưa danh mục nghề trở lại popup từ khóa.
4. Không phục hồi hero title, brand strip, stats, khóa học, sự kiện,
   high-salary section hoặc matching tabs.
5. Không coi fixture, anchor hoặc toast là tích hợp thật.
6. Thiếu API ghi thì không báo thành công giả.
7. Overlay có keyboard/focus/Escape/responsive containment.
8. Carousel tôn trọng reduced motion.
9. Sửa root có mirror public/ thì đồng bộ và kiểm tra parity.
10. Cập nhật .memlog.md và implementation artifact theo AGENTS.md.

KIỂM TRA
1. Syntax.
2. Desktop 1440px.
3. Tablet 768/1024px.
4. Mobile 375/390px.
5. Keyboard và reduced motion.
6. Console/404.
7. Root/public parity và git diff --check.

BÀN GIAO
- File và hành vi đã đổi.
- PRD/FR liên quan.
- Fixture/API/route còn thiếu.
- Test và kết quả.
- Rủi ro/khác biệt có chủ đích.
```

---

## 15. Kết luận

Trang chủ đã được tinh gọn thành hành trình:

```text
Tìm kiếm chủ động
→ Khám phá cơ hội nổi bật
→ Khám phá doanh nghiệp và việc phù hợp
→ Chuẩn bị CV
→ Mở rộng theo ngành/từ khóa
```

Trọng tâm tiếp theo không phải bổ sung lại mọi module cũ, mà là **nâng prototype thành sản phẩm tin cậy**: thay fixture bằng dữ liệu thật, hoàn thiện route, xác minh claim marketing, bổ sung remote state và giữ các quyết định tinh gọn đã phê duyệt.

---

## 16. Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| 1.6 | 28/09/2026 | Bản cũ mô tả cấu trúc nhiều module và trạng thái đã đăng nhập |
| 2.0 | 06/10/2026 | Viết lại theo mã hiện hành; cập nhật hero/search, category modal, bento sponsor, job/company/CV carousel; ghi nhận khối đã gỡ/ẩn; bổ sung PRD reconciliation, technical debt và contract cho Qwen 3.8 27B |
