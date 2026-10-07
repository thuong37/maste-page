const fs = require('fs');

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

function updateChiTietJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
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

  content = lines.join('\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateChiTietJs('js/chi-tiet-viec-lam.js');
updateChiTietJs('public/js/chi-tiet-viec-lam.js');
