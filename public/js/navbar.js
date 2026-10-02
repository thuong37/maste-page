/**
 * EasyCV - Navbar Interactivity Script
 * Handles dropdown menus, notifications, messages, mobile drawer,
 * and the Floating View Mode Switcher Box (Web vs Mobile Web).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const accountLoggedView = document.getElementById('account-logged-view');
  const userProfileBtn = document.getElementById('user-profile-btn');

  const notifBtn = document.getElementById('notif-btn');
  const notifPanel = document.getElementById('notif-panel');
  const notifMarkRead = document.getElementById('notif-mark-read');
  const notifBadge = document.getElementById('notif-badge');

  const messageBtn = document.getElementById('message-btn');
  const messagePanel = document.getElementById('message-panel');
  const messageMarkRead = document.getElementById('message-mark-read');
  const messageBadge = document.getElementById('message-badge');

  const navItems = document.querySelectorAll('.nav-item');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // 1. User Profile Dropdown Toggle
  userProfileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = accountLoggedView.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      accountLoggedView.classList.add('open');
    }
  });

  // 2. Notifications Popover Toggle
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = notifPanel.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      notifPanel.classList.add('open');
      notifBtn.classList.add('active');
    }
  });

  notifMarkRead?.addEventListener('click', () => {
    document.querySelectorAll('#notif-panel .popover-item.unread').forEach(el => el.classList.remove('unread'));
    if (notifBadge) notifBadge.style.display = 'none';
  });

  // 3. Messages Popover Toggle
  messageBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = messagePanel.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      messagePanel.classList.add('open');
      messageBtn.classList.add('active');
    }
  });

  messageMarkRead?.addEventListener('click', () => {
    document.querySelectorAll('#message-panel .popover-item.unread').forEach(el => el.classList.remove('unread'));
    if (messageBadge) messageBadge.style.display = 'none';
  });

  // Close all popovers helper
  function closeAllPopovers() {
    accountLoggedView?.classList.remove('open');
    notifPanel?.classList.remove('open');
    notifBtn?.classList.remove('active');
    messagePanel?.classList.remove('open');
    messageBtn?.classList.remove('active');
  }

  // Global click outside to close popovers
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#account-logged-view') &&
        !e.target.closest('#notif-panel') &&
        !e.target.closest('#notif-btn') &&
        !e.target.closest('#message-panel') &&
        !e.target.closest('#message-btn')) {
      closeAllPopovers();
    }
  });

  // 4. Desktop Navigation Dropdown (Hover delay)
  navItems.forEach(item => {
    let timeout;
    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      navItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
      item.classList.add('active');
    });

    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        item.classList.remove('active');
      }, 150);
    });
  });

  // 5. Mobile Drawer Navigation
  mobileToggleBtn?.addEventListener('click', () => {
    mobileDrawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileDrawerClose?.addEventListener('click', () => {
    mobileDrawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  });

  mobileDrawerOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  mobileNavItems.forEach(item => {
    const title = item.querySelector('.mobile-nav-title');
    title?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      mobileNavItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ==========================================================================
  // 6. Floating View Mode Switcher Box & Mobile Device Simulator
  // ==========================================================================
  const isInsideIframe = window.self !== window.top;

  if (isInsideIframe) {
    document.documentElement.classList.add('in-simulator');
    document.body.classList.add('in-simulator');
    // Inject instant scrollbar killer into simulator frame
    const scrollKiller = document.createElement('style');
    scrollKiller.id = 'easycv-scrollbar-killer';
    scrollKiller.textContent = 'html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; } ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; } html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }';
    document.head.appendChild(scrollKiller);
    return; // Do not render floating widget or simulator overlay inside iframe
  }

  // Current view parameters
  let currentMode = 'web';
  let currentWidth = 390;
  let currentHeight = 844;
  let isRotated = false;

  // Render & Mount Floating View Mode Box
  function ensureFloatingBox() {
    let box = document.getElementById('floatingViewModeBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'floatingViewModeBox';
      box.className = 'floating-view-mode-box';
      box.setAttribute('role', 'region');
      box.setAttribute('aria-label', 'Bộ chuyển đổi chế độ xem Web và Mobile Web');
      box.innerHTML = `
        <div class="floating-box-header">
          <div class="floating-box-title">
            <span class="floating-box-status-dot" id="floatingStatusDot"></span>
            <span>Chế độ xem</span>
          </div>
          <button type="button" class="floating-box-min-btn" id="floatingMinBtn" title="Thu gọn box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        <div class="floating-minimized-pill" id="floatingMinimizedPill" title="Bấm để mở rộng bảng điều khiển">
          <span class="floating-box-status-dot" id="floatingMiniStatusDot"></span>
          <span id="floatingMiniLabel">Web</span>
        </div>

        <div class="floating-mode-switcher">
          <button type="button" class="floating-mode-btn active" data-mode="web" id="floatingBtnWeb" title="Xem phiên bản Web Desktop">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/></svg>
            <span>Web</span>
          </button>
          <button type="button" class="floating-mode-btn" data-mode="mobile" id="floatingBtnMobile" title="Xem phiên bản Mobile Web">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
            <span>Mobile Web</span>
          </button>
        </div>

        <div class="floating-mobile-controls" id="floatingMobileControls">
          <div class="floating-preset-label">Thiết bị mô phỏng</div>
          <div class="floating-presets-grid">
            <button type="button" class="floating-preset-item active" data-width="390" data-height="844" title="iPhone 16 Pro (390 x 844)">
              <span>iPhone 16</span>
              <small>390×844</small>
            </button>
            <button type="button" class="floating-preset-item" data-width="412" data-height="915" title="Galaxy S24 (412 x 915)">
              <span>Galaxy S24</span>
              <small>412×915</small>
            </button>
            <button type="button" class="floating-preset-item" data-width="375" data-height="667" title="iPhone SE (375 x 667)">
              <span>iPhone SE</span>
              <small>375×667</small>
            </button>
          </div>

          <div class="floating-actions-row">
            <button type="button" class="floating-action-mini-btn" id="floatingRotateBtn" title="Xoay thiết bị ngang / dọc">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Xoay</span>
            </button>
            <button type="button" class="floating-action-mini-btn" id="floatingRefreshBtn" title="Tải lại trang mobile">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
              <span>Tải lại</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(box);
    }

    if (box.dataset.initialized === 'true') return box;
    box.dataset.initialized = 'true';

    // Event: Minimize / Expand
    const minBtn = box.querySelector('#floatingMinBtn');
    const miniPill = box.querySelector('#floatingMinimizedPill');
    minBtn?.addEventListener('click', () => {
      box.classList.add('is-minimized');
    });
    miniPill?.addEventListener('click', () => {
      box.classList.remove('is-minimized');
    });

    // Event: Mode buttons
    const btnWeb = box.querySelector('#floatingBtnWeb');
    const btnMobile = box.querySelector('#floatingBtnMobile');
    btnWeb?.addEventListener('click', () => setViewMode('web'));
    btnMobile?.addEventListener('click', () => setViewMode('mobile'));

    // Event: Device presets in floating box
    const presetItems = box.querySelectorAll('.floating-preset-item');
    presetItems.forEach(item => {
      item.addEventListener('click', () => {
        presetItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentWidth = parseInt(item.getAttribute('data-width'), 10);
        currentHeight = parseInt(item.getAttribute('data-height'), 10);
        isRotated = false;
        applySimulatorDimensions();
      });
    });

    // Event: Rotate
    const rotateBtn = box.querySelector('#floatingRotateBtn');
    rotateBtn?.addEventListener('click', () => {
      isRotated = !isRotated;
      applySimulatorDimensions();
    });

    // Event: Refresh
    const refreshBtn = box.querySelector('#floatingRefreshBtn');
    refreshBtn?.addEventListener('click', () => {
      const overlay = document.getElementById('mobileSimulatorOverlay');
      const iframe = overlay?.querySelector('#mobileSimulatorIframe');
      if (iframe) {
        try {
          iframe.contentWindow.location.reload();
        } catch {
          iframe.src = iframe.src;
        }
      }
    });

    return box;
  }

  // Ensure Simulator Overlay
  function ensureSimulatorOverlay() {
    let overlay = document.getElementById('mobileSimulatorOverlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'mobileSimulatorOverlay';
    overlay.className = 'mobile-simulator-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="simulator-top-bar">
        <div class="simulator-info">
          <span class="simulator-badge">
            <span class="simulator-dot"></span>
            Chế độ Mobile Web
          </span>
          <span class="simulator-url" id="simulatorUrlLabel">${window.location.pathname.split('/').pop() || 'index.html'}</span>
        </div>

        <div class="simulator-device-presets">
          <button type="button" class="preset-btn active" data-width="390" data-height="844" title="iPhone 16 Pro (390 x 844)">
            <span>iPhone 16</span>
            <small>390×844</small>
          </button>
          <button type="button" class="preset-btn" data-width="412" data-height="915" title="Galaxy S24 (412 x 915)">
            <span>Galaxy S24</span>
            <small>412×915</small>
          </button>
          <button type="button" class="preset-btn" data-width="375" data-height="667" title="iPhone SE (375 x 667)">
            <span>iPhone SE</span>
            <small>375×667</small>
          </button>
        </div>

        <div class="simulator-actions">
          <button type="button" class="simulator-action-btn" id="simulatorRefreshBtn" title="Tải lại trang mobile">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            <span>Tải lại</span>
          </button>
          <button type="button" class="simulator-close-btn" id="simulatorCloseBtn" title="Quay lại giao diện Web Desktop">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            <span>Quay lại bản Web</span>
            <kbd>ESC</kbd>
          </button>
        </div>
      </div>

      <div class="simulator-stage">
        <div class="smartphone-frame" id="smartphoneFrame">
          <div class="smartphone-speaker-notch">
            <div class="dynamic-island">
              <span class="dynamic-island-camera"></span>
            </div>
          </div>
          <div class="smartphone-screen-wrap">
            <iframe id="mobileSimulatorIframe" class="smartphone-iframe" title="Giao diện Mobile Web EasyCV"></iframe>
          </div>
          <div class="smartphone-home-bar"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Sync presets from overlay top bar
    const topPresetBtns = overlay.querySelectorAll('.preset-btn');
    topPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        topPresetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentWidth = parseInt(btn.getAttribute('data-width'), 10);
        currentHeight = parseInt(btn.getAttribute('data-height'), 10);
        isRotated = false;
        syncFloatingBoxPresets();
        applySimulatorDimensions();
      });
    });

    // Top-bar Refresh & Close
    overlay.querySelector('#simulatorRefreshBtn')?.addEventListener('click', () => {
      const iframe = overlay.querySelector('#mobileSimulatorIframe');
      if (iframe) {
        try {
          iframe.contentWindow.location.reload();
        } catch {
          iframe.src = iframe.src;
        }
      }
    });

    overlay.querySelector('#simulatorCloseBtn')?.addEventListener('click', () => {
      setViewMode('web');
    });

        // Auto inject scrollbar killer when iframe loads
    const iframeEl = overlay.querySelector('#mobileSimulatorIframe');
    iframeEl?.addEventListener('load', () => {
      try {
        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        if (doc && !doc.getElementById('easycv-injected-scroll-killer')) {
          doc.documentElement.classList.add('in-simulator');
          doc.body.classList.add('in-simulator');
          const style = doc.createElement('style');
          style.id = 'easycv-injected-scroll-killer';
          style.textContent = `
            html, body, * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
          `;
          doc.head.appendChild(style);
        }
      } catch (e) {}
    });

    return overlay;
  }

  // Helper to sync presets between Floating Box and Simulator Overlay
  function syncFloatingBoxPresets() {
    const box = document.getElementById('floatingViewModeBox');
    if (!box) return;
    const items = box.querySelectorAll('.floating-preset-item');
    items.forEach(it => {
      const w = parseInt(it.getAttribute('data-width'), 10);
      it.classList.toggle('active', w === currentWidth);
    });
  }

  // Apply dimensions to smartphone frame
  function applySimulatorDimensions() {
    const frame = document.getElementById('smartphoneFrame');
    if (!frame) return;
    const w = isRotated ? currentHeight : currentWidth;
    const h = isRotated ? currentWidth : currentHeight;
    frame.style.width = w + 'px';
    frame.style.height = h + 'px';
  }

  // Core setViewMode handler
  function setViewMode(mode) {
    currentMode = mode;
    const box = ensureFloatingBox();
    const btnWeb = box.querySelector('#floatingBtnWeb');
    const btnMobile = box.querySelector('#floatingBtnMobile');
    const statusDot = box.querySelector('#floatingStatusDot');
    const miniStatusDot = box.querySelector('#floatingMiniStatusDot');
    const miniLabel = box.querySelector('#floatingMiniLabel');

    if (mode === 'mobile') {
      btnWeb?.classList.remove('active');
      btnMobile?.classList.add('active');
      box.classList.add('mode-mobile');
      statusDot?.classList.add('mobile');
      miniStatusDot?.classList.add('mobile');
      if (miniLabel) miniLabel.textContent = 'Mobile Web';

      const overlay = ensureSimulatorOverlay();
      const iframe = overlay.querySelector('#mobileSimulatorIframe');
      const urlLabel = overlay.querySelector('#simulatorUrlLabel');

      if (urlLabel) {
        urlLabel.textContent = window.location.pathname.split('/').pop() || 'index.html';
      }

      applySimulatorDimensions();

      if (iframe) {
        // Universal URL & Protocol handling:
        // If file:// protocol, srcdoc prevents local file security blocking.
        // If http://, iframe.src connects directly to localhost.
        if (window.location.protocol === 'file:') {
          if (!iframe.srcdoc || iframe.srcdoc === '') {
            iframe.srcdoc = document.documentElement.outerHTML;
          }
        } else {
          if (!iframe.getAttribute('src') || iframe.getAttribute('src') === '') {
            iframe.src = window.location.href;
          }
        }
      }

      overlay.classList.add('is-active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      btnMobile?.classList.remove('active');
      btnWeb?.classList.add('active');
      box.classList.remove('mode-mobile');
      statusDot?.classList.remove('mobile');
      miniStatusDot?.classList.remove('mobile');
      if (miniLabel) miniLabel.textContent = 'Web';

      const overlay = document.getElementById('mobileSimulatorOverlay');
      if (overlay) {
        overlay.classList.remove('is-active');
        overlay.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }
  }

  // Initialize Floating Switcher Box
  ensureFloatingBox();

  // Listen for message from iframe simulator
  window.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'EASYCV_SWITCH_VIEW_MODE') {
      setViewMode(e.data.mode);
    }
  });

  // ESC to close simulator
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('mobileSimulatorOverlay');
      if (overlay && overlay.classList.contains('is-active')) {
        setViewMode('web');
      }
    }
  });

  console.log('EasyCV Floating View Mode Switcher initialized successfully.');
});
