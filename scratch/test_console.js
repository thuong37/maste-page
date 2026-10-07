const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testWithConsole() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/index.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9229/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const msgId = id++;
      const handler = e => {
        const m = JSON.parse(e.data);
        if (m.id === msgId) { ws.removeEventListener('message', handler); res(m.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    ws.addEventListener('message', e => {
      const m = JSON.parse(e.data);
      if (m.method === 'Runtime.consoleAPICalled') {
        console.log('PAGE CONSOLE:', m.params.type, m.params.args.map(a => a.value || a.description).join(' '));
      }
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');

    // Chờ 1 giây cho JS thực thi đầy đủ
    await new Promise(r => setTimeout(r, 1500));

    // Kiểm tra số lượng thẻ job
    const info = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const grid = document.getElementById('featuredJobsGrid');
          const cards = document.querySelectorAll('#featuredJobsGrid .job-card');
          return {
            gridExists: !!grid,
            gridInnerHTML: grid ? grid.innerHTML.slice(0, 100) : '',
            cardCount: cards.length
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Info:', info.result.value);

    // Cuộn tới #viec-lam-noi-bat
    await send('Runtime.evaluate', {
      expression: `
        const section = document.getElementById('viec-lam-noi-bat');
        if (section) section.scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // Lấy thông tin thẻ đầu tiên
    const cardMetrics = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#featuredJobsGrid .job-card');
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          const logo = card.querySelector('.job-logo-wrapper');
          const logoRect = logo ? logo.getBoundingClientRect() : null;
          const timeEl = card.querySelector('.job-posted-time');
          const applyBtn = card.querySelector('.btn-card-apply');
          
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            logoWidth: logoRect ? logoRect.width : 0,
            logoHeight: logoRect ? logoRect.height : 0,
            timeDisplay: timeEl ? window.getComputedStyle(timeEl).display : 'none',
            applyDisplay: applyBtn ? window.getComputedStyle(applyBtn).display : 'none'
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Card metrics:', cardMetrics.result.value);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verified_scroll_test.png', Buffer.from(shot.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
  }
}

testWithConsole().catch(console.error);
