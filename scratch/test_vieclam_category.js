const { spawn } = require('child_process');
const http = require('http');

async function testViecLam() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9380',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(res => {
    http.get('http://127.0.0.1:9380/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });
  const pageTarget = list.find(t => t.type === 'page') || list[0];
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
  await send('Page.navigate', { url: 'http://localhost:3000/viec-lam.html' });
  await new Promise(r => setTimeout(r, 1500));

  // Click open category filter on viec-lam.html
  await send('Runtime.evaluate', { expression: 'document.getElementById("categoryFilterTrigger").click()' });
  await new Promise(r => setTimeout(r, 400));

  // Click checkbox sales
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const cb = document.querySelector('.category-group-item[data-category="sales"] .cat-checkbox');
      cb.click();
      const subs = Array.from(document.querySelectorAll('#categorySubgroupList .cat-checkbox'));
      const roles = Array.from(document.querySelectorAll('#categorySubgroupList .category-specialty-pill'));
      return {
        allSubsChecked: subs.every(s => s.classList.contains('is-checked')),
        allRolesSelected: roles.every(r => r.classList.contains('is-selected')),
        subsCount: subs.length,
        rolesCount: roles.length
      };
    })()`,
    returnByValue: true
  });
  console.log('ViecLam Test Result:', res.result.result.value);
  await send('Browser.close');
  try { chrome.kill(); } catch (e) {}
}
testViecLam();
