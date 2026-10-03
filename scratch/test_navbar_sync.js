const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testNavbarSync() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9225;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const target = list.find(p => p.type === 'page');
  console.log('Selected target page:', target.title, target.url);
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
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
  console.log('Connected to Chrome CDP on port', port);

  async function waitForNavbar() {
    for (let i = 0; i < 30; i++) {
      const check = await send('Runtime.evaluate', {
        expression: `!!document.querySelector('.navbar')`
      });
      const val = (check.result && check.result.value) || check.value;
      if (val) return true;
      await new Promise(r => setTimeout(r, 200));
    }
    return false;
  }

  const pages = [
    { url: 'http://localhost:3000/index.html', name: 'Homepage (index.html)', screen: 'scratch/navbar_index.png', expectCurrent: false },
    { url: 'http://localhost:3000/viec-lam.html', name: 'Job List (viec-lam.html)', screen: 'scratch/navbar_vieclam.png', expectCurrent: true },
    { url: 'http://localhost:3000/chi-tiet-viec-lam.html', name: 'Job Detail (chi-tiet-viec-lam.html)', screen: 'scratch/navbar_chitiet.png', expectCurrent: true }
  ];

  for (const p of pages) {
    console.log(`\n=================== TESTING ${p.name} ===================`);
    await send('Page.navigate', { url: p.url });
    await waitForNavbar();
    await new Promise(r => setTimeout(r, 500));

    // Minimize floating switcher for clean test
    await send('Runtime.evaluate', {
      expression: `
        (function() {
          const minBtn = document.getElementById('floatingMinBtn');
          if (minBtn) minBtn.click();
        })()
      `
    });

    const evalResult = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (function() {
          const header = document.querySelector('.site-header');
          const navbar = document.querySelector('.navbar');
          const brand = document.querySelector('.navbar-brand');
          const logoLight = document.querySelector('.brand-logo-img.logo-light');
          const navItems = document.querySelectorAll('.navbar-nav .nav-item');
          const timViecLink = document.getElementById('navLinkTimViec');
          const notifBtn = document.getElementById('notif-btn');
          const notifPanel = document.getElementById('notif-panel');
          const messageBtn = document.getElementById('message-btn');
          const messagePanel = document.getElementById('message-panel');
          const userProfileBtn = document.getElementById('user-profile-btn');
          const accountLoggedView = document.getElementById('account-logged-view');
          const userDropdownMenu = document.querySelector('.user-dropdown-menu');
          const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
          const mobileDrawer = document.getElementById('mobile-drawer-overlay');

          const navInfo = Array.from(navItems).map(item => {
            const link = item.querySelector('.nav-link');
            const drop = item.querySelector('.dropdown-menu');
            const dropItems = drop ? drop.querySelectorAll('.dropdown-item').length : 0;
            return {
              text: link ? link.innerText.trim() : '',
              isCurrent: link ? link.classList.contains('is-current') : false,
              dropdownCount: dropItems
            };
          });

          return {
            headerHeight: header ? header.offsetHeight : 0,
            hasNavbar: !!navbar,
            hasBrand: !!brand,
            brandHref: brand ? brand.getAttribute('href') : '',
            logoLightSrc: logoLight ? logoLight.getAttribute('src') : '',
            navCount: navItems.length,
            navInfo,
            hasNotifBtn: !!notifBtn,
            hasNotifPanel: !!notifPanel,
            hasMessageBtn: !!messageBtn,
            hasMessagePanel: !!messagePanel,
            hasUserProfileBtn: !!userProfileBtn,
            hasAccountLoggedView: !!accountLoggedView,
            hasUserDropdownMenu: !!userDropdownMenu,
            hasMobileToggleBtn: !!mobileToggleBtn,
            hasMobileDrawer: !!mobileDrawer
          };
        })()
      `
    });

    const res = (evalResult.result && evalResult.result.value) || evalResult.value || evalResult;
    console.log('Header height:', res.headerHeight, 'px');
    console.log('Brand href:', res.brandHref, 'Logo light src:', res.logoLightSrc);
    console.log('Nav items count:', res.navCount);
    res.navInfo.forEach((n, idx) => {
      console.log(`  Col ${idx + 1}: "${n.text}" -> isCurrent: ${n.isCurrent}, dropdownItems: ${n.dropdownCount}`);
    });
    console.log('Notifications (btn & panel):', res.hasNotifBtn, res.hasNotifPanel);
    console.log('Messages (btn & panel):', res.hasMessageBtn, res.hasMessagePanel);
    console.log('User Account (btn, view & menu):', res.hasUserProfileBtn, res.hasAccountLoggedView, res.hasUserDropdownMenu);
    console.log('Mobile Drawer (btn & overlay):', res.hasMobileToggleBtn, res.hasMobileDrawer);

    // Test clicking user profile button
    const clickProfile = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (function() {
          const btn = document.getElementById('user-profile-btn');
          const view = document.getElementById('account-logged-view');
          btn.click();
          return { isOpen: view.classList.contains('open') };
        })()
      `
    });
    const profileVal = (clickProfile.result && clickProfile.result.value) || clickProfile.value || clickProfile;
    console.log('User profile click opens menu:', profileVal.isOpen);

    // Test clicking notification button
    const clickNotif = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (function() {
          const btn = document.getElementById('notif-btn');
          const panel = document.getElementById('notif-panel');
          btn.click();
          return { isOpen: panel.classList.contains('open') };
        })()
      `
    });
    const notifVal = (clickNotif.result && clickNotif.result.value) || clickNotif.value || clickNotif;
    console.log('Notif click opens panel:', notifVal.isOpen);

    // Close popovers
    await send('Runtime.evaluate', {
      expression: `document.body.click();`
    });
    await new Promise(r => setTimeout(r, 200));

    // Capture screenshot of the top header area
    const shot = await send('Page.captureScreenshot', {
      clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
    });
    fs.writeFileSync(p.screen, Buffer.from(shot.data, 'base64'));
    console.log('Captured screenshot:', p.screen);
  }

  // Test Mobile view on viec-lam.html
  console.log('\n=================== TESTING MOBILE VIEW DRAWER ===================');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:3000/viec-lam.html' });
  await new Promise(r => setTimeout(r, 1200));

  const mobileCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (function() {
        const toggleBtn = document.getElementById('mobile-toggle-btn');
        const drawer = document.getElementById('mobile-drawer-overlay');
        const isBtnVisible = toggleBtn && window.getComputedStyle(toggleBtn).display !== 'none';
        if (toggleBtn) toggleBtn.click();
        const isDrawerOpen = drawer && drawer.classList.contains('open');
        return { isBtnVisible, isDrawerOpen };
      })()
    `
  });
  const mVal = (mobileCheck.result && mobileCheck.result.value) || mobileCheck.value || mobileCheck;
  console.log('Mobile Hamburger visible:', mVal.isBtnVisible, 'Drawer opens on click:', mVal.isDrawerOpen);

  const mobileShot = await send('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 390, height: 700, scale: 1 }
  });
  fs.writeFileSync('scratch/navbar_mobile_drawer.png', Buffer.from(mobileShot.data, 'base64'));
  console.log('Captured mobile drawer screenshot: scratch/navbar_mobile_drawer.png');

  ws.close();
  chrome.kill();
  console.log('\nALL NAVBAR SYNC TESTS COMPLETED SUCCESSFULLY!');
}

testNavbarSync().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
