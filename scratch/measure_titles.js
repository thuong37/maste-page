const { spawn } = require('child_process');
const http = require('http');

async function measureTitles(width = 1440, height = 950) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9334;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    `--window-size=${width},${height}`,
    'http://localhost:3000/index.html'
  ]);

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
  const evalRes = await send('Runtime.evaluate', {
    expression: `(function() {
      const titles = [];
      const selectors = [
        '#viec-lam-noi-bat .section-title',
        '#viec-lam-hap-dan .section-title',
        '#cong-ty-tieu-bieu .section-title',
        '.infeed-vip-title',
        '#viec-lam-phu-hop .section-title',
        '#cv-template-title',
        '#tu-khoa-pho-bien .section-title'
      ];
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          const s = window.getComputedStyle(el);
          titles.push({
            selector: sel,
            text: el.innerText.trim(),
            tagName: el.tagName,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            letterSpacing: s.letterSpacing,
            color: s.color,
            fontFamily: s.fontFamily.split(',')[0],
            marginTop: s.marginTop,
            marginBottom: s.marginBottom
          });
        } else {
          titles.push({ selector: sel, error: 'NOT_FOUND' });
        }
      });
      return titles;
    })()`,
    returnByValue: true
  });

  console.log(`=== TITLES AT ${width}x${height} ===`);
  console.log(JSON.stringify(evalRes.result ? evalRes.result.value : evalRes, null, 2));
  chrome.kill();
}

(async () => {
  await measureTitles(1440, 950);
  await measureTitles(390, 844);
})();
