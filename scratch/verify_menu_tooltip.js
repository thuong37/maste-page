const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const remoteDebuggingPort = 9222;

async function runTest() {
  console.log('--- STARTING MENU TOOLTIP VERIFICATION ---');

  // Spawn Chrome in headless mode with remote debugging port
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${remoteDebuggingPort}`,
    '--window-size=1440,900',
    '--no-sandbox',
    '--disable-extensions'
  ]);

  // Wait for Chrome to be ready
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    // 1. Get browser targets
    const versionRes = await fetchJson(`http://127.0.0.1:${remoteDebuggingPort}/json/version`);
    console.log('Connected to Chrome:', versionRes.Browser);

    const pages = await fetchJson(`http://127.0.0.1:${remoteDebuggingPort}/json/list`);
    const pageTarget = pages.find(p => p.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log('Connecting to WebSocket target...');

    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('DOM.enable');
    await sendCommand('Runtime.enable');

    // Navigate to local index.html
    console.log('Navigating to http://localhost:3000/index.html...');
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify AI Match badge removal
    const aiMatchCheck = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const badges = Array.from(document.querySelectorAll('.navbar .badge-pill'));
        const aiMatchBadge = badges.find(b => b.textContent.includes('AI Match') || b.textContent.includes('AI MATCH'));
        return {
          totalBadges: badges.length,
          badgesText: badges.map(b => b.textContent.trim()),
          hasAiMatch: !!aiMatchBadge
        };
      })()`,
      returnByValue: true
    });
    console.log('AI Match Badge check in navbar:', aiMatchCheck.result.value);

    // Open dropdown menu "Tìm việc"
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const navItem = document.querySelector('.navbar-nav .nav-item');
        if (navItem) {
          navItem.classList.add('open');
        }
      })()`
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Hover over the second item: "Việc làm gợi ý"
    const hoverCheck = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const items = document.querySelectorAll('.dropdown-menu .dropdown-item');
        if (items.length > 1) {
          // Dispatch mouseenter on the second item ("Việc làm gợi ý")
          const target = items[1];
          target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          
          const bubble = target.querySelector('.dropdown-tooltip-bubble');
          const title = bubble ? bubble.querySelector('.tooltip-title')?.textContent : null;
          const desc = bubble ? bubble.querySelector('.tooltip-desc')?.textContent : null;
          const rect = bubble ? bubble.getBoundingClientRect() : null;

          return {
            targetTitle: target.querySelector('.dropdown-item-title')?.textContent.trim(),
            tooltipTitle: title,
            tooltipDesc: desc,
            tooltipRect: rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null
          };
        }
        return null;
      })()`,
      returnByValue: true
    });
    console.log('Hover on second item ("Việc làm gợi ý"):', hoverCheck.result.value);

    // Let's capture a screenshot of the open menu with tooltip
    // We can simulate CSS hover or force styles on the second item to capture exact rendering
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const items = document.querySelectorAll('.dropdown-menu .dropdown-item');
        if (items[1]) {
          const item = items[1];
          item.style.background = 'var(--easycv-orange-50)';
          item.style.color = 'var(--easycv-orange-hover)';
          item.style.transform = 'translateX(3px)';
          const icon = item.querySelector('.dropdown-item-icon');
          if (icon) {
            icon.style.background = 'var(--easycv-orange)';
            icon.style.color = '#FFFFFF';
          }
          const bubble = item.querySelector('.dropdown-tooltip-bubble');
          if (bubble) {
            bubble.style.opacity = '1';
            bubble.style.visibility = 'visible';
            bubble.style.transform = 'translateY(-50%) translateX(0)';
          }
        }
      })()`
    });

    await new Promise(resolve => setTimeout(resolve, 400));

    // Capture screenshot of the navbar area
    const clipScreenshot = await sendCommand('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 1000,
        height: 480,
        scale: 1
      }
    });

    const screenshotPath = path.resolve(__dirname, 'menu_tooltip_verified.png');
    fs.writeFileSync(screenshotPath, Buffer.from(clipScreenshot.data, 'base64'));
    console.log('Saved screenshot of dropdown menu and tooltip to:', screenshotPath);

    // Test third item ("Việc làm đã lưu") as well
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const items = document.querySelectorAll('.dropdown-menu .dropdown-item');
        // Reset item 1
        items[1].style.background = '';
        items[1].style.color = '';
        items[1].style.transform = '';
        items[1].querySelector('.dropdown-item-icon').style.background = '';
        items[1].querySelector('.dropdown-item-icon').style.color = '';
        items[1].querySelector('.dropdown-tooltip-bubble').style.opacity = '0';
        items[1].querySelector('.dropdown-tooltip-bubble').style.visibility = 'hidden';

        // Activate item 0 ("Tìm kiếm việc làm")
        const item0 = items[0];
        item0.style.background = 'var(--easycv-orange-50)';
        item0.style.color = 'var(--easycv-orange-hover)';
        item0.style.transform = 'translateX(3px)';
        item0.querySelector('.dropdown-item-icon').style.background = 'var(--easycv-orange)';
        item0.querySelector('.dropdown-item-icon').style.color = '#FFFFFF';
        const bubble0 = item0.querySelector('.dropdown-tooltip-bubble');
        bubble0.style.opacity = '1';
        bubble0.style.visibility = 'visible';
        bubble0.style.transform = 'translateY(-50%) translateX(0)';
      })()`
    });

    await new Promise(resolve => setTimeout(resolve, 400));

    const clipScreenshot0 = await sendCommand('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 1000,
        height: 480,
        scale: 1
      }
    });

    const screenshotPath0 = path.resolve(__dirname, 'menu_tooltip_item0.png');
    fs.writeFileSync(screenshotPath0, Buffer.from(clipScreenshot0.data, 'base64'));
    console.log('Saved screenshot of first item tooltip to:', screenshotPath0);

    // Also verify viec-lam.html
    console.log('Navigating to http://localhost:3000/viec-lam.html...');
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/viec-lam.html' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiMatchCheckViecLam = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const badges = Array.from(document.querySelectorAll('.navbar .badge-pill'));
        const aiMatchBadge = badges.find(b => b.textContent.includes('AI Match') || b.textContent.includes('AI MATCH'));
        const tooltips = document.querySelectorAll('.dropdown-tooltip-bubble');
        return {
          totalBadges: badges.length,
          badgesText: badges.map(b => b.textContent.trim()),
          hasAiMatch: !!aiMatchBadge,
          totalTooltips: tooltips.length
        };
      })()`,
      returnByValue: true
    });
    console.log('viec-lam.html checks:', aiMatchCheckViecLam.result.value);

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    chromeProcess.kill();
    console.log('--- TEST FINISHED ---');
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

runTest();
