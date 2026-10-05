const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9235;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('--- TEST 1: Check all 25 cards on Page 1 ---');
    const check1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.job-card');
        const results = [];
        cards.forEach((card, idx) => {
          const id = card.getAttribute('data-id');
          const badgesGroup = card.querySelector('.job-badges-group');
          const bookmarkInBadges = badgesGroup ? badgesGroup.querySelector('.btn-card-bookmark') : null;
          const bottomActions = card.querySelector('.job-card-bottom .job-card-actions');
          const bookmarkInBottom = bottomActions ? bottomActions.querySelector('.btn-card-bookmark') : null;
          const heartSvg = bookmarkInBadges ? bookmarkInBadges.querySelector('svg path[d*="M19 14c1.49-1.46"]') : null;

          results.push({
            id,
            bookmarkInBadges: !!bookmarkInBadges,
            noBookmarkInBottom: !bookmarkInBottom,
            hasHeartSvg: !!heartSvg
          });
        });
        return {
          totalCards: cards.length,
          allInBadges: results.every(r => r.bookmarkInBadges),
          noneInBottom: results.every(r => r.noBookmarkInBottom),
          allHeartSvg: results.every(r => r.hasHeartSvg)
        };
      })()`,
      returnByValue: true
    });
    console.log('Test 1 Results:', check1.result.value);

    console.log('\n--- TEST 2: Click Heart Button on Card 15 (Masan Consumer) ---');
    const clickSave = await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        const heartBtn = card15.querySelector('.btn-card-bookmark');
        heartBtn.click();
        const isSaved = heartBtn.classList.contains('saved');
        const fill = heartBtn.querySelector('svg').getAttribute('fill');
        const stored = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
        const toast = document.getElementById('toastMsg')?.textContent || '';
        return { isSaved, fill, inLocalStorage: stored.includes(15), toast };
      })()`,
      returnByValue: true
    });
    console.log('Test 2 Results (After click save):', clickSave.result.value);

    console.log('\n--- TEST 3: Click Heart Button again to un-save ---');
    const clickUnsave = await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        const heartBtn = card15.querySelector('.btn-card-bookmark');
        heartBtn.click();
        const isSaved = heartBtn.classList.contains('saved');
        const fill = heartBtn.querySelector('svg').getAttribute('fill');
        const stored = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
        const toast = document.getElementById('toastMsg')?.textContent || '';
        return { isSaved, fill, inLocalStorage: stored.includes(15), toast };
      })()`,
      returnByValue: true
    });
    console.log('Test 3 Results (After click unsave):', clickUnsave.result.value);

    // Save card 15 for screenshot visual check
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card15 = document.querySelector('.job-card[data-id="15"]');
        card15.querySelector('.btn-card-bookmark').click();
        card15.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture desktop screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_desktop_verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/final_desktop_verified.png');

    console.log('\n--- TEST 4: Pagination dynamic render check (Page 2) ---');
    const checkPage2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const page2Btn = document.querySelector('.page-btn[data-page="2"]');
        if (page2Btn) page2Btn.click();
        const cards = document.querySelectorAll('.job-card');
        const allInBadges = Array.from(cards).every(c => c.querySelector('.job-badges-group .btn-card-bookmark'));
        const allHeart = Array.from(cards).every(c => c.querySelector('.job-badges-group .btn-card-bookmark svg path[d*="M19 14c1.49-1.46"]'));
        return { page2CardsCount: cards.length, allInBadges, allHeart };
      })()`,
      returnByValue: true
    });
    console.log('Test 4 Results (Page 2 Dynamic):', checkPage2.result.value);

    // Return to page 1
    await send('Runtime.evaluate', {
      expression: `(() => {
        const page1Btn = document.querySelector('.page-btn[data-page="1"]');
        if (page1Btn) page1Btn.click();
      })()`
    });

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
