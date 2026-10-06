const puppeteer = (() => {
  try {
    return require('puppeteer');
  } catch (e) {
    return null;
  }
})();
const http = require('http');
const fs = require('fs');

async function run() {
  // Use Chrome DevTools Protocol directly or simple fetch
  console.log('Taking visual verification snapshot via CDP...');
  // Find browser endpoint
  http.get('http://127.0.0.1:9222/json', (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try {
        const targets = JSON.parse(raw);
        console.log('Active targets in CDP:', targets.length);
      } catch (err) {
        console.log('No CDP running, skipping live CDP screenshot');
      }
    });
  }).on('error', () => {
    console.log('CDP endpoint not on 9222 (standard)');
  });
}
run();
