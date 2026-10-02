const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

const outPath = path.resolve(__dirname, 'homepage_no_brand_strip.png');
execSync(`"${browser}" --headless=new --disable-gpu --window-size=1440,1200 --screenshot="${outPath}" "http://localhost:3000/index.html"`, { stdio: 'inherit', timeout: 15000 });
console.log('SUCCESS: Captured screenshot at', outPath);
