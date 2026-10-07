const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function runVerification() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9225;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1200'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));

    async function getWs(url) {
      // create new target
      const target = await new Promise((resolve, reject) => {
        const req = http.request(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.end();
      });

      const ws = new WebSocket(target.webSocketDebuggerUrl);
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
      return { ws, send, targetId: target.id };
    }

    // 1. TEST INDEX.HTML
    console.log('--- Checking index.html ---');
    const pageIndex = await getWs('http://localhost:3000/index.html');
    await new Promise(r => setTimeout(r, 1500));

    const evalIndex = await pageIndex.send('Runtime.evaluate', {
      expression: `
        (function() {
          const imgs = Array.from(document.querySelectorAll('img'));
          const companyLogos = Array.from(document.querySelectorAll('.company-card-logo-img, .job-logo'));
          const broken = imgs.filter(i => i.complete && i.naturalWidth === 0);
          return {
            totalImgs: imgs.length,
            companyLogosCount: companyLogos.length,
            companyLogosSrcs: companyLogos.map(i => ({ alt: i.alt, src: i.src, loaded: i.naturalWidth > 0 })),
            brokenCount: broken.length,
            brokenSrcs: broken.map(i => i.src)
          };
        })()
      `,
      returnByValue: true
    });

    const resIndex = evalIndex.result?.value || evalIndex.value;
    console.log('Index.html Images summary:', {
      total: resIndex?.totalImgs,
      companyLogos: resIndex?.companyLogosCount,
      broken: resIndex?.brokenCount,
      brokenSrcs: resIndex?.brokenSrcs
    });

    // Take screenshot of featured companies section
    const ssIndex = await pageIndex.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_homepage_real_companies.png', Buffer.from((ssIndex.result?.data || ssIndex.data), 'base64'));
    console.log('Saved scratch/verified_homepage_real_companies.png');
    pageIndex.ws.close();

    // 2. TEST VIEC-LAM.HTML
    console.log('--- Checking viec-lam.html ---');
    const pageViecLam = await getWs('http://localhost:3000/viec-lam.html');
    await new Promise(r => setTimeout(r, 1500));

    const evalViecLam = await pageViecLam.send('Runtime.evaluate', {
      expression: `
        (function() {
          const jobLogos = Array.from(document.querySelectorAll('.job-company-logo'));
          const vipCover = document.querySelector('.vip-cover-img');
          const vipLogo = document.querySelector('.vip-logo-img');
          const broken = Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0);
          return {
            jobLogosCount: jobLogos.length,
            vipCoverSrc: vipCover ? vipCover.src : null,
            vipCoverLoaded: vipCover ? vipCover.naturalWidth > 0 : false,
            vipLogoSrc: vipLogo ? vipLogo.src : null,
            vipLogoLoaded: vipLogo ? vipLogo.naturalWidth > 0 : false,
            brokenCount: broken.length,
            sampleLogos: jobLogos.slice(0, 5).map(i => ({ alt: i.alt, src: i.src, loaded: i.naturalWidth > 0 }))
          };
        })()
      `,
      returnByValue: true
    });

    const resViecLam = evalViecLam.result?.value || evalViecLam.value;
    console.log('Viec-lam.html Images summary:', {
      jobLogosCount: resViecLam?.jobLogosCount,
      vipCoverLoaded: resViecLam?.vipCoverLoaded,
      vipLogoLoaded: resViecLam?.vipLogoLoaded,
      brokenCount: resViecLam?.brokenCount,
      sample: resViecLam?.sampleLogos
    });

    const ssViecLam = await pageViecLam.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_vieclam_real_companies.png', Buffer.from((ssViecLam.result?.data || ssViecLam.data), 'base64'));
    console.log('Saved scratch/verified_vieclam_real_companies.png');
    pageViecLam.ws.close();

    // 3. TEST CHI-TIET-VIEC-LAM.HTML
    console.log('--- Checking chi-tiet-viec-lam.html ---');
    const pageChiTiet = await getWs('http://localhost:3000/chi-tiet-viec-lam.html');
    await new Promise(r => setTimeout(r, 1500));

    const evalChiTiet = await pageChiTiet.send('Runtime.evaluate', {
      expression: `
        (function() {
          const splitLogos = Array.from(document.querySelectorAll('.split-company-logo'));
          const detailLogo = document.getElementById('detailCompanyLogo');
          const detailCardLogo = document.getElementById('detailCompanyCardLogo');
          const broken = Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0);
          return {
            splitLogosCount: splitLogos.length,
            detailLogoSrc: detailLogo ? detailLogo.src : null,
            detailLogoLoaded: detailLogo ? detailLogo.naturalWidth > 0 : false,
            detailCardLogoLoaded: detailCardLogo ? detailCardLogo.naturalWidth > 0 : false,
            brokenCount: broken.length
          };
        })()
      `,
      returnByValue: true
    });

    const resChiTiet = evalChiTiet.result?.value || evalChiTiet.value;
    console.log('Chi-tiet-viec-lam.html summary:', resChiTiet);
    const ssChiTiet = await pageChiTiet.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_chitiet_real_companies.png', Buffer.from((ssChiTiet.result?.data || ssChiTiet.data), 'base64'));
    console.log('Saved scratch/verified_chitiet_real_companies.png');
    pageChiTiet.ws.close();

    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  } finally {
    chrome.kill();
  }
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
