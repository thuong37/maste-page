const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testBannerSlider() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9346;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,1080',
    'http://localhost:3000/index.html'
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

    const page = list.find(p => p.url.includes('index.html')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
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

    // 1. Kiểm tra DOM ban đầu
    const initCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const slider = document.getElementById('heroSponsorSlider');
        const slides = Array.from(slider?.querySelectorAll('.sponsor-slide') || []);
        const prevBtn = document.getElementById('sponsorSliderPrev');
        const nextBtn = document.getElementById('sponsorSliderNext');
        const dots = Array.from(slider?.querySelectorAll('.sponsor-dot') || []);

        return {
          hasSlider: !!slider,
          slidesCount: slides.length,
          activeSlideIndex: slides.findIndex(s => s.classList.contains('active')),
          hasPrevBtn: !!prevBtn,
          hasNextBtn: !!nextBtn,
          dotsCount: dots.length,
          activeDotIndex: dots.findIndex(d => d.classList.contains('active')),
          slide1Img: slides[0]?.querySelector('img')?.getAttribute('src'),
          slide2Img: slides[1]?.querySelector('img')?.getAttribute('src')
        };
      })()`,
      returnByValue: true
    });
    console.log('Initial State:', JSON.stringify(initCheck.result?.value, null, 2));

    // Chụp screenshot Slide 1
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    const imgData1 = ss1.data || ss1.result?.data;
    if (imgData1) {
      fs.writeFileSync(path.join(__dirname, 'banner_slide1.png'), Buffer.from(imgData1, 'base64'));
      console.log('Saved banner_slide1.png');
    }

    // 2. Click nút Next
    const clickNextResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.getElementById('sponsorSliderNext');
        nextBtn.click();
        const slides = Array.from(document.querySelectorAll('#heroSponsorSlider .sponsor-slide'));
        const dots = Array.from(document.querySelectorAll('#heroSponsorSlider .sponsor-dot'));
        return {
          activeSlideIndex: slides.findIndex(s => s.classList.contains('active')),
          activeDotIndex: dots.findIndex(d => d.classList.contains('active'))
        };
      })()`,
      returnByValue: true
    });
    console.log('After Click Next:', JSON.stringify(clickNextResult.result?.value, null, 2));

    // Đợi transition 500ms
    await new Promise(r => setTimeout(r, 600));

    // Chụp screenshot Slide 2
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    const imgData2 = ss2.data || ss2.result?.data;
    if (imgData2) {
      fs.writeFileSync(path.join(__dirname, 'banner_slide2.png'), Buffer.from(imgData2, 'base64'));
      console.log('Saved banner_slide2.png');
    }

    // 3. Click nút Prev
    const clickPrevResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const prevBtn = document.getElementById('sponsorSliderPrev');
        prevBtn.click();
        const slides = Array.from(document.querySelectorAll('#heroSponsorSlider .sponsor-slide'));
        const dots = Array.from(document.querySelectorAll('#heroSponsorSlider .sponsor-dot'));
        return {
          activeSlideIndex: slides.findIndex(s => s.classList.contains('active')),
          activeDotIndex: dots.findIndex(d => d.classList.contains('active'))
        };
      })()`,
      returnByValue: true
    });
    console.log('After Click Prev (Back to Slide 1):', JSON.stringify(clickPrevResult.result?.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

testBannerSlider();
