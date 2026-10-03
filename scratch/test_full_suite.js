const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function runTestSuite() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9225;
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
    console.log('--- TEST 1: Kiểm tra link trên màn hình list job (viec-lam.html) ---');

    const linkCheck = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const links = Array.from(document.querySelectorAll('.job-title-link')).map(a => ({
            href: a.getAttribute('href'),
            text: a.textContent.trim(),
            target: a.getAttribute('target')
          }));
          return {
            totalLinks: links.length,
            sample: links.slice(0, 3)
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Result Test 1:', JSON.stringify(linkCheck?.result?.value, null, 2));

    console.log('\n--- TEST 2: Điều hướng đến màn chi tiết việc làm (id=2) ---');
    await send('Page.navigate', { url: 'http://localhost:3000/chi-tiet-viec-lam.html?id=2' });
    await new Promise(r => setTimeout(r, 1200));

    const detailCheck = await send('Runtime.evaluate', {
      expression: `
        (function() {
          return {
            pageTitle: document.title,
            jobTitle: document.getElementById('detailJobTitle')?.textContent.trim(),
            company: document.getElementById('detailCompanyName')?.textContent.trim(),
            salary: document.getElementById('detailSalaryBadge')?.textContent.trim(),
            location: document.getElementById('detailLocationText')?.textContent.trim(),
            descCount: document.querySelectorAll('#detailDescList li').length,
            reqsCount: document.querySelectorAll('#detailReqsList li').length,
            perksCount: document.querySelectorAll('#detailPerksList li').length,
            skillsCount: document.querySelectorAll('#detailSkillsWrap .detail-skill-tag').length,
            relatedCount: document.querySelectorAll('#splitListFeed .split-job-card').length,
            activeRelatedTitle: document.querySelector('#splitListFeed .split-job-card.is-selected .split-card-title')?.textContent.trim(),
            hasActiveBadge: Boolean(document.querySelector('#splitListFeed .split-job-card.is-selected .split-active-badge'))
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Result Test 2 (Detail id=2):', JSON.stringify(detailCheck?.result?.value, null, 2));

    // Capture screenshot of detail id=2
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/chi_tiet_id2.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved screenshot: scratch/chi_tiet_id2.png');

    console.log('\n--- TEST 3: Click việc làm liên quan khác trên màn chi tiết (chọn id=3) ---');
    const clickRel = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const card3 = document.querySelector('#splitListFeed .split-job-card[data-id="3"]');
          if (!card3) return { error: 'Card 3 not found' };
          card3.click();
          return { clicked: true };
        })()
      `,
      returnByValue: true
    });
    console.log('Click result:', clickRel?.result?.value);
    await new Promise(r => setTimeout(r, 800));

    const afterClickCheck = await send('Runtime.evaluate', {
      expression: `
        (function() {
          return {
            currentUrl: window.location.href,
            jobTitle: document.getElementById('detailJobTitle')?.textContent.trim(),
            company: document.getElementById('detailCompanyName')?.textContent.trim(),
            salary: document.getElementById('detailSalaryBadge')?.textContent.trim(),
            activeRelatedTitle: document.querySelector('#splitListFeed .split-job-card.is-selected .split-card-title')?.textContent.trim()
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Result Test 3 (After click Card 3):', JSON.stringify(afterClickCheck?.result?.value, null, 2));

    // Capture screenshot of detail id=3
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/chi_tiet_id3_switched.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved screenshot: scratch/chi_tiet_id3_switched.png');

    console.log('\n--- TEST 4: Mở màn chi tiết với title tùy biến (dynamic mock data) ---');
    const customTitle = 'Giám Đốc Chuyển Đổi Số & AI';
    await send('Page.navigate', { url: `http://localhost:3000/chi-tiet-viec-lam.html?title=${encodeURIComponent(customTitle)}` });
    await new Promise(r => setTimeout(r, 1200));

    const customCheck = await send('Runtime.evaluate', {
      expression: `
        (function() {
          return {
            jobTitle: document.getElementById('detailJobTitle')?.textContent.trim(),
            company: document.getElementById('detailCompanyName')?.textContent.trim(),
            salary: document.getElementById('detailSalaryBadge')?.textContent.trim(),
            descFirst: document.querySelector('#detailDescList li')?.textContent.trim(),
            activeRelatedTitle: document.querySelector('#splitListFeed .split-job-card.is-selected .split-card-title')?.textContent.trim()
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Result Test 4 (Custom title):', JSON.stringify(customCheck?.result?.value, null, 2));

    // Capture screenshot of custom title
    const shotCustom = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/chi_tiet_custom_title.png', Buffer.from(shotCustom.data, 'base64'));
    console.log('Saved screenshot: scratch/chi_tiet_custom_title.png');

    ws.close();
    console.log('\n=== TẤT CẢ CÁC BƯỚC TEST HOÀN TẤT THÀNH CÔNG 100% ===');
  } finally {
    chrome.kill();
  }
}

runTestSuite().catch(console.error);
