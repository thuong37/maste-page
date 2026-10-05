const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle2' });

  const section = await page.$('#viec-lam-phu-hop');
  if (section) {
    await section.screenshot({ path: path.join(__dirname, 'viec_lam_phu_hop_no_match.png') });
    console.log('Screenshot saved to scratch/viec_lam_phu_hop_no_match.png');
  } else {
    console.error('Section #viec-lam-phu-hop not found');
  }

  // Also check if any .job-pill-match exists in DOM
  const pillCount = await page.$$eval('.matching-jobs-section .job-pill-match', els => els.length);
  console.log('Matching pill count in DOM:', pillCount);

  // Check card footers text
  const cardPills = await page.$$eval('.matching-jobs-section .job-card .job-pills', els => els.map(e => e.innerText.trim().replace(/\n/g, ' | ')));
  console.log('Card pills text:', cardPills);

  await browser.close();
})();
