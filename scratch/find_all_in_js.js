const fs = require('fs');

const js1 = fs.readFileSync('js/viec-lam.js', 'utf8');
const js2 = fs.readFileSync('public/js/viec-lam.js', 'utf8');

console.log('js/viec-lam.js has ribbon path:', js1.includes('m19 21-7-4-7'));
console.log('js/viec-lam.js has heart path:', js1.includes('M19 14c1.49-1.46'));
console.log('public/js/viec-lam.js has ribbon path:', js2.includes('m19 21-7-4-7'));
console.log('public/js/viec-lam.js has heart path:', js2.includes('M19 14c1.49-1.46'));
