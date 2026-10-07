const fs = require('fs');

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

const jobsDataJson = JSON.stringify(allJobs, null, 6);

// Format with proper indentation
const codeBlock = `    // Kho dữ liệu chuẩn 120 việc làm phong phú cho 5 ngành nghề hàng đầu (24 việc làm / ngành)
    const FEATURED_JOBS_DATA = ${jobsDataJson};`;

fs.writeFileSync('scratch/featured_jobs_code.js', codeBlock, 'utf8');
console.log('Saved scratch/featured_jobs_code.js, size:', codeBlock.length);
