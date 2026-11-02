#!/usr/bin/env node
/*
 * tools/topcv/topcv-cleanup.js — liệt kê / xóa CV TẠM do công cụ tạo ra còn sót trong /quan-ly-cv.
 *   npm run topcv:cleanup               # chỉ liệt kê (dry-run)
 *   npm run topcv:cleanup -- --delete   # xóa
 * Chỉ nhận thẻ CV có tiêu đề KHỚP CHÍNH XÁC một cvName trong cv-plan/jobs.json (vd "Đơn giản-Tiêu chuẩn-Tiếng Anh").
 * CV khác của user (vd "CV Nhân viên kinh doanh") không bao giờ bị đụng tới. Dùng profile đã đăng nhập, cổng :9300.
 */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { spawn } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const doDelete = process.argv.includes('--delete');
const names = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'cv-plan', 'jobs.json'), 'utf8')).map((j) => j.cvName));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function req(n) {
  for (const b of [path.join(REPO, '.qwen', 'tmp', 'node_modules'), path.join(REPO, 'node_modules'), path.join(os.homedir(), '.qwen', 'tmp', 'node_modules'), path.join(__dirname, 'node_modules')]) {
    try { return require(require.resolve(n, { paths: [b] })); } catch (_) {}
  }
  throw new Error('thiếu ' + n);
}
(async () => {
  const puppeteer = req('puppeteer-core');
  const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
  const port = 9300, profile = path.join(os.homedir(), '.qwen', 'topcv-profile');
  const child = spawn(edge, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  let v = null;
  for (let i = 0; i < 60 && !v; i++) { try { v = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch (_) { await sleep(500); } }
  const browser = await puppeteer.connect({ browserWSEndpoint: v.webSocketDebuggerUrl, defaultViewport: null });
  const page = (await browser.pages())[0] || await browser.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.setViewport({ width: 1440, height: 900 });
  try {
    let removed = 0;
    for (let round = 0; round < 80; round++) {
      await page.goto('https://www.topcv.vn/quan-ly-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await sleep(3500);
      const cards = await page.evaluate(() => Array.from(document.querySelectorAll('.btn-download-cv')).map((b) => {
        // Đi lên tới tổ tiên NHỎ NHẤT còn chứa đúng 1 nút Tải về = thẻ của CV đó (có cả tiêu đề).
        let el = b;
        while (el.parentElement && el.parentElement.querySelectorAll('.btn-download-cv').length === 1) el = el.parentElement;
        return { id: b.getAttribute('data-cv-id'), lines: (el.innerText || '').split(String.fromCharCode(10)).map((x) => x.trim()).filter(Boolean) };
      }));
      if (round === 0 && process.argv.includes('--debug')) cards.forEach((c) => console.log('card', c.id, JSON.stringify(c.lines.slice(0, 6))));
      const mine = cards.filter((c) => c.id && c.lines.some((l) => names.has(l))).map((c) => ({ id: c.id, name: c.lines.find((l) => names.has(l)) }));
      if (round === 0) { console.log('Tổng thẻ CV: %d, CV tạm của công cụ: %d', cards.length, mine.length); mine.forEach((m) => console.log(' -', m.name, m.id)); }
      if (!doDelete || !mine.length) break;
      const target = mine[0];
      const r = await page.evaluate(async (id) => {
        const token = (document.querySelector('meta[name=csrf-token]') || {}).content;
        const res = await fetch('/delete-cv', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-TOKEN': token }, body: new URLSearchParams({ _token: token, cv_id: id }).toString() });
        return res.status;
      }, target.id);
      console.log('xóa %s (%s) → HTTP %s', target.name, target.id, r); removed++;
      await sleep(1500);
    }
    if (doDelete) console.log('Đã xóa %d CV tạm.', removed);
  } finally { try { await browser.close(); } catch (_) {} try { child.kill(); } catch (_) {} }
})().catch((e) => { console.error('LỖI:', e.message); process.exitCode = 1; });
