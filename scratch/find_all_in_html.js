const fs = require('fs');

const h1 = fs.readFileSync('viec-lam.html', 'utf8');
const h2 = fs.readFileSync('public/viec-lam.html', 'utf8');

console.log('viec-lam.html card bookmark ribbons:', (h1.match(/class="btn-card-bookmark"[^>]*>[\s\S]*?m19 21-7-4-7/g) || []).length);
console.log('viec-lam.html card bookmark hearts:', (h1.match(/class="btn-card-bookmark"[^>]*>[\s\S]*?M19 14c1.49-1.46/g) || []).length);
console.log('public/viec-lam.html card bookmark ribbons:', (h2.match(/class="btn-card-bookmark"[^>]*>[\s\S]*?m19 21-7-4-7/g) || []).length);
console.log('public/viec-lam.html card bookmark hearts:', (h2.match(/class="btn-card-bookmark"[^>]*>[\s\S]*?M19 14c1.49-1.46/g) || []).length);
