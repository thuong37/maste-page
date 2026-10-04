const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9362',
    '--disable-gpu',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const list = await new Promise(res => {
    http.get('http://127.0.0.1:9362/json/list', r => {
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

  const imgBase64 = fs.readFileSync('C:/Users/84375/.gemini/antigravity-ide/brain/ac20fa97-f33c-413d-bf7d-42d16ff810cf/.user_uploaded/media_1791129684962.png').toString('base64');

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Find exact logo bounding box
          // Background of the overall card is ~#fff or #f8fafc.
          // Let's analyze pixel columns from x=0 to 100
          // Sample mint background at x=20, y=20
          // Let's find top-left, right, bottom of this mint box:
          // Check horizontal line y=30 across x=0 to 100:
          let leftX = -1, rightX = -1;
          for (let x = 0; x < 100; x++) {
            const d = ctx.getImageData(x, 30, 1, 1).data;
            const isMintOrSvg = (d[0] < 250 || d[1] < 250 || d[2] < 250);
            if (isMintOrSvg && leftX === -1) leftX = x;
            if (!isMintOrSvg && leftX !== -1 && rightX === -1) rightX = x - 1;
          }

          // Check vertical line x=30 across y=0 to 83:
          let topY = -1, bottomY = -1;
          for (let y = 0; y < img.height; y++) {
            const d = ctx.getImageData(30, y, 1, 1).data;
            const isMintOrSvg = (d[0] < 250 || d[1] < 250 || d[2] < 250);
            if (isMintOrSvg && topY === -1) topY = y;
            if (!isMintOrSvg && topY !== -1 && bottomY === -1) bottomY = y - 1;
          }

          const cropWidth = rightX - leftX + 1;
          const cropHeight = bottomY - topY + 1;
          
          const cropC = document.createElement('canvas');
          cropC.width = 64;
          cropC.height = 64;
          const cropCtx = cropC.getContext('2d');
          cropCtx.drawImage(img, leftX, topY, cropWidth, cropHeight, 0, 0, 64, 64);

          resolve({
            imgWidth: img.width,
            imgHeight: img.height,
            box: { leftX, topY, rightX, bottomY, cropWidth, cropHeight },
            dataUrl64: cropC.toDataURL('image/png')
          });
        };
        img.src = 'data:image/png;base64,${imgBase64}';
      });
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  const val = evalRes.result.result.value;
  console.log('Analysis:', JSON.stringify(val?.box));
  
  if (val) {
    const base64Data64 = val.dataUrl64.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync('scratch/cropped_logo_64.png', base64Data64, 'base64');
    fs.writeFileSync('assets/logos/company-mua-he-64.png', base64Data64, 'base64');
    fs.writeFileSync('public/assets/logos/company-mua-he-64.png', base64Data64, 'base64');
    console.log('Saved 64x64 logo to assets/logos/company-mua-he-64.png and public/assets/logos/company-mua-he-64.png');
  } else {
    console.error('No value returned:', evalRes);
  }

  chrome.kill();
}
run();
