/**
 * EasyCV - Navbar Interactivity Script
 * Handles state toggling, dropdown menus, notifications, messages, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const demoLoggedInBtn = document.getElementById('demo-btn-loggedin');
  const demoGuestBtn = document.getElementById('demo-btn-guest');
  const demoThemeBtn = document.getElementById('demo-theme-btn');
  const themeIcon = document.getElementById('theme-icon');

  const accountLoggedView = document.getElementById('account-logged-view');
  const accountGuestView = document.getElementById('account-guest-view');
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

  // 1. State Switcher: Logged In vs Guest
  function setAuthState(isLoggedIn) {
    if (isLoggedIn) {
      accountLoggedView.style.display = 'block';
      accountGuestView.style.display = 'none';
      demoLoggedInBtn.classList.add('active');
      demoGuestBtn.classList.remove('active');
      if (notifBtn) notifBtn.style.display = 'flex';
      if (messageBtn) messageBtn.style.display = 'flex';
    } else {
      accountLoggedView.style.display = 'none';
      accountGuestView.style.display = 'flex';
      demoLoggedInBtn.classList.remove('active');
      demoGuestBtn.classList.add('active');
      if (notifBtn) notifBtn.style.display = 'none';
      if (messageBtn) messageBtn.style.display = 'none';
      closeAllPopovers();
    }
  }

  demoLoggedInBtn?.addEventListener('click', () => setAuthState(true));
  demoGuestBtn?.addEventListener('click', () => setAuthState(false));

  // Initialize with Logged In state for full inspection of user spreadsheet items
  setAuthState(true);

  // 2. Dark Mode Toggle
  let isDark = false;
  demoThemeBtn?.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" fill="currentColor"/>`;
    }
  });

  // 3. User Profile Dropdown Toggle
  userProfileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = accountLoggedView.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      accountLoggedView.classList.add('open');
    }
  });

  // 4. Notifications Popover Toggle
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

  // 5. Messages Popover Toggle
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

  // 6. Close all popovers & dropdowns helper
  function closeAllPopovers() {
    accountLoggedView?.classList.remove('open');
    notifPanel?.classList.remove('open');
    notifBtn?.classList.remove('active');
    messagePanel?.classList.remove('open');
    messageBtn?.classList.remove('active');
    navItems.forEach(item => item.classList.remove('open'));
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown-menu') &&
        !e.target.closest('#user-profile-btn') &&
        !e.target.closest('#notif-panel') &&
        !e.target.closest('#notif-btn') &&
        !e.target.closest('#message-panel') &&
        !e.target.closest('#message-btn') &&
        !e.target.closest('.dropdown-menu')) {
      closeAllPopovers();
    }
  });

  // Keyboard accessibility (Escape key to dismiss)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopovers();
      closeMobileDrawer();
    }
  });

  // 7. Mobile Drawer Interaction
  function openMobileDrawer() {
    mobileDrawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileDrawer);
  mobileDrawerClose?.addEventListener('click', closeMobileDrawer);
  mobileDrawerOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileDrawerOverlay) closeMobileDrawer();
  });

  // Mobile Accordion items
  mobileNavItems.forEach(item => {
    const title = item.querySelector('.mobile-nav-title');
    title?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      mobileNavItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // 8. Logout Demo Action
  const logoutLinks = document.querySelectorAll('.menu-logout-link');
  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản EasyCV?')) {
        setAuthState(false);
      }
    });
  });

  console.log('EasyCV Navbar initialized successfully.');
});
