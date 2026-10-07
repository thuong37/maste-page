const fs = require('fs');
const crypto = require('crypto');

const files = [
  'index.html',
  'viec-lam.html',
  'chi-tiet-viec-lam.html',
  'css/home.css',
  'js/home.js',
  'js/viec-lam.js',
  'js/chi-tiet-viec-lam.js',
  'js/job-detail-search.js'
];

function getHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

let allSynced = true;
files.forEach(f => {
  const rootHash = getHash(f);
  const pubHash = getHash('public/' + f);
  const match = rootHash === pubHash;
  if (!match) allSynced = false;
  console.log(`${match ? '✅ MATCH' : '❌ DIFF'}: ${f}`);
});

console.log('Overall sync status:', allSynced ? '100% IN SYNC' : 'NEEDS ATTENTION');
