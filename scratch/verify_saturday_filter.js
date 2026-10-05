const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9272;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1050',
    'http://localhost:3000/viec-lam.html?t=' + Date.now()
  ]);

  await new Promise(r => setTimeout(r, 2200));

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

    // 1. Verify leading icons removed & chevrons present
    const pillCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const pills = Array.from(document.querySelectorAll('.top-filter-pills-group .filter-pill-btn'));
        return pills.map(btn => {
          const svgs = Array.from(btn.querySelectorAll('svg'));
          const label = btn.querySelector('.pill-label')?.textContent.trim();
          return {
            id: btn.id,
            label,
            totalSvgs: svgs.length,
            hasChevron: svgs.some(s => s.classList.contains('pill-chevron')),
            svgClasses: svgs.map(s => s.className.baseVal || '')
          };
        });
      })()`,
      returnByValue: true
    });
    console.log('--- Filter Pills Check ---');
    console.log(JSON.stringify(pillCheck.result.value, null, 2));

    // 2. Check Saturday Dropdown Items & Counts
    const satMenuCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const menu = document.getElementById('saturdayDropdownMenu');
        if (!menu) return { error: 'saturdayDropdownMenu not found' };
        const items = Array.from(menu.querySelectorAll('.dropdown-item'));
        return items.map(it => ({
          label: it.querySelector('span')?.textContent.trim(),
          value: it.getAttribute('data-value'),
          type: it.getAttribute('data-type'),
          count: it.querySelector('.item-count')?.textContent.trim() || null,
          isSelected: it.classList.contains('is-selected')
        }));
      })()`,
      returnByValue: true
    });
    console.log('--- Saturday Dropdown Items ---');
    console.log(JSON.stringify(satMenuCheck.result.value, null, 2));

    // 3. Open Saturday Dropdown and Screenshot
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('saturdayFilterBtn');
        btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const clipRect = await send('Runtime.evaluate', {
      expression: `(() => {
        const wrap = document.getElementById('topFilterBar');
        const r = wrap.getBoundingClientRect();
        return { x: Math.max(0, r.x), y: Math.max(0, r.y - 20), width: r.width, height: 420, scale: 1 };
      })()`,
      returnByValue: true
    });

    const shot1 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clipRect.result.value
    });
    fs.writeFileSync('scratch/filter_saturday_dropdown_open.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/filter_saturday_dropdown_open.png');

    // 4. Select "Nghỉ thứ 7"
    const selectOffSat = await send('Runtime.evaluate', {
      expression: `(() => {
        const item = document.querySelector('.dropdown-item[data-type="saturday"][data-value="off_sat"]');
        if (item) {
          item.click();
          return { success: true };
        }
        return { success: false };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify state after selecting "Nghỉ thứ 7"
    const stateCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('saturdayFilterBtn');
        const label = document.getElementById('saturdayFilterLabel')?.textContent.trim();
        const isActive = btn.classList.contains('is-active');
        const chips = Array.from(document.querySelectorAll('.filter-chip')).map(c => c.textContent.trim());
        const cards = Array.from(document.querySelectorAll('.job-card')).map(card => {
          const id = card.getAttribute('data-id');
          const title = card.querySelector('.job-title-link')?.textContent.trim();
          const matchBadge = card.querySelector('.badge-search-match')?.textContent.trim();
          return { id, title, matchBadge };
        });
        const currentUrl = window.location.href;
        return { label, isActive, chips, currentUrl, totalCards: cards.length, topCards: cards.slice(0, 5) };
      })()`,
      returnByValue: true
    });
    console.log('--- State After Selecting "Nghỉ thứ 7" ---');
    console.log(JSON.stringify(stateCheck.result.value, null, 2));

    const shot2 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clipRect.result.value
    });
    fs.writeFileSync('scratch/filter_saturday_active.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/filter_saturday_active.png');

    // 5. Select "Làm thứ 7"
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('saturdayFilterBtn').click();
        const item = document.querySelector('.dropdown-item[data-type="saturday"][data-value="work_sat"]');
        if (item) item.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const stateWorkSat = await send('Runtime.evaluate', {
      expression: `(() => {
        const label = document.getElementById('saturdayFilterLabel')?.textContent.trim();
        const chips = Array.from(document.querySelectorAll('.filter-chip')).map(c => c.textContent.trim());
        const currentUrl = window.location.href;
        return { label, chips, currentUrl };
      })()`,
      returnByValue: true
    });
    console.log('--- State After Selecting "Làm thứ 7" ---', stateWorkSat.result.value);

    // 6. Reset filters via "Xóa lọc" button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const clearBtn = document.getElementById('btnClearTopFilters');
        if (clearBtn) clearBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const stateReset = await send('Runtime.evaluate', {
      expression: `(() => {
        const label = document.getElementById('saturdayFilterLabel')?.textContent.trim();
        const isActive = document.getElementById('saturdayFilterBtn').classList.contains('is-active');
        const chips = Array.from(document.querySelectorAll('.filter-chip')).map(c => c.textContent.trim());
        return { label, isActive, chips };
      })()`,
      returnByValue: true
    });
    console.log('--- State After Reset ---', stateReset.result.value);

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    proc.kill();
  }
}

run();
