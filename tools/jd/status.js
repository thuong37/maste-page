/**
 * Sinh docs/KHO-TIEU-CHUAN/STATUS.md - tiến độ 4 giai đoạn. Chạy: npm run jd:status
 * Không sửa tay STATUS.md. Hướng dẫn tiếp tục nằm ở docs/KHO-TIEU-CHUAN/README.md
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const LIST = JSON.parse(fs.readFileSync(path.join(__dirname, 'nghe-list.json'), 'utf8'));
const dir = (...p) => path.join(ROOT, ...p);
const has = (d, id) => fs.existsSync(path.join(dir('assets', 'data', d), id + '.json'));
const readJ = f => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);

const rows = LIST.map(n => {
  const raw = readJ(dir('assets', 'data', 'jd-raw', n.id + '.json'));
  return { ...n, crawled: !!raw, nJD: raw ? raw.jds.length : 0, thin: raw ? !!raw.thin : false, analyzed: has('cv-content-standard', String(n.id)) };
});
const groups = [...new Set(LIST.map(n => n.nhom))];
const tplFile = dir('assets', 'data', 'cv-template-sections.json');
const matchFile = dir('assets', 'data', 'cv-style-mapping', 'nghe_template.csv');
const c = rows.filter(r => r.crawled).length, a = rows.filter(r => r.analyzed).length;
const nextCrawl = rows.filter(r => !r.crawled).slice(0, 5).map(r => '#' + r.id).join(', ') || '-';
const nextAn = rows.filter(r => r.crawled && !r.analyzed).slice(0, 5).map(r => '#' + r.id).join(', ') || '-';

const md = [];
md.push('# Tiến độ kho tiêu chuẩn nội dung CV theo nghề', '', '> File sinh tự động bởi `npm run jd:status`. Không sửa tay. Cách làm tiếp: xem [README.md](README.md).', '');
md.push(`Cập nhật: ${new Date().toLocaleString('vi-VN')}`, '');
md.push('| Giai đoạn | Trạng thái |', '|---|---|');
md.push(`| 1. Thu thập JD TopCV (${LIST.length} nghề) | ${c}/${LIST.length} nghề · tiếp theo: ${nextCrawl} |`);
md.push(`| 2. Phân tích → tiêu chuẩn nội dung CV từng nghề | ${a}/${LIST.length} nghề · tiếp theo: ${nextAn} |`);
md.push(`| 3. Kiểm kê mục nội dung của 65 template | ${fs.existsSync(tplFile) ? 'XONG' : 'chưa làm'} |`);
md.push(`| 4. Đối chiếu nghề × template, xuất kết quả | ${fs.existsSync(matchFile) ? 'XONG' : 'chưa làm'} |`, '');
md.push('## Theo nhóm nghề', '', '| Nhóm nghề | Nghề | Đã crawl | Đã phân tích | JD mỏng |', '|---|---:|---:|---:|---:|');
for (const g of groups) {
  const r = rows.filter(x => x.nhom === g);
  md.push(`| ${g} | ${r.length} | ${r.filter(x => x.crawled).length} | ${r.filter(x => x.analyzed).length} | ${r.filter(x => x.thin).length} |`);
}
const thin = rows.filter(r => r.thin);
if (thin.length) md.push('', '## Nghề có ít JD sát nghề (cần crawl bổ sung hoặc ghi chú độ tin cậy thấp)', '', thin.map(r => `- #${r.id} ${r.nghe} (${r.nJD} JD)`).join('\n'));
const out = dir('docs', 'KHO-TIEU-CHUAN', 'STATUS.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, md.join('\n') + '\n');
console.log(md.slice(4, 10).join('\n'));
