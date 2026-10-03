const fs = require('fs');
const path = require('path');

// Read JOBS_DATA from js/chi-tiet-viec-lam.js
const ctJs = fs.readFileSync('js/chi-tiet-viec-lam.js', 'utf8');
const match = ctJs.match(/const JOBS_DATA = (\[[\s\S]*?\]);\s*\n\s*\/\/ Helper Toast/);
if (!match) {
  console.error('Could not find JOBS_DATA in js/chi-tiet-viec-lam.js');
  process.exit(1);
}

const JOBS_DATA = eval(match[1]);
console.log(`Loaded ${JOBS_DATA.length} jobs from JOBS_DATA`);

// Generate related jobs HTML
function generateRelatedFeed(activeJobId) {
  return JOBS_DATA.slice(0, 16).map(job => {
    const isSelected = job.id === activeJobId;
    const salaryOrangeClass = job.salaryIsOrange ? 'orange' : '';
    const safeTitle = job.title.replace(/"/g, '&quot;');
    const urlTitle = encodeURIComponent(job.title);

    return `
          <div class="split-job-card ${isSelected ? 'is-selected' : ''}" data-id="${job.id}">
            ${isSelected ? `<span class="split-active-badge">👁 Đang xem</span>` : ''}
            <div class="split-card-top">
              <img src="${job.logo}" alt="${job.company}" class="split-company-logo" loading="lazy" />
              <div class="split-card-info">
                <h4 class="split-card-title">
                  <a href="chi-tiet-viec-lam.html?id=${job.id}&title=${urlTitle}" class="job-title-link">${safeTitle}</a>
                </h4>
                <div class="split-card-company">${job.company}</div>
                <div class="split-card-badges">
                  <span class="job-salary-badge ${salaryOrangeClass}" style="font-size: 12px; padding: 2px 7px;">${job.salaryBadge}</span>
                  <span class="badge-ai-match" style="font-size: 11px; padding: 2px 6px;">🎯 ${job.aiMatch}%</span>
                </div>
              </div>
            </div>
            <div class="split-card-bottom">
              <span class="split-card-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${job.city}</span>
              </span>
              <span style="font-size: 11.5px; color: #94A3B8;">${job.updated}</span>
            </div>
          </div>`;
  }).join('\n');
}

// Generate default Job 1 detail content
const defaultJob = JOBS_DATA[0];
const expMap = { '0': 'Không yêu cầu', 'under1': 'Dưới 1 năm', '1-3': '1 - 3 năm', '3-5': '3 - 5 năm', 'over5': 'Trên 5 năm' };
const levelMap = { 'intern': 'Thực tập sinh', 'junior': 'Nhân viên', 'senior': 'Trưởng nhóm / Senior', 'manager': 'Trưởng phòng / Manager' };
const typeMap = { 'fulltime': 'Toàn thời gian', 'hybrid': 'Kết hợp (Hybrid)', 'remote': 'Từ xa (Remote 100%)', 'parttime': 'Bán thời gian' };

const expText = expMap[defaultJob.exp] || `${defaultJob.exp} năm`;
const levelText = levelMap[defaultJob.level] || defaultJob.level;
const typeText = typeMap[defaultJob.type] || defaultJob.type;

const descHtml = defaultJob.jd.desc.map(d => `              <li>${d}</li>`).join('\n');
const reqsHtml = defaultJob.jd.reqs.map(r => `              <li>${r}</li>`).join('\n');
const perksHtml = defaultJob.jd.perks.map(p => `              <li>${p}</li>`).join('\n');
const skillsHtml = defaultJob.skills.map(s => `              <span class="detail-skill-tag">${s}</span>`).join('\n');
const relatedFeedHtml = generateRelatedFeed(defaultJob.id);

console.log('Sample desc items:', defaultJob.jd.desc.length);
console.log('Sample related feed items:', 16);
