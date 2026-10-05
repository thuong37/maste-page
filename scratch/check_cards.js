const fs = require('fs');

const html = fs.readFileSync('viec-lam.html', 'utf8');
const cardMatches = (html.match(/class="job-card/g) || []).length;
const bookmarkMatches = (html.match(/btn-card-bookmark/g) || []).length;
console.log('Total job-card in viec-lam.html:', cardMatches);
console.log('Total btn-card-bookmark in viec-lam.html:', bookmarkMatches);
