const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- SECTIONS & HEADINGS IN index.html ---');
lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (/<(h[1-6]|section)/i.test(trimmed) || /class="[^"]*title[^"]*"/i.test(trimmed)) {
    console.log(`${idx + 1}: ${trimmed.substring(0, 140)}`);
  }
});
