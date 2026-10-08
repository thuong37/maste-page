const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = Number(process.env.EASYCV_DEBUG_PORT || 9300 + (process.pid % 500));
const profilePath = path.join(os.tmpdir(), `easycv-rating-${process.pid}`);
const projectRoot = path.resolve(__dirname, '..');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

async function run() {
  const server = spawn(process.execPath, [path.join(__dirname, 'server.js')], { cwd: projectRoot, stdio: 'ignore' });
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    `--user-data-dir=${profilePath}`,
    'http://localhost:3000/chi-tiet-viec-lam.html?id=1'
  ], { stdio: 'ignore' });

  try {
    await wait(2200);
    const pages = await getJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = pages.find(item => item.url.includes('chi-tiet-viec-lam.html'));
    if (!page) throw new Error('Job detail page was not opened');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(resolve => { ws.onopen = resolve; });
    let id = 0;
    const send = (method, params = {}) => new Promise(resolve => {
      const messageId = ++id;
      const handler = event => {
        const message = JSON.parse(event.data);
        if (message.id !== messageId) return;
        ws.removeEventListener('message', handler);
        resolve(message.result);
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });

    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };

    const initial = await evaluate(`(() => {
      localStorage.removeItem('easycv_job_transparency_ratings_v2');
      location.reload();
      return true;
    })()`);
    if (!initial) throw new Error('Could not reset rating state');
    await wait(800);

    const desktop = await evaluate(`(() => {
      const group = document.getElementById('jdRating');
      const buttons = [...group.querySelectorAll('[role="radio"]')];
      buttons[2].focus();
      buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      const arrowActiveIndex = buttons.findIndex(button => button.getAttribute('aria-checked') === 'true');
      const arrowFocusIndex = buttons.indexOf(document.activeElement);
      const arrowTabIndexes = buttons.map(button => button.tabIndex);
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      const homeIndex = buttons.findIndex(button => button.getAttribute('aria-checked') === 'true');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      const endIndex = buttons.findIndex(button => button.getAttribute('aria-checked') === 'true');
      buttons[1].click();
      const clickIndex = buttons.findIndex(button => button.getAttribute('aria-checked') === 'true');
      buttons[2].focus();
      buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      return {
        count: buttons.length,
        labels: buttons.map(button => button.textContent.trim()),
        ariaLabels: buttons.map(button => button.getAttribute('aria-label')),
        describedBy: group.getAttribute('aria-describedby'),
        liveMode: document.getElementById('jdRatingStatus').getAttribute('aria-live'),
        arrowActiveIndex,
        arrowFocusIndex,
        arrowTabIndexes,
        homeIndex,
        endIndex,
        clickIndex,
        activeIndex: buttons.findIndex(button => button.getAttribute('aria-checked') === 'true'),
        focusIndex: buttons.indexOf(document.activeElement),
        tabIndexes: buttons.map(button => button.tabIndex),
        status: document.getElementById('jdRatingStatus').textContent.trim(),
        stored: JSON.parse(localStorage.getItem('easycv_job_transparency_ratings_v2') || '{}')['1'],
        columns: getComputedStyle(group).gridTemplateColumns,
        boxWidth: document.querySelector('.jd-rating-box').getBoundingClientRect().width
      };
    })()`);

    await evaluate(`(() => { location.reload(); return true; })()`);
    await wait(800);
    desktop.persisted = await evaluate(`(() => {
      const buttons = [...document.querySelectorAll('#jdRating [role="radio"]')];
      return {
        activeIndex: buttons.findIndex(button => button.getAttribute('aria-checked') === 'true'),
        tabIndexes: buttons.map(button => button.tabIndex),
        status: document.getElementById('jdRatingStatus').textContent.trim()
      };
    })()`);

    const desktopClip = await evaluate(`(() => {
      const element = document.querySelector('.jd-rating-box');
      element.scrollIntoView({ block: 'center' });
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: scrollY + rect.y, width: rect.width, height: rect.height };
    })()`);
    const desktopShot = await send('Page.captureScreenshot', { format: 'png', clip: { ...desktopClip, scale: 1 } });
    fs.writeFileSync(path.join(__dirname, 'job-trust-rating-desktop.png'), Buffer.from(desktopShot.data, 'base64'));

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    const mobile = await evaluate(`(() => {
      const box = document.querySelector('.jd-rating-box').getBoundingClientRect();
      const options = document.getElementById('jdRating').getBoundingClientRect();
      return {
        viewport: innerWidth,
        boxRight: Math.round(box.right),
        optionsRight: Math.round(options.right),
        bodyScrollWidth: document.body.scrollWidth,
        statusPosition: getComputedStyle(document.getElementById('jdRatingStatus')).alignSelf
      };
    })()`);
    const mobileClip = await evaluate(`(() => {
      const element = document.querySelector('.jd-rating-box');
      element.scrollIntoView({ block: 'center' });
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: scrollY + rect.y, width: rect.width, height: rect.height };
    })()`);
    const mobileShot = await send('Page.captureScreenshot', { format: 'png', clip: { ...mobileClip, scale: 1 } });
    fs.writeFileSync(path.join(__dirname, 'job-trust-rating-mobile.png'), Buffer.from(mobileShot.data, 'base64'));

    const pass = desktop.count === 5 && desktop.ariaLabels.every(Boolean) &&
      desktop.describedBy === 'jdRatingHint jdRatingStatus' && desktop.liveMode === 'polite' &&
      desktop.arrowActiveIndex === 3 && desktop.arrowFocusIndex === 3 &&
      desktop.arrowTabIndexes.filter(value => value === 0).length === 1 &&
      desktop.homeIndex === 0 && desktop.endIndex === 4 && desktop.clickIndex === 1 &&
      desktop.activeIndex === 3 && desktop.focusIndex === 3 && desktop.stored === 3 &&
      desktop.tabIndexes.join(',') === '-1,-1,-1,0,-1' &&
      desktop.persisted.activeIndex === 3 && desktop.persisted.tabIndexes.join(',') === '-1,-1,-1,0,-1' &&
      desktop.status.includes('Khá minh bạch') && desktop.persisted.status.includes('Khá minh bạch') &&
      mobile.bodyScrollWidth <= mobile.viewport &&
      mobile.boxRight <= mobile.viewport && mobile.optionsRight <= mobile.viewport;
    console.log(JSON.stringify({ pass, desktop, mobile }, null, 2));
    ws.close();
    if (!pass) process.exitCode = 1;
  } finally {
    chrome.kill();
    server.kill();
    await wait(500);
    fs.rmSync(profilePath, { recursive: true, force: true });
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
