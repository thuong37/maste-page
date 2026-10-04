const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testPositions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9349;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(res => {
    http.get('http://127.0.0.1:' + port + '/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  function send(m, p={}) {
    return new Promise(res => {
      const mid = id++;
      const h = e => { const msg = JSON.parse(e.data); if (msg.id === mid) { ws.removeEventListener('message', h); res(msg); }};
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
  }

  // Chuyển sang slide 2
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("sponsorSliderNext").click()'
  });

  // Test 1: innovation.png với 18% 65%
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("#heroSponsorSlider .sponsor-slide img")[1].style.objectPosition = "18% 65%"'
  });
  await new Promise(r => setTimeout(r, 500));
  let ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_pos_18_65.png', Buffer.from(ss.data || ss.result.data, 'base64'));

  // Test 2: innovation.png với 20% 68%
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("#heroSponsorSlider .sponsor-slide img")[1].style.objectPosition = "20% 68%"'
  });
  await new Promise(r => setTimeout(r, 500));
  ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_pos_20_68.png', Buffer.from(ss.data || ss.result.data, 'base64'));

  // Test 3: team.png với center 72%
  await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.querySelectorAll("#heroSponsorSlider .sponsor-slide img")[1];
      img.src = "assets/banners/employer-spotlight-team.png";
      img.style.objectPosition = "center 72%";
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_team_img.png', Buffer.from(ss.data || ss.result.data, 'base64'));

  console.log('Saved all test screenshots!');
  chrome.kill();
}
testPositions();
