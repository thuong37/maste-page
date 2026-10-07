const { spawn } = require('child_process');

async function checkDropdownStyles() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9338;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--user-data-dir=c:\\code\\easycv\\maste-page\\scratch\\temp-dropdown-inspect-' + Date.now(),
    'http://127.0.0.1:8000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    console.log('Tabs:', tabs.map(t => t.url));
    const page = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const onMsg = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', onMsg);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Open dropdown 'Hồ sơ & CV'
          const navLinks = Array.from(document.querySelectorAll('.nav-link'));
          const hosoLink = navLinks.find(l => l.textContent.includes('Hồ sơ & CV'));
          const navItem = hosoLink ? hosoLink.closest('.nav-item') : null;
          if (navItem) navItem.classList.add('open');

          const items = Array.from(document.querySelectorAll('.dropdown-menu .dropdown-item'));
          return items.map(item => {
            const cs = window.getComputedStyle(item);
            const content = item.querySelector('.dropdown-item-content');
            const contentCs = content ? window.getComputedStyle(content) : null;
            const title = item.querySelector('.dropdown-item-title');
            const titleCs = title ? window.getComputedStyle(title) : null;
            const icon = item.querySelector('.dropdown-item-icon');
            const iconCs = icon ? window.getComputedStyle(icon) : null;
            return {
              text: item.innerText.replace(/\\n/g, ' '),
              item: {
                display: cs.display,
                justifyContent: cs.justifyContent,
                alignItems: cs.alignItems,
                textAlign: cs.textAlign,
                direction: cs.direction
              },
              content: contentCs ? {
                display: contentCs.display,
                flex: contentCs.flex,
                marginLeft: contentCs.marginLeft,
                textAlign: contentCs.textAlign,
                alignItems: contentCs.alignItems
              } : null,
              title: titleCs ? {
                textAlign: titleCs.textAlign
              } : null
            };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Dropdown items computed styles:');
    console.log(JSON.stringify(evalRes?.result?.value?.slice(0, 5), null, 2));

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

checkDropdownStyles();
