const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== VERIFY DESIGN FOUNDATION & BRAND PARITY ===\n');

// 1. Check tokens in design-tokens.css
const rootTokens = fs.readFileSync('assets/design-tokens.css', 'utf8');
const publicTokens = fs.readFileSync('public/assets/design-tokens.css', 'utf8');

assert.strictEqual(rootTokens, publicTokens, 'assets/design-tokens.css must match public/assets/design-tokens.css');
console.log('✔ Parity between root and public design-tokens.css: PASS');

const requiredTokens = [
  '--font-family-primary',
  '--font-family-stack',
  '--font-size-base: 14px',
  '--font-weight-base: 500',
  '--font-line-height-base: 22px',
  '--font-size-xs: 12px',
  '--font-size-sm: 13px',
  '--font-size-md: 14px',
  '--font-size-lg: 15px',
  '--font-size-xl: 16px',
  '--font-size-2xl: 18px',
  '--font-size-3xl: 20px',
  '--color-text-primary: #1E293B',
  '--color-text-secondary: #475569',
  '--color-text-tertiary: #F97316',
  '--color-text-inverse: #64748B',
  '--color-surface-base: #FFFFFF',
  '--color-surface-muted: #F8FAFC',
  '--color-surface-raised: #FFF7ED',
  '--color-surface-strong: #F1F5F9',
  '--space-1: 2px',
  '--space-2: 4px',
  '--space-3: 5px',
  '--space-4: 6px',
  '--space-5: 8px',
  '--space-6: 10px',
  '--space-7: 11px',
  '--space-8: 12px',
  '--radius-xs: 6px',
  '--radius-sm: 8px',
  '--radius-md: 10px',
  '--radius-lg: 22px',
  '--radius-xl: 32.29px',
  '--radius-2xl: 44px',
  '--radius-step7: 50px',
  '--radius-step8: 56px',
  '--shadow-1: 0px 0px 12px 0px rgba(0, 0, 0, 0.1)',
  '--motion-duration-instant: 200ms'
];

requiredTokens.forEach(tok => {
  assert(rootTokens.includes(tok), `Missing token: ${tok}`);
});
console.log('✔ All 37 required design foundation tokens verified: PASS');

// 2. Verify Google Font Inter import
assert(rootTokens.includes('fonts.googleapis.com/css2?family=Inter'), 'Inter font not imported in design-tokens.css');
const navbarCss = fs.readFileSync('css/navbar.css', 'utf8');
assert(navbarCss.includes('fonts.googleapis.com/css2?family=Inter'), 'Inter font not imported in navbar.css');
console.log('✔ Google Font Inter imported in CSS stylesheets: PASS');

// 3. Verify HTML files have Inter links and token references
const htmlFiles = [
  'index.html', 'public/index.html',
  'viec-lam.html', 'public/viec-lam.html',
  'chi-tiet-viec-lam.html', 'public/chi-tiet-viec-lam.html'
];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  assert(content.includes('family=Inter'), `${f} missing Inter font link`);
  assert(content.includes('design-tokens.css'), `${f} missing design-tokens.css link`);
});
console.log('✔ All 6 HTML files linked to Inter font and design tokens: PASS');

// 4. Verify no competitor green colors in any HTML/CSS files
const competitorTargets = ['#00B14F', '#009643', '#E6F7ED'];
const scanDirs = ['css', 'public/css'];
const allFilesToScan = [
  ...htmlFiles,
  'css/navbar.css', 'public/css/navbar.css',
  'css/home.css', 'public/css/home.css',
  'css/viec-lam.css', 'public/css/viec-lam.css'
];

let competitorFound = 0;
allFilesToScan.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  competitorTargets.forEach(target => {
    if (content.toLowerCase().includes(target.toLowerCase())) {
      console.error(`❌ Competitor color ${target} found in ${f}`);
      competitorFound++;
    }
  });
});

assert.strictEqual(competitorFound, 0, 'No competitor green colors should remain in production assets');
console.log('✔ Zero competitor green colors (#00B14F, #009643, #E6F7ED) found: PASS');

// 5. Verify Parity between root and public
const pairs = [
  ['css/navbar.css', 'public/css/navbar.css'],
  ['css/home.css', 'public/css/home.css'],
  ['css/viec-lam.css', 'public/css/viec-lam.css'],
  ['assets/design-tokens.json', 'public/assets/design-tokens.json']
];

pairs.forEach(([r, p]) => {
  const rc = fs.readFileSync(r, 'utf8');
  const pc = fs.readFileSync(p, 'utf8');
  assert.strictEqual(rc, pc, `${r} does not match ${p}`);
});
console.log('✔ 100% SHA Parity across all root and public asset pairs: PASS');

console.log('\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
