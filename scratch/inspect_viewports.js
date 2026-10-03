const http = require('http');
const { spawn } = require('child_process');

async function testViewport(width, height) {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9466',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9466/json/list', res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    // Emulate device metrics
    const send = (method, params = {}) => new Promise(resolve => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile: width < 768
    });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const jobLogos = Array.from(document.querySelectorAll('.job-logo-wrapper')).map(el => {
          const r = el.getBoundingClientRect();
          return { w: Math.round(r.width), h: Math.round(r.height) };
        });
        const companyLogos = Array.from(document.querySelectorAll('.company-card-logo-wrap')).map(el => {
          const r = el.getBoundingClientRect();
          return { w: Math.round(r.width), h: Math.round(r.height) };
        });
        return {
          viewport: '${width}x${height}',
          allJobLogos65: jobLogos.every(l => l.w === 65 && l.h === 65),
          jobCount: jobLogos.length,
          allCompanyLogos65: companyLogos.every(l => l.w === 65 && l.h === 65),
          companyCount: companyLogos.length,
          jobSample: jobLogos[0],
          companySample: companyLogos[0]
        };
      })()`
    });
    console.log(evalRes.result.value);
    chrome.kill();
  } catch(e) {
    console.error(e);
    chrome.kill();
  }
}

(async () => {
  console.log('Testing Desktop:');
  await testViewport(1440, 950);
  console.log('Testing Mobile:');
  await testViewport(390, 844);
  process.exit(0);
})();
