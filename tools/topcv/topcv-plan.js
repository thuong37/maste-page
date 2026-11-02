#!/usr/bin/env node
/*
 * tools/topcv/topcv-plan.js — kế hoạch tổng thể + chia việc cho các worker lấy mẫu CV TopCV.
 *
 *   npm run topcv:plan -- init                      # đọc scratch/topcv/templates.json → cv-plan/jobs.json
 *   npm run topcv:plan -- assign --style "Đơn giản" [--workers 4]
 *   npm run topcv:plan -- status                    # ghi lại cv-plan/PLAN.md
 *
 * Quy tắc chống trùng việc:
 *   - Mỗi job (mẫu × ngôn ngữ) chỉ nằm trong ĐÚNG MỘT file cv-plan/state/<worker>.json (chia cố định lúc assign).
 *   - assign bỏ qua job đã `done` ở bất kỳ worker nào, hoặc đã có PDF trong thư mục đích.
 *   - Mỗi phiên chỉ 1 phong cách: assign sang phong cách khác bị từ chối khi phong cách hiện tại còn job chưa xong.
 *   - Mỗi worker chỉ ghi file state của chính nó; PLAN.md là file sinh ra (không sửa tay).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const PLAN_DIR = path.join(__dirname, 'cv-plan');
const STATE_DIR = path.join(PLAN_DIR, 'state');
const JOBS = path.join(PLAN_DIR, 'jobs.json');
const SESSION = path.join(PLAN_DIR, 'session.json');
const PLAN_MD = path.join(PLAN_DIR, 'PLAN.md');
const TEMPLATES = path.join(REPO, 'scratch', 'topcv', 'templates.json');
const FINAL_DIR = path.join(REPO, 'assets', 'cv-templates');
const MAX_ATTEMPTS = 2; // job lỗi quá số lần này thì bỏ qua (blocked), không giao lại

const safe = (x) => String(x).replace(/[<>:"/\\|?*]/g, '-').trim();
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return d; } };
const writeJson = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2)); };
const styleOf = (tags) => tags.find((t) => !/^(ATS|Harvard)$/i.test(t)) || 'Khác';

function jobDir(j) { return path.join(FINAL_DIR, safe(j.style), safe(j.title), safe(j.langName)); }
function jobHasPdf(j) {
  const d = jobDir(j);
  return fs.existsSync(d) && fs.readdirSync(d).some((f) => f.toLowerCase().endsWith('.pdf'));
}
function allStates() {
  if (!fs.existsSync(STATE_DIR)) return [];
  return fs.readdirSync(STATE_DIR).filter((f) => f.endsWith('.json')).sort().map((f) => readJson(path.join(STATE_DIR, f), null)).filter(Boolean);
}

function init() {
  const t = readJson(TEMPLATES, null);
  if (!t) throw new Error('Thiếu ' + TEMPLATES + ' — chạy: npm run topcv -- --dump-templates scratch/topcv/templates.json --port 9300');
  const jobs = [];
  for (const x of t) {
    const style = styleOf(x.tags);
    for (const l of x.langs) {
      jobs.push({
        id: `${x.slug}.${l.key}`, slug: x.slug, title: x.title, style, lang: l.key, langName: l.name,
        cvName: [style, x.title, l.name].join('-'),
      });
    }
  }
  writeJson(JOBS, jobs);
  console.log('Đã tạo %d job → %s', jobs.length, path.relative(REPO, JOBS));
}

function assign(style, nWorkers, perWorker) {
  const jobs = readJson(JOBS, null);
  if (!jobs) throw new Error('Chưa có jobs.json — chạy init trước.');
  const styles = [...new Set(jobs.map((j) => j.style))];
  if (!styles.includes(style)) throw new Error(`Phong cách "${style}" không có. Có: ${styles.join(', ')}`);

  // Mỗi vòng giao việc chỉ chạy khi vòng trước đã kết thúc (các agent đã báo xong) → pending/running còn sót là của vòng bị ngắt: xóa để giao lại.
  for (const f of fs.existsSync(STATE_DIR) ? fs.readdirSync(STATE_DIR) : []) {
    const fp = path.join(STATE_DIR, f); const st = readJson(fp, null); if (!st) continue;
    let ch = false;
    for (const [id, r] of Object.entries(st.jobs)) if (r.status === 'pending' || r.status === 'running') { delete st.jobs[id]; ch = true; }
    if (ch) writeJson(fp, st);
  }
  const states = allStates();
  const sess = readJson(SESSION, null);
  const doneIds = new Set();
  for (const s of states) for (const [id, r] of Object.entries(s.jobs)) if (r.status === 'done') doneIds.add(id);
  if (sess && sess.style !== style) {
    const left = jobs.filter((j) => j.style === sess.style && !doneIds.has(j.id) && !jobHasPdf(j));
    if (left.length) throw new Error(`Phiên hiện tại là "${sess.style}" còn ${left.length} job chưa xong. Mỗi phiên chỉ 1 phong cách — xong "${sess.style}" rồi mới sang "${style}".`);
  }
  // Job đã được giao cho worker nào đó và chưa done (pending/running/failed) thì không giao lại — tránh 2 worker cùng 1 job.
  const taken = new Set();
  for (const s of states) for (const [id, r] of Object.entries(s.jobs)) if (r.status !== 'done' && r.status !== 'failed') taken.add(id);
  // Dọn state phiên cũ (đã xong hoàn toàn) sang cv-plan/history để PLAN.md luôn chỉ nói về phiên hiện tại.
  if (sess && sess.style !== style) {
    const hist = path.join(PLAN_DIR, 'history', sess.style);
    fs.mkdirSync(hist, { recursive: true });
    for (const f of fs.readdirSync(STATE_DIR)) fs.renameSync(path.join(STATE_DIR, f), path.join(hist, f));
  }
  const attempts = {};
  for (const s of states) for (const [id, r] of Object.entries(s.jobs)) if (r.status === 'failed') attempts[id] = r.attempts || 1;
  const blocked = jobs.filter((j) => j.style === style && (attempts[j.id] || 0) >= MAX_ATTEMPTS && !jobHasPdf(j));
  const pending = jobs.filter((j) => j.style === style && !doneIds.has(j.id) && !taken.has(j.id) && !jobHasPdf(j) && (attempts[j.id] || 0) < MAX_ATTEMPTS);
  if (blocked.length) console.log('Bỏ qua %d job đã lỗi >= %d lần: %s', blocked.length, MAX_ATTEMPTS, blocked.map((j) => j.id).join(', '));
  if (!pending.length) { console.log('Không còn job pending cho "%s".', style); writeSession(style); return status(); }

  const take = pending.slice(0, nWorkers * perWorker); // mỗi vòng: mỗi worker đúng `perWorker` job (mặc định 1)
  // Job lỗi được giao lại: xóa bản ghi `failed` cũ ở mọi state (attempts đã lấy ở trên) để mỗi job chỉ ở MỘT state.
  const retry = new Set(take.map((j) => j.id));
  for (const f of fs.readdirSync(STATE_DIR)) {
    const fp = path.join(STATE_DIR, f); const st = readJson(fp, null); if (!st) continue;
    let ch = false;
    for (const id of Object.keys(st.jobs)) if (retry.has(id) && st.jobs[id].status === 'failed') { delete st.jobs[id]; ch = true; }
    if (ch) writeJson(fp, st);
  }
  const names = Array.from({ length: nWorkers }, (_, i) => `W${i + 1}`);
  names.forEach((w, i) => {
    const mine = take.slice(i * perWorker, (i + 1) * perWorker);
    if (!mine.length) return;
    const file = path.join(STATE_DIR, w + '.json');
    const old = readJson(file, null);
    const state = old || { worker: w, style, port: 9301 + i, jobs: {} };
    // Dọn job đã xong/lỗi của vòng trước khỏi state (đã được tính ở `done` qua thư mục đích) để mỗi vòng state chỉ có job của vòng đó.
    for (const [id, r] of Object.entries(state.jobs)) if (r.status === 'done') { state.history = state.history || []; state.history.push(id); delete state.jobs[id]; }
    for (const j of mine) state.jobs[j.id] = { status: 'pending', title: j.title, langName: j.langName, cvName: j.cvName, attempts: (attempts[j.id] || 0) };
    state.style = style;
    writeJson(file, state);
  });
  writeSession(style);
  console.log('Đã giao %d/%d job pending của "%s" cho %d worker (%d job/worker/vòng).', take.length, pending.length, style, nWorkers, perWorker);
  status();
}

function writeSession(style) {
  const sess = readJson(SESSION, null);
  if (!sess || sess.style !== style) writeJson(SESSION, { style, startedAt: new Date().toISOString() });
}

function status() {
  const jobs = readJson(JOBS, []);
  const sess = readJson(SESSION, null);
  const states = allStates();
  const rec = {};
  for (const s of states) for (const [id, r] of Object.entries(s.jobs)) rec[id] = { ...r, worker: s.worker };
  // Job đã xong ở các phiên trước (history) vẫn tính vào tổng thể bằng cách quét thư mục đích.
  const styles = [...new Set(jobs.map((j) => j.style))];
  const L = [];
  L.push('# Kế hoạch tổng thể lấy mẫu CV TopCV', '', '> File sinh tự động bởi `npm run topcv:plan -- status`. Không sửa tay.', '',
    `Cập nhật: ${new Date().toLocaleString('vi-VN')}  `,
    `Phiên hiện tại: **${sess ? sess.style : '(chưa bắt đầu)'}** — mỗi phiên chỉ một phong cách.  `,
    `Thư mục đích: \`assets/cv-templates/<phong cách>/<tên mẫu>/<ngôn ngữ>/<phong cách>-<tên mẫu>-<ngôn ngữ>.pdf\``, '');

  L.push('## Tổng quan theo phong cách', '', '| Phong cách | Tổng job | Đã có PDF | Còn lại | Trạng thái |', '|---|---:|---:|---:|---|');
  let T = 0, D = 0;
  for (const st of styles) {
    const js = jobs.filter((j) => j.style === st);
    const done = js.filter((j) => jobHasPdf(j)).length;
    T += js.length; D += done;
    const tag = done === js.length ? '✅ xong' : (sess && sess.style === st ? '▶ đang làm' : (done ? 'dở dang' : 'chưa làm'));
    L.push(`| ${st} | ${js.length} | ${done} | ${js.length - done} | ${tag} |`);
  }
  L.push(`| **Tổng** | **${T}** | **${D}** | **${T - D}** | |`, '');

  L.push(`## Worker — phiên "${sess ? sess.style : '-'}"`, '', '| Worker | Cổng | Giao | Xong | Lỗi | Đang chạy | Chờ |', '|---|---:|---:|---:|---:|---|---:|');
  for (const s of states) {
    const e = Object.entries(s.jobs);
    const c = (k) => e.filter(([, r]) => r.status === k).length;
    const run = e.filter(([, r]) => r.status === 'running').map(([id, r]) => `${r.title} / ${r.langName}`).join('') || '-';
    L.push(`| ${s.worker} | ${s.port} | ${e.length} | ${c('done')} | ${c('failed')} | ${run} | ${c('pending')} |`);
  }
  L.push('');

  L.push('## Chi tiết từng job của phiên hiện tại', '', '| Job | Worker | Trạng thái | Ghi chú |', '|---|---|---|---|');
  const icon = { done: '✅ done', failed: '❌ failed', running: '⏳ running', pending: '⬜ pending' };
  for (const j of jobs.filter((x) => sess && x.style === sess.style)) {
    const r = rec[j.id];
    const has = jobHasPdf(j);
    const stt = r ? (r.status === 'pending' && has ? '✅ done' : icon[r.status]) : (has ? '✅ done' : '— chưa giao');
    const note = r ? (r.error ? r.error.slice(0, 80) : (r.deleted === false && r.status === 'done' ? `CV chưa xóa khỏi TopCV, cvId=${r.cvId}` : '')) : '';
    L.push(`| ${j.title} / ${j.langName} | ${r ? r.worker : '-'} | ${stt} | ${note} |`);
  }
  L.push('');

  const open = Object.values(rec).filter((r) => r.status === 'done' && r.deleted === false);
  if (open.length) {
    L.push('## ⚠ CV còn lại trên TopCV cần xóa tay (https://www.topcv.vn/quan-ly-cv)', '');
    for (const r of open) L.push(`- ${r.cvName} — cvId \`${r.cvId}\` ${r.deleteError ? '(' + r.deleteError + ')' : ''}`);
    L.push('');
  }
  fs.mkdirSync(PLAN_DIR, { recursive: true });
  fs.writeFileSync(PLAN_MD, L.join('\n'));
  console.log('Đã ghi %s — tổng %d/%d job có PDF.', path.relative(REPO, PLAN_MD), D, T);
}

module.exports = { status, jobDir, jobHasPdf, STATE_DIR, FINAL_DIR, PLAN_DIR, readJson, writeJson, safe };

if (require.main === module) {
  const a = process.argv.slice(2);
  const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  try {
    const cmd = a[0];
    if (cmd === 'init') init();
    else if (cmd === 'assign') assign(opt('--style'), parseInt(opt('--workers', '4'), 10), parseInt(opt('--per-worker', '1'), 10));
    else if (cmd === 'status') status();
    else console.log('Dùng: init | assign --style "<phong cách>" [--workers 4] | status');
  } catch (e) { console.error('LỖI:', e.message); process.exitCode = 1; }
}
