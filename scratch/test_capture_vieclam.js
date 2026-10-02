const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

execSync(`"${browser}" --headless=new --disable-gpu --window-size=1440,900 --screenshot="d:\\master page\\scratch\\viec_lam_current.png" "http://localhost:3000/viec-lam.html?keyword=Marketing+Leader"`);
console.log('Captured viec_lam_current.png');

execSync(`"${browser}" --headless=new --disable-gpu --window-size=1440,900 --screenshot="d:\\master page\\scratch\\index_current.png" "http://localhost:3000/index.html"`);
console.log('Captured index_current.png');
