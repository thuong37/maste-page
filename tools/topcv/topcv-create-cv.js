#!/usr/bin/env node
/*
 * tools/topcv/topcv-create-cv.js  (npm run topcv -- --template "Senior" --lang vi)
 *
 * topcv-create-cv.js — Tạo CV trên TopCV tự động (1 lệnh)
 * ------------------------------------------------------------------
 * Quy trình:
 *   1. Mở Microsoft Edge (CDP :9222, profile TẠM sạch) → user TỰ ĐĂNG NHẬP.
 *   2. Vào https://www.topcv.vn/mau-cv → chấp nhận cookie.
 *   3. Chọn "Nội dung CV mẫu TopCV gợi ý" + "Tiếng Việt".
 *   4. Click "Tạo CV".
 *   5. setViewport 1440x900 → điền Số điện thoại + Địa chỉ (Quill) → "Lưu CV".
 *   6. Vào /quan-ly-cv → click đúng nút "Tải về" (data-cv-id khớp) → modal →
 *      "Tải CV miễn phí".
 *   7. Copy PDF mới nhất trong C:\Users\Admin\Downloads về thư mục ra,
 *      kiểm chứng nội dung bằng pdf-parse (tránh tải nhầm file).
 *
 * CÁCH CHẠY (mặc định là giá trị test của Thường Nguyễn):
 *   node topcv-create-cv.js
 * Tùy chỉnh:
 *   node topcv-create-cv.js --phone "0901 234 567" --address "123 Nguyen Trai, Ha Noi" \
 *                           --position "Nhân viên kinh doanh" \
 *                           --name "Thường Nguyễn" \
 *                           --out "scratch\topcv"
 *
 * Module puppeteer-core / pdf-parse: tự tìm trong các node_modules đã biết,
 * nếu không có sẽ tự `npm install` vào thư mục của skill.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..'); // tools/topcv -> gốc repo

/* ------------------------------------------------------------------ *
 * 1) Tách tham số CLI
 * ------------------------------------------------------------------ */
// Nội dung gợi ý theo (ngôn ngữ, vị trí) — LẤY TỪ URL THẬT mà hộp "Bạn muốn tạo CV từ?" → "Nội dung CV mẫu TopCV gợi ý" → "Tạo CV" điều hướng tới.
// Mỗi ngôn ngữ có danh sách vị trí + category_id/level riêng; dùng cặp của ngôn ngữ khác sẽ bị HTTP 500 (đã gặp với cn/jp).
// Ngôn ngữ thêm vào: mở hộp, chọn ngôn ngữ + vị trí, bấm Tạo CV, đọc URL.
const LANG_CONTENT = {
  vi: { categoryId: 10001, positionSlug: 'nhan-vien-kinh-doanh', level: 3 },
  en: { categoryId: 10001, positionSlug: 'nhan-vien-kinh-doanh', level: 3 },
  cn: { categoryId: 1, positionSlug: 'nhan-vien-kinh-doanh', level: 1 },
  jp: { categoryId: 10001, positionSlug: 'nhan-vien-ban-hang', level: 1 }, // jp không có "Nhân viên kinh doanh"; cần mẫu hỗ trợ jp (vd Tiêu chuẩn)
};

function parseArgs(argv) {
  const out = {
    phone: '0901 234 567',
    address: '123 Nguyen Trai, Ha Noi',
    position: 'Nhân viên kinh doanh',
    name: 'Thường Nguyễn',
    out: path.join(REPO_ROOT, 'scratch', 'topcv'), // scratch/ đã git-ignore
    loginWaitMs: 180000, // tối đa chờ user đăng nhập (chế độ --manual-login): 3 phút
    headless: false,
    email: '',         // email Google — có sẵn + --google-password → tự đăng nhập
    googlePassword: '', // mật khẩu Google của tài khoản trên
    manualLogin: false, // --manual-login: KHÔNG tự điền, chờ user gõ tay
    profile: path.join(os.homedir(), '.qwen', 'topcv-profile'), // profile BỀN: đăng nhập 1 lần, các lần sau bỏ qua login
    positionSlug: '', categoryId: 0, level: 0, // rỗng/0 = lấy theo ngôn ngữ trong LANG_CONTENT (hoặc ghi đè bằng --position-slug/--category-id/--level)
    template: '',       // --template <slug hoặc tên mẫu> (vd default_v2, senior_v2 hoặc "Senior"); rỗng = mẫu đầu tiên trên /mau-cv
    port: 9222, downloadDir: '', finalDir: '', result: '', dumpTemplates: '',
    lang: 'vi',         // --lang vi|en|jp|cn — ngôn ngữ nội dung CV (mẫu phải hỗ trợ)
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--phone': out.phone = next(); break;
      case '--address': out.address = next(); break;
      case '--position': out.position = next(); break;
      case '--name': out.name = next(); break;
      case '--out': out.out = next(); break;
      case '--login-wait': out.loginWaitMs = parseInt(next(), 10) || out.loginWaitMs; break;
      case '--headless': out.headless = true; break;
      case '--avatar': out.avatar = next(); break; // ảnh chân dung tải lên ô ảnh của mẫu (mặc định tools/topcv/assets/avatar.png)
      case '--email': out.email = next(); break;
      case '--google-password': out.googlePassword = next(); break;
      case '--manual-login': out.manualLogin = true; break;
      case '--template': out.template = next(); break;
      case '--lang': out.lang = next(); break;
      case '--profile': out.profile = next(); break;
      case '--position-slug': out.positionSlug = next(); break;
      case '--category-id': out.categoryId = parseInt(next(), 10); break;
      case '--level': out.level = parseInt(next(), 10); break;
      case '--temp-profile': out.profile = ''; break;
      case '--verify': out.verify = true; break; // đọc PDF bằng pdf-parse kiểm tra SĐT + vị trí (chậm hơn, cần pdf-parse)
      case '--copy': out.copy = true; break;
      // Chạy song song: mỗi worker 1 cổng CDP + 1 profile + 1 thư mục tải RIÊNG (xem tools/topcv/topcv-worker.js).
      case '--port': out.port = parseInt(next(), 10) || 9222; break;
      case '--download-dir': out.downloadDir = path.resolve(next()); /* path.resolve: Edge trên Windows báo "Download error" nếu đường dẫn dùng dấu / */ break; // Edge tải PDF vào đây (CDP Browser.setDownloadBehavior) thay vì ~/Downloads
      case '--final-dir': out.finalDir = next(); break;       // chuyển PDF vào <final>/<phong cách>/<tên mẫu>/<ngôn ngữ>/
      case '--result': out.result = next(); break;            // ghi kết quả JSON vào file này (mặc định <out>/topcv-last-result.json)
      case '--dump-templates': out.dumpTemplates = next(); break; // ghi metadata 73 mẫu ra file rồi thoát     // copy thêm 1 bản PDF vào --out
      case '--keep-cv': out.keepCv = true; break; // không xóa CV khỏi /quan-ly-cv sau khi tải
      default: break;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 2) Resolve module (puppeteer-core, pdf-parse) — tự cài nếu thiếu
 * ------------------------------------------------------------------ */
const SKILL_DIR = __dirname; // tools/topcv
const MODULE_CANDIDATES = [
  path.join(REPO_ROOT, '.qwen', 'tmp', 'node_modules'),
  path.join(REPO_ROOT, 'node_modules'),
  path.join(os.homedir(), '.qwen', 'tmp', 'node_modules'),
  path.join(SKILL_DIR, 'node_modules'),
  path.join(os.tmpdir(), 'node_modules'),
];

function resolveModule(name) {
  for (const base of MODULE_CANDIDATES) {
    try {
      return require(require.resolve(name, { paths: [base] }));
    } catch (_) { /* thử candidate kế tiếp */ }
  }
  return null;
}

function ensureModule(name) {
  let mod = resolveModule(name);
  if (mod) return mod;
  console.log(`[setup] Không tìm thấy ${name}, đang npm install vào skill...`);
  fs.mkdirSync(path.join(SKILL_DIR, 'node_modules'), { recursive: true });
  const r = spawnSync('npm', ['install', '--no-save', '--no-audit', '--no-fund', name], {
    cwd: SKILL_DIR, stdio: 'inherit', shell: process.platform === 'win32',
  });
  if (r.status !== 0) throw new Error(`npm install ${name} thất bại`);
  mod = resolveModule(name);
  if (!mod) throw new Error(`Vẫn không resolve được ${name} sau khi cài`);
  return mod;
}

/* ------------------------------------------------------------------ *
 * 3) Tiện ích
 * ------------------------------------------------------------------ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T0 = Date.now();
const log = (...a) => console.log(`[topcv +${((Date.now() - T0) / 1000).toFixed(1)}s]`, ...a);

const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const edgePath = EDGE_PATHS.find((p) => fs.existsSync(p));
let OUT_DIR = os.tmpdir();
let DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');

// Strip dấu tiếng Việt để so khớp text button (đ + dấu nguyên âm).
// BẮT BUỘC String(s) — textContent có thể trả về Node hoặc undefined.
function makeNorm() {
  return (s) => String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const NORM_FN = makeNorm();
// Nhúng được gọi trong pg.evaluate (browser context) — KHÔNG dùng closure của node.
const NORM_FN_SRC = `(s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9 ]/g, ' ').replace(/\\s+/g, ' ').trim()`;

async function httpJson(url) {
  const res = await fetch(url);
  return res.json();
}

/* ------------------------------------------------------------------ *
 * 4) Chạy trình duyệt
 * ------------------------------------------------------------------ */
async function launchEdge(puppeteer, persistentProfile, port = 9222, downloadDir = '') {
  if (!edgePath) throw new Error('Không tìm thấy Microsoft Edge.exe');
  // Dọn profile tạm lần chạy trước để luôn có session sạch → user tự đăng nhập.
  const profile = persistentProfile || path.join(os.tmpdir(), 'topcv-cv-profile-' + Date.now());
  log('Mở Edge CDP tại :%d (profile tạm %s)...', port, path.basename(profile));
  const child = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore' });

  // Chờ CDP sẵn sàng.
  let version = null;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try { version = await httpJson(`http://127.0.0.1:${port}/json/version`); break; }
    catch (_) { await sleep(500); }
  }
  if (!version) { child.kill(); throw new Error('CDP :' + port + ' không khởi động được'); }
  log('WebRTC/UA: %s', version.Browser);

  const browser = await puppeteer.connect({
    browserWSEndpoint: version.webSocketDebuggerUrl,
    defaultViewport: null,
  });
  if (downloadDir) {
    fs.mkdirSync(downloadDir, { recursive: true });
    const cdp = await browser.target().createCDPSession();
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir });
  }
  const page = (await browser.pages())[0] || await browser.newPage();
  return { browser, page, child, profile, temp: !persistentProfile };
}

/* ------------------------------------------------------------------ *
 * 5) Các bước trên trang
 * ------------------------------------------------------------------ */
// Chờ user đăng nhập: URL rời trang login HOẶC thấy avatar/username ở header.
async function waitForLogin(page, timeoutMs) {
  const started = Date.now();
  log('CHỜ BẠN ĐĂNG NHẬP TAY (gõ email + mật khẩu vào cửa sổ Edge) — tối đa %ds...', timeoutMs / 1000);
  while (Date.now() - started < timeoutMs) {
    const url = page.url();
    const isAuthed = await page.evaluate(() => {
      // Header TopCV hiện avatar khi đã đăng nhập.
      const av = document.querySelector('.user-avatar, [class*="avatar"], .menu-user img, .header-avatar');
      const notAuth = /\/(dang-nhap|login|auth)/i.test(location.href);
      return !!av && !notAuth;
    }).catch(() => false);
    if (isAuthed) { log('✓ Đã đăng nhập.'); return; }
    await sleep(2500);
  }
  throw new Error('Hết thời gian chờ đăng nhập.');
}

// Tự đăng nhập TopCV QUA GOOGLE (đã chạy thành công 2026-07-21).
// Flow: /login → accept cookie → click #login-width-google → tab popup
// accounts.google.com → gõ email + Next → chờ field password → gõ + Enter
// → chờ redirect về topcv.vn (URL không còn /login + có avatar/đăng xuất).
//
// BÀI HỌC QUAN TRỌNG (không được bỏ qua):
//  - Nút Google dùng Google Identity Services (handleGoogleLogin →
//    window.google.accounts.id.initialize({ux_mode:"popup"})) — popup mở
//    BẤT ĐỒNG BỘ, có thể bị race. KHÔNG dùng 1 lần browser.waitForTarget
//    (thua race thường xuyên); PHẢI poll browser.pages() tìm tab
//    accounts.google và RETRY click (tối đa 3 lần) nếu chưa mở.
//  - MUST dùng mouse.click THẬT vào nút (tọa độ ~720,247 @1440×900) — click
//    JS el.click() kém ổn định hơn cho popup GSI.
//  - Mật khẩu Google khác mật khẩu TopCV. Google báo "Wrong password" → hỏi user, đừng đoán.
//  - Gõ password: waitForSelector('input[type="password"]',{visible:true})
//    trước, click field, Ctrl+A + Delete xóa autofill, keyboard.type + Enter.
//    (Đã kiểm chứng keyboard.type giữ nguyên '@' — không cần input.value.)
//  - Đăng nhập TopCV trực tiếp (email + pass) BỊ reCAPTCHA chặn → Google là
//    đường đi đúng.
async function googleLogin(browser, page, { email, password, timeoutMs = 60000 }) {
  log('→ Tự đăng nhập bằng Google: %s', email);
  await page.goto('https://www.topcv.vn/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(4000);
  await acceptCookies(page);
  await sleep(1000);

  // Tọa độ nút Google: ưu tiên id #login-width-google, fallback text "google".
  const googleBtn = await page.evaluate(() => {
    const byId = document.querySelector('#login-width-google');
    if (byId && byId.offsetHeight > 0) {
      const r = byId.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    for (const el of Array.from(document.querySelectorAll('a, button, [role="button"]'))) {
      if (norm(el.innerText || '').includes('google') && el.offsetHeight > 0) {
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });
  if (!googleBtn) throw new Error('Không tìm thấy nút "Đăng nhập bằng Google"');

  // Poll browser.pages() + retry click (popup GSI mở bất đồng bộ).
  const findGooglePage = async () => {
    try {
      for (const p of await browser.pages()) {
        try { if (p.url().includes('accounts.google')) return p; } catch (_) {}
      }
    } catch (_) {}
    return null;
  };
  let googlePage = null;
  for (let attempt = 0; attempt < 3 && !googlePage; attempt++) {
    await page.mouse.click(googleBtn.x, googleBtn.y);
    log('Click nút Google lần %d tại (%d,%d)', attempt + 1, Math.round(googleBtn.x), Math.round(googleBtn.y));
    const gStart = Date.now();
    while (Date.now() - gStart < 15000 && !googlePage) {
      await sleep(700);
      googlePage = await findGooglePage();
      if (!googlePage && page.url().includes('accounts.google')) googlePage = page;
    }
  }
  if (!googlePage) throw new Error('Không mở được tab Google OAuth (đã thử 3 lần)');
  log('✓ Tab Google: %s', googlePage.url().slice(0, 70));
  await googlePage.setViewport({ width: 1440, height: 900 });
  await sleep(2000);
  await googlePage.waitForSelector('input[type="email"], input[name="identifier"], input[type="password"]', { timeout: 15000 })
    .catch(() => log('⚠ Form Google chưa load hẳn, tiếp tục...'));
  await sleep(1500);

  // Bước 1: email (nếu thấy field) — nếu không thì là account chooser, click tài khoản.
  const gEmailBox = await googlePage.evaluate(() => {
    const el = document.querySelector('input[type="email"], input[name="identifier"], input[aria-label*="email" i]');
    if (!el || el.offsetHeight === 0) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (gEmailBox) {
    await googlePage.mouse.click(gEmailBox.x, gEmailBox.y); await sleep(300);
    await googlePage.keyboard.down('Control'); await googlePage.keyboard.press('a'); await googlePage.keyboard.up('Control');
    await googlePage.keyboard.press('Delete'); await sleep(200);
    await googlePage.keyboard.type(email, { delay: 25 });
    log('Đã gõ email Google.');
    await sleep(500);
    const next1 = await googlePage.evaluate(() => {
      const btn = document.querySelector('#identifierNext button, button[aria-label="Next"], #identifierNext');
      if (btn) { const r = btn.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }
      const nb = Array.from(document.querySelectorAll('button')).find((b) => {
        const l = (b.getAttribute('aria-label') || '').toLowerCase();
        const t = (b.innerText || '').toLowerCase().trim();
        return (l.includes('next') || t === 'next' || t === 'tiếp theo') && b.offsetHeight > 0;
      });
      if (nb) { const r = nb.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }
      return null;
    });
    if (next1) await googlePage.mouse.click(next1.x, next1.y);
    else await googlePage.keyboard.press('Enter');
    log('Đã submit email.');
    await sleep(3000);
  } else {
    const acc = await googlePage.evaluate((em) => {
      const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      for (const el of Array.from(document.querySelectorAll('div, button, a, [role="button"]'))) {
        if (norm(el.innerText || '').includes(em) && el.offsetHeight > 0) {
          const r = el.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
      }
      return null;
    }, email);
    if (acc) { await googlePage.mouse.click(acc.x, acc.y); log('Đã click tài khoản trên chooser.'); await sleep(3000); }
  }

  // Bước 2: chờ field password HIỆN RA, xóa autofill, gõ + Enter.
  const passFound = await googlePage.waitForSelector('input[type="password"], #passwordNext', { timeout: 20000, visible: true }).catch(() => null);
  if (passFound) {
    const pb = await googlePage.evaluate(() => {
      const el = document.querySelector('input[type="password"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await googlePage.mouse.click(pb.x, pb.y); await sleep(300);
    await googlePage.keyboard.down('Control'); await googlePage.keyboard.press('a'); await googlePage.keyboard.up('Control');
    await googlePage.keyboard.press('Delete'); await sleep(200);
    await googlePage.keyboard.type(password, { delay: 25 });
    await googlePage.keyboard.press('Enter');
    log('Đã gõ password Google + Enter.');
    await sleep(4000);
  } else {
    log('⚠ Không thấy field password (Google có thể đã tự sign-in hoặc hiện trang 2FA/block).');
  }

  // Chờ redirect về TopCV (URL rời /login + có avatar/đăng xuất).
  log('Chờ Google redirect về TopCV...');
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(2000);
    const url = page.url();
    if (url.includes('topcv.vn') && !url.includes('login') && !url.includes('dang-nhap')) {
      const ok = await page.evaluate(() => {
        const av = document.querySelector('.user-avatar, [class*="avatar"], .menu-user img, .header-avatar, [class*="user"] img');
        const logout = Array.from(document.querySelectorAll('a, button, span')).find((e) => (e.innerText || '').toLowerCase().includes('đăng xuất'));
        return !!(av || logout);
      }).catch(() => false);
      if (ok) { log('✓ ĐĂNG NHẬP THÀNH CÔNG QUA GOOGLE! URL: %s', url); return; }
    }
    // Bắt lỗi Google (Wrong password / 2FA / block) để báo user đúng hướng.
    try {
      const gUrl = googlePage.url();
      if (gUrl && gUrl.includes('accounts.google')) {
        const body = (await googlePage.evaluate(() => (document.body && document.body.innerText || '').slice(0, 300)).catch(() => '')) || '';
        if (/wrong password/i.test(body)) throw new Error('Google báo "Wrong password" — mật khẩu Google SAI, cần user cung cấp mật khẩu Google đúng.');
        if (/2-step|2fa|verify|verification code|unusual/i.test(body)) log('⚠ Google đang yêu cầu xác minh (2FA/unusual sign-in): %s', body.replace(/\s+/g, ' ').slice(0, 160));
      }
    } catch (e) {
      if (e.message && e.message.includes('Wrong password')) throw e;
    }
  }
  throw new Error('Hết thời gian chờ Google redirect về TopCV.');
}

// Click button theo text khớp chính xác (đã strip dấu). Trả về tọa độ để click chuột thật.
async function findClickableByText(page, normalizedText, { includeSpans = false } = {}) {
  return page.evaluate((norm, target, useSpans) => {
    const n = new Function('return ' + norm)();
    const sel = useSpans ? 'button, a, [role="button"], label, span, div' : 'button, a, [role="button"], label';
    for (const el of Array.from(document.querySelectorAll(sel))) {
      const t = n(el.innerText || el.textContent || '');
      if (t === target && el.offsetHeight > 0 && el.offsetWidth > 0) {
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, text: (el.innerText || '').trim().slice(0, 40) };
      }
    }
    return null;
  }, NORM_FN_SRC, normalizedText, includeSpans);
}

// Click bằng chuột thật (điều hướng + click).
async function mouseClick(page, x, y) {
  await page.mouse.move(x, y);
  await sleep(200);
  await page.mouse.click(x, y);
}

// Chấp nhận cookie.
async function acceptCookies(page) {
  const done = await page.evaluate((norm) => {
    const n = new Function('return ' + norm)();
    for (const el of Array.from(document.querySelectorAll('button, a, [role="button"]'))) {
      if (n(el.innerText || '') === 'chap nhan tat ca') { el.click(); return true; }
    }
    return false;
  }, NORM_FN_SRC);
  log('Cookie banner: %s', done ? 'đã chấp nhận' : 'không có (OK)');
}

// Trên /mau-cv (danh sách 73 mẫu): click "Dùng mẫu" của mẫu đầu → mở editor CV.
// KHÔNG click "Dùng mẫu" bằng toạ độ: nút chỉ hiện khi hover và click không điều hướng ổn định
// (đã gặp: URL đứng yên ở /mau-cv). Editor luôn ở https://www.topcv.vn/viet-cv/<slug>
// (slug = template_name của ảnh thẻ, vd default_v2, default_junior) → goto thẳng.
async function selectTemplateAndLanguage(page, cfgExtra) {
  // Đọc metadata mọi mẫu từ data-template của nút "Dùng mẫu" (name=slug, title, tags, available_languages).
  const all = await page.evaluate(() => Array.from(document.querySelectorAll('a.btn-use-now'))
    .map((a) => { try { return JSON.parse(a.getAttribute('data-template')); } catch (_) { return null; } })
    .filter(Boolean)
    .map((t) => ({ name: t.name, title: t.title, tags: t.tags || [], langs: (t.available_languages || []).map((l) => ({ key: l.key, name: l.name })) })));
  if (!all.length) throw new Error('Không đọc được danh sách mẫu trên /mau-cv (a.btn-use-now[data-template]).');

  // Tìm mẫu: khớp slug trước, rồi khớp CHÍNH XÁC tên hiển thị (bỏ dấu, không phân biệt hoa thường).
  // Không khớp gần đúng: "Senior" ≠ "Senior 2".
  const want = cfgExtra.template;
  let tpl;
  if (!want) tpl = all[0];
  else {
    tpl = all.find((t) => t.name === want) || all.find((t) => NORM_FN(t.title) === NORM_FN(want));
    if (!tpl) {
      log('Không có mẫu "%s". Các mẫu hiện có:', want);
      for (const t of all) log('  %s  —  %s  [%s]', t.name, t.title, t.tags.join(', '));
      throw new Error('Không tìm thấy mẫu: ' + want);
    }
  }
  const langMeta = tpl.langs.find((l) => l.key === cfgExtra.lang);
  if (!langMeta) throw new Error(`Mẫu "${tpl.title}" không hỗ trợ lang=${cfgExtra.lang}. Hỗ trợ: ${tpl.langs.map((l) => l.key).join(', ')}`);
  // Phong cách = tag đầu tiên không phải ATS/Harvard (Đơn giản, Hiện đại, Chuyên nghiệp, Ấn tượng).
  const style = tpl.tags.find((t) => !/^(ATS|Harvard)$/i.test(t)) || '';
  const cvName = [style, tpl.title, langMeta.name].filter(Boolean).join('-');
  log('Mẫu: %s (%s) | phong cách: %s | ngôn ngữ: %s → tên CV: "%s"', tpl.name, tpl.title, style || '-', langMeta.name, cvName);

  // URL mà nút "Tạo CV" trong hộp "Bạn muốn tạo CV từ?" (Dùng mẫu → "Nội dung CV mẫu TopCV gợi ý") điều hướng tới.
  // type=content_library nạp sẵn nội dung gợi ý theo vị trí (category_id/slug/level); lang=<vi|en|jp|cn>.
  // BẮT BUỘC mở bằng "Nội dung CV mẫu TopCV gợi ý" (type=content_library): mẫu trống thiếu gần hết thông tin và TopCV không cho lưu.
  const dflt = LANG_CONTENT[cfgExtra.lang];
  if (!dflt) throw new Error(`lang=${cfgExtra.lang} chưa có trong LANG_CONTENT. Hỗ trợ: ${Object.keys(LANG_CONTENT).join(', ')}`);
  const content = {
    categoryId: cfgExtra.categoryId || dflt.categoryId,
    positionSlug: cfgExtra.positionSlug || dflt.positionSlug,
    level: cfgExtra.level || dflt.level,
  };
  const q = new URLSearchParams({
    type: 'content_library', ta_source: 'CVPreviewModalInTemplateHome', lang: cfgExtra.lang,
    category_id: String(content.categoryId), slug: content.positionSlug, level: String(content.level),
  });
  const url = `https://www.topcv.vn/viet-cv/${tpl.name}?${q}`;
  log('Mở editor mẫu "%s": %s', tpl.name, url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  return { slug: tpl.name, cvName, style, title: tpl.title, langName: langMeta.name };
}

async function clickCreateCv(page) {
  // Editor tải bằng JS — chờ có .ql-editor (Quill) hoặc ô [cvo-form-field] (mẫu kiểu cũ như classic_1) thay vì sleep cố định.
  log('Chờ editor CV load...');
  await dismissRestoreDialog(page);
  await page.waitForSelector('.ql-editor, [cvo-form-field][contenteditable="true"]', { timeout: 30000 })
    .catch(() => { throw new Error('Editor không load (không thấy .ql-editor / [cvo-form-field]), URL: ' + page.url()); });
  await sleep(2000);
}

// Modal "Bạn có dữ liệu chưa lưu từ lần viết CV trước... khôi phục không?" chặn editor
// → luôn bấm "Không" / "Bỏ qua" (muốn editor sạch theo mẫu).
async function dismissRestoreDialog(page) {
  for (let i = 0; i < 6; i++) {
    const pos = await page.evaluate(() => {
      const ok = /khoi phuc|du lieu chua luu/i.test((document.body.innerText || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'));
      if (!ok) return null;
      const b = Array.from(document.querySelectorAll('button, a.btn')).find((x) => /^(Không|Bỏ qua)$/.test(x.innerText.trim()) && x.offsetHeight > 0);
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (pos) { await mouseClick(page, pos.x, pos.y); log('Đã bấm "Không/Bỏ qua" ở hộp khôi phục dữ liệu cũ.'); await sleep(1500); return; }
    await sleep(500);
  }
}

// Click chuột theo toạ độ có thể trượt sang ô khác (bố cục dịch sau scrollIntoView / ô quá nhỏ) → chữ gõ vào sai mục
// (vd email rơi vào tiêu đề "Mục tiêu nghề nghiệp" ở mẫu Hiện đại 5). Sau click, nếu focus không nằm trong ô đích (đánh dấu data-tc-cur) thì focus thẳng bằng JS.
async function ensureFocusOnTarget(page, what) {
  const fixed = await page.evaluate(() => {
    const el = document.querySelector('[data-tc-cur]');
    if (!el) return null;
    el.removeAttribute('data-tc-cur');
    const a = document.activeElement;
    if (a === el || el.contains(a)) return false;
    el.focus();
    const sel = window.getSelection(); // đặt con trỏ ở cuối ô
    if (sel && el.isContentEditable) { const rg = document.createRange(); rg.selectNodeContents(el); rg.collapse(false); sel.removeAllRanges(); sel.addRange(rg); }
    return true;
  });
  if (fixed) log('Click trượt ô "%s" — đã focus lại đúng ô bằng JS.', what);
}

// Mẫu có ô ảnh chân dung (#cvo-profile-avatar): để trống thì khi lưu TopCV bỏ luôn mục ảnh khỏi CV → luôn tải ảnh mẫu (tools/topcv/assets/avatar.png) lên.
// Luồng: bấm ảnh → hộp "Chỉnh sửa ảnh đại diện" → nạp file vào input ẩn #cvoFormImageFile → cropper hiện → bấm "Xong" (button.btn-save-image).
// Trình soạn thảo CV Builder kiểu mới (Basic 3, Tiêu chuẩn, Thanh lịch…): ảnh là <img src=".../default-avatar…png"> trong .resize-class.
// Luồng: bấm ảnh → nút "Sửa ảnh" (.btn-show-popup-edit-image) → hộp "Cập nhật ảnh đại diện": nạp file vào input#uploads (hộp đã mở nên có tác dụng)
// → hiện "Đổi ảnh" (.modal-edit-image__btn-sm) → bấm "Hoàn tất" (button.modal-edit-image__btn.bg-primary) → src ảnh đổi khỏi default-avatar.
// Trả về null nếu mẫu không có ảnh kiểu này.
async function uploadAvatarV2(page, img) {
  const isDefault = "(x) => /default-avatar|no_avatar/.test(x.currentSrc || x.src || '') && x.offsetHeight > 60";
  const pos = await page.evaluate((fnSrc) => {
    const f = new Function('return ' + fnSrc)();
    const i = Array.from(document.querySelectorAll('img')).find(f);
    if (!i) return null;
    i.scrollIntoView({ block: 'center' });
    const r = i.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, isDefault);
  if (!pos) return null;
  if (!fs.existsSync(img)) { log('WARN: thiếu ảnh chân dung %s — CV sẽ mất mục ảnh.', img); return false; }
  const click = async (fn) => {
    const p = await page.evaluate(fn);
    if (!p) return false;
    await mouseClick(page, p.x, p.y);
    return true;
  };
  await mouseClick(page, pos.x, pos.y);
  await sleep(1500);
  const editPos = () => { const b = Array.from(document.querySelectorAll('.btn-show-popup-edit-image')).find((x) => x.offsetHeight); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  if (!(await click(editPos))) { log('WARN: không thấy nút "Sửa ảnh" của ảnh đại diện.'); return false; }
  await sleep(2500);
  const input = await page.$('#uploads');
  if (!input) { log('WARN: không thấy ô tải ảnh #uploads.'); return false; }
  await input.uploadFile(img);
  let ready = false;
  for (let i = 0; i < 20 && !ready; i++) { await sleep(500); ready = await page.evaluate(() => !!Array.from(document.querySelectorAll('.modal-edit-image__btn-sm')).find((x) => x.offsetHeight)); }
  if (!ready) { log('WARN: cropper ảnh đại diện không hiện.'); return false; }
  await sleep(1000);
  const donePos = () => { const b = Array.from(document.querySelectorAll('button.modal-edit-image__btn')).find((x) => x.classList.contains('bg-primary') && x.offsetHeight); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  if (!(await click(donePos))) { log('WARN: không thấy nút "Hoàn tất" của hộp ảnh đại diện.'); return false; }
  for (let i = 0; i < 16; i++) {
    await sleep(500);
    const src = await page.evaluate(() => { const e = Array.from(document.querySelectorAll('#cvb-section-content img, .resize-class img')).find((x) => x.offsetHeight > 60); return e ? (e.currentSrc || e.src || '') : ''; });
    if (src && !/default-avatar|no_avatar/.test(src)) { log('Đã tải ảnh chân dung lên.'); await sleep(1000); return true; }
  }
  log('WARN: bấm "Hoàn tất" nhưng ô ảnh vẫn là ảnh mặc định — CV sẽ mất mục ảnh.');
  return false;
}

async function uploadAvatar(page, cfg) {
  const img = cfg.avatar || path.join(SKILL_DIR, 'assets', 'avatar.png');
  const pos = await page.evaluate(() => {
    const el = document.querySelector('#cvo-profile-avatar');
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return r.height > 0 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  });
  if (!pos) {
    const v2r = await uploadAvatarV2(page, img);
    if (v2r !== null) return v2r;
    log('Mẫu không có ô ảnh chân dung — bỏ qua.');
    return false;
  }
  if (!fs.existsSync(img)) { log('WARN: thiếu ảnh chân dung %s — CV sẽ mất mục ảnh.', img); return false; }
  const saveBtn = () => page.evaluate(() => {
    const b = document.querySelector('button.btn-save-image');
    if (!b || !b.offsetHeight) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await mouseClick(page, pos.x, pos.y);
  await sleep(2000);
  // Input ẩn #cvoFormImageFile nạp thẳng KHÔNG kích hoạt cropper (bấm "Xong" khi đó chỉ đóng hộp, ảnh không vào CV) → phải chọn file qua hộp thoại của nút "a.btn-choose-image".
  const [chooser] = await Promise.all([
    page.waitForFileChooser({ timeout: 8000 }).catch(() => null),
    page.evaluate(() => { const a = document.querySelector('a.btn-choose-image'); if (a) a.click(); }),
  ]);
  if (!chooser) { log('WARN: không mở được hộp chọn ảnh (a.btn-choose-image).'); return false; }
  await chooser.accept([img]);
  // Cropper dựng xong khi có .cropper-container trong hộp; chỉ khi đó "Xong" mới ghi ảnh vào CV.
  let ready = false;
  for (let i = 0; i < 20 && !ready; i++) { await sleep(500); ready = await page.evaluate(() => !!document.querySelector('.cropper-container') && !!document.querySelector('button.btn-save-image')?.offsetHeight); }
  if (!ready) { log('WARN: cropper ảnh đại diện không hiện.'); return false; }
  await sleep(1500);
  const btn = await saveBtn();
  if (!btn) { log('WARN: không thấy nút "Xong" của hộp ảnh đại diện.'); return false; }
  await mouseClick(page, btn.x, btn.y);
  // Thành công = ô ảnh không còn là no_avatar.jpg.
  for (let i = 0; i < 16; i++) {
    await sleep(500);
    const src = await page.evaluate(() => { const e = document.querySelector('#cvo-profile-avatar'); return e ? (e.currentSrc || e.src || '') : ''; });
    if (src && !/no_avatar/.test(src)) { log('Đã tải ảnh chân dung lên.'); await sleep(1000); return true; }
  }
  log('WARN: bấm "Xong" nhưng ô ảnh vẫn là no_avatar — CV sẽ mất mục ảnh.');
  return false;
}

// Mỗi ô Quill có thuộc tính data-placeholder ổn định (vd "0123 456 789", "Quận A, thành phố Hà Nội",
// "Vị trí ứng tuyển") → tìm theo placeholder, KHÔNG theo thứ tự/label (khác nhau giữa các mẫu).
// Chỉ điền ô đang TRỐNG (.ql-blank) — mẫu có nội dung sẵn thì giữ nguyên. Click chuột thật + keyboard.type.
async function fillByPlaceholder(page, reSrc, value, what) {
  const pos = await page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const n = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    // Mẫu kiểu cũ (classic_1…) không có Quill: ô là span contenteditable có fieldkey + cvo-placeholder, trống khi innerText rỗng.
    const cvo = Array.from(document.querySelectorAll('[cvo-form-field][contenteditable="true"]')).filter((e) => !e.innerText.trim());
    for (const el of [...document.querySelectorAll('.ql-editor.ql-blank'), ...cvo]) {
      const hay = el.matches('.ql-editor') ? [el.getAttribute('data-placeholder')] : [el.getAttribute('cvo-placeholder'), el.getAttribute('fieldkey')];
      if (!hay.some((h) => re.test(n(h)))) continue;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      if (r.height > 0) { el.dataset.tcCur = '1'; return { x: r.x + Math.min(r.width / 2, 120), y: r.y + r.height / 2 }; }
    }
    return null;
  }, reSrc);
  if (!pos) { log('WARN: không có ô trống "%s" (mẫu có thể đã điền sẵn).', what); return false; }
  await mouseClick(page, pos.x, pos.y);
  await sleep(300);
  await ensureFocusOnTarget(page, what);
  await page.keyboard.type(value, { delay: 15 });
  log('Đã điền %s: %s', what, value);
  return true;
}

// Trường bắt buộc điền được suy ra từ lỗi khi bấm "Lưu CV" (xem saveWithAutofill) — không điền mù.
async function fillQuillFields(page, cfg) {
  await dismissRestoreDialog(page);
  await uploadAvatar(page, cfg);
  // Mọi mẫu đã thử đều bắt buộc SĐT + địa chỉ → điền sẵn (chỉ ô đang TRỐNG) để khỏi tốn 1 vòng Lưu chỉ để đọc toast lỗi.
  // Vòng lặp đọc toast trong saveWithAutofill vẫn giữ làm dự phòng cho mẫu bắt buộc thêm trường khác.
  let n = 0;
  for (const [, ph, key, label] of REQUIRED_MAP.slice(0, 2)) if (await fillByPlaceholder(page, ph, cfg[key], label)) n++;
  // Commit Quill + chờ state của editor cập nhật: bấm Lưu ngay sau khi gõ thì TopCV vẫn báo thiếu địa chỉ.
  // Mẫu kiểu cũ (không Quill) không hiện toast báo thiếu email → điền sẵn nếu ô email đang trống (mẫu Quill không có ô khớp thì bỏ qua).
  if (await fillByPlaceholder(page, '^email$|tencuaban', cfg.email || 'nvthuong2709@gmail.com', 'Email')) n++;
  if (n) { await page.mouse.click(20, 450); await sleep(1500); }
  n += await fillRemainingBlanks(page, cfg);
  await replaceBrandText(page);
}

// Bước cuối khi điền: mọi ô soạn thảo còn chữ "TopCV" (nội dung mẫu gợi ý) → bôi đen từng cụm rồi gõ đè "EasyCV".
async function replaceBrandText(page) {
  let done = 0;
  for (let i = 0; i < 40; i++) {
    const hit = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.ql-editor, [cvo-form-field][contenteditable="true"]'));
      for (const el of els) {
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          const m = /top[ ]*cv/i.exec(n.nodeValue);
          if (!m) continue;
          el.scrollIntoView({ block: 'center' });
          el.focus();
          const r = document.createRange();
          r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
          const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
          return n.nodeValue.slice(Math.max(0, m.index - 20), m.index + 25);
        }
      }
      return null;
    });
    if (!hit) break;
    await page.keyboard.type('EasyCV', { delay: 15 });
    log('Đã đổi "TopCV" → "EasyCV": …%s…', hit);
    done++;
  }
  if (done) { await page.mouse.click(20, 450); await sleep(1500); }
  return done;
}

// Mọi ô còn TRỐNG sau nội dung gợi ý (ngoài SĐT/địa chỉ/email bắt buộc) cũng phải được điền, nếu không CV lưu ra sẽ có mục trống.
// Giá trị: trường quen thuộc lấy từ cfg; còn lại dùng chính chữ gợi ý (placeholder) của ô — đó là nội dung mẫu TopCV hiển thị.
// Duyệt lặp (DOM đổi sau mỗi lần gõ), mỗi ô chỉ thử một lần (khóa = placeholder + chỉ số) để không lặp vô hạn.
const BLANK_VALUE_MAP = [
  [/ho (va )?ten|full name|氏名|姓名/, 'name'],
  [/vi tri ung tuyen|position|job title|职位|職種/, 'position'],
  [/email|tencuaban/, 'email'],
  [/0123 456 789|so dien thoai|^phone$|電話|电话/, 'phone'],
  [/quan a|dia chi|^address$|A区|住所|地址/, 'address'],
];
const SAMPLE_TEXT = [
  // [regex theo ngữ cảnh/placeholder đã bỏ dấu, { vi, en, jp, cn }] — chữ điền phải CÙNG ngôn ngữ với CV (cfg.lang).
  [/giao tiep|communicat/, { vi: 'Giao tiếp rõ ràng, thuyết phục; đàm phán và xử lý từ chối khách hàng hiệu quả.', en: 'Clear and persuasive communication; negotiates and handles customer objections effectively.', jp: '明確で説得力のあるコミュニケーションができ、顧客の異議にも効果的に対応・交渉します。', cn: '沟通表达清晰、有说服力，能够有效进行谈判并处理客户异议。' }],
  [/lam viec nhom|teamwork|team/, { vi: 'Phối hợp tốt với các bộ phận Marketing, Kế toán, Kho vận để hoàn thành mục tiêu chung.', en: 'Works well with the Marketing, Accounting and Logistics teams to achieve shared goals.', jp: 'マーケティング、経理、物流の各部門と連携し、共通の目標を達成します。', cn: '与市场、财务、物流等部门配合良好，共同完成目标。' }],
  [/giai quyet van de|problem/, { vi: 'Phân tích nguyên nhân và đưa ra phương án xử lý nhanh các khiếu nại, phát sinh đơn hàng.', en: 'Analyzes root causes and quickly resolves customer complaints and order issues.', jp: '原因を分析し、顧客からのクレームや受注上のトラブルに迅速に対応します。', cn: '分析问题原因，快速处理客户投诉和订单突发问题。' }],
  [/quan ly thoi gian|time/, { vi: 'Lập kế hoạch ngày/tuần, ưu tiên công việc hợp lý, luôn hoàn thành đúng hạn.', en: 'Plans daily and weekly work, prioritizes sensibly and always meets deadlines.', jp: '日次・週次の計画を立て、優先順位を適切に付け、常に期限内に業務を完了します。', cn: '制定每日和每周工作计划，合理安排优先级，始终按时完成工作。' }],
  [/tin hoc|computer|office/, { vi: 'Thành thạo Word, Excel, PowerPoint và các phần mềm CRM quản lý khách hàng.', en: 'Proficient in Word, Excel, PowerPoint and CRM software for customer management.', jp: 'Word、Excel、PowerPointおよび顧客管理用のCRMソフトを使いこなせます。', cn: '熟练使用Word、Excel、PowerPoint及客户管理CRM软件。' }],
  [/ngoai ngu|language|english|tieng anh/, { vi: 'Tiếng Anh giao tiếp tốt, đọc hiểu tài liệu chuyên ngành (tương đương IELTS 6.0).', en: 'Good English communication; able to read industry documents (about IELTS 6.0).', jp: '英語での日常会話が得意で、専門資料も読解できます（IELTS 6.0相当）。', cn: '英语沟通良好，能阅读专业资料（相当于雅思6.0）。' }],
  [/ky nang|skill/, { vi: 'Giao tiếp và đàm phán tốt, làm việc nhóm hiệu quả, quản lý thời gian và sử dụng thành thạo tin học văn phòng.', en: 'Strong communication and negotiation, effective teamwork, time management and office software skills.', jp: '交渉力・コミュニケーション力に優れ、チームワーク、時間管理、オフィスソフトの操作に習熟しています。', cn: '沟通与谈判能力强，团队协作高效，善于时间管理并熟练使用办公软件。' }],
  [/thanh tich|giai thuong|achievement|award/, { vi: 'Đạt danh hiệu Nhân viên xuất sắc năm, vượt chỉ tiêu doanh số 120% trong 3 quý liên tiếp.', en: 'Named Employee of the Year; exceeded sales targets by 120% for 3 consecutive quarters.', jp: '年間優秀社員に選出され、3四半期連続で売上目標を120%達成しました。', cn: '荣获年度优秀员工，连续三个季度超额完成120%的销售指标。' }],
  [/so thich|hobby|interest/, { vi: 'Đọc sách, chạy bộ, du lịch và tìm hiểu công nghệ mới.', en: 'Reading, running, traveling and exploring new technology.', jp: '読書、ランニング、旅行、新しいテクノロジーの探求。', cn: '阅读、跑步、旅行和了解新技术。' }],
  [/muc tieu|objective|goal/, { vi: 'Phát triển nghề nghiệp ổn định, đóng góp giá trị cho doanh nghiệp và không ngừng nâng cao chuyên môn.', en: 'To build a stable career, contribute value to the company and keep improving my expertise.', jp: '安定したキャリアを築き、企業に価値を提供しながら専門性を高め続けたいと考えています。', cn: '发展稳定的职业生涯，为企业创造价值，并不断提升专业能力。' }],
  [/du an|project/, { vi: 'Triển khai chương trình bán hàng mới, tăng doanh thu khu vực 25% trong 6 tháng.', en: 'Launched a new sales program that grew regional revenue by 25% in 6 months.', jp: '新しい販売施策を実施し、6か月で担当地域の売上を25%伸ばしました。', cn: '推行新的销售方案，6个月内使区域营业额增长25%。' }],
  [/mo ta|description|detail/, { vi: 'Chịu trách nhiệm phát triển khách hàng mới, chăm sóc khách hàng hiện tại và đạt chỉ tiêu doanh số được giao.', en: 'Responsible for developing new customers, caring for existing ones and meeting assigned sales targets.', jp: '新規顧客の開拓と既存顧客のフォローを担当し、割り当てられた売上目標を達成しました。', cn: '负责开发新客户、维护现有客户，并完成分配的销售目标。' }],
];
// Vị trí / địa chỉ mặc định theo ngôn ngữ CV (chỉ áp khi user không truyền --position/--address).
const LANG_DEFAULTS = {
  vi: { position: 'Nhân viên kinh doanh', address: '123 Nguyen Trai, Ha Noi' },
  en: { position: 'Sales Executive', address: '123 Nguyen Trai, Ha Noi' },
  jp: { position: '営業担当', address: '東京都千代田区丸の内1-1-1' },
  cn: { position: '销售专员', address: '河内市阮廌街123号' },
};
// Thương hiệu: mọi chữ "TopCV" trong nội dung CV phải đổi thành "EasyCV" (chữ tự gõ qua brand(), chữ có sẵn của mẫu qua replaceBrandText).
const brand = (t) => String(t || '').replace(/top[ ]*cv/gi, 'EasyCV');
async function fillRemainingBlanks(page, cfg) {
  const values = { name: cfg.name, position: cfg.position, email: cfg.email || 'nvthuong2709@gmail.com', phone: cfg.phone, address: cfg.address };
  let filled = 0;
  for (let i = 0; i < 80; i++) {
    // Đánh dấu ô đã thử bằng thuộc tính DOM (chỉ số trong danh sách đổi sau mỗi lần điền nên không dùng làm khóa).
    // ctx = chữ của ô soạn thảo đứng ngay trước (vd tên kỹ năng "Kỹ năng làm việc nhóm") để chọn nội dung mẫu đúng mục.
    const target = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('.ql-editor, [cvo-form-field][contenteditable="true"]'));
      for (let idx = 0; idx < all.length; idx++) {
        const el = all[idx];
        const blank = el.matches('.ql-editor') ? el.classList.contains('ql-blank') : !el.innerText.trim();
        if (!blank || el.dataset.tcTried) continue;
        const ph = (el.matches('.ql-editor') ? el.getAttribute('data-placeholder') : (el.getAttribute('cvo-placeholder') || el.getAttribute('fieldkey'))) || '';
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        if (r.height <= 0 || r.width <= 0) continue;
        el.dataset.tcTried = '1';
        el.dataset.tcCur = '1';
        const ctx = idx > 0 ? (all[idx - 1].innerText || '').trim() : '';
        return { ph, ctx, x: r.x + Math.min(r.width / 2, 120), y: r.y + r.height / 2 };
      }
      return null;
    });
    if (!target) break;
    const strip = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); // giữ chữ CJK để khớp regex cn/jp
    const phN = strip(target.ph);
    const hit = BLANK_VALUE_MAP.find(([re]) => re.test(phN));
    // Chữ gợi ý kiểu "Mô tả kỹ năng" chỉ là hướng dẫn → điền nội dung mẫu thật theo từ khóa (ưu tiên theo ctx); không khớp mới dùng chính chữ gợi ý.
    const sample = SAMPLE_TEXT.find(([re]) => re.test(strip(target.ctx))) || SAMPLE_TEXT.find(([re]) => re.test(phN));
    const value = hit ? values[hit[1]] : sample ? (sample[1][cfg.lang] || sample[1].vi) : target.ph.replace(/\s*(\.{3}|…)\s*$/, '').trim();
    if (!value) { log('WARN: ô trống không có chữ gợi ý để điền (bỏ qua): %s', target.ph); continue; }
    await mouseClick(page, target.x, target.y);
    await sleep(300);
    await ensureFocusOnTarget(page, target.ph.slice(0, 40));
    await page.keyboard.type(brand(value), { delay: 10 });
    log('Đã điền ô trống "%s" [%s]: %s', target.ph.slice(0, 40), target.ctx.slice(0, 30), value.slice(0, 60));
    filled++;
  }
  if (filled) { await page.mouse.click(20, 450); await sleep(1500); }
  return filled;
}

// Bấm "Lưu CV" thử: nếu TopCV báo thiếu trường bắt buộc (toast đỏ "Vui lòng bổ sung số điện thoại / địa chỉ…")
// thì điền đúng các trường đó rồi bấm lại (tối đa 4 vòng). Phần còn lại của CV giữ nguyên nội dung mẫu gợi ý.
const REQUIRED_MAP = [
  // [regex trên text lỗi đã bỏ dấu, regex placeholder ô Quill, key trong cfg, nhãn]
  // Placeholder đổi theo ngôn ngữ mẫu: vi "0123 456 789"/"Quận A, thành phố Hà Nội", en "Address", cn "A区，河内市", jp "電話"/"住所".
  [/so dien thoai/, '0123 456 789|so dien thoai|^電話$|^phone$', 'phone', 'Số điện thoại'],
  [/dia chi/, 'quan a|dia chi|^address$|A区|^住所$', 'address', 'Địa chỉ'],
  [/email/, 'tencuaban|email', 'mail', 'Email'],
  [/vi tri/, 'vi tri ung tuyen', 'position', 'Vị trí ứng tuyển'],
  [/ho (va )?ten/, 'ho ten', 'name', 'Họ tên'],
];

async function readErrorToast(page) {
  return page.evaluate(() => {
    const e = Array.from(document.querySelectorAll('.el-message--error')).find((x) => x.offsetHeight);
    return e ? e.innerText.replace(/\s+/g, ' ').trim() : '';
  });
}

// Hộp "Lưu ý: Một số mục trong CV của bạn chưa có nội dung: <mục>…" (vd mẫu cn thiếu "Dự án") chặn trước hộp đặt tên.
// Bấm "Lưu CV, tôi sẽ hoàn thiện sau" (nút cam) — KHÔNG bấm "Hoàn thiện tiếp". Không có hộp này → thoát ngay khi vào /save-cv-success (hoặc sau ~2s).
async function confirmIncompleteSections(page) {
  for (let i = 0; i < 8; i++) {
    // Trang có thể điều hướng sang /save-cv-success ngay giữa lúc evaluate ("Execution context was destroyed") = đã lưu xong.
    const pos = await page.evaluate(() => {
      // Nút cam không chắc là <button>/<a> → quét mọi phần tử, lấy phần tử NHỎ nhất có đúng chữ (tránh trúng container).
      const b = Array.from(document.querySelectorAll('button, a, div, span')).filter((x) => x.offsetHeight && /^Lưu CV, tôi sẽ hoàn thiện sau$/.test((x.innerText || '').trim()))
        .sort((x, y) => x.getBoundingClientRect().width * x.getBoundingClientRect().height - y.getBoundingClientRect().width * y.getBoundingClientRect().height)[0];
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }).catch((e) => { if (/context was destroyed|navigation|detached/i.test(e.message)) return 'nav'; throw e; });
    if (pos === 'nav') { await sleep(1000); return false; }
    if (pos) { await mouseClick(page, pos.x, pos.y); log('Đã bấm "Lưu CV, tôi sẽ hoàn thiện sau" (một số mục chưa có nội dung).'); await sleep(800); return true; }
    if (page.url().includes('save-cv-success')) return false; // đã lưu xong, không có hộp "Lưu ý"
    await sleep(250);
  }
  return false;
}

async function saveWithAutofill(page, cfg, cvName) {
  const values = { phone: cfg.phone, address: cfg.address, position: cfg.position, name: cfg.name, mail: cfg.email || 'nvthuong2709@gmail.com' };
  for (let round = 1; round <= 4; round++) {
    await dismissRestoreDialog(page); // hộp "Lần tạo mới CV cuối cùng chưa được lưu" có thể hiện lại và chặn nút Lưu CV
    await page.evaluate(() => window.scrollTo(0, 0));
    const pos = await page.evaluate(() => {
      const sb = document.querySelector('button.btn-save-cv, #btn-save-cv'); // #btn-save-cv: mẫu kiểu cũ (classic_1…) dùng div
      if (!sb || !sb.offsetHeight) return null;
      const r = sb.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (!pos) throw new Error('Không tìm thấy nút "Lưu CV" (button.btn-save-cv / #btn-save-cv)');
    await mouseClick(page, pos.x, pos.y);
    log('Vòng %d: đã click "Lưu CV".', round);
    await sleep(1500);
    const err = await readErrorToast(page);
    if (!err) {
      // Trang có thể điều hướng (đã lưu) đúng lúc đang evaluate → lỗi "context was destroyed" không phải thất bại thật.
      try { await nameCvIfAsked(page, cvName); }
      catch (e) { if (/context was destroyed|navigation|detached|Target closed/i.test(e.message)) { log('Trang điều hướng giữa chừng (%s) — coi như đã lưu, kiểm tra tiếp.', e.message.slice(0, 60)); await sleep(1500); } else throw e; }
      return;
    }
    log('Lỗi bắt buộc: %s', err);
    const errN = NORM_FN(err);
    let filled = 0;
    for (const [re, ph, key, label] of REQUIRED_MAP) {
      if (re.test(errN) && await fillByPlaceholder(page, ph, values[key], label)) filled++;
    }
    await page.mouse.click(20, 450); // commit Quill
    if (!filled) throw new Error('Có lỗi bắt buộc nhưng không điền được ô nào: ' + err);
    await sleep(2500); // chờ toast lỗi tắt
  }
  throw new Error('Vẫn còn lỗi bắt buộc sau 4 vòng: ' + (await readErrorToast(page)));
}

// Sau "Lưu CV" TopCV hỏi "Đặt tên cho CV của bạn" (Quay lại | Tiếp tục). Điền tên + Tiếp tục.
// Bấm xong, TopCV tự lưu CV và TỰ TẢI PDF về (modal "CV sẽ tự động tải xuống sau 0s").
async function nameCvIfAsked(page, cvName) {
  // Hộp có thể hiện chậm (mẫu kiểu cũ gọi ajax trước) → chờ tới ~6s thay vì kiểm tra đúng một lần.
  let inputPos = null;
  for (let i = 0; i < 12 && !inputPos; i++) {
    if (i) await sleep(500);
    inputPos = await page.evaluate(() => {
      const modal = Array.from(document.querySelectorAll('.modal, [role=dialog], .el-dialog')).find((m) => m.offsetHeight && /Đặt tên cho CV|nhập tiêu đề CV/i.test(m.innerText)); // "nhập tiêu đề CV": hộp của mẫu kiểu cũ (classic_1…)
      if (!modal) return null;
      const inp = modal.querySelector('input[type=text], input:not([type])');
      if (!inp) return { noInput: true };
      const r = inp.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
  }
  if (!inputPos) { log('Không có hộp đặt tên CV.'); return; }
  if (!inputPos.noInput) {
    await mouseClick(page, inputPos.x, inputPos.y);
    await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control');
    await page.keyboard.type(cvName, { delay: 15 });
    log('Đã đặt tên CV: %s', cvName);
  }
  const btn = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button, a.btn')).find((x) => x.offsetHeight && x.innerText.trim() === 'Tiếp tục'); // a.btn: mẫu kiểu cũ
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (!btn) throw new Error('Không thấy nút "Tiếp tục" ở hộp đặt tên CV');
  // TopCV chặn tạo CV liên tiếp trên cùng tài khoản (POST /create-cv → {"status":"failed","error":"Bạn vừa tạo CV thành công, vui lòng thử lại sau ít phút."}),
  // hay gặp khi 2 luồng chạy song song. Hộp đặt tên vẫn mở → chờ rồi bấm "Tiếp tục" lại, tối đa 6 lần.
  let createErr = null;
  const onResp = async (r) => {
    if (r.request().method() !== 'POST' || !/\/create-cv$/.test(r.url().split('?')[0])) return;
    try { const j = await r.json(); createErr = j && j.status === 'failed' ? String(j.error || 'failed') : null; } catch (_) {}
  };
  page.on('response', onResp);
  const clickContinue = async () => {
    const pos = await page.evaluate(() => {
      const bt = Array.from(document.querySelectorAll('button, a.btn')).find((x) => x.offsetHeight && x.innerText.trim() === 'Tiếp tục');
      if (!bt) return null;
      const r = bt.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (!pos) return false;
    await mouseClick(page, pos.x, pos.y);
    return true;
  };
  await mouseClick(page, btn.x, btn.y);
  log('Đã bấm "Tiếp tục" — chờ TopCV lưu CV.');
  try {
    for (let attempt = 1; attempt <= 6; attempt++) {
      createErr = null;
      await confirmIncompleteSections(page); // hộp "Lưu ý: một số mục chưa có nội dung" hiện SAU "Tiếp tục" (mẫu cn/jp thiếu mục)
      for (let i = 0; i < 24 && !createErr && !page.url().includes('save-cv-success'); i++) await sleep(500);
      if (!createErr) break;
      log('TopCV từ chối tạo CV (%s) — chờ 90s rồi thử lại (lần %d/6).', createErr, attempt);
      await sleep(90000);
      createErr = null;
      if (!(await clickContinue())) break;
    }
  } finally { page.off('response', onResp); }
  await page.waitForFunction(() => location.href.includes('save-cv-success'), { timeout: 60000 })
    .catch(async () => {
      log('WARN: chưa thấy trang save-cv-success sau 60s, URL=%s', page.url());
      // Chụp ngay lúc kẹt + ghi chữ của hộp/thông báo đang hiện (TopCV có thể báo "cần nâng cấp" ở bước lưu).
      try {
        fs.mkdirSync(cfg.out, { recursive: true });
        await page.screenshot({ path: path.join(cfg.out, 'topcv-save-stuck.png') });
        const msgs = await page.evaluate(() => Array.from(document.querySelectorAll('.modal, [role=dialog], [role=alert], .toast, .alert, .el-message, .swal2-popup'))
          .filter((m) => m.offsetHeight).map((m) => (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200)).filter(Boolean));
        log('Thông báo đang hiện lúc kẹt: %s', JSON.stringify(msgs));
      } catch (_) {}
    });
}

// Vào /quan-ly-cv → tìm card CV mới (theo position) → click đúng nút "Tải về".
async function openDownloadModal(page, { position, name, cvId }) {
  await page.goto('https://www.topcv.vn/quan-ly-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(4000);

  // Lấy mọi nút .btn-download-cv kèm data-cv-id + tên CV của card.
  const btns = await page.evaluate(() => {
    const out = [];
    for (const el of Array.from(document.querySelectorAll('.btn-download-cv'))) {
      const card = el.closest('[class*="box-cv"], [class*="cv-card"], [class*="item-cv"]') || el.parentElement;
      const title = card ? (card.innerText || '').split('\n').map((s) => s.trim()).find((s) => s.startsWith('CV')) || '' : '';
      const r = el.getBoundingClientRect();
      out.push({
        x: r.x + r.width / 2, y: r.y + r.height / 2,
        dataCvId: el.getAttribute('data-cv-id') || el.getAttribute('data-id') || '',
        title, w: r.width, h: r.height,
      });
    }
    return out;
  });
  log('Nút Tải về tìm thấy: %s', JSON.stringify(btns, null, 1));
  if (btns.length === 0) throw new Error('Không tìm thấy nút .btn-download-cv trên /quan-ly-cv');

  const target = btns.find((b) => b.dataCvId === cvId); // CHỈ đúng cvId vừa tạo — không fallback sang CV khác
  if (!target) throw new Error('Không thấy CV ' + cvId + ' trong /quan-ly-cv');

  // Nếu button ẩn (hiện khi hover), hover card trước.
  await page.mouse.move(target.x, target.y);
  await sleep(800);
  const pos = await page.evaluate((selId) => {
    const el = Array.from(document.querySelectorAll('.btn-download-cv')).find((b) => (b.getAttribute('data-cv-id') || b.getAttribute('data-id') || '') === selId);
    const node = el;
    if (!node) return null;
    const r = node.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, id: node.getAttribute('data-cv-id') || '' };
  }, target.dataCvId);
  await mouseClick(page, (pos && pos.x) || target.x, (pos && pos.y) || target.y);
  log('Đã click "Tải về" card: %s (id=%s)', target.title || btns[0].title, target.dataCvId);
  await sleep(2000);
}

// Modal "Tải CV": click nút xanh "Tải CV miễn phí" (tọa độ cố định 920,467 @1440x900,
// có fallback text-match).
async function clickFreeDownload(page) {
  // Modal "Tải CV" có 2 chữ "Tải CV miễn phí": tiêu đề (không bấm được) và NÚT xanh dưới cùng bên phải.
  // Chọn phần tử khớp CHÍNH XÁC chữ, đang nằm trong viewport; ưu tiên button/a, rồi tới cái nằm thấp nhất.
  // Không dùng includes() — nó khớp nhầm cả container lớn (toạ độ y=1339 ngoài màn hình, bấm hụt).
  const find = () => page.evaluate((norm) => {
    const n = new Function('return ' + norm)();
    const vh = window.innerHeight;
    const c = Array.from(document.querySelectorAll('button, a, [role="button"], div, span'))
      .filter((b) => n(b.innerText || '') === 'tai cv mien phi' && b.offsetHeight > 0)
      .map((b) => ({ b, r: b.getBoundingClientRect() }))
      .filter(({ r }) => r.y >= 0 && r.y + r.height <= vh)
      .sort((x, y) => {
        const bx = /^(BUTTON|A)$/.test(x.b.tagName) ? 1 : 0, by = /^(BUTTON|A)$/.test(y.b.tagName) ? 1 : 0;
        return by - bx || y.r.y - x.r.y;
      });
    if (!c.length) return null;
    const { b, r } = c[0];
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, tag: b.tagName };
  }, NORM_FN_SRC);
  // Modal có hiệu ứng trượt: tiêu đề hiện trước, nút xanh còn đang di chuyển. Chỉ bấm khi vị trí nút
  // đứng yên giữa 2 lần đo (tối đa 8s) — thay cho sleep cố định, và tránh bấm trượt (đã gặp y=374 vs 471).
  let pos = null;
  for (let i = 0, prev = null; i < 32; i++) {
    const cur = await find();
    if (cur && prev && Math.abs(cur.y - prev.y) < 1 && Math.abs(cur.x - prev.x) < 1) { pos = cur; break; }
    prev = cur; await sleep(250);
  }
  if (!pos) throw new Error('Không thấy nút "Tải CV miễn phí" trong viewport (modal Tải CV chưa mở?)');
  await mouseClick(page, pos.x, pos.y);
  log('Đã click "Tải CV miễn phí" (%s) tại (%d,%d)', pos.tag, Math.round(pos.x), Math.round(pos.y));
}

// XÓA NHANH: form trong modal #confirmDelete chỉ là POST /delete-cv {_token, cv_id}. Gửi thẳng từ trang hiện tại
// (đã có meta csrf-token) → không phải mở /quan-ly-cv, hover, bấm menu, chờ modal. Kiểm chứng: HTML /quan-ly-cv
// được server render sẵn data-cv-id nên chỉ cần fetch rồi tìm cvId. Lỗi bất kỳ → caller rơi về luồng UI bên dưới.
async function deleteCvFast(page, cvId) {
  if (!/^[0-9a-f]{16,}$/i.test(cvId || '')) throw new Error('cvId không hợp lệ: ' + cvId);
  const r = await page.evaluate(async (id) => {
    const token = (document.querySelector('meta[name=csrf-token]') || {}).content || (document.querySelector('input[name=_token]') || {}).value;
    if (!token) return { error: 'không có csrf token' };
    const post = await fetch('/delete-cv', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-TOKEN': token },
      body: new URLSearchParams({ _token: token, cv_id: id }).toString(),
    });
    // Server xóa xong mới hết hiện trong danh sách (có độ trễ ngắn) → thử lại tối đa ~6s, bỏ cache.
    let gone = false;
    for (let i = 0; i < 6 && !gone; i++) {
      if (i) await new Promise((r) => setTimeout(r, 1000));
      const html = await (await fetch('/quan-ly-cv', { credentials: 'same-origin', cache: 'no-store' })).text();
      // Chỉ tính thẻ CV thật (nút Tải về mang data-cv-id), không tìm chuỗi thô: id còn có thể nằm ở chỗ khác trong HTML.
      gone = !new DOMParser().parseFromString(html, 'text/html').querySelector(`.btn-download-cv[data-cv-id="${id}"]`);
    }
    return { status: post.status, gone };
  }, cvId);
  if (r.error) throw new Error(r.error);
  if (!r.gone) throw new Error('POST /delete-cv status=' + r.status + ' nhưng CV vẫn còn trong /quan-ly-cv');
  log('✓ Đã xóa CV %s (POST /delete-cv, status %d).', cvId, r.status);
  return true;
}

// Xóa CV vừa tạo khỏi kho /quan-ly-cv (chỉ xóa đúng cvId vừa tạo, không đụng CV khác). Luồng UI — dự phòng.
// Luồng: hover card → icon "…" → "Xóa" (.box-cv__action-more-box-up-delete[data-cv-id]) →
// modal #confirmDelete ("Bạn chắc chắn muốn xóa CV này?") → nút .btn-delete-cv ("Xóa").
async function deleteCvFromManager(page, cvId) {
  if (!cvId) throw new Error('Không có cvId của CV vừa tạo — bỏ qua xóa để tránh xóa nhầm.');
  await page.goto('https://www.topcv.vn/quan-ly-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(4000);
  await acceptCookies(page);

  const cardPos = await page.evaluate((id) => {
    const dl = Array.from(document.querySelectorAll('.btn-download-cv')).find((b) => b.getAttribute('data-cv-id') === id);
    const card = dl && dl.closest('.box-cv');
    if (!card) return null;
    card.scrollIntoView({ block: 'center' });
    const r = card.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, cvId);
  if (!cardPos) { log('CV %s không còn trong /quan-ly-cv → coi như đã xóa.', cvId); return true; }

  await page.mouse.move(cardPos.x, cardPos.y);
  await sleep(800);
  const moreBtn = await page.evaluate((id) => {
    const dl = Array.from(document.querySelectorAll('.btn-download-cv')).find((b) => b.getAttribute('data-cv-id') === id);
    const icon = dl.closest('.box-cv').querySelector('.box-cv__action-more-icon');
    const r = icon.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, cvId);
  await mouseClick(page, moreBtn.x, moreBtn.y);
  await sleep(700);

  const delBtn = await page.evaluate((id) => {
    const el = document.querySelector(`.box-cv__action-more-box-up-delete[data-cv-id="${id}"]`);
    if (!el || !el.offsetHeight) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, cvId);
  if (!delBtn) throw new Error('Không thấy mục "Xóa" trong menu "…" của CV ' + cvId);
  await mouseClick(page, delBtn.x, delBtn.y);
  // Modal Bootstrap có hiệu ứng fade, đôi khi chậm → chờ tối đa 8s thay vì sleep cố định.
  await page.waitForFunction(() => { const m = document.querySelector('#confirmDelete'); return m && m.offsetHeight > 0; }, { timeout: 8000 }).catch(() => {});
  await sleep(500);

  // Modal xác nhận: kiểm tra cv_id ẩn đúng là CV vừa tạo rồi mới bấm "Xóa".
  const confirm = await page.evaluate((id) => {
    const m = document.querySelector('#confirmDelete');
    if (!m || !m.offsetHeight) return { ok: false, why: 'modal không hiện' };
    const hidden = m.querySelector('#cv_id');
    if (!hidden || hidden.value !== id) return { ok: false, why: 'cv_id trong modal = ' + (hidden && hidden.value) };
    const b = m.querySelector('.btn-delete-cv');
    const r = b.getBoundingClientRect();
    return { ok: true, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, cvId);
  if (!confirm.ok) throw new Error('Hộp xác nhận xóa không đúng CV: ' + confirm.why);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {}),
    mouseClick(page, confirm.x, confirm.y),
  ]);
  log('Đã bấm "Xóa" trong hộp xác nhận (cvId=%s).', cvId);

  // Kiểm chứng: tải lại /quan-ly-cv, CV phải biến mất.
  await page.goto('https://www.topcv.vn/quan-ly-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3000);
  const still = await page.evaluate((id) => Array.from(document.querySelectorAll('.btn-download-cv')).some((b) => b.getAttribute('data-cv-id') === id), cvId);
  if (still) throw new Error('CV vẫn còn trong /quan-ly-cv sau khi bấm Xóa.');
  log('✓ Đã xóa CV %s khỏi kho quản lý CV.', cvId);
  return true;
}

/* ------------------------------------------------------------------ *
 * 6) Thu thập + kiểm chứng PDF
 * ------------------------------------------------------------------ */
function snapshotPdfs() {
  if (!fs.existsSync(DOWNLOADS_DIR)) return [];
  return fs.readdirSync(DOWNLOADS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((f) => {
      const p = path.join(DOWNLOADS_DIR, f);
      const st = fs.statSync(p);
      return { name: f, path: p, size: st.size, mtime: st.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
}

async function verifyPdf(pdfParse, buf, { phone, position }) {
  const { PDFParse } = pdfParse; // pdf-parse@2.x export { PDFParse }
  const d = await new PDFParse({ data: buf }).getText();
  const t = typeof d === 'string' ? d : d.text;
  const phoneDigits = (phone || '').replace(/\D/g, '');
  const hasPhone = phoneDigits && t.replace(/\D/g, '').includes(phoneDigits);
  const hasPosition = position ? t.toLowerCase().includes(position.toLowerCase()) : true;
  return { textLen: t.length, hasPhone, hasPosition, head: t.slice(0, 400) };
}

/* ------------------------------------------------------------------ *
 * 7) Main
 * ------------------------------------------------------------------ */
(async () => {
  const cfg = parseArgs(process.argv);
  { const d = LANG_DEFAULTS[cfg.lang] || LANG_DEFAULTS.vi; if (cfg.position === 'Nhân viên kinh doanh') cfg.position = d.position; if (cfg.address === '123 Nguyen Trai, Ha Noi') cfg.address = d.address; }
  fs.mkdirSync(cfg.out, { recursive: true });
  OUT_DIR = cfg.out;

  const puppeteer = ensureModule('puppeteer-core');
  if (cfg.downloadDir) DOWNLOADS_DIR = cfg.downloadDir;
  const { browser, page, child, profile, temp } = await launchEdge(puppeteer, cfg.profile, cfg.port, cfg.downloadDir);
  await page.setViewport({ width: 1440, height: 900 });
  // Nhiều cửa sổ Edge chạy song song: cửa sổ nền không có focus nên Quill không nhận chữ → giả lập luôn có focus.
  try { await (await page.createCDPSession()).send('Emulation.setFocusEmulationEnabled', { enabled: true }); } catch (_) {}
  // Editor có beforeunload ('Rời khỏi trang?') — tự accept mọi dialog để goto không bị treo.
  page.on('dialog', (d) => d.accept().catch(() => {}));

  try {
    // 1) ĐĂNG NHẬP:
    //    - Có --email + --google-password  → TỰ đăng nhập qua Google (googleLogin).
    //    - --manual-login (hoặc thiếu credential) → chờ user gõ tay.
    await page.goto('https://www.topcv.vn/mau-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(3000);
    await acceptCookies(page);
    const already = await page.evaluate(() => !Array.from(document.querySelectorAll('a, button')).some((e) => e.offsetHeight > 0 && (e.innerText || '').trim() === 'Đăng nhập'));
    if (already) {
      log('✓ Profile đã đăng nhập sẵn — bỏ qua bước login.');
    } else if (!cfg.manualLogin && cfg.email && cfg.googlePassword) {
      await googleLogin(browser, page, { email: cfg.email, password: cfg.googlePassword, timeoutMs: cfg.loginWaitMs });
    } else {
      log('Chế độ CHỜ USER ĐĂNG NHẬP TAY (không có --email/--google-password, hoặc --manual-login).');
      await page.goto('https://www.topcv.vn/mau-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await sleep(3000);
      await acceptCookies(page);
      await waitForLogin(page, cfg.loginWaitMs);
    }

    // 2) Vào /mau-cv (chắc chắn) + chọn mẫu + ngôn ngữ + tạo.
    if (!page.url().includes('/mau-cv')) {
      await page.goto('https://www.topcv.vn/mau-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await sleep(3000);
      await acceptCookies(page);
    }
    if (cfg.dumpTemplates) {
      const all = await page.evaluate(() => Array.from(document.querySelectorAll('a.btn-use-now'))
        .map((a) => { try { return JSON.parse(a.getAttribute('data-template')); } catch (_) { return null; } })
        .filter(Boolean)
        .map((t) => ({ slug: t.name, title: t.title, tags: t.tags || [], langs: (t.available_languages || []).map((l) => ({ key: l.key, name: l.name })) })));
      fs.writeFileSync(cfg.dumpTemplates, JSON.stringify(all, null, 2));
      log('✓ Đã ghi %d mẫu vào %s', all.length, cfg.dumpTemplates);
      return;
    }
    const picked = await selectTemplateAndLanguage(page, cfg);
    await clickCreateCv(page);
    log('URL sau khi tạo: %s', page.url());

    // 3) Điền + lưu.
    await fillQuillFields(page, cfg);
    const before = new Set(snapshotPdfs().map((f) => f.name));
    await saveWithAutofill(page, cfg, picked.cvName);
    // cvId nằm trong URL /save-cv-success/<cvId> — dùng để xóa đúng CV này sau khi tải xong.
    let cvId = '';
    for (let i = 0; i < 10 && !cvId; i++) {
      const m = page.url().match(/save-cv-success\/([0-9a-f]+)/i);
      if (m) cvId = m[1]; else await sleep(500);
    }
    // Không có cvId = CV chưa được lưu. Dừng ngay: nhánh dự phòng sẽ tải nhầm CV có sẵn của user (đã từng xảy ra).
    // Chạy song song TopCV có thể lưu chậm: hết hạn mà chưa chuyển trang → tìm CV trong /quan-ly-cv theo ĐÚNG tên vừa đặt.
    // Chỉ nhận khi có đúng 1 thẻ khớp tên (0 hoặc ≥2 → dừng, không đoán, tránh tải/xóa nhầm CV khác).
    if (!cvId) {
      for (let t = 0; t < 4 && !cvId; t++) {
        await sleep(t ? 15000 : 5000);
        try {
          await page.goto('https://www.topcv.vn/quan-ly-cv', { waitUntil: 'domcontentloaded', timeout: 60000 });
          await sleep(3000);
          const ids = await page.evaluate((name) => Array.from(document.querySelectorAll('.btn-download-cv')).filter((b) => {
            const card = b.closest('[class*="box-cv"], [class*="cv-card"], [class*="item-cv"]') || b.parentElement;
            return card && (card.innerText || '').split('\n').map((x) => x.trim()).includes(name);
          }).map((b) => b.getAttribute('data-cv-id')).filter(Boolean), picked.cvName);
          if (ids.length === 1) { cvId = ids[0]; log('Lưu chậm: tìm thấy CV "%s" trong /quan-ly-cv, cvId=%s', picked.cvName, cvId); }
          else if (ids.length > 1) throw new Error('Có ' + ids.length + ' CV trùng tên "' + picked.cvName + '" trong /quan-ly-cv — dừng, cần xóa tay các CV thừa rồi chạy lại.');
        } catch (e) { if (/trùng tên/.test(e.message)) throw e; }
      }
    }
    if (!cvId) throw new Error('CV chưa được lưu (không vào được /save-cv-success). Dừng để không tải/xóa nhầm CV khác. URL=' + page.url());
    log('cvId vừa tạo: %s', cvId);

    // 4) PDF tự tải sau khi lưu (nhánh nhanh). Không có → fallback /quan-ly-cv → "Tải về" → "Tải CV miễn phí".
    const waitFresh = async (ms) => {
      const end = Date.now() + ms;
      while (Date.now() < end) {
        await sleep(1000);
        const f = snapshotPdfs().find((x) => !before.has(x.name) && !x.name.endsWith('.crdownload'));
        if (f) return f;
      }
      return null;
    };
    // Sau khi lưu, TopCV chuyển sang /save-cv-success/<cvId>?type=create (thẻ CV vừa tạo + nút "Tải về").
    // Không tự tải → bấm "Tải về" ngay tại đó (nhanh, đúng CV vừa tạo, khỏi qua /quan-ly-cv).
    let fresh = null;
    if (page.url().includes('save-cv-success')) {
      await page.waitForFunction(() => Array.from(document.querySelectorAll('a, button')).some((x) => x.offsetHeight && /^Tải về$/.test(x.innerText.trim())), { timeout: 10000 }).catch(() => {});
      const dl = await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('a, button')).find((x) => x.offsetHeight && /^Tải về$/.test(x.innerText.trim()));
        if (!b) return null;
        const r = b.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
      if (dl) {
        await mouseClick(page, dl.x, dl.y);
        log('Đã bấm "Tải về" trên trang save-cv-success.');
        await page.waitForFunction(() => /T[ảa]i CV mi[ễe]n ph[íi]/.test(document.body.innerText), { timeout: 8000 }).catch(() => {});
        try { await clickFreeDownload(page); fresh = await waitFresh(25000); }
        catch (e) { log('Tải ngay ở save-cv-success không được (%s) → thử qua /quan-ly-cv.', e.message); }
      }
    }
    if (!fresh) {
      log('Thử qua /quan-ly-cv.');
      await openDownloadModal(page, { ...cfg, cvId });
      await clickFreeDownload(page);
      fresh = await waitFresh(25000);
    }
    if (!fresh) throw new Error('Không có file PDF mới trong Downloads (tránh lấy nhầm file cũ).');
    log('File tải về: %s (%s bytes)', fresh.name, fresh.size);

    // 6) Copy về thư mục ra + kiểm chứng.
    // Tên file = tên CV đã đặt trên TopCV (TopCV tự đặt tên file tải về nên phải đổi ở bước copy).
    // Chỉ bỏ ký tự Windows cấm; giữ nguyên tiếng Việt. Trùng tên → thêm " (2)", " (3)"… không ghi đè.
    const base = picked.cvName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').trim();
    const uniqueIn = (dir) => {
      let p = path.join(dir, base + '.pdf');
      for (let n = 2; fs.existsSync(p); n++) p = path.join(dir, `${base} (${n}).pdf`);
      return p;
    };
    // Đổi tên NGAY TRONG Downloads (file TopCV vừa tải) — Edge có thể còn giữ file vài giây nên thử lại.
    const renamed = uniqueIn(DOWNLOADS_DIR);
    for (let i = 0; ; i++) {
      try { fs.renameSync(fresh.path, renamed); break; }
      catch (e) { if (i >= 10) throw e; await sleep(500); }
    }
    fresh.path = renamed; fresh.name = path.basename(renamed);
    log('Đã đổi tên file trong Downloads: %s', renamed);
    if (cfg.finalDir) {
      const safe = (x) => String(x).replace(/[<>:"/\|?*]/g, "-").trim();
      const dir = path.join(cfg.finalDir, safe(picked.style || 'Khác'), safe(picked.title), safe(picked.langName));
      fs.mkdirSync(dir, { recursive: true });
      const target = uniqueIn(dir);
      fs.renameSync(fresh.path, target);
      fresh.path = target; fresh.name = path.basename(target);
      log('Đã chuyển vào thư mục dự án: %s', target);
    }
    let dest = fresh.path; // mặc định: chính file trong Downloads (đã đổi tên)
    if (cfg.copy) { dest = uniqueIn(cfg.out); fs.copyFileSync(fresh.path, dest); log('Đã copy về: %s', dest); }

    let v = null;
    if (cfg.verify) {
      const pdfParse = ensureModule('pdf-parse');
      v = await verifyPdf(pdfParse, fs.readFileSync(fresh.path), cfg);
      log('Kiểm chứng PDF → textLen=%d hasPhone=%s hasPosition=%s', v.textLen, v.hasPhone, v.hasPosition);
      if (!(v.hasPhone && v.hasPosition)) log('⚠ CẢNH BÁO: nội dung PDF không khớp phone/position: %s', v.head.replace(/\s+/g, ' '));
    }
    log('✓ HOÀN TẤT — CV đã tải về: %s', dest);

    // 7) PDF đã nằm an toàn ở `dest` → xóa CV khỏi kho quản lý CV (trừ khi --keep-cv).
    let deleted = false, deleteError = '';
    if (cfg.keepCv) {
      log('--keep-cv: giữ lại CV trong kho quản lý CV.');
    } else {
      try {
        try { deleted = await deleteCvFast(page, cvId); }
        catch (e) { log('Xóa nhanh không được (%s) → thử luồng UI.', e.message); deleted = await deleteCvFromManager(page, cvId); }
      }
      catch (e) { deleteError = e.message; log('⚠ KHÔNG XÓA ĐƯỢC CV: %s (xóa tay ở /quan-ly-cv)', e.message); process.exitCode = 1; }
    }

    // Lưu đường dẫn ra cho agent đọc.
    fs.writeFileSync(cfg.result || path.join(cfg.out, 'topcv-last-result.json'),
      JSON.stringify({ dest, source: fresh.path, verify: v, cvId, deleted, deleteError }, null, 2));

  } catch (e) {
    log('LỖI: %s', e.stack || e.message);
    const shot = path.join(cfg.out, 'topcv-error.png');
    try { fs.mkdirSync(cfg.out, { recursive: true }); await page.screenshot({ path: shot }); log('Screenshot lỗi: %s', shot); } catch (_) {}
    process.exitCode = 1;
  } finally {
    try { await browser.close(); } catch (_) {}
    try { child.kill(); } catch (_) {}
    if (temp) { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {} }
  }
})();
