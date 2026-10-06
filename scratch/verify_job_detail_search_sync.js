const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9393',
  '--disable-gpu',
  '--disable-extensions',
  '--user-data-dir=D:\\master page\\scratch\\chrome-profile-detail-search-sync',
  '--window-size=1440,900',
  'http://127.0.0.1:3000/chi-tiet-viec-lam.html?id=3&title=Senior%20Product%20Designer%20(UI%2FUX%20App%2FWeb)'
]);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    await wait(2000);
    const targets = await getJson('http://127.0.0.1:9393/json/list');
    const page = targets.find(target => target.type === 'page');
    if (!page) throw new Error('Chrome page target was not found');

    const socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(resolve => { socket.onopen = resolve; });
    let messageId = 1;
    const send = (method, params = {}) => new Promise(resolve => {
      const id = messageId++;
      const handler = event => {
        const message = JSON.parse(event.data);
        if (message.id === id) {
          socket.removeEventListener('message', handler);
          resolve(message.result);
        }
      };
      socket.addEventListener('message', handler);
      socket.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    };
    const navigate = async path => {
      await send('Page.navigate', { url: `http://127.0.0.1:3000/${path}` });
      await wait(1200);
    };

    await send('Page.enable');
    await evaluate("localStorage.removeItem('easycv_recent_searches_v2')");
    await navigate('chi-tiet-viec-lam.html?id=3&title=Senior%20Product%20Designer%20(UI%2FUX%20App%2FWeb)');

    await evaluate("document.getElementById('jobSearchInput').focus()");
    const defaultPopup = await evaluate(`(() => {
      const popup = document.getElementById('searchSuggestDropdown');
      const input = document.getElementById('jobSearchInput');
      const popupRect = popup.getBoundingClientRect();
      const inputRect = input.closest('.search-input-group').getBoundingClientRect();
      return {
        open: popup.classList.contains('is-open'),
        ariaExpanded: input.getAttribute('aria-expanded'),
        role: popup.getAttribute('role'),
        recentRows: popup.querySelectorAll('.recent-search-row').length,
        popularKeywords: popup.querySelectorAll('.suggest-trend-chip').length,
        recommendedJobs: popup.querySelectorAll('.recommended-job').length,
        leftAligned: Math.abs(popupRect.left - inputRect.left) <= 1
      };
    })()`);
    if (!defaultPopup.open || defaultPopup.ariaExpanded !== 'true' || defaultPopup.role !== 'dialog' || defaultPopup.recentRows !== 5 || defaultPopup.popularKeywords !== 6 || defaultPopup.recommendedJobs !== 5 || !defaultPopup.leftAligned) {
      throw new Error(`Default popup parity failed: ${JSON.stringify(defaultPopup)}`);
    }

    const typing = await evaluate(`(() => {
      const input = document.getElementById('jobSearchInput');
      input.value = 'Product';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return {
        keywordModeVisible: !document.getElementById('keywordSuggestionsSection').hidden,
        recentHidden: document.getElementById('suggestRecentSection').hidden,
        popularHidden: document.getElementById('popularKeywordsWrap').hidden,
        suggestionCount: document.querySelectorAll('.keyword-suggestion-row').length,
        highlighted: document.querySelector('.keyword-suggestion-row strong')?.textContent === 'Product',
        clearVisible: getComputedStyle(document.getElementById('clearSearchInputBtn')).display !== 'none'
      };
    })()`);
    if (!typing.keywordModeVisible || !typing.recentHidden || !typing.popularHidden || typing.suggestionCount < 2 || !typing.highlighted || !typing.clearVisible) {
      throw new Error(`Typing suggestion mode failed: ${JSON.stringify(typing)}`);
    }

    await evaluate(`(() => {
      document.dispatchEvent(new CustomEvent('easycv:category-applied', { detail: {
        groups: ['it'], subgroups: ['Thiết kế sản phẩm'], roles: ['UI/UX Designer'], primaryQuery: 'UI/UX Designer'
      }}));
      const location = document.getElementById('jobLocationSelect');
      location.value = 'TP. Hồ Chí Minh';
      document.getElementById('jobSearchForm').requestSubmit();
    })()`);
    await wait(1200);
    const submittedUrl = await evaluate('window.location.href');
    const parsedUrl = new URL(submittedUrl);
    if (!parsedUrl.pathname.endsWith('/viec-lam.html') || parsedUrl.searchParams.get('keyword') !== 'Product' || parsedUrl.searchParams.get('location') !== 'TP. Hồ Chí Minh' || parsedUrl.searchParams.get('category') !== 'it' || parsedUrl.searchParams.get('industry') !== 'UI/UX Designer') {
      throw new Error(`Search redirect lost parameters: ${submittedUrl}`);
    }

    await navigate('chi-tiet-viec-lam.html?id=3&title=Senior%20Product%20Designer%20(UI%2FUX%20App%2FWeb)');
    await evaluate("document.getElementById('jobSearchInput').focus()");
    const sharedHistory = await evaluate("document.querySelector('.recent-search-keyword')?.textContent");
    if (sharedHistory !== 'Product') throw new Error(`Shared v2 history failed: ${sharedHistory}`);

    const popupCoordination = await evaluate(`(() => {
      document.getElementById('categoryFilterTrigger').click();
      return {
        suggestionsClosed: !document.getElementById('searchSuggestDropdown').classList.contains('is-open'),
        categoryOpen: !document.getElementById('categoryModalOverlay').hidden
      };
    })()`);
    if (!popupCoordination.suggestionsClosed || !popupCoordination.categoryOpen) {
      throw new Error(`Popup coordination failed: ${JSON.stringify(popupCoordination)}`);
    }
    await evaluate("document.getElementById('categoryModalClose').click()");

    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await evaluate(`(() => {
      const input = document.getElementById('jobSearchInput');
      input.blur();
      input.focus();
    })()`);
    const mobile = await evaluate(`(() => {
      const element = document.getElementById('searchSuggestDropdown');
      const popup = element.getBoundingClientRect();
      return { open: element.classList.contains('is-open'), left: popup.left, right: popup.right, width: popup.width, viewport: document.documentElement.clientWidth };
    })()`);
    if (!mobile.open || mobile.width <= 0 || mobile.left < 0 || mobile.right > mobile.viewport + 1 || mobile.width > mobile.viewport) {
      throw new Error(`Mobile popup overflow: ${JSON.stringify(mobile)}`);
    }

    await send('Emulation.clearDeviceMetricsOverride');
    await navigate('public/chi-tiet-viec-lam.html?id=3');
    await evaluate("document.getElementById('jobSearchInput').focus()");
    const publicMirror = await evaluate(`(() => ({
      controller: window.EasyCVDetailSearchV2 === true,
      open: document.getElementById('searchSuggestDropdown').classList.contains('is-open'),
      recommendedJobs: document.querySelectorAll('.recommended-job').length
    }))()`);
    if (!publicMirror.controller || !publicMirror.open || publicMirror.recommendedJobs !== 5) {
      throw new Error(`Public mirror failed: ${JSON.stringify(publicMirror)}`);
    }

    console.log(JSON.stringify({ defaultPopup, typing, submittedUrl, sharedHistory, popupCoordination, mobile, publicMirror }, null, 2));
    await send('Browser.close');
    socket.close();
  } catch (error) {
    console.error(error);
    chrome.kill();
    process.exitCode = 1;
  }
}

run();
