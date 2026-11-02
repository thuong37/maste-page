// Usage: node tools/topcv/topcv-restyle.js <tag> <port> <delaySec> <part> <total>
// Kéo lại từng mẫu trong cv-plan/restyle-vi.json (liệt kê từ assets/cv-style) từ TopCV với màu mặc định + ảnh người thật xoay vòng,
// rồi ghi đè PDF cũ trong assets/cv-style (job.pdf). Chỉ ghi đè khi log xác nhận ảnh đã tải lên. Tiến độ: scratch/topcv/restyle/<tag>/summary.json.
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const [tag, port, delay, part, total] = process.argv.slice(2);
const profile = path.join(os.homedir(), '.qwen', 'topcv-profile-' + tag);
const work = path.join(REPO, 'scratch', 'topcv', process.env.RESTYLE_PLAN ? 'restyle-' + process.env.RESTYLE_PLAN : 'restyle', tag);
const dl = path.join(work, 'downloads'), finalDir = path.join(work, 'final'), summaryFile = path.join(work, 'summary.json');
const avDir = path.join(REPO, 'scratch', 'topcv', 'avatars');
const avatars = fs.readdirSync(avDir).filter((f) => /^up-.*\.png$/.test(f)).sort().map((f) => path.join(avDir, f));
fs.mkdirSync(dl, { recursive: true });
if (!fs.existsSync(path.join(profile, 'Local State'))) { console.error('Profile chưa có: ' + profile); process.exit(2); }
const planName = process.env.RESTYLE_PLAN || 'restyle-vi';
const all = JSON.parse(fs.readFileSync(path.join(__dirname, 'cv-plan', planName + '.json'), 'utf8'));
const jobs = all.map((j, i) => ({ ...j, idx: i })).filter((j) => j.idx % Number(total) === Number(part));
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
    '--port', port, '--profile', profile, '--download-dir', dl, '--final-dir', finalDir, '--out', work, '--result', res,
    '--avatar', avatars[job.idx % avatars.length], '--login-wait', '600000'], { encoding: 'utf8', timeout: 5 * 60 * 1000 });
  const log = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(work, 'last.log'), log);
  let j = null; try { j = JSON.parse(fs.readFileSync(res, 'utf8')); } catch (_) {}
  const photoOk = (/Đã tải ảnh chân dung lên/.test(log) || /Mẫu không có ô ảnh chân dung/.test(log)) && !/WARN: .*(ảnh|no_avatar)/.test(log);
  if (j && j.dest && fs.existsSync(j.dest) && photoOk) {
    // Tên file = đúng tên CV tạo trên nền tảng (j.dest, dạng {phong cách}-{mẫu}-{ngôn ngữ}); xóa file cũ (vd tiền tố ATS-) nếu khác tên.
    const newPdf = path.join(path.dirname(path.join(REPO, job.pdf)), path.basename(j.dest));
    fs.copyFileSync(j.dest, newPdf);
    if (path.resolve(newPdf) !== path.resolve(REPO, job.pdf)) fs.rmSync(path.join(REPO, job.pdf), { force: true });
    summary.ok.push({ id, pdf: path.relative(REPO, newPdf), cvId: j.cvId, deleted: j.deleted });
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
