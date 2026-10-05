const fs = require('fs');

const entry = `
- (decision) Bỏ trạng thái neo cố định (sticky) của thanh menu điều hướng (.site-header) trên màn hình danh sách việc làm (viec-lam.html) theo đúng yêu cầu: Khi người dùng cuộn màn hình xuống, thanh menu điều hướng (Logo, Tìm việc, Hồ sơ & CV, Ứng tuyển, Avatar...) sẽ cuộn trôi tự nhiên theo trang và khuất khỏi tầm nhìn, giải phóng 73px chiều cao phương đứng giúp mở rộng tối đa không gian duyệt thẻ việc làm; đồng thời thanh tìm kiếm thông minh (.hero-search-sticky-bar) khi cuộn sẽ neo trực tiếp sát mép đỉnh trên cùng (top: 0px), các khối sidebar quảng cáo và split-view được tinh chỉnh tọa độ neo top: 145px khớp hoàn hảo ngay dưới thanh tìm kiếm.
- (action) Cập nhật và đồng bộ hóa 100% qua 6 tệp mã nguồn: viec-lam.html, public/viec-lam.html, css/viec-lam.css, public/css/viec-lam.css, js/viec-lam.js, public/js/viec-lam.js:
  1. css/viec-lam.css & public/css/viec-lam.css: Bổ sung quy tắc .site-header { position: relative !important; top: auto !important; }; chuyển --sticky-search-top mặc định về 0px; điều chỉnh .ads-sidebar-container, .split-detail-pane và .split-list-pane sang top: 145px và max-height: calc(100vh - 165px).
  2. js/viec-lam.js & public/js/viec-lam.js: Trong hàm initStickySearch(), thiết lập --sticky-search-top = '0px', lắng nghe wrapperRect.top <= 0 để kích hoạt trạng thái .is-sticky sát đỉnh màn hình.
  3. viec-lam.html & public/viec-lam.html: Bổ sung critical CSS inline cho .site-header trong <head> và nâng version cache buster lên ?v=13.0_unpin_menu.
- (verification) Chạy kịch bản kiểm thử tự động toàn diện qua Chrome Headless CDP (scratch/check_scroll.js):
  1. Trạng thái ban đầu (scrollY = 0): .site-header có position: relative, top: 0px, isSticky: false, giao diện hiển thị đầy đủ thanh menu thương hiệu EasyCV.
  2. Trạng thái cuộn xuống (scrollY = 600): .site-header cuộn trôi hoàn toàn khỏi màn hình (headerRectTop = -600px), isSticky: true neo chính xác tại top: 0px, .ads-sidebar-container neo tại top: 145px ngay dưới thanh tìm kiếm, không bị đè lấp.
  3. Chế độ Mobile (390x844): .site-header cuộn trôi khỏi màn hình (headerRectTop = -400px), thanh menu không chiếm dụng không gian dọc. Ảnh chụp minh chứng: scratch/vieclam_unpinned_menu_top.png, scratch/vieclam_unpinned_menu_scrolled.png, scratch/vieclam_unpinned_menu_mobile.png.
- (artifact) Báo cáo kỹ thuật chi tiết lưu tại _bmad-output/implementation-artifacts/unpin-menu-on-job-list-scroll.md.
`;

fs.appendFileSync('_bmad-output/planning-artifacts/.memlog.md', entry, 'utf8');
console.log('Appended to .memlog.md successfully.');
