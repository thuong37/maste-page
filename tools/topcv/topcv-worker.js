#!/usr/bin/env node
/*
 * tools/topcv/topcv-worker.js — chạy tuần tự các job đã giao cho MỘT worker (npm run topcv:worker -- --worker W1).
 * Mỗi worker có cổng CDP, profile Edge (bản sao của profile đã đăng nhập) và thư mục tải riêng → chạy song song được.
 * Chỉ ghi vào cv-plan/state/<worker>.json của chính nó. Kết thúc in 1 dòng tóm tắt.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const plan = require('./topcv-plan.js');

const REPO = path.resolve(__dirname, '..', '..');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const W = opt('--worker');
if (!W) { console.error('Thiếu --worker W1..W4'); process.exit(2); }
const stateFile = path.join(plan.STATE_DIR, W + '.json');
const state = plan.readJson(stateFile, null);
if (!state) { console.error('Chưa có state cho ' + W + ' — chạy topcv:plan -- assign trước.'); process.exit(2); }
const jobs = plan.readJson(path.join(plan.PLAN_DIR, 'jobs.json'), []);
const byId = Object.fromEntries(jobs.map((j) => [j.id, j]));

const BASE_PROFILE = path.join(os.homedir(), '.qwen', 'topcv-profile');
const profile = path.join(os.homedir(), '.qwen', 'topcv-profile-' + W);
const work = path.join(REPO, 'scratch', 'topcv', 'workers', W);
const dlDir = path.join(work, 'downloads');
fs.mkdirSync(dlDir, { recursive: true });

function save() { plan.writeJson(stateFile, state); try { plan.status(); } catch (_) {} }

// Sao chép profile đã đăng nhập (bỏ cache nặng) cho worker này, một lần. Edge không cho 2 tiến trình dùng chung 1 user-data-dir.
if (!fs.existsSync(path.join(profile, 'Local State'))) {
  console.log(`[${W}] Sao chép profile đăng nhập...`);
  spawnSync('robocopy', [BASE_PROFILE, profile, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP',
    '/XD', 'Cache', 'Code Cache', 'GPUCache', 'GraphiteDawnCache', 'GrShaderCache', 'ShaderCache', 'Service Worker', 'BrowserMetrics', 'ProvenanceData', 'component_crx_cache', 'Extensions', 'Crashpad',
    '/XF', 'lockfile', 'SingletonLock', 'DevToolsActivePort'], { stdio: 'ignore' }); // robocopy exit<8 = OK
}

// Xuất phát lệch nhau (W1 ngay, W2 +15s, W3 +30s…) để các lần lưu CV trên cùng tài khoản không đụng nhau.
const idx = parseInt(String(W).replace(/\D/g, ''), 10) || 1;
if (idx > 1) { const ms = (idx - 1) * 15000; console.log(`[${W}] chờ ${ms / 1000}s để xuất phát lệch...`); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

let fails = 0, ok = 0, bad = 0;
for (const [id, rec] of Object.entries(state.jobs)) {
  if (rec.status === 'done') continue;
  const job = byId[id];
  if (!job) { rec.status = 'failed'; rec.error = 'job không có trong jobs.json'; save(); continue; }
  if (plan.jobHasPdf(job)) { rec.status = 'done'; rec.note = 'PDF đã có trong thư mục đích — bỏ qua'; save(); ok++; continue; }
  if (fails >= 2) break; // 2 lỗi liên tiếp: dừng, có thể hết phiên đăng nhập / TopCV chặn

  rec.status = 'running'; rec.startedAt = new Date().toISOString(); delete rec.error; save();
  const resFile = path.join(work, 'result.json');
  try { fs.rmSync(resFile, { force: true }); } catch (_) {}
  const r = spawnSync(process.execPath, [path.join(__dirname, 'topcv-create-cv.js'),
    '--template', job.slug, '--lang', job.lang,
    '--port', String(state.port), '--profile', profile, '--download-dir', dlDir,
    '--final-dir', plan.FINAL_DIR, '--out', work, '--result', resFile], { encoding: 'utf8', timeout: 5 * 60 * 1000 });
  const log = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(work, 'last.log'), log);
  const res = plan.readJson(resFile, null);
  if (r.status === 0 && res && res.dest) {
    Object.assign(rec, { status: 'done', dest: res.dest, cvId: res.cvId, deleted: res.deleted, deleteError: res.deleteError || '', finishedAt: new Date().toISOString() });
    fails = 0; ok++;
  } else if (res && res.dest && fs.existsSync(res.dest)) { // đã tải được PDF nhưng bước xóa lỗi (exit 1)
    Object.assign(rec, { status: 'done', dest: res.dest, cvId: res.cvId, deleted: res.deleted, deleteError: res.deleteError || '', finishedAt: new Date().toISOString() });
    fails = 0; ok++;
  } else {
    const line = log.split('\n').reverse().find((l) => /LỖI|Error/.test(l)) || ('exit ' + r.status);
    Object.assign(rec, { status: 'failed', attempts: (rec.attempts || 0) + 1, error: line.replace(/\s+/g, ' ').trim().slice(0, 200), finishedAt: new Date().toISOString() });
    fails++; bad++;
  }
  save();
}
const left = Object.values(state.jobs).filter((r) => r.status === 'pending' || r.status === 'running').length;
console.log(`[${W}] xong ${ok}, lỗi ${bad}, còn ${left}${fails >= 2 ? ' — DỪNG vì 2 lỗi liên tiếp (xem scratch/topcv/workers/' + W + '/last.log)' : ''}`);
process.exitCode = left && fails >= 2 ? 1 : 0;
