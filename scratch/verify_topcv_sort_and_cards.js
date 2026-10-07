const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9249;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://127.0.0.1:8000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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
    await new Promise(r => setTimeout(r, 1500));

    // 1. Kiểm tra cấu trúc TopCV sort ban đầu
    const initCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const sortGroup = document.querySelector('.top-filter-sort-group');
        const trigger = document.getElementById('sortTriggerBtn');
        const label = document.getElementById('sortCurrentLabel')?.textContent.trim();
        const cvDesc = document.querySelector('.cv-coach-desc')?.textContent.trim();
        const atsBadge = document.querySelector('.cv-coach-badge')?.textContent.trim();
        const firstCardLogo = document.querySelector('.job-company-logo');
        const logoWidth = firstCardLogo ? getComputedStyle(firstCardLogo).width : null;
        return {
          hasSortGroup: !!sortGroup,
          triggerLabel: label,
          cvDescHas3x: cvDesc ? cvDesc.includes('3x') : false,
          cvDescText: cvDesc,
          atsBadgeText: atsBadge,
          logoWidth
        };
      })()`,
      returnByValue: true
    });

    console.log('--- TEST 1: Initial Elements Check ---');
    console.log(JSON.stringify(initCheck.result.value, null, 2));

    // 2. Click mở Sort Dropdown
    await send('Runtime.evaluate', {
      expression: `document.getElementById('sortTriggerBtn').click();`
    });
    await new Promise(r => setTimeout(r, 400));

    // Chụp ảnh Dropdown mở (so khớp ảnh TopCV mẫu của user)
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.top-filter-sort-group').scrollIntoView({ block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 400));
    const sortShot = await send('Page.captureScreenshot', { format: 'png' });
    const sortShotPath = path.join(__dirname, 'verify_topcv_sort_dropdown.png');
    fs.writeFileSync(sortShotPath, Buffer.from(sortShot.data, 'base64'));
    console.log('Saved screenshot to:', sortShotPath);

    // 3. Click chọn "Lương cao đến thấp"
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.sort-menu-item[data-val="salary_high"]').click();`
    });
    await new Promise(r => setTimeout(r, 800));

    const afterSortCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const label = document.getElementById('sortCurrentLabel')?.textContent.trim();
        const firstJobSalary = document.querySelector('.job-salary-text')?.textContent.trim();
        const firstJobTitle = document.querySelector('.job-title')?.textContent.trim();
        const postTime = document.querySelector('.job-post-time')?.textContent.trim();
        return {
          newSortLabel: label,
          firstJobSalary,
          firstJobTitle,
          postTime
        };
      })()`,
      returnByValue: true
    });
    console.log('--- TEST 2: After Choosing Salary High ---');
    console.log(JSON.stringify(afterSortCheck.result.value, null, 2));

    // 4. Test hover thẻ job đầu tiên và chụp ảnh toàn bộ cụm danh sách + sidebar
    await send('Runtime.evaluate', {
      expression: `(() => {
        const firstCard = document.querySelector('.job-card');
        if (firstCard) {
          firstCard.classList.add('is-hovered');
          firstCard.scrollIntoView({ block: 'center' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const hoverCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.job-card.is-hovered');
        const postTimeDisplay = card ? getComputedStyle(card.querySelector('.job-post-time')).display : null;
        const applyBtnDisplay = card ? getComputedStyle(card.querySelector('.job-actions-hovered')).display : null;
        return {
          postTimeDisplay,
          applyBtnDisplay
        };
      })()`,
      returnByValue: true
    });
    console.log('--- TEST 3: Job Card Hover Check ---');
    console.log(JSON.stringify(hoverCheck.result.value, null, 2));

    const fullShot = await send('Page.captureScreenshot', { format: 'png' });
    const fullShotPath = path.join(__dirname, 'verify_full_job_list_and_sidebar.png');
    fs.writeFileSync(fullShotPath, Buffer.from(fullShot.data, 'base64'));
    console.log('Saved full screenshot to:', fullShotPath);

    // 5. Test tính năng Category Modal Restore từ LocalStorage
    await send('Runtime.evaluate', {
      expression: `(() => {
        localStorage.setItem('easycv_category_selection', JSON.stringify({
          groups: ['sales'],
          subgroups: ['Sales Xuất nhập khẩu/Logistics'],
          roles: ['Sales Logistics']
        }));
        if (window.EasyCVCategoryModal) {
          window.EasyCVCategoryModal.restoreSavedSelection();
          window.EasyCVCategoryModal.open();
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const modalCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const triggerLabel = document.getElementById('categoryFilterLabel')?.textContent.trim();
        const checkedBoxCount = document.querySelectorAll('.cat-checkbox.is-checked').length;
        const activeCatKey = window.EasyCVCategoryModal?.activeCategoryKey;
        const isOpen = window.EasyCVCategoryModal?.isOpen;
        return {
          triggerLabel,
          checkedBoxCount,
          activeCatKey,
          isOpen
        };
      })()`,
      returnByValue: true
    });
    console.log('--- TEST 4: Category Modal Restored Selection ---');
    console.log(JSON.stringify(modalCheck.result.value, null, 2));

    const modalShot = await send('Page.captureScreenshot', { format: 'png' });
    const modalShotPath = path.join(__dirname, 'verify_category_modal_restored.png');
    fs.writeFileSync(modalShotPath, Buffer.from(modalShot.data, 'base64'));
    console.log('Saved modal restored screenshot to:', modalShotPath);

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    proc.kill();
  }
}

run();
