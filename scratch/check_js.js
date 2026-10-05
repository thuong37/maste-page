const fs = require('fs');

const js = fs.readFileSync('js/viec-lam.js', 'utf8');
const bookmarkInJs = (js.match(/btn-card-bookmark/g) || []).length;
console.log('Total btn-card-bookmark in js/viec-lam.js:', bookmarkInJs);
