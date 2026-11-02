/**
 * In bản tóm tắt gọn các JD đã thu thập của một/nhiều nghề để đọc và viết tiêu chuẩn CV.
 *   node tools/jd/digest.js 12            # nghề id 12
 *   node tools/jd/digest.js 12 13 14      # nhiều nghề
 *   node tools/jd/digest.js --next 4      # 4 nghề đã crawl nhưng chưa có tiêu chuẩn
 * Tín hiệu tự động (regex) được in kèm để đỡ phải đọc từng chữ.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const RAW = path.join(ROOT, 'assets', 'data', 'jd-raw');
const STD = path.join(ROOT, 'assets', 'data', 'cv-content-standard');
const LIST = JSON.parse(fs.readFileSync(path.join(__dirname, 'nghe-list.json'), 'utf8'));

const SIGNALS = {
  'chứng chỉ/bằng cấp': /chứng chỉ|chứng nhận|certificate|certified|\b(ielts|toeic|toefl|jlpt|hsk|cpa|acca|cfa|pmp|aws|pmi)\b|giấy phép|bằng cấp/i,
  'portfolio/sản phẩm': /portfolio|behance|dribbble|github|sản phẩm đã (làm|thực hiện)|demo|showreel|link (sản phẩm|dự án)/i,
  'ngoại ngữ': /tiếng anh|english|tiếng nhật|tiếng hàn|tiếng trung|ngoại ngữ|n[1-5]\b|topik|ielts|toeic/i,
  'bằng lái/phương tiện': /bằng lái|gplx|bằng [bc]\b|phương tiện (đi lại )?cá nhân|xe máy/i,
  'ngoại hình/ngày sinh/giới tính': /ngoại hình|chiều cao|cân nặng|ngoại hình|độ tuổi|\d{2}\s?[-–]\s?\d{2}\s?tuổi|nam\/nữ|\bnữ\b|\bnam\b/i,
  'KPI/số liệu thành tích': /kpi|doanh số|doanh thu|chỉ tiêu|target|roi\b|hiệu quả đạt|đạt \d+%/i,
  'dự án': /dự án|project/i,
  'công cụ/phần mềm': /excel|word|office|sap|misa|fast|photoshop|illustrator|figma|autocad|revit|sketchup|erp|crm|jira|sql|python|java|react|node|power ?bi|canva|capcut|premiere|ads\b|google analytics/i,
  'kỹ năng mềm': /giao tiếp|làm việc nhóm|teamwork|thuyết trình|đàm phán|quản lý thời gian|chịu áp lực|tư duy|linh hoạt|chủ động|trách nhiệm/i,
  'GPA/học lực/chuyên ngành': /tốt nghiệp|cao đẳng|đại học|trung cấp|chuyên ngành|gpa|sinh viên|năm cuối/i,
  'thực tập/không cần kinh nghiệm': /thực tập|không yêu cầu kinh nghiệm|chưa có kinh nghiệm|fresher|intern/i,
  'mục tiêu/định hướng': /định hướng|cầu tiến|lộ trình|phát triển (sự nghiệp|bản thân)|gắn bó/i,
};

function jdText(j) {
  const s = j.sections || {};
  return [s['Mô tả công việc'], s['Yêu cầu ứng viên'], (s['Thông tin chung'] || '')].join('\n');
}
function level(j) {
  const m = /Cấp bậc\s*\n?\s*([^\n]+)/.exec((j.sections || {})['Thông tin chung'] || '');
  return m ? m[1].trim() : '?';
}
const cut = (t, n) => (t || '').replace(/\n+/g, ' / ').slice(0, n);

function digest(id) {
  const f = path.join(RAW, id + '.json');
  if (!fs.existsSync(f)) return `#${id}: chưa crawl\n`;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const out = [`\n===== #${d.id} ${d.nhom} › ${d.nghe} — ${d.jds.length} JD${d.thin ? ' (MỎNG)' : ''} =====`];
  const cnt = {};
  d.jds.forEach((j, i) => {
    const s = j.sections || {};
    out.push(`[${i + 1}] ${j.title} | ${j.company} | cấp: ${level(j)} | ${(j.chips['Yêu cầu'] || []).join(', ')}`);
    out.push('  MT: ' + cut(s['Mô tả công việc'], 380));
    out.push('  YC: ' + cut(s['Yêu cầu ứng viên'], 650));
    const t = jdText(j);
    for (const [k, re] of Object.entries(SIGNALS)) if (re.test(t)) cnt[k] = (cnt[k] || 0) + 1;
  });
  out.push('TÍN HIỆU (số JD/' + d.jds.length + '): ' + Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join('; '));
  return out.join('\n') + '\n';
}

const args = process.argv.slice(2);
let ids = [];
if (args[0] === '--next') {
  const k = +args[1] || 4;
  ids = LIST.map(n => n.id).filter(id => fs.existsSync(path.join(RAW, id + '.json')) && !fs.existsSync(path.join(STD, id + '.json'))).slice(0, k);
  if (!ids.length) console.log('Không còn nghề nào đã crawl mà chưa phân tích.');
} else ids = args.map(Number);
ids.forEach(id => process.stdout.write(digest(id)));
