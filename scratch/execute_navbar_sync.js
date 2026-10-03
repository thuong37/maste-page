const fs = require('fs');
const { getCanonicalHeader, getCanonicalDrawer } = require('./nav_template.js');

function syncFile(filePath, pageType) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCRLF = content.includes('\r\n');
  const newline = isCRLF ? '\r\n' : '\n';

  // 1. Update css & js versions
  content = content.replace(/href="css\/navbar\.css(?:\?[^"]*)?"/g, 'href="css/navbar.css?v=7.0_synced_navbar"');
  content = content.replace(/src="js\/navbar\.js(?:\?[^"]*)?"/g, 'src="js/navbar.js?v=7.0_synced_navbar"');

  // 2. Locate header
  const headerStart = content.indexOf('<header class="site-header">');
  if (headerStart === -1) {
    throw new Error(`Cannot find <header class="site-header"> in ${filePath}`);
  }
  const headerEnd = content.indexOf('</header>', headerStart) + '</header>'.length;

  const newHeader = getCanonicalHeader(pageType).replace(/\r?\n/g, newline);
  const newDrawer = getCanonicalDrawer().replace(/\r?\n/g, newline);

  // 3. Locate mobile drawer if present
  const drawerStart = content.indexOf('<div id="mobile-drawer-overlay"');
  if (drawerStart !== -1) {
    const mainStart = content.indexOf('<main', drawerStart);
    if (mainStart === -1) {
      throw new Error(`Cannot find <main after drawer in ${filePath}`);
    }
    const before = content.slice(0, headerStart);
    const after = content.slice(mainStart);
    content = before + newHeader + newline + newline + newDrawer + newline + newline + '  ' + after;
  } else {
    const mainStart = content.indexOf('<main', headerEnd);
    if (mainStart === -1) {
      throw new Error(`Cannot find <main after header in ${filePath}`);
    }
    const before = content.slice(0, headerStart);
    const after = content.slice(mainStart);
    content = before + newHeader + newline + newline + newDrawer + newline + newline + '  ' + after;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath} successfully (size: ${content.length})`);
}

const targets = [
  { file: 'index.html', type: 'index' },
  { file: 'viec-lam.html', type: 'viec-lam' },
  { file: 'chi-tiet-viec-lam.html', type: 'chi-tiet-viec-lam' },
  { file: 'public/index.html', type: 'index' },
  { file: 'public/viec-lam.html', type: 'viec-lam' },
  { file: 'public/chi-tiet-viec-lam.html', type: 'chi-tiet-viec-lam' },
];

targets.forEach(({ file, type }) => {
  syncFile(file, type);
});

// Verification step
console.log('\n--- VERIFICATION OF KEY IDS ---');
const requiredIds = [
  'navbarBrandLogo',
  'navLinkTimViec',
  'dropdownItemTimKiemViecLam',
  'notif-btn',
  'notif-panel',
  'message-btn',
  'message-panel',
  'account-logged-view',
  'user-profile-btn',
  'mobile-toggle-btn',
  'mobile-drawer-overlay',
  'mobile-drawer-close'
];

let allPassed = true;
targets.forEach(({ file }) => {
  const content = fs.readFileSync(file, 'utf8');
  const missing = requiredIds.filter(id => !content.includes(id));
  if (missing.length > 0) {
    console.error(`FAILED: ${file} is missing:`, missing);
    allPassed = false;
  } else {
    console.log(`PASSED: ${file} contains all 12 key IDs.`);
  }
});

if (allPassed) {
  console.log('\nALL 6 FILES SUCCESSFULLY SYNCHRONIZED!');
} else {
  process.exit(1);
}
