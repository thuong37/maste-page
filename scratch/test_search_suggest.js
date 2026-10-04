const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testSearchSuggest() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9370',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);
  
  await new Promise(r => setTimeout(r, 2000));
  
  const list = await new Promise(res => {
    http.get('http://127.0.0.1:9370/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });

  const pageTarget = list.find(t => t.type === 'page') || list[0];
  console.log('Connecting to target:', pageTarget.url, 'type:', pageTarget.type);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  function send(m, p = {}) {
    return new Promise(res => {
      const mid = id++;
      const h = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === mid) {
          ws.removeEventListener('message', h);
          res(msg);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
  }
  await send('Page.enable');
  const loaded = new Promise(resolve => {
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Page.loadEventFired') {
        ws.removeEventListener('message', handler);
        resolve();
      }
    };
    ws.addEventListener('message', handler);
  });
  await send('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await loaded;
  await new Promise(r => setTimeout(r, 1200));

  // Click on heroSearchInput
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.getElementById('heroSearchInput');
      if (!input) return 'heroSearchInput not found! Available IDs: ' + Array.from(document.querySelectorAll('[id]')).map(e => e.id).slice(0, 10).join(', ');
      input.focus();
      input.click();
      return 'clicked input!';
    })()`,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.result.value);

  await new Promise(r => setTimeout(r, 600));

  // Inspect dimensions & computed styles
  const inspection = await send('Runtime.evaluate', {
    expression: `(() => {
      const dropdown = document.getElementById('searchSuggestDropdown');
      const jobs = document.querySelectorAll('.recommended-job');
      const firstJob = jobs[0];
      const logo = firstJob ? firstJob.querySelector('.recommended-job-logo') : null;
      const logoImg = logo ? logo.querySelector('img') : null;
      const title = firstJob ? firstJob.querySelector('.recommended-job-title') : null;
      const comp = firstJob ? firstJob.querySelector('.recommended-job-company') : null;
      const salary = firstJob ? firstJob.querySelector('.recommended-job-salary') : null;

      const toRectObj = (r) => r ? { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) } : null;

      return {
        isOpen: dropdown.classList.contains('is-open'),
        dropdownRect: toRectObj(dropdown.getBoundingClientRect()),
        jobsCount: jobs.length,
        logoRect: toRectObj(logo ? logo.getBoundingClientRect() : null),
        logoImgNatural: logoImg ? { w: logoImg.naturalWidth, h: logoImg.naturalHeight, src: logoImg.src } : null,
        titleText: title ? title.textContent : null,
        companyText: comp ? comp.textContent : null,
        salaryText: salary ? salary.textContent : null,
        salaryColor: salary ? window.getComputedStyle(salary).color : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Full inspection:', JSON.stringify(inspection, null, 2));
  const val = inspection.result?.result?.value;
  console.log('Inspection result:', JSON.stringify(val, null, 2));

  if (!val) {
    chrome.kill();
    return;
  }

  // Hover over the first job using CDP mouse event
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 750,
    y: 270
  });
  await new Promise(r => setTimeout(r, 200));

  // Test clicking on the first job
  const clickJobRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const firstJob = document.querySelector('.recommended-job');
      if (firstJob) {
        firstJob.click();
        return 'Clicked ' + firstJob.getAttribute('data-keyword');
      }
      return 'No job found';
    })()`,
    returnByValue: true
  });
  console.log('Click job result:', clickJobRes.result.result.value);

  // Wait 500ms to see if navigation triggered or input updated
  await new Promise(r => setTimeout(r, 600));
  const afterLoc = await send('Runtime.evaluate', {
    expression: 'document.location.href',
    returnByValue: true
  });
  console.log('After click URL:', afterLoc.result.result.value);

  // Also capture full viewport
  const fullScreenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch/search_suggest_full.png', fullScreenshot.result.data, 'base64');
  console.log('Full screenshot saved to scratch/search_suggest_full.png');

  chrome.kill();
}

testSearchSuggest().catch(console.error);
