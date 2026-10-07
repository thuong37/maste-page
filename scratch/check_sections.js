const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let currentSection = '';
lines.forEach((l, i) => {
  if (l.includes('<section')) currentSection = l.trim();
  if (l.includes('class="job-card') || l.includes("class='job-card'")) {
    console.log(`Line ${i+1} in ${currentSection}: ${l.trim().substring(0, 80)}`);
  }
});
