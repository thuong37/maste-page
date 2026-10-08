// Single-source build: inject shared header/drawer into pages, then mirror to public/.
// Usage: node tools/build.js          (inject + sync)
//        node tools/build.js --init   (one-time: add markers around existing header/drawer)
//        node tools/build.js --check  (exit 1 if pages or public/ are out of date)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['index', 'viec-lam', 'chi-tiet-viec-lam', 'job-preview'];
const COPY_DIRS = ['css', 'js', 'assets'];
const COPY_FILES = ['favicon.png', 'vercel.json'];
const partial = (n) => fs.readFileSync(path.join(__dirname, 'partials', n), 'utf8').replace(/\r?\n$/, '');
const CURRENT = new Set(['viec-lam', 'chi-tiet-viec-lam', 'job-preview']); // pages under the "Tìm Việc" menu
const BLOCKS = {
  header: {
    begin: '<!-- @include:header -->', end: '<!-- @end:header -->',
    gen: (page) => partial('header.html')
      .replace('{{TIM_VIEC_CURRENT_CLASS}}', CURRENT.has(page) ? ' is-current' : '')
      .replace('{{TIM_VIEC_CURRENT_LABEL}}', CURRENT.has(page) ? ' (Trang hiện tại)' : ''),
  },
  drawer: { begin: '<!-- @include:drawer -->', end: '<!-- @end:drawer -->', gen: () => partial('drawer.html') },
};
const mode = process.argv[2] || '';
let dirty = false;

const read = (f) => fs.readFileSync(f, 'utf8');
function write(f, s) {
  if (mode === '--check') { dirty = true; console.log('OUT OF DATE:', path.relative(ROOT, f)); return; }
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, s);
  console.log('wrote', path.relative(ROOT, f));
}

function endOfBalancedDiv(s, start) {
  const re = /<div\b|<\/div>/g; re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(s))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  throw new Error('unbalanced drawer div');
}

function initMarkers(src) {
  if (src.includes(BLOCKS.header.begin)) return src;
  const hs = src.indexOf('<header class="site-header">');
  const he = src.indexOf('</header>', hs) + '</header>'.length;
  const ds = src.indexOf('<div id="mobile-drawer-overlay"');
  const de = endOfBalancedDiv(src, ds);
  const lineStart = (i) => src.lastIndexOf('\n', i) + 1;
  // keep the drawer first in the splice so offsets stay valid
  let out = src.slice(0, lineStart(ds)) + BLOCKS.drawer.begin + '\n' + BLOCKS.drawer.end + src.slice(de);
  out = out.slice(0, lineStart(hs)) + BLOCKS.header.begin + '\n' + BLOCKS.header.end + out.slice(he);
  return out;
}

function inject(src, page) {
  for (const b of Object.values(BLOCKS)) {
    const i = src.indexOf(b.begin), j = src.indexOf(b.end);
    if (i < 0 || j < 0) throw new Error(`${page}: missing ${b.begin} markers (run --init)`);
    src = src.slice(0, i + b.begin.length) + '\n' + b.gen(page) + '\n  ' + src.slice(j);
  }
  return src;
}

function mirror(rel) {
  const from = path.join(ROOT, rel), to = path.join(ROOT, 'public', rel);
  if (fs.statSync(from).isDirectory()) {
    for (const e of fs.readdirSync(from)) mirror(path.join(rel, e));
  } else if (!fs.existsSync(to) || !fs.readFileSync(from).equals(fs.readFileSync(to))) {
    if (mode === '--check') { dirty = true; console.log('OUT OF DATE:', path.join('public', rel)); }
    else { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); console.log('synced', rel); }
  }
}

for (const p of PAGES) {
  const f = path.join(ROOT, `${p}.html`);
  let src = read(f);
  if (mode === '--init') { fs.writeFileSync(f, initMarkers(src)); console.log('markers added:', p); continue; }
  const next = inject(src, p);
  if (next !== src) write(f, next);
}
if (mode !== '--init') {
  [...PAGES.map((p) => `${p}.html`), ...COPY_DIRS, ...COPY_FILES].forEach(mirror);
  if (mode === '--check' && dirty) process.exit(1);
  console.log(dirty ? '' : 'build OK');
}
