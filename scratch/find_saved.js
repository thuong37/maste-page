const fs = require('fs');
const js = fs.readFileSync('js/viec-lam.js', 'utf8');
const lines = js.split('\n');
lines.forEach((line, i) => {
  if (line.includes('getSavedJobs') || line.includes('savedJobs')) {
    console.log(`${i+1}: ${line}`);
  }
});
