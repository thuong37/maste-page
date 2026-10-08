const { spawn } = require('child_process');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9468;
const BASE_URL = 'http://localhost:8765';
const EXPECTED_TITLE = 'Senior Product Designer (UI/UX App/Web)';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    }).on('error', reject);
  });
}

async function run() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--disable-extensions',
    '--no-first-run',
    '--user-data-dir=D:\\master page\\scratch\\chrome-profile-home-nav',
    '--window-size=1440,1000',
    `${BASE_URL}/index.html`
  ]);

  try {
    await delay(1800);
    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const target = targets.find(item => item.type === 'page');
    if (!target) throw new Error('Chrome page target was not created.');

    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(resolve => { socket.onopen = resolve; });
    let commandId = 0;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++commandId;
      const onMessage = event => {
        const message = JSON.parse(event.data);
        if (message.id !== id) return;
        socket.removeEventListener('message', onMessage);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      };
      socket.addEventListener('message', onMessage);
      socket.send(JSON.stringify({ id, method, params }));
    });

    await send('Runtime.enable');
    await delay(800);

    const prepared = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('heroSearchInput');
        input.focus();
        input.value = 'UI/UX';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      })()`,
      returnByValue: true
    });
    if (!prepared.result.value) throw new Error('Could not prepare homepage search.');
    await delay(350);

    const clicked = await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('heroSearchInput');
        const jobs = [...document.querySelectorAll('.recommended-job')];
        const target = jobs.find(item => item.querySelector('.recommended-job-title')?.textContent.trim() === ${JSON.stringify(EXPECTED_TITLE)});
        if (!target) return { clicked: false, titles: jobs.map(item => item.textContent.trim()) };
        const featured = document.querySelector('#featuredJobsGrid .job-title');
        const targetUrl = new URL(target.href);
        const featuredUrl = featured ? new URL(featured.href) : null;
        const preflight = {
          recommendationTag: target.tagName,
          recommendationTarget: target.target,
          recommendationId: targetUrl.searchParams.get('id'),
          recommendationTitle: targetUrl.searchParams.get('title'),
          featuredTag: featured?.tagName || '',
          featuredTarget: featured?.target || '',
          featuredPath: featuredUrl?.pathname || '',
          featuredTitle: featuredUrl?.searchParams.get('title') || ''
        };
        input.value = 'Marketing Leader';
        target.click();
        return { clicked: true, preflight };
      })()`,
      returnByValue: true
    });
    if (!clicked.result.value.clicked) throw new Error(`Target job was not rendered: ${JSON.stringify(clicked.result.value)}`);
    const preflight = clicked.result.value.preflight;
    if (preflight.recommendationTag !== 'A' || preflight.recommendationTarget) throw new Error('Recommended job is not a same-tab semantic link.');
    if (preflight.recommendationId !== '3' || preflight.recommendationTitle !== EXPECTED_TITLE) throw new Error(`Recommended link is not canonical: ${JSON.stringify(preflight)}`);
    if (preflight.featuredTag !== 'A' || preflight.featuredTarget || preflight.featuredPath !== '/chi-tiet-viec-lam.html' || !preflight.featuredTitle) {
      throw new Error(`Featured title link is invalid: ${JSON.stringify(preflight)}`);
    }

    await delay(900);
    const result = await send('Runtime.evaluate', {
      expression: `(() => ({
        href: location.href,
        title: document.getElementById('jdTitle')?.textContent.trim() || '',
        params: Object.fromEntries(new URLSearchParams(location.search))
      }))()`,
      returnByValue: true
    });
    const value = result.result.value;
    const failures = [];
    if (!value.href.includes('/chi-tiet-viec-lam.html?')) failures.push(`wrong page: ${value.href}`);
    if (value.params.id !== '3') failures.push(`id=${value.params.id}`);
    if (value.params.title !== EXPECTED_TITLE) failures.push(`title=${value.params.title}`);
    if (value.params.keyword !== 'Marketing Leader') failures.push(`keyword=${value.params.keyword}`);
    if (value.title !== EXPECTED_TITLE) failures.push(`rendered title=${value.title}`);
    if (failures.length) throw new Error(failures.join('; '));

    console.log(JSON.stringify({ status: 'PASS', ...value }, null, 2));
    socket.close();
  } finally {
    chrome.kill();
  }
}

run().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
