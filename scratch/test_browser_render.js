const { execSync } = require('child_process');
const fs = require('fs');

console.log('Testing Chrome / Edge headless execution...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser:', browser);

// Capture screenshot of localhost:3000/viec-lam.html
const path = require('path');
const outPath = path.resolve(__dirname, 'page_desktop.png');
try {
  execSync(`"${browser}" --headless=new --disable-gpu --window-size=1440,900 --screenshot="${outPath}" "http://localhost:3000/viec-lam.html"`, { stdio: 'inherit', timeout: 15000 });
  console.log('Desktop screenshot captured successfully at', outPath);
} catch (e) {
  console.error('Error capturing screenshot:', e.message);
}
