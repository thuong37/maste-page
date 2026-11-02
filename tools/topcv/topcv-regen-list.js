// Usage: node tools/topcv/topcv-regen-list.js <tag> <port> <delaySec> <part> <total>
// Tạo lại các PDF trong cv-plan/regen-photo.json (mẫu có ô ảnh chân dung mà PDF cũ thiếu ảnh), chia job theo chỉ số % total == part.
// PDF mới sinh vào scratch/topcv/regen/<tag>/final; chỉ khi log xác nhận ảnh đã tải lên mới ghi đè bản cũ trong assets/cv-templates
// (và bản sao ATS tương ứng). Ghi tiến độ vào scratch/topcv/regen/<tag>/summary.json, chạy lại sẽ bỏ qua job đã xong.
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(REPO, 'assets', 'cv-templates');
const [tag, port, delay, part, total] = process.argv.slice(2);
const profile = path.join(os.homedir(), '.qwen', 'topcv-profile-' + tag);
const work = path.join(REPO, 'scratch', 'topcv', 'regen', process.argv[8] || tag);
const dl = path.join(work, 'downloads');
const finalDir = path.join(work, 'final');
const summaryFile = path.join(work, 'summary.json');
fs.mkdirSync(dl, { recursive: true });
if (!fs.existsSync(path.join(profile, 'Local State'))) { console.error('Profile chưa có: ' + profile); process.exit(2); }
const jobs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cv-plan', process.argv[7] || 'regen-photo.json'), 'utf8'))
  .filter((_, i) => i % Number(total) === Number(part));
let summary = { ok: [], failed: [] };
try { summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8')); } catch (_) {}
const save = () => fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 1));
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
if (Number(delay) > 0) sleep(Number(delay) * 1000);
let fails = 0;
for (const job of jobs) {
  const id = `${job.slug}.${job.lang}`;
  if (summary.ok.some((x) => x.id === id)) continue;
  if (fails >= 3) { console.log(`[${tag}] STOP: 3 consecutive failures`); break; }
  console.log(`[${tag}] ${id}`);
  const res = path.join(work, 'result.json');
  fs.rmSync(res, { force: true });
  const r = spawnSync(process.execPath, [path.join(__dirname, 'topcv-create-cv.js'), '--template', job.slug, '--lang', job.lang,
    '--port', port, '--profile', profile, '--download-dir', dl, '--final-dir', finalDir, '--out', work, '--result', res],
  { encoding: 'utf8', timeout: 5 * 60 * 1000 });
  const log = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(work, 'last.log'), log);
  let j = null; try { j = JSON.parse(fs.readFileSync(res, 'utf8')); } catch (_) {}
  // Mẫu không có ô ảnh (vd Sinh viên 3, Tối giản 2, Basic 5) chỉ cần tạo lại đúng ngôn ngữ nên không đòi dòng 'Đã tải ảnh'.
  const photoOk = (/Đã tải ảnh chân dung lên/.test(log) || /Mẫu không có ô ảnh chân dung/.test(log)) && !/WARN: .*(ảnh|no_avatar)/.test(log);
  if (j && j.dest && fs.existsSync(j.dest) && photoOk) {
    const lang = job.langName.startsWith('Tiếng') ? job.langName : 'Tiếng ' + job.langName;
    const target = path.join(ASSETS, job.style, job.title, lang, `${job.style}-${job.title}-${lang}.pdf`);
    const ats = path.join(ASSETS, 'ATS', job.title, lang, `ATS-${job.title}-${lang}.pdf`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(j.dest, target);
    fs.mkdirSync(path.dirname(ats), { recursive: true });
    fs.copyFileSync(j.dest, ats);
    summary.ok.push({ id, target, cvId: j.cvId, deleted: j.deleted });
    summary.failed = summary.failed.filter((x) => x.id !== id);
    fails = 0;
  } else {
    fails++;
    summary.failed = summary.failed.filter((x) => x.id !== id);
    summary.failed.push({ id, reason: !photoOk ? 'ảnh chưa tải lên' : 'không có PDF', cvId: j && j.cvId, deleted: j && j.deleted });
  }
  save();
}
save();
console.log(`[${tag}] DONE ok=${summary.ok.length} failed=${summary.failed.length} notDeleted=${summary.ok.filter((x) => x.deleted === false).length}`);
