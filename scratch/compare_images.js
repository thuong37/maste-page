const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testScale() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9350;
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
  function send(m, p = {}) {
    return new Promise(res => {
      const mid = id++;
      const h = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === mid) {
          ws.removeEventListener('message', h);
          res(msg);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
  }

  // Chuyển sang slide 2
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("sponsorSliderNext").click()'
  });

  // Test Option A: employer-spotlight-team.png (4 người quây quần trung tâm bàn làm việc)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.querySelectorAll("#heroSponsorSlider .sponsor-slide img")[1];
      img.src = "assets/banners/employer-spotlight-team.png";
      img.style.objectPosition = "center 75%";
      img.style.transform = "none";
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  let ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_team_perfect.png', Buffer.from(ss.data || ss.result.data, 'base64'));

  // Test Option B: innovation.png với transform scale 1.25 focus vào cụm 3 người
  await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.querySelectorAll("#heroSponsorSlider .sponsor-slide img")[1];
      img.src = "assets/banners/employer-spotlight-innovation.png";
      img.style.objectPosition = "0% 70%";
      img.style.transform = "scale(1.22)";
      img.style.transformOrigin = "18% 65%";
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_innovation_zoom.png', Buffer.from(ss.data || ss.result.data, 'base64'));

  console.log('Saved both test options!');
  chrome.kill();
}
testScale();
