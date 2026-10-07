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

const FEATURED_JOBS_DATA = [...global.salesJobs, ...global.itJobs, ...global.marketingJobs, ...global.financeJobs, ...global.hrJobs];

function calculateJobRank(job, isLogged) {
  let score = 0;
  if (job.isLightningBadge) score += 60;
  if (job.verified) score += 20;
  if (job.salaryIsOrange) score += 15;
  if (job.aiMatch) score += Math.round(job.aiMatch * 0.5);
  if (job.updated.includes('phút')) score += 25;
  else if (job.updated.includes('1 giờ') || job.updated.includes('2 giờ')) score += 15;
  return score;
}

function getRankedJobsForCategory(categoryKey, isLogged = false) {
  if (categoryKey === 'all') {
    // Lấy cân bằng các ngành nghề hàng đầu cho tab Tất cả: 6 IT, 6 Sales, 4 Marketing, 4 Finance, 4 HR = 24 jobs
    const categories = ['it', 'sales', 'marketing', 'finance', 'hr'];
    const quota = { it: 6, sales: 6, marketing: 4, finance: 4, hr: 4 };
    
    let selected = [];
    categories.forEach(cat => {
      const catJobs = FEATURED_JOBS_DATA.filter(j => j.category === cat)
        .map(j => ({ ...j, priorityScore: calculateJobRank(j, isLogged) }))
        .sort((a, b) => b.priorityScore - a.priorityScore);
      selected.push(...catJobs.slice(0, quota[cat]));
    });

    // Sắp xếp tổng thể theo điểm ưu tiên để các job hot nhất hiển thị trước
    selected.sort((a, b) => b.priorityScore - a.priorityScore);
    return selected.slice(0, 24);
  }

  // Từng ngành nghề riêng: lấy 24 việc làm của ngành đó
  const filtered = FEATURED_JOBS_DATA.filter(j => j.category === categoryKey);
  const scored = filtered.map(j => ({ ...j, priorityScore: calculateJobRank(j, isLogged) }));
  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  return scored.slice(0, 24);
}

const tabs = ['all', 'sales', 'it', 'marketing', 'finance', 'hr'];
tabs.forEach(tab => {
  const jobs = getRankedJobsForCategory(tab);
  console.log(`Tab: "${tab}", Total Jobs: ${jobs.length}, Pages (12/page): ${Math.ceil(jobs.length / 12)}`);
  if (tab === 'all') {
    const cats = {};
    jobs.forEach(j => cats[j.category] = (cats[j.category] || 0) + 1);
    console.log('  Breakdown for "all":', cats);
  }
});
