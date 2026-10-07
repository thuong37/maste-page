const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function shot() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9410', '--disable-gpu', '--window-size=390,844', 'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(r => http.get('http://127.0.0.1:9410/json/list', res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(JSON.parse(d)));
  }));
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(r => {
    const i = id++;
    const h = (e) => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); r(m.result); }};
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await new Promise(r => ws.onopen = r);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Runtime.evaluate', { expression: `
    const namesHtml = [
      'Công ty TNHH Phần&nbsp;Mềm&nbsp;FPT', 'Công ty Cổ Phần VNG',
      'Tổng Công ty Dịch&nbsp;Vụ&nbsp;Số&nbsp;Viettel', 'Ngân Hàng TMCP Kỹ&nbsp;Thương&nbsp;Việt&nbsp;Nam',
      'Công ty Cổ Phần Dịch Vụ Di&nbsp;Động&nbsp;Trực&nbsp;Tuyến', 'Công ty TNHH Shopee',
      'Ngân Hàng TMCP Quân&nbsp;Đội', 'Công ty Cổ Phần VinAI'
    ];
    document.querySelectorAll('#cong-ty-tieu-bieu .company-card-title').forEach((t, i) => { if (namesHtml[i]) t.innerHTML = namesHtml[i]; });
    const s = document.createElement('style');
    s.textContent = '.company-card-title { font-size: 13px !important; font-weight: 750 !important; line-height: 1.35 !important; min-height: 38px !important; display: flex !important; align-items: center !important; justify-content: center !important; text-align: center !important; } .mode-switcher-pill, .floating-switcher { display: none !important; }';
    document.head.appendChild(s);
    document.querySelector('#cong-ty-tieu-bieu').scrollIntoView({ block: 'center' });
  `});
  await new Promise(r => setTimeout(r, 600));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/perfect_mobile_centered.png', Buffer.from(shot.data, 'base64'));
  ws.close();
  chrome.kill();
}
shot().catch(console.error);
