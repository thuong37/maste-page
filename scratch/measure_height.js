const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9237',
  '--window-size=1440,900',
  'http://localhost:3000/viec-lam.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9237/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          returnByValue: true,
          expression: `(() => {
            document.getElementById('categoryFilterTrigger').click();
            const r = document.querySelector('.category-modal-dialog').getBoundingClientRect();
            return JSON.stringify({
              top: Math.round(r.top),
              height: Math.round(r.height),
              bottom: Math.round(r.bottom)
            });
          })()`
        }
      }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.id === 1) {
        console.log('FULL_RES:', JSON.stringify(data));
        proc.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    proc.kill();
    console.error(err);
  }
}, 2000);
