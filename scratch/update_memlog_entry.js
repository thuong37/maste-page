const fs = require('fs');
const file = '_bmad-output/planning-artifacts/.memlog.md';
let content = fs.readFileSync(file, 'utf8');

const newEntry = `- (decision) Chuyển đổi toàn diện hình ảnh trong toàn bộ website thành hình ảnh và logo thương hiệu thật của các công ty tuyển dụng:
  1. Thay thế 100% hình ảnh stock Unsplash ngẫu nhiên và text mark tạm thời thành bộ nhận diện logo vector SVG sắc nét tỷ lệ 1:1 (39 thương hiệu hàng đầu: FPT Software, Viettel, Techcombank, VNG, Zalo, Shopee, MoMo, VNPAY, MB Bank, Vinamilk, Vingroup, VinAI, VinFast, Samsung SRV, Tiki, Masan, Base.vn, One Mount, KMS Technology, Bosch, Unilever, VPBank, Gemadept, VNPT, SSI, MWG, Sun Group, VCCorp, Mai Linh, Đất Xanh, PwC, Vietcombank, Dentsu, Tân Á Đại Thành, Bee Logistics, Saigon Co.op...).
  2. Nâng cấp hình ảnh khối VIP Employer Showcase thành ảnh thực tế của tòa nhà Trung tâm Nghiên cứu & Phát triển Samsung R&D Center Hà Nội tại Khu đô thị Starlake Tây Hồ Tây (assets/banners/samsung-rd-center.jpg) và logo chính thức của Samsung SRV (assets/logos/company-samsung.svg).
  3. Cập nhật khối "Công ty nổi bật" (#cong-ty-tieu-bieu) trên trang chủ hiển thị logo ảnh thật dạng vector SVG trong khung 108px x 108px bo góc 24px sang trọng.
- (action) Cập nhật và đồng bộ 100% qua toàn bộ hệ thống tệp tin (Root ⇄ Public):
  - Khởi tạo 39 tệp SVG tại assets/logos/ và đồng bộ sang public/assets/logos/.
  - Thêm ảnh banner Samsung R&D Center tại assets/banners/samsung-rd-center.jpg và public/assets/banners/.
  - Cập nhật index.html ⇄ public/index.html (thay thế 12 logo việc làm và 8 logo thẻ công ty nổi bật).
  - Cập nhật viec-lam.html ⇄ public/viec-lam.html (thay thế 25 logo việc làm và VIP employer Samsung).
  - Cập nhật chi-tiet-viec-lam.html ⇄ public/chi-tiet-viec-lam.html (thay thế 25 logo split view và logo việc làm chi tiết).
  - Đồng bộ dataset trong js/viec-lam.js ⇄ public/js/viec-lam.js, js/home.js ⇄ public/js/home.js, js/chi-tiet-viec-lam.js ⇄ public/js/chi-tiet-viec-lam.js, js/job-detail-search.js ⇄ public/js/job-detail-search.js.
  - Cập nhật style .company-card-logo-img trong css/home.css ⇄ public/css/home.css.
  - Tạo tài liệu kỹ thuật tại _bmad-output/implementation-artifacts/real-company-logos-and-images-migration.md.
- (verification) Chạy kịch bản kiểm thử tự động Chrome CDP Headless trên cả 3 trang chính:
  - 100% logo và hình ảnh công ty nạp thành công (naturalWidth > 0), 0 ảnh lỗi (brokenCount: 0).
  - Kiểm tra SHA-256 xác nhận 8/8 cặp tệp Root ⇄ Public khớp 100%.
  - Ảnh chụp màn hình nghiệm thu: scratch/verified_homepage_real_companies.png, scratch/verified_vieclam_real_companies.png, scratch/verified_chitiet_real_companies.png, scratch/verified_cong_ty_tieu_bieu_real.png.

`;

const parts = content.split('---');
if (parts.length >= 3) {
  content = '---' + parts[1] + '---\n\n' + newEntry + parts.slice(2).join('---').replace(/^\s+/, '');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully prepended entry to .memlog.md');
} else {
  console.error('Failed to parse frontmatter in .memlog.md');
}
