const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9231;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,1000',
  'http://localhost:3000/index.html'
]);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage() {
  await delay(2200);
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, response => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data).find(page => page.url.includes('localhost:3000'))));
    }).on('error', reject);
  });
}

async function run() {
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

  await evaluate(`document.getElementById('industryFilterTrigger').click()`);
  await delay(250);
  const opened = await evaluate(`JSON.stringify({
    open: document.getElementById('searchSuggestDropdown').classList.contains('is-open'),
    mode: document.getElementById('searchSuggestDropdown').classList.contains('is-industry-mode'),
    expanded: document.getElementById('industryFilterTrigger').getAttribute('aria-expanded'),
    focused: document.activeElement.id,
    panelHeight: Math.round(document.getElementById('searchSuggestDropdown').getBoundingClientRect().height)
  })`);
  console.log('desktop-open', opened);

  await evaluate(`(() => {
    const input = document.getElementById('industryFilterSearch');
    input.value = 'Frontend ReactJS';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await delay(150);
  await evaluate(`document.querySelector('[data-role="Frontend ReactJS"]').click()`);
  const selected = await evaluate(`JSON.stringify({
    status: document.getElementById('industryPickerStatus').textContent,
    applyDisabled: document.getElementById('industryFilterApply').disabled,
    selectedCount: document.querySelectorAll('.is-selected').length
  })`);
  console.log('desktop-selected', selected);

  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.resolve(__dirname, 'industry_filter_desktop.png'), Buffer.from(desktopShot.data, 'base64'));

  await evaluate(`document.getElementById('heroSearchInput').value = 'Senior'`);
  await evaluate(`document.getElementById('industryFilterApply').click()`);
  const applied = await evaluate(`JSON.stringify({
    value: document.getElementById('heroSearchInput').value,
    label: document.getElementById('industryFilterLabel').textContent,
    open: document.getElementById('searchSuggestDropdown').classList.contains('is-open'),
    focus: document.activeElement.id
  })`);
  console.log('desktop-applied', applied);

  await evaluate(`document.getElementById('btnHeroSearch').click()`);
  await delay(700);
  const integrated = await evaluate(`JSON.stringify({
    path: location.pathname,
    keyword: new URLSearchParams(location.search).get('keyword'),
    category: new URLSearchParams(location.search).get('category'),
    industry: new URLSearchParams(location.search).get('industry'),
    resultKeyword: document.getElementById('jobSearchInput')?.value,
    resultCategory: document.getElementById('jobCategorySelect')?.value,
    badge: document.getElementById('activeKeywordText')?.textContent
  })`);
  console.log('results-integration', integrated);

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate(`location.assign('http://localhost:3000/index.html')`);
  await delay(700);
  await evaluate(`document.getElementById('industryFilterTrigger').click()`);
  await delay(200);
  const mobile = await evaluate(`JSON.stringify({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    triggerWidth: Math.round(document.getElementById('industryFilterTrigger').getBoundingClientRect().width),
    panelWidth: Math.round(document.getElementById('searchSuggestDropdown').getBoundingClientRect().width),
    footerBottom: Math.round(document.querySelector('.industry-picker-footer').getBoundingClientRect().bottom),
    footerVisible: !!document.getElementById('industryFilterApply').offsetParent
  })`);
  console.log('mobile-open', mobile);
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.resolve(__dirname, 'industry_filter_mobile.png'), Buffer.from(mobileShot.data, 'base64'));

  const checks = [
    JSON.parse(opened).open && JSON.parse(opened).mode && JSON.parse(opened).expanded === 'true',
    JSON.parse(selected).status.includes('Frontend ReactJS') && !JSON.parse(selected).applyDisabled,
    JSON.parse(applied).value === 'Senior' && JSON.parse(applied).label === 'Frontend ReactJS' && !JSON.parse(applied).open,
    JSON.parse(integrated).keyword === 'Senior' && JSON.parse(integrated).category === 'it' && JSON.parse(integrated).industry === 'Frontend ReactJS' && JSON.parse(integrated).resultKeyword === 'Senior' && JSON.parse(integrated).resultCategory === 'it',
    JSON.parse(mobile).viewport === JSON.parse(mobile).scrollWidth && JSON.parse(mobile).footerVisible && JSON.parse(mobile).footerBottom <= 844
  ];
  if (checks.some(check => !check)) throw new Error(`Industry filter checks failed: ${JSON.stringify(checks)}`);
  console.log('PASS industry filter interaction and responsive checks');
  chrome.kill();
}

run().catch(error => {
  console.error(error);
  chrome.kill();
  process.exitCode = 1;
});
