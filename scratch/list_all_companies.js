const fs = require('fs');

function extractCompanies(content) {
  const list = [];
  const lines = content.split('\n');
  let currentCompany = '';
  let currentLogo = '';

  for (const line of lines) {
    const compMatch = line.match(/company:\s*['"]([^'"]+)['"]/);
    if (compMatch) currentCompany = compMatch[1];
    const logoMatch = line.match(/logo:\s*['"]([^'"]+)['"]/);
    if (logoMatch) currentLogo = logoMatch[1];

    if (currentCompany && currentLogo) {
      list.push({ company: currentCompany, logo: currentLogo });
      currentCompany = '';
      currentLogo = '';
    }
  }
  return list;
}

const vl = extractCompanies(fs.readFileSync('js/viec-lam.js', 'utf8'));
const hm = extractCompanies(fs.readFileSync('js/home.js', 'utf8'));
const jd = extractCompanies(fs.readFileSync('js/job-detail-search.js', 'utf8'));

// Also check HTML files
function extractHtmlLogos(file) {
  const text = fs.readFileSync(file, 'utf8');
  const list = [];
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    list.push({ logo: m[1], company: m[2] });
  }
  return list;
}

const htmlLogos = [
  ...extractHtmlLogos('index.html'),
  ...extractHtmlLogos('viec-lam.html'),
  ...extractHtmlLogos('chi-tiet-viec-lam.html')
];

const all = [...vl, ...hm, ...jd, ...htmlLogos];
const map = new Map();
all.forEach(item => {
  if (item.company && !item.company.includes('Avatar') && !item.company.includes('Logo') && !item.company.includes('Doanh nghiệp tiêu biểu')) {
    if (!map.has(item.company)) {
      map.set(item.company, new Set());
    }
    map.get(item.company).add(item.logo);
  }
});

console.log('Total companies:', map.size);
for (const [comp, logos] of map.entries()) {
  console.log(`- "${comp}": ${Array.from(logos).join(', ')}`);
}
