const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9255;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,1000',
  'http://localhost:3000/index.html'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage() {
  await delay(2000);
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, response => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data).find(page => page.url.includes('localhost:3000'))));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const page = await getPage();
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(resolve => {
      const messageId = id++;
      const handler = event => {
        const message = JSON.parse(event.data);
        if (message.id === messageId) {
          ws.removeEventListener('message', handler);
          resolve(message.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });
    await new Promise(resolve => { ws.onopen = resolve; });

    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return result.result.value;
    };

    // Open modal and select Digital Marketing
    await evaluate(`(() => {
      document.getElementById('categoryFilterTrigger').click();
    })()`);
    await delay(300);

    // Click checkbox or specialty pill
    await evaluate(`(() => {
      const pill = document.querySelector('.category-specialty-pill');
      if (pill) pill.click();
      document.getElementById('btnCategorySubmit').click();
    })()`);
    await delay(300);

    // Click "Tìm việc ngay"
    await evaluate(`(() => {
      document.getElementById('btnHeroSearch').click();
    })()`);
    await delay(1200);

    const currentUrl = await evaluate(`window.location.href`);
    console.log('Redirected URL from Home Search:', currentUrl);

    ws.close();
    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}

run();
