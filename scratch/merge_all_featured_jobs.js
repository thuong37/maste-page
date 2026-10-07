const fs = require('fs');
const vm = require('vm');

function loadArray(filename, varName) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/const fs = require\([^)]+\);/g, '');
  content = content.replace(`const ${varName}`, `global.${varName}`);
  eval(content);
}

loadArray('scratch/generate_jobs_data.js', 'salesJobs');
loadArray('scratch/build_it_jobs.js', 'itJobs');
loadArray('scratch/build_marketing_jobs.js', 'marketingJobs');
loadArray('scratch/build_finance_jobs.js', 'financeJobs');
loadArray('scratch/build_hr_jobs.js', 'hrJobs');

const allJobs = [...global.salesJobs, ...global.itJobs, ...global.marketingJobs, ...global.financeJobs, ...global.hrJobs];

console.log('Total jobs:', allJobs.length);
console.log('Sales jobs:', salesJobs.length);
console.log('IT jobs:', itJobs.length);
console.log('Marketing jobs:', marketingJobs.length);
console.log('Finance jobs:', financeJobs.length);
console.log('HR jobs:', hrJobs.length);

const ids = new Set();
let hasDuplicates = false;
for (const j of allJobs) {
  if (ids.has(j.id)) {
    console.error('Duplicate ID found:', j.id);
    hasDuplicates = true;
  }
  ids.add(j.id);
  if (!j.title || !j.company || !j.category || !j.salaryBadge || !j.location) {
    console.error('Missing field in job:', j.id);
  }
}
if (!hasDuplicates) {
  console.log('ALL 120 JOBS VALIDATED! No duplicate IDs.');
}
