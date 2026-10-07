const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9257;
const profile = fs.mkdtempSync(path.join(__dirname, 'chrome-keyword-cleanup-'));
const chrome = spawn(chromePath, [
  '--headless=new',
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${debugPort}`,
  '--remote-debugging-address=127.0.0.1',
  '--disable-gpu',
  '--disable-software-rasterizer',
  '--disable-gpu-compositing',
  '--disable-features=Vulkan,UseSkiaRenderer',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,1000',
  'http://127.0.0.1:3000/index.html'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage() {
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      const page = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${debugPort}/json/list`, response => {
          let data = '';
          response.on('data', chunk => { data += chunk; });
          response.on('end', () => resolve(JSON.parse(data).find(item => item.type === 'page' && item.url.includes('127.0.0.1:3000/index.html'))));
        }).on('error', reject);
      });
      if (page) return page;
    } catch (_) {
      // Chrome may still be starting.
    }
    await delay(250);
  }
  throw new Error('Chrome DevTools endpoint did not become ready');
}

async function run() {
  const page = await getPage();
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => { socket.onopen = resolve; });
  let messageId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = messageId++;
    const timeout = setTimeout(() => reject(new Error(`Timed out: ${method}`)), 5000);
    const handler = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      clearTimeout(timeout);
      socket.removeEventListener('message', handler);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    socket.addEventListener('message', handler);
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  };

  await send('Page.enable');
  for (let attempt = 0; attempt < 20; attempt++) {
    if (await evaluate(`document.readyState === 'complete' && !!document.getElementById('tu-khoa-pho-bien')`)) break;
    await delay(250);
  }
  const inspect = async width => {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    return evaluate(`(() => {
      const section = document.getElementById('tu-khoa-pho-bien');
      const title = section.querySelector('.keywords-title');
      const chips = [...section.querySelectorAll('.keyword-badge-link')];
      window.__keywordTargets = [];
      window.open = url => window.__keywordTargets.push(url);
      chips.forEach(chip => chip.click());
      const expected = chips.map(chip => 'viec-lam.html?keyword=' + encodeURIComponent(chip.dataset.keyword));
      return {
        width: ${width},
        chipCount: chips.length,
        fireCount: section.querySelectorAll('.keyword-hot-icon').length,
        refreshCount: [...section.querySelectorAll('*')].filter(node => node.textContent.trim() === 'Cập nhật mỗi 15 phút').length,
        headerSvgCount: title.querySelectorAll('svg').length,
        sectionFitsViewport: section.scrollWidth <= document.documentElement.clientWidth,
        targetsMatch: JSON.stringify(window.__keywordTargets) === JSON.stringify(expected)
      };
    })()`);
  };

  const results = [await inspect(1440), await inspect(375)];
  for (const result of results) {
    if (result.chipCount !== 12 || result.fireCount !== 0 || result.refreshCount !== 0 ||
        result.headerSvgCount !== 0 || !result.sectionFitsViewport || !result.targetsMatch) {
      throw new Error(`Verification failed: ${JSON.stringify(result)}`);
    }
  }
  console.log(JSON.stringify(results, null, 2));
  socket.close();
}

run()
  .then(() => 0)
  .catch(error => { console.error(error); return 1; })
  .then(async exitCode => {
    chrome.kill();
    await delay(750);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
    process.exitCode = exitCode;
  });
