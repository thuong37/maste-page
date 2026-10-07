const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function getHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

const pairs = [
  ['index.html', 'public/index.html'],
  ['css/home.css', 'public/css/home.css'],
  ['js/home.js', 'public/js/home.js']
];

console.log('--- SHA-256 Parity Check ---');
let allMatch = true;
for (const [src, pub] of pairs) {
  const h1 = getHash(path.join(__dirname, '..', src));
  const h2 = getHash(path.join(__dirname, '..', pub));
  const match = h1 === h2;
  console.log(`${src} <=> ${pub}: ${match ? 'MATCH ✅' : 'MISMATCH ❌'}`);
  if (!match) allMatch = false;
}

if (!allMatch) {
  console.error('SHA-256 parity check failed!');
  process.exit(1);
}

console.log('\n--- DOM Structure Verification ---');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const checks = [
  { name: 'Section #cong-ty-tieu-bieu exists', test: html.includes('id="cong-ty-tieu-bieu"') },
  { name: 'Header top-companies-header exists', test: html.includes('top-companies-header') },
  { name: 'companies-header-actions exists', test: html.includes('companies-header-actions') },
  { name: 'companies-carousel-controls exists', test: html.includes('companies-carousel-controls') },
  { name: 'companies-carousel-prev button exists', test: html.includes('companies-carousel-prev') },
  { name: 'companies-carousel-next button exists', test: html.includes('companies-carousel-next') },
  { name: 'id="companies-track" exists', test: html.includes('id="companies-track"') },
  { name: 'companies-carousel-status exists', test: html.includes('companies-carousel-status') },
  { name: 'Xem tat ca link present in header actions', test: html.includes('class="section-view-all">Xem tất cả</a>') },
  { name: 'aria-controls="companies-track" present', test: html.includes('aria-controls="companies-track"') }
];

let allPassed = true;
for (const c of checks) {
  console.log(`${c.name}: ${c.test ? 'PASS ✅' : 'FAIL ❌'}`);
  if (!c.test) allPassed = false;
}

if (!allPassed) {
  console.error('DOM structure check failed!');
  process.exit(1);
}

console.log('\nAll static checks PASSED! 🎉');
