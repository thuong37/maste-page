const { spawn } = require('child_process');
const fs = require('fs');

const chrome = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function inspect(width, height, port, sticky) {
  const browser = spawn(chrome, [
    '--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`, 'http://127.0.0.1:3000/viec-lam.html'
  ]);

  try {
    await delay(1800);
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const page = tabs.find(tab => tab.url.includes('viec-lam.html'));
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve));
    let id = 0;
    const send = (method, params = {}) => new Promise(resolve => {
      const requestId = ++id;
      const handler = event => {
        const message = JSON.parse(event.data);
        if (message.id !== requestId) return;
        ws.removeEventListener('message', handler);
        resolve(message.result);
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: requestId, method, params }));
    });

    await send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile: width <= 900
    });

    const result = await send('Runtime.evaluate', {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        if (${sticky}) {
          window.scrollTo(0, 700);
          window.dispatchEvent(new Event('scroll'));
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        const input = document.getElementById('jobSearchInput');
        input.focus();
        input.click();
        await new Promise(resolve => requestAnimationFrame(resolve));
        const box = document.getElementById('jobSearchForm').getBoundingClientRect();
        const popup = document.getElementById('searchSuggestDropdown').getBoundingClientRect();
        const stickyBar = document.getElementById('heroSearchStickyBar');
        const filter = document.getElementById('topFilterBar');
        return {
          popupOpen: document.getElementById('searchSuggestDropdown').classList.contains('is-open'),
          gap: Math.round(popup.top - box.bottom),
          popupWithinViewport: popup.left >= 0 && popup.right <= innerWidth + 1,
          filterInsideStickyBar: stickyBar.contains(filter),
          stickyActive: stickyBar.classList.contains('is-sticky')
        };
      })()`
    });
    ws.close();
    return result.result.value;
  } finally {
    browser.kill();
  }
}

(async () => {
  const cases = [
    ['desktop', await inspect(1440, 900, 9331, false), false],
    ['desktop-sticky', await inspect(1440, 900, 9332, true), true],
    ['mobile', await inspect(375, 812, 9333, false), false]
  ];

  for (const [name, result, expectSticky] of cases) {
    const pass = result.popupOpen && result.gap === 8 && result.popupWithinViewport &&
      result.filterInsideStickyBar && result.stickyActive === expectSticky;
    console.log(name, JSON.stringify(result), pass ? 'PASS' : 'FAIL');
    if (!pass) process.exitCode = 1;
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
