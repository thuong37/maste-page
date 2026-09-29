/**
 * EasyCV - Job Search Logic (viec-lam.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const keywordParam = urlParams.get('keyword') || '';
  const locationParam = urlParams.get('location') || '';

  const searchInput = document.getElementById('jobSearchInput');
  const locationSelect = document.getElementById('jobLocationSelect');

  if (searchInput && keywordParam) {
    searchInput.value = keywordParam;
  }
  if (locationSelect && locationParam) {
    locationSelect.value = locationParam;
  }

  // 2. Toast Utility
  const toast = document.getElementById('toastMsg');
  function showToast(message, icon = '✓') {
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 3. Bookmark Toggle
  document.querySelectorAll('.btn-card-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isSaved = btn.classList.toggle('saved');
      const jobTitle = btn.closest('.job-card')?.querySelector('.job-title')?.textContent.trim() || 'công việc';
      if (isSaved) {
        showToast(`Đã lưu "${jobTitle}" vào danh sách yêu thích!`, '❤️');
      } else {
        showToast(`Đã bỏ lưu "${jobTitle}"`, 'ℹ️');
      }
    });
  });

  // 4. Quick Apply & Card Click -> Open Detail Modal
  const jobModalBackdrop = document.getElementById('jobModalBackdrop');
  const jobModalClose = document.getElementById('jobModalClose');
  const modalJobTitle = document.getElementById('modalJobTitle');
  const modalCompanyName = document.getElementById('modalCompanyName');
  const modalSalary = document.getElementById('modalSalary');
  const modalLocation = document.getElementById('modalLocation');
  const btnModalApply = document.getElementById('btnModalApply');

  function openJobModal(card) {
    if (!jobModalBackdrop) return;
    const title = card.querySelector('.job-title')?.textContent.trim();
    const company = card.querySelector('.job-company-name')?.textContent.trim();
    const salary = card.querySelector('.job-salary-badge')?.textContent.trim();
    const location = card.querySelector('.job-location-text')?.textContent.trim();

    if (modalJobTitle) modalJobTitle.textContent = title;
    if (modalCompanyName) modalCompanyName.textContent = company;
    if (modalSalary) modalSalary.textContent = salary;
    if (modalLocation) modalLocation.textContent = location;

    jobModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeJobModal() {
    if (!jobModalBackdrop) return;
    jobModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-card-bookmark') || e.target.closest('.btn-card-apply')) return;
      openJobModal(card);
    });
  });

  document.querySelectorAll('.btn-card-apply').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.job-card');
      openJobModal(card);
    });
  });

  jobModalClose?.addEventListener('click', closeJobModal);
  jobModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === jobModalBackdrop) closeJobModal();
  });

  btnModalApply?.addEventListener('click', () => {
    showToast('Nộp hồ sơ ứng tuyển thành công! Nhà tuyển dụng sẽ phản hồi sớm.', '🚀');
    closeJobModal();
  });

  // 5. Quick Tags Filter
  document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const tagText = btn.getAttribute('data-tag') || btn.textContent.trim();
      showToast(`Đang lọc theo: ${tagText}`, '🔍');
    });
  });

  // 6. Reset Filters
  const btnResetFilters = document.getElementById('btnResetFilters');
  btnResetFilters?.addEventListener('click', () => {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(b => b.classList.remove('active'));
    showToast('Đã thiết lập lại tất cả bộ lọc', '✓');
  });

  // 7. Search Form Submit
  const jobSearchForm = document.getElementById('jobSearchForm');
  jobSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim() || '';
    const loc = locationSelect?.value || '';
    showToast(`Đang tìm kiếm: ${query || 'Tất cả việc làm'} ${loc ? '(' + loc + ')' : ''}`, '🔍');
  });

  // 8. Pagination buttons
  document.querySelectorAll('.pagination-wrapper .page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      document.querySelectorAll('.pagination-wrapper .page-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 320, behavior: 'smooth' });
      showToast(`Đã chuyển sang trang ${btn.textContent.trim()}`, '📄');
    });
  });

  console.log('EasyCV Job Search page initialized.');
});
