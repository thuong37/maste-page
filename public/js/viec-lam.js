/**
 * EasyCV - Job Search Logic (viec-lam.js)
 * Live Filtering, URL Query Parser, Dynamic Results, Modal & Bookmarks
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.getElementById('jobSearchInput');
  const locationSelect = document.getElementById('jobLocationSelect');
  const categorySelect = document.getElementById('jobCategorySelect');
  const sortSelect = document.getElementById('sortSelect');
  const jobSearchForm = document.getElementById('jobSearchForm');
  const jobCountText = document.getElementById('jobCountText');
  const activeSearchTag = document.getElementById('activeSearchTag');
  const activeKeywordText = document.getElementById('activeKeywordText');
  const btnClearKeyword = document.getElementById('btnClearKeyword');
  const noResultsBox = document.getElementById('noResultsBox');
  const btnResetSearch = document.getElementById('btnResetSearch');
  const jobListingGrid = document.getElementById('jobListingGrid');
  const toast = document.getElementById('toastMsg');

  // Normalize Vietnamese diacritics for smart search
  function normalizeText(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .trim();
  }

  // Toast Utility
  function showToast(message, icon = '✓') {
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Parse Initial URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const keywordParam = urlParams.get('keyword') || urlParams.get('q') || '';
  const locationParam = urlParams.get('location') || urlParams.get('locations') || '';
  const categoryParam = urlParams.get('category') || '';

  if (searchInput && keywordParam) {
    searchInput.value = keywordParam;
  }
  if (locationSelect && locationParam) {
    // Smart match location select
    const normLoc = normalizeText(locationParam);
    for (let opt of locationSelect.options) {
      if (opt.value && (normalizeText(opt.value).includes(normLoc) || normLoc.includes(normalizeText(opt.value)))) {
        locationSelect.value = opt.value;
        break;
      }
    }
  }
  if (categorySelect && categoryParam) {
    categorySelect.value = categoryParam;
  }

  // Main Filtering Engine
  function applyJobFilters(updateUrl = true) {
    const query = searchInput ? searchInput.value.trim() : '';
    const normQuery = normalizeText(query);
    const locValue = locationSelect ? locationSelect.value.trim() : '';
    const normLoc = normalizeText(locValue);
    const catValue = categorySelect ? categorySelect.value.trim() : '';

    // Active quick tags
    const activeTags = Array.from(document.querySelectorAll('.quick-filter-tags .tag-btn.active'))
      .map(btn => btn.getAttribute('data-tag'));

    // Active sidebar checkboxes
    const checkedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value);
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);

    const cards = document.querySelectorAll('#jobListingGrid .job-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('.job-title')?.textContent || '';
      const company = card.querySelector('.job-company-name')?.textContent || '';
      const locationText = card.querySelector('.job-location-text')?.textContent || '';
      const skills = Array.from(card.querySelectorAll('.job-skill-chip')).map(s => s.textContent).join(' ');
      const cardAllText = `${title} ${company} ${locationText} ${skills}`;
      const normCardText = normalizeText(cardAllText);

      const cardCat = card.getAttribute('data-category') || '';
      const cardLevel = card.getAttribute('data-level') || '';
      const cardType = card.getAttribute('data-type') || '';

      let match = true;

      // 1. Keyword check
      if (normQuery) {
        // Match either whole phrase or individual tokens
        const tokens = normQuery.split(/\s+/).filter(Boolean);
        const tokenMatch = tokens.every(token => normCardText.includes(token));
        if (!tokenMatch && !normCardText.includes(normQuery)) {
          match = false;
        }
      }

      // 2. Location check
      if (match && normLoc && normLoc !== 'tat ca dia diem') {
        const normCardLoc = normalizeText(locationText);
        if (normLoc === 'remote') {
          if (!normCardLoc.includes('remote') && !normCardText.includes('remote')) {
            match = false;
          }
        } else if (!normCardLoc.includes(normLoc) && !normLoc.includes(normCardLoc)) {
          match = false;
        }
      }

      // 3. Category check
      if (match && catValue) {
        if (cardCat && cardCat !== catValue) {
          match = false;
        }
      }

      // 4. Quick tags check
      if (match && activeTags.length > 0) {
        for (let tag of activeTags) {
          if (tag === 'remote') {
            if (!normCardText.includes('remote')) match = false;
          } else if (tag === 'high-salary') {
            const salary = card.querySelector('.job-salary-badge')?.textContent || '';
            if (!salary.includes('30') && !salary.includes('35') && !salary.includes('40') && !salary.includes('50') && !salary.includes('60')) {
              match = false;
            }
          } else if (tag === 'fresher') {
            if (cardLevel === 'senior') match = false;
          } else if (tag === 'urgent') {
            if (!card.textContent.includes('Tuyển gấp')) match = false;
          } else if (tag === 'english') {
            if (!normCardText.includes('english') && !normCardText.includes('tieng anh')) match = false;
          }
        }
      }

      // 5. Sidebar level check
      if (match && checkedLevels.length > 0) {
        if (!checkedLevels.includes(cardLevel)) match = false;
      }

      // 6. Sidebar type check
      if (match && checkedTypes.length > 0) {
        if (!checkedTypes.includes(cardType)) match = false;
      }

      if (match) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count display
    if (jobCountText) {
      jobCountText.textContent = visibleCount;
    }

    // Update active keyword badge
    if (activeSearchTag && activeKeywordText) {
      if (query) {
        activeKeywordText.textContent = `Từ khóa: "${query}"`;
        activeSearchTag.style.display = 'inline-flex';
      } else {
        activeSearchTag.style.display = 'none';
      }
    }

    // Toggle No Results empty state
    if (noResultsBox) {
      noResultsBox.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Update URL if requested
    if (updateUrl && window.history && window.history.pushState) {
      const newParams = new URLSearchParams();
      if (query) newParams.set('keyword', query);
      if (locValue) newParams.set('location', locValue);
      if (catValue) newParams.set('category', catValue);
      const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
      window.history.pushState(null, '', newUrl);
    }
  }

  // Clear Keyword button
  btnClearKeyword?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    applyJobFilters();
    showToast('Đã xóa bộ lọc từ khóa', 'ℹ️');
  });

  // Reset Search button (in empty state)
  btnResetSearch?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (locationSelect) locationSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    applyJobFilters();
    showToast('Đã hiển thị tất cả 12 việc làm', '✓');
  });

  // Quick suggestion chips inside empty state
  document.querySelectorAll('.suggest-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const keyword = chip.getAttribute('data-search') || chip.textContent.trim();
      if (searchInput) {
        searchInput.value = keyword;
        applyJobFilters();
        showToast(`Tìm kiếm: ${keyword}`, '🔍');
      }
    });
  });

  // Search Form Submit
  jobSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    applyJobFilters();
    const query = searchInput?.value.trim() || '';
    const loc = locationSelect?.value || '';
    showToast(`Đang tìm: ${query || 'Tất cả việc làm'} ${loc ? '(' + loc + ')' : ''}`, '🔍');
  });

  // Select changes trigger filter
  locationSelect?.addEventListener('change', () => applyJobFilters());
  categorySelect?.addEventListener('change', () => applyJobFilters());

  // Quick Filter Tags Click
  document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      applyJobFilters();
      const tagText = btn.textContent.trim();
      showToast(btn.classList.contains('active') ? `Đang lọc: ${tagText}` : `Đã bỏ: ${tagText}`, '🔍');
    });
  });

  // Sidebar Checkbox filters
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => applyJobFilters());
  });

  // Reset Sidebar Filters button
  const btnResetFilters = document.getElementById('btnResetFilters');
  btnResetFilters?.addEventListener('click', () => {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(b => b.classList.remove('active'));
    applyJobFilters();
    showToast('Đã thiết lập lại bộ lọc nâng cao', '✓');
  });

  // Sort Select handler
  sortSelect?.addEventListener('change', () => {
    const val = sortSelect.value;
    const cards = Array.from(document.querySelectorAll('#jobListingGrid .job-card'));
    if (!jobListingGrid) return;

    if (val === 'salary_high') {
      cards.sort((a, b) => {
        const getSalaryNum = el => {
          const t = el.querySelector('.job-salary-badge')?.textContent || '';
          const match = t.match(/(\d+)\s*triệu/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getSalaryNum(b) - getSalaryNum(a);
      });
    } else if (val === 'newest') {
      cards.sort((a, b) => {
        const idA = parseInt(a.getAttribute('data-id') || '0', 10);
        const idB = parseInt(b.getAttribute('data-id') || '0', 10);
        return idB - idA;
      });
    }

    cards.forEach(card => jobListingGrid.appendChild(card));
    showToast(`Đã sắp xếp danh sách`, '⇅');
  });

  // Bookmark Toggle
  document.querySelectorAll('.btn-card-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isSaved = btn.classList.toggle('saved');
      const jobTitle = btn.closest('.job-card')?.querySelector('.job-title')?.textContent.trim() || 'công việc';
      if (isSaved) {
        showToast(`Đã lưu "${jobTitle}" vào yêu thích!`, '❤️');
      } else {
        showToast(`Đã bỏ lưu "${jobTitle}"`, 'ℹ️');
      }
    });
  });

  // Quick Apply & Card Click -> Detail Modal
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

  // Pagination buttons
  document.querySelectorAll('.pagination-wrapper .page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      document.querySelectorAll('.pagination-wrapper .page-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 320, behavior: 'smooth' });
      showToast(`Đã chuyển sang trang ${btn.textContent.trim()}`, '📄');
    });
  });

  // Initial Filtering Run
  applyJobFilters(false);

  if (keywordParam) {
    showToast(`Kết quả tìm kiếm cho: "${keywordParam}"`, '🔍');
  }

  console.log('EasyCV Job Search initialized with live filtering.');
});
