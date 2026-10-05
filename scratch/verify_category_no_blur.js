const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9391',
  '--disable-gpu',
  '--disable-extensions',
  '--window-size=1440,900',
  'http://127.0.0.1:8000/viec-lam.html'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    await delay(2000);
    const targets = await getJson('http://127.0.0.1:9391/json/list');
    const page = targets.find(target => target.type === 'page');
    if (!page) throw new Error('Chrome page target was not found');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(resolve => { ws.onopen = resolve; });
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
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      }
      return result.result.value;
    };

    await send('Page.enable');
    const navigate = async path => {
      await send('Page.navigate', { url: `http://127.0.0.1:8000/${path}` });
      await delay(1000);
    };

    await navigate('viec-lam.html');
    await evaluate("document.getElementById('categoryFilterTrigger').click()");
    const desktop = await evaluate(`(() => {
      const backdrop = document.getElementById('categoryModalBackdrop');
      const style = getComputedStyle(backdrop);
      return {
        bodyScoped: document.body.classList.contains('job-list-page'),
        open: !document.getElementById('categoryModalOverlay').hidden,
        backdropFilter: style.backdropFilter,
        webkitBackdropFilter: style.webkitBackdropFilter,
        pointerEvents: style.pointerEvents,
        background: style.backgroundColor
      };
    })()`);
    if (!desktop.bodyScoped || !desktop.open || desktop.backdropFilter !== 'none' || (desktop.webkitBackdropFilter && desktop.webkitBackdropFilter !== 'none') || desktop.pointerEvents !== 'auto') {
      throw new Error(`Job-list backdrop state failed: ${JSON.stringify(desktop)}`);
    }

    await evaluate("document.getElementById('categoryModalBackdrop').click()");
    const closedOutside = await evaluate("document.getElementById('categoryModalOverlay').hidden");
    if (!closedOutside) throw new Error('Outside-click dismissal failed');

    await evaluate(`(() => {
      document.getElementById('categoryFilterTrigger').click();
      document.querySelector('.category-group-item[data-category="sales"] .cat-checkbox').click();
    })()`);
    const selection = await evaluate(`(() => ({
      allSubgroupsChecked: Array.from(document.querySelectorAll('#categorySubgroupList .cat-checkbox')).every(item => item.classList.contains('is-checked')),
      allRolesSelected: Array.from(document.querySelectorAll('#categorySubgroupList .category-specialty-pill')).every(item => item.classList.contains('is-selected'))
    }))()`);
    if (!selection.allSubgroupsChecked || !selection.allRolesSelected) throw new Error('Category selection behavior regressed');

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    const mobile = await evaluate(`(() => {
      const dialog = document.querySelector('.category-modal-dialog').getBoundingClientRect();
      const style = getComputedStyle(document.getElementById('categoryModalBackdrop'));
      return { backdropFilter: style.backdropFilter, width: dialog.width, viewport: document.documentElement.clientWidth };
    })()`);
    if (mobile.backdropFilter !== 'none' || mobile.width > mobile.viewport) throw new Error(`Mobile layout failed: ${JSON.stringify(mobile)}`);

    await send('Emulation.clearDeviceMetricsOverride');
    for (const path of ['index.html', 'chi-tiet-viec-lam.html']) {
      await navigate(path);
      await evaluate("document.getElementById('categoryFilterTrigger').click()");
      const blur = await evaluate("getComputedStyle(document.getElementById('categoryModalBackdrop')).backdropFilter");
      if (blur !== 'blur(4px)') throw new Error(`${path} shared blur changed: ${blur}`);
    }

    console.log(JSON.stringify({ desktop, closedOutside, selection, mobile, sharedPagesPreserveBlur: true }, null, 2));
    await send('Browser.close');
    ws.close();
  } catch (error) {
    console.error(error);
    chrome.kill();
    process.exitCode = 1;
  }
}

run();
