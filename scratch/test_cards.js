const http = require('http');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const viecLamHtml = await fetch('http://localhost:3000/viec-lam.html');
  console.log('viec-lam.html contains .ad-badge-top:', viecLamHtml.includes('ad-badge-top'));
  console.log('viec-lam.html contains Tài trợ:', viecLamHtml.includes('badge-ad-tag') || viecLamHtml.includes('Tài trợ'));
}
run();
