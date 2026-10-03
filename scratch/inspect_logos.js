const http = require('http');
const { spawn } = require('child_process');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9455',
  '--disable-gpu',
  'http://localhost:3000/index.html'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9455/json/list', res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = async () => {
      await new Promise(r => setTimeout(r, 1000));
      const code = `(() => {
        const results = {};
        const jobLogos = Array.from(document.querySelectorAll('.job-logo-wrapper')).map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.className, w: r.width, h: r.height };
        });
        results.jobLogoWrappersCount = jobLogos.length;
        results.jobLogoWrappersSample = jobLogos.slice(0, 3);

        const companyLogos = Array.from(document.querySelectorAll('.company-card-logo-wrap')).map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.className, w: r.width, h: r.height };
        });
        results.companyCardLogoWrapsCount = companyLogos.length;
        results.companyCardLogoWrapsSample = companyLogos.slice(0, 3);

        return results;
      })()`;
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: code,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.id === 1) {
        console.log(JSON.stringify(data.result.result.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch(err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
