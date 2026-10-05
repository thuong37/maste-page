const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;
const port = 9238;
const baseUrl = 'http://localhost:3000/viec-lam.html';
const storageKey = 'easycv_saved_job_filters_v1';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'easycv-saved-filters-'));
  const browser = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${profileDir}`,
    '--window-size=1440,900',
    `${baseUrl}?exp=under1&salary=10-15&level=junior&type=hybrid&saturday=off_sat`
  ]);

  let ws;
  const failures = [];
  const assert = (condition, label, details = '') => {
    if (condition) console.log(`PASS: ${label}`);
    else {
      failures.push(label);
      console.error(`FAIL: ${label}${details ? ` — ${details}` : ''}`);
    }
  };

  try {
    let tabs;
    for (let attempt = 0; attempt < 15; attempt += 1) {
      try {
        tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
        break;
      } catch {
        await delay(300);
      }
    }
    if (!tabs) throw new Error('Chrome DevTools endpoint did not become ready');
    const tab = tabs.find(item => item.url.includes('viec-lam.html')) || tabs[0];
    ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));

    let id = 0;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const messageId = ++id;
      const handler = event => {
        const payload = JSON.parse(event.data);
        if (payload.id !== messageId) return;
        ws.removeEventListener('message', handler);
        if (payload.error) reject(new Error(payload.error.message));
        else resolve(payload.result);
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    const reload = async () => {
      await send('Page.reload', { ignoreCache: true });
      await delay(1200);
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await evaluate(`localStorage.removeItem(${JSON.stringify(storageKey)})`);
    await reload();

    const initial = await evaluate(`(() => {
      const trigger = document.getElementById('savedFiltersTrigger');
      trigger.click();
      const dialog = document.getElementById('savedFiltersDialog');
      const summary = document.getElementById('savedFilterCurrentSummary').textContent;
      return {
        open: !dialog.hidden,
        labelled: dialog.getAttribute('aria-labelledby') === 'savedFiltersTitle',
        summary,
        submitEnabled: !document.getElementById('savedFilterSubmit').disabled,
        focusedName: document.activeElement.id === 'savedFilterName'
      };
    })()`);
    assert(initial.open && initial.labelled && initial.submitEnabled, 'dialog opens with accessible labelling and active criteria');
    assert(['under1', '10-15', 'junior', 'hybrid', 'off_sat'].every(value => initial.summary.includes(value) || initial.summary.length > 40), 'five canonical criteria are summarized');

    const invalid = await evaluate(`(() => {
      const input = document.getElementById('savedFilterName');
      const form = document.getElementById('savedFilterForm');
      input.value = '   ';
      form.requestSubmit();
      const blankError = document.getElementById('savedFilterNameError').textContent;
      input.value = 'x'.repeat(61);
      form.requestSubmit();
      return {
        blankError: Boolean(blankError),
        longError: document.getElementById('savedFilterNameError').textContent.includes('60'),
        focused: document.activeElement === input,
        emptyStore: localStorage.getItem(${JSON.stringify(storageKey)}) === null
      };
    })()`);
    assert(invalid.blankError && invalid.longError && invalid.focused && invalid.emptyStore, 'blank and overlong names are blocked inline with focus retained');

    const saved = await evaluate(`(() => {
      const input = document.getElementById('savedFilterName');
      input.value = 'Junior Hybrid';
      document.getElementById('savedFilterForm').requestSubmit();
      const store = JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)}));
      const record = store.filters[0];
      return {
        version: store.version,
        count: store.filters.length,
        stableId: typeof record.id === 'string' && record.id.length > 8,
        params: record.params,
        rendered: document.querySelectorAll('.saved-filter-item').length
      };
    })()`);
    assert(saved.version === 1 && saved.count === 1 && saved.stableId && saved.rendered === 1, 'valid filter saves immediately with a stable ID');
    assert(saved.params.exp === 'under1' && saved.params.salary === '10-15' && saved.params.level === 'junior' && saved.params.type === 'hybrid' && saved.params.saturday === 'off_sat', 'saved snapshot contains all five criteria');

    await reload();
    const persisted = await evaluate(`(() => {
      document.getElementById('savedFiltersTrigger').click();
      return {
        count: document.querySelectorAll('.saved-filter-item').length,
        name: document.querySelector('.saved-filter-item strong')?.textContent,
        badge: document.getElementById('savedFilterCount').textContent
      };
    })()`);
    assert(persisted.count === 1 && persisted.name === 'Junior Hybrid' && persisted.badge === '1', 'saved filter survives refresh');

    const duplicate = await evaluate(`(() => {
      const input = document.getElementById('savedFilterName');
      input.value = 'Junior Hybrid';
      document.getElementById('savedFilterForm').requestSubmit();
      const store = JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)}));
      return { count: store.filters.length, uniqueIds: new Set(store.filters.map(item => item.id)).size };
    })()`);
    assert(duplicate.count === 2 && duplicate.uniqueIds === 2, 'duplicate names remain valid because stable IDs are distinct');

    const cancelDelete = await evaluate(`(() => {
      document.querySelector('[data-action="request-delete"]').click();
      const showing = Boolean(document.querySelector('[data-action="confirm-delete"]'));
      document.querySelector('[data-action="cancel-delete"]').click();
      const store = JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)}));
      return { showing, count: store.filters.length, confirmationGone: !document.querySelector('[data-action="confirm-delete"]') };
    })()`);
    assert(cancelDelete.showing && cancelDelete.count === 2 && cancelDelete.confirmationGone, 'delete cancel restores the row without mutation');

    const applied = await evaluate(`(() => {
      history.replaceState(null, '', location.pathname + '?keyword=changed&jobId=99&view=split&sort=salary&page=4');
      document.querySelector('[data-action="apply"]').click();
      const params = new URLSearchParams(location.search);
      return {
        dialogClosed: document.getElementById('savedFiltersDialog').hidden,
        params: Object.fromEntries(params),
        expLabel: document.getElementById('expFilterLabel')?.textContent,
        salaryLabel: document.getElementById('salaryFilterLabel')?.textContent
      };
    })()`);
    assert(applied.dialogClosed, 'apply closes the dialog');
    assert(applied.params.exp === 'under1' && applied.params.salary === '10-15' && applied.params.level === 'junior' && applied.params.type === 'hybrid' && applied.params.saturday === 'off_sat', 'apply replaces current supported criteria');
    assert(!('jobId' in applied.params) && !('view' in applied.params) && !('sort' in applied.params) && !('page' in applied.params) && !('keyword' in applied.params), 'apply excludes transient and previous criteria');

    const keyboard = await evaluate(`(() => {
      const trigger = document.getElementById('savedFiltersTrigger');
      trigger.focus();
      trigger.click();
      const dialog = document.getElementById('savedFiltersDialog');
      dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return { closed: dialog.hidden, restored: document.activeElement === trigger, expanded: trigger.getAttribute('aria-expanded') };
    })()`);
    assert(keyboard.closed && keyboard.restored && keyboard.expanded === 'false', 'Escape closes and restores focus to trigger');

    await evaluate(`(() => { document.getElementById('savedFiltersTrigger').click(); document.querySelector('[data-action="request-delete"]').click(); document.querySelector('[data-action="confirm-delete"]').click(); })()`);
    await reload();
    const deleted = await evaluate(`(() => {
      document.getElementById('savedFiltersTrigger').click();
      return { count: document.querySelectorAll('.saved-filter-item').length, emptyVisible: !document.getElementById('savedFilterEmpty').hidden };
    })()`);
    assert(deleted.count === 1 && !deleted.emptyVisible, 'confirmed delete removes only the selected record and persists');

    const sanitized = await evaluate(`(() => {
      localStorage.setItem(${JSON.stringify(storageKey)}, JSON.stringify({
        version: 1,
        filters: [{ id: 'sanitize-test', name: '<img id="injected-image">', params: { exp: 'bogus', salary: '10-15', evil: 'x' } }]
      }));
      return true;
    })()`);
    await reload();
    const safeRecord = await evaluate(`(() => {
      document.getElementById('savedFiltersTrigger').click();
      const text = document.querySelector('.saved-filter-item strong')?.textContent;
      const injected = document.getElementById('injected-image');
      document.querySelector('[data-action="apply"]').click();
      return { text, injected: Boolean(injected), params: Object.fromEntries(new URLSearchParams(location.search)) };
    })()`);
    assert(sanitized && safeRecord.text === '<img id="injected-image">' && !safeRecord.injected, 'saved names render as text rather than HTML');
    assert(safeRecord.params.salary === '10-15' && !('exp' in safeRecord.params) && !('evil' in safeRecord.params), 'unknown and invalid saved parameters are ignored safely');

    await evaluate(`localStorage.setItem(${JSON.stringify(storageKey)}, '{bad json')`);
    await reload();
    const corrupt = await evaluate(`(() => {
      document.getElementById('savedFiltersTrigger').click();
      return { open: !document.getElementById('savedFiltersDialog').hidden, empty: !document.getElementById('savedFilterEmpty').hidden };
    })()`);
    assert(corrupt.open && corrupt.empty, 'corrupt storage recovers to a usable empty collection');

    await send('Page.navigate', { url: baseUrl });
    await delay(1000);
    const emptyFilter = await evaluate(`(() => {
      document.getElementById('savedFiltersTrigger').click();
      return { disabled: document.getElementById('savedFilterSubmit').disabled, explanation: document.getElementById('savedFilterSubmit').title };
    })()`);
    assert(emptyFilter.disabled && emptyFilter.explanation.length > 0, 'empty filter disables save and explains why');

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 760, deviceScaleFactor: 1, mobile: true });
    const mobile = await evaluate(`(() => {
      const panel = document.querySelector('.saved-filters-panel');
      const close = document.getElementById('savedFiltersClose');
      const rect = panel.getBoundingClientRect();
      return { width: Math.round(rect.width), viewport: innerWidth, closeHeight: close.getBoundingClientRect().height, overflow: rect.bottom <= innerHeight + 1 };
    })()`);
    assert(
      mobile.width <= mobile.viewport && mobile.closeHeight >= 44 && mobile.overflow,
      '375px layout fits viewport with accessible control sizing',
      JSON.stringify(mobile)
    );

    if (failures.length) throw new Error(`${failures.length} verification(s) failed: ${failures.join(', ')}`);
    console.log('ALL SAVED FILTER VERIFICATIONS PASSED');
  } finally {
    if (ws) ws.close();
    browser.kill();
  }
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
