const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
  {
    name: 'company-fpt.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/FPT_Software_logo.svg'
  },
  {
    name: 'company-viettel.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg'
  },
  {
    name: 'company-shopee.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg'
  },
  {
    name: 'company-samsung.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg'
  },
  {
    name: 'company-bosch.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  const dir = path.resolve(__dirname, '../assets/logos');
  const pubDir = path.resolve(__dirname, '../public/assets/logos');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

  for (const item of downloads) {
    const target = path.join(dir, item.name);
    const pubTarget = path.join(pubDir, item.name);
    try {
      await download(item.url, target);
      fs.copyFileSync(target, pubTarget);
      console.log(`Saved: ${item.name} (${fs.statSync(target).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  }
}

main();
