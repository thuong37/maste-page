const fs = require('fs');

const files = [
  'chi-tiet-viec-lam.html',
  'public/chi-tiet-viec-lam.html',
  'js/chi-tiet-viec-lam.js',
  'public/js/chi-tiet-viec-lam.js',
  'js/viec-lam.js',
  'public/js/viec-lam.js'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(f, {
    hasPageHeaderTitle: c.includes('pageHeaderTitle'),
    hasBtnBackToGrid: c.includes('btn-back-to-grid'),
    hasBreadcrumbBelow: c.includes('detail-breadcrumb-below-search'),
    hasTargetBlank: c.includes('target="_blank"'),
    hasPopstate: c.includes('popstate')
  });
});
