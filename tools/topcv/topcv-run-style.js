// Usage: node tools/topcv/topcv-run-style.js <style> <tag> <port> <delaySec>
// Runs every not-yet-downloaded job of one style sequentially, with its own Edge port/profile/download dir.
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync } = require('child_process');
const REPO = require('path').resolve(__dirname, '..', '..');
const plan = require('./topcv-plan.js');
const [style, tag, port, delay] = process.argv.slice(2);
const BASE = path.join(os.homedir(), '.qwen', 'topcv-profile');
const profile = path.join(os.homedir(), '.qwen', 'topcv-profile-' + tag);
const work = path.join(REPO, 'scratch', 'topcv', 'workers', tag);
const dl = path.join(work, 'downloads');
fs.mkdirSync(dl, { recursive: true });
if (!fs.existsSync(path.join(profile, 'Local State'))) {
  console.log(`[${tag}] copy profile`);
  spawnSync('robocopy', [BASE, profile, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/XD', 'Cache', 'Code Cache', 'GPUCache', 'GraphiteDawnCache', 'GrShaderCache', 'ShaderCache', 'Service Worker', 'BrowserMetrics', 'ProvenanceData', 'component_crx_cache', 'Extensions', 'Crashpad', '/XF', 'lockfile', 'SingletonLock', 'DevToolsActivePort'], { stdio: 'ignore' });
}
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Number(delay) * 1000);
const jobs = plan.readJson(path.join(plan.PLAN_DIR, 'jobs.json'), []).filter((j) => j.style === style);
if (process.argv[6] === 'reverse') jobs.reverse(); // worker thứ 2 cùng phong cách đi từ cuối lên; jobHasPdf kiểm tra trước mỗi job nên hai bên gặp nhau thì dừng
const out = { ok: [], failed: [], locked: [] };
let fails = 0;
const lockedDir = path.join(REPO, 'scratch', 'topcv');
const lockedFile = path.join(lockedDir, `locked-${tag}.json`);
const readLocked = (f) => { try { return JSON.parse(fs.readFileSync(path.join(lockedDir, f), 'utf8')); } catch { return []; } };
const lockedSlugs = new Set(readLocked(`locked-${tag}.json`));
// mẫu cần nâng cấp (do mọi worker ghi nhận) được bỏ qua ngay từ đầu
const badSlugs = new Set(fs.readdirSync(lockedDir).filter((f) => /^locked-.*\.json$/.test(f)).flatMap(readLocked));
for (const job of jobs) {
  if (plan.jobHasPdf(job) || badSlugs.has(job.slug)) continue;
  if (fails >= 3) { console.log(`[${tag}] STOP: 3 consecutive failures`); break; }
  const res = path.join(work, 'result.json');
  fs.rmSync(res, { force: true });
  console.log(`[${tag}] ${job.id}`);
  const r = spawnSync(process.execPath, [path.join(__dirname, 'topcv-create-cv.js'), '--template', job.slug, '--lang', job.lang,
    '--port', port, '--profile', profile, '--download-dir', dl, '--final-dir', plan.FINAL_DIR, '--out', work, '--result', res],
    { encoding: 'utf8', timeout: 5 * 60 * 1000 });
  fs.writeFileSync(path.join(work, 'last.log'), (r.stdout || '') + (r.stderr || ''));
  const j = plan.readJson(res, null);
  if (j && j.dest && fs.existsSync(j.dest)) { fails = 0; out.ok.push({ id: job.id, dest: j.dest, cvId: j.cvId, deleted: j.deleted, deleteError: j.deleteError }); }
  else if (/tai-khoan\/nang-cap/.test((r.stdout || '') + (r.stderr || ''))) { // mẫu cần nâng cấp tài khoản: bỏ qua, không tính là lỗi
    out.locked.push(job.id); badSlugs.add(job.slug); lockedSlugs.add(job.slug);
    fs.writeFileSync(lockedFile, JSON.stringify([...lockedSlugs]));
  }
  else { fails++; out.failed.push(job.id); badSlugs.add(job.slug); }
  fs.writeFileSync(path.join(work, 'summary.json'), JSON.stringify(out, null, 1));
}
console.log(`[${tag}] DONE ok=${out.ok.length} failed=${out.failed.length} locked=${out.locked.length} notDeleted=${out.ok.filter((x) => x.deleted === false).length}`);
