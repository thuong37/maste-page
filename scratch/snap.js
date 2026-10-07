const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function snap() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outPath = path.resolve(__dirname, 'search_bar_snap.png');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,720',
    `--screenshot=${outPath}`,
    'http://127.0.0.1:8000/viec-lam.html?keyword=sale'
  ]);
  chrome.on('close', () => {
    console.log('Finished capturing, size:', fs.statSync(outPath).size);
  });
}
snap();
