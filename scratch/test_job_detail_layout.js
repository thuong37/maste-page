const fs = require('fs');

function testHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');

  console.log(`\n=== Testing ${filePath} ===`);

  // 1. Kiểm tra tag cũ đã bị loại bỏ
  const hasPageHeaderTitle = html.includes('id="pageHeaderTitle"');
  const hasBackToGridBtn = html.includes('btn-back-to-grid');
  const hasBtnToggleFullWidth = html.includes('id="btnToggleFullWidth"');
  console.log(`[PASS 1] Tag cũ (tiêu đề + nút quay lại / xem toàn trang) đã bị xóa: ${!hasPageHeaderTitle && !hasBackToGridBtn && !hasBtnToggleFullWidth}`);

  // 2. Kiểm tra Breadcrumb nằm bên dưới box tìm kiếm
  const heroSearchPos = html.indexOf('id="heroSearchWrapper"');
  const breadcrumbTagPos = html.indexOf('<nav class="breadcrumb-nav detail-breadcrumb-below-search"');
  console.log(`[PASS 2] Thẻ nav breadcrumb nằm sau box tìm kiếm: ${breadcrumbTagPos > heroSearchPos} (heroSearch: ${heroSearchPos}, breadcrumbTag: ${breadcrumbTagPos})`);

  // 3. Kiểm tra nội dung mô tả đường dẫn breadcrumb
  const hasHomeLink = html.includes('Trang chủ');
  const hasViecLamLink = html.includes('Tìm kiếm việc làm');
  const hasCurrentSpan = html.includes('id="breadcrumbJobTitle"');
  console.log(`[PASS 3] Cấu trúc Breadcrumb đầy đủ (Trang chủ / Tìm kiếm việc làm / Job Title): ${hasHomeLink && hasViecLamLink && hasCurrentSpan}`);
}

function testJs(filePath) {
  const js = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== Testing ${filePath} ===`);

  const hasPopstateListener = js.includes("window.addEventListener('popstate'");
  const hasHistorySetup = js.includes("job_list_root") && js.includes("job_detail");
  const hasRedirectToList = js.includes("window.location.href = 'viec-lam.html'");

  console.log(`[PASS 4] Có sự kiện popstate đón nút Back của trình duyệt: ${hasPopstateListener}`);
  console.log(`[PASS 5] Có cơ chế khởi tạo root history cho phép nút Back luôn hoạt động: ${hasHistorySetup}`);
  console.log(`[PASS 6] Có điều hướng quay đầu về trang list job (viec-lam.html): ${hasRedirectToList}`);
}

testHtml('chi-tiet-viec-lam.html');
testHtml('public/chi-tiet-viec-lam.html');
testJs('js/chi-tiet-viec-lam.js');
testJs('public/js/chi-tiet-viec-lam.js');
testJs('js/viec-lam.js');
testJs('public/js/viec-lam.js');
