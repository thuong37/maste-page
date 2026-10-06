const { spawn } = require('child_process');
const http = require('http');

async function testInteractions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9337;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/chi-tiet-viec-lam.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const target = list.find(t => t.type === 'page' && t.url.includes('chi-tiet')) || list[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    // Collect errors
    const errors = [];
    ws.addEventListener('message', e => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    });

    await send('Runtime.enable');

    // Test opening exp dropdown
    const testRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const expBtn = document.getElementById('ctExpFilterBtn');
        const expMenu = document.getElementById('ctExpDropdownMenu');
        if (!expBtn || !expMenu) return { error: 'elements not found' };
        
        // Before click
        const beforeHidden = expMenu.hidden;
        
        // Click expBtn
        expBtn.click();
        const afterClickHidden = expMenu.hidden;
        
        // Click salaryBtn
        const salBtn = document.getElementById('ctSalaryFilterBtn');
        const salMenu = document.getElementById('ctSalaryDropdownMenu');
        salBtn.click();
        const salMenuHidden = salMenu ? salMenu.hidden : null;
        const expMenuAfterSal = expMenu.hidden;
        
        // Saved filters trigger
        const sfBtn = document.getElementById('ctSavedFiltersTrigger');
        const sfDialog = document.getElementById('ctSavedFiltersDialog');
        sfBtn.click();
        const sfHidden = sfDialog.hidden;

        return {
          beforeHidden,
          afterClickHidden,
          salMenuHidden,
          expMenuAfterSal,
          sfHidden
        };
      })()`,
      returnByValue: true
    });

    console.log('Interactions result:', testRes.result ? testRes.result.value : testRes);
    console.log('Console errors:', errors);
    ws.close();
  } finally {
    chrome.kill();
  }
}

testInteractions().catch(console.error);
