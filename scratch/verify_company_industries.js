const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verify() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9345;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1200',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
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

    // Evaluate company cards data
    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('#cong-ty-tieu-bieu .company-card')).map(card => {
          const title = card.querySelector('.company-card-title')?.textContent.trim();
          const industryEl = card.querySelector('.company-card-industry');
          const industry = industryEl?.textContent.trim();
          const computedStyle = industryEl ? window.getComputedStyle(industryEl) : null;
          const jobsPill = card.querySelector('.company-jobs-pill')?.textContent.trim();
          return {
            title,
            industry,
            industryColor: computedStyle?.color,
            industryFontSize: computedStyle?.fontSize,
            jobsPill
          };
        });
        return { count: cards.length, cards };
      })()`,
      returnByValue: true
    });

    console.log('Company Cards Evaluated:', JSON.stringify(evalResult.result.value, null, 2));

    // Scroll to #cong-ty-tieu-bieu and capture desktop screenshot
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const screenshotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'companies_with_industry_desktop.png'), Buffer.from(screenshotDesktop.data, 'base64'));
    console.log('Saved desktop screenshot to scratch/companies_with_industry_desktop.png');

    // Test mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const screenshotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'companies_with_industry_mobile.png'), Buffer.from(screenshotMobile.data, 'base64'));
    console.log('Saved mobile screenshot to scratch/companies_with_industry_mobile.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

verify().catch(console.error);
