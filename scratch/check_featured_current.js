const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9452',
    '--disable-gpu',
    'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9452/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  console.log('List of targets:', list.map(p => ({ title: p.title, url: p.url })));
  const page = list.find(p => p.url.includes('index.html')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  function send(method, params) {
    return new Promise(res => {
      const msgId = id++;
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll("#featuredIndustryTabs .filter-pill-btn")).map(t => ({
        cat: t.getAttribute("data-category"),
        active: t.classList.contains("active"),
        text: t.innerText.replace(/\\s+/g, ' ').trim()
      }));
      const cards = document.querySelectorAll("#featuredJobsGrid .job-card").length;
      const pag = document.getElementById("featuredPaginationControls");
      const timer = document.getElementById("autoPageTimerIndicator");
      return { 
        tabs, 
        cards, 
        pagControlsChildren: pag ? pag.children.length : 0,
        timerDisplay: timer ? window.getComputedStyle(timer).display : null 
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
  chrome.kill();
}
test().catch(console.error);
