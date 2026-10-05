const { spawn } = require('child_process');

async function measure() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9235', '--window-size=1440,900', 'http://localhost:3000/viec-lam.html']);
  await new Promise(r => setTimeout(r, 2000));
  const listRes = await fetch('http://127.0.0.1:9235/json');
  const tabs = await listRes.json();
  const pageTab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(res => {
      const id = msgId++;
      const h = e => {
        const d = JSON.parse(e.data);
        if (d.id === id) { ws.removeEventListener('message', h); res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const form = document.getElementById('jobSearchForm');
      const trigger = document.getElementById('categoryFilterTrigger');
      const topFilter = document.getElementById('topFilterBar');
      const stickyBar = document.getElementById('heroSearchStickyBar');
      const siteHeader = document.querySelector('.site-header');

      return {
        siteHeader: siteHeader ? { top: Math.round(siteHeader.getBoundingClientRect().top), bottom: Math.round(siteHeader.getBoundingClientRect().bottom), height: Math.round(siteHeader.getBoundingClientRect().height) } : null,
        form: form ? { top: Math.round(form.getBoundingClientRect().top), bottom: Math.round(form.getBoundingClientRect().bottom), height: Math.round(form.getBoundingClientRect().height) } : null,
        trigger: trigger ? { top: Math.round(trigger.getBoundingClientRect().top), bottom: Math.round(trigger.getBoundingClientRect().bottom) } : null,
        topFilter: topFilter ? { top: Math.round(topFilter.getBoundingClientRect().top), bottom: Math.round(topFilter.getBoundingClientRect().bottom), height: Math.round(topFilter.getBoundingClientRect().height) } : null,
        stickyBar: stickyBar ? { top: Math.round(stickyBar.getBoundingClientRect().top), bottom: Math.round(stickyBar.getBoundingClientRect().bottom), height: Math.round(stickyBar.getBoundingClientRect().height) } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Measurements:', JSON.stringify(evalRes.result.value, null, 2));
  ws.close();
  proc.kill();
}
measure();
