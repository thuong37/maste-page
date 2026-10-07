const https = require('https');

const keywords = [
  'Techcombank',
  'Momo',
  'Zalo',
  'VNG Corporation',
  'MB Bank',
  'MBBank',
  'Vingroup',
  'Vinamilk',
  'VPBank',
  'VNPT',
  'Tiki',
  'Masan',
  'PwC',
  'Unilever',
  'Vietcombank',
  'VinFast',
  'Orion'
];

function searchWikimedia(query) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(query + ' logo')}&format=json&srlimit=5`;
    https.get(url, { headers: { 'User-Agent': 'EasyCV-AssetManager/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const results = parsed.query?.search?.map(s => s.title) || [];
          resolve({ query, results });
        } catch (e) {
          resolve({ query, results: [] });
        }
      });
    }).on('error', () => resolve({ query, results: [] }));
  });
}

async function main() {
  for (const kw of keywords) {
    const res = await searchWikimedia(kw);
    console.log(`[${kw}] =>`, res.results.join(' | '));
  }
}

main();
