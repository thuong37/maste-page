const fs = require('fs');

const css = fs.readFileSync('css/viec-lam.css', 'utf8');
const publicCss = fs.readFileSync('public/css/viec-lam.css', 'utf8');
const html = fs.readFileSync('chi-tiet-viec-lam.html', 'utf8');
const publicHtml = fs.readFileSync('public/chi-tiet-viec-lam.html', 'utf8');

console.log('=== Kiểm tra CSS Thẻ Việc Làm Liên Quan Khác & Logo 81x81 ===');

// 1. Kiểm tra logo 81x81 trong css
const has81Width = css.includes('width: 81px') || css.includes('width: 81px !important');
const has81Height = css.includes('height: 81px') || css.includes('height: 81px !important');
console.log('[PASS 1] Logo có kích thước chuẩn 81x81 trong CSS:', has81Width && has81Height);

// 2. Kiểm tra bo góc split-job-card
const hasBorderRadius = css.includes('border-radius: 14px') || css.includes('border-radius: 12px');
console.log('[PASS 2] Thẻ split-job-card có bo góc (border-radius):', hasBorderRadius);

// 3. Kiểm tra padding của feed để góc bo hiển thị đẹp
const hasFeedPadding = css.includes('padding: 12px 14px 20px 14px') || css.includes('padding: 12px 12px');
console.log('[PASS 3] Khối feed có padding hai bên để nổi bật góc bo:', hasFeedPadding);

// 4. Kiểm tra inline styles trong chi-tiet-viec-lam.html
const hasInlineCardRadius = html.includes('border-radius: 14px !important');
const hasInlineLogo81 = html.includes('width: 81px !important') && html.includes('height: 81px !important');
console.log('[PASS 4] chi-tiet-viec-lam.html có critical inline styles bo góc & logo 81x81:', hasInlineCardRadius && hasInlineLogo81);

// 5. Kiểm tra đồng bộ với public/
console.log('[PASS 5] css/viec-lam.css đồng bộ với public/css/viec-lam.css:', css === publicCss);
console.log('[PASS 6] chi-tiet-viec-lam.html đồng bộ với public/chi-tiet-viec-lam.html:', html === publicHtml);
