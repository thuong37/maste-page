const fs = require('fs');

['css/viec-lam.css', 'public/css/viec-lam.css'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const target = '/* Hàng Active Filter Chips */';
  const startIdx = content.indexOf(target);
  if (startIdx !== -1) {
    const endIdx = content.indexOf('/* --- 2-Column Layout (Job Listings + Right Ads Sidebar) --- */', startIdx);
    if (endIdx !== -1) {
      const oldCss = content.slice(startIdx, endIdx);
      const newCss = `/* Hàng Active Filter Chips (Đã ẩn theo yêu cầu người dùng) */
.active-filter-chips-row {
  display: none !important;
}

`;
      content = content.replace(oldCss, newCss);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully updated CSS in ' + file);
    } else {
      console.log('End target not found in ' + file);
    }
  } else {
    console.log('Start target not found in ' + file);
  }
});
