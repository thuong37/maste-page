const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verify() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9350;
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

    // Evaluate logo and title metrics on company cards
    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('#cong-ty-tieu-bieu .company-card')).map(card => {
          const logoWrap = card.querySelector('.company-card-logo-wrap');
          const logoMark = card.querySelector('.company-card-logo-mark');
          const title = card.querySelector('.company-card-title');
          const logoStyle = window.getComputedStyle(logoWrap);
          const titleStyle = window.getComputedStyle(title);
          const markStyle = window.getComputedStyle(logoMark);
          return {
            title: title?.textContent.trim(),
            logoWidth: logoStyle.width,
            logoHeight: logoStyle.height,
            markFontSize: markStyle.fontSize,
            titleMarginTop: titleStyle.marginTop,
            cardHeight: card.offsetHeight
          };
        });
        return { count: cards.length, sample: cards[0], allEqual: cards.every(c => c.logoWidth === '88px') };
      })()`,
      returnByValue: true
    });

    console.log('Evaluated Metrics:', JSON.stringify(evalResult.result.value, null, 2));

    // Scroll to #cong-ty-tieu-bieu and capture desktop screenshot
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const screenshotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, 'companies_larger_logos_desktop.png'), Buffer.from(screenshotDesktop.data, 'base64'));
    console.log('Saved desktop screenshot to scratch/companies_larger_logos_desktop.png');

    // Test mobile metrics
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    const mobileMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const logoWrap = document.querySelector('#cong-ty-tieu-bieu .company-card-logo-wrap');
        const title = document.querySelector('#cong-ty-tieu-bieu .company-card-title');
        const logoStyle = window.getComputedStyle(logoWrap);
        const titleStyle = window.getComputedStyle(title);
        return {
          mobileLogoWidth: logoStyle.width,
          mobileLogoHeight: logoStyle.height,
          mobileTitleMarginTop: titleStyle.marginTop
        };
      })()`,
      returnByValue: true
    });

    console.log('Mobile Metrics:', JSON.stringify(mobileMetrics.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

verify().catch(console.error);
