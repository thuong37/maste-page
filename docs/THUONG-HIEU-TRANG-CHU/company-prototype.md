# Bản thử nghiệm Khám phá công ty và Trang chủ công ty

## Mục tiêu và kế hoạch triển khai

- Thêm hai trang HTML vào nguồn gốc và build chung, tái sử dụng header, drawer, footer, token EasyBooks và Inter.
- Tạo danh sách công ty từ dữ liệu việc làm dùng chung; bổ sung dữ liệu minh họa cho bố cục.
- Hoàn thiện tìm kiếm, lọc, sắp xếp, phân trang, theo dõi và trang chi tiết.
- Kiểm tra hành vi bằng Chrome, chụp ảnh desktop/mobile và kiểm tra đồng bộ `public/`.

## Điểm vào

- `kham-pha-cong-ty.html`: menu Việc làm → Công ty → Khám phá công ty, cả desktop và drawer mobile.
- `cong-ty.html?id=1`: hồ sơ mẫu FPT Software. Mỗi thẻ truyền ID riêng. ID sai có trạng thái không tìm thấy.

## Quy tắc dữ liệu cho Agent triển khai tiếp

- Nguồn việc làm: `window.EASYCV_JOBS` trong `js/jobs-data.js`. Giữ nguyên ID để liên kết với trang chi tiết việc làm.
- `js/companies-data.js` tạo 26 công ty từ 28 tin mẫu; gộp FPT Software Academy vào FPT Software, Tiki Tech Hub vào Tiki. FPT Digital là hồ sơ riêng.
- Đếm việc đang tuyển từ `company.jobs.length`. Điểm khớp mẫu dùng ngưỡng `aiMatch >= 85`; chưa kết nối CV thực tế.
- Bộ lọc khác nhóm kết hợp AND; nhiều lựa chọn trong cùng nhóm kết hợp OR. Tìm kiếm tên/lĩnh vực bỏ dấu, không phân biệt chữ hoa. Collection chọn một; quick filter chọn nhiều.
- Phân trang 9 công ty/trang. Đổi bộ lọc, tab hoặc sắp xếp trở về trang 1. Tab hoạt động vẫn áp dụng bộ lọc hiện tại.
- Theo dõi lưu bằng localStorage `easycv-company-follows-v1`, khởi tạo 3 công ty. Dữ liệu chia sẻ giữa danh sách và hồ sơ, đồng bộ giữa tab trình duyệt. Nếu storage không khả dụng, giữ trạng thái trong phiên và thông báo.
- Đã ứng tuyển và NTD xem CV là dữ liệu mẫu cố định, chưa phản ánh tài khoản thật.
- Quy mô, lời giới thiệu, phúc lợi, quy trình và ảnh văn hóa là minh họa. Không suy diễn năm thành lập, MST hay địa chỉ văn phòng. Chưa có dữ liệu thì hiển thị “Chưa cập nhật”. Link bản đồ là tìm kiếm công ty theo thành phố, không phải chỉ đường tới địa chỉ đã xác nhận.
- Job card dùng các class của `css/viec-lam.css` và dữ liệu chung; mở tin việc làm hiện có. Không tạo thêm luồng ứng tuyển giả.

## Cấu trúc và giới hạn

- Hai trang nguồn ở thư mục gốc; CSS riêng `css/cong-ty.css`, logic chung `js/cong-ty.js`.
- Sửa header/drawer trong partial; `tools/build.js` quản lý cả 6 trang và sinh `public/`. Không sửa bản sinh.
- Browser helper `tools/browser-session.js` đặt viewport bằng DevTools để tránh chiều rộng cửa sổ tối thiểu của Chrome headless. Cần Node có global WebSocket (Node 22+), Chrome cục bộ hoặc `CHROME_PATH`.
- Bản thử chạy phía trình duyệt, chưa có backend, đăng nhập thật, API công ty, API theo dõi hay AI matching. Chưa triển khai hosting mới.

## Kiểm tra lặp lại

```text
npm run build
npm run check
node --check js/cong-ty.js
node --check js/companies-data.js
node tools/test-companies.js
npm run verify -- kham-pha-cong-ty 1440 375
npm run verify -- cong-ty 1440 375
```

Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay cho `npm`. Ảnh chụp trong `scratch/`, không đưa vào Git. Kiểm tra bao gồm tìm kiếm, bộ lọc kết hợp, xóa bộ lọc, rỗng, phân trang, sắp xếp, theo dõi qua tải lại, các tab, menu mobile, toàn bộ hồ sơ, liên kết việc làm, lọc việc theo địa điểm/độ khớp và ID lỗi.
