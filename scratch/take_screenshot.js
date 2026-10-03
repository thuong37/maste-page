const { execFileSync } = require('child_process');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const outDesktop = path.resolve(__dirname, 'banners_updated_desktop.png');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,950',
  '--screenshot=' + outDesktop,
  'http://localhost:3000/index.html'
]);
console.log('Saved desktop screenshot to', outDesktop);

const outMobile = path.resolve(__dirname, 'banners_updated_mobile.png');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=390,844',
  '--screenshot=' + outMobile,
  'http://localhost:3000/index.html'
]);
console.log('Saved mobile screenshot to', outMobile);
