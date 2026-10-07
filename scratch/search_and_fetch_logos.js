const https = require('https');
const fs = require('fs');

const candidates = [
  'File:FPT Software logo.svg',
  'File:FPT logo 2010.svg',
  'File:Viettel logo 2021.svg',
  'File:Shopee logo.svg',
  'File:Shopee.svg',
  'File:Samsung logo.svg',
  'File:Samsung wordmark.svg',
  'File:Robert Bosch GmbH logo.svg',
  'File:Bosch-logo.svg',
  'File:Unilever.svg',
  'File:Techcombank logo.png',
  'File:Logo Techcombank.svg',
  'File:MoMo logo.png',
  'File:Momo logo.png',
  'File:Momo logo.svg',
  'File:VNG logo.svg',
  'File:Zalo logo.svg',
  'File:MBBank logo.svg',
  'File:Logo MBBank.svg',
  'File:Logo of Military Commercial Joint Stock Bank.svg',
  'File:Logo Vingroup.svg',
  'File:Vingroup logo.svg',
  'File:Vinamilk logo.svg',
  'File:Logo Vinamilk.svg',
  'File:Vinamilk.svg',
  'File:Vinamilk logo 2023.svg',
  'File:Logo VPBank.svg',
  'File:VPBank logo.svg',
  'File:Logo VNPT.svg',
  'File:VNPT logo.svg',
  'File:Tiki.vn logo.png',
  'File:Tiki logo.png',
  'File:Logo Tiki.svg',
  'File:Masan logo.svg',
  'File:Masan Group logo.png',
  'File:PwC logo.svg',
  'File:Vietcombank logo.svg',
  'File:Logo Vietcombank.svg',
  'File:Logo VinFast.svg',
  'File:VinFast logo.svg',
  'File:Orion Confectionery logo.svg',
  'File:Orion logo.svg'
];

async function checkWiki(title) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, { headers: { 'User-Agent': 'EasyCV-AssetManager/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query?.pages;
          if (pages) {
            for (const pid in pages) {
              if (pid !== '-1' && pages[pid].imageinfo) {
                resolve({ title, url: pages[pid].imageinfo[0].url });
                return;
              }
            }
          }
        } catch (e) {}
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  console.log('Checking Wikimedia Commons for candidate logos...');
  for (const c of candidates) {
    const res = await checkWiki(c);
    if (res) {
      console.log(`FOUND: ${res.title} => ${res.url}`);
    }
  }
}

main();
