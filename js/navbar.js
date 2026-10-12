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
    const isOpen = accountLoggedView?.classList.contains('open');
    closeAllPopovers();
    if (!isOpen) {
      accountLoggedView?.classList.add('open');
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
      navItems.forEach(i => { if (i !== item) i.classList.remove('open'); });
      item.classList.add('open');
    });

    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        item.classList.remove('open');
      }, 150);
    });
  });

  // Auto-synchronize Active Menu State across all pages
  const currentPath = window.location.pathname.toLowerCase();
  const navLinkTimViec = document.getElementById('navLinkTimViec');
  if (currentPath.includes('viec-lam') || currentPath.includes('chi-tiet-viec-lam') || currentPath.includes('job-preview')) {
    navLinkTimViec?.classList.add('is-current');
  }

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
});
