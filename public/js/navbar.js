/**
 * EasyCV - Navbar Interactivity Script
 * Handles dropdown menus, notifications, messages, and mobile drawer.
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

  // 4. Close all popovers & dropdowns helper
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

  // 5. Mobile Drawer Interaction
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

  console.log('EasyCV Navbar initialized successfully.');
});
