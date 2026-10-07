const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('job-card') || l.includes('job-logo') || l.includes('80px') || l.includes('81px')) {
    if (l.length < 150) {
      console.log(`${i+1}: ${l.trim()}`);
    } else {
      console.log(`${i+1}: ${l.trim().substring(0, 140)}...`);
    }
  }
});
