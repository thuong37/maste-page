const { spawn } = require('child_process');
const http = require('http');

async function runTest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9224;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));

    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
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

    // Check what happens on viec-lam.html
    const linksRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const links = Array.from(document.querySelectorAll('.job-title-link')).map(a => ({
            href: a.href,
            text: a.textContent.trim(),
            target: a.target
          }));
          return links.slice(0, 5);
        })()
      `,
      returnByValue: true
    });

    console.log('Sample job title links on viec-lam.html:', JSON.stringify(linksRes?.result?.value || linksRes, null, 2));

    // Now navigate to chi-tiet-viec-lam.html?id=2
    await send('Page.navigate', { url: 'http://localhost:3000/chi-tiet-viec-lam.html?id=2' });
    await new Promise(r => setTimeout(r, 1500));

    const detailRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          return {
            pageTitle: document.title,
            jobTitle: document.getElementById('detailJobTitle')?.textContent.trim(),
            companyName: document.getElementById('detailCompanyName')?.textContent.trim(),
            salary: document.getElementById('detailSalaryBadge')?.textContent.trim(),
            descItems: document.querySelectorAll('#detailDescList li').length,
            reqItems: document.querySelectorAll('#detailReqsList li').length,
            perkItems: document.querySelectorAll('#detailPerksList li').length,
            relatedJobsCount: document.querySelectorAll('#splitListFeed .split-job-card').length,
            firstRelatedTitle: document.querySelector('#splitListFeed .split-job-card .split-card-title')?.textContent.trim()
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Detail page state for id=2:', JSON.stringify(detailRes?.result?.value || detailRes, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

runTest().catch(console.error);
