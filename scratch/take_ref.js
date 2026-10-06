const { execFileSync } = require('child_process');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// We can also take a cropped screenshot or test using puppeteer / CDP or check dimensions
const outPath = path.resolve(__dirname, 'viec_lam_reference.png');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  '--screenshot=' + outPath,
  'http://localhost:3000/viec-lam.html'
]);
console.log('Saved viec-lam reference to', outPath);
