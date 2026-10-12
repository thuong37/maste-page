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
  const mobileDrawerBack = document.getElementById('mobile-drawer-back');
  const mobileDrawerBackLabel = document.getElementById('mobile-drawer-back-label');

  // 1. User Profile Dropdown Toggle
  userProfileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = accountLoggedView?.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      accountLoggedView?.classList.add('open');
      userProfileBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // 2. Notifications Popover Toggle
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = notifPanel?.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      notifPanel?.classList.add('open');
      notifBtn?.classList.add('active');
    }
  });

  notifMarkRead?.addEventListener('click', () => {
    document.querySelectorAll('#notif-panel .popover-item.unread').forEach(el => el.classList.remove('unread'));
    if (notifBadge) notifBadge.style.display = 'none';
  });

  // 3. Messages Popover Toggle
  messageBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = messagePanel?.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      messagePanel?.classList.add('open');
      messageBtn?.classList.add('active');
    }
  });

  messageMarkRead?.addEventListener('click', () => {
    document.querySelectorAll('#message-panel .popover-item.unread').forEach(el => el.classList.remove('unread'));
    if (messageBadge) messageBadge.style.display = 'none';
  });

  // Close all popovers helper
  function closeAllPopovers() {
    accountLoggedView?.classList.remove('open');
    userProfileBtn?.setAttribute('aria-expanded', 'false');
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
    // Màn cảm ứng không có mouseleave: chạm ra ngoài thì đóng menu thả xuống
    if (!e.target.closest('.nav-item')) navItems.forEach(item => setNavOpen(item, false));
  });

  // 4. Desktop Navigation Dropdown: rê chuột (có độ trễ), bấm nút (màn cảm ứng), bàn phím (CSS :focus-visible)
  function setNavOpen(item, open) {
    item.classList.toggle('open', open);
    item.querySelector('.nav-link')?.setAttribute('aria-expanded', String(open));
  }

  navItems.forEach(item => {
    let timeout;
    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      item.classList.remove('is-dismissed');
      navItems.forEach(i => setNavOpen(i, i === item));
    });

    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => setNavOpen(item, false), 150);
    });

    item.querySelector('button.nav-link')?.addEventListener('click', () => {
      navItems.forEach(i => setNavOpen(i, i === item));
    });

    item.addEventListener('focusout', (e) => {
      if (item.contains(e.relatedTarget)) return;
      item.classList.remove('is-dismissed');
      setNavOpen(item, false);
    });
  });

  // Auto-synchronize Active Menu State across all pages
  const currentPath = window.location.pathname.toLowerCase();
  const navLinkTimViec = document.getElementById('navLinkTimViec');
  if (currentPath.includes('viec-lam') || currentPath.includes('chi-tiet-viec-lam') || currentPath.includes('job-preview')) {
    navLinkTimViec?.classList.add('is-current');
  }

  // Đánh dấu mục menu trỏ đúng trang đang xem
  const currentFile = currentPath.split('/').pop() || 'index.html';
  document.querySelectorAll('.dropdown-item[href], .drawer-link[href]').forEach(link => {
    if (link.getAttribute('href') === currentFile) link.setAttribute('aria-current', 'page');
  });

  // 5. Mobile Drawer: menu 2 cấp (màn chính → danh sách con), Esc để đóng, khóa cuộn trang
  const drawerLogo = mobileDrawerOverlay?.querySelector('.mobile-drawer-logo');
  const drawerBody = mobileDrawerOverlay?.querySelector('.mobile-drawer-body');
  const drawerViews = mobileDrawerOverlay ? [...mobileDrawerOverlay.querySelectorAll('[data-drawer-view]')] : [];
  let drawerOpenedFrom = null;

  function showDrawerView(name) {
    drawerViews.forEach(view => {
      const active = view.dataset.drawerView === name;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });
    const isMain = name === 'main';
    if (mobileDrawerBack) mobileDrawerBack.hidden = isMain;
    if (drawerLogo) drawerLogo.hidden = !isMain;
    if (!isMain && mobileDrawerBackLabel) {
      const view = drawerViews.find(v => v.dataset.drawerView === name);
      mobileDrawerBackLabel.textContent = view?.getAttribute('aria-label') || 'Quay lại';
    }
    if (drawerBody) drawerBody.scrollTop = 0;
  }

  function openDrawer() {
    showDrawerView('main');
    mobileDrawerOverlay?.classList.add('open');
    mobileToggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileDrawerClose?.focus({ preventScroll: true });
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    if (!mobileDrawerOverlay?.classList.contains('open')) return;
    mobileDrawerOverlay.classList.remove('open');
    mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) mobileToggleBtn?.focus({ preventScroll: true });
  }

  mobileToggleBtn?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', () => closeDrawer());

  mobileDrawerOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileDrawerOverlay) {
      closeDrawer();
      return;
    }
    const opener = e.target.closest('[data-drawer-open]');
    if (opener) {
      drawerOpenedFrom = opener;
      showDrawerView(opener.dataset.drawerOpen);
      mobileDrawerBack?.focus({ preventScroll: true });
      return;
    }
    // Bấm một liên kết (kể cả #anchor cùng trang) thì đóng menu
    if (e.target.closest('.mobile-drawer-body a[href]')) closeDrawer({ restoreFocus: false });
  });

  mobileDrawerBack?.addEventListener('click', () => {
    showDrawerView('main');
    drawerOpenedFrom?.focus({ preventScroll: true });
  });

  // Esc: đóng drawer, rồi tới menu thả xuống / bảng thông báo đang mở
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (mobileDrawerOverlay?.classList.contains('open')) {
      closeDrawer();
      return;
    }
    navItems.forEach(item => {
      if (!item.classList.contains('open') && !item.contains(document.activeElement)) return;
      setNavOpen(item, false);
      if (item.contains(document.activeElement)) {
        item.classList.add('is-dismissed');
        item.querySelector('.nav-link')?.focus();
      }
    });
    closeAllPopovers();
  });
});
