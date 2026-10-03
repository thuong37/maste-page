const fs = require('fs');
const { getCanonicalHeader, getCanonicalDrawer } = require('./nav_template.js');

function replaceHeaderAndDrawer(filePath, pageType) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCRLF = content.includes('\r\n');
  const newline = isCRLF ? '\r\n' : '\n';

  // Find header
  const headerStart = content.indexOf('<header class="site-header">');
  if (headerStart === -1) {
    throw new Error(`Cannot find <header class="site-header"> in ${filePath}`);
  }
  const headerEnd = content.indexOf('</header>', headerStart) + '</header>'.length;

  const newHeader = getCanonicalHeader(pageType).replace(/\r?\n/g, newline);
  const newDrawer = getCanonicalDrawer().replace(/\r?\n/g, newline);

  // Check if mobile-drawer-overlay exists
  const drawerStart = content.indexOf('<div id="mobile-drawer-overlay"');
  if (drawerStart !== -1) {
    // Has existing drawer, find its end
    // Typically followed by </main> or <main
    const mainStart = content.indexOf('<main', drawerStart);
    if (mainStart === -1) {
      throw new Error(`Cannot find <main after drawer in ${filePath}`);
    }
    // Replace from headerStart to mainStart
    const before = content.slice(0, headerStart);
    const after = content.slice(mainStart);
    content = before + newHeader + newline + newline + newDrawer + newline + newline + '  ' + after;
  } else {
    // No drawer, replace header and insert drawer before <main
    const before = content.slice(0, headerStart);
    const mainStart = content.indexOf('<main', headerEnd);
    if (mainStart === -1) {
      throw new Error(`Cannot find <main after header in ${filePath}`);
    }
    const after = content.slice(mainStart);
    content = before + newHeader + newline + newline + newDrawer + newline + newline + '  ' + after;
  }

  return content;
}

console.log('Testing header replacement on index.html, viec-lam.html, chi-tiet-viec-lam.html...');

['index.html', 'viec-lam.html', 'chi-tiet-viec-lam.html'].forEach(file => {
  const pageType = file.replace('.html', '');
  const updated = replaceHeaderAndDrawer(file, pageType);
  console.log(file, 'original length:', fs.readFileSync(file, 'utf8').length, 'new length:', updated.length);
  // Verify essential IDs are present
  const requiredIds = ['navbarBrandLogo', 'navLinkTimViec', 'dropdownItemTimKiemViecLam', 'notif-btn', 'notif-panel', 'message-btn', 'message-panel', 'account-logged-view', 'user-profile-btn', 'mobile-toggle-btn', 'mobile-drawer-overlay', 'mobile-drawer-close'];
  const missing = requiredIds.filter(id => !updated.includes(id));
  if (missing.length > 0) {
    console.error(`ERROR: ${file} is missing IDs:`, missing);
  } else {
    console.log(`SUCCESS: ${file} contains all ${requiredIds.length} required elements!`);
  }
});
