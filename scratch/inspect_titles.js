const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Let's find all section titles in the body of index.html
// From line 1800 to end
const lines = html.split('\n');

console.log('--- SECTION TITLES IN index.html ---');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<section') || line.includes('class="home-section') || line.includes('section-title') || line.includes('cv-template-title') || line.includes('infeed-vip')) {
    // print next 5 lines
    console.log(`Line ${i+1}:`);
    for (let j = Math.max(0, i - 1); j <= Math.min(lines.length - 1, i + 4); j++) {
      console.log(`  [${j+1}] ${lines[j].trim()}`);
    }
    console.log('----------------');
  }
}
