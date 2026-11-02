// Script tự động hóa tạo CV trên TopCV bằng Puppeteer (kết nối thẳng vào Edge).
//
// Cách chạy:
//   1. npx puppeteer browsers install chrome   (một lần, tải trình duyệt headless)
//      HOẶC chỉnh const EDGE_PATH dưới đây để trỏ vào Edge có sẵn.
//   2. Mở một cửa sổ Edge CHƯỜNG (bình thường) và đăng nhập vào https://topcv.vn
//   3. node js/topcv-automation.js
//
// Script sẽ:
//   - Kết nối vào một cửa sổ Edge đang chạy (qua CDP), hoặc tự mở nếu không tìm được.
//   - Điều hướng tới trang tạo CV mẫu: https://topcv.vn/cv-mau
//   - Chờ bạn đăng nhập (nếu cần) — in hướng dẫn ra terminal, chờ cho tới khi thấy trang "tạo CV".
//   - Chọn phương án "Nội dung CV mẫu TopCV gợi ý", ngôn ngữ "Tiếng Việt", vị trí "Nhân viên kinh doanh".
//   - Sửa nội dung CV theo dữ liệu trong js/topcv-data.js (điền vào các trường edit được).
//   - Nhấn "Tạo CV" và đợi trang kết quả, rồi dừng tại đó để bạn xem/luân thủ.
//
// Lưu ý: TopCV là SPA (React/Vue), form có thể thay đổi DOM theo bản. Script dùng
// selector theo label/text nên có thể cần hiệu chỉnh khi TopCV cập nhật giao diện.
// Script không tự động hóa bước đăng nhập (tuân thủ chính sách tài khoản của bạn).

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const CV = require('./topcv-data');

// Đường dẫn Edge có sẵn trên máy (x86). Nếu không tồn tại, Puppeteer sẽ báo lỗi và bạn
// có thể cài Chrome headless bằng: npx @puppeteer/browsers install chrome@stable
const EDGE_PATH =
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const TOPCV_CV_MAU_URL = 'https://topcv.vn/cv-mau';
const POLL_MS = 1500; // khoảng thời gian kiểm tra liên tục khi chờ

// ---------- Tiện ích ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitAndClick(page, { label, timeout = 15000, tag = 'button, a, label' }) {
  // Chờ và click phần tử có text chứa `label` (chữ thường, không dấu) trong `tag`.
  const deadline = Date.now() + timeout;
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  while (Date.now() < deadline) {
    const clicked = await page.evaluate(
      (labelNorm, tagSel) => {
        const norm = (s) =>
          s
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9 ]/g, '')
            .trim();
        const target = norm(labelNorm);
        const candidates = Array.from(document.querySelectorAll(tagSel));
        for (const el of candidates) {
          const text = (el.innerText || el.textContent || '').trim();
          if (norm(text) === target) {
            el.scrollIntoView({ block: 'center' });
            el.click();
            return { ok: true, text };
          }
        }
        return { ok: false };
      },
      label,
      tag
    );
    if (clicked.ok) return clicked;
    await sleep(POLL_MS);
  }
  throw new Error(`Không tìm thấy/click được phần tử: "${label}"`);
}

async function typeInto(page, selector, text, { clear = true } = {}) {
  const handle = await page.waitForSelector(selector, { timeout: 15000 });
  if (clear) {
    await handle.evaluate((el) => {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
  await handle.type(text, { delay: 20 });
}

async function logStep(msg) {
  const ts = new Date().toLocaleTimeString('vi-VN');
  console.log(`[${ts}] ${msg}`);
}

// ---------- Các bước ----------
async function connectBrowser() {
  // Thử kết nối vào Edge đang chạy qua CDP (yêu cầu Edge mở với --remote-debugging-port=9222).
  // Nếu không có, tự mở một cửa sổ Edge mới (headful) để người dùng thấy.
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version', {
      signal: AbortSignal.timeout(800),
    });
    if (res.ok) {
      const { webSocketDebuggerUrl } = await res.json();
      logStep('Phát hiện Edge đang chạy với CDP — kết nối vào phiên đó.');
      return puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
    }
  } catch {
    /* Edge không mở với CDP — sẽ tự mở mới */
  }
  logStep('Mở cửa sổ Edge mới (chế độ hiển thị, không phải headless).');
  return puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: false,
    defaultViewport: null,
    args: [
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1440,900',
    ],
  });
}

async function openTopcvCvMau(page) {
  logStep('Điều hướng tới ' + TOPCV_CV_MAU_URL);
  await page.goto(TOPCV_CV_MAU_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
}

async function waitForLogin(page) {
  logStep('Nếu trang yêu cầu đăng nhập, VUI LÒNG TỰ ĐĂNG NHẬP bằng tài khoản của bạn.');
  logStep('Script sẽ chờ tối đa 5 phút cho tới khi trang "tạo CV" xuất hiện…');
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const url = page.url();
    // TopCV có thể điều hướng về trang cá nhân/tạo CV sau khi đăng nhập.
    // Dấu hiệu: URL chứa 'cv' hoặc có nút "Tạo CV" trên trang.
    const hasCreateBtn = await page
      .$eval('body', (b) => /tạo\s*cv/i.test(b.innerText || ''))
      .catch(() => false);
    if (hasCreateBtn || /topcv\.vn\/(cv|create)/i.test(url)) {
      logStep('Đã sẵn sàng trang tạo CV. Tiến hành chọn mẫu…');
      return;
    }
    await sleep(3000);
  }
  throw new Error('Chờ đăng nhập quá 5 phút. Chạy lại script sau khi đã đăng nhập.');
}

async function selectTemplateOption(page) {
  // Chọn radio "Nội dung CV mẫu TopCV gợi ý"
  await waitAndClick(page, {
    label: 'Nội dung CV mẫu TopCV gợi ý',
    tag: 'label, span, div, p',
    timeout: 20000,
  });
  // Chọn ngôn ngữ "Tiếng Việt" (đã được chọn sẵn theo ảnh, nhưng click lại để chắc)
  await waitAndClick(page, {
    label: 'Tiếng Việt',
    tag: 'button, label, span, a',
  }).catch(() => logStep('(ngôn ngữ "Tiếng Việt" có thể đã chọn sẵn, bỏ qua)'));
  // Chọn vị trí "Nhân viên kinh doanh" — click vào select/dropdown nếu cần
  const posDropdown = await page
    .waitForSelector('select, [role="listbox"]', { timeout: 5000 })
    .catch(() => null);
  if (posDropdown) {
    const tag = (await posDropdown.evaluate((el) => el.tagName)).toLowerCase();
    if (tag === 'select') {
      await posDropdown.select('Nhân viên kinh doanh').catch(async () => {
        // Fallback: click label rồi click option
        await waitAndClick(page, { label: 'Nhân viên kinh doanh', tag: 'label, option, span, li' });
      });
    } else {
      await waitAndClick(page, { label: 'Nhân viên kinh doanh', tag: 'option, li, span' });
    }
  } else {
    await waitAndClick(page, { label: 'Nhân viên kinh doanh', tag: 'label, span, button, div' });
  }
}

async function clickTaoCv(page) {
  await waitAndClick(page, {
    label: 'Tạo CV',
    tag: 'button',
    timeout: 30000,
  });
  logStep('Đã nhấn "Tạo CV" — chờ TopCV tạo bản nháp…');
}

async function editCvFields(page) {
  // Sau khi TopCV tạo bản nháp, bạn sẽ ở trang sửa CV với form edit được.
  // Script sẽ điền/sửa các trường chính theo CV trong js/topcv-data.js.
  logStep('Bắt đầu điền nội dung CV theo dữ liệu mẫu…');

  // Tên
  await typeInto(page, 'input[name*="name" i], input[placeholder*="họ tên" i], #name', CV.basics.name)
    .then(() => logStep('Đã điền: Họ tên'))
    .catch(() => logStep('(không tìm thấy trường "Họ tên" — bỏ qua)'));

  // Email
  await typeInto(page, 'input[type="email"], input[name*="email" i]', CV.basics.email)
    .then(() => logStep('Đã điền: Email'))
    .catch(() => logStep('(không tìm thấy trường "Email" — bỏ qua)'));

  // SĐT
  await typeInto(
    page,
    'input[type="tel"], input[name*="phone" i], input[name*="sdt" i]',
    CV.basics.phone
  )
    .then(() => logStep('Đã điền: SĐT'))
    .catch(() => logStep('(không tìm thấy trường "SĐT" — bỏ qua)'));

  // Website
  await typeInto(
    page,
    'input[name*="website" i], input[name*="url" i]',
    CV.basics.url
  )
    .then(() => logStep('Đã điền: Website'))
    .catch(() => logStep('(không tìm thấy trường "Website" — bỏ qua)'));

  // Địa chỉ (city)
  await typeInto(
    page,
    'input[name*="address" i], input[name*="city" i]',
    CV.basics.city
  )
    .then(() => logStep('Đã điền: Địa chỉ'))
    .catch(() => logStep('(không tìm thấy trường "Địa chỉ" — bỏ qua)'));

  // Mục tiêu nghề nghiệp (textarea)
  const summary = await page
    .$(
      'textarea[name*="summary" i], textarea[name*="objective" i], textarea[name*="mot_tieu" i]'
    )
    .catch(() => null);
  if (summary) {
    await summary.type(CV.basics.summary, { delay: 15 });
    logStep('Đã điền: Mục tiêu nghề nghiệp');
  } else {
    logStep('(không tìm thấy trường "Mục tiêu nghề nghiệp" — bỏ qua)');
  }

  // Học vấn & kinh nghiệm: TopCV thường dùng form động (có thể có sẵn từ mẫu).
  // Script chỉ điền nếu có input/textarea trống trong các section tương ứng.
  // (Phần này sẽ cần hiệu chỉnh selector theo DOM thực tế của TopCV sau khi chạy thử.)
  logStep('Hoàn tất các trường chính. Các mục Học vấn / Kinh nghiệm sẽ giữ nguyên mẫu gợi ý.');
  logStep('VUI LÒNG KIỂM TRA LẠI toàn bộ nội dung trên trang trước khi bấm LƯU.');
}

async function saveScreenshot(page) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(__dirname, '..', 'scratch');
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `topcv-${stamp}.png`);
  await page.screenshot({ path: file, fullPage: true });
  logStep('Đã chụp màn hình: ' + file);
  return file;
}

// ---------- Main ----------
(async () => {
  let browser;
  try {
    browser = await connectBrowser();
    const pages = await browser.pages();
    const page = pages[0] || (await browser.newPage());

    await openTopcvCvMau(page);
    await waitForLogin(page);
    await selectTemplateOption(page);
    await clickTaoCv(page);

    // Chờ TopCV tạo bản nháp và chuyển tới trang sửa CV.
    logStep('Chờ TopCV tạo bản nháp…');
    await sleep(8000);
    await saveScreenshot(page);

    await editCvFields(page);
    await sleep(1000);
    await saveScreenshot(page);

    logStep('XONG — script dừng lại ở trang sửa CV. Bạn hãy kiểm tra và tự bấm LƯU.');
    logStep('Không đóng cửa sổ này; script giữ kết nối tới khi bạn Ctrl+C.');
    // Giữ process chạy để người dùng xem được trang.
    await new Promise(() => {});
  } catch (err) {
    console.error('LỖI:', err.message);
    try {
      const page = await browser.pages().then((p) => p[0]);
      if (page) await saveScreenshot(page);
    } catch {}
    process.exit(1);
  }
})();
