# 03 — Hợp đồng tích hợp vào dự án đích

## 1. Ranh giới triển khai

Trang nguồn là HTML/CSS/JS thuần, chưa có `package.json`, API client, router hoặc backend trong repository này. Qwen phải khảo sát **dự án đích** trước khi mã hóa. Giữ UI tương đương theo `01-screen-spec.md`, nhưng đặt thành component theo stack có sẵn. Nếu dự án đích chính là repository này, có thể tiếp tục dùng HTML/CSS/JS thuần.

## 2. Component đề xuất

```text
CandidateHomePage
├─ SiteHeader (Navigation, Notifications, Messages, Account, MobileDrawer)
├─ HeroSearch (KeywordInput, Suggestions, IndustryPanel, LocationPicker)
├─ EmployerSpotlight + PartnerStrip
├─ FeaturedJobs + JobCard
├─ HighSalaryJobs + HighSalaryCard
├─ FeaturedCompanies + CompanyCard
├─ VipPromotion
├─ MatchedJobs + MatchTabs + JobCard
├─ CvTemplateRecommendations (CvStyleFilters, CvTemplateCarousel, CvTemplateCard)
├─ CoursesCarousel + CourseCard
├─ Events + EventCard
├─ PopularCategoriesAndKeywords
├─ SiteFooter
└─ AiSuggestionWidget
```

Component có thể gộp/tách theo convention dự án đích; không nhân bản markup card và logic tìm kiếm.

## 3. View model tối thiểu

Các trường sau là **đề xuất hợp đồng frontend**, không khẳng định API hiện có. Qwen phải ánh xạ tới DTO thực tế của dự án đích.

| Model | Trường tối thiểu |
|---|---|
| `Job` | `id`, `slug`, `title`, `companyId`, `companyName`, `companyLogoUrl`, `salaryLabel`, `locationCodes[]`, `locationLabel`, `categoryCodes[]`, `tags[]`, `postedAt`, `isSponsored`, `isSaved`; tùy chọn `matchScore`, `matchReasons[]` |
| `Company` | `id`, `slug`, `name`, `logoUrl`, `coverUrl`, `industryLabel`, `isVerified`, `openJobCount`, `isFollowed`; với Công ty nổi bật cần thêm dữ liệu/quy tắc phía service để xác định gói hiển thị còn hiệu lực và thứ tự CMS |
| `Course` | `id`, `slug`, `title`, `imageUrl`, `categoryLabel`, `instructorLabel`, `rating`, `price`, `originalPrice`, `badgeLabel` |
| `Event` | `id`, `slug`, `title`, `startsAt`, `format`, `organizers[]`, `summary`, `registrationCount`, `registrationUrl` |
| `CvTemplate` | `id`, `name`, `previewImageUrl`, `previewAlt`, `styleCodes[]`, `isAtsFriendly`, `isNew`, `order` |
| `Banner` | `id`, `imageUrl`, `alt`, `headline`, `subline`, `sponsorLabel`, `destinationUrl`, `order` |
| `Location` | `code`, `name`, `type`, `parentCode`, `boundaryVersion` |
| `HomePayload` | `featuredJobs[]`, `highSalaryJobs[]`, `featuredCompanies[]`, `matchedJobs[]`, `cvTemplates[]`, `courses[]`, `events[]`, `categories[]`, `banners[]`, `partners[]` |

Tiền tệ/giá, ngày giờ và địa danh phải format theo `vi-VN`. URL ảnh ngoài (ví dụ Unsplash trong HTML) chỉ là fixture; ưu tiên asset nội bộ hoặc CDN được dự án đích cho phép.

## 4. Adapter dịch vụ đề xuất

Không tự tạo endpoint dưới đây nếu backend chưa có. Đây là danh sách năng lực để đối chiếu với service hiện hữu:

| Năng lực | Input | Output/trạng thái cần UI xử lý |
|---|---|---|
| Lấy nội dung trang chủ | locale, user context | `HomePayload`, loading/empty/error |
| Tìm việc | keyword, `locationCodes[]`, category, page, sort | jobs, total, page metadata |
| Gợi ý từ khóa/ngành | keyword | danh sách gợi ý, empty/error |
| Lưu/bỏ lưu việc | job ID, auth | trạng thái `isSaved`, lỗi 401/403/409/network |
| Theo dõi/bỏ theo dõi | company ID, auth | trạng thái `isFollowed`, lỗi |
| Thông báo/tin nhắn | auth, cursor | danh sách, unread count, đánh dấu đã đọc |
| Đăng ký sự kiện | event ID | xác nhận từ server, lỗi validation/trùng/hết chỗ/hết hạn |
| Gợi ý phù hợp | auth/profile | jobs và `matchScore` do backend cung cấp |
| Lấy mẫu CV | `styleCode` tùy chọn | danh sách `CvTemplate`, loading/empty/error; giữ filter khi thử lại |

Khi thiếu API, Qwen dùng fixture riêng có nhãn `demo`, không tạo thành công giả cho thao tác ghi. Link thiếu route phải được ghi trong báo cáo còn thiếu.

## 5. Route và quyền truy cập

- Trang chủ ứng viên: route hiện hành của dự án đích.
- Link card việc → route chi tiết việc; card công ty → route công ty; course/event → route tương ứng **chỉ khi đã có**.
- Card mẫu CV → `/tao-cv/chinh-sua?templateId={templateId}`; CTA “Xem tất cả” → `/tao-cv`. Ánh xạ sang router thật nếu tên route khác; không truyền toàn bộ template qua URL.
- Nếu editor yêu cầu đăng nhập, giữ route chỉnh sửa cùng `templateId` trong `returnUrl` sau khi chuyển tới auth.
- Bookmark, follow, ứng tuyển, thông báo, tin nhắn và hồ sơ dùng phiên ứng viên đã đăng nhập. Nếu phiên hết hạn, auth guard chung của hệ thống xử lý đăng nhập lại và giữ URL quay lại; trang chủ không tự chuyển sang biến thể guest.
- CTA quảng cáo/VIP phải có destination và trạng thái tài trợ rõ, không trỏ tới anchor vô nghĩa.
- Không suy ra quyền nhà tuyển dụng từ phiên ứng viên; CTA nhà tuyển dụng vẫn điều hướng tới cổng/module riêng theo cấu hình.
- Footer phải ánh xạ từng nhóm link theo `01-screen-spec.md`: route nội bộ cho nội dung/ứng viên; URL cấu hình cho cổng nhà tuyển dụng; `tel:`/`mailto:` cho liên hệ; URL chính thức cho bản đồ, kho ứng dụng và mạng xã hội. Không giữ `href="#..."` của prototype trong bản tích hợp.

## 6. Tiêu chí hoàn thành

- [ ] Cấu trúc và thứ tự H01–H14 đúng; responsive tương đương nguồn ở 360/768/1440px; không có DemoBar hoặc guest actions.
- [ ] Logo, banner nội bộ và token tải thành công; không có ảnh hỏng hoặc chữ tiếng Việt lỗi mã hóa.
- [ ] Search, địa điểm, pill ngành và tab dùng state nhất quán; có empty/loading/error rõ.
- [ ] Mọi thao tác ghi chỉ báo thành công sau phản hồi thật; trạng thái lỗi không làm mất dữ liệu người dùng.
- [ ] Link/CTA có route thật hoặc được đánh dấu rõ chưa tích hợp trong báo cáo.
- [ ] Section Đề xuất mẫu CV H09 không còn hai banner cũ; lọc đúng 6 phong cách, card mở đúng template và “Xem tất cả” mở trang tạo CV.
- [ ] Điều hướng bàn phím, focus, `Esc`, nhãn điều khiển, reduced motion hoạt động.
- [ ] Không có lỗi runtime/console hoặc request asset sai; chạy được lệnh build/test sẵn có của dự án đích.
- [ ] Báo cáo phần dùng fixture, phần nối API, route chưa có và khác biệt có chủ đích so với prototype.
