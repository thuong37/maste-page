/**
 * Giai đoạn 2b + 4: gộp mức nền (cv-content-baseline.json) với kết quả JD, rồi đối chiếu nghề x template.
 * Điểm = phong cách (style nghề ưu tiên/phụ do người dùng gán, vi-tri-chuyen-mon_style_cv.csv) + nội dung (mức phủ mục cần có).
 *   node tools/jd/build-match.js
 * Đầu ra:
 *   assets/data/cv-content-final.json              mức cuối từng nghề = max(nền, JD), kèm nguồn
 *   assets/data/cv-style-mapping/nghe_template.csv nghề x mẫu: điểm, hạng, lý do
 *   docs/KHO-TIEU-CHUAN/KET-QUA-DOI-CHIEU.md       tóm tắt theo nhóm nghề
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const D = p => path.join(ROOT, p);
const BASE = JSON.parse(fs.readFileSync(D('assets/data/cv-content-baseline.json'), 'utf8')).muc;
const TPL = JSON.parse(fs.readFileSync(D('assets/data/cv-template-sections.json'), 'utf8'));
const STD = D('assets/data/cv-content-standard');
const KEYS = Object.keys(BASE);
const RANK = { 'khong-can': 0, 'tuy-chon': 1, nen: 2, can: 3 };
const NAME = Object.fromEntries(Object.entries(RANK).map(([k, v]) => [v, k]));
const WEIGHT = { can: 3, nen: 1, 'tuy-chon': 0.25, 'khong-can': 0 };
// nhóm nghề mà CV thường ngắn, thông tin gọn (lao động tay nghề, dịch vụ)
const SHORT_CV = ['Lao động phổ thông', 'Tài xế', 'Sản xuất', 'Bán lẻ', 'Nhà hàng'];
const JD2RANK = { can: 3, nen: 2, khong: 0 };
// Đánh giá chuyên gia (Claude đọc lại tài liệu nội dung CV theo nghề và chỉnh theo kinh nghiệm): ghi đè mức cuối, giữ lý do.
// Dạng: { "<id nghề>": { "<khóa mục>": { "mucDo": "can|nen|tuy-chon|khong-can", "lyDo": "..." } } }
const OVR_FILE = D('assets/data/cv-content-overrides.json');
const OVR = fs.existsSync(OVR_FILE) ? JSON.parse(fs.readFileSync(OVR_FILE, 'utf8')) : {};

// 1) mức cuối = max(nền, JD); JD im lặng thì giữ mức nền
const finals = fs.readdirSync(STD).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(STD, f), 'utf8'))).sort((a, b) => a.id - b.id).map(s => {
  const muc = {};
  for (const k of KEYS) {
    const base = RANK[BASE[k].nen];
    const jd = JD2RANK[String((s.muc || {})[k] || 'khong').split(/\s/)[0]] ?? 0;
    const lvl = Math.max(base, jd);
    muc[k] = { mucDo: NAME[lvl], nguon: jd > base ? 'JD' : jd === base && jd > 0 ? 'nen+JD' : 'nen' };
    const o = (OVR[s.id] || {})[k];
    if (o && RANK[o.mucDo] !== undefined) muc[k] = { mucDo: o.mucDo, nguon: 'chuyen-gia', truocKhiSua: NAME[lvl], lyDo: o.lyDo || '' };
  }
  return { id: s.id, nhom: s.nhom, nghe: s.nghe, doTinCay: s.doTinCay, soJD: s.soJD, muc };
});
fs.writeFileSync(D('assets/data/cv-content-final.json'), JSON.stringify(finals, null, 1));

// 2) phong cách ưu tiên/phụ của từng nghề (đã gán sẵn ở cv-style-mapping/vi-tri-chuyen-mon_style_cv.csv, theo vị trí -> lấy cặp phổ biến nhất của nghề)
function parseCsv(txt) {
  const out = []; let row = [], cur = '', inq = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (inq) { if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else inq = false; } else cur += c; }
    else if (c === '"') inq = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur.replace(/\r$/, '')); out.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); out.push(row); }
  return out;
}
const vt = parseCsv(fs.readFileSync(D('assets/data/cv-style-mapping/vi-tri-chuyen-mon_style_cv.csv'), 'utf8').replace(/^﻿/, ''));
const H = vt.shift(), col = n => H.indexOf(n);
const styleOf = {};
for (const r of vt) {
  if (!r[col('nghe')]) continue;
  const key = r[col('nhom_nghe')] + '|' + r[col('nghe')], pair = [r[col('style_uu_tien')], r[col('style_phu')], r[col('co_so')]].join('|');
  const g = (styleOf[key] ||= { n: 0, c: {} }); g.n++; g.c[pair] = (g.c[pair] || 0) + 1;
}
for (const g of Object.values(styleOf)) {
  const [pair, c] = Object.entries(g.c).sort((a, b) => b[1] - a[1])[0];
  [g.uu, g.phu, g.coSo] = pair.split('|'); g.dongThuan = +(c / g.n).toFixed(2);
}

// Mọi mẫu đều điền dữ liệu mẫu của nhân viên kinh doanh, nên không so từ khóa/nội dung, chỉ so cấu trúc mục.
// Mục mà không mẫu nào có thành mục riêng (vd kỹ năng mềm, ngoại ngữ) không phân biệt được mẫu: bỏ khỏi chấm điểm mẫu.
const PRESENT = Object.fromEntries(KEYS.map(k => [k, Object.values(TPL).filter(t => (t.muc || {})[k]).length]));
const SCORED = KEYS.filter(k => PRESENT[k] > 0), NO_TPL = KEYS.filter(k => !PRESENT[k]);
const STYLE_PTS = { uu: 60, phu: 30, khac: 0 }, CONTENT_MAX = 40;
const q = v => '"' + String(v).replace(/"/g, '""') + '"';
const rows = [['id', 'nhom', 'nghe', 'do_tin_cay_jd', 'style_nghe_uu_tien', 'style_nghe_phu', 'co_so_style', 'style_mau', 'mau', 'khop_style', 'diem', 'diem_style', 'diem_noi_dung', 'hang_trong_nghe', 'thieu_can', 'thua_hoac_nang', 'ghi_chu_mau'].join(',')];
const byNhom = {}, noStyle = [];
for (const f of finals) {
  const st = styleOf[f.nhom + '|' + f.nghe];
  if (!st) noStyle.push(f.id);
  let need = 0; for (const k of SCORED) need += WEIGHT[f.muc[k].mucDo];
  const ngan = SHORT_CV.some(g => f.nhom.startsWith(g)), m = ngan ? 2 : 1;
  const scored = Object.entries(TPL).map(([key, t]) => {
    let got = 0, pen = 0; const thieu = [], thua = [];
    for (const k of SCORED) {
      const lvl = f.muc[k].mucDo, has = !!(t.muc || {})[k];
      if (has) { got += WEIGHT[lvl]; if (lvl === 'khong-can') { pen += 0.5; thua.push(k + '(thua)'); } }
      else if (lvl === 'can') { pen += 2; thieu.push(k); }
    }
    if ((t.soTrang || 1) >= 3) { pen += 0.75 * m; thua.push('dai-3-trang'); }
    if (t.matDo === 'day') { pen += 0.5 * m; thua.push('day-dac'); }
    const anh = f.muc['anh-chan-dung'];
    if (t.coOAnh && anh.nguon === 'nen' && t.kichThuocAnh === 'lon') { pen += 0.5; thua.push('anh-lon-khong-can-nhan-manh'); }
    if (!t.coOAnh && anh.mucDo === 'can') { pen += 1; thieu.push('anh-chan-dung(JD)'); }
    const noiDung = Math.max(0, CONTENT_MAX * (got / need) - 2 * pen);
    const khop = !st ? 'khac' : t.style === st.uu ? 'uu' : t.style === st.phu ? 'phu' : 'khac';
    const dStyle = STYLE_PTS[khop];
    return { key, style: t.style, mau: t.tenMau, khop, dStyle, noiDung: +noiDung.toFixed(1), score: +(dStyle + noiDung).toFixed(1), thieu, thua, ghiChu: (t.ghiChu || '').slice(0, 120) };
  }).sort((a, b) => b.score - a.score);
  scored.forEach((s, i) => {
    rows.push([f.id, q(f.nhom), q(f.nghe), f.doTinCay, st ? st.uu : '', st ? st.phu : '', st ? st.coSo : '', s.style, q(s.mau), s.khop, s.score, s.dStyle, s.noiDung, i + 1, q(s.thieu.join(';')), q(s.thua.join(';')), q(s.ghiChu)].join(','));
    ((byNhom[f.nhom] ||= { n: 0, sum: {}, nghe: [] }).sum[s.key] = (byNhom[f.nhom].sum[s.key] || 0) + s.score);
  });
  byNhom[f.nhom].n++;
  byNhom[f.nhom].nghe.push({ id: f.id, nghe: f.nghe, tc: f.doTinCay, st, top: scored.slice(0, 3).map(s => s.mau + ' (' + s.style + ')') });
}
fs.writeFileSync(D('assets/data/cv-style-mapping/nghe_template.csv'), '﻿' + rows.join('\n'));

// 3) tóm tắt theo nhóm nghề
const thap = finals.filter(f => f.doTinCay === 'thap');
let md = `# Kết quả đối chiếu nghề × template\n\n> Sinh bởi \`node tools/jd/build-match.js\`.\n\n`;
md += `## Cách tính điểm (tối đa 100)\n\n- **Phong cách (60/30/0 điểm):** style của mẫu trùng style ưu tiên của nghề = 60, trùng style phụ = 30, khác = 0. Style ưu tiên/phụ của từng nghề do người dùng gán sẵn (\`vi-tri-chuyen-mon_style_cv.csv\`, tri thức trong [TRI-THUC-PHONG-CACH-CV-THEO-NGANH.md](../PHONG-CACH-CV/TRI-THUC-PHONG-CACH-CV-THEO-NGANH.md)); với nghề có nhiều vị trí khác style, lấy cặp phổ biến nhất. Style của mẫu lấy từ \`style_cv.csv\`.\n- **Nội dung (tối đa 40 điểm):** 40 × (trọng số các mục nghề cần mà mẫu có ÷ tổng trọng số nghề cần; cốt lõi=3, nên=1, tùy chọn=0,25), trừ 2×điểm phạt. Phạt: thiếu mục cốt lõi 2; có mục "không cần" 0,5; mẫu ≥3 trang 0,75; mẫu dày đặc 0,5; ảnh lớn khi nghề không nhấn mạnh ảnh 0,5 (hai mức phạt dài/dày nhân đôi với nhóm nghề cần CV ngắn: lao động phổ thông, tài xế, sản xuất, bán lẻ, nhà hàng). Chỉ chấm các mục mà ít nhất một mẫu có thành mục riêng (bỏ: ${NO_TPL.join(', ')}); mọi mẫu đều điền dữ liệu mẫu của nhân viên kinh doanh nên không so từ khóa. Mức mục = max(nền CV thông thường, JD), có thể bị đánh giá chuyên gia ghi đè (cv-content-overrides.json) — xem [CV-THONG-THUONG.md](CV-THONG-THUONG.md).\n- **Cách đọc:** phong cách quyết định nhóm mẫu hợp; nội dung chọn mẫu cụ thể trong nhóm đó. So hạng trong cùng một nghề, không so điểm giữa các nghề.\n- **Độ tin cậy gồm hai phần:** \`co_so_style\` (Nguồn / Suy từ nguồn / Suy luận, của việc gán style cho nghề) và \`do_tin_cay_jd\` (cao/vua/thap, của nội dung). Nghề "Suy luận" hoặc \`thap\` chỉ là gợi ý.\n\n`;
md += `## Mẫu hạng 1–3 theo từng nghề, nhóm theo nhóm nghề\n\nTrong ngoặc là style của mẫu. Chi tiết điểm từng mẫu nằm trong \`assets/data/cv-style-mapping/nghe_template.csv\`.\n\n`;
for (const [nhom, g] of Object.entries(byNhom)) {
  md += `### ${nhom} (${g.n} nghề)\n\n| # | Nghề | Style ưu tiên / phụ | Cơ sở style | Tin cậy JD | Top 3 mẫu |\n|---|---|---|---|---|---|\n`;
  for (const n of g.nghe) md += `| ${n.id} | ${n.nghe} | ${n.st ? n.st.uu + ' / ' + n.st.phu : '?'} | ${n.st ? n.st.coSo : '?'} | ${n.tc} | ${n.top.join('; ')} |\n`;
  md += '\n';
}
md += `## Cần lưu ý\n\n- Nghề độ tin cậy JD thấp (${thap.length}): ${thap.map(f => `#${f.id} ${f.nghe}`).join('; ')}.\n${noStyle.length ? `- Nghề không tìm thấy style trong CSV vị trí: ${noStyle.join(', ')}.\n` : ''}`;
fs.writeFileSync(D('docs/KHO-TIEU-CHUAN/KET-QUA-DOI-CHIEU.md'), md);
console.log(`final=${finals.length} nghe; csv=${rows.length - 1} dong; thap=${thap.length}; khongCoStyle=${noStyle.length}`);
