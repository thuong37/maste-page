const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testIframeScrollbar() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9229;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/viec-lam.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const page = list.find(p => p.url.includes('viec-lam.html')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
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

  // Click Mobile Web button
  await send('Runtime.evaluate', {
    expression: `document.getElementById('floatingBtnMobile').click();`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 2500));

  // Inspect iframe
  const evalIframe = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const iframe = document.getElementById('mobileSimulatorIframe');
        if (!iframe) return { error: 'Iframe not found' };
        
        let doc;
        try {
          doc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (e) {
          return { error: 'Access denied: ' + e.message };
        }
        
        if (!doc) return { error: 'No document in iframe' };

        const html = doc.documentElement;
        const body = doc.body;
        
        const htmlStyle = doc.defaultView.getComputedStyle(html);
        const bodyStyle = doc.defaultView.getComputedStyle(body);

        return {
          iframeSrc: iframe.src,
          htmlClass: html.className,
          bodyClass: body.className,
          htmlOverflowX: htmlStyle.overflowX,
          htmlOverflowY: htmlStyle.overflowY,
          bodyOverflowX: bodyStyle.overflowX,
          bodyOverflowY: bodyStyle.overflowY,
          htmlScrollbarWidth: htmlStyle.scrollbarWidth,
          bodyScrollbarWidth: bodyStyle.scrollbarWidth,
          injectedStyleTag: !!doc.getElementById('easycv-injected-scroll-killer'),
          easycvScrollbarKiller: !!doc.getElementById('easycv-scrollbar-killer'),
          clientWidth: html.clientWidth,
          scrollWidth: html.scrollWidth,
          hasHorizontalScroll: html.scrollWidth > html.clientWidth
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Iframe evaluation:', JSON.stringify(evalIframe.result.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.resolve(__dirname, 'test_iframe_result.png'), Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to scratch/test_iframe_result.png');
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

testIframeScrollbar().catch(e => {
  console.error(e);
  process.exit(1);
});
