const { execSync } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

const path = require('path');
const outPath = path.resolve(process.argv[2] || 'scratch/current_vieclam.png');
const url = process.argv[3] || 'http://localhost:3000/viec-lam.html';

execSync(`"${browserPath}" --headless=new --disable-gpu --window-size=1440,1100 --screenshot="${outPath}" "${url}"`);
console.log('Saved screenshot to:', outPath);
