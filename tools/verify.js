// Quick visual check: serve the repo, take headless-Chrome screenshots of one page.
// Usage: node tools/verify.js <page> [width ...]   e.g.  node tools/verify.js viec-lam 1440 375
// Env: VERIFY_H=<px> window height; VERIFY_FULL=1 removes min-heights so a tall window shows the footer
// Output: scratch/shot-<page>-<width>.png  (scratch/ is git-ignored)
const http = require('http'), fs = require('fs'), path = require('path');
const { execFile } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const [page = 'index', ...w] = process.argv.slice(2);
const widths = w.length ? w.map(Number) : [1440, 375];

const run = (cmd, args, o) => new Promise((res, rej) => execFile(cmd, args, o, (e) => (e ? rej(e) : res())));
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  if (process.env.VERIFY_FULL && f.endsWith('.html')) { // drop min-height:100vh so tall window shows the footer
    return res.end(fs.readFileSync(f, 'utf8').replace('</head>', '<style>*{min-height:0!important}</style></head>'));
  }
  fs.createReadStream(f).pipe(res);
}).listen(0, async () => {
  const port = server.address().port;
  fs.mkdirSync(path.join(ROOT, 'scratch'), { recursive: true });
  for (const width of widths) {
    const out = path.join(ROOT, 'scratch', `shot-${page}-${width}.png`);
    await run(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${path.join(require('os').tmpdir(), 'easycv-verify-profile')}`, '--hide-scrollbars', `--window-size=${width},${process.env.VERIFY_H || 900}`,
      '--virtual-time-budget=4000', `--screenshot=${out}`, `http://localhost:${port}/${page}.html`], { timeout: 30000 });
    console.log('saved', path.relative(ROOT, out));
  }
  server.close();
});
