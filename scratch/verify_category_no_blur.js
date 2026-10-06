const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9391',
  '--disable-gpu',
  '--disable-extensions',
  '--user-data-dir=D:\\master page\\scratch\\chrome-profile-category-backdrop',
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
    if (!desktop.bodyScoped || !desktop.open || desktop.backdropFilter !== 'none' || (desktop.webkitBackdropFilter && desktop.webkitBackdropFilter !== 'none') || desktop.pointerEvents !== 'auto' || desktop.background !== 'rgba(0, 0, 0, 0)') {
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
      return { backdropFilter: style.backdropFilter, background: style.backgroundColor, width: dialog.width, viewport: document.documentElement.clientWidth };
    })()`);
    if (mobile.backdropFilter !== 'none' || mobile.background !== 'rgba(0, 0, 0, 0)' || mobile.width > mobile.viewport) throw new Error(`Mobile layout failed: ${JSON.stringify(mobile)}`);

    await send('Emulation.clearDeviceMetricsOverride');
    for (const path of ['index.html', 'public/index.html']) {
      await navigate(path);
      await evaluate("document.getElementById('categoryFilterTrigger').click()");
      const homepageBackdrop = await evaluate(`(() => {
        const style = getComputedStyle(document.getElementById('categoryModalBackdrop'));
        return {
          bodyScoped: document.body.classList.contains('home-page'),
          blur: style.backdropFilter,
          background: style.backgroundColor,
          pointerEvents: style.pointerEvents
        };
      })()`);
      if (!homepageBackdrop.bodyScoped || homepageBackdrop.blur !== 'none' || homepageBackdrop.background !== 'rgba(0, 0, 0, 0)' || homepageBackdrop.pointerEvents !== 'auto') {
        throw new Error(`${path} homepage backdrop state failed: ${JSON.stringify(homepageBackdrop)}`);
      }
    }

    for (const path of ['chi-tiet-viec-lam.html', 'public/chi-tiet-viec-lam.html']) {
      await navigate(path);
      await evaluate("document.getElementById('categoryFilterTrigger').click()");
      const detailBackdrop = await evaluate(`(() => {
        const style = getComputedStyle(document.getElementById('categoryModalBackdrop'));
        return {
          bodyScoped: document.body.classList.contains('job-detail-page'),
          blur: style.backdropFilter,
          background: style.backgroundColor,
          pointerEvents: style.pointerEvents
        };
      })()`);
      if (!detailBackdrop.bodyScoped || detailBackdrop.blur !== 'none' || detailBackdrop.background !== 'rgba(0, 0, 0, 0)' || detailBackdrop.pointerEvents !== 'auto') {
        throw new Error(`${path} detail backdrop state failed: ${JSON.stringify(detailBackdrop)}`);
      }
    }

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await navigate('chi-tiet-viec-lam.html?id=3');
    await evaluate("document.getElementById('categoryFilterTrigger').click()");
    const detailMobile = await evaluate(`(() => {
      const dialog = document.querySelector('.category-modal-dialog').getBoundingClientRect();
      const backdrop = getComputedStyle(document.getElementById('categoryModalBackdrop'));
      return {
        blur: backdrop.backdropFilter,
        background: backdrop.backgroundColor,
        pointerEvents: backdrop.pointerEvents,
        width: dialog.width,
        viewport: document.documentElement.clientWidth
      };
    })()`);
    if (detailMobile.blur !== 'none' || detailMobile.background !== 'rgba(0, 0, 0, 0)' || detailMobile.pointerEvents !== 'auto' || detailMobile.width > detailMobile.viewport) {
      throw new Error(`Job Detail mobile backdrop state failed: ${JSON.stringify(detailMobile)}`);
    }
    await send('Emulation.clearDeviceMetricsOverride');

    await navigate('public/viec-lam.html');
    await evaluate("document.getElementById('categoryFilterTrigger').click()");
    const publicJobList = await evaluate(`(() => {
      const style = getComputedStyle(document.getElementById('categoryModalBackdrop'));
      return {
        bodyScoped: document.body.classList.contains('job-list-page'),
        blur: style.backdropFilter,
        background: style.backgroundColor,
        pointerEvents: style.pointerEvents
      };
    })()`);
    if (!publicJobList.bodyScoped || publicJobList.blur !== 'none' || publicJobList.background !== 'rgba(0, 0, 0, 0)' || publicJobList.pointerEvents !== 'auto') {
      throw new Error(`public/viec-lam.html backdrop state failed: ${JSON.stringify(publicJobList)}`);
    }

    console.log(JSON.stringify({ desktop, closedOutside, selection, mobile, detailMobile, publicJobList, homepageMatchesJobList: true, jobDetailMatchesJobList: true }, null, 2));
    await send('Browser.close');
    ws.close();
  } catch (error) {
    console.error(error);
    chrome.kill();
    process.exitCode = 1;
  }
}

run();
