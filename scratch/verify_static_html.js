const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count job cards in static HTML
  const cardMatches = content.match(/<article class="job-card[\s\S]*?<\/article>/g);
  const count = cardMatches ? cardMatches.length : 0;
  
  // Check pagination wrapper
  const hasPaginationWrapper = content.includes('id="paginationWrapper"');
  
  // Check count text
  const countTextMatch = content.match(/<strong id="jobCountText">(\d+)<\/strong>/);
  const countText = countTextMatch ? countTextMatch[1] : null;

  console.log(`[${path.basename(filePath)}]`);
  console.log(` - Static Job Cards: ${count}`);
  console.log(` - Has #paginationWrapper: ${hasPaginationWrapper}`);
  console.log(` - jobCountText: ${countText}`);

  if (count !== 25) {
    throw new Error(`Expected exactly 25 static cards in ${filePath}, but found ${count}`);
  }
}

checkFile(path.join(__dirname, '..', 'viec-lam.html'));
checkFile(path.join(__dirname, '..', 'public', 'viec-lam.html'));
console.log('Static HTML verification PASSED!');
