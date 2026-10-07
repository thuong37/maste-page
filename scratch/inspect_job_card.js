const fs = require('fs');

console.log("=== INSPECTING HOME.JS FOR JOB CARDS ===");
const js = fs.readFileSync('js/home.js', 'utf8');
const jsLines = js.split('\n');
jsLines.forEach((l, i) => {
  if (l.includes('job-card') || l.includes('featuredJobsGrid') || l.includes('renderFeaturedJob')) {
    if (l.length < 150) {
      console.log(`${i+1}: ${l.trim()}`);
    } else {
      console.log(`${i+1}: ${l.trim().substring(0, 140)}...`);
    }
  }
});

console.log("\n=== INSPECTING HOME.CSS FOR JOB CARDS ===");
const css = fs.readFileSync('css/home.css', 'utf8');
const cssLines = css.split('\n');
cssLines.forEach((l, i) => {
  if (l.includes('.job-card') || l.includes('.jobs-grid')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
