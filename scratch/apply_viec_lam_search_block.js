const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'js', 'viec-lam.js');
let js = fs.readFileSync(jsPath, 'utf8');

const blockPath = path.join(__dirname, 'viec_lam_search_block.js');
const replacementBlock = fs.readFileSync(blockPath, 'utf8');

const startMarkerStr = '// RECENT SEARCHES & SUGGEST DROPDOWN (Kế thừa từ Trang chủ)';
const endMarkerStr = '// Clear Keyword button';

const markerPos = js.indexOf(startMarkerStr);
if (markerPos === -1) {
  console.error('startMarkerStr not found');
  process.exit(1);
}

// Lấy dòng comment trước đó (// ============...)
const prevDivider = js.lastIndexOf('// =========================================================================', markerPos);
const startIndex = prevDivider !== -1 ? prevDivider : markerPos;

const endDivider = js.indexOf(endMarkerStr);
if (endDivider === -1) {
  console.error('endMarkerStr not found');
  process.exit(1);
}

const updatedJS = js.slice(0, startIndex) + replacementBlock + '\n\n  ' + js.slice(endDivider);
fs.writeFileSync(jsPath, updatedJS, 'utf8');
console.log('Successfully updated js/viec-lam.js via apply block');
