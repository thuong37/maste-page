/**
 * Tài liệu đọc được: nội dung CV của từng nghề cần gì (mức cuối = nền CV thông thường + JD).
 *   node tools/jd/build-doc.js   ->   docs/KHO-TIEU-CHUAN/NOI-DUNG-CV-THEO-NGHE.md
 * Nguồn: assets/data/cv-content-final.json (npm run jd:match) và cv-content-standard/<id>.json (lý do, bằng chứng JD).
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const D = p => path.join(ROOT, p);
const FINAL = JSON.parse(fs.readFileSync(D('assets/data/cv-content-final.json'), 'utf8'));
const NAME = {
  'muc-tieu-nghe-nghiep': 'Mục tiêu nghề nghiệp', 'kinh-nghiem-lam-viec': 'Kinh nghiệm làm việc', 'hoc-van': 'Học vấn',
  'ky-nang-chuyen-mon': 'Kỹ năng chuyên môn', 'ky-nang-mem': 'Kỹ năng mềm', 'cong-cu-phan-mem': 'Công cụ/phần mềm',
  'chung-chi': 'Chứng chỉ', 'du-an': 'Dự án', 'thanh-tich-kpi': 'Thành tích/KPI', 'ngoai-ngu': 'Ngoại ngữ',
  'portfolio-link': 'Portfolio/liên kết', 'giai-thuong': 'Giải thưởng', 'hoat-dong-ngoai-khoa': 'Hoạt động ngoại khóa',
  'giay-phep': 'Giấy phép/bằng lái', 'thong-tin-ca-nhan-mo-rong': 'Thông tin cá nhân mở rộng', 'so-thich': 'Sở thích',
  'anh-chan-dung': 'Ảnh chân dung',
};
const ORDER = ['can', 'nen', 'tuy-chon', 'khong-can'];
const LABEL = { can: 'Cần có', nen: 'Nên có', 'tuy-chon': 'Tùy chọn', 'khong-can': 'Không cần' };
const clean = s => String(s || '').replace(/^\s*(can|nen|khong)\s*[—-]\s*/i, '').replace(/\s+/g, ' ').trim();
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

let md = `# Nội dung CV của từng nghề cần gì\n\n> Sinh bởi \`node tools/jd/build-doc.js\` (sau \`npm run jd:match\`). Không sửa tay.\n\n`;
md += `**Cách đọc.** Mức của mỗi mục = cao hơn trong (mức nền của CV thông thường, mức JD đòi hỏi), xem [CV-THONG-THUONG.md](CV-THONG-THUONG.md). JD im lặng thì giữ mức nền, nên mục JD không nhắc vẫn có thể là "Cần có" hoặc "Nên có". Chữ trong ngoặc sau tên mục là nguồn: **nền** (chỉ do chuẩn CV), **JD** (JD nâng lên), **nền+JD** (cả hai cùng mức), **chuyên gia** (Claude rà soát theo kinh nghiệm và ghi đè, kèm mức trước đó và lý do; lưu ở assets/data/cv-content-overrides.json). Với mục do JD nâng lên, có kèm lý do trích từ JD. Mục "Không cần" chỉ liệt kê tên, vì đó là mục chỉ nghề đặc thù mới dùng.\n\n`;
md += `**Độ tin cậy** theo số JD thật sự sát nghề: \`cao\` (≥5), \`vua\` (3–4), \`thap\` (≤2 hoặc nhóm "khác" tạp, chỉ tham khảo). Chưa phân biệt cấp bậc (fresher/senior).\n\n`;

const byNhom = {};
for (const f of FINAL) (byNhom[f.nhom] ||= []).push(f);
md += `## Mục lục\n\n${Object.keys(byNhom).map((n, i) => `${i + 1}. ${n} (${byNhom[n].length} nghề)`).join('\n')}\n\n`;

for (const [nhom, list] of Object.entries(byNhom)) {
  md += `## ${nhom}\n\n`;
  for (const f of list) {
    const std = JSON.parse(fs.readFileSync(D(`assets/data/cv-content-standard/${f.id}.json`), 'utf8'));
    md += `### #${f.id} ${f.nghe}\n\n`;
    md += `Độ tin cậy: **${f.doTinCay}** (${std.soJD} JD).${std.capBac ? ' Cấp bậc trong JD: ' + cut(clean(std.capBac), 160) : ''}\n\n`;
    for (const lvl of ORDER) {
      const keys = Object.keys(f.muc).filter(k => f.muc[k].mucDo === lvl);
      if (!keys.length) continue;
      if (lvl === 'khong-can') { md += `- **${LABEL[lvl]}:** ${keys.map(k => NAME[k]).join(', ')}\n`; continue; }
      md += `- **${LABEL[lvl]}:**\n`;
      for (const k of keys) {
        const m = f.muc[k];
        if (m.nguon === 'chuyen-gia') { md += `  - ${NAME[k]} (**chuyên gia**, trước đó: ${LABEL[m.truocKhiSua]}): ${m.lyDo}
`; continue; }
        const why = m.nguon !== 'nen' ? cut(clean((std.muc || {})[k]), 170) : '';
        md += `  - ${NAME[k]} (${m.nguon.replace('nen', 'nền')})${why ? ': ' + why : ''}
`;
      }
    }
    if (std.tuKhoaNenCo && std.tuKhoaNenCo.length) md += `- **Từ khóa nên có:** ${std.tuKhoaNenCo.slice(0, 14).join(', ')}\n`;
    if (std.ghiChu) md += `- **Ghi chú:** ${cut(clean(std.ghiChu), 220)}\n`;
    md += '\n';
  }
}
fs.writeFileSync(D('docs/KHO-TIEU-CHUAN/NOI-DUNG-CV-THEO-NGHE.md'), md);
console.log(`${FINAL.length} nghe, ${(md.length / 1024).toFixed(0)} KB`);
