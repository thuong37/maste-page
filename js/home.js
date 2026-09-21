/**
 * EasyCV - Candidate Home Page Interactions (home.js)
 * Handles:
 * - Filter pills for "Việc làm nổi bật"
 * - Dynamic tab switching for "Việc làm phù hợp"
 * - Bookmark job toggle & toast notification
 * - Follow company toggle
 * - Popular keywords click-to-search
 * - Newsletter subscribe confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Toast Notification Utility ---
  let toastContainer = document.querySelector('.easycv-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'easycv-toast-container';
    document.body.appendChild(toastContainer);
  }

  function showToast(message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'easycv-toast';
    toast.innerHTML = `
      <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--easycv-orange);color:#fff;font-size:12px;font-weight:700;">${icon}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- 2. Filter Pills for "Việc làm nổi bật" (Featured Jobs) ---
  const filterPillBtns = document.querySelectorAll('.featured-jobs-section .filter-pill-btn');
  const featuredJobCards = document.querySelectorAll('.featured-jobs-section .job-card');

  filterPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      featuredJobCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 3. Dynamic Tabs for "Việc làm phù hợp" (AI Recommendations) ---
  const matchingTabBtns = document.querySelectorAll('.matching-tab-btn');
  const matchingJobCards = document.querySelectorAll('.matching-jobs-section .job-card');

  matchingTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      matchingTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabFilter = tab.getAttribute('data-tab') || 'all';

      matchingJobCards.forEach(card => {
        const tagType = card.getAttribute('data-match-type') || '';
        if (tabFilter === 'all' || tagType.includes(tabFilter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 4. Bookmark Job Toggle ---
  document.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.btn-bookmark');
    if (bookmarkBtn) {
      e.preventDefault();
      e.stopPropagation();
      const isSaved = bookmarkBtn.classList.toggle('active');
      const jobTitle = bookmarkBtn.closest('.job-card')?.querySelector('.job-title')?.textContent?.trim() 
                     || bookmarkBtn.closest('.attractive-card')?.querySelector('.job-title')?.textContent?.trim() 
                     || 'công việc';

      if (isSaved) {
        showToast(`Đã lưu "${jobTitle}" vào danh sách Việc làm đã lưu!`, '♥');
      } else {
        showToast(`Đã bỏ lưu "${jobTitle}" khỏi danh sách!`, '✕');
      }
    }
  });

  // --- 5. Follow Company Toggle ---
  const followBtns = document.querySelectorAll('.btn-follow-company');
  followBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isFollowing = btn.classList.toggle('following');
      const companyName = btn.closest('.company-card')?.querySelector('.company-card-title')?.textContent?.trim() || 'doanh nghiệp';

      if (isFollowing) {
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Đang theo dõi</span>
        `;
        showToast(`Bạn đang theo dõi ${companyName}. Sẽ nhận thông báo khi có tuyển dụng mới!`, '✓');
      } else {
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Theo dõi</span>
        `;
        showToast(`Đã hủy theo dõi ${companyName}.`, '✕');
      }
    });
  });

  // --- 6. Quick Keyword Click-to-Search ---
  const keywordLinks = document.querySelectorAll('.keyword-badge-link, .quick-tag-link');
  const searchInput = document.querySelector('.search-input');

  keywordLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const keywordText = link.getAttribute('data-keyword') || link.textContent.trim().replace(/^🔥\s*/, '').replace(/\s*\d+.*$/, '');
      if (searchInput) {
        searchInput.value = keywordText;
        searchInput.focus();
        window.scrollTo({
          top: searchInput.getBoundingClientRect().top + window.pageYOffset - 120,
          behavior: 'smooth'
        });
        showToast(`Đã chọn từ khóa: "${keywordText}". Đang lọc kết quả...`, '🔍');
      }
    });
  });

  // --- 7. Newsletter Subscription Form ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        showToast(`Đăng ký thành công! EasyCV sẽ gửi việc làm phù hợp tới ${input.value.trim()}`, '✉');
        input.value = '';
      }
    });
  }

  // --- 8. Floating AI Recommendation Widget ---
  const floatingAiBtn = document.querySelector('.floating-ai-btn');
  const floatingAiPopover = document.querySelector('.floating-ai-popover');
  const popoverCloseBtn = document.querySelector('.popover-close-btn');

  if (floatingAiBtn && floatingAiPopover) {
    floatingAiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingAiPopover.classList.toggle('open');
    });

    popoverCloseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingAiPopover.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!floatingAiPopover.contains(e.target) && !floatingAiBtn.contains(e.target)) {
        floatingAiPopover.classList.remove('open');
      }
    });
  }

  // --- 9. Event & Course Quick Register Toasts ---
  document.addEventListener('click', (e) => {
    const eventBtn = e.target.closest('.btn-event-register');
    if (eventBtn) {
      e.preventDefault();
      const eventTitle = eventBtn.closest('.event-card')?.querySelector('.event-title')?.textContent?.trim() || 'sự kiện';
      showToast(`Đã đăng ký tham gia "${eventTitle}" thành công! Vé mời đã gửi qua email.`, '🎟️');
    }

    const vipBtn = e.target.closest('.btn-vip-upgrade');
    if (vipBtn) {
      e.preventDefault();
      showToast(`Chúc mừng! Bạn đã kích hoạt dùng thử 14 ngày gói ứng viên VIP thành công.`, '👑');
    }
  });

  // --- 10. Hero VIP Employer Spotlight Switcher & Rotator ---
  const adDots = document.querySelectorAll('.ad-dot');
  const adTabs = document.querySelectorAll('.ad-tab-btn');
  const adCards = document.querySelectorAll('.employer-spotlight-card');

  if ((adDots.length || adTabs.length) && adCards.length) {
    let currentAdIndex = 0;
    let adInterval = null;

    function activateAdSlide(index) {
      currentAdIndex = index;
      adDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      adTabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });

      adCards.forEach((card, i) => {
        if (i === index) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(4px)';
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    }

    adDots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        activateAdSlide(idx);
        restartAdRotation();
      });
    });

    adTabs.forEach((tab, idx) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        activateAdSlide(idx);
        restartAdRotation();
      });
    });

    function startAdRotation() {
      adInterval = setInterval(() => {
        const nextIdx = (currentAdIndex + 1) % adCards.length;
        activateAdSlide(nextIdx);
      }, 5000);
    }

    function restartAdRotation() {
      if (adInterval) clearInterval(adInterval);
      startAdRotation();
    }

    const showcaseBox = document.querySelector('.hero-ad-showcase');
    if (showcaseBox) {
      showcaseBox.addEventListener('mouseenter', () => {
        if (adInterval) clearInterval(adInterval);
      });
      showcaseBox.addEventListener('mouseleave', () => {
        startAdRotation();
      });
    }

    startAdRotation();
  }

  // --- 11. Hero Smart Search Box & Suggestion Overlay Controller ---
  const heroSearchWrapper = document.getElementById('heroSearchWrapper');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const clearSearchInputBtn = document.getElementById('clearSearchInputBtn');
  const searchSuggestDropdown = document.getElementById('searchSuggestDropdown');
  const heroLocationSelect = document.getElementById('heroLocationSelect');
  const btnHeroSearch = document.getElementById('btnHeroSearch');
  const recentSearchList = document.getElementById('recentSearchList');
  const btnClearSearchHistory = document.getElementById('btnClearSearchHistory');
  const btnCloseSuggest = document.getElementById('btnCloseSuggest');
  const industryPillsRow = document.getElementById('industryPillsRow');
  const industryHotRoles = document.getElementById('industryHotRoles');

  if (heroSearchWrapper && heroSearchInput && searchSuggestDropdown) {
    const STORAGE_KEY = 'easycv_recent_searches_v2';
    const DEFAULT_HISTORY = [
      'ReactJS Developer',
      'Marketing Leader',
      'UI/UX Designer',
      'Java Spring Boot',
      'Kế toán tổng hợp'
    ];

    const INDUSTRY_ROLES = {
      it: [
        'Frontend ReactJS', 'Backend Java / Spring', 'Node.js Developer',
        'AI & Prompt Engineer', 'DevOps / Cloud', 'Mobile Flutter / iOS', 'Data Analyst'
      ],
      marketing: [
        'Digital Marketing', 'Content Creator', 'SEO Specialist',
        'Brand Manager', 'Performance Ads Lead', 'Social Media Lead'
      ],
      finance: [
        'Kế toán tổng hợp', 'Chuyên viên Tín dụng', 'Kiểm toán viên',
        'Phân tích tài chính', 'Giao dịch viên Ngân hàng'
      ],
      sales: [
        'Account Executive (B2B)', 'Trưởng phòng Kinh doanh', 'Sales Bất động sản',
        'Tư vấn tài chính', 'Telesales Chuyên nghiệp'
      ],
      design: [
        'Senior UI/UX Designer', 'Graphic Designer', '3D / Motion Artist',
        'Product Designer', 'Brand Visual Designer'
      ],
      hr: [
        'Chuyên viên Tuyển dụng (TA)', 'HR Generalist', 'C&B Specialist',
        'HR Business Partner (HRBP)', 'Training & Development'
      ],
      eng: [
        'Kỹ sư Cơ khí', 'Kỹ sư Điện - Tự động hóa', 'Kỹ sư Xây dựng',
        'QA/QC Engineer', 'Kỹ thuật viên Vận hành'
      ],
      logistics: [
        'Nhân viên Xuất nhập khẩu', 'Quản lý kho vận (Warehouse)',
        'Thu mua (Purchasing)', 'Điều phối vận tải', 'Customs Specialist'
      ]
    };

    function getHistory() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.warn('Cannot read history from localStorage', e);
      }
      return [...DEFAULT_HISTORY];
    }

    function saveHistory(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Cannot write history to localStorage', e);
      }
    }

    function renderHistory() {
      if (!recentSearchList) return;
      const history = getHistory();
      recentSearchList.innerHTML = '';

      if (!history || history.length === 0) {
        recentSearchList.innerHTML = '<span class="recent-empty-hint">Chưa có lịch sử tìm kiếm gần đây</span>';
        if (btnClearSearchHistory) btnClearSearchHistory.style.display = 'none';
        return;
      }

      if (btnClearSearchHistory) btnClearSearchHistory.style.display = 'inline-block';

      history.forEach((keyword) => {
        const chip = document.createElement('div');
        chip.className = 'recent-chip';
        chip.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="recent-chip-text">${keyword}</span>
          <button type="button" class="recent-chip-remove" title="Xóa từ khóa">✕</button>
        `;

        chip.addEventListener('click', (e) => {
          if (e.target.closest('.recent-chip-remove')) {
            e.stopPropagation();
            removeHistoryItem(keyword);
            return;
          }
          executeSearch(keyword);
        });

        recentSearchList.appendChild(chip);
      });
    }

    function addHistoryItem(keyword) {
      const cleanKeyword = keyword.trim();
      if (!cleanKeyword) return;
      let history = getHistory();
      history = history.filter(item => item.toLowerCase() !== cleanKeyword.toLowerCase());
      history.unshift(cleanKeyword);
      if (history.length > 8) history = history.slice(0, 8);
      saveHistory(history);
      renderHistory();
    }

    function removeHistoryItem(keyword) {
      let history = getHistory();
      history = history.filter(item => item.toLowerCase() !== keyword.toLowerCase());
      saveHistory(history);
      renderHistory();
      showToast(`Đã xóa "${keyword}" khỏi lịch sử`, '✕');
    }

    function clearAllHistory() {
      saveHistory([]);
      renderHistory();
      showToast('Đã xóa toàn bộ lịch sử tìm kiếm', '✕');
    }

    function renderIndustryRoles(categoryKey) {
      if (!industryHotRoles) return;
      industryHotRoles.innerHTML = '';
      const roles = INDUSTRY_ROLES[categoryKey] || INDUSTRY_ROLES['it'];

      roles.forEach(role => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hot-role-btn';
        btn.textContent = role;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          executeSearch(role);
        });
        industryHotRoles.appendChild(btn);
      });
    }

    function openDropdown() {
      searchSuggestDropdown.classList.add('is-open');
    }

    function closeDropdown() {
      searchSuggestDropdown.classList.remove('is-open');
    }

    function executeSearch(keyword) {
      if (typeof keyword === 'string') {
        heroSearchInput.value = keyword;
        if (clearSearchInputBtn) {
          clearSearchInputBtn.style.display = 'flex';
        }
      }
      const query = heroSearchInput.value.trim();
      const location = heroLocationSelect ? heroLocationSelect.value : '';

      if (query) {
        addHistoryItem(query);
      }
      closeDropdown();
      heroSearchInput.blur();

      // Filter featured job cards on page matching the keyword
      const jobCards = document.querySelectorAll('.job-card, .attractive-card');
      let matchCount = 0;

      if (query) {
        const lowerQ = query.toLowerCase();
        jobCards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(lowerQ)) {
            card.style.display = 'flex';
            matchCount++;
          } else {
            card.style.display = 'none';
          }
        });
      } else {
        jobCards.forEach(card => card.style.display = 'flex');
        matchCount = jobCards.length;
      }

      const locText = location ? ` tại ${location}` : '';
      const msg = query 
        ? `Tìm thấy ${matchCount} việc làm phù hợp cho "${query}"${locText}`
        : `Đang hiển thị tất cả việc làm${locText}`;
      showToast(msg, '🔍');

      // Scroll smoothly towards job listing section
      const targetSection = document.querySelector('.featured-jobs-section') || document.querySelector('.all-jobs-container');
      if (targetSection) {
        const navOffset = 90;
        const targetPos = targetSection.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    }

    // Input Events
    heroSearchInput.addEventListener('focus', () => {
      openDropdown();
    });

    heroSearchInput.addEventListener('click', () => {
      openDropdown();
    });

    heroSearchInput.addEventListener('input', () => {
      if (clearSearchInputBtn) {
        clearSearchInputBtn.style.display = heroSearchInput.value.trim() ? 'flex' : 'none';
      }
      if (!searchSuggestDropdown.classList.contains('is-open')) {
        openDropdown();
      }
    });

    heroSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch(heroSearchInput.value);
      } else if (e.key === 'Escape') {
        closeDropdown();
        heroSearchInput.blur();
      }
    });

    if (clearSearchInputBtn) {
      clearSearchInputBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        heroSearchInput.value = '';
        clearSearchInputBtn.style.display = 'none';
        heroSearchInput.focus();
        // Reset job filter
        const jobCards = document.querySelectorAll('.job-card, .attractive-card');
        jobCards.forEach(card => card.style.display = 'flex');
      });
    }

    if (btnHeroSearch) {
      btnHeroSearch.addEventListener('click', (e) => {
        e.preventDefault();
        executeSearch(heroSearchInput.value);
      });
    }

    if (btnClearSearchHistory) {
      btnClearSearchHistory.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearAllHistory();
      });
    }

    if (btnCloseSuggest) {
      btnCloseSuggest.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDropdown();
      });
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!heroSearchWrapper.contains(e.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Industry Pills switcher
    if (industryPillsRow) {
      const pills = industryPillsRow.querySelectorAll('.industry-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const cat = pill.getAttribute('data-category') || 'it';
          renderIndustryRoles(cat);
        });
      });
    }

    // Trending chips click
    const trendChips = document.querySelectorAll('.suggest-trend-chip');
    trendChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = chip.getAttribute('data-keyword') || chip.textContent.trim().replace(/^🔥\s*/, '');
        executeSearch(kw);
      });
    });

    // Initialize
    renderHistory();
    renderIndustryRoles('it');
  }
});

