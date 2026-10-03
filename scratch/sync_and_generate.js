const fs = require('fs');
const path = require('path');

// 1. Read js/viec-lam.js
const viecLamJsPath = path.join(__dirname, '..', 'js', 'viec-lam.js');
let viecLamJs = fs.readFileSync(viecLamJsPath, 'utf8');

// Fix paginationWrapper selector
if (viecLamJs.includes("const paginationWrapper = document.getElementById('paginationWrapper');")) {
  viecLamJs = viecLamJs.replace(
    "const paginationWrapper = document.getElementById('paginationWrapper');",
    "const paginationWrapper = document.getElementById('paginationWrapper') || document.querySelector('.pagination-wrapper');"
  );
  fs.writeFileSync(viecLamJsPath, viecLamJs, 'utf8');
  console.log('Fixed paginationWrapper selector in js/viec-lam.js');
}

// 2. Extract JOBS_DATA
const match = viecLamJs.match(/const JOBS_DATA = (\[[\s\S]*?\n  \];)/);
if (!match) {
  console.error('Could not extract JOBS_DATA from js/viec-lam.js');
  process.exit(1);
}
const jobsDataRaw = match[1];
// Evaluate JOBS_DATA safely in isolated function
const JOBS_DATA = eval(jobsDataRaw.slice(0, -1)); // remove trailing semicolon
console.log(`Successfully parsed JOBS_DATA with ${JOBS_DATA.length} jobs.`);

if (JOBS_DATA.length < 25) {
  console.error('JOBS_DATA has fewer than 25 jobs!');
  process.exit(1);
}

// 3. Sync to public/js/viec-lam.js
const publicViecLamJsPath = path.join(__dirname, '..', 'public', 'js', 'viec-lam.js');
let publicViecLamJs = fs.readFileSync(publicViecLamJsPath, 'utf8');
if (publicViecLamJs.includes("const paginationWrapper = document.getElementById('paginationWrapper');")) {
  publicViecLamJs = publicViecLamJs.replace(
    "const paginationWrapper = document.getElementById('paginationWrapper');",
    "const paginationWrapper = document.getElementById('paginationWrapper') || document.querySelector('.pagination-wrapper');"
  );
}
fs.writeFileSync(publicViecLamJsPath, viecLamJs, 'utf8');
console.log('Synced js/viec-lam.js -> public/js/viec-lam.js');

// 4. Update js/chi-tiet-viec-lam.js and public/js/chi-tiet-viec-lam.js
function updateChiTietJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const ctMatch = content.match(/const JOBS_DATA = \[[\s\S]*?\n  \];/);
  if (!ctMatch) {
    console.error(`Could not find JOBS_DATA in ${filePath}`);
    return;
  }
  content = content.replace(ctMatch[0], `const JOBS_DATA = ${jobsDataRaw}`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated JOBS_DATA in ${filePath}`);
}
updateChiTietJs(path.join(__dirname, '..', 'js', 'chi-tiet-viec-lam.js'));
updateChiTietJs(path.join(__dirname, '..', 'public', 'js', 'chi-tiet-viec-lam.js'));

// 5. Generate 25 static job cards for HTML
const first25Jobs = JOBS_DATA.slice(0, 25);
const staticCardsHtml = first25Jobs.map(job => {
  const featuredClass = job.isFeatured ? 'is-featured' : '';
  const salaryOrangeClass = job.salaryIsOrange ? 'orange' : '';
  const urgentBadge = job.isUrgent
    ? `<span class="job-meta-item" style="color: #F97316; font-weight: 600;">⚡ Tuyển gấp</span>`
    : '';

  const skillChips = job.skills
    .map(s => `<span class="job-skill-chip">${s}</span>`)
    .join('\n                ');

  return `          <!-- Card ${job.id}: ${job.title} -->
          <article class="job-card ${featuredClass}" data-id="${job.id}">
            <div class="job-card-top">
              <img src="${job.logo}" alt="${job.company}" class="job-company-logo" loading="lazy" />
              <div class="job-info-main">
                <div class="job-title-row">
                  <h3 class="job-title"><a href="chi-tiet-viec-lam.html?id=${job.id}" target="_blank" class="job-title-link" title="Click để mở tab chi tiết riêng">${job.title}</a></h3>
                  <div class="job-badges-group">
                    <span class="job-salary-badge ${salaryOrangeClass}">${job.salaryBadge}</span>
                  </div>
                </div>
                <div class="job-company-row">
                  <span class="job-company-name">${job.company}</span>
                  ${job.verified ? `<span class="badge-verified" title="Doanh nghiệp xác thực">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#FFF" stroke-width="2"/></svg>
                  </span>` : ''}
                </div>
                <div class="job-meta-row">
                  <span class="job-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="job-location-text">${job.location}</span>
                  </span>
                  <span class="job-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Cập nhật ${job.updated}</span>
                  </span>
                  ${urgentBadge}
                </div>
              </div>
            </div>
            <div class="job-card-bottom">
              <div class="job-skills-tags">
                ${skillChips}
              </div>
              <div class="job-card-actions">
                <button type="button" class="btn-card-bookmark" data-id="${job.id}" aria-label="Lưu công việc" title="Lưu công việc">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
                <button type="button" class="btn-card-apply" data-id="${job.id}">Ứng tuyển</button>
              </div>
            </div>
          </article>`;
}).join('\n\n');

// 6. Update viec-lam.html and public/viec-lam.html
function updateViecLamHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Update count
  html = html.replace(
    /<strong id="jobCountText">\d+<\/strong>/g,
    `<strong id="jobCountText">${JOBS_DATA.length}</strong>`
  );

  // Update no results reset button count
  html = html.replace(
    /Xem tất cả \d+ việc làm/g,
    `Xem tất cả ${JOBS_DATA.length} việc làm`
  );

  // Update pagination wrapper id and initial page buttons
  const oldPaginationRegex = /<div class="pagination-wrapper"[\s\S]*?<\/div>/;
  const newPaginationHtml = `<div class="pagination-wrapper" id="paginationWrapper">
          <button type="button" class="page-btn disabled" data-page="prev" disabled>« Trước</button>
          <button type="button" class="page-btn active" data-page="1">1</button>
          <button type="button" class="page-btn" data-page="2">2</button>
          <button type="button" class="page-btn" data-page="next">Sau »</button>
        </div>`;
  html = html.replace(oldPaginationRegex, newPaginationHtml);

  // Replace cards in jobListingGrid
  const gridStart = html.indexOf('<div class="job-listing-grid" id="jobListingGrid">');
  if (gridStart === -1) {
    console.error(`Could not find #jobListingGrid in ${filePath}`);
    return;
  }
  const noResultsIdx = html.indexOf('<div class="no-results-box" id="noResultsBox"', gridStart);
  if (noResultsIdx === -1) {
    console.error(`Could not find #noResultsBox in ${filePath}`);
    return;
  }

  const prefix = html.substring(0, gridStart + '<div class="job-listing-grid" id="jobListingGrid">\n\n'.length);
  const suffix = html.substring(noResultsIdx);
  const updatedHtml = prefix + staticCardsHtml + '\n\n          ' + suffix;

  fs.writeFileSync(filePath, updatedHtml, 'utf8');
  console.log(`Updated ${filePath} with 25 static cards!`);
}

updateViecLamHtml(path.join(__dirname, '..', 'viec-lam.html'));
updateViecLamHtml(path.join(__dirname, '..', 'public', 'viec-lam.html'));

console.log('ALL SYNCS AND GENERATIONS FINISHED SUCCESSFULLY!');
