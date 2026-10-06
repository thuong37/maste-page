const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--remote-debugging-port=9277', '--disable-gpu', '--window-size=1440,1000', 'http://127.0.0.1:8000/index.html'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9277/json/list', res => {
    let d = ''; res.on('data', c => d += c);
    res.on('end', () => {
      const page = JSON.parse(d).find(p => p.url.includes('127.0.0.1:8000'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: 'document.getElementById("categoryFilterTrigger").click()' } }));
        setTimeout(() => {
          ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
          ws.onmessage = e => {
            const msg = JSON.parse(e.data);
            if (msg.id === 2) {
              fs.writeFileSync('scratch/category_modal_unscrolled_aligned.png', Buffer.from(msg.result.data, 'base64'));
              chrome.kill();
              console.log('Saved scratch/category_modal_unscrolled_aligned.png');
            }
          };
        }, 500);
      };
    });
  });
}, 2000);
