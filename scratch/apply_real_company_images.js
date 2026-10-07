const fs = require('fs');
const path = require('path');

function getCompanyLogo(company) {
  if (!company) return 'assets/logos/company-fpt.svg';
  const c = company.toLowerCase();
  if (c.includes('fpt')) return 'assets/logos/company-fpt.svg';
  if (c.includes('techcombank') || c.includes('kỹ thương')) return 'assets/logos/company-techcombank.svg';
  if (c.includes('zalo')) return 'assets/logos/company-zalo.svg';
  if (c.includes('vng')) return 'assets/logos/company-vng.svg';
  if (c.includes('viettel')) return 'assets/logos/company-viettel.svg';
  if (c.includes('shopee')) return 'assets/logos/company-shopee.svg';
  if (c.includes('momo') || c.includes('m-service') || c.includes('di động trực tuyến')) return 'assets/logos/company-momo.svg';
  if (c.includes('vnpay')) return 'assets/logos/company-vnpay.svg';
  if (c.includes('vinai')) return 'assets/logos/company-vinai.svg';
  if (c.includes('vinfast')) return 'assets/logos/company-vinfast.svg';
  if (c.includes('vingroup') || c.includes('vinhomes')) return 'assets/logos/company-vingroup.svg';
  if (c.includes('vinamilk') || c.includes('sữa việt nam')) return 'assets/logos/company-vinamilk.svg';
  if (c.includes('cmc')) return 'assets/logos/company-cmc.svg';
  if (c.includes('base.vn')) return 'assets/logos/company-basevn.svg';
  if (c.includes('one mount') || c.includes('vinid')) return 'assets/logos/company-onemount.svg';
  if (c.includes('kms')) return 'assets/logos/company-kms.svg';
  if (c.includes('tiki')) return 'assets/logos/company-tiki.svg';
  if (c.includes('masan')) return 'assets/logos/company-masan.svg';
  if (c.includes('nashtech')) return 'assets/logos/company-nashtech.svg';
  if (c.includes('mb bank') || c.includes('mbbank') || c.includes('quân đội')) return 'assets/logos/company-mbbank.svg';
  if (c.includes('bosch')) return 'assets/logos/company-bosch.svg';
  if (c.includes('unilever')) return 'assets/logos/company-unilever.svg';
  if (c.includes('vpbank') || c.includes('thịnh vượng')) return 'assets/logos/company-vpbank.svg';
  if (c.includes('gemadept')) return 'assets/logos/company-gemadept.svg';
  if (c.includes('vnpt')) return 'assets/logos/company-vnpt.svg';
  if (c.includes('samsung')) return 'assets/logos/company-samsung.svg';
  if (c.includes('orion')) return 'assets/logos/company-orion.svg';
  if (c.includes('ssi')) return 'assets/logos/company-ssi.svg';
  if (c.includes('thế giới di động') || c.includes('mwg')) return 'assets/logos/company-mwg.svg';
  if (c.includes('sun group')) return 'assets/logos/company-sungroup.svg';
  if (c.includes('vccorp')) return 'assets/logos/company-vccorp.svg';
  if (c.includes('mai linh')) return 'assets/logos/company-mailinh.svg';
  if (c.includes('đất xanh')) return 'assets/logos/company-datxanh.svg';
  if (c.includes('pwc')) return 'assets/logos/company-pwc.svg';
  if (c.includes('vietcom') || c.includes('ngoại thương')) return 'assets/logos/company-vietcombank.svg';
  if (c.includes('dentsu')) return 'assets/logos/company-dentsu.svg';
  if (c.includes('tân á đại thành')) return 'assets/logos/company-tanadaithanh.svg';
  if (c.includes('bee logistics')) return 'assets/logos/company-beelogistics.svg';
  if (c.includes('saigon') || c.includes('co.op')) return 'assets/logos/company-saigonretail.svg';
  if (c.includes('vikimco')) return 'assets/logos/company-vikimco-64.svg';
  if (c.includes('mùa hè')) return 'assets/logos/company-mua-he-64.png';
  if (c.includes('kimmari')) return 'assets/logos/company-kimmari-64.svg';
  if (c.includes('tân việt')) return 'assets/logos/company-tanviet-64.svg';
  if (c.includes('bitexco')) return 'assets/logos/company-bitexco.svg';
  return 'assets/logos/easycv-icon.png';
}

console.log('Starting full image replacement across project...');

// 1. UPDATE viec-lam.html
function updateViecLamHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace VIP cover and VIP logo
  content = content.replace(
    /<img\s+src="https:\/\/images\.unsplash\.com\/photo-1486406146926-c627a92ad1ab[^"]*"\s+alt="Samsung R&D"\s+class="vip-cover-img"\s*\/>/,
    '<img src="assets/banners/samsung-rd-center.jpg" alt="Samsung Electronics R&D Center Hanoi" class="vip-cover-img" />'
  );
  content = content.replace(
    /<img\s+src="https:\/\/images\.unsplash\.com\/photo-1618005182384-a83a8bd57fbe[^"]*"\s+alt="Samsung SRV"\s+class="vip-logo-img"\s*\/>/,
    '<img src="assets/logos/company-samsung.svg" alt="Samsung SRV" class="vip-logo-img" />'
  );

  // Replace each job-company-logo
  // Format: <img src="https://images.unsplash..." alt="CompanyName" class="job-company-logo" loading="lazy" />
  content = content.replace(
    /<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+"\s+alt="([^"]+)"\s+class="job-company-logo"\s+loading="lazy"\s*\/>/g,
    (match, company) => {
      const realLogo = getCompanyLogo(company);
      return `<img src="${realLogo}" alt="${company}" class="job-company-logo" loading="lazy" />`;
    }
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// 2. UPDATE chi-tiet-viec-lam.html
function updateChiTietViecLamHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace split-company-logo
  // Format: <img src="https://images.unsplash..." alt="CompanyName" class="split-company-logo" loading="lazy" />
  content = content.replace(
    /<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+"\s+alt="([^"]+)"\s+class="split-company-logo"\s+loading="lazy"\s*\/>/g,
    (match, company) => {
      const realLogo = getCompanyLogo(company);
      return `<img src="${realLogo}" alt="${company}" class="split-company-logo" loading="lazy" />`;
    }
  );

  // Replace detailCompanyLogo & detailCompanyCardLogo
  content = content.replace(
    /<img\s+id="detailCompanyLogo"\s+src="https:\/\/images\.unsplash\.com\/[^"]+"\s+alt="([^"]+)"\s+class="detail-company-logo"\s*\/>/,
    '<img id="detailCompanyLogo" src="assets/logos/company-fpt.svg" alt="FPT Software" class="detail-company-logo" />'
  );
  content = content.replace(
    /<img\s+id="detailCompanyCardLogo"\s+src="https:\/\/images\.unsplash\.com\/[^"]+"\s+alt="([^"]+)"\s+style="([^"]+)"\s*\/>/,
    '<img id="detailCompanyCardLogo" src="assets/logos/company-fpt.svg" alt="FPT Software" style="$2" />'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// 3. UPDATE index.html
function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace job-logo in Featured and Attractive Jobs
  // Format: <img src="https://images.unsplash..." alt="CompanyName" class="job-logo" title="..." />
  content = content.replace(
    /<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+"\s+alt="([^"]+)"\s+class="job-logo"\s+title="([^"]+)"\s*\/>/g,
    (match, company, title) => {
      const realLogo = getCompanyLogo(company);
      return `<img src="${realLogo}" alt="${company}" class="job-logo" title="${title}" />`;
    }
  );

  // Replace Top Companies Section marks with real SVG logo images
  const companyCards = [
    { mark: 'company-logo-fpt', comp: 'FPT Software', file: 'company-fpt.svg' },
    { mark: 'company-logo-vng', comp: 'VNG Corporation', file: 'company-vng.svg' },
    { mark: 'company-logo-viettel', comp: 'Viettel Digital', file: 'company-viettel.svg' },
    { mark: 'company-logo-techcombank', comp: 'Techcombank', file: 'company-techcombank.svg' },
    { mark: 'company-logo-momo', comp: 'MoMo', file: 'company-momo.svg' },
    { mark: 'company-logo-shopee', comp: 'Shopee Việt Nam', file: 'company-shopee.svg' },
    { mark: 'company-logo-mb', comp: 'MB Bank', file: 'company-mbbank.svg' },
    { mark: 'company-logo-vinai', comp: 'VinAI', file: 'company-vinai.svg' }
  ];

  companyCards.forEach(c => {
    const regex = new RegExp(
      `<div class="company-card-logo-wrap"[^>]*>\\s*<span class="company-card-logo-mark ${c.mark}"[^>]*>[^<]*<\\/span>\\s*<\\/div>`,
      'g'
    );
    const replacement = `<div class="company-card-logo-wrap" title="Công ty ${c.comp}">
              <img src="assets/logos/${c.file}" alt="${c.comp}" class="company-card-logo-img" />
            </div>`;
    content = content.replace(regex, replacement);
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// 4. UPDATE JS FILES (viec-lam.js, home.js, job-detail-search.js)
function updateJsJobs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace job objects where company and logo are defined
  // We can do line-by-line or block parsing
  const lines = content.split('\n');
  let currentCompany = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const compMatch = line.match(/company:\s*['"]([^'"]+)['"]/);
    if (compMatch) {
      currentCompany = compMatch[1];
    }
    const logoMatch = line.match(/(logo:\s*)['"]https:\/\/images\.unsplash\.com\/[^'"]+['"]/);
    if (logoMatch) {
      const realLogo = getCompanyLogo(currentCompany);
      lines[i] = line.replace(/(logo:\s*)['"]https:\/\/images\.unsplash\.com\/[^'"]+['"]/, `$1'${realLogo}'`);
    }
  }

  // Also replace any remaining Unsplash logo lines
  content = lines.join('\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// 5. UPDATE CSS FOR .company-card-logo-img
function updateHomeCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('.company-card-logo-img')) {
    const target = '.company-card-logo-wrap {';
    const addition = `.company-card-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 24px;
  background: #ffffff;
  display: block;
  box-sizing: border-box;
}

`;
    content = content.replace(target, addition + target);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath} with .company-card-logo-img styles`);
  }
}

// EXECUTE ALL
updateViecLamHtml('viec-lam.html');
updateViecLamHtml('public/viec-lam.html');

updateChiTietViecLamHtml('chi-tiet-viec-lam.html');
updateChiTietViecLamHtml('public/chi-tiet-viec-lam.html');

updateIndexHtml('index.html');
updateIndexHtml('public/index.html');

updateJsJobs('js/viec-lam.js');
updateJsJobs('public/js/viec-lam.js');

updateJsJobs('js/home.js');
updateJsJobs('public/js/home.js');

updateJsJobs('js/job-detail-search.js');
updateJsJobs('public/js/job-detail-search.js');

updateHomeCss('css/home.css');
updateHomeCss('public/css/home.css');

console.log('All files updated successfully!');
