const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testCategoryEnhancements() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9378',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise(res => {
    http.get('http://127.0.0.1:9378/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });

  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Click open category modal
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("categoryFilterTrigger").click()'
  });
  await new Promise(r => setTimeout(r, 400));

  // 2. Inspect Popular keywords wrap & chip styling
  const styleCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const wrap = document.getElementById('categoryPopularWrap');
      const label = wrap.querySelector('.category-popular-label');
      const chip = wrap.querySelector('.category-popular-chip');
      const wrapStyle = getComputedStyle(wrap);
      const labelStyle = getComputedStyle(label);
      const chipStyle = getComputedStyle(chip);

      return {
        wrapBg: wrapStyle.backgroundColor,
        wrapBgImage: wrapStyle.backgroundImage,
        wrapShadow: wrapStyle.boxShadow,
        wrapBorderBottom: wrapStyle.borderBottomColor,
        labelColor: labelStyle.color,
        labelFontWeight: labelStyle.fontWeight,
        chipBg: chipStyle.backgroundColor,
        chipColor: chipStyle.color,
        chipBorder: chipStyle.borderColor,
        chipFontWeight: chipStyle.fontWeight,
        chipShadow: chipStyle.boxShadow
      };
    })()`,
    returnByValue: true
  });

  console.log('Popular Styling Result:', JSON.stringify(styleCheck.result.result.value, null, 2));

  // 3. Capture modal before group selection
  const shot1 = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch/category_modal_popular_highlight.png', shot1.result.data, 'base64');

  // 4. Click checkbox of group 'sales'
  const groupClickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const salesCheckbox = document.querySelector('.category-group-item[data-category="sales"] .cat-checkbox');
      if (!salesCheckbox) return { error: 'salesCheckbox not found' };
      salesCheckbox.click();

      // Check results
      const isSalesChecked = salesCheckbox.classList.contains('is-checked');
      const subgroupCheckboxes = Array.from(document.querySelectorAll('#categorySubgroupList .cat-checkbox'));
      const allSubsChecked = subgroupCheckboxes.every(cb => cb.classList.contains('is-checked'));
      const specialtyPills = Array.from(document.querySelectorAll('#categorySubgroupList .category-specialty-pill'));
      const allPillsSelected = specialtyPills.every(p => p.classList.contains('is-selected'));

      return {
        isSalesChecked,
        totalSubgroups: subgroupCheckboxes.length,
        checkedSubgroups: subgroupCheckboxes.filter(cb => cb.classList.contains('is-checked')).length,
        allSubsChecked,
        totalRoles: specialtyPills.length,
        selectedRoles: specialtyPills.filter(p => p.classList.contains('is-selected')).length,
        allPillsSelected
      };
    })()`,
    returnByValue: true
  });

  console.log('Group Click Result:', JSON.stringify(groupClickRes.result.result.value, null, 2));

  await new Promise(r => setTimeout(r, 300));
  const shot2 = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch/category_modal_group_selected.png', shot2.result.data, 'base64');

  // 5. Click apply button
  const applyRes = await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('btnCategorySubmit').click();
      const label = document.getElementById('categoryFilterLabel').textContent;
      const modalHidden = document.getElementById('categoryModalOverlay').hidden;
      return { label, modalHidden };
    })()`,
    returnByValue: true
  });

  console.log('Apply Result:', JSON.stringify(applyRes.result.result.value, null, 2));

  await send('Browser.close');
  try { chrome.kill(); } catch (e) {}
}

testCategoryEnhancements();
