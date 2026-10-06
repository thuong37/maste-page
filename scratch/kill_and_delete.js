const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('scratch', 'chrome_test_rec_jobs');

// Find all processes using tasklist or WMIC
try {
  const output = execSync('powershell -NoProfile -Command "[System.Diagnostics.Process]::GetProcessesByName(\'chrome\') | ForEach-Object { try { $cmd = (Get-CimInstance Win32_Process -Filter \\"ProcessId = $($_.Id)\\").CommandLine; if ($cmd -match \'chrome_test_rec_jobs\') { Stop-Process -Id $_.Id -Force; Write-Host \\"Killed $($_.Id)\\" } } catch {} }"', { encoding: 'utf8' });
  console.log('PowerShell kill output:', output);
} catch (e) {
  console.log('PS error:', e.message);
}

// Check what files are inside
function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    try {
      if (entry.isDirectory()) {
        rmrf(fullPath);
      } else {
        fs.chmodSync(fullPath, 0o666);
        fs.unlinkSync(fullPath);
      }
    } catch (e) {
      console.log('Cannot remove file:', fullPath, e.message);
    }
  }
  try {
    fs.rmdirSync(dir);
  } catch (e) {
    console.log('Cannot remove dir:', dir, e.message);
  }
}

rmrf(targetDir);

console.log('Final exists check:', fs.existsSync(targetDir));
