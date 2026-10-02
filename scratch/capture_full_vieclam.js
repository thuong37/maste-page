const { execSync } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
execSync(`"${chrome}" --headless=new --disable-gpu --window-size=1440,1600 --screenshot="d:\\master page\\scratch\\vieclam_top_filter_full.png" "http://localhost:3000/viec-lam.html"`);
console.log('Captured full desktop screenshot');
