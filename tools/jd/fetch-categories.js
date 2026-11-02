/**
 * Lấy cây danh mục nghề chuẩn của TopCV (tên → URL dạng ...-cr<nhóm>cb<nghề>[cl<vị trí>]).
 *   node tools/jd/fetch-categories.js   → assets/data/topcv-category-urls.json
 * Nguồn: các link <a class="list-item"> trong menu "Danh mục nghề" trên trang chủ tìm việc.
 */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const PORT = +(process.argv[2] || 9343);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
function pup() {
  for (const b of [ROOT + '/node_modules', ROOT + '/.qwen/tmp/node_modules', os.homedir() + '/.qwen/tmp/node_modules', ROOT + '/tools/topcv/node_modules'])
    try { return require(require.resolve('puppeteer-core', { paths: [b] })); } catch (_) { /* tiếp */ }
  throw new Error('thiếu puppeteer-core');
}
(async () => {
  const child = spawn(edge, [`--remote-debugging-port=${PORT}`, '--user-data-dir=' + path.join(os.tmpdir(), 'jd-cat-' + PORT), '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let v;
  for (let i = 0; i < 60 && !v; i++) {
    try { v = await new Promise((res, rej) => http.get(`http://127.0.0.1:${PORT}/json/version`, r => { let d = ''; r.on('data', x => { d += x; }); r.on('end', () => res(JSON.parse(d))); }).on('error', rej)); } catch (_) { await sleep(500); }
  }
  const browser = await pup().connect({ browserWSEndpoint: v.webSocketDebuggerUrl, defaultViewport: null });
  try {
    const p = (await browser.pages())[0];
    await p.goto('https://www.topcv.vn/tim-viec-lam-moi-nhat', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForSelector('a.list-item', { timeout: 20000 }).catch(() => {});
    await sleep(2000);
    const links = await p.evaluate(() => [...document.querySelectorAll('a.list-item')].map(a => ({ name: (a.title || '').replace(/^Tìm việc làm\s*/, '').trim(), url: a.href })).filter(x => /-cr\d+cb\d+(cl\d+)?$/.test(x.url)));
    const seen = new Map();
    for (const l of links) {
      const m = /-cr(\d+)cb(\d+)(?:cl(\d+))?$/.exec(l.url);
      const key = `${m[1]}/${m[2]}/${m[3] || ''}`;
      if (!seen.has(key)) seen.set(key, { name: l.name, url: l.url, cr: +m[1], cb: +m[2], cl: m[3] ? +m[3] : null });
    }
    const all = [...seen.values()];
    fs.writeFileSync(path.join(ROOT, 'assets', 'data', 'topcv-category-urls.json'), JSON.stringify(all, null, 1));
    console.log('nghề (cr+cb):', all.filter(x => !x.cl).length, '| vị trí (cr+cb+cl):', all.filter(x => x.cl).length);
  } finally { await browser.close().catch(() => {}); child.kill(); }
})().catch(e => { console.error(e); process.exit(1); });
