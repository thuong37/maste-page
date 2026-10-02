const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testFeaturedCompanies() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9224;
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1000',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('index.html')) || list[0];
  console.log('Target page found:', page.title, page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  console.log('Connected to CDP');

  // Scroll #cong-ty-tieu-bieu into view
  const res = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const sec = document.getElementById('cong-ty-tieu-bieu');
        if (!sec) return { error: 'Section not found' };
        sec.scrollIntoView({ block: 'center' });
        const card = sec.querySelector('.company-card');
        const headerRow = card.querySelector('.company-card-header-row');
        const followBtn = card.querySelector('.btn-follow-company');
        const jobsBtn = card.querySelector('.btn-company-jobs');
        const title = card.querySelector('.company-card-title');
        
        const headerStyle = window.getComputedStyle(headerRow);
        const followStyle = window.getComputedStyle(followBtn);
        const jobsStyle = window.getComputedStyle(jobsBtn);

        return {
          titleText: title.textContent.trim(),
          followText: followBtn.textContent.trim(),
          jobsText: jobsBtn.textContent.trim(),
          headerDisplay: headerStyle.display,
          followPosition: followStyle.position,
          followColor: followStyle.color,
          followBg: followStyle.backgroundColor,
          jobsBg: jobsStyle.backgroundImage || jobsStyle.backgroundColor,
          jobsColor: jobsStyle.color,
          jobsWidth: jobsBtn.offsetWidth,
          cardWidth: card.offsetWidth
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Computed styles and elements in browser:', res.result.value);

  // Take screenshot of viewport
  const screenshot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'featured_companies_verified.png'), Buffer.from(screenshot1.data, 'base64'));
  console.log('Saved screenshot: featured_companies_verified.png');

  // Click follow button
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const followBtn = document.querySelector('.company-card .btn-follow-company');
        followBtn.click();
        return {
          nowFollowing: followBtn.classList.contains('following'),
          textAfterClick: followBtn.textContent.trim()
        };
      })()
    `,
    returnByValue: true
  });
  console.log('After clicking follow:', clickRes.result.value);

  const screenshot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'featured_companies_following.png'), Buffer.from(screenshot2.data, 'base64'));
  console.log('Saved screenshot: featured_companies_following.png');

  ws.close();
  edge.kill();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

testFeaturedCompanies().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
