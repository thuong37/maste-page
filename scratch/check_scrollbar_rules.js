const { spawn } = require('child_process');
const http = require('http');

async function check() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9228;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'http://localhost:3000/viec-lam.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const list = JSON.parse(d);
      const p = list.find(item => item.url && item.url.includes('viec-lam.html')) || list[0];
      const ws = new WebSocket(p.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const r = [];
                for (let s of document.styleSheets) {
                  const info = { href: s.href, ruleCount: 0, scrollRules: [] };
                  try {
                    const rules = s.cssRules || s.rules;
                    info.ruleCount = rules ? rules.length : 0;
                    for (let rule of rules) {
                      if (rule.selectorText && rule.selectorText.includes('scrollbar')) {
                        info.scrollRules.push({ selector: rule.selectorText, cssText: rule.cssText });
                      }
                      if (rule.cssRules) {
                        for (let sub of rule.cssRules) {
                          if (sub.selectorText && sub.selectorText.includes('scrollbar')) {
                            info.scrollRules.push({ selector: sub.selectorText, cssText: sub.cssText });
                          }
                        }
                      }
                    }
                  } catch(e) {
                    info.error = e.message;
                  }
                  r.push(info);
                }
                return r;
              })()
            `,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Rules found:', JSON.stringify(data.result.result.value, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}
check();
