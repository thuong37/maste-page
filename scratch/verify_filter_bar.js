const { execFileSync } = require('child_process');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const outPath = path.resolve(__dirname, 'chi_tiet_filter_aligned.png');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  '--screenshot=' + outPath,
  'http://localhost:3000/chi-tiet-viec-lam.html'
]);
console.log('Saved screenshot to', outPath);
