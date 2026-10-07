const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9463;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1200',
    'http://localhost:3000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:' + port + '/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    function send(method, params = {}) {
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

    await send('Page.enable');
    await send('Runtime.enable');

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const indicator = document.getElementById('autoPageTimerIndicator');
        const footerBar = document.getElementById('featuredJobsFooterBar');
        const controls = document.getElementById('featuredPaginationControls');
        const btns = controls ? Array.from(controls.querySelectorAll('.featured-page-btn')).map(b => b.innerText.trim() || b.getAttribute('aria-label')) : [];
        return {
          indicatorExists: !!indicator,
          footerBarChildren: footerBar ? footerBar.children.length : 0,
          footerBarJustify: footerBar ? window.getComputedStyle(footerBar).justifyContent : null,
          buttons: btns
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM Evaluation:', JSON.stringify(evalResult.result.value, null, 2));

    // Scroll to footer bar and capture
    await send('Runtime.evaluate', {
      expression: `(() => {
        const fb = document.getElementById('featuredJobsFooterBar');
        if (fb) {
          const y = fb.getBoundingClientRect().top + window.scrollY - 300;
          window.scrollTo(0, y);
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 300));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/featured_pagination_footer.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/featured_pagination_footer.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

test().catch(console.error);
