const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9335;
const pages = ['index.html', 'viec-lam.html', 'chi-tiet-viec-lam.html'];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect() {
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    '--disable-gpu',
    '--window-size=1440,900',
    `--user-data-dir=C:\\code\\easycv\\maste-page\\scratch\\temp-navbar-alignment-${Date.now()}`,
    'about:blank',
  ]);

  await delay(1800);
  const tabs = await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json();
  const page = tabs.find((tab) => tab.type === 'page');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });

  let commandId = 0;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++commandId;
    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id === id) {
        socket.removeEventListener('message', handleMessage);
        resolve(message.result);
      }
    };
    socket.addEventListener('message', handleMessage);
    socket.send(JSON.stringify({ id, method, params }));
  });

  return { chrome, socket, send };
}

(async () => {
  const results = [];
  const session = await connect();

  for (const pageName of pages) {
    await session.send('Page.navigate', {
      url: `http://127.0.0.1:8000/${pageName}?alignment-test=${Date.now()}`,
    });
    await delay(1200);
    const evaluation = await session.send('Runtime.evaluate', {
      expression: `(() => {
        const groups = [...document.querySelectorAll('.navbar .nav-item')];
        return groups.map((group) => {
          const label = group.querySelector('.nav-link span')?.textContent.trim();
          const items = [...group.querySelectorAll(':scope > .dropdown-menu > .dropdown-item')];
          return {
            label,
            items: items.map((item) => {
              const icon = item.querySelector('.dropdown-item-icon');
              const title = item.querySelector('.dropdown-item-title');
              return {
                justifyContent: getComputedStyle(item).justifyContent,
                textAlign: getComputedStyle(item).textAlign,
                iconLeft: Math.round(icon.getBoundingClientRect().left),
                titleLeft: Math.round(title.getBoundingClientRect().left),
                title: title.textContent.trim(),
              };
            }),
          };
        });
      })()`,
      returnByValue: true,
    });

    results.push({ page: pageName, groups: evaluation.result.value });
  }

  session.socket.close();
  session.chrome.kill();

  const failures = results.flatMap(({ page, groups }) => groups.flatMap(({ label, items }) =>
    items.filter((item) => item.justifyContent !== 'flex-start' || item.textAlign !== 'left')
      .map((item) => ({ page, label, ...item }))
  ));

  console.log(JSON.stringify(results, null, 2));
  if (failures.length) {
    console.error('FAIL', JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${pages.length} pages have left-aligned navbar submenu items.`);
  }
  setTimeout(() => process.exit(process.exitCode || 0), 300);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
