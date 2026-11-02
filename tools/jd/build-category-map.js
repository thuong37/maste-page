/**
 * Ánh xạ 164 nghề (nghe-list.json) → URL danh mục chuẩn của TopCV, suy từ các vị trí chuyên môn.
 *   node tools/jd/build-category-map.js   → assets/data/nghe-category-map.json
 * Cần chạy fetch-categories.js trước. Mỗi vị trí khớp tên bỏ phiếu cho cặp (cr,cb); chọn cặp nhiều phiếu nhất.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/topcv-category-urls.json'), 'utf8'));
const L = JSON.parse(fs.readFileSync(path.join(__dirname, 'nghe-list.json'), 'utf8'));
const byName = new Map();
C.forEach(c => { const k = fold(c.name); (byName.get(k) || byName.set(k, []).get(k)).push(c); });
const out = {}, unmapped = [], ambiguous = [];
const votesOf = (n, only) => {
  const votes = new Map();
  const add = c => { if (only && c.cr !== only) return; const k = c.cr + '/' + c.cb; votes.set(k, (votes.get(k) || 0) + 1); };
  (byName.get(fold(n.nghe)) || []).filter(c => !c.cl).forEach(add);
  n.viTri.forEach(v => (byName.get(fold(v)) || []).filter(c => c.cl).forEach(add));
  return votes;
};
// Mỗi nhóm nghề ứng với đúng một cr của TopCV: lấy cr nhiều phiếu nhất trong cả nhóm rồi chỉ xét cr đó.
const nhomCr = {};
for (const nhom of new Set(L.map(n => n.nhom))) {
  const tot = new Map();
  L.filter(n => n.nhom === nhom).forEach(n => votesOf(n).forEach((v, k) => { const cr = k.split('/')[0]; tot.set(cr, (tot.get(cr) || 0) + v); }));
  nhomCr[nhom] = +[...tot.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
for (const n of L) {
  let votes = votesOf(n, nhomCr[n.nhom]);
  if (!votes.size) votes = votesOf(n); // nghề 'Sales ...' nằm trong nhóm khác thì thuộc cr của nhóm Kinh doanh
  if (!votes.size) { unmapped.push(n); continue; }
  const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
  const [cr, cb] = ranked[0][0].split('/').map(Number);
  if (ranked.length > 1) ambiguous.push(`#${n.id} ${n.nghe}: ${ranked.map(r => r[0] + '×' + r[1]).join(', ')}`);
  const slug = fold(n.nghe).replace(/ /g, '-');
  out[n.id] = { nhomCr: nhomCr[n.nhom], cr, cb, url: `https://www.topcv.vn/tim-viec-lam-${slug}-cr${cr}cb${cb}`, votes: ranked[0][1], of: n.viTri.length + 1, conflict: ranked.length > 1 };
}
fs.writeFileSync(path.join(ROOT, 'assets/data/nghe-category-map.json'), JSON.stringify(out, null, 1));
console.log('cr theo nhóm:', JSON.stringify(nhomCr));
console.log('ánh xạ được:', Object.keys(out).length + '/' + L.length);
console.log('không có vị trí nào khớp:', unmapped.map(n => `#${n.id} ${n.nghe}`).join(' ; ') || '-');
console.log('xung đột (nhiều cặp cr/cb):', ambiguous.join('\n  ') || '-');
