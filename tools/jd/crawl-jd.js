/**
 * Thu thập JD TopCV cho từng nghề (164 nghề trong nghe-list.json).
 * Chạy tiếp được: nghề nào đã có assets/data/jd-raw/<id>.json thì bỏ qua.
 *
 *   node tools/jd/crawl-jd.js                 # chạy tất cả nghề còn thiếu
 *   node tools/jd/crawl-jd.js --ids 1,2,3     # chỉ các nghề này
 *   node tools/jd/crawl-jd.js --limit 10      # tối đa 10 nghề rồi dừng
 *   node tools/jd/crawl-jd.js --per 6         # số JD / nghề (mặc định 6)
 *   node tools/jd/crawl-jd.js --force --ids 5 # làm lại
 */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'assets', 'data', 'jd-raw');
const LIST = JSON.parse(fs.readFileSync(path.join(__dirname, 'nghe-list.json'), 'utf8'));
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  if (i < 0) return d;
  const nx = process.argv[i + 1];
  return nx && !nx.startsWith('--') ? nx : true;
};
const PORT = +arg('port', 9341); // mỗi tiến trình song song dùng một cổng + profile riêng
const RANGE = String(arg('range', '')).split('-').map(Number); // --range 83-164
const CATEGORY = arg('mode', '') === 'category'; // lấy tin thẳng từ trang danh mục nghề của TopCV, không lọc theo tiêu đề
const PER = +arg('per', 6), FORCE = !!arg('force', false), LIMIT = +arg('limit', 1e9);
const IDS = arg('ids', null) ? String(arg('ids')).split(',').map(Number) : null;
const MIN = 0.6; // ngưỡng liên quan tối thiểu của tiêu đề JD
const sleep = ms => new Promise(r => setTimeout(r, ms));
const jitter = () => sleep(2500 + Math.random() * 2500);
const log = (...a) => console.log(new Date().toLocaleTimeString('vi-VN'), ...a);

function findPuppeteer() {
  for (const b of [ROOT + '/node_modules', ROOT + '/.qwen/tmp/node_modules', os.homedir() + '/.qwen/tmp/node_modules', ROOT + '/tools/topcv/node_modules', os.tmpdir() + '/node_modules']) {
    try { return require(require.resolve('puppeteer-core', { paths: [b] })); } catch (_) { /* thử tiếp */ }
  }
  throw new Error('Không tìm thấy puppeteer-core (xem tools/topcv/README.md)');
}
const edgePath = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const STOP = new Set(['nhan', 'vien', 'chuyen', 'khac', 'va', 'cho', 'cac', 'tai', 'sales']);
const toks = s => fold(s).split(/[^a-z0-9]+/).filter(t => t.length > 1 && !STOP.has(t));

async function launch() {
  const prof = path.join(os.tmpdir(), 'jd-crawl-profile-' + PORT);
  const child = spawn(edgePath, [`--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  let v;
  for (let i = 0; i < 60 && !v; i++) {
    try {
      v = await new Promise((res, rej) => http.get(`http://127.0.0.1:${PORT}/json/version`, r => {
        let d = ''; r.on('data', x => { d += x; }); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
    } catch (_) { await sleep(500); }
  }
  if (!v) throw new Error('CDP không khởi động');
  const browser = await findPuppeteer().connect({ browserWSEndpoint: v.webSocketDebuggerUrl, defaultViewport: null });
  return { browser, child, page: (await browser.pages())[0] || await browser.newPage() };
}

const slugOf = q => fold(q).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CATMAP = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'data', 'nghe-category-map.json'), 'utf8')); } catch (_) { return {}; } })();

// Sidebar "Theo danh mục nghề": [{name, count, cr, cb}] (cr/cb lấy từ data-level-one/two)
const readSidebar = page => page.evaluate(() => [...document.querySelectorAll('.filter-category_lists-item')].map(e => ({
  name: e.dataset.levelName, cr: +e.dataset.levelOne, cb: +e.dataset.levelTwo,
  count: +((e.querySelector('.total-job')?.innerText || '').replace(/\D/g, '')),
})));

// Xác định URL danh mục của nghề: bảng ánh xạ, nếu thiếu thì đọc sidebar của trang slug tên nghề.
async function categoryUrl(page, n) {
  if (CATMAP[n.id]) return CATMAP[n.id].url;
  await search(page, n.nghe);
  const hit = (await readSidebar(page)).find(x => fold(x.name) === fold(n.nghe));
  return hit ? `https://www.topcv.vn/tim-viec-lam-${slugOf(n.nghe)}-cr${hit.cr}cb${hit.cb}` : null;
}

async function search(page, q, url) {
  await page.goto(url || 'https://www.topcv.vn/tim-viec-lam-' + slugOf(q), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.job-item-search-result', { timeout: 20000 }).catch(() => {});
  return page.evaluate(() => [...document.querySelectorAll('.job-item-search-result')].map(e => {
    const a = e.querySelector('a[href*="/viec-lam/"]');
    if (!a) return null;
    return {
      url: a.href.split('?')[0],
      title: (e.querySelector('h3,.title')?.innerText || a.innerText).trim().replace(/\s+/g, ' '),
      company: (e.querySelector('.company-name,[class*=company]')?.innerText || '').trim(),
    };
  }).filter(x => x && /\/\d+\.html$/.test(x.url)));
}

async function fetchJD(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.box-job-information-detail-item__title--title', { timeout: 20000 }).catch(() => {});
  return page.evaluate(() => {
    const txt = e => (e ? e.innerText.trim() : '');
    const sections = {};
    document.querySelectorAll('h2.box-job-information-detail-item__title--title').forEach(h => {
      const name = h.innerText.trim();
      let box = h.parentElement;
      while (box && box.innerText.trim() === name && box.parentElement) box = box.parentElement;
      sections[name] = txt(box).replace(name, '').trim();
    });
    const chips = {};
    document.querySelectorAll('.job-tags__group').forEach(g => {
      const n = txt(g.querySelector('.job-tags__group-name')).replace(/:$/, '');
      chips[n] = [...g.querySelectorAll('a,.item')].map(txt).filter(Boolean);
    });
    return {
      title: txt(document.querySelector('h1')),
      company: txt(document.querySelector('.company-name-label, .company-title, [class*=company-name]')),
      chips, sections,
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const todo = LIST.filter(n => (!IDS || IDS.includes(n.id)) && (RANGE.length < 2 || (n.id >= RANGE[0] && n.id <= RANGE[1])) && (FORCE || !fs.existsSync(path.join(OUT, n.id + '.json')))).slice(0, LIMIT);
  log(`Còn ${todo.length} nghề cần thu thập (${PER} JD/nghề)`);
  if (!todo.length) return;
  const { browser, child, page } = await launch();
  let fails = 0;
  try {
    for (const n of todo) {
      if (!FORCE && fs.existsSync(path.join(OUT, n.id + '.json'))) continue; // tiến trình khác đã làm
      const clean = v => v.replace(/^Chuyên môn\s+/i, '').replace(/\s+khác$/i, '');
      // n.tuKhoa (tùy chọn): từ khóa sát nghề, thay cho tên nghề + vị trí khi các JD thu về bị lạc nghề
      const targets = (n.tuKhoa || [n.nghe, ...n.viTri.slice(0, 8)]).map(t => new Set(toks(clean(t)))).filter(t => t.size);
      const scoreOf = title => {
        const tt = new Set(toks(title)); let best = 0;
        for (const t of targets) { let h = 0; t.forEach(w => { if (tt.has(w)) h++; }); if (h >= Math.min(2, t.size)) best = Math.max(best, h / t.size); }
        return +best.toFixed(2);
      };
      if (CATEGORY) {
        const url = await categoryUrl(page, n); await jitter();
        if (!url) { log(`#${n.id} ${n.nghe}: không xác định được URL danh mục`); continue; }
        const rs = await search(page, n.nghe, url);
        const side = await readSidebar(page);
        const total = +((await page.title()).match(/Tuyển dụng ([\d.]+)/)?.[1] || '0').replace(/\./g, '');
        const verified = !!side.length && fold(side[0].name) === fold(n.nghe);
        // Lấy mẫu rải đều trong danh sách (đầu trang thường là tin quảng cáo), mỗi công ty một tin.
        const stride = Math.max(1, Math.floor(rs.length / PER)); const seen = new Set(); const pk = [];
        for (let i = 0; pk.length < PER && i < rs.length * 2; i += stride) { const r = rs[i % rs.length]; if (!seen.has(r.url) && !seen.has('co:' + r.company)) { pk.push({ ...r, query: url, score: 1, via: 'category' }); seen.add(r.url); seen.add('co:' + r.company); } }
        const jds2 = [];
        for (const c of pk) { try { jds2.push({ ...c, ...(await fetchJD(page, c.url)) }); } catch (e) { log('  lỗi JD', c.url, e.message); } await jitter(); }
        const ok2 = jds2.filter(j => ((j.sections || {})['Yêu cầu ứng viên'] || '').length > 40 || ((j.sections || {})['Mô tả công việc'] || '').length > 80);
        if (!ok2.length) { log(`#${n.id} ${n.nghe}: KHÔNG lấy được JD từ ${url}`); continue; }
        fs.writeFileSync(path.join(OUT, n.id + '.json'), JSON.stringify({ id: n.id, nhom: n.nhom, nghe: n.nghe, method: 'category', categoryUrl: url, categoryTotal: total, categoryVerified: verified, crawledAt: new Date().toISOString(), candidates: rs.length, thin: ok2.length < 4, jds: ok2 }, null, 1));
        log(`#${n.id} ${n.nghe}: ${ok2.length} JD [danh mục${verified ? '' : ' CHƯA XÁC MINH tên'}; tổng ${total} tin; ${url.split('/').pop()}]`);
        continue;
      }
      const queries = n.tuKhoa || [...new Set([n.nghe.replace(/\//g, ' '), ...n.viTri.filter(v => !/khác$/i.test(v)).slice(0, 3).map(clean)])];
      const cand = new Map();
      for (const q of queries) {
        let rs = [];
        try { rs = await search(page, q); } catch (e) { log('  lỗi search', q, e.message); }
        for (const r of rs) if (!cand.has(r.url)) cand.set(r.url, { ...r, query: q, score: scoreOf(r.title) });
        await jitter();
        if ([...cand.values()].filter(c => c.score >= MIN).length >= PER * 2) break;
      }
      const picked = []; const seenCo = new Set();
      for (const c of [...cand.values()].filter(c => c.score >= MIN).sort((a, b) => b.score - a.score)) {
        if (picked.length < PER && !seenCo.has(c.company)) { picked.push(c); seenCo.add(c.company); }
      }
      const jds = [];
      for (const c of picked) {
        try { jds.push({ ...c, ...(await fetchJD(page, c.url)) }); } catch (e) { log('  lỗi JD', c.url, e.message); }
        await jitter();
      }
      const okJd = jds.filter(j => ((j.sections || {})['Yêu cầu ứng viên'] || '').length > 40 || ((j.sections || {})['Mô tả công việc'] || '').length > 80);
      if (!okJd.length) {
        fails++;
        log(`#${n.id} ${n.nghe}: KHÔNG lấy được JD (fail liên tiếp ${fails})`);
        if (fails >= 3) { log('Dừng: nghi bị chặn/hết mạng. Chạy lại sau.'); break; }
        continue;
      }
      fails = 0;
      fs.writeFileSync(path.join(OUT, n.id + '.json'), JSON.stringify({ id: n.id, nhom: n.nhom, nghe: n.nghe, crawledAt: new Date().toISOString(), candidates: cand.size, thin: okJd.length < 4, jds: okJd }, null, 1));
      log(`#${n.id} ${n.nghe}: ${okJd.length} JD, độ liên quan TB ${(okJd.reduce((s, j) => s + j.score, 0) / okJd.length).toFixed(2)}`);
    }
  } finally { await browser.close().catch(() => {}); child.kill(); }
})().catch(e => { console.error(e); process.exit(1); });
