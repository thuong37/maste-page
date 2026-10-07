const fs = require('fs');

const files = [
  'index.html',
  'viec-lam.html',
  'chi-tiet-viec-lam.html',
  'js/home.js',
  'js/viec-lam.js',
  'js/job-detail-search.js'
];

const report = {};

files.forEach(file => {
  const text = fs.readFileSync(file, 'utf8');
  const imgRegex = /<img\b([^>]*)>/gi;
  const list = [];
  let match;
  while ((match = imgRegex.exec(text)) !== null) {
    const attrs = match[1];
    const srcMatch = attrs.match(/src="([^"]*)"/i) || attrs.match(/src='([^']*)'/i);
    const altMatch = attrs.match(/alt="([^"]*)"/i) || attrs.match(/alt='([^']*)'/i);
    const classMatch = attrs.match(/class="([^"]*)"/i);
    const idMatch = attrs.match(/id="([^"]*)"/i);
    list.push({
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : '',
      cls: classMatch ? classMatch[1] : '',
      id: idMatch ? idMatch[1] : ''
    });
  }
  report[file] = list;
});

console.log(JSON.stringify(report, null, 2));
