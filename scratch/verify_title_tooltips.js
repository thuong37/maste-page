const fs = require('fs');
const path = require('path');

const targets = [
  'index.html',
  'viec-lam.html',
  'chi-tiet-viec-lam.html',
  'public/index.html',
  'public/viec-lam.html',
  'public/chi-tiet-viec-lam.html'
];

let allPassed = true;

targets.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check 1: AI Match badge should be completely removed
  const hasAiMatch = content.includes('AI Match') && content.includes('badge-new">AI Match');
  if (hasAiMatch) {
    console.error(`FAIL: ${file} still contains AI Match badge!`);
    allPassed = false;
  } else {
    console.log(`PASS: ${file} has no AI Match badge.`);
  }

  // Check 2: No custom bubble markup left
  const hasCustomBubble = content.includes('dropdown-tooltip-bubble');
  if (hasCustomBubble) {
    console.error(`FAIL: ${file} still contains dropdown-tooltip-bubble!`);
    allPassed = false;
  } else {
    console.log(`PASS: ${file} has no dropdown-tooltip-bubble (clean).`);
  }

  // Check 3: Check title attributes on dropdown items
  const titleMatches = content.match(/class="dropdown-item"[^>]*title="[^"]+"/g) || 
                       content.match(/title="[^"]+"[^>]*class="dropdown-item"/g);
  console.log(`INFO: ${file} has ${titleMatches ? titleMatches.length : 0} dropdown-items with title attribute.`);
  if (!titleMatches || titleMatches.length < 15) {
    console.error(`FAIL: ${file} missing title attributes (found ${titleMatches ? titleMatches.length : 0} < 15)`);
    allPassed = false;
  } else {
    console.log(`PASS: ${file} has all 15 dropdown items with title tooltips.`);
  }
});

// Also check css/navbar.css
const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/navbar.css'), 'utf8');
if (cssContent.includes('.dropdown-tooltip-bubble')) {
  console.error('FAIL: css/navbar.css still has .dropdown-tooltip-bubble rules');
  allPassed = false;
} else {
  console.log('PASS: css/navbar.css is clean of bubble rules.');
}

if (allPassed) {
  console.log('\n=== ALL VERIFICATION CHECKS PASSED 100% ===');
} else {
  console.error('\n=== SOME CHECKS FAILED ===');
  process.exit(1);
}
