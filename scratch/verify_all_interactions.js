const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  console.log('=== STARTING EXTENSIVE VERIFICATION ===');

  // 1. Mobile Screenshot (390 x 844)
  const mobileShot = path.resolve(__dirname, 'vieclam_mobile_hover_check.png');
  execSync(`"${browserPath}" --headless=new --disable-gpu --window-size=390,844 --screenshot="${mobileShot}" "http://localhost:3000/viec-lam.html"`);
  console.log('✓ Captured mobile screenshot:', mobileShot);

  // 2. Interactive CDP checks
  const port = 9227;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));

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

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    // Check 1: Ensure NO percentage match text exists in job cards
    const matchBadgesCheck = await evaluate(`
      (() => {
        const badges = Array.from(document.querySelectorAll('.badge-ai-match'));
        const visibleBadges = badges.filter(b => window.getComputedStyle(b).display !== 'none');
        const cardTexts = Array.from(document.querySelectorAll('.job-card')).map(c => c.innerText);
        const hasPercentMatchInCards = cardTexts.some(t => /\\d+%\\s*Match/i.test(t));
        return {
          totalBadgesInDom: badges.length,
          visibleBadges: visibleBadges.length,
          hasPercentMatchInCards
        };
      })()
    `);
    console.log('Check 1 (AI Match % Removal):', matchBadgesCheck);

    // Check 2: Check Apply Button Style & Hover Visibility
    const applyBtnStyles = await evaluate(`
      (() => {
        const firstCard = document.querySelector('.job-card');
        const applyBtn = firstCard.querySelector('.btn-card-apply');
        const styleBefore = window.getComputedStyle(applyBtn);
        return {
          opacityBefore: styleBefore.opacity,
          visibilityBefore: styleBefore.visibility,
          bgBefore: styleBefore.backgroundImage || styleBefore.backgroundColor,
          color: styleBefore.color
        };
      })()
    `);
    console.log('Check 2 (Apply Button Default State):', applyBtnStyles);

    // Check 3: Click Apply Button and verify Toast
    const applyResult = await evaluate(`
      (() => {
        const applyBtn = document.querySelector('.btn-card-apply');
        applyBtn.click();
        const toast = document.getElementById('toastMsg');
        return {
          toastText: toast ? toast.textContent : null,
          toastVisible: toast ? toast.classList.contains('show') : false
        };
      })()
    `);
    console.log('Check 3 (Apply Button Click Action):', applyResult);

    // Check 4: Click Bookmark Button and verify Toggle
    const bookmarkResult = await evaluate(`
      (() => {
        const bookmarkBtn = document.querySelector('.btn-card-bookmark');
        const savedBefore = bookmarkBtn.classList.contains('saved');
        bookmarkBtn.click();
        const savedAfter = bookmarkBtn.classList.contains('saved');
        const toast = document.getElementById('toastMsg');
        return {
          savedBefore,
          savedAfter,
          toastText: toast ? toast.textContent : null
        };
      })()
    `);
    console.log('Check 4 (Bookmark Button Toggle Action):', bookmarkResult);

    // Check 5: Open Quick View Modal and verify NO % match
    const modalCheck = await evaluate(`
      (() => {
        // Open modal for first job
        if (typeof openJobModal === 'function') {
          openJobModal(1);
        } else {
          const card = document.querySelector('.job-card');
          card.click();
        }
        const modal = document.getElementById('jobModalBackdrop');
        const modalText = modal ? modal.innerText : '';
        const hasMatch = /\\d+%\\s*Match/i.test(modalText);
        return {
          modalVisible: modal ? modal.classList.contains('active') : false,
          hasMatchInModal: hasMatch
        };
      })()
    `);
    console.log('Check 5 (Quick View Modal % Match Removal):', modalCheck);

    ws.close();
  } catch (err) {
    console.error('Error during interaction verification:', err);
  } finally {
    proc.kill();
  }
}

run();
