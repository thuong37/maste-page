const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const homeCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'home.css'), 'utf8');
const homeJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'home.js'), 'utf8');

const publicIndexHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const publicHomeCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'home.css'), 'utf8');
const publicHomeJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'home.js'), 'utf8');

console.log('--- TEST 1: Check HTML for .btn-follow-company inside .company-cover ---');
const coverFollowRegex = /<div class="company-cover"[^>]*>[\s\S]*?<button class="btn-follow-company"[\s\S]*?<\/button>[\s\S]*?<\/div>/g;
const coverFollowMatches = indexHtml.match(coverFollowRegex);
console.log('Cover Follow matches in index.html:', coverFollowMatches ? coverFollowMatches.length : 0);
if (!coverFollowMatches || coverFollowMatches.length !== 4) {
  console.error('FAIL: Expected 4 company-cover with follow buttons in index.html');
  process.exit(1);
}

console.log('--- TEST 2: Check HTML for .btn-company-jobs as primary CTA ---');
const primaryJobsRegex = /<a href="viec-lam\.html\?q=[^"]+" class="btn-company-jobs">[\s\S]*?<span>Xem vị trí tuyển dụng<\/span>[\s\S]*?<\/a>/g;
const primaryJobsMatches = indexHtml.match(primaryJobsRegex);
console.log('Primary CTA matches in index.html:', primaryJobsMatches ? primaryJobsMatches.length : 0);
if (!primaryJobsMatches || primaryJobsMatches.length !== 4) {
  console.error('FAIL: Expected 4 btn-company-jobs primary buttons in index.html');
  process.exit(1);
}

console.log('--- TEST 3: Check CSS rules for .btn-follow-company and .btn-company-jobs ---');
if (!homeCss.includes('.btn-follow-company {') || !homeCss.includes('position: absolute;')) {
  console.error('FAIL: home.css does not have absolute .btn-follow-company');
  process.exit(1);
}
if (!homeCss.includes('.btn-company-jobs {') || !homeCss.includes('linear-gradient(135deg, #FF8A34 0%, #F97316 100%)')) {
  console.error('FAIL: home.css does not have .btn-company-jobs with EasyCV orange brand styling');
  process.exit(1);
}
if (!homeCss.includes('.btn-company-jobs:hover svg')) {
  console.error('FAIL: home.css missing micro-animation on hover');
  process.exit(1);
}

console.log('--- TEST 4: Check JS for dynamic template and event delegation ---');
if (!homeJs.includes('class="btn-company-jobs"') || !homeJs.includes('Xem vị trí tuyển dụng')) {
  console.error('FAIL: home.js template missing .btn-company-jobs');
  process.exit(1);
}
if (!homeJs.includes("e.target.closest('.btn-follow-company')")) {
  console.error('FAIL: home.js missing event delegation for follow button');
  process.exit(1);
}

console.log('--- TEST 5: Verify public/ folder is in sync ---');
const publicCoverFollow = publicIndexHtml.match(coverFollowRegex);
const publicPrimaryJobs = publicIndexHtml.match(primaryJobsRegex);
if (!publicCoverFollow || publicCoverFollow.length !== 4 || !publicPrimaryJobs || publicPrimaryJobs.length !== 4) {
  console.error('FAIL: public/index.html is out of sync');
  process.exit(1);
}
if (!publicHomeCss.includes('.btn-company-jobs {') || !publicHomeJs.includes('btn-company-jobs')) {
  console.error('FAIL: public CSS or JS out of sync');
  process.exit(1);
}

console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
