/**
 * EasyCV - Candidate Home Page Interactions (home.js)
 * Handles:
 * - Filter pills for "Việc làm nổi bật"
 * - Dynamic tab switching for "Việc làm phù hợp"
 * - Bookmark job toggle & toast notification
 * - Follow company toggle
 * - Popular keywords click-to-search
 */

document.addEventListener('DOMContentLoaded', () => {
  // Popular industries: responsive carousel that advances one two-row page at a time.
  const industrySection = document.querySelector('.popular-keywords-section');
  const industryViewport = industrySection?.querySelector('.categories-carousel');
  const industryTrack = industryViewport?.querySelector('.categories-grid');
  const industryPrevious = industrySection?.querySelector('.industry-carousel-prev');
  const industryNext = industrySection?.querySelector('.industry-carousel-next');
  const industryStatus = industrySection?.querySelector('.industry-carousel-status');

  if (industryViewport && industryTrack && industryPrevious && industryNext && industryTrack.children.length > 1) {
    const industryCards = Array.from(industryTrack.children);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let industryColumns = 0;
    let industryPageIndex = 0;
    let resizeFrame;
    industryViewport.classList.add('is-carousel-ready');

    const getIndustryColumns = () => {
      if (window.matchMedia('(max-width: 640px)').matches) return 1;
      if (window.matchMedia('(max-width: 992px)').matches) return 2;
      return 4;
    };

    const updateIndustryPage = ({ announce = false, animate = true } = {}) => {
      const pages = Array.from(industryTrack.querySelectorAll('.categories-page'));
      if (!pages.length) return;
      industryPageIndex = Math.max(0, Math.min(industryPageIndex, pages.length - 1));
      industryTrack.style.transition = animate && !reducedMotion.matches ? 'transform 0.45s ease' : 'none';
      industryTrack.style.transform = `translateX(-${industryPageIndex * 100}%)`;

      pages.forEach((page, pageIndex) => {
        const isActive = pageIndex === industryPageIndex;
        page.setAttribute('aria-hidden', String(!isActive));
        page.querySelectorAll('.category-card').forEach((card) => {
          card.tabIndex = isActive ? 0 : -1;
        });
      });

      industryPrevious.disabled = industryPageIndex === 0;
      industryNext.disabled = industryPageIndex === pages.length - 1;

      if (!announce || !industryStatus) return;
      const visibleCards = Array.from(pages[industryPageIndex].querySelectorAll('.category-card'));
      const firstName = visibleCards[0]?.querySelector('.category-name')?.textContent?.trim();
      const lastName = visibleCards.at(-1)?.querySelector('.category-name')?.textContent?.trim();
      if (firstName && lastName) {
        industryStatus.textContent = `Trang ${industryPageIndex + 1}/${pages.length}, hiển thị ${visibleCards.length} ngành nghề, từ ${firstName} đến ${lastName}`;
      }
    };

    const buildIndustryPages = () => {
      const nextColumns = getIndustryColumns();
      if (nextColumns === industryColumns) return;
      const firstVisibleCardIndex = industryPageIndex * industryColumns * 2;
      industryColumns = nextColumns;
      const pageSize = industryColumns * 2;
      industryPageIndex = Math.floor(firstVisibleCardIndex / pageSize) || 0;
      industryTrack.replaceChildren();
      industryTrack.style.setProperty('--industry-columns', industryColumns);

      for (let index = 0; index < industryCards.length; index += pageSize) {
        const page = document.createElement('div');
        page.className = 'categories-page';
        page.setAttribute('role', 'group');
        page.setAttribute('aria-roledescription', 'trang');
        const pageCards = industryCards.slice(index, index + pageSize);
        pageCards.forEach(card => page.appendChild(card));
        industryTrack.appendChild(page);
      }

      const pages = industryTrack.querySelectorAll('.categories-page');
      pages.forEach((page, index) => page.setAttribute('aria-label', `Trang ${index + 1} trên ${pages.length}`));
      updateIndustryPage({ animate: false });
    };

    const moveIndustryPage = (direction) => {
      industryPageIndex += direction;
      updateIndustryPage({ announce: true });
    };

    industryPrevious.addEventListener('click', () => moveIndustryPage(-1));
    industryNext.addEventListener('click', () => moveIndustryPage(1));
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(buildIndustryPages);
    });
    buildIndustryPages();
  }

  // CV templates: continuous auto-scrolling carousel with style filtering (same marquee logic as featured companies).
  const cvSection = document.querySelector('.cv-template-section');
  const cvViewport = cvSection?.querySelector('.cv-template-carousel, .cv-template-viewport');
  const cvTrack = cvViewport?.querySelector('.cv-template-track');
  const cvFilters = cvSection ? Array.from(cvSection.querySelectorAll('.cv-style-filter')) : [];
  const cvPrevious = cvSection?.querySelector('.cv-carousel-prev');
  const cvNext = cvSection?.querySelector('.cv-carousel-next');
  const cvStatus = cvSection?.querySelector('.cv-carousel-status');

  if (cvSection && cvViewport && cvTrack && cvTrack.children.length > 1) {
    const originalTemplates = Array.from(cvTrack.children).map(card => card.cloneNode(true));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    let isTransitioning = false;
    let cancelActiveMove = () => {};

    const updateSlideAccessibility = () => {
      const cards = Array.from(cvTrack.children);
      const firstCard = cards[0];
      if (!firstCard) return;
      const trackGap = parseFloat(getComputedStyle(cvTrack).columnGap || getComputedStyle(cvTrack).gap) || 0;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const visibleCount = Math.max(1, Math.min(cards.length, Math.floor((cvViewport.clientWidth + trackGap) / (cardWidth + trackGap))));

      cards.forEach((card, index) => {
        const isVisible = index < visibleCount;
        card.tabIndex = isVisible ? 0 : -1;
        card.setAttribute('aria-hidden', String(!isVisible));
      });
    };

    const announceCurrentTemplate = () => {
      if (!cvStatus) return;
      const name = cvTrack.firstElementChild?.querySelector('.cv-template-name')?.textContent?.trim();
      if (name) cvStatus.textContent = `Đang hiển thị mẫu CV ${name}`;
    };

    const buildTrack = (style) => {
      cancelActiveMove();
      const filtered = originalTemplates.filter(card => {
        if (style === 'all') return true;
        const styles = (card.getAttribute('data-cv-styles') || '').split(' ');
        return styles.includes(style);
      });

      // Ensure track always has enough items (at least 8) to seamlessly fill viewport slots and marquee loop
      let items = [];
      if (filtered.length > 0) {
        while (items.length < Math.max(8, filtered.length * 2)) {
          items.push(...filtered.map(c => c.cloneNode(true)));
        }
        if (items.length > 12) items = items.slice(0, 12);
      }

      cvTrack.style.transition = 'none';
      cvTrack.style.transform = 'translateX(0)';
      cvTrack.replaceChildren(...items);
      void cvTrack.offsetWidth;
      isTransitioning = false;
      updateSlideAccessibility();
    };

    const move = (direction = 1, announce = false) => {
      if (isTransitioning || cvTrack.children.length <= 1) return;
      const firstCard = cvTrack.firstElementChild;
      const lastCard = cvTrack.lastElementChild;
      if (!firstCard || !lastCard) return;

      if (reducedMotion.matches) {
        if (direction > 0) cvTrack.appendChild(firstCard);
        else cvTrack.prepend(lastCard);
        updateSlideAccessibility();
        if (announce) announceCurrentTemplate();
        return;
      }

      const trackGap = parseFloat(getComputedStyle(cvTrack).columnGap || getComputedStyle(cvTrack).gap) || 0;
      const shiftBy = firstCard.getBoundingClientRect().width + trackGap;

      isTransitioning = true;
      if (direction < 0) {
        cvTrack.style.transition = 'none';
        cvTrack.prepend(lastCard);
        cvTrack.style.transform = `translateX(-${shiftBy}px)`;
        void cvTrack.offsetWidth;
      }

      cvTrack.style.transition = 'transform 0.6s ease';
      cvTrack.style.transform = direction > 0 ? `translateX(-${shiftBy}px)` : 'translateX(0)';

      let fallbackTimer;
      const clearMoveHandlers = () => {
        cvTrack.removeEventListener('transitionend', onTransitionEnd);
        clearTimeout(fallbackTimer);
      };
      const finishMove = () => {
        clearMoveHandlers();
        cvTrack.style.transition = 'none';
        cvTrack.style.transform = 'translateX(0)';
        if (direction > 0) cvTrack.appendChild(firstCard);
        void cvTrack.offsetWidth;
        isTransitioning = false;
        cancelActiveMove = () => {};
        updateSlideAccessibility();
        if (announce) announceCurrentTemplate();
      };
      const onTransitionEnd = (event) => {
        if (event && (event.target !== cvTrack || event.propertyName !== 'transform')) return;
        finishMove();
      };
      cancelActiveMove = () => {
        clearMoveHandlers();
        cvTrack.style.transition = 'none';
        cvTrack.style.transform = 'translateX(0)';
        isTransitioning = false;
        cancelActiveMove = () => {};
      };
      cvTrack.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishMove, 700);
    };

    const step = () => move(1);

    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      if (!document.hidden && !reducedMotion.matches && !cvSection.matches(':hover, :focus-within')) {
        timer = setInterval(step, 2000);
      }
    };

    // Filter pills event listeners
    cvFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        const style = btn.getAttribute('data-cv-style') || 'all';
        cvFilters.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });
        stop();
        buildTrack(style);
        start();
      });
    });

    cvPrevious?.addEventListener('click', () => move(-1, true));
    cvNext?.addEventListener('click', () => move(1, true));

    cvSection.addEventListener('mouseenter', stop);
    cvSection.addEventListener('mouseleave', start);
    cvSection.addEventListener('focusin', stop);
    cvSection.addEventListener('focusout', () => setTimeout(start, 0));
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);
    window.addEventListener('resize', updateSlideAccessibility);

    updateSlideAccessibility();
    start();
  }
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

  // --- 2. Job grids: maximum 12 cards (3 columns x 4 rows) per page ---
  function createJobPaginator(sectionSelector, cardSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section || section.hidden || getComputedStyle(section).display === 'none') return null;
    const grid = section.querySelector('.jobs-grid, .attractive-grid');
    if (!grid) return null;

    const cards = [...grid.querySelectorAll(cardSelector)];
    const pageSize = 12;
    let currentPage = 1;
    let filterPredicate = () => true;

    const pagination = document.createElement('nav');
    pagination.className = 'job-list-pagination';
    pagination.setAttribute('aria-label', `Phân trang ${section.querySelector('.section-title')?.textContent.trim() || 'việc làm'}`);
    pagination.innerHTML = `
      <button class="job-list-page-button job-list-page-prev" type="button" aria-label="Trang việc làm trước">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span class="job-list-page-info" aria-live="polite"></span>
      <button class="job-list-page-button job-list-page-next" type="button" aria-label="Trang việc làm tiếp theo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>`;
    grid.after(pagination);

    const previousButton = pagination.querySelector('.job-list-page-prev');
    const nextButton = pagination.querySelector('.job-list-page-next');
    const pageInfo = pagination.querySelector('.job-list-page-info');

    const render = () => {
      const filteredCards = cards.filter(filterPredicate);
      const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
      currentPage = Math.min(currentPage, totalPages);
      const firstIndex = (currentPage - 1) * pageSize;
      const visibleCards = new Set(filteredCards.slice(firstIndex, firstIndex + pageSize));

      cards.forEach(card => {
        card.hidden = !visibleCards.has(card);
        if (!card.hidden) card.style.animation = 'fadeInCard 0.3s ease forwards';
      });

      pageInfo.textContent = `Trang ${currentPage}/${totalPages}`;
      previousButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
    };

    previousButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        render();
      }
    });
    nextButton.addEventListener('click', () => {
      const totalPages = Math.max(1, Math.ceil(cards.filter(filterPredicate).length / pageSize));
      if (currentPage < totalPages) {
        currentPage += 1;
        render();
      }
    });

    render();
    return {
      setFilter(predicate) {
        filterPredicate = predicate;
        currentPage = 1;
        render();
      }
    };
  }

    createJobPaginator('.attractive-jobs-section', '.attractive-card');
  const matchingPaginator = createJobPaginator('.matching-jobs-section', '.job-card');

  // Featured companies: continuous auto-scrolling carousel with bidirectional manual controls.
  const companiesSection = document.querySelector('.top-companies-section');
  const companiesViewport = companiesSection?.querySelector('.companies-carousel');
  const companiesTrack = companiesViewport?.querySelector('.companies-track');
  const companiesPrevious = companiesSection?.querySelector('.companies-carousel-prev');
  const companiesNext = companiesSection?.querySelector('.companies-carousel-next');
  const companiesStatus = companiesSection?.querySelector('.companies-carousel-status');

  if (companiesSection && companiesViewport && companiesTrack && companiesTrack.children.length > 1) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    let isTransitioning = false;
    let cancelActiveMove = () => {};

    const updateSlideAccessibility = () => {
      const cards = Array.from(companiesTrack.children);
      const firstCard = cards[0];
      if (!firstCard) return;
      const trackGap = parseFloat(getComputedStyle(companiesTrack).columnGap || getComputedStyle(companiesTrack).gap) || 0;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const visibleCount = Math.max(1, Math.min(cards.length, Math.floor((companiesViewport.clientWidth + trackGap) / (cardWidth + trackGap))));

      cards.forEach((card, index) => {
        const isVisible = index < visibleCount;
        card.tabIndex = isVisible ? 0 : -1;
        card.setAttribute('aria-hidden', String(!isVisible));
        const interactiveElements = card.querySelectorAll('a, button');
        interactiveElements.forEach(el => {
          el.tabIndex = isVisible ? 0 : -1;
        });
      });
    };

    const announceCurrentCompany = () => {
      if (!companiesStatus) return;
      const name = companiesTrack.firstElementChild?.querySelector('.company-card-title')?.textContent?.trim();
      if (name) companiesStatus.textContent = `Đang hiển thị ${name}`;
    };

    const move = (direction = 1, announce = false) => {
      if (isTransitioning || companiesTrack.children.length <= 1) return;
      const firstCard = companiesTrack.firstElementChild;
      const lastCard = companiesTrack.lastElementChild;
      if (!firstCard || !lastCard) return;

      if (reducedMotion.matches) {
        if (direction > 0) companiesTrack.appendChild(firstCard);
        else companiesTrack.prepend(lastCard);
        updateSlideAccessibility();
        if (announce) announceCurrentCompany();
        return;
      }

      const trackGap = parseFloat(getComputedStyle(companiesTrack).columnGap || getComputedStyle(companiesTrack).gap) || 0;
      const targetCard = direction > 0 ? firstCard : lastCard;
      const shiftBy = targetCard.getBoundingClientRect().width + trackGap;

      isTransitioning = true;
      if (direction < 0) {
        companiesTrack.style.transition = 'none';
        companiesTrack.prepend(lastCard);
        companiesTrack.style.transform = `translateX(-${shiftBy}px)`;
        void companiesTrack.offsetWidth;
      }

      companiesTrack.style.transition = 'transform 0.6s ease';
      companiesTrack.style.transform = direction > 0 ? `translateX(-${shiftBy}px)` : 'translateX(0)';

      let fallbackTimer;
      const clearMoveHandlers = () => {
        companiesTrack.removeEventListener('transitionend', onTransitionEnd);
        clearTimeout(fallbackTimer);
      };
      const finishMove = () => {
        clearMoveHandlers();
        companiesTrack.style.transition = 'none';
        companiesTrack.style.transform = 'translateX(0)';
        if (direction > 0) companiesTrack.appendChild(firstCard);
        void companiesTrack.offsetWidth;
        isTransitioning = false;
        cancelActiveMove = () => {};
        updateSlideAccessibility();
        if (announce) announceCurrentCompany();
      };
      const onTransitionEnd = (event) => {
        if (event && (event.target !== companiesTrack || event.propertyName !== 'transform')) return;
        finishMove();
      };
      cancelActiveMove = () => {
        clearMoveHandlers();
        companiesTrack.style.transition = 'none';
        companiesTrack.style.transform = 'translateX(0)';
        isTransitioning = false;
        cancelActiveMove = () => {};
      };
      companiesTrack.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishMove, 700);
    };

    const step = () => move(1);

    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      if (!document.hidden && !reducedMotion.matches && !companiesSection.matches(':hover, :focus-within')) {
        timer = setInterval(step, 2000);
      }
    };

    companiesPrevious?.addEventListener('click', () => {
      stop();
      move(-1, true);
      start();
    });
    companiesNext?.addEventListener('click', () => {
      stop();
      move(1, true);
      start();
    });

    companiesSection.addEventListener('mouseenter', stop);
    companiesSection.addEventListener('mouseleave', start);
    companiesSection.addEventListener('focusin', stop);
    companiesSection.addEventListener('focusout', () => setTimeout(start, 0));
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);
    window.addEventListener('resize', updateSlideAccessibility);

    updateSlideAccessibility();
    start();
  }

    // --- 4. Dynamic Tabs for "Việc làm phù hợp" (AI Recommendations) ---
  const matchingTabBtns = document.querySelectorAll('.matching-tab-btn');

  matchingTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      matchingTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabFilter = tab.getAttribute('data-tab') || 'all';
      matchingPaginator?.setFilter(card => {
        const tagType = card.getAttribute('data-match-type') || '';
        return tabFilter === 'all' || tagType.split(' ').includes(tabFilter);
      });
    });
  });

  // --- 5. Bookmark Job Toggle ---
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

  // --- 5. Favorite Company Toggle ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-favorite-company');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const isActive = btn.classList.toggle('active');
    const companyCard = btn.closest('.company-card');
    const companyName = companyCard?.querySelector('.company-card-title')?.textContent?.trim() || 'doanh nghiệp';

    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    if (isActive) {
      showToast(`Đã thêm ${companyName} vào danh sách yêu thích!`, '♥');
    } else {
      showToast(`Đã bỏ ${companyName} khỏi danh sách yêu thích.`, '✕');
    }
  });

  // --- 6. Quick Keyword Click-to-Search (Mở tab mới với dữ liệu job được điền sẵn) ---
  const quickTagLinks = document.querySelectorAll('.quick-tag-link, .keyword-badge-link');
  quickTagLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const keywordText = link.getAttribute('data-keyword') || link.textContent.trim().replace(/^🔥\s*/, '').replace(/\s*\d+.*$/, '');
      if (keywordText) {
        window.open(`viec-lam.html?keyword=${encodeURIComponent(keywordText)}`, '_blank');
      }
    });
  });


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
  const industryNavList = document.getElementById('industryNavList');
  const industryPageInfo = document.getElementById('industryPageInfo');
  const btnIndustryPrevPage = document.getElementById('btnIndustryPrevPage');
  const btnIndustryNextPage = document.getElementById('btnIndustryNextPage');
  const industryMegaContent = document.getElementById('industryMegaContent');
  const industryFilterTrigger = document.getElementById('industryFilterTrigger');
  const industryFilterLabel = document.getElementById('industryFilterLabel');
  const industryFilterSearch = document.getElementById('industryFilterSearch');
  const industryPickerClose = document.getElementById('industryPickerClose');
  const industryFilterClear = document.getElementById('industryFilterClear');
  const industryFilterCancel = document.getElementById('industryFilterCancel');
  const industryFilterApply = document.getElementById('industryFilterApply');
  const industryPickerStatus = document.getElementById('industryPickerStatus');

  if (heroSearchWrapper && heroSearchInput && searchSuggestDropdown) {
    heroSearchInput.setAttribute('aria-haspopup', 'dialog');
    heroSearchInput.setAttribute('aria-controls', 'searchSuggestDropdown');
    heroSearchInput.setAttribute('aria-expanded', 'false');
    searchSuggestDropdown.setAttribute('role', 'dialog');
    searchSuggestDropdown.setAttribute('aria-label', 'Gợi ý tìm kiếm việc làm');

    const legacyRecentSection = searchSuggestDropdown.querySelector('.suggest-recent-section');
    if (legacyRecentSection) {
      legacyRecentSection.remove();
    }

    const compactSearchPanel = document.createElement('div');
    compactSearchPanel.className = 'search-format-panel';
    compactSearchPanel.innerHTML = `
      <section class="search-format-left" aria-label="Lịch sử và từ khóa gợi ý">
        <!-- Chế độ mặc định: Lịch sử tìm kiếm gần đây -->
        <div class="suggest-section suggest-recent-section" id="suggestRecentSection">
          <div class="suggest-section-header">
            <h3 class="suggest-title" id="searchSuggestHeaderTitle">Từ khóa tìm kiếm gần đây</h3>
            <button type="button" class="btn-clear-history" id="btnClearSearchHistory">Xóa tất cả</button>
          </div>
          <div class="recent-chips-list" id="recentSearchList"></div>
        </div>

        <!-- Chế độ gõ phím: Từ khóa gợi ý -->
        <div class="keyword-suggestions-section" id="keywordSuggestionsSection" style="display: none;">
          <div class="suggest-section-header">
            <h3 class="suggest-title">Từ khóa gợi ý</h3>
          </div>
          <div class="keyword-suggestions-list" id="keywordSuggestionsList"></div>
        </div>

        <!-- Từ khóa phổ biến -->
        <div class="popular-keywords" id="popularKeywordsWrap">
          <h3>Từ khóa phổ biến</h3>
          <div class="popular-keyword-list">
            ${['Telesales', 'Kinh doanh', 'Java Spring', 'Marketing', 'Kế toán'].map(keyword => `
              <button type="button" class="suggest-trend-chip" data-keyword="${keyword}">${keyword}</button>
            `).join('')}
          </div>
        </div>
      </section>
      <section class="recommended-jobs" aria-labelledby="recommendedJobsTitle">
        <h3 id="recommendedJobsTitle">Việc làm có thể bạn quan tâm</h3>
        <div class="recommended-job-list" id="recommendedJobList"></div>
      </section>`;
    searchSuggestDropdown.prepend(compactSearchPanel);

    const searchFormatLeft = compactSearchPanel.querySelector('.search-format-left');
    const suggestRecentSection = compactSearchPanel.querySelector('#suggestRecentSection');
    const keywordSuggestionsSection = compactSearchPanel.querySelector('#keywordSuggestionsSection');
    const keywordSuggestionsList = compactSearchPanel.querySelector('#keywordSuggestionsList');
    const popularKeywordsWrap = compactSearchPanel.querySelector('#popularKeywordsWrap');
    const recentListEl = compactSearchPanel.querySelector('#recentSearchList');
    const clearHistoryBtn = compactSearchPanel.querySelector('#btnClearSearchHistory');
    const recommendedJobListEl = compactSearchPanel.querySelector('#recommendedJobList');

    const RECOMMENDED_JOBS_POOL = [
      // 1. Sales & Kinh doanh
      {
        id: 1,
        logo: 'assets/logos/company-vikimco-64.svg',
        title: 'Giám Đốc Kinh Doanh Vikimco Toàn Quốc',
        company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO',
        salary: '$1,000–1,500 / tháng',
        location: 'Hà Nội & Toàn quốc',
        category: 'sales',
        skills: ['Sales', 'Kinh doanh', 'B2B', 'Quản lý'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 96
      },
      {
        id: 2,
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Khách Hàng Doanh Nghiệp (RM)',
        company: 'Ngân hàng Techcombank',
        salary: '20 - 35 triệu',
        location: 'Hà Nội',
        category: 'sales',
        skills: ['Sales B2B', 'Quan hệ khách hàng', 'Tài chính'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 94
      },
      {
        id: 3,
        logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Trưởng Phòng Kinh Doanh (B2B Sales Lead)',
        company: 'Tập đoàn Mai Linh',
        salary: '25 - 40 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'sales',
        skills: ['Sales B2B', 'Kinh doanh', 'Quản lý đội ngũ'],
        isPartner: true,
        postedDaysAgo: 3,
        interactionScore: 88
      },
      {
        id: 4,
        logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Telesales Chuyên Nghiệp (Kinh Doanh & CSKH)',
        company: 'Công ty Cổ phần VNPAY',
        salary: '12 - 22 triệu',
        location: 'Hà Nội',
        category: 'sales',
        skills: ['Telesales', 'Bán hàng', 'Tư vấn', 'Sales'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 92
      },
      {
        id: 5,
        logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Sales Logistics & Cước Vận Tải Quốc Tế',
        company: 'Bee Logistics Corporation',
        salary: '15 - 30 triệu',
        location: 'Hải Phòng & TP. HCM',
        category: 'sales',
        skills: ['Sales Logistics', 'Xuất nhập khẩu', 'Cước tàu', 'Sales'],
        isPartner: false,
        postedDaysAgo: 2,
        interactionScore: 85
      },
      {
        id: 6,
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Kinh Doanh Bất Động Sản',
        company: 'Tập đoàn Đất Xanh',
        salary: '15 - 50 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'sales',
        skills: ['Sales BĐS', 'Bán hàng', 'Môi giới', 'Sales'],
        isPartner: true,
        postedDaysAgo: 4,
        interactionScore: 82
      },

      // 2. Kế toán & Tài chính
      {
        id: 7,
        logo: 'assets/logos/company-mua-he-64.png',
        title: 'Kế Toán Tổng Hợp (Mảng Giải Trí)',
        company: 'CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ',
        salary: '20 - 25 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'finance',
        skills: ['Kế toán', 'Báo cáo thuế', 'Tài chính'],
        isPartner: false,
        postedDaysAgo: 2,
        interactionScore: 86
      },
      {
        id: 8,
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Kế Toán Trưởng Doanh Nghiệp (Chief Accountant)',
        company: 'Samsung Electronics HCMC',
        salary: '35 - 50 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'finance',
        skills: ['Kế toán trưởng', 'Kiểm toán', 'Thuế'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 97
      },
      {
        id: 9,
        logo: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Phân Tích Tài Chính & Đầu Tư',
        company: 'Công ty Chứng khoán SSI',
        salary: '25 - 40 triệu',
        location: 'Hà Nội',
        category: 'finance',
        skills: ['Phân tích tài chính', 'Đầu tư', 'Chứng khoán'],
        isPartner: true,
        postedDaysAgo: 3,
        interactionScore: 90
      },

      // 3. Công nghệ Thông tin (IT)
      {
        id: 10,
        logo: 'assets/logos/company-fpt-64.svg',
        title: 'Senior IT Infrastructure Officer',
        company: 'TẬP ĐOÀN CÔNG NGHỆ FPT',
        salary: 'Thương lượng',
        location: 'Hà Nội & Đà Nẵng',
        category: 'it',
        skills: ['IT', 'Infrastructure', 'Hạ tầng mạng', 'DevOps'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 98
      },
      {
        id: 11,
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Senior Fullstack Developer (ReactJS / Node.js)',
        company: 'FPT Software',
        salary: '28 - 45 triệu',
        location: 'Đà Nẵng & Hà Nội',
        category: 'it',
        skills: ['ReactJS', 'Node.js', 'TypeScript', 'Frontend', 'Backend'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 95
      },
      {
        id: 12,
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Senior Product Designer (UI/UX App/Web)',
        company: 'VNG Corporation (Zalo Team)',
        salary: '30 - 50 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'it',
        skills: ['UI/UX', 'Figma', 'Product Design', 'Web Design'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 93
      },
      {
        id: 13,
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Data Analyst / Chuyên Viên Phân Tích Dữ Liệu',
        company: 'Shopee Vietnam',
        salary: '22 - 35 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'it',
        skills: ['Data Analyst', 'SQL', 'Python', 'PowerBI'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 91
      },
      {
        id: 14,
        logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Backend Java Developer (Spring Boot / Microservices)',
        company: 'Tập đoàn Công nghiệp Viettel',
        salary: '25 - 42 triệu',
        location: 'Hà Nội',
        category: 'it',
        skills: ['Java', 'Spring Boot', 'Backend', 'Microservices'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 96
      },

      // 4. Marketing & Truyền thông
      {
        id: 15,
        logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Trưởng Phòng Marketing & Truyền Thông',
        company: 'Masan Consumer Holdings',
        salary: '35 - 55 triệu',
        location: 'Bình Dương & TP. HCM',
        category: 'marketing',
        skills: ['Marketing', 'Brand', 'Chiến lược', 'Quản lý'],
        isPartner: true,
        postedDaysAgo: 1,
        interactionScore: 92
      },
      {
        id: 16,
        logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Digital Marketing & Performance Ads Lead',
        company: 'VinFast Auto',
        salary: '25 - 40 triệu',
        location: 'Hải Phòng & Hà Nội',
        category: 'marketing',
        skills: ['Digital Marketing', 'Facebook Ads', 'Google Ads', 'SEO'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 89
      },
      {
        id: 17,
        logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Content Marketing Lead & Sáng Tạo Nội Dung',
        company: 'VCCorp Corporation',
        salary: '18 - 28 triệu',
        location: 'Hà Nội',
        category: 'marketing',
        skills: ['Content Marketing', 'Copywriting', 'Social Media'],
        isPartner: false,
        postedDaysAgo: 3,
        interactionScore: 84
      },

      // 5. Ngành nghề khác (F&B, Kỹ thuật, Vận hành)
      {
        id: 18,
        logo: 'assets/logos/company-kimmari-64.svg',
        title: 'Quản Lý Nhà Hàng Kimmari Chicken',
        company: 'CHUỖI NHÀ HÀNG KIMMARI CHICKEN',
        salary: '15–25tr ₫/tháng',
        location: 'TP. Hồ Chí Minh',
        category: 'hospitality',
        skills: ['Quản lý', 'Nhà hàng', 'F&B', 'Dịch vụ'],
        isPartner: false,
        postedDaysAgo: 2,
        interactionScore: 81
      },
      {
        id: 19,
        logo: 'assets/logos/company-tanviet-64.svg',
        title: 'Technical Service Engineer – Industrial Printer',
        company: 'CÔNG TY TNHH THIẾT BỊ CÔNG NGHIỆP TÂN VIỆT',
        salary: 'Thương lượng',
        location: 'Bình Dương',
        category: 'eng',
        skills: ['Kỹ thuật', 'Bảo trì', 'Cơ điện'],
        isPartner: false,
        postedDaysAgo: 4,
        interactionScore: 78
      },
      {
        id: 20,
        logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
        title: 'Chuyên Viên Tuyển Dụng & Đào Tạo (HR Specialist)',
        company: 'Vinamilk Corporation',
        salary: '18 - 26 triệu',
        location: 'TP. Hồ Chí Minh',
        category: 'hr',
        skills: ['Tuyển dụng', 'HR', 'Nhân sự', 'Đào tạo'],
        isPartner: true,
        postedDaysAgo: 2,
        interactionScore: 87
      }
    ];

    function extractIndustryKeywords(query) {
      const normQ = normalizeIndustryText(query || '');
      if (!normQ) return [];
      const keywordsSet = new Set();
      const taxData = window.EasyCVCategoryData || [];

      taxData.forEach(cat => {
        const catNameNorm = normalizeIndustryText(cat.name || '');
        const popMatches = (cat.popularKeywords || []).filter(pk => normalizeIndustryText(pk).includes(normQ));

        if (catNameNorm.includes(normQ) || popMatches.length > 0) {
          keywordsSet.add(cat.name);
          (cat.popularKeywords || []).forEach(pk => keywordsSet.add(pk));
          (cat.subgroups || []).forEach(sg => {
            (sg.roles || []).slice(0, 3).forEach(r => keywordsSet.add(r));
          });
        } else {
          (cat.subgroups || []).forEach(sg => {
            const titleMatch = normalizeIndustryText(sg.title || '').includes(normQ);
            const roleMatches = (sg.roles || []).filter(r => normalizeIndustryText(r).includes(normQ));
            if (titleMatch || roleMatches.length > 0) {
              keywordsSet.add(cat.name);
              keywordsSet.add(sg.title);
              roleMatches.forEach(r => keywordsSet.add(r));
            }
          });
        }
      });

      return Array.from(keywordsSet);
    }

    function renderRecommendedJobs(query = '', container = recommendedJobListEl) {
      if (!container) return;
      const clean = normalizeIndustryText(query || '');
      const isTyping = clean.length >= 2;

      let jobsToDisplay = [];

      if (!isTyping) {
        // 1. Khi người dùng chưa nhập gì trong box tìm kiếm:
        // Đề xuất 5 thẻ job dựa vào hành vi search, xem/lưu job, dữ liệu CV và tín hiệu job
        let recentKws = [];
        try {
          recentKws = getHistory().map(item => normalizeIndustryText(typeof item === 'string' ? item : item.keyword));
        } catch (e) {}

        let savedJobIds = [];
        try {
          const rawSaved = localStorage.getItem('easycv_saved_jobs') || '[]';
          savedJobIds = JSON.parse(rawSaved);
        } catch (e) {}

        const scoredJobs = RECOMMENDED_JOBS_POOL.map(job => {
          let score = 50; // base score
          const jobTextNorm = normalizeIndustryText(`${job.title} ${job.company} ${job.category || ''} ${(job.skills || []).join(' ')}`);

          // Khớp hành vi search gần đây (+35 điểm)
          const matchedRecent = recentKws.some(kw => kw && jobTextNorm.includes(kw));
          if (matchedRecent) score += 35;

          // Khớp việc làm đã lưu hoặc đã xem (+30 điểm)
          if (Array.isArray(savedJobIds) && (savedJobIds.includes(job.id) || savedJobIds.includes(String(job.id)))) {
            score += 30;
          }

          // Dữ liệu hồ sơ/CV ứng viên (+25 điểm cho ngành trọng điểm)
          if (['sales', 'it', 'marketing', 'finance'].includes(job.category)) {
            score += 25;
          }

          // Tín hiệu job: uy tín NTD (+20 điểm)
          if (job.isPartner) score += 20;

          // Tín hiệu job: mới đăng (+15 điểm)
          if (job.postedDaysAgo && job.postedDaysAgo <= 2) score += 15;

          // Độ tương tác (+ điểm theo interactionScore)
          if (job.interactionScore) score += Math.round(job.interactionScore / 10);

          return { ...job, totalScore: score };
        });

        scoredJobs.sort((a, b) => b.totalScore - a.totalScore);
        jobsToDisplay = scoredJobs.slice(0, 5);
      } else {
        // 2. Khi người dùng đã bắt đầu nhập vào box tìm kiếm (từ ký tự thứ 2):
        // Đề xuất dựa vào từ khóa nhập và truy xuất vào dữ liệu ngành nghề có sẵn trong hệ thống
        const industryKeywords = extractIndustryKeywords(clean).map(kw => normalizeIndustryText(kw));

        const scoredJobs = RECOMMENDED_JOBS_POOL.map(job => {
          let score = 0;
          const titleNorm = normalizeIndustryText(job.title);
          const companyNorm = normalizeIndustryText(job.company);
          const catNorm = normalizeIndustryText(job.category || '');
          const skillsNorm = normalizeIndustryText((job.skills || []).join(' '));
          const fullJobText = `${titleNorm} ${companyNorm} ${catNorm} ${skillsNorm}`;

          // 1. Khớp trực tiếp title (+60 điểm)
          if (titleNorm.includes(clean)) score += 60;

          // 2. Khớp kỹ năng trực tiếp (+45 điểm)
          if (skillsNorm.includes(clean)) score += 45;

          // 3. Khớp từ khóa ngành nghề từ taxonomy hệ thống (+35 điểm)
          const matchedTaxonomy = industryKeywords.some(ikw => ikw && fullJobText.includes(ikw));
          if (matchedTaxonomy) score += 35;

          // 4. Khớp Category (+25 điểm)
          if (catNorm.includes(clean)) score += 25;

          // 5. Khớp Company (+15 điểm)
          if (companyNorm.includes(clean)) score += 15;

          // 6. Partial match từng từ (+10 điểm)
          const words = clean.split(/\s+/).filter(w => w.length > 1);
          const wordMatchCount = words.filter(w => fullJobText.includes(w)).length;
          score += wordMatchCount * 10;

          // Tín hiệu đối tác uy tín
          if (score > 0 && job.isPartner) score += 10;

          return { ...job, totalScore: score };
        });

        const matched = scoredJobs.filter(j => j.totalScore > 0);
        if (matched.length > 0) {
          matched.sort((a, b) => b.totalScore - a.totalScore);
          jobsToDisplay = matched.slice(0, 5);
        } else {
          // Fallback sang top 5 job tốt nhất
          jobsToDisplay = RECOMMENDED_JOBS_POOL.slice(0, 5);
        }
      }

      container.innerHTML = jobsToDisplay.map(job => `
        <button type="button" class="recommended-job" data-keyword="${escapeHtml(job.title)}" aria-label="Tìm ${escapeHtml(job.title)}, công ty ${escapeHtml(job.company)}, mức lương ${escapeHtml(job.salary)}, địa điểm ${escapeHtml(job.location || 'Toàn quốc')}">
          <span class="recommended-job-logo" aria-hidden="true" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
            <img src="${escapeHtml(job.logo)}" alt="${escapeHtml(job.company)}" width="50" height="50" loading="lazy" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
          </span>
          <div class="recommended-job-info">
            <span class="recommended-job-title">${highlightMatch(job.title, query)}</span>
            <span class="recommended-job-company">${escapeHtml(job.company)}</span>
            <div class="recommended-job-meta">
              <span class="recommended-job-salary">${escapeHtml(job.salary)}</span>
              <span class="recommended-job-loc" title="${escapeHtml(job.location || 'Toàn quốc')}">📍 ${escapeHtml(job.location || 'Toàn quốc')}</span>
            </div>
          </div>
        </button>
      `).join('');

      container.querySelectorAll('.recommended-job').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const kw = btn.getAttribute('data-keyword') || '';
          executeSearch(kw);
        });
      });
    }

    renderRecommendedJobs('', recommendedJobListEl);

    compactSearchPanel.querySelectorAll('.suggest-trend-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || btn.textContent.trim();
        executeSearch(kw);
      });
    });

    compactSearchPanel.querySelectorAll('.recommended-job').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || '';
        executeSearch(kw);
      });
    });

    const STORAGE_KEY = 'easycv_recent_searches_v2';
    const DEFAULT_HISTORY = [
      { keyword: 'ReactJS Developer', count: 156 },
      { keyword: 'Telesales', count: 280 },
      { keyword: 'Marketing Leader', count: 92 },
      { keyword: 'UI/UX Designer', count: 143 },
      { keyword: 'Java Spring Boot', count: 67 },
      { keyword: 'Kế toán tổng hợp', count: 184 }
    ];

    // Dữ liệu 5 trang Danh mục ngành nghề (mỗi trang 6 ngành) chuẩn Mega-Menu TopCV
    const INDUSTRY_PAGES = [
      // TRANG 1: Trọng tâm (theo ảnh mẫu người dùng cung cấp)
      [
        {
          key: 'sales',
          name: 'Kinh doanh/Bán hàng',
          hotSearches: [
            'Nhân viên kinh doanh', 'Nhân viên bán hàng', 'Nhân viên tư vấn',
            'Telesales', 'Sales Admin', 'Tư vấn tuyển sinh', 'Sales Online'
          ],
          subgroups: [
            {
              title: 'Sales Xuất nhập khẩu/Logistics',
              roles: ['Sales Logistics', 'Kinh doanh chuyển phát nhanh', 'Sales Xuất nhập khẩu/Logistics khác']
            },
            {
              title: 'Sales Bất động sản',
              roles: ['Sales bất động sản/Môi giới bất động sản', 'Sales Bất động sản khác']
            },
            {
              title: 'Sales Xây dựng',
              roles: ['Kinh doanh thiết bị/vật liệu xây dựng', 'Kinh doanh nội thất']
            },
            {
              title: 'Sales Kỹ thuật & Công nghệ',
              roles: ['Sales Phần mềm B2B (SaaS)', 'Kinh doanh thiết bị IT', 'Chuyên viên giải pháp doanh nghiệp']
            },
            {
              title: 'Sales Bán lẻ & Chuỗi phân phối',
              roles: ['Giám sát bán hàng (Supervisor)', 'Quản lý cửa hàng', 'Trình dược viên ETC/OTC']
            }
          ]
        },
        {
          key: 'marketing',
          name: 'Marketing/PR/Quảng cáo',
          hotSearches: [
            'Digital Marketing', 'Content Creator', 'SEO Specialist',
            'Performance Ads', 'Brand Manager', 'Social Media Lead'
          ],
          subgroups: [
            {
              title: 'Truyền thông & Sáng tạo nội dung',
              roles: ['Copywriter / Content Lead', 'Social Media Executive', 'Biên kịch Video / TikTok', 'PR & Báo chí']
            },
            {
              title: 'Chạy Quảng cáo & Tăng trưởng',
              roles: ['Chuyên viên Google Ads', 'Facebook & TikTok Ads', 'Performance Marketing', 'Growth Hacker']
            },
            {
              title: 'Thương hiệu & Sự kiện',
              roles: ['Brand Marketing Specialist', 'Trade Marketing Executive', 'Tổ chức sự kiện (Event Officer)']
            }
          ]
        },
        {
          key: 'cskh',
          name: 'Chăm sóc khách hàng (Customer Service)',
          hotSearches: [
            'Chuyên viên CSKH', 'Nhân viên Call Center', 'Trực chat hỗ trợ',
            'Chăm sóc khách hàng VIP', 'Hỗ trợ kỹ thuật Helpdesk'
          ],
          subgroups: [
            {
              title: 'Vận hành & Hỗ trợ CSKH',
              roles: ['Chuyên viên tư vấn & CSKH', 'Xử lý khiếu nại khách hàng', 'Điều phối dịch vụ khách hàng']
            },
            {
              title: 'CSKH Doanh nghiệp & VIP',
              roles: ['Quản lý tài khoản khách hàng (AM)', 'CSKH khách hàng Doanh nghiệp (B2B)', 'Chăm sóc hội viên VIP']
            }
          ]
        },
        {
          key: 'hr',
          name: 'Nhân sự/Hành chính/Pháp chế',
          hotSearches: [
            'Tuyển dụng (Recruiter / TA)', 'HR Generalist', 'C&B Specialist',
            'Hành chính văn phòng', 'Pháp chế doanh nghiệp'
          ],
          subgroups: [
            {
              title: 'Tuyển dụng & Quản trị nhân tài',
              roles: ['Talent Acquisition Specialist', 'Headhunter', 'HR Business Partner (HRBP)', 'Chuyên viên Đào tạo (L&D)']
            },
            {
              title: 'Vận hành nhân sự & Đãi ngộ',
              roles: ['Chuyên viên Tiền lương & Phúc lợi (C&B)', 'Quản lý hợp đồng & Hồ sơ nhân sự', 'Chuyên viên Quan hệ lao động']
            },
            {
              title: 'Hành chính & Pháp lý',
              roles: ['Hành chính nhân sự tổng hợp', 'Pháp chế hợp đồng', 'Văn thư - Lưu trữ']
            }
          ]
        },
        {
          key: 'it',
          name: 'Công nghệ Thông tin',
          hotSearches: [
            'Frontend ReactJS', 'Backend Java / Spring', 'Node.js Developer',
            'AI & Prompt Engineer', 'DevOps / Cloud', 'Mobile Flutter / iOS', 'Data Analyst'
          ],
          subgroups: [
            {
              title: 'Lập trình Phần mềm & Web',
              roles: ['Frontend Developer (Vue/React)', 'Backend Developer (Java/Node/.NET)', 'Fullstack Developer', 'Mobile Developer (iOS/Android)']
            },
            {
              title: 'Dữ liệu & Trí tuệ nhân tạo (AI)',
              roles: ['Data Analyst', 'Data Engineer', 'Machine Learning Engineer', 'Prompt Engineer']
            },
            {
              title: 'Hạ tầng, Đám mây & Bảo mật',
              roles: ['DevOps / SRE', 'Cloud AWS/Azure Solutions', 'System & Network Admin', 'Cyber Security Specialist']
            },
            {
              title: 'Quản lý dự án & Kiểm thử',
              roles: ['QA/QC Automation Tester', 'Product Owner (PO)', 'Business Analyst (BA)', 'Scrum Master / PM']
            }
          ]
        },
        {
          key: 'worker',
          name: 'Lao động phổ thông',
          hotSearches: [
            'Công nhân may mặc', 'Nhân viên phụ kho', 'Tài xế giao hàng (Shipper)',
            'Thợ cơ khí hàn tiện', 'Bảo vệ tòa nhà'
          ],
          subgroups: [
            {
              title: 'Sản xuất, Gia công & May mặc',
              roles: ['Công nhân lắp ráp điện tử', 'Thợ may công nghiệp', 'Công nhân chế biến thực phẩm', 'Kiểm tra chất lượng (KCS)']
            },
            {
              title: 'Kho bãi & Vận tải phổ thông',
              roles: ['Nhân viên đóng gói & phụ kho', 'Tài xế xe tải / xe nâng', 'Giao hàng nhanh', 'Bốc xếp hàng hóa']
            }
          ]
        }
      ],
      // TRANG 2
      [
        {
          key: 'finance',
          name: 'Tài chính / Ngân hàng / Bảo hiểm',
          hotSearches: ['Kế toán tổng hợp', 'Chuyên viên Tín dụng', 'Kiểm toán viên', 'Phân tích tài chính', 'Giao dịch viên Ngân hàng'],
          subgroups: [
            { title: 'Kế toán & Kiểm toán', roles: ['Kế toán thuế', 'Kế toán trưởng', 'Kiểm toán viên độc lập', 'Kế toán kho'] },
            { title: 'Ngân hàng & Đầu tư', roles: ['Quan hệ khách hàng doanh nghiệp (RM)', 'Tư vấn tín dụng cá nhân', 'Phân tích đầu tư chứng khoán', 'Giao dịch viên'] }
          ]
        },
        {
          key: 'eng',
          name: 'Kỹ thuật / Cơ điện / Chế tạo',
          hotSearches: ['Kỹ sư Cơ khí', 'Kỹ sư Điện - Tự động hóa', 'Kỹ sư Xây dựng', 'QA/QC Engineer', 'Kỹ thuật viên Vận hành'],
          subgroups: [
            { title: 'Cơ khí & Tự động hóa', roles: ['Thiết kế cơ khí (SolidWorks/AutoCAD)', 'Lập trình PLC & Tự động hóa', 'Bảo trì máy công nghiệp'] },
            { title: 'Điện - Điện tử & Công trình', roles: ['Kỹ sư điện M&E', 'Giám sát thi công xây dựng', 'Kỹ sư trắc địa / dự toán'] }
          ]
        },
        {
          key: 'logistics',
          name: 'Vận tải / Kho vận / Logistics',
          hotSearches: ['Nhân viên Xuất nhập khẩu', 'Quản lý kho vận (Warehouse)', 'Thu mua (Purchasing)', 'Điều phối vận tải', 'Customs Specialist'],
          subgroups: [
            { title: 'Xuất nhập khẩu & Hải quan', roles: ['Nhân viên chứng từ XNK', 'Khai báo hải quan điện tử', 'Thu mua quốc tế (Sourcing)'] },
            { title: 'Quản trị chuỗi cung ứng & Kho', roles: ['Supply Chain Specialist', 'Quản lý kho bãi 3PL', 'Điều phối đội xe container'] }
          ]
        },
        {
          key: 'design',
          name: 'Thiết kế / Sáng tạo / Nghệ thuật',
          hotSearches: ['Senior UI/UX Designer', 'Graphic Designer', '3D / Motion Artist', 'Product Designer', 'Brand Visual Designer'],
          subgroups: [
            { title: 'Thiết kế Đồ họa & Thương hiệu', roles: ['Graphic Designer 2D', 'Nhận diện thương hiệu', 'Thiết kế bao bì / ấn phẩm'] },
            { title: 'UI/UX & Mỹ thuật số', roles: ['UI/UX App/Web Designer', '3D Generalist', 'Motion Designer / Animator'] }
          ]
        },
        {
          key: 'realestate',
          name: 'Bất động sản / Địa ốc',
          hotSearches: ['Môi giới căn hộ cao cấp', 'Chuyên viên đất nền', 'Quản lý tòa nhà', 'Thẩm định giá bất động sản'],
          subgroups: [
            { title: 'Kinh doanh & Phân phối BĐS', roles: ['Chuyên viên BĐS thương mại', 'Môi giới dự án', 'Tư vấn đầu tư BĐS'] },
            { title: 'Vận hành & Phát triển dự án', roles: ['Ban quản lý tòa nhà', 'Phát triển quỹ đất', 'Thẩm định dự án'] }
          ]
        },
        {
          key: 'hospitality',
          name: 'Du lịch / Nhà hàng / Khách sạn',
          hotSearches: ['Lễ tân khách sạn', 'Bếp trưởng / Bếp phó', 'Quản lý nhà hàng', 'Hướng dẫn viên du lịch', 'Bartender / Pha chế'],
          subgroups: [
            { title: 'Khách sạn & Nghỉ dưỡng', roles: ['Lễ tân ca đêm', 'Housekeeping', 'Sales Khách sạn / OTA'] },
            { title: 'Ẩm thực (F&B)', roles: ['Đầu bếp Á/Âu', 'Phục vụ bàn chuyên nghiệp', 'Giám sát ca F&B'] }
          ]
        }
      ],
      // TRANG 3
      [
        {
          key: 'healthcare',
          name: 'Y tế / Dược phẩm / Sức khỏe',
          hotSearches: ['Dược sĩ đại học', 'Điều dưỡng viên', 'Trình dược viên', 'Bác sĩ đa khoa', 'Kỹ thuật viên xét nghiệm'],
          subgroups: [
            { title: 'Dược & Thiết bị y tế', roles: ['Dược sĩ phụ trách nhà thuốc', 'Sales thiết bị y tế', 'Đăng ký lưu hành thuốc'] },
            { title: 'Khám chữa bệnh & Chăm sóc', roles: ['Điều dưỡng phòng khám', 'Kỹ thuật viên nha khoa', 'Chuyên viên dinh dưỡng'] }
          ]
        },
        {
          key: 'education',
          name: 'Giáo dục / Đào tạo / Giảng dạy',
          hotSearches: ['Giáo viên tiếng Anh', 'Giáo viên mầm non', 'Trợ giảng IELTS', 'Cố vấn học tập', 'Chuyên viên phát triển khóa học'],
          subgroups: [
            { title: 'Giảng dạy ngoại ngữ', roles: ['Giáo viên IELTS / TOEIC', 'Giáo viên tiếng Hàn / Nhật', 'Trợ giảng lớp học'] },
            { title: 'Giáo dục phổ thông & Trực tuyến', roles: ['Giáo viên STEM / Lập trình', 'Biên tập giáo trình số', 'Tư vấn giáo dục'] }
          ]
        },
        {
          key: 'languages',
          name: 'Biên - Phiên dịch / Ngoại ngữ',
          hotSearches: ['Biên dịch tiếng Anh', 'Phiên dịch tiếng Trung cabin', 'Biên dịch tiếng Nhật N2/N1', 'Phiên dịch tiếng Hàn công trường'],
          subgroups: [
            { title: 'Biên dịch tài liệu chuyên ngành', roles: ['Biên dịch hợp đồng pháp lý', 'Biên dịch phụ đề phim', 'Biên dịch sách / game'] },
            { title: 'Phiên dịch hội nghị & Nhà máy', roles: ['Phiên dịch dự án EPC', 'Trợ lý giám đốc ngoại ngữ', 'Thông dịch viên hội thảo'] }
          ]
        },
        {
          key: 'agriculture',
          name: 'Nông - Lâm - Ngư nghiệp',
          hotSearches: ['Kỹ sư nông nghiệp', 'Bác sĩ thú y', 'Kỹ sư nuôi trồng thủy sản', 'Kỹ thuật viên vi sinh'],
          subgroups: [
            { title: 'Nông nghiệp công nghệ cao', roles: ['Kỹ thuật nhà màng', 'Chuyên viên dinh dưỡng cây trồng', 'Kiểm soát dịch bệnh'] },
            { title: 'Thú y & Thủy sản', roles: ['Bác sĩ thú y trang trại', 'Kỹ sư thủy sản tôm / cá', 'Kinh doanh thức ăn chăn nuôi'] }
          ]
        },
        {
          key: 'media',
          name: 'Truyền thông / Báo chí / Xuất bản',
          hotSearches: ['Phóng viên / Biên tập viên', 'MC / Dẫn chương trình', 'Biên tập viên xuất bản', 'Quản trị kênh truyền thông'],
          subgroups: [
            { title: 'Báo chí & Đa phương tiện', roles: ['Biên tập báo điện tử', 'Kỹ thuật viên trường quay', 'Biên kịch truyền hình'] },
            { title: 'Xuất bản & Bản quyền', roles: ['Biên tập viên sách', 'Khai thác bản quyền quốc tế', 'Thiết kế dàn trang'] }
          ]
        },
        {
          key: 'executive',
          name: 'Quản lý điều hành / C-Level',
          hotSearches: ['Tổng giám đốc (CEO)', 'Giám đốc vận hành (COO)', 'Giám đốc tài chính (CFO)', 'Giám đốc công nghệ (CTO)'],
          subgroups: [
            { title: 'Lãnh đạo cấp cao', roles: ['Giám đốc điều hành chi nhánh', 'Trợ lý ban tổng giám đốc', 'Giám đốc chiến lược'] },
            { title: 'Quản lý khối / Vùng', roles: ['Giám đốc kinh doanh miền (RSM)', 'Giám đốc nhà máy (Factory Manager)', 'Giám đốc nhân sự (CHRO)'] }
          ]
        }
      ],
      // TRANG 4
      [
        {
          key: 'construction',
          name: 'Xây dựng / Kiến trúc / Nội thất',
          hotSearches: ['Kiến trúc sư công trình', 'Kỹ sư kết cấu', 'Thiết kế nội thất 3D', 'Chỉ huy trưởng công trường'],
          subgroups: [
            { title: 'Kiến trúc & Nội thất', roles: ['Thiết kế nội thất căn hộ', 'Khai triển kiến trúc Revit', 'Giám sát thi công nội thất'] },
            { title: 'Thi công xây dựng', roles: ['Chỉ huy phó công trường', 'Kỹ sư QS bóc tách dự toán', 'Kỹ sư an toàn lao động (HSE)'] }
          ]
        },
        {
          key: 'chemistry',
          name: 'Hóa học / Sinh học / Thực phẩm',
          hotSearches: ['Kỹ sư R&D thực phẩm', 'Chuyên viên kiểm nghiệm vi sinh', 'Kỹ sư hóa chất', 'QA/QC phòng lab'],
          subgroups: [
            { title: 'Nghiên cứu & Phát triển (R&D)', roles: ['Nghiên cứu công thức mỹ phẩm', 'Phát triển hương liệu thực phẩm', 'Kỹ sư công nghệ sinh học'] },
            { title: 'Kiểm soát chất lượng Lab', roles: ['Kỹ thuật viên sắc ký HPLC', 'Đánh giá an toàn thực phẩm ISO', 'Kiểm tra mẫu nguyên liệu'] }
          ]
        },
        {
          key: 'ecommerce',
          name: 'Thương mại điện tử (E-Commerce)',
          hotSearches: ['Vận hành sàn Shopee/Lazada/TikTok', 'Livestreamer bán hàng', 'Tối ưu gian hàng trực tuyến', 'Chuyên viên Ads sàn TMĐT'],
          subgroups: [
            { title: 'Vận hành kênh TMĐT', roles: ['Trưởng nhóm vận hành sàn', 'Xử lý đơn hàng đa kênh', 'Quản trị danh mục sản phẩm'] },
            { title: 'Livestream & Tương tác số', roles: ['Host livestream chốt đơn', 'Kỹ thuật viên set up live', 'Tối ưu tỷ lệ chuyển đổi (CRO)'] }
          ]
        },
        {
          key: 'fashion',
          name: 'Thời trang / May mặc / Giày da',
          hotSearches: ['Nhà thiết kế thời trang', 'Kỹ thuật may rập', 'Merchandiser ngành may', 'Quản lý xưởng may'],
          subgroups: [
            { title: 'Thiết kế & Tạo mẫu', roles: ['Fashion Designer', 'Thợ cắt rập dưỡng', 'Stylist thời trang'] },
            { title: 'Đơn hàng & Sản xuất', roles: ['Merchandiser (May mặc)', 'KCS kiểm hàng xuất khẩu', 'Quản đốc xưởng may'] }
          ]
        },
        {
          key: 'retail',
          name: 'Bán lẻ / Siêu thị / Chuỗi cửa hàng',
          hotSearches: ['Quản lý siêu thị mini', 'Giám sát ca bán hàng', 'Thu ngân siêu thị', 'Nhân viên trưng bày (Visual Merchandiser)'],
          subgroups: [
            { title: 'Vận hành chuỗi bán lẻ', roles: ['Cửa hàng trưởng', 'Nhân viên bảo quản hàng hóa', 'Kiểm kê định kỳ'] },
            { title: 'Visual Merchandising & Dịch vụ', roles: ['Thiết kế trưng bày sản phẩm', 'Hỗ trợ trải nghiệm mua sắm', 'Tư vấn tại quầy'] }
          ]
        },
        {
          key: 'law',
          name: 'Luật / Tư vấn pháp lý',
          hotSearches: ['Luật sư tranh tụng', 'Chuyên viên pháp lý M&A', 'Tư vấn sở hữu trí tuệ', 'Trợ lý công chứng'],
          subgroups: [
            { title: 'Tư vấn doanh nghiệp & M&A', roles: ['Thẩm định pháp lý giao dịch', 'Thành lập & giải thể doanh nghiệp', 'Tư vấn đầu tư nước ngoài'] },
            { title: 'Tranh tụng & Sở hữu trí tuệ', roles: ['Đăng ký nhãn hiệu - sáng chế', 'Đại diện giải quyết tranh chấp', 'Tư vấn lao động doanh nghiệp'] }
          ]
        }
      ],
      // TRANG 5
      [
        {
          key: 'security',
          name: 'An ninh / Bảo vệ / Vệ sĩ',
          hotSearches: ['Đội trưởng bảo vệ', 'Vệ sĩ riêng chuyên nghiệp', 'Giám sát camera an ninh', 'Nhân viên tuần tra'],
          subgroups: [
            { title: 'An ninh mục tiêu cố định', roles: ['Bảo vệ tòa nhà - chung cư', 'Bảo vệ trung tâm thương mại', 'Giám sát phòng điều khiển CCTV'] },
            { title: 'Vệ sĩ & Áp tải', roles: ['Vệ sĩ yếu nhân', 'Áp tải tiền và kim loại quý', 'Điều phối sự kiện an ninh'] }
          ]
        },
        {
          key: 'environment',
          name: 'Môi trường / Xử lý chất thải',
          hotSearches: ['Kỹ sư xử lý nước thải', 'Quan trắc môi trường', 'Tư vấn lập hồ sơ ĐTM', 'Kỹ thuật viên vận hành trạm bơm'],
          subgroups: [
            { title: 'Công nghệ môi trường', roles: ['Thiết kế hệ thống xử lý khí thải', 'Vận hành hệ thống lọc nước RO', 'Quản lý chất thải nguy hại'] },
            { title: 'Hồ sơ & Đánh giá tác động', roles: ['Chuyên viên giấy phép môi trường', 'Quan trắc hiện trường', 'Tư vấn ESG bền vững'] }
          ]
        },
        {
          key: 'events',
          name: 'Tổ chức sự kiện / Hội nghị',
          hotSearches: ['Event Planner', 'Điều phối sự kiện', 'Kỹ thuật âm thanh ánh sáng', 'Quản lý MC & Nghệ sĩ'],
          subgroups: [
            { title: 'Lên ý tưởng & Kế hoạch', roles: ['Biên kịch kịch bản sự kiện', 'Thiết kế sân khấu 3D', 'Lập ngân sách dự án sự kiện'] },
            { title: 'Chạy sự kiện (On-site)', roles: ['Giám sát sân khấu', 'Kỹ thuật LED & Visual', 'Điều phối hậu cần - tiệc'] }
          ]
        },
        {
          key: 'labor_export',
          name: 'Xuất khẩu lao động',
          hotSearches: ['Tư vấn viên XKLĐ Nhật Bản', 'Đơn hàng kỹ sư Đài Loan', 'Điều phối bay quốc tế', 'Giáo viên giáo dục định hướng'],
          subgroups: [
            { title: 'Tư vấn & Hồ sơ tuyển dụng', roles: ['Tư vấn thủ tục visa lao động', 'Xử lý hồ sơ xuất cảnh', 'Tổ chức thi tuyển đơn hàng'] },
            { title: 'Đào tạo xuất khẩu', roles: ['Đào tạo tiếng Nhật/Hàn cho thực tập sinh', 'Quản lý thực tập sinh ở nước ngoài', 'Hỗ trợ chuyển đổi tư cách'] }
          ]
        },
        {
          key: 'biotech',
          name: 'Công nghệ sinh học',
          hotSearches: ['Kỹ sư nuôi cấy mô thực vật', 'Chuyên viên giải trình tự gen', 'Kỹ thuật viên vi sinh phòng sạch', 'Nghiên cứu enzym'],
          subgroups: [
            { title: 'Sinh học phân tử & Y sinh', roles: ['Kỹ thuật viên PCR xét nghiệm', 'Nghiên cứu vắc xin & kháng thể', 'Giải trình tự ADN/ARN'] },
            { title: 'Công nghệ vi sinh công nghiệp', roles: ['Nuôi cấy vi sinh vật men', 'Lên men sinh học công nghiệp', 'Kiểm soát độ tinh sạch'] }
          ]
        },
        {
          key: 'general',
          name: 'Khác / Việc làm liên ngành',
          hotSearches: ['Việc làm bán thời gian', 'Cộng tác viên tại nhà', 'Thực tập sinh đa ngành', 'Trợ lý cá nhân'],
          subgroups: [
            { title: 'Linh hoạt & Thời vụ', roles: ['Freelancer nội dung', 'Cộng tác viên nhập liệu', 'Trực tổng đài ca linh hoạt'] },
            { title: 'Dự án liên ngành', roles: ['Trợ lý dự án đổi mới sáng tạo', 'Chuyên viên chuyển đổi số', 'Điều phối viên chương trình'] }
          ]
        }
      ]
    ];

    let currentIndustryPage = 1;
    let selectedCategoryKey = 'sales'; // Mặc định mở ngành Kinh doanh/Bán hàng theo ảnh mẫu
    let appliedIndustry = '';
    let pendingIndustry = '';
    let appliedIndustryKey = '';
    let pendingIndustryKey = '';
    let appliedIndustryIsCategory = false;
    let pendingIndustryIsCategory = false;
    let industrySearchMatch = null;
    const RESULT_CATEGORY_KEYS = new Set(['it', 'sales', 'marketing', 'finance', 'hr', 'logistics']);

    function normalizeIndustryText(value) {
      return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLocaleLowerCase('vi').trim();
    }

    function findIndustryMatch(value) {
      const query = normalizeIndustryText(value);
      if (!query) return null;
      for (let pageIndex = 0; pageIndex < INDUSTRY_PAGES.length; pageIndex++) {
        for (const category of INDUSTRY_PAGES[pageIndex]) {
          if (normalizeIndustryText(category.name).includes(query)) return { category, page: pageIndex + 1, term: category.name, isCategory: true };
          for (const role of category.hotSearches || []) {
            if (normalizeIndustryText(role).includes(query)) return { category, page: pageIndex + 1, term: role, isCategory: false };
          }
          for (const group of category.subgroups || []) {
            if (normalizeIndustryText(group.title).includes(query)) return { category, page: pageIndex + 1, term: group.title, isCategory: false };
            const role = group.roles.find(item => normalizeIndustryText(item).includes(query));
            if (role) return { category, page: pageIndex + 1, term: role, isCategory: false };
          }
        }
      }
      return null;
    }

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

    function getKeywordJobCount(keyword) {
      let hash = 0;
      for (let i = 0; i < keyword.length; i++) {
        hash = (hash * 31 + keyword.charCodeAt(i)) % 300;
      }
      return 35 + (Math.abs(hash) % 240);
    }

    function getHistory() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.map(item => typeof item === 'string' ? { keyword: item, count: getKeywordJobCount(item) } : item);
          }
        }
      } catch (e) {
        console.warn('Cannot read history from localStorage', e);
      }
      return DEFAULT_HISTORY.map(item => typeof item === 'string' ? { keyword: item, count: getKeywordJobCount(item) } : item);
    }

    function saveHistory(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Cannot write history to localStorage', e);
      }
    }

    function renderHistory() {
      if (!recentListEl) return;
      const history = getHistory();
      recentListEl.innerHTML = '';

      if (!history || history.length === 0) {
        recentListEl.innerHTML = '<span class="recent-empty-hint">Chưa có từ khóa tìm kiếm gần đây</span>';
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
        return;
      }

      if (clearHistoryBtn) clearHistoryBtn.style.display = 'inline-block';

      history.slice(0, 6).forEach((item) => {
        const kw = item.keyword;
        const cnt = item.count !== undefined ? item.count : getKeywordJobCount(kw);

        const row = document.createElement('div');
        row.className = 'recent-search-row';
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.innerHTML = `
          <svg class="recent-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <div class="recent-search-meta">
            <span class="recent-search-keyword">${escapeHtml(kw)}</span>
            <span class="recent-search-count">${cnt} việc làm</span>
          </div>
          <button type="button" class="recent-search-remove" title="Xóa từ khóa" aria-label="Xóa ${escapeHtml(kw)}">✕</button>
        `;

        row.addEventListener('click', (e) => {
          if (e.target.closest('.recent-search-remove')) {
            e.stopPropagation();
            removeHistoryItem(kw);
            return;
          }
          executeSearch(kw);
        });

        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            if (!e.target.closest('.recent-search-remove')) {
              executeSearch(kw);
            }
          }
        });

        recentListEl.appendChild(row);
      });
    }

    function addHistoryItem(keyword) {
      const cleanKeyword = keyword.trim();
      if (!cleanKeyword) return;
      let history = getHistory();
      history = history.filter(item => item.keyword.toLowerCase() !== cleanKeyword.toLowerCase());
      history.unshift({ keyword: cleanKeyword, count: getKeywordJobCount(cleanKeyword) });
      if (history.length > 6) history = history.slice(0, 6);
      saveHistory(history);
      renderHistory();
    }

    function removeHistoryItem(keyword) {
      let history = getHistory();
      history = history.filter(item => item.keyword.toLowerCase() !== keyword.toLowerCase());
      saveHistory(history);
      renderHistory();
      showToast(`Đã xóa "${keyword}" khỏi lịch sử`, '✕');
    }

    function clearAllHistory() {
      saveHistory([]);
      renderHistory();
      showToast('Đã xóa toàn bộ lịch sử tìm kiếm', '✕');
    }

    const POPULAR_COMPANIES = [
      { name: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)', shortName: 'Viettel' },
      { name: 'Tập đoàn Công nghiệp Viettel', shortName: 'Viettel' },
      { name: 'Tổng Công ty Viễn thông Viettel (Viettel Telecom)', shortName: 'Viettel Telecom' },
      { name: 'Tổng Công ty Cổ phần Bưu chính Viettel (Viettel Post)', shortName: 'Viettel Post' },
      { name: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel (Viettel Solutions)', shortName: 'Viettel Solutions' },
      { name: 'FPT Software', shortName: 'FPT Software' },
      { name: 'TẬP ĐOÀN CÔNG NGHỆ FPT', shortName: 'FPT' },
      { name: 'Công ty Cổ phần Viễn thông FPT (FPT Telecom)', shortName: 'FPT Telecom' },
      { name: 'FPT Digital (Tập đoàn FPT)', shortName: 'FPT Digital' },
      { name: 'VNG Corporation (Zalo Team)', shortName: 'VNG' },
      { name: 'Zalo Group (VNG)', shortName: 'Zalo' },
      { name: 'Ngân hàng Techcombank', shortName: 'Techcombank' },
      { name: 'Ngân hàng TMCP Quân Đội (MB Bank)', shortName: 'MB Bank' },
      { name: 'Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)', shortName: 'VPBank' },
      { name: 'Shopee Vietnam (SPX Express)', shortName: 'Shopee' },
      { name: 'Ví điện tử MoMo (M-Service)', shortName: 'MoMo' },
      { name: 'Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)', shortName: 'VNPAY' },
      { name: 'Tập đoàn Vingroup (Vinhomes)', shortName: 'Vingroup' },
      { name: 'VinFast Auto', shortName: 'VinFast' },
      { name: 'VinAI Research (Tập đoàn Vingroup)', shortName: 'VinAI' },
      { name: 'Tiki Corporation (Tiki Tech Hub)', shortName: 'Tiki' },
      { name: 'Tập đoàn Masan (Masan Consumer)', shortName: 'Masan' },
      { name: 'Masan Consumer Holdings', shortName: 'Masan' },
      { name: 'CMC Telecom', shortName: 'CMC' },
      { name: 'Base.vn (Nền tảng Quản trị Doanh nghiệp)', shortName: 'Base.vn' },
      { name: 'One Mount Group (Hệ sinh thái VinID & VinShop)', shortName: 'One Mount' },
      { name: 'KMS Technology Vietnam', shortName: 'KMS Technology' },
      { name: 'NashTech Vietnam', shortName: 'NashTech' },
      { name: 'Bosch Global Software Technologies (Bosch Việt Nam)', shortName: 'Bosch' },
      { name: 'Unilever Việt Nam', shortName: 'Unilever' },
      { name: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)', shortName: 'Vinamilk' },
      { name: 'Công ty Cổ phần Chứng khoán SSI', shortName: 'SSI' },
      { name: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO', shortName: 'Vikimco' },
      { name: 'Tập đoàn Mai Linh', shortName: 'Mai Linh' },
      { name: 'Tập đoàn Đất Xanh', shortName: 'Đất Xanh' },
      { name: 'Tập đoàn Tân Á Đại Thành', shortName: 'Tân Á Đại Thành' },
      { name: 'Grab Việt Nam', shortName: 'Grab' },
      { name: 'Bee Logistics Corporation', shortName: 'Bee Logistics' },
      { name: 'Samsung Electronics HCMC', shortName: 'Samsung' },
      { name: 'VCCorp Corporation', shortName: 'VCCorp' },
      { name: 'Dentsu Creative Vietnam', shortName: 'Dentsu' },
      { name: 'Gemadept Logistics', shortName: 'Gemadept' }
    ];

    // Kho từ khóa gợi ý đa dạng phong phú chuẩn TopCV
    const ALL_SUGGESTIONS = [
      { keyword: 'ReactJS Developer', count: 156 },
      { keyword: 'Frontend Developer', count: 240 },
      { keyword: 'Backend Developer', count: 310 },
      { keyword: 'Fullstack Developer', count: 185 },
      { keyword: 'Java Spring Boot', count: 128 },
      { keyword: 'Lập trình viên Java', count: 96 },
      { keyword: 'NodeJS Developer', count: 112 },
      { keyword: 'Python Developer', count: 145 },
      { keyword: 'PHP / Laravel', count: 88 },
      { keyword: 'Golang Developer', count: 64 },
      { keyword: 'Flutter / Mobile App', count: 92 },
      { keyword: 'iOS / Swift Developer', count: 54 },
      { keyword: 'Android Developer', count: 68 },
      { keyword: 'DevOps Engineer', count: 82 },
      { keyword: 'UI/UX Designer', count: 143 },
      { keyword: 'Product Designer', count: 76 },
      { keyword: 'Graphic Designer', count: 135 },
      { keyword: 'Product Manager', count: 62 },
      { keyword: 'Business Analyst (BA)', count: 143 },
      { keyword: 'Nhân viên phân tích nghiệp vụ', count: 146 },
      { keyword: 'Data Analyst', count: 118 },
      { keyword: 'Data Engineer', count: 79 },
      { keyword: 'AI / Machine Learning Engineer', count: 95 },
      { keyword: 'Tester / QA QC', count: 172 },
      { keyword: 'Marketing Leader', count: 92 },
      { keyword: 'Digital Marketing', count: 215 },
      { keyword: 'Content Marketing', count: 164 },
      { keyword: 'SEO Specialist', count: 98 },
      { keyword: 'Telesales', count: 280 },
      { keyword: 'Nhân viên kinh doanh', count: 420 },
      { keyword: 'Sales B2B', count: 165 },
      { keyword: 'Chăm sóc khách hàng', count: 310 },
      { keyword: 'Kế toán tổng hợp', count: 184 },
      { keyword: 'Kế toán thuế', count: 125 },
      { keyword: 'Kế toán kho', count: 94 },
      { keyword: 'Kế toán viên', count: 110 },
      { keyword: 'Chuyên viên tuyển dụng (HR)', count: 152 },
      { keyword: 'Hành chính nhân sự', count: 205 },
      { keyword: 'Quản lý nhà hàng', count: 78 },
      { keyword: 'Kỹ sư xây dựng', count: 115 },
      { keyword: 'Kỹ sư cơ khí', count: 89 },
      { keyword: 'Dược sĩ đại học', count: 72 },
      { keyword: 'Trình dược viên', count: 84 },
      { keyword: 'Phiên dịch tiếng Trung', count: 96 },
      { keyword: 'Biên phiên dịch tiếng Hàn', count: 62 },
      { keyword: 'Biên dịch tiếng Anh', count: 104 },
      { keyword: 'Nhân viên xuất nhập khẩu', count: 132 },
      { keyword: 'Sales Logistics', count: 110 },
      { keyword: 'Warehouse Supervisor', count: 58 }
    ];

    INDUSTRY_PAGES.forEach(page => {
      page.forEach(cat => {
        (cat.hotSearches || []).forEach(hs => {
          if (!ALL_SUGGESTIONS.some(s => s.keyword.toLowerCase() === hs.toLowerCase())) {
            ALL_SUGGESTIONS.push({ keyword: hs, count: getKeywordJobCount(hs) });
          }
        });
        (cat.subgroups || []).forEach(sg => {
          (sg.roles || []).forEach(r => {
            if (!ALL_SUGGESTIONS.some(s => s.keyword.toLowerCase() === r.toLowerCase())) {
              ALL_SUGGESTIONS.push({ keyword: r, count: getKeywordJobCount(r) });
            }
          });
        });
      });
    });

    function escapeHtml(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function highlightMatch(text, query) {
      if (!query) return escapeHtml(text);
      const qClean = query.trim();
      const escaped = qClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return escapeHtml(text).replace(regex, '<strong>$1</strong>');
    }

    function renderKeywordSuggestions(query, container) {
      if (!container) return;
      container.innerHTML = '';
      const clean = normalizeIndustryText(query);
      if (!clean) return;

      // 1. Thu thập và tìm kiếm Công ty phù hợp
      const matchedCompanies = [];
      const seenCompanyKeys = new Set();

      const allCompaniesList = [...POPULAR_COMPANIES];
      RECOMMENDED_JOBS_POOL.forEach(j => {
        if (j.company && !allCompaniesList.some(c => c.name.toLowerCase() === j.company.toLowerCase())) {
          allCompaniesList.push({ name: j.company, shortName: j.company });
        }
      });

      allCompaniesList.forEach(comp => {
        const normName = normalizeIndustryText(comp.name);
        const normShort = normalizeIndustryText(comp.shortName || '');
        if (normName.includes(clean) || normShort.includes(clean)) {
          const key = comp.name.toLowerCase();
          if (!seenCompanyKeys.has(key)) {
            seenCompanyKeys.add(key);
            matchedCompanies.push({
              type: 'company',
              keyword: comp.shortName || comp.name,
              label: comp.name,
              searchKey: comp.shortName || comp.name
            });
          }
        }
      });

      // 2. Thu thập và tìm kiếm Việc làm phù hợp
      const matchedJobs = [];
      const seenJobKeys = new Set();

      // 2a. Việc làm từ dataset khớp theo title hoặc thuộc công ty được tìm
      RECOMMENDED_JOBS_POOL.forEach(job => {
        const normTitle = normalizeIndustryText(job.title);
        const normCompany = normalizeIndustryText(job.company || '');
        const isTitleMatch = normTitle.includes(clean);
        const isCompanyMatch = normCompany.includes(clean);

        if (isTitleMatch || isCompanyMatch) {
          const uniqueKey = `${job.title}__${job.company}`.toLowerCase();
          if (!seenJobKeys.has(uniqueKey)) {
            seenJobKeys.add(uniqueKey);
            matchedJobs.push({
              type: 'job',
              keyword: job.title,
              label: isCompanyMatch && !isTitleMatch ? `${job.title} — ${job.company}` : job.title,
              searchKey: job.title
            });
          }
        }
      });

      // 2b. Vai trò/vị trí chuẩn từ ALL_SUGGESTIONS & Taxonomy
      ALL_SUGGESTIONS.forEach(item => {
        if (normalizeIndustryText(item.keyword).includes(clean)) {
          const key = item.keyword.toLowerCase();
          if (!seenJobKeys.has(key)) {
            seenJobKeys.add(key);
            matchedJobs.push({
              type: 'job',
              keyword: item.keyword,
              label: item.keyword,
              searchKey: item.keyword
            });
          }
        }
      });

      // 3. Phân bổ thông minh: hiển thị cả Công ty và Việc làm (tối đa 10 mục)
      let finalMatches = [];
      if (matchedCompanies.length > 0 && matchedJobs.length > 0) {
        const isCompanySearch = matchedCompanies.some(c => normalizeIndustryText(c.keyword) === clean || normalizeIndustryText(c.label).startsWith(clean));
        if (isCompanySearch) {
          finalMatches = [
            ...matchedCompanies.slice(0, 4),
            ...matchedJobs.slice(0, 6)
          ];
        } else {
          finalMatches = [
            ...matchedJobs.slice(0, 6),
            ...matchedCompanies.slice(0, 4)
          ];
        }
      } else {
        finalMatches = [...matchedCompanies, ...matchedJobs];
      }

      finalMatches = finalMatches.slice(0, 10);

      if (finalMatches.length === 0) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'keyword-suggestion-empty';
        emptyRow.setAttribute('role', 'button');
        emptyRow.setAttribute('tabindex', '0');
        emptyRow.innerHTML = `
          <svg class="kw-suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span class="kw-suggest-text">Tìm kiếm việc làm cho <strong>"${escapeHtml(query)}"</strong></span>
        `;
        emptyRow.addEventListener('click', () => {
          executeSearch(query);
        });
        emptyRow.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') executeSearch(query);
        });
        container.appendChild(emptyRow);
        return;
      }

      finalMatches.forEach(item => {
        const row = document.createElement('div');
        row.className = `keyword-suggestion-row is-${item.type}`;
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.innerHTML = `
          <div class="kw-suggest-left">
            ${item.type === 'company' ? `
              <svg class="kw-suggest-icon kw-icon-company" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M3 21h18M3 7v14M21 7v14M6 10h2M6 14h2M6 18h2M11 10h2M11 14h2M11 18h2M16 10h2M16 14h2M16 18h2M9 3h6v4H9z"/>
              </svg>
            ` : `
              <svg class="kw-suggest-icon kw-icon-job" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            `}
            <span class="kw-suggest-text" title="${escapeHtml(item.label)}">${highlightMatch(item.label, query)}</span>
          </div>
        `;
        row.addEventListener('click', () => {
          executeSearch(item.searchKey || item.keyword);
        });
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') executeSearch(item.searchKey || item.keyword);
        });
        container.appendChild(row);
      });
    }

    function handleSearchInputMode(rawQuery) {
      const query = (rawQuery || '').trim();
      // Bắt đầu gợi ý khi người dùng nhập từ ký tự thứ 2 trở lên
      const isTyping = query.length >= 2;

      if (isTyping) {
        searchFormatLeft?.classList.add('is-typing');
        if (suggestRecentSection) suggestRecentSection.style.display = 'none';
        if (keywordSuggestionsSection) keywordSuggestionsSection.style.display = 'flex';
        if (popularKeywordsWrap) popularKeywordsWrap.style.display = 'none';
        renderKeywordSuggestions(query, keywordSuggestionsList);
        renderRecommendedJobs(query, recommendedJobListEl);
      } else {
        searchFormatLeft?.classList.remove('is-typing');
        if (suggestRecentSection) suggestRecentSection.style.display = 'flex';
        if (keywordSuggestionsSection) keywordSuggestionsSection.style.display = 'none';
        if (popularKeywordsWrap) popularKeywordsWrap.style.display = 'block';
        renderHistory();
        renderRecommendedJobs('', recommendedJobListEl);
      }
    }

    function renderIndustryNav() {
      if (!industryNavList || !industryPageInfo) return;
      const pageIndex = currentIndustryPage - 1;
      const currentList = INDUSTRY_PAGES[pageIndex] || INDUSTRY_PAGES[0];

      // Cập nhật số trang 1/5
      industryPageInfo.textContent = `${currentIndustryPage}/${INDUSTRY_PAGES.length}`;

      if (btnIndustryPrevPage) {
        btnIndustryPrevPage.disabled = currentIndustryPage <= 1;
      }
      if (btnIndustryNextPage) {
        btnIndustryNextPage.disabled = currentIndustryPage >= INDUSTRY_PAGES.length;
      }

      // Kiểm tra nếu selectedCategoryKey thuộc trang này, nếu không chọn ngành đầu tiên của trang
      const exists = currentList.some(item => item.key === selectedCategoryKey);
      if (!exists && currentList.length > 0) {
        selectedCategoryKey = currentList[0].key;
      }

      industryNavList.innerHTML = '';
      currentList.forEach(cat => {
        const itemBtn = document.createElement('button');
        itemBtn.type = 'button';
        itemBtn.className = `industry-nav-item ${cat.key === selectedCategoryKey ? 'active' : ''}${cat.name === pendingIndustry ? ' is-selected-category' : ''}`;
        itemBtn.setAttribute('data-category', cat.key);
        itemBtn.setAttribute('data-industry-name', cat.name);
        itemBtn.setAttribute('aria-pressed', String(cat.name === pendingIndustry));
        itemBtn.innerHTML = `
          <span>${cat.name}</span>
          <span class="nav-item-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        `;

        itemBtn.addEventListener('click', (e) => {
          e.preventDefault();
          selectCategory(cat.key);
          pendingIndustry = cat.name;
          pendingIndustryKey = cat.key;
          pendingIndustryIsCategory = true;
          renderIndustryNav();
          updateIndustrySelection();
        });

        itemBtn.addEventListener('mouseenter', () => {
          selectCategory(cat.key);
        });

        industryNavList.appendChild(itemBtn);
      });

      renderIndustryContent();
    }

    function selectCategory(categoryKey) {
      selectedCategoryKey = categoryKey;
      if (industryNavList) {
        const buttons = industryNavList.querySelectorAll('.industry-nav-item');
        buttons.forEach(btn => {
          if (btn.getAttribute('data-category') === categoryKey) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
      renderIndustryContent();
    }

    function renderIndustryContent() {
      if (!industryMegaContent) return;

      // Tìm thông tin danh mục qua tất cả các trang
      let catData = null;
      for (const page of INDUSTRY_PAGES) {
        const found = page.find(c => c.key === selectedCategoryKey);
        if (found) {
          catData = found;
          break;
        }
      }
      if (!catData) {
        catData = INDUSTRY_PAGES[0][0];
      }

      let html = '';

      // Các nhóm danh mục chi tiết (mỗi nhóm gồm tên nghề kèm checkbox và các vị trí chuyên môn)
      if (catData.subgroups && catData.subgroups.length > 0) {
        catData.subgroups.forEach(group => {
          const isSelected = group.title === pendingIndustry;
          html += `
            <div class="mega-subgroup-row">
              <div class="category-role-title-wrap" data-role="${group.title}">
                <span class="cat-checkbox ${isSelected ? 'is-checked' : ''}">
                  <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span class="mega-subgroup-title">${group.title}</span>
              </div>
              <div class="mega-subgroup-tags">
                ${group.roles.map(r => `
                  <button type="button" class="subgroup-tag-pill${r === pendingIndustry ? ' is-selected' : ''}" data-role="${r}" aria-pressed="${r === pendingIndustry}">${r}</button>
                `).join('')}
              </div>
            </div>
          `;
        });
      }

      // Phần 3: Nút hướng dẫn cuộn để xem
      html += `
        <div class="industry-scroll-badge" id="industryScrollBadge" title="Cuộn xuống xem thêm vị trí">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          <span>Cuộn để xem</span>
        </div>
      `;

      industryMegaContent.innerHTML = html;
      industryMegaContent.scrollTop = 0;

      // Gắn sự kiện click tìm kiếm cho các thẻ vị trí và tiêu đề nhóm
      const allPills = industryMegaContent.querySelectorAll('.hot-search-pill, .subgroup-tag-pill');
      allPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const role = pill.getAttribute('data-role') || pill.textContent.trim();
          pendingIndustry = role;
          pendingIndustryKey = selectedCategoryKey;
          pendingIndustryIsCategory = false;
          updateIndustrySelection();
        });
      });

      const allRoleTitles = industryMegaContent.querySelectorAll('.category-role-title-wrap');
      allRoleTitles.forEach(wrap => {
        wrap.addEventListener('click', (e) => {
          e.preventDefault();
          const role = wrap.getAttribute('data-role') || wrap.textContent.trim();
          pendingIndustry = role;
          pendingIndustryKey = selectedCategoryKey;
          pendingIndustryIsCategory = false;
          updateIndustrySelection();
        });
      });

      // Xử lý huy hiệu cuộn
      const scrollBadge = document.getElementById('industryScrollBadge');
      if (scrollBadge) {
        scrollBadge.addEventListener('click', () => {
          industryMegaContent.scrollBy({ top: 130, behavior: 'smooth' });
        });

        industryMegaContent.onscroll = () => {
          const isNearBottom = industryMegaContent.scrollHeight - industryMegaContent.scrollTop - industryMegaContent.clientHeight < 30;
          if (isNearBottom) {
            scrollBadge.classList.add('is-hidden');
          } else {
            scrollBadge.classList.remove('is-hidden');
          }
        };
      }
    }

    function updateIndustrySelection() {
      industryMegaContent?.querySelectorAll('.hot-search-pill, .subgroup-tag-pill').forEach(pill => {
        const selected = pill.getAttribute('data-role') === pendingIndustry;
        pill.classList.toggle('is-selected', selected);
        pill.setAttribute('aria-pressed', String(selected));
      });
      industryNavList?.querySelectorAll('.industry-nav-item').forEach(item => {
        const selected = item.getAttribute('data-industry-name') === pendingIndustry;
        item.classList.toggle('is-selected-category', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      if (industryPickerStatus) {
        industryPickerStatus.textContent = pendingIndustry ? `Đã chọn: ${pendingIndustry}` : 'Chưa chọn ngành nghề';
      }
      if (industryFilterApply) industryFilterApply.disabled = pendingIndustry === appliedIndustry;
    }

    function updateDropdownPosition() {
      if (!heroSearchWrapper || !searchSuggestDropdown) return;
      if (window.innerWidth <= 900) {
        searchSuggestDropdown.style.removeProperty('--search-suggest-left');
        searchSuggestDropdown.style.removeProperty('--search-suggest-right');
        searchSuggestDropdown.style.left = '0';
        searchSuggestDropdown.style.right = '0';
        searchSuggestDropdown.style.width = '100%';
        searchSuggestDropdown.style.maxWidth = '100%';
        return;
      }
      const inputGroup = heroSearchInput ? heroSearchInput.closest('.search-input-group') : null;
      const heroBox = document.getElementById('heroSearchBox') || (heroSearchInput ? heroSearchInput.closest('.hero-search-box') : null);
      const parentBar = searchSuggestDropdown.parentElement;
      if (inputGroup && parentBar && heroBox) {
        const barRect = parentBar.getBoundingClientRect();
        const groupRect = inputGroup.getBoundingClientRect();
        const boxRect = heroBox.getBoundingClientRect();

        // Mép trái: Thu gọn căn thẳng hàng với ô input tìm kiếm (để lộ nút "Danh mục Nghề" bên trái)
        const leftOffset = Math.max(0, Math.round(groupRect.left - barRect.left));

        // Mép phải: GIỮ NGUYÊN kéo dài đến hết mép phải của thanh tìm kiếm (hero-search-box)
        const rightOffset = Math.max(0, Math.round(barRect.right - boxRect.right));

        searchSuggestDropdown.style.setProperty('--search-suggest-left', `${leftOffset}px`);
        searchSuggestDropdown.style.setProperty('--search-suggest-right', `${rightOffset}px`);
        searchSuggestDropdown.style.left = `${leftOffset}px`;
        searchSuggestDropdown.style.right = `${rightOffset}px`;
        searchSuggestDropdown.style.width = 'auto';
        searchSuggestDropdown.style.maxWidth = 'none';
      }
    }

    function openDropdown(mode = 'suggestions') {
      const industryMode = mode === 'industry';
      searchSuggestDropdown.classList.toggle('is-industry-mode', industryMode);
      updateDropdownPosition();
      searchSuggestDropdown.classList.add('is-open');
      heroSearchInput.setAttribute('aria-expanded', String(!industryMode));
      industryFilterTrigger?.setAttribute('aria-expanded', String(industryMode));
      searchSuggestDropdown.setAttribute('aria-label', industryMode ? 'Chọn ngành nghề' : 'Gợi ý tìm kiếm việc làm');
    }

    function closeDropdown() {
      searchSuggestDropdown.classList.remove('is-open');
      heroSearchInput.setAttribute('aria-expanded', 'false');
      industryFilterTrigger?.setAttribute('aria-expanded', 'false');
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

      const searchParams = new URLSearchParams();
      if (query) searchParams.set('keyword', query);
      if (location) searchParams.set('location', location);
      if (appliedIndustry) {
        if (RESULT_CATEGORY_KEYS.has(appliedIndustryKey)) searchParams.set('category', appliedIndustryKey);
        if (!appliedIndustryIsCategory || !RESULT_CATEGORY_KEYS.has(appliedIndustryKey)) searchParams.set('industry', appliedIndustry);
      }

      const queryString = searchParams.toString();
      window.location.assign(`viec-lam.html${queryString ? `?${queryString}` : ''}`);
    }

    // Input Events
    heroSearchInput.addEventListener('focus', () => {
      openDropdown('suggestions');
      handleSearchInputMode(heroSearchInput.value);
    });

    heroSearchInput.addEventListener('click', () => {
      openDropdown('suggestions');
      handleSearchInputMode(heroSearchInput.value);
    });

    const searchInputGroup = heroSearchInput.closest('.search-input-group');
    if (searchInputGroup) {
      searchInputGroup.addEventListener('click', (e) => {
        if (e.target !== clearSearchInputBtn) {
          heroSearchInput.focus();
          openDropdown('suggestions');
          handleSearchInputMode(heroSearchInput.value);
        }
      });
    }

    heroSearchInput.addEventListener('input', () => {
      const query = heroSearchInput.value.trim();
      if (clearSearchInputBtn) {
        clearSearchInputBtn.style.display = query ? 'flex' : 'none';
      }
      if (!searchSuggestDropdown.classList.contains('is-open')) {
        openDropdown('suggestions');
      }
      handleSearchInputMode(query);
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
        handleSearchInputMode('');
      });
    }

    if (btnHeroSearch) {
      btnHeroSearch.addEventListener('click', (e) => {
        e.preventDefault();
        executeSearch(heroSearchInput.value);
      });
    }

    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', (e) => {
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

    window.addEventListener('resize', updateDropdownPosition, { passive: true });
    window.addEventListener('scroll', updateDropdownPosition, { passive: true });

    updateDropdownPosition();
    renderHistory();

    // Lắng nghe sự kiện chọn danh mục từ EasyCVCategoryModal
    document.addEventListener('easycv:category-applied', (e) => {
      const detail = e.detail || {};
      const { groups = [], subgroups = [], roles = [], primaryQuery = '' } = detail;
      appliedIndustry = primaryQuery || (roles[0] || subgroups[0] || '');
      if (groups.length > 0) {
        appliedIndustryKey = groups[0];
        appliedIndustryIsCategory = true;
      } else {
        appliedIndustryKey = '';
        appliedIndustryIsCategory = false;
      }
      if (clearSearchInputBtn) {
        clearSearchInputBtn.style.display = (heroSearchInput.value.trim() || appliedIndustry) ? 'flex' : 'none';
      }
      console.log('[Home Search] Category filter synchronized:', { appliedIndustry, appliedIndustryKey });
      // Yêu cầu 5: Khi nhấn nút chọn, áp dụng luôn danh sách lọc đó vào màn tra cứu việc làm
      executeSearch();
    });

    industryFilterTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shouldClose = searchSuggestDropdown.classList.contains('is-open') && searchSuggestDropdown.classList.contains('is-industry-mode');
      if (shouldClose) {
        closeDropdown();
        return;
      }
      pendingIndustry = appliedIndustry;
      pendingIndustryKey = appliedIndustryKey;
      pendingIndustryIsCategory = appliedIndustryIsCategory;
      if (appliedIndustry) {
        const appliedMatch = findIndustryMatch(appliedIndustry);
        if (appliedMatch) {
          currentIndustryPage = appliedMatch.page;
          selectedCategoryKey = appliedMatch.category.key;
        }
      }
      if (industryFilterSearch) industryFilterSearch.value = '';
      renderIndustryNav();
      updateIndustrySelection();
      openDropdown('industry');
      industryFilterSearch?.focus({ preventScroll: true });
    });

    const cancelIndustrySelection = () => {
      pendingIndustry = appliedIndustry;
      pendingIndustryKey = appliedIndustryKey;
      pendingIndustryIsCategory = appliedIndustryIsCategory;
      closeDropdown();
      industryFilterTrigger?.focus();
    };

    industryPickerClose?.addEventListener('click', cancelIndustrySelection);
    industryFilterCancel?.addEventListener('click', cancelIndustrySelection);

    industryFilterClear?.addEventListener('click', () => {
      pendingIndustry = '';
      pendingIndustryKey = '';
      pendingIndustryIsCategory = false;
      updateIndustrySelection();
    });

    industryFilterApply?.addEventListener('click', () => {
      appliedIndustry = pendingIndustry;
      appliedIndustryKey = pendingIndustryKey;
      appliedIndustryIsCategory = pendingIndustryIsCategory;
      if (industryFilterLabel) {
        industryFilterLabel.textContent = appliedIndustry ? (appliedIndustry.length > 22 ? `${appliedIndustry.slice(0, 20)}…` : appliedIndustry) : 'Danh mục nghề';
        industryFilterLabel.title = appliedIndustry;
      }
      if (clearSearchInputBtn) clearSearchInputBtn.style.display = heroSearchInput.value.trim() ? 'flex' : 'none';
      closeDropdown();
      btnHeroSearch?.focus();
    });

    industryFilterSearch?.addEventListener('input', () => {
      const query = industryFilterSearch.value.trim();
      if (!query) {
        industrySearchMatch = null;
        renderIndustryNav();
        updateIndustrySelection();
        return;
      }
      industrySearchMatch = findIndustryMatch(query);
      if (!industrySearchMatch) {
        industryMegaContent.innerHTML = `<p class="industry-empty-state">Không tìm thấy ngành nghề phù hợp với “${query.replace(/[<>&"']/g, '')}”.</p>`;
        if (industryPickerStatus) industryPickerStatus.textContent = `Không tìm thấy kết quả cho “${industryFilterSearch.value.trim()}”`;
        return;
      }
      currentIndustryPage = industrySearchMatch.page;
      selectedCategoryKey = industrySearchMatch.category.key;
      renderIndustryNav();
      const normalizedQuery = normalizeIndustryText(query);
      const categoryMatched = normalizeIndustryText(industrySearchMatch.category.name).includes(normalizedQuery);
      industryMegaContent.querySelectorAll('.hot-search-pill, .subgroup-tag-pill').forEach(pill => {
        pill.hidden = !categoryMatched && !normalizeIndustryText(pill.textContent).includes(normalizedQuery);
      });
      industryMegaContent.querySelectorAll('.mega-subgroup-row').forEach(row => {
        const titleMatched = normalizeIndustryText(row.querySelector('.mega-subgroup-title')?.textContent).includes(normalizedQuery);
        if (titleMatched) row.querySelectorAll('.subgroup-tag-pill').forEach(pill => { pill.hidden = false; });
        row.hidden = !titleMatched && !row.querySelector('.subgroup-tag-pill:not([hidden])');
      });
      const hotSection = industryMegaContent.querySelector('.mega-section-hot');
      if (hotSection) hotSection.hidden = !categoryMatched && !hotSection.querySelector('.hot-search-pill:not([hidden])');
      updateIndustrySelection();
    });

    industryFilterSearch?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && industrySearchMatch) {
        e.preventDefault();
        pendingIndustry = industrySearchMatch.term;
        pendingIndustryKey = industrySearchMatch.category.key;
        pendingIndustryIsCategory = industrySearchMatch.isCategory;
        updateIndustrySelection();
        industryFilterApply?.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelIndustrySelection();
      }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!heroSearchWrapper.contains(e.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const wasIndustryMode = searchSuggestDropdown.classList.contains('is-industry-mode');
        closeDropdown();
        if (wasIndustryMode) industryFilterTrigger?.focus();
      }
    });

    // Sự kiện phân trang ngành nghề (Mega-Menu 5 trang)
    if (btnIndustryPrevPage) {
      btnIndustryPrevPage.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndustryPage > 1) {
          currentIndustryPage--;
          renderIndustryNav();
        }
      });
    }

    if (btnIndustryNextPage) {
      btnIndustryNextPage.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndustryPage < INDUSTRY_PAGES.length) {
          currentIndustryPage++;
          renderIndustryNav();
        }
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

    // Recommended jobs click
    const recommendedJobBtns = document.querySelectorAll('.recommended-job');
    recommendedJobBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || btn.querySelector('.recommended-job-title')?.textContent.trim();
        if (kw) executeSearch(kw);
      });
    });

    // Navbar Logo & "Tìm việc" / "Tìm kiếm việc làm" interactions on homepage
    const navbarBrandLogo = document.getElementById('navbarBrandLogo') || document.querySelector('.navbar-brand');
    navbarBrandLogo?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function focusHeroSearch(e) {
      e.preventDefault();
      const heroBox = document.getElementById('heroSearchBox');
      const stickyBar = document.getElementById('heroSearchStickyBar');
      if (stickyBar && stickyBar.classList.contains('is-sticky')) {
        heroSearchInput?.focus();
        return;
      }
      if (heroBox) {
        heroBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          heroSearchInput?.focus();
        }, 320);
      }
    }

    document.getElementById('navLinkTimViec')?.addEventListener('click', focusHeroSearch);
    document.getElementById('dropdownItemTimKiemViecLam')?.addEventListener('click', focusHeroSearch);
    document.getElementById('mobileLinkTimKiemViecLam')?.addEventListener('click', (e) => {
      const overlay = document.getElementById('mobile-drawer-overlay');
      if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
      focusHeroSearch(e);
    });

    // --- Sticky Hero Search Bar on Scroll ---
    function initStickySearch() {
      const wrapper = document.getElementById('heroSearchWrapper');
      const stickyBar = document.getElementById('heroSearchStickyBar');
      const header = document.querySelector('.site-header');
      if (!wrapper || !stickyBar) return;

      let isSticky = false;

      function handleScroll() {
        const headerHeight = header ? header.offsetHeight : 72;
        stickyBar.style.setProperty('--sticky-search-top', headerHeight + 'px');

        const wrapperRect = wrapper.getBoundingClientRect();
        const shouldStick = wrapperRect.top <= headerHeight;

        if (shouldStick && !isSticky) {
          isSticky = true;
          wrapper.style.minHeight = wrapper.offsetHeight + 'px';
          stickyBar.classList.add('is-sticky');
        } else if (!shouldStick && isSticky) {
          isSticky = false;
          stickyBar.classList.remove('is-sticky');
          wrapper.style.minHeight = '';
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
      handleScroll();
    }

    // Initialize
    renderHistory();
    renderIndustryNav();
    initStickySearch();
    initHeroSponsorSlider();
  }

  // --- 8. Hero Sponsor Banner Slider (Tấm banner to nhất có 2 nút prev/next và dots) ---
  function initHeroSponsorSlider() {
    const sliderContainer = document.getElementById('heroSponsorSlider');
    if (!sliderContainer) return;

    const slides = Array.from(sliderContainer.querySelectorAll('.sponsor-slide'));
    const dots = Array.from(sliderContainer.querySelectorAll('.sponsor-dot'));
    const prevBtn = document.getElementById('sponsorSliderPrev');
    const nextBtn = document.getElementById('sponsorSliderNext');

    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    }

    function prevSlide(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(idx);
        resetAutoPlay();
      });
    });

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);

    // Kích hoạt auto play
    startAutoPlay();
  }

  // Ensure all job & company logos have exact requested tooltip specifications
  function initLogoTooltips() {
    // 1. Thẻ job thông thường: tooltip "Công ty [Tên] tuyển dụng tại EasyCV"
    document.querySelectorAll('.job-card').forEach(card => {
      const companyEl = card.querySelector('.company-name');
      const logoWrapper = card.querySelector('.job-logo-wrapper');
      const logoImg = card.querySelector('.job-logo');
      
      let companyName = companyEl ? companyEl.textContent.trim() : '';
      if (!companyName && logoImg && logoImg.getAttribute('alt')) {
        companyName = logoImg.getAttribute('alt').replace(/logo/i, '').trim();
      }
      if (companyName) {
        const cleanName = companyName.replace(/^(công ty|tổng công ty|ngân hàng)\s+/i, (match) => {
          return match.trim() + ' ';
        });
        const tooltipText = cleanName.toLowerCase().startsWith('công ty')
          ? `${cleanName} tuyển dụng tại EasyCV`
          : `Công ty ${cleanName} tuyển dụng tại EasyCV`;
          
        if (logoWrapper && !logoWrapper.getAttribute('title')) {
          logoWrapper.setAttribute('title', tooltipText);
        }
        if (logoImg && !logoImg.getAttribute('title')) {
          logoImg.setAttribute('title', tooltipText);
        }
      }
    });

    // 2. Khối Công ty nổi bật (#cong-ty-tieu-bieu hoặc .top-companies-section): tooltip "Công ty [Tên]"
    document.querySelectorAll('#cong-ty-tieu-bieu .company-card, .top-companies-section .company-card').forEach(card => {
      const titleEl = card.querySelector('.company-card-title');
      const logoWrap = card.querySelector('.company-card-logo-wrap');
      const logoMark = card.querySelector('.company-card-logo-mark');
      
      let companyName = logoMark?.getAttribute('aria-label')?.trim() || '';
      if (!companyName && titleEl) {
        const rawTitle = titleEl.textContent.trim();
        const parts = rawTitle.split(' - ');
        companyName = parts.length > 1 ? parts[parts.length - 1].trim() : rawTitle;
      }
      if (companyName) {
        const tooltipText = companyName.toLowerCase().startsWith('công ty') || companyName.toLowerCase().startsWith('ngân hàng')
          ? companyName
          : `Công ty ${companyName}`;
        if (logoWrap && !logoWrap.getAttribute('title')) {
          logoWrap.setAttribute('title', tooltipText);
        }
        if (logoMark && !logoMark.getAttribute('title')) {
          logoMark.setAttribute('title', tooltipText);
        }
      }
    });
  }

  // =========================================================================
  // --- 9. Khối IV: Việc Làm Nổi Bật (Featured Jobs Engine) ---
  // - 5 Tabs lọc theo 5 ngành nghề có số lượng job nhiều nhất
  // - Phân trang tự động 10s chuyển trang 1 lần (Hover pause / Resume)
  // - Popover Preview chi tiết khi hover vào tên job
  // - Huy hiệu Tia Sét ⚡ chuẩn TopCV gắn trên logo công ty
  // - Thuật toán ưu tiên: Chưa login -> theo quy mô ngành nghề; Đã login -> theo dữ liệu cá nhân hóa
  // =========================================================================
  function initFeaturedJobsSection() {
    const gridEl = document.getElementById('featuredJobsGrid');
    const tabsContainer = document.getElementById('featuredIndustryTabs');
    const paginationControls = document.getElementById('featuredPaginationControls');
    const previewPopup = document.getElementById('jobPreviewPopup');
    const sectionContainer = document.getElementById('viec-lam-noi-bat');

    if (!gridEl || !tabsContainer) return;

    // Kho dữ liệu chuẩn 120 việc làm phong phú cho 5 ngành nghề hàng đầu (24 việc làm / ngành)
    const FEATURED_JOBS_DATA = [
      {
            "id": 101,
            "title": "Giám Đốc Khách Hàng Doanh Nghiệp (B2B Account Manager)",
            "company": "Tổng Công ty Dịch vụ Số Viettel",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 55 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "15 phút trước",
            "verified": true,
            "skills": [
                  "B2B Sales",
                  "Key Account",
                  "Giải pháp số",
                  "Đàm phán cấp cao"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm phát triển doanh số khách hàng doanh nghiệp khối Tài chính - Ngân hàng.",
                  "Tư vấn các gói giải pháp Chuyển đổi số, Viettel Cloud và Payment Gateway.",
                  "Xây dựng mối quan hệ chiến lược với C-levels của các tập đoàn đối tác."
            ],
            "perks": [
                  "Thưởng hoa hồng không giới hạn theo doanh số",
                  "Gói bảo hiểm sức khỏe Viettel Care toàn diện"
            ],
            "aiMatch": 96
      },
      {
            "id": 102,
            "title": "Trưởng Phòng Kinh Doanh Bất Động Sản Nghỉ Dưỡng",
            "company": "Tập đoàn Vingroup (Vinhomes)",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "35 - 70 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 16,
                  "responseRate": 89,
                  "lastReviewed": "12:00"
            },
            "updated": "30 phút trước",
            "verified": true,
            "skills": [
                  "Bất động sản",
                  "Quản lý đội ngũ",
                  "Tư vấn đầu tư",
                  "Chiến lược bán hàng"
            ],
            "jdSummary": [
                  "Điều hành và dẫn dắt đội ngũ 15 chuyên viên kinh doanh dự án cao cấp.",
                  "Lập kế hoạch phân bổ chỉ tiêu doanh số và tổ chức sự kiện mở bán.",
                  "Chăm sóc tệp khách hàng VIP và các nhà đầu tư lớn."
            ],
            "perks": [
                  "Hoa hồng cao nhất thị trường BĐS",
                  "Phúc lợi nghỉ dưỡng hệ thống Vinpearl định kỳ"
            ],
            "aiMatch": 92
      },
      {
            "id": 103,
            "title": "Chuyên Viên Quan Hệ Khách Hàng Doanh Nghiệp (RM)",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "22 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM (Quận 1)",
            "city": "TP.HCM",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 22,
                  "evaluated14d": 21,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Tín dụng doanh nghiệp",
                  "Tài trợ thương mại",
                  "Thẩm định tài chính",
                  "Quan hệ khách hàng"
            ],
            "jdSummary": [
                  "Tìm kiếm và tiếp cận các doanh nghiệp SME/Commercial để cung cấp dịch vụ tín dụng.",
                  "Phân tích báo cáo tài chính và lập tờ trình cấp hạn mức tín dụng.",
                  "Quản lý danh mục và phòng ngừa rủi ro tín dụng định kỳ."
            ],
            "perks": [
                  "Thưởng hiệu quả kinh doanh hàng quý",
                  "Lộ trình thăng tiến rõ ràng lên Senior RM sau 1 năm"
            ],
            "aiMatch": 94
      },
      {
            "id": 104,
            "title": "Kỹ Sư Giải Pháp Bán Hàng Kỹ Thuật (Pre-Sales Engineer)",
            "company": "CMC Telecom Enterprise",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Pre-Sales",
                  "Cloud Architecture",
                  "Mạng viễn thông",
                  "Thuyết trình kỹ thuật"
            ],
            "jdSummary": [
                  "Phối hợp với bộ phận Sales để tư vấn giải pháp mạng & Cloud cho khách hàng lớn.",
                  "Soạn thảo hồ sơ đề xuất kỹ thuật (RFP, POC) và giải đáp kiến trúc hệ thống.",
                  "Chuyển giao yêu cầu kỹ thuật chi tiết cho đội ngũ triển khai dự án."
            ],
            "perks": [
                  "Được tài trợ 100% chi phí thi chứng chỉ quốc tế AWS/Azure",
                  "Thưởng dự án theo quý"
            ],
            "aiMatch": 90
      },
      {
            "id": 105,
            "title": "Business Development Manager (Khu vực Đông Nam Á)",
            "company": "Shopee Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM (Quận 7)",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 11,
                  "responseRate": 68,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "E-commerce",
                  "Thương thảo nhãn hàng",
                  "Phân tích dữ liệu bán lẻ",
                  "Tiếng Anh lưu loát"
            ],
            "jdSummary": [
                  "Phát triển danh mục nhà bán hàng chiến lược trên sàn thương mại điện tử Shopee.",
                  "Đàm phán các chương trình khuyến mãi độc quyền và tối ưu giá bán lẻ.",
                  "Phân tích chỉ số tăng trưởng GMV để đề xuất chiến lược phát triển ngành hàng."
            ],
            "perks": [
                  "Môi trường Tech năng động quốc tế",
                  "MacBook Pro mới nhất phục vụ công việc"
            ],
            "aiMatch": 88
      },
      {
            "id": 106,
            "title": "Chuyên Viên Tư Vấn Giải Pháp Cloud & AI SaaS",
            "company": "FPT Smart Cloud",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "20 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "SaaS Sales",
                  "AI Chatbot",
                  "Cloud Solutions",
                  "Tư vấn giải pháp"
            ],
            "jdSummary": [
                  "Tiếp nhận lead khách hàng tiềm năng và demo giải pháp FPT.AI, FPT Cloud.",
                  "Đàm phán hợp đồng cung cấp dịch vụ phần mềm cho khối doanh nghiệp tài chính, bán lẻ.",
                  "Chăm sóc tài khoản khách hàng duy trì gia hạn định kỳ (Retention)."
            ],
            "perks": [
                  "Chế độ làm việc linh hoạt Hybrid 2 ngày Remote/tuần",
                  "Bảo hiểm FPT Care"
            ],
            "aiMatch": 93
      },
      {
            "id": 107,
            "title": "Trưởng Nhóm Phát Triển Khách Hàng Ưu Tiên (Priority Banking Lead)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 19,
                  "evaluated14d": 18,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "Priority Banking",
                  "Wealth Management",
                  "Tư vấn đầu tư",
                  "Quản lý quan hệ"
            ],
            "jdSummary": [
                  "Phát triển mạng lưới khách hàng cá nhân cao cấp (Diamond / Priority Club).",
                  "Tư vấn các gói giải pháp tài chính đặc quyền, tiền gửi sinh lời và chứng chỉ quỹ.",
                  "Dẫn dắt đội ngũ 6 chuyên viên quản lý tài sản đạt chỉ tiêu AUM."
            ],
            "perks": [
                  "Hoa hồng theo doanh số không giới hạn",
                  "Ưu đãi thẻ tín dụng và vay mua nhà"
            ],
            "aiMatch": 95
      },
      {
            "id": 108,
            "title": "Quản Lý Bán Hàng Kênh MT Toàn Quốc (National Key Account)",
            "company": "Masan Consumer Holdings",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "40 phút trước",
            "verified": true,
            "skills": [
                  "Key Account MT",
                  "FMCG Sales",
                  "Thương thảo hợp đồng",
                  "Quản lý chuỗi"
            ],
            "jdSummary": [
                  "Quản lý hệ thống chuỗi siêu thị toàn quốc (WinMart, Co.opmart, BigC/Go).",
                  "Đàm phán hợp đồng thương mại năm, chương trình chiết khấu và diện tích trưng bày kệ hàng.",
                  "Tối ưu hóa chỉ số tăng trưởng doanh số và vòng quay hàng tồn kho (Sell-out/Sell-in)."
            ],
            "perks": [
                  "Thưởng doanh số năm cạnh tranh",
                  "Chính sách mua sản phẩm Masan ưu đãi cao"
            ],
            "aiMatch": 94
      },
      {
            "id": 109,
            "title": "Trưởng Bộ Phận Mở Rộng Điểm Bán & Quan Hệ Đối Tác",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Miền Tây",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Trưởng bộ phận",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Site Selection",
                  "Bán lẻ chuỗi",
                  "Đàm phán mặt bằng",
                  "Phân tích lưu lượng"
            ],
            "jdSummary": [
                  "Khảo sát và thẩm định mặt bằng kinh doanh mở mới chuỗi Bách Hóa Xanh và Điện Máy Xanh.",
                  "Thương thảo hợp đồng thuê dài hạn với các chủ bất động sản thương mại.",
                  "Đảm bảo tiến độ bàn giao mặt bằng cho đội ngũ thi công đúng hạn."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Phụ cấp công tác phí đầy đủ"
            ],
            "aiMatch": 91
      },
      {
            "id": 110,
            "title": "Chuyên Viên Kinh Doanh Bất Động Sản Đảo Ngọc Phú Quốc",
            "company": "Tập đoàn Sun Group",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Kiên Giang & TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 10,
                  "responseRate": 77,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "BĐS Nghỉ dưỡng",
                  "Tư vấn Shophouse/Villa",
                  "Quan hệ VIP",
                  "Chăm sóc khách hàng"
            ],
            "jdSummary": [
                  "Tư vấn các sản phẩm biệt thự nghỉ dưỡng, shophouse thương mại tại Nam Phú Quốc.",
                  "Tổ chức site tour đón tiếp nhà đầu tư tham quan thực địa dự án.",
                  "Đồng hành hỗ trợ khách hàng từ thủ tục đặt cọc đến bàn giao sổ hồng."
            ],
            "perks": [
                  "Hoa hồng cao bậc nhất thị trường BĐS nghỉ dưỡng",
                  "Vé máy bay và nghỉ dưỡng Sun World"
            ],
            "aiMatch": 89
      },
      {
            "id": 111,
            "title": "Trưởng Nhóm Tư Vấn Bất Động Sản Công Nghệ (PropTech)",
            "company": "One Mount Real Estate (OneHousing)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "PropTech",
                  "Dữ liệu định giá nhà",
                  "Tư vấn gói vay Techcombank",
                  "Chốt deal"
            ],
            "jdSummary": [
                  "Sử dụng công cụ định giá AI tự động OneHousing để tư vấn nguồn căn hộ cho khách mua.",
                  "Hỗ trợ khách hàng kết nối giải pháp tài chính vay vốn mua nhà nhanh chóng.",
                  "Dẫn dắt đội ngũ 8 chuyên viên tư vấn chuyển đổi nguồn khách hàng tiềm năng."
            ],
            "perks": [
                  "Nguồn lead khách hàng chuẩn xác từ hệ sinh thái One Mount",
                  "Thưởng hoa hồng nhanh"
            ],
            "aiMatch": 93
      },
      {
            "id": 112,
            "title": "Key Account Manager (Kênh Điện Tử & Công Nghệ Tiêu Dùng)",
            "company": "Tiki Corporation",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "22 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Key Account",
                  "E-commerce",
                  "Thương thảo nhãn hàng công nghệ",
                  "Phân tích doanh số"
            ],
            "jdSummary": [
                  "Xây dựng quan hệ hợp tác với các nhãn hàng thiết bị điện tử, gia dụng thông minh chính hãng.",
                  "Lập kế hoạch bán hàng cho các đợt Mega Sale và ngày hội thương hiệu (Super Brand Day).",
                  "Đảm bảo cam kết giao hàng nhanh TikiNOW 2H đạt chuẩn hài lòng khách hàng."
            ],
            "perks": [
                  "Môi trường thương mại điện tử chuyên nghiệp",
                  "Mua hàng Tiki ưu đãi nội bộ"
            ],
            "aiMatch": 90
      },
      {
            "id": 113,
            "title": "Trưởng Phòng Phát Triển Thị Trường BeCorporate",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "B2B Solutions",
                  "Giải pháp di chuyển doanh nghiệp",
                  "Đàm phán C-level",
                  "Team Leadership"
            ],
            "jdSummary": [
                  "Mở rộng gói giải pháp di chuyển và giao vận cho các tập đoàn và ngân hàng lớn tại Việt Nam.",
                  "Xây dựng bảng giá dịch vụ ưu đãi và cơ chế thanh toán hóa đơn doanh nghiệp tập trung.",
                  "Quản lý đội ngũ chuyên viên bán hàng B2B đạt chỉ tiêu doanh số năm."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí không giới hạn",
                  "Thưởng KPI theo kết quả kinh doanh"
            ],
            "aiMatch": 92
      },
      {
            "id": 114,
            "title": "Giám Đốc Kinh Doanh Trung Tâm Chi Nhánh Vùng",
            "company": "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Đà Nẵng & Miền Trung",
            "city": "Đà Nẵng",
            "exp": "3-5 năm",
            "level": "Giám đốc chi nhánh",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Quản trị kinh doanh",
                  "Viễn thông FPT",
                  "Phát triển thuê bao",
                  "Vận hành chi nhánh"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm toàn diện về chỉ tiêu doanh thu và phát triển thuê bao Internet/FPT Play.",
                  "Quản trị đội ngũ hơn 40 nhân sự kinh doanh và kỹ thuật hỗ trợ tại chi nhánh.",
                  "Thiết lập mạng lưới đại lý ủy quyền và chăm sóc khách hàng doanh nghiệp địa phương."
            ],
            "perks": [
                  "Thưởng quý và thưởng cuối năm hấp dẫn",
                  "Bảo hiểm FPT Care cho bản thân và người thân"
            ],
            "aiMatch": 91
      },
      {
            "id": 115,
            "title": "Enterprise Sales Specialist (Giải Pháp Doanh Nghiệp GrabForBusiness)",
            "company": "Grab Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "24 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "B2B Sales",
                  "GrabForBusiness",
                  "Corporate Client",
                  "Thuyết trình hợp đồng"
            ],
            "jdSummary": [
                  "Tìm kiếm và ký kết hợp đồng cung cấp dịch vụ Grab di chuyển và GrabFood cho doanh nghiệp.",
                  "Thiết lập cổng thanh toán tập trung và quản lý tài khoản người dùng của đối tác.",
                  "Duy trì tỷ lệ tái ký hợp đồng dịch vụ trên 90% hàng năm."
            ],
            "perks": [
                  "Gói phụ cấp GrabCredits hàng tháng",
                  "Môi trường làm việc đa văn hóa"
            ],
            "aiMatch": 89
      },
      {
            "id": 116,
            "title": "Chuyên Viên Khách Hàng Doanh Nghiệp Lớn (CIB RM)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Khách hàng doanh nghiệp lớn",
                  "Tín dụng CIB",
                  "Thẩm định hồ sơ",
                  "Bảo lãnh phát hành"
            ],
            "jdSummary": [
                  "Tiếp cận các tập đoàn kinh tế và tổng công ty nhà nước để tài trợ vốn lưu động và dự án.",
                  "Cung cấp các sản phẩm phái sinh tỷ giá, quản lý dòng tiền và tài trợ chuỗi cung ứng.",
                  "Phối hợp với khối Quản trị rủi ro thẩm định phương án vay vốn an toàn."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh top ngành ngân hàng",
                  "Lãi suất vay ưu đãi cho CBNV"
            ],
            "aiMatch": 93
      },
      {
            "id": 117,
            "title": "Trưởng Nhóm Tư Vấn Phần Mềm Quản Trị Doanh Nghiệp MISA AMIS",
            "company": "Công ty Cổ phần MISA",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "20 - 36 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "SaaS Enterprise",
                  "ERP Consultant",
                  "Demo phần mềm",
                  "Chốt sale SME"
            ],
            "jdSummary": [
                  "Tư vấn nền tảng quản trị tài chính, nhân sự và kế toán hợp nhất MISA AMIS cho lãnh đạo SME.",
                  "Xây dựng kịch bản demo giải pháp chuyên sâu theo đặc thù từng lĩnh vực ngành nghề.",
                  "Dẫn dắt nhóm tư vấn giải pháp đạt định mức doanh thu hàng tháng."
            ],
            "perks": [
                  "Thưởng hoa hồng theo hợp đồng minh bạch",
                  "Chế độ đào tạo kỹ năng bán hàng bài bản"
            ],
            "aiMatch": 90
      },
      {
            "id": 118,
            "title": "Chuyên Viên Phát Triển Kênh Bán Hàng Số & Dịch Vụ IoT",
            "company": "Tổng Công ty Dịch vụ Viễn thông VNPT (VNPT VinaPhone)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Kênh bán hàng số",
                  "Giải pháp IoT",
                  "Dịch vụ số VNPT",
                  "Bán hàng đa kênh"
            ],
            "jdSummary": [
                  "Phát triển mạng lưới bán hàng trên các nền tảng ứng dụng di động và website VinaPhone.",
                  "Cung cấp các gói giải pháp chữ ký số, hóa đơn điện tử và giám sát thông minh cho doanh nghiệp.",
                  "Theo dõi và tối ưu hóa tỷ lệ chuyển đổi đơn hàng trực tuyến."
            ],
            "perks": [
                  "Môi trường làm việc ổn định, phúc lợi toàn diện",
                  "Thưởng thành tích quý"
            ],
            "aiMatch": 88
      },
      {
            "id": 119,
            "title": "Chuyên Viên Khách Hàng Doanh Nghiệp FDI (FDI Account Manager)",
            "company": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Bình Dương & Đồng Nai",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "FDI Banking",
                  "Tiếng Anh/Hàn/Hoa lưu loát",
                  "Tín dụng doanh nghiệp",
                  "Thanh toán quốc tế"
            ],
            "jdSummary": [
                  "Khai thác và chăm sóc các doanh nghiệp có vốn đầu tư nước ngoài tại các khu công nghiệp trọng điểm.",
                  "Tư vấn các gói tài trợ thương mại xuất nhập khẩu, thanh toán L/C và tín dụng dài hạn.",
                  "Giao dịch chuyên nghiệp bằng tiếng Anh hoặc ngoại ngữ chuyên biệt."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong ngành tài chính",
                  "Môi trường làm việc quốc tế"
            ],
            "aiMatch": 95
      },
      {
            "id": 120,
            "title": "Trưởng Nhóm Bán Hàng Trực Tiếp (Direct Sales Team Leader)",
            "company": "Ngân hàng TMCP Tiên Phong (TPBank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "20 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Direct Sales",
                  "Thẻ tín dụng TPBank",
                  "Gói vay tiêu dùng",
                  "Đào tạo nhân viên"
            ],
            "jdSummary": [
                  "Điều hành nhóm 10 chuyên viên tư vấn mở thẻ tín dụng và vay tín chấp tiêu dùng.",
                  "Tổ chức các sự kiện tiếp cận khách hàng tại các tòa nhà văn phòng và trung tâm thương mại.",
                  "Đảm bảo tuân thủ quy trình thẩm định sơ bộ và phòng chống gian lận hồ sơ."
            ],
            "perks": [
                  "Hoa hồng không áp trần theo doanh số",
                  "Thưởng thăng tiến nội bộ nhanh"
            ],
            "aiMatch": 87
      },
      {
            "id": 121,
            "title": "Business Development Lead (Khối Bán Lẻ & Chuỗi F&B)",
            "company": "Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "28 - 48 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "FinTech BD",
                  "Payment QR",
                  "Thương thảo chuỗi F&B",
                  "Phát triển đối tác"
            ],
            "jdSummary": [
                  "Mở rộng mạng lưới chấp nhận thanh toán MoMo QR tại các chuỗi bán lẻ và nhà hàng lớn.",
                  "Đàm phán các chương trình khuyến mãi đồng tài trợ (Co-marketing) gia tăng lượng giao dịch.",
                  "Theo dõi hiệu quả sử dụng dịch vụ và giải quyết các bài toán vận hành của đối tác."
            ],
            "perks": [
                  "Thưởng cổ phiếu ESOP định kỳ",
                  "Văn phòng sáng tạo, nhiều tiện ích giải trí"
            ],
            "aiMatch": 94
      },
      {
            "id": 122,
            "title": "Quản Lý Kinh Doanh Dự Án Hạng Sang (Luxury Project Sales)",
            "company": "Tập đoàn Masterise Homes",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "35 - 75 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 8,
                  "responseRate": 72,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "BĐS Hàng hiệu",
                  "Branded Residences",
                  "Tư vấn giới thượng lưu",
                  "Đàm phán quốc tế"
            ],
            "jdSummary": [
                  "Phụ trách kinh doanh các căn hộ bất động sản hàng hiệu tiêu chuẩn quốc tế (Marriott/Ritz-Carlton).",
                  "Xây dựng mối quan hệ tin cậy với các khách hàng có giá trị tài sản ròng siêu cao (UHNWI).",
                  "Chủ trì các buổi tiệc riêng tư và sự kiện triển lãm bất động sản cao cấp."
            ],
            "perks": [
                  "Chế độ hoa hồng dự án hạng sang vượt trội",
                  "Môi trường làm việc chuẩn quốc tế"
            ],
            "aiMatch": 92
      },
      {
            "id": 123,
            "title": "Key Account Manager (Kênh Chuỗi Bán Lẻ Điện Máy Toàn Quốc)",
            "company": "Samsung Vina Electronics",
            "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 52 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Consumer Electronics",
                  "Key Account Samsung",
                  "Trade Marketing",
                  "Dự báo doanh số"
            ],
            "jdSummary": [
                  "Quản lý doanh số bán hàng sản phẩm TV, tủ lạnh, máy giặt Samsung qua các chuỗi bán lẻ lớn.",
                  "Lập kế hoạch phân bổ tồn kho và tối ưu chính sách giá cạnh tranh theo mùa vụ.",
                  "Phối hợp với Trade Marketing triển khai khu vực trải nghiệm công nghệ tại điểm bán."
            ],
            "perks": [
                  "Chế độ lương thưởng tập đoàn công nghệ số 1",
                  "Ưu đãi mua thiết bị Samsung nội bộ"
            ],
            "aiMatch": 93
      },
      {
            "id": 124,
            "title": "Giám Đốc Bán Hàng Miền Bắc (Regional Sales Manager FMCG)",
            "company": "Tập đoàn KIDO (KIDO Group)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & Các tỉnh phía Bắc",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Giám đốc vùng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "9 giờ trước",
            "verified": true,
            "skills": [
                  "FMCG Sales",
                  "Quản trị hệ thống phân phối",
                  "Kênh GT & MT",
                  "Chiến lược thị phần"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược kinh doanh và mở rộng độ phủ hệ thống phân phối dầu ăn, kem và bánh kẹo KIDO.",
                  "Quản lý hệ thống nhà phân phối và dẫn dắt đội ngũ hơn 100 nhân viên giám sát bán hàng.",
                  "Chịu trách nhiệm trực tiếp về doanh số và chỉ tiêu lợi nhuận gộp toàn miền Bắc."
            ],
            "perks": [
                  "Gói thưởng hiệu quả kinh doanh cuối năm lớn",
                  "Xe ô tô đưa đón công tác"
            ],
            "aiMatch": 91
      },
      {
            "id": 201,
            "title": "Senior Fullstack Engineer (ReactJS, Node.js & AWS)",
            "company": "FPT Software Global",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội (Cầu Giấy)",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 25,
                  "evaluated14d": 24,
                  "responseRate": 96,
                  "lastReviewed": "12:00"
            },
            "updated": "10 phút trước",
            "verified": true,
            "skills": [
                  "ReactJS",
                  "Node.js",
                  "TypeScript",
                  "AWS Microservices"
            ],
            "jdSummary": [
                  "Thiết kế kiến trúc hệ thống và phát triển nền tảng FinTech quy mô hàng triệu users.",
                  "Tối ưu hóa hiệu năng render phía client và API throughput phía backend.",
                  "Review code và hướng dẫn chuyên môn cho các kỹ sư cấp dưới."
            ],
            "perks": [
                  "Chế độ làm việc linh hoạt Hybrid",
                  "Cơ hội onsite ngắn hạn tại Nhật Bản và Singapore"
            ],
            "aiMatch": 98
      },
      {
            "id": 202,
            "title": "Principal Software Architect (AI Camera & Mobile OS)",
            "company": "Samsung R&D Institute Vietnam (SRV)",
            "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "55 - 85 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội (Tây Hồ)",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Architect / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "System Architecture",
                  "C/C++",
                  "AI Algorithms",
                  "Mobile OS Platform"
            ],
            "jdSummary": [
                  "Chủ trì thiết kế kiến trúc phần mềm lõi cho camera thông minh trên các dòng flagship.",
                  "Nghiên cứu áp dụng các mô hình học sâu (Deep Learning) tối ưu trên chip bán dẫn NPU.",
                  "Phối hợp với trung tâm R&D tại Hàn Quốc để đồng bộ tiêu chuẩn kỹ thuật."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh bậc nhất ngành công nghệ",
                  "Xe đưa đón CBNV khắp Hà Nội"
            ],
            "aiMatch": 95
      },
      {
            "id": 203,
            "title": "Senior Backend Engineer (Golang, Microservices)",
            "company": "VNG Corporation",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM (Quận 7)",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 19,
                  "evaluated14d": 17,
                  "responseRate": 89,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Golang",
                  "Distributed Systems",
                  "Kafka",
                  "Redis Cluster",
                  "K8s"
            ],
            "jdSummary": [
                  "Xây dựng các dịch vụ microservices chịu tải cao (High Concurrency) phục vụ ZaloPay & Games.",
                  "Thiết kế cơ chế cache đa tầng và tối ưu hóa truy vấn dữ liệu phân tán.",
                  "Đảm bảo hệ thống đạt độ sẵn sàng cao 99.99% (High Availability)."
            ],
            "perks": [
                  "Ăn trưa miễn phí tại VNG Campus",
                  "Khu phức hợp thể thao, gym và hồ bơi nội bộ"
            ],
            "aiMatch": 94
      },
      {
            "id": 204,
            "title": "AI Research Scientist / Computer Vision Specialist",
            "company": "VinAI Research",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 75 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Chuyên gia nghiên cứu",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 10,
                  "responseRate": 83,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Computer Vision",
                  "PyTorch",
                  "Autonomous Driving",
                  "Deep Learning"
            ],
            "jdSummary": [
                  "Nghiên cứu các thuật toán thị giác máy tính cho hệ thống lái xe tự hành Smart Mobility.",
                  "Công bố các bài báo khoa học tại các hội nghị hàng đầu thế giới (CVPR, ICCV, NeurIPS).",
                  "Triển khai mô hình AI chạy thực tế trên hệ thống xe điện thông minh."
            ],
            "perks": [
                  "Tài nguyên siêu máy tính GPU NVIDIA A100 không giới hạn",
                  "Tài trợ tham dự hội thảo quốc tế"
            ],
            "aiMatch": 91
      },
      {
            "id": 205,
            "title": "Senior DevOps / Cloud Platform Engineer (AWS, K8s)",
            "company": "One Mount Group",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Hybrid",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 10,
                  "responseRate": 71,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Kubernetes",
                  "Terraform",
                  "CI/CD Pipeline",
                  "AWS Security"
            ],
            "jdSummary": [
                  "Quản lý hạ tầng đám mây đa dịch vụ phục vụ hệ sinh thái VinID và VinShop.",
                  "Tự động hóa hoàn toàn quy trình CI/CD từ dev sang production.",
                  "Giám sát hệ thống với Prometheus, Grafana và phản ứng sự cố 24/7."
            ],
            "perks": [
                  "Gói khám sức khỏe cao cấp tại Vinmec",
                  "Làm việc linh hoạt 2 ngày WFH"
            ],
            "aiMatch": 87
      },
      {
            "id": 206,
            "title": "Tech Lead Mobile Engineer (Flutter & Native)",
            "company": "MoMo Fintech (M-Service)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 60 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Tech Lead",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Flutter",
                  "iOS (Swift)",
                  "Android (Kotlin)",
                  "Clean Architecture"
            ],
            "jdSummary": [
                  "Dẫn dắt đội ngũ kỹ sư mobile phát triển các mini-apps trên siêu ứng dụng MoMo.",
                  "Định hình chuẩn kiến trúc Mobile Clean Architecture và tối ưu hóa thời gian mở app.",
                  "Phối hợp với Product Team để mang lại trải nghiệm UX mượt mà 60fps."
            ],
            "perks": [
                  "Thưởng cổ phiếu ESOP theo hiệu quả công việc",
                  "Bảo hiểm PVI gia đình"
            ],
            "aiMatch": 95
      },
      {
            "id": 207,
            "title": "Kỹ Sư Giải Pháp Mạng 5G & Cloud Core (Senior Network Engineer)",
            "company": "Tổng Công ty Mạng lưới Viettel (Viettel Networks)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 52 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "20 phút trước",
            "verified": true,
            "skills": [
                  "5G Core Network",
                  "NFV/SDN",
                  "OpenRAN",
                  "Cisco/Juniper CCNP"
            ],
            "jdSummary": [
                  "Thiết kế và tối ưu mạng lõi 5G SA (Standalone) phục vụ hạ tầng viễn thông quốc gia.",
                  "Triển khai ảo hóa mạng (Network Functions Virtualization) trên nền tảng OpenStack.",
                  "Khắc phục sự cố mạng mức L3 và đảm bảo an toàn an ninh mạng viễn thông."
            ],
            "perks": [
                  "Môi trường nghiên cứu công nghệ hàng đầu",
                  "Chính sách đãi ngộ vượt trội của Viettel"
            ],
            "aiMatch": 93
      },
      {
            "id": 208,
            "title": "Principal Java Engineer (Core Banking Microservices)",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "45 - 70 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Principal / Lead",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "35 phút trước",
            "verified": true,
            "skills": [
                  "Java 21",
                  "Spring Boot 3",
                  "Kafka Event-Driven",
                  "PostgreSQL Distributed"
            ],
            "jdSummary": [
                  "Thiết kế kiến trúc hệ thống Core Banking thế hệ mới phục vụ chuyển đổi số Techcombank.",
                  "Đảm bảo chuẩn tuân thủ bảo mật tài chính ngân hàng (PCI-DSS, ISO 27001).",
                  "Cố vấn kỹ thuật và xây dựng chuẩn mã nguồn cho 50+ kỹ sư phần mềm."
            ],
            "perks": [
                  "Thưởng hiệu quả hàng năm hấp dẫn",
                  "Bảo hiểm sức khỏe cao cấp toàn diện"
            ],
            "aiMatch": 97
      },
      {
            "id": 209,
            "title": "Senior Frontend Developer (Vue.js / Nuxt.js & Micro-Frontend)",
            "company": "Công ty Công nghệ Thông tin VNPT (VNPT-IT)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "25 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "50 phút trước",
            "verified": true,
            "skills": [
                  "Vue.js 3",
                  "Nuxt.js",
                  "TypeScript",
                  "Module Federation",
                  "TailwindCSS"
            ],
            "jdSummary": [
                  "Phát triển cổng dịch vụ công quốc gia và hệ thống phần mềm quản lý y tế VNPT-eGov.",
                  "Xây dựng kiến trúc Micro-Frontend giúp các module phát triển và triển khai độc lập.",
                  "Tối ưu hóa khả năng truy cập Accessibility (a11y) và tốc độ tải trang Core Web Vitals."
            ],
            "perks": [
                  "Phúc lợi ổn định, thưởng dự án chính phủ",
                  "Hỗ trợ đào tạo chứng chỉ quốc tế"
            ],
            "aiMatch": 91
      },
      {
            "id": 210,
            "title": "Data Infrastructure Engineer (Kafka, Spark & ClickHouse)",
            "company": "Shopee Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 58 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM (Quận 7)",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Big Data",
                  "Apache Spark",
                  "Kafka Streaming",
                  "ClickHouse",
                  "Hadoop HDFS"
            ],
            "jdSummary": [
                  "Vận hành cụm dữ liệu phân tán quy mô Petabytes xử lý hàng tỷ đơn hàng mỗi ngày.",
                  "Tối ưu hóa pipeline streaming thời gian thực phục vụ báo cáo doanh thu Mega Campaign.",
                  "Phối hợp với Data Science Team để tối ưu hóa truy vấn dữ liệu lớn."
            ],
            "perks": [
                  "Môi trường chuẩn Silicon Valley",
                  "MacBook Pro M3 Max và trợ cấp công việc"
            ],
            "aiMatch": 94
      },
      {
            "id": 211,
            "title": "Senior C++ Engineer (Real-time Audio/Video Streaming)",
            "company": "VNG Corporation (Zalo Platform)",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "38 - 60 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Modern C++",
                  "WebRTC",
                  "Media Codec (H.264/AV1)",
                  "Network Socket",
                  "Multithreading"
            ],
            "jdSummary": [
                  "Tối ưu giao thức truyền tải âm thanh và hình ảnh cho tính năng gọi điện thoại Zalo Call.",
                  "Xử lý độ trễ thấp (Ultra Low Latency) và khả năng thích ứng mạng yếu (Jitter Buffer).",
                  "Viết mã nguồn tối ưu hóa hiệu năng CPU và tiết kiệm pin trên thiết bị di động."
            ],
            "perks": [
                  "Làm việc trên sản phẩm phục vụ 75 triệu người dùng",
                  "Thưởng performance theo quý"
            ],
            "aiMatch": 96
      },
      {
            "id": 212,
            "title": "Embedded Linux Software Engineer (ADAS / Autonomous Car)",
            "company": "Tập đoàn VinFast Toàn Cầu",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": false,
            "location": "Hải Phòng & Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Embedded C/C++",
                  "Yocto Linux",
                  "QNX RTOS",
                  "CAN Bus",
                  "AUTOSAR"
            ],
            "jdSummary": [
                  "Phát triển phần mềm nhúng điều khiển hệ thống hỗ trợ lái xe nâng cao ADAS trên xe điện VinFast.",
                  "Tích hợp cảm biến radar, lidar và camera nhận diện làn đường thời gian thực.",
                  "Đảm bảo tiêu chuẩn an toàn chức năng ô tô quốc tế ISO 26262 (ASIL D)."
            ],
            "perks": [
                  "Ưu đãi mua ô tô điện VinFast đặc quyền",
                  "Xe đưa đón CBNV Hà Nội - Hải Phòng"
            ],
            "aiMatch": 92
      },
      {
            "id": 213,
            "title": "Senior Mobile Developer (iOS Swift & Android Kotlin)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 20,
                  "evaluated14d": 19,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Swift/SwiftUI",
                  "Kotlin/Jetpack Compose",
                  "Mobile Security",
                  "Biometrics eKYC"
            ],
            "jdSummary": [
                  "Phát triển các tính năng chuyển khoản, đầu tư và tích điểm loyalty trên App MBBank.",
                  "Tích hợp giải pháp xác thực sinh trắc học khuôn mặt eKYC bảo mật cao theo chuẩn NHNN.",
                  "Tối ưu hóa trải nghiệm giao diện người dùng mượt mà và tương thích đa kích thước màn hình."
            ],
            "perks": [
                  "Thưởng cuối năm 4-6 tháng lương",
                  "Chế độ phụ cấp công nghệ hàng tháng"
            ],
            "aiMatch": 95
      },
      {
            "id": 214,
            "title": "Senior Security Engineer (SOC & Red Team Penetration Testing)",
            "company": "Công ty An ninh mạng CMC (CMC Cyber Security)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Penetration Testing",
                  "SIEM / SOC",
                  "CEH / OSCP",
                  "Reverse Engineering",
                  "Malware Analysis"
            ],
            "jdSummary": [
                  "Thực hiện kiểm thử xâm nhập (Pentest) định kỳ cho các hệ thống ngân hàng và cơ quan chính phủ.",
                  "Giám sát và phân tích các cuộc tấn công mạng DDoS, Ransomware trên trung tâm SOC.",
                  "Xây dựng quy trình ứng cứu sự cố bảo mật thông tin chuẩn quốc tế."
            ],
            "perks": [
                  "Được tài trợ 100% lệ phí thi chứng chỉ quốc tế OSCP/CISSP",
                  "Môi trường an ninh mạng top 1"
            ],
            "aiMatch": 90
      },
      {
            "id": 215,
            "title": "Lead Data Engineer (Real-time Recommendation Engine)",
            "company": "Tiki Corporation",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 62 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Lead / Principal",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Data Architecture",
                  "Flink Streaming",
                  "Vector DB (Milvus)",
                  "Python",
                  "Airflow"
            ],
            "jdSummary": [
                  "Chủ trì kiến trúc nền tảng dữ liệu gợi ý sản phẩm cá nhân hóa theo hành vi người dùng.",
                  "Xây dựng luồng xử lý dữ liệu thời gian thực với Apache Flink và lưu trữ trên Vector Database.",
                  "Dẫn dắt đội ngũ 6 kỹ sư dữ liệu tối ưu hóa thời gian tính toán model từ vài giờ xuống mili-giây."
            ],
            "perks": [
                  "Chế độ cổ phiếu ESOP hấp dẫn",
                  "Bảo hiểm sức khỏe quốc tế"
            ],
            "aiMatch": 93
      },
      {
            "id": 216,
            "title": "Senior Backend Engineer (Go & High Concurrency Dispatch)",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Golang",
                  "Geo-spatial Indexing",
                  "Redis Cluster",
                  "High Concurrency",
                  "Docker/K8s"
            ],
            "jdSummary": [
                  "Thiết kế thuật toán điều phối xe (Ride Matching) tối ưu khoảng cách và thời gian đón khách.",
                  "Xử lý hàng trăm nghìn truy vấn tìm xe đồng thời vào các khung giờ cao điểm và mưa bão.",
                  "Tối ưu hóa kiến trúc hạ tầng giảm thiểu chi phí máy chủ đám mây AWS."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí",
                  "Thưởng nóng dự án phát triển công nghệ mới"
            ],
            "aiMatch": 92
      },
      {
            "id": 217,
            "title": "Chuyên Gia Giải Pháp ERP SAP S/4HANA (Lead SAP Consultant)",
            "company": "Công ty Hệ thống Thông tin FPT (FPT IS)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Chuyên gia cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "SAP S/4HANA",
                  "FI/CO Module",
                  "Tư vấn triển khai ERP",
                  "Thiết kế quy trình doanh nghiệp"
            ],
            "jdSummary": [
                  "Chủ trì tư vấn và triển khai giải pháp ERP SAP S/4HANA cho các tập đoàn sản xuất lớn.",
                  "Khảo sát yêu cầu nghiệp vụ tài chính, chuỗi cung ứng và thiết kế cấu hình phân hệ FI/CO.",
                  "Đào tạo chuyển giao công nghệ và hỗ trợ người dùng go-live thành công."
            ],
            "perks": [
                  "Thưởng dự án theo từng giai đoạn nghiệm thu",
                  "Bảo hiểm FPT Care"
            ],
            "aiMatch": 91
      },
      {
            "id": 218,
            "title": "Kỹ Sư An Toàn Thông Tin & Phòng Chống Gian Lận (CyberSec Fraud Detection)",
            "company": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Fraud Detection",
                  "AI Pattern Recognition",
                  "An toàn giao dịch thẻ",
                  "PCI-DSS"
            ],
            "jdSummary": [
                  "Xây dựng hệ thống cảnh báo sớm giao dịch đáng ngờ và ngăn chặn gian lận thẻ tín dụng trực tuyến.",
                  "Ứng dụng học máy (Machine Learning) để phát hiện tài khoản bất thường theo thời gian thực.",
                  "Đảm bảo tuyệt đối an toàn bảo mật tài sản cho hàng chục triệu khách hàng Vietcombank."
            ],
            "perks": [
                  "Môi trường chuẩn ngân hàng nhà nước số 1",
                  "Chế độ đãi ngộ vượt trội dài hạn"
            ],
            "aiMatch": 95
      },
      {
            "id": 219,
            "title": "Senior Python / AI Engineer (LLM & CV Matching Model)",
            "company": "TopCV Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 22,
                  "evaluated14d": 21,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Python FastApi",
                  "LangChain",
                  "OpenAI/Anthropic API",
                  "Semantic Search",
                  "Vector DB"
            ],
            "jdSummary": [
                  "Phát triển mô hình AI phân tích hồ sơ ứng viên và khớp nối tự động với yêu cầu tuyển dụng.",
                  "Tối ưu hóa thuật toán tìm kiếm ngữ nghĩa (Semantic Search) giúp gợi ý việc làm chính xác.",
                  "Xây dựng hệ thống prompt engineering và fine-tune mô hình ngôn ngữ lớn (LLM)."
            ],
            "perks": [
                  "Được làm việc với dữ liệu tuyển dụng lớn nhất Việt Nam",
                  "Môi trường làm việc trẻ trung sáng tạo"
            ],
            "aiMatch": 94
      },
      {
            "id": 220,
            "title": "Senior Cloud Architect (AWS & Google Cloud Platform)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Architect / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "AWS Solutions Architect",
                  "GCP Multi-cloud",
                  "Landing Zone",
                  "FinOps",
                  "IaC Terraform"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược chuyển đổi toàn bộ ứng dụng ngân hàng lên hạ tầng đám mây đa nền tảng.",
                  "Thiết kế kiến trúc mạng ảo (VPC/Direct Connect) và hệ thống phân quyền IAM an toàn tuyệt đối.",
                  "Áp dụng thực hành FinOps tối ưu hóa chi phí vận hành hạ tầng đám mây định kỳ."
            ],
            "perks": [
                  "Gói thu nhập hấp dẫn thuộc top đầu thị trường",
                  "Cơ hội thăng tiến lên Head of Cloud"
            ],
            "aiMatch": 96
      },
      {
            "id": 221,
            "title": "Lead Automation QA Engineer (Playwright, Selenium & CI/CD)",
            "company": "TMA Solutions",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "26 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Bình Định",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Lead QA",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Playwright",
                  "Selenium WebDriver",
                  "Java/TypeScript",
                  "Jenkins Pipeline",
                  "Performance Testing"
            ],
            "jdSummary": [
                  "Xây dựng framework kiểm thử tự động hóa toàn diện từ API đến End-to-End UI.",
                  "Tích hợp bộ kiểm thử tự động vào quy trình CI/CD đảm bảo chất lượng release hàng tuần.",
                  "Đào tạo và nâng cao năng lực viết test automation cho đội ngũ kiểm thử phần mềm."
            ],
            "perks": [
                  "Chế độ onsite Bắc Mỹ và châu Âu",
                  "Môi trường làm việc năng động bền vững"
            ],
            "aiMatch": 89
      },
      {
            "id": 222,
            "title": "Senior Fullstack Developer (.NET Core & Angular)",
            "company": "KMS Technology",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Đà Nẵng",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  ".NET 8 C#",
                  "Angular 17",
                  "SQL Server Enterprise",
                  "Azure DevOps",
                  "Clean Code"
            ],
            "jdSummary": [
                  "Phát triển các sản phẩm phần mềm SaaS phục vụ khách hàng doanh nghiệp tại thị trường Mỹ.",
                  "Xây dựng kiến trúc RESTful API chuẩn mực và tối ưu hóa xử lý cơ sở dữ liệu lớn.",
                  "Thực hiện code review và đảm bảo độ bao phủ unit test đạt tối thiểu 80%."
            ],
            "perks": [
                  "Gói bảo hiểm sức khỏe quốc tế cao cấp",
                  "Phụ cấp học tiếng Anh và chứng chỉ Microsoft"
            ],
            "aiMatch": 92
      },
      {
            "id": 223,
            "title": "Senior Solutions Architect (Enterprise FinTech)",
            "company": "NashTech Vietnam",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "45 - 68 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Solutions Architect",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Solutions Architecture",
                  "FinTech Platforms",
                  "Domain-Driven Design",
                  "Cloud Native"
            ],
            "jdSummary": [
                  "Tư vấn kiến trúc công nghệ toàn diện cho các định chế tài chính và ngân hàng tại Anh Quốc và Úc.",
                  "Thiết kế hệ thống thanh toán xuyên biên giới với khả năng mở rộng quy mô lớn.",
                  "Lãnh đạo kỹ thuật cho các đội ngũ phát triển đa quốc gia."
            ],
            "perks": [
                  "Cơ hội công tác tại văn phòng Luân Đôn định kỳ",
                  "Gói lương thưởng cạnh tranh quốc tế"
            ],
            "aiMatch": 95
      },
      {
            "id": 224,
            "title": "Senior Java Backend Engineer (Payment Gateway & Core QR)",
            "company": "Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 19,
                  "evaluated14d": 18,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Java Core",
                  "High Throughput Gateway",
                  "ISO 8583 Message",
                  "PostgreSQL",
                  "Redis"
            ],
            "jdSummary": [
                  "Phát triển hệ thống xử lý giao dịch cổng thanh toán VNPAY-QR kết nối hơn 40 ngân hàng.",
                  "Tối ưu hóa thời gian xử lý giao dịch dưới 200ms với độ tin cậy tuyệt đối 99.999%.",
                  "Đảm bảo các tiêu chuẩn mã hóa dữ liệu nhạy cảm của khách hàng."
            ],
            "perks": [
                  "Thưởng Tết và thưởng dự án hàng đầu ngành FinTech",
                  "Gói khám sức khỏe toàn diện"
            ],
            "aiMatch": 94
      },
      {
            "id": 301,
            "title": "Trưởng Nhóm Digital Marketing & Performance Ads",
            "company": "VNG Corporation (Zalo)",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 42 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 14,
                  "responseRate": 87,
                  "lastReviewed": "12:00"
            },
            "updated": "20 phút trước",
            "verified": true,
            "skills": [
                  "Performance Marketing",
                  "Meta Ads",
                  "Google Ads",
                  "Data Analytics",
                  "CRO"
            ],
            "jdSummary": [
                  "Quản lý ngân sách Digital Ads hàng tháng cho các sản phẩm công nghệ trọng điểm.",
                  "Tối ưu hóa phễu chuyển đổi (Funnel Optimization) và chỉ số CAC / LTV.",
                  "Phối hợp với Creative Team để A/B testing thông điệp truyền thông."
            ],
            "perks": [
                  "Môi trường năng động số 1 ngành Tech",
                  "Ngân sách thử nghiệm chiến dịch lớn"
            ],
            "aiMatch": 93
      },
      {
            "id": 302,
            "title": "Senior Brand Manager (Ngành Tiêu Dùng FMCG)",
            "company": "Masan Consumer Holdings",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Trưởng phòng / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "45 phút trước",
            "verified": true,
            "skills": [
                  "Brand Strategy",
                  "Product Launch",
                  "Trade Marketing",
                  "Quản trị ngân sách"
            ],
            "jdSummary": [
                  "Xây dựng chiến lược định vị và phát triển thị phần thương hiệu quốc gia.",
                  "Lập kế hoạch ra mắt sản phẩm mới (NPD) trên mạng lưới phân phối toàn quốc.",
                  "Đo lường sức khỏe thương hiệu (Brand Health Tracking) định kỳ hàng quý."
            ],
            "perks": [
                  "Thưởng doanh số năm cạnh tranh",
                  "Chính sách mua sản phẩm Masan ưu đãi cao"
            ],
            "aiMatch": 95
      },
      {
            "id": 303,
            "title": "Chuyên Viên SEO & Growth Marketing",
            "company": "Shopee Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 9,
                  "responseRate": 82,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Technical SEO",
                  "Keyword Research",
                  "Google Analytics 4",
                  "Content Strategy"
            ],
            "jdSummary": [
                  "Tối ưu hóa thứ hạng tìm kiếm tự nhiên của hàng triệu trang sản phẩm ngành hàng.",
                  "Nghiên cứu xu hướng từ khóa mùa vụ và chỉ đạo nội dung bài viết chất lượng.",
                  "Phân tích lưu lượng organic traffic và tỷ lệ thoát trang."
            ],
            "perks": [
                  "Làm việc cùng các chuyên gia SEO đầu ngành khu vực Đông Nam Á",
                  "Thưởng dự án Mega Sale"
            ],
            "aiMatch": 89
      },
      {
            "id": 304,
            "title": "Public Relations (PR) & Communications Manager",
            "company": "Tập đoàn VinFast Toàn Cầu",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Quan hệ báo chí",
                  "Quản trị khủng hoảng truyền thông",
                  "Thông cáo báo chí",
                  "Event PR"
            ],
            "jdSummary": [
                  "Xây dựng mối quan hệ bền vững với các cơ quan thông tấn báo chí trong và ngoài nước.",
                  "Soạn thảo các thông cáo báo chí, bài phát biểu cho lãnh đạo cấp cao của tập đoàn.",
                  "Chủ động phát hiện và xử lý khủng hoảng truyền thông mạng xã hội 24/7."
            ],
            "perks": [
                  "Ưu đãi mua ô tô điện VinFast đặc quyền",
                  "Môi trường toàn cầu chuyên nghiệp"
            ],
            "aiMatch": 92
      },
      {
            "id": 305,
            "title": "Content Marketing Lead & Social Creative",
            "company": "Sun Group Corporation",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Đà Nẵng & Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 9,
                  "responseRate": 69,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Content Direction",
                  "Viral Video",
                  "TikTok Marketing",
                  "Storytelling Du lịch"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm định hướng nội dung sáng tạo cho các điểm đến Sun World.",
                  "Sản xuất video ngắn triệu view trên TikTok, YouTube Shorts và Facebook Reels.",
                  "Quản lý chất lượng bài viết của đội ngũ copywriter và agency bên ngoài."
            ],
            "perks": [
                  "Vé tham quan miễn phí các công viên Sun World",
                  "Nghỉ dưỡng Sun Hospitality hàng năm"
            ],
            "aiMatch": 86
      },
      {
            "id": 306,
            "title": "Senior Media Planner & Account Manager",
            "company": "Dentsu Redder Vietnam",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 10,
                  "responseRate": 83,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Media Planning",
                  "Agency Account",
                  "Đàm phán Booking",
                  "Chiến dịch 360"
            ],
            "jdSummary": [
                  "Tư vấn kế hoạch truyền thông tích hợp (Integrated Media Plan) cho các thương hiệu Fortune 500.",
                  "Phân bổ ngân sách truyền thông trên các kênh truyền hình, OOH và digital platforms.",
                  "Điều phối tiến độ chiến dịch và nghiệm thu KPI truyền thông với khách hàng."
            ],
            "perks": [
                  "Được vinh danh tại các giải thưởng ngành truyền thông",
                  "Môi trường Agency trẻ trung"
            ],
            "aiMatch": 90
      },
      {
            "id": 307,
            "title": "Trưởng Phòng Truyền Thông & Tiếp Thị Kỹ Thuật Số",
            "company": "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "Digital Strategy",
                  "Omnichannel Marketing",
                  "Quản lý ngân sách",
                  "Brand Awareness"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược tiếp thị đa kênh cho các dòng sản phẩm Internet, FPT Camera và Smart Home.",
                  "Quản lý ngân sách Digital Marketing hàng chục tỷ đồng mỗi năm.",
                  "Lãnh đạo đội ngũ 12 chuyên viên tiếp thị số và truyền thông thương hiệu."
            ],
            "perks": [
                  "Chế độ phúc lợi tập đoàn FPT toàn diện",
                  "Thưởng hoàn thành kế hoạch năm"
            ],
            "aiMatch": 94
      },
      {
            "id": 308,
            "title": "Quản Lý Chiến Dịch Marketing Chuỗi Bách Hóa Xanh",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý chiến dịch",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "40 phút trước",
            "verified": true,
            "skills": [
                  "Retail Marketing",
                  "Khuyến mãi chuỗi",
                  "Trade Marketing",
                  "Phân tích hành vi mua sắm"
            ],
            "jdSummary": [
                  "Lên kế hoạch và triển khai các chiến dịch khuyến mãi lớn tại hơn 1.700 điểm bán Bách Hóa Xanh.",
                  "Phối hợp với bộ phận thu mua (Buying) đàm phán quyền lợi tài trợ từ các nhà cung cấp lớn.",
                  "Đo lường hiệu quả tăng trưởng lượt khách ghé cửa hàng (Footfall Traffic) và giá trị giỏ hàng."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Môi trường làm việc năng động thực chiến"
            ],
            "aiMatch": 93
      },
      {
            "id": 309,
            "title": "Brand Experience & Employer Branding Specialist",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 36 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Employer Branding",
                  "Trải nghiệm thương hiệu",
                  "Tổ chức sự kiện",
                  "Sáng tạo nội dung"
            ],
            "jdSummary": [
                  "Xây dựng hình ảnh Thương hiệu Nhà tuyển dụng số 1 ngành ngân hàng qua các chiến dịch truyền thông.",
                  "Tổ chức các sự kiện trải nghiệm thương hiệu (Techcombank Marathon, Tech Day).",
                  "Đo lường mức độ tương tác và nhận diện thương hiệu trên các kênh mạng xã hội chuyên nghiệp."
            ],
            "perks": [
                  "Môi trường ngân hàng chuyển đổi số xuất sắc",
                  "Bảo hiểm chăm sóc sức khỏe gia đình"
            ],
            "aiMatch": 91
      },
      {
            "id": 310,
            "title": "Senior Growth Marketing Manager (Acquisition & Retention)",
            "company": "Grab Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior Manager",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Growth Marketing",
                  "User Acquisition",
                  "Retention Funnel",
                  "A/B Testing",
                  "SQL"
            ],
            "jdSummary": [
                  "Phát triển các chiến lược tăng trưởng người dùng mới cho dịch vụ GrabFood và GrabMart.",
                  "Thiết kế các chương trình khách hàng thân thiết và thử nghiệm mã ưu đãi cá nhân hóa.",
                  "Tối ưu hóa chi phí thu hút khách hàng (CAC) và giá trị vòng đời (LTV)."
            ],
            "perks": [
                  "Gói phụ cấp GrabCredits hàng tháng",
                  "Cơ hội thăng tiến khu vực Đông Nam Á"
            ],
            "aiMatch": 95
      },
      {
            "id": 311,
            "title": "Trưởng Nhóm Marketing Kỹ Thuật Số & B2B Branding",
            "company": "Tổng Công ty Cổ phần Bưu chính Viettel (Viettel Post)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "B2B Marketing",
                  "Logistics Branding",
                  "Lead Generation",
                  "Chiến dịch số"
            ],
            "jdSummary": [
                  "Định vị thương hiệu Viettel Post là đối tác chuyển phát logistics công nghệ tin cậy hàng đầu.",
                  "Triển khai các chiến dịch tìm kiếm khách hàng doanh nghiệp thương mại điện tử lớn.",
                  "Sản xuất các tài liệu giới thiệu giải pháp logistics thông minh (Case Study, Whitepaper)."
            ],
            "perks": [
                  "Chế độ đãi ngộ quân đội kỷ luật và chuyên nghiệp",
                  "Thưởng thành tích quý"
            ],
            "aiMatch": 90
      },
      {
            "id": 312,
            "title": "Creative Lead & Copywriter (Chiến Dịch Siêu Ứng Dụng MoMo)",
            "company": "Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Creative Lead",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Creative Concept",
                  "Copywriting viral",
                  "Gamification Marketing",
                  "Chiến dịch Tết"
            ],
            "jdSummary": [
                  "Chủ trì ý tưởng sáng tạo cho chiến dịch Lắc Xì Tết và các ngày hội siêu deal hàng tháng.",
                  "Sáng tạo slogan, kịch bản video viral và thông điệp truyền thông gây bão mạng xã hội.",
                  "Định hình phong cách ngôn ngữ trẻ trung, hóm hỉnh và gần gũi của thương hiệu MoMo."
            ],
            "perks": [
                  "Môi trường sáng tạo không giới hạn",
                  "Thưởng cổ phiếu ESOP định kỳ"
            ],
            "aiMatch": 94
      },
      {
            "id": 313,
            "title": "Senior Account Executive (Integrated Communications Agency)",
            "company": "Ogilvy Vietnam",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior Account",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 9,
                  "responseRate": 75,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Client Management",
                  "Agency Pitching",
                  "Chiến dịch truyền thông 360",
                  "Creative Brief"
            ],
            "jdSummary": [
                  "Quản lý mối quan hệ và tiếp nhận yêu cầu chiến dịch từ các nhãn hàng quốc tế đa quốc gia.",
                  "Viết Creative Brief truyền cảm hứng cho đội ngũ thiết kế và sáng tạo nội dung.",
                  "Điều phối tiến độ sản xuất TVC, digital assets và giám sát nghiệm thu hợp đồng."
            ],
            "perks": [
                  "Môi trường Agency truyền thông số 1 thế giới",
                  "Cơ hội giải thưởng quốc tế Cannes Lions"
            ],
            "aiMatch": 88
      },
      {
            "id": 314,
            "title": "Social Media & Community Manager (Kênh Be Xe Ô Tô / Xe Máy)",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Hà Nội",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Community Building",
                  "Social Fanpage",
                  "Content Bắt Trend",
                  "Xử lý khủng hoảng"
            ],
            "jdSummary": [
                  "Xây dựng và phát triển cộng đồng người dùng và tài xế Be trên Facebook và TikTok.",
                  "Sáng tạo nội dung bắt trend hài hước thu hút hàng triệu lượt tương tác tự nhiên mỗi tuần.",
                  "Lắng nghe phản hồi của người dùng và hỗ trợ giải đáp thắc mắc dịch vụ kịp thời."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí",
                  "Môi trường làm việc cởi mở, thoải mái"
            ],
            "aiMatch": 89
      },
      {
            "id": 315,
            "title": "Chuyên Viên Tiếp Thị Khách Hàng Cá Nhân (Retail Marketing)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Retail Banking Marketing",
                  "Thẻ tín dụng Cashback",
                  "POSM tại quầy",
                  "Direct Marketing"
            ],
            "jdSummary": [
                  "Lên kế hoạch truyền thông cho các sản phẩm mở thẻ tín dụng, tài khoản số đẹp VPBank NEO.",
                  "Sản xuất các ấn phẩm truyền thông tại hệ thống hơn 250 chi nhánh toàn quốc.",
                  "Theo dõi và đánh giá chi phí tiếp thị trên mỗi khách hàng mới đăng ký sử dụng dịch vụ."
            ],
            "perks": [
                  "Lương thưởng cạnh tranh trong ngành ngân hàng",
                  "Cơ hội thăng tiến lên Trưởng nhóm"
            ],
            "aiMatch": 91
      },
      {
            "id": 316,
            "title": "Quản Trị Thương Hiệu Ngành Hàng Sữa Tươi (Brand Manager)",
            "company": "Vinamilk - Công ty Cổ phần Sữa Việt Nam",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý thương hiệu",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Brand Equity",
                  "FMCG Marketing",
                  "Phân tích thị trường",
                  "Chiến dịch TVC"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm về định vị thương hiệu và thị phần dòng sản phẩm Sữa tươi 100% Vinamilk.",
                  "Sản xuất các chiến dịch quảng cáo truyền hình TVC và chiến dịch số truyền tải thông điệp dinh dưỡng.",
                  "Hợp tác chặt chẽ với Trade Marketing và Sales thúc đẩy sản lượng tiêu thụ toàn quốc."
            ],
            "perks": [
                  "Làm việc tại doanh nghiệp sữa số 1 Việt Nam",
                  "Thưởng hoàn thành mục tiêu năm lớn"
            ],
            "aiMatch": 95
      },
      {
            "id": 317,
            "title": "Creative Marketing Lead (Chiến Dịch Thương Hiệu Giày Quốc Dân)",
            "company": "Công ty TNHH SX HTD Bình Tiên (Biti's Vietnam)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Creative Strategy",
                  "Chiến dịch Đi Để Trở Về",
                  "Văn hóa giới trẻ",
                  "Music Marketing"
            ],
            "jdSummary": [
                  "Chủ trì định hướng ý tưởng sáng tạo cho thương hiệu Biti's Hunter và các bộ sưu tập thời trang mới.",
                  "Hợp tác với các nghệ sĩ âm nhạc hàng đầu sản xuất MV và dự án văn hóa truyền cảm hứng.",
                  "Giữ vững vị thế thương hiệu giày thể thao hàng đầu trong lòng giới trẻ Gen Z."
            ],
            "perks": [
                  "Môi trường tôn vinh bản sắc sáng tạo Việt Nam",
                  "Sản phẩm Biti's ưu đãi nội bộ"
            ],
            "aiMatch": 92
      },
      {
            "id": 318,
            "title": "Senior CRM & Lifecycle Marketing Specialist",
            "company": "Tiki Corporation",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "24 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior Specialist",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "CRM Automation",
                  "Email/App Push",
                  "RFM Segmentation",
                  "Tối ưu phễu mua lại"
            ],
            "jdSummary": [
                  "Thiết lập kịch bản thông báo tự động (App Push, SMS, Email) theo vòng đời mua hàng.",
                  "Phân tích dữ liệu phân khúc RFM để kích hoạt lại tệp khách hàng không hoạt động (Re-activation).",
                  "Đo lường chỉ số mở thông báo (Open Rate), click (CTR) và doanh thu phát sinh trực tiếp."
            ],
            "perks": [
                  "Môi trường Data-driven hiện đại",
                  "Cơ hội tiếp cận công cụ tự động hóa hàng đầu"
            ],
            "aiMatch": 90
      },
      {
            "id": 319,
            "title": "Trưởng Bộ Phận Tổ Chức Sự Kiện & Tài Trợ Thương Hiệu",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng bộ phận",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Event Production",
                  "Tài trợ thể thao/văn hóa",
                  "Quản lý ngân sách sự kiện",
                  "VIP Hospitality"
            ],
            "jdSummary": [
                  "Chủ trì tổ chức các sự kiện quy mô lớn của ngân hàng (Hội nghị khách hàng, Giải chạy MB, Đại nhạc hội).",
                  "Đàm phán quyền lợi tài trợ cho các giải đấu thể thao và chương trình truyền hình uy tín.",
                  "Quản lý chất lượng nhà thầu sản xuất sân khấu và hậu cần sự kiện chuyên nghiệp."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong ngành tài chính",
                  "Thưởng các sự kiện đặc biệt"
            ],
            "aiMatch": 93
      },
      {
            "id": 320,
            "title": "Digital Performance Specialist (Kênh Bán Vé Hàng Không Toàn Cầu)",
            "company": "Công ty Cổ phần Hàng không Vietjet (Vietjet Air)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Global Digital Ads",
                  "Vé máy bay trực tuyến",
                  "Chuyển đổi ROAS",
                  "Google Search Flight"
            ],
            "jdSummary": [
                  "Tối ưu hóa chiến dịch quảng cáo tìm kiếm và mạng xã hội tại các thị trường quốc tế (Úc, Ấn Độ, Nhật, Hàn).",
                  "Gia tăng lượng đặt vé trực tiếp trên website và ứng dụng di động Vietjet Air.",
                  "Phân tích dữ liệu theo mùa vụ du lịch và phản ứng nhanh với động thái giá vé đối thủ."
            ],
            "perks": [
                  "Vé máy bay miễn phí thường niên cho nhân viên và gia đình",
                  "Môi trường làm việc đa quốc gia"
            ],
            "aiMatch": 89
      },
      {
            "id": 321,
            "title": "Marketing Manager (Dự Án Bất Động Sản Hàng Hiệu Masterise)",
            "company": "Tập đoàn Masterise Homes",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Marketing Manager",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Luxury Real Estate Marketing",
                  "Triển lãm quốc tế",
                  "Định vị bất động sản hàng hiệu",
                  "PR cao cấp"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm chiến lược tiếp thị tổng thể cho các siêu dự án bất động sản hàng hiệu.",
                  "Hợp tác với các đối tác khách sạn quốc tế Marriott International và Ritz-Carlton.",
                  "Tổ chức các sự kiện ra mắt độc quyền tại Hong Kong, Singapore và Dubai."
            ],
            "perks": [
                  "Thu nhập và hoa hồng dự án dẫn đầu thị trường",
                  "Môi trường làm việc đẳng cấp quốc tế"
            ],
            "aiMatch": 94
      },
      {
            "id": 322,
            "title": "Assistant Brand Manager (Ngành Chăm Sóc Cá Nhân)",
            "company": "Unilever Vietnam",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "26 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Assistant Brand Manager",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Brand Development",
                  "FMCG Market Research",
                  "Kế hoạch truyền thông năm",
                  "Nielsen/Kantar Data"
            ],
            "jdSummary": [
                  "Đồng hành cùng Brand Manager phát triển thị phần các nhãn hàng chăm sóc cá nhân (Dove, Lifebuoy, Sunsilk).",
                  "Phân tích báo cáo dữ liệu thị trường Nielsen và hành vi mua sắm người tiêu dùng.",
                  "Triển khai các chiến dịch ra mắt bao bì mới và công thức cải tiến."
            ],
            "perks": [
                  "Trường đào tạo Marketing chuẩn mực quốc tế",
                  "Phúc lợi và gói bảo hiểm toàn diện"
            ],
            "aiMatch": 93
      },
      {
            "id": 323,
            "title": "Senior Growth Marketing Specialist (Ví Điện Tử VNPAY & Dịch Vụ Taxi)",
            "company": "Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "FinTech Growth",
                  "Khuyến mại VNPAY-Taxi",
                  "Co-marketing Ngân hàng",
                  "Tối ưu chuyển đổi"
            ],
            "jdSummary": [
                  "Lập kế hoạch thúc đẩy số lượng giao dịch thanh toán VNPAY Taxi và đặt vé máy bay trên App ngân hàng.",
                  "Phối hợp với các ngân hàng đối tác triển khai chương trình đồng tài trợ khuyến mại.",
                  "Phân tích hành vi thanh toán không tiền mặt để tối ưu hóa ngân sách chiết khấu."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong ngành FinTech",
                  "Thưởng tháng lương thứ 13 và thưởng KPI"
            ],
            "aiMatch": 91
      },
      {
            "id": 324,
            "title": "Trade Marketing Manager (Chuỗi Nhà Hàng Ẩm Thực Toàn Quốc)",
            "company": "Tập đoàn Golden Gate (Golden Gate Group)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng Trade MKT",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "F&B Trade Marketing",
                  "POSM chuỗi nhà hàng",
                  "Khuyến mại ẩm thực",
                  "Tối ưu doanh thu bàn"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm các hoạt động tiếp thị tại điểm bán cho hơn 400 nhà hàng (Gogi House, Kichi-Kichi, Manwah).",
                  "Thiết kế và triển khai các combo ưu đãi giờ vàng nhằm tối ưu tỷ lệ lấp đầy bàn ăn.",
                  "Hợp tác với các đối tác thanh toán và ngân hàng triển khai ưu đãi hoàn tiền cho thực khách."
            ],
            "perks": [
                  "Ưu đãi giảm giá 30% tại toàn bộ hệ thống nhà hàng Golden Gate",
                  "Môi trường làm việc trẻ trung năng động"
            ],
            "aiMatch": 92
      },
      {
            "id": 401,
            "title": "Chuyên Viên Phân Tích Dữ Liệu Tài Chính (Data Analyst)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 22,
                  "evaluated14d": 20,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "15 phút trước",
            "verified": true,
            "skills": [
                  "SQL",
                  "Power BI",
                  "Phân tích tín dụng",
                  "Mô hình tài chính",
                  "Python"
            ],
            "jdSummary": [
                  "Xây dựng các dashboard tự động theo dõi danh mục tín dụng và tăng trưởng tài sản.",
                  "Phân tích hành vi chi tiêu thẻ tín dụng để đề xuất chính sách phân khúc khách hàng.",
                  "Phối hợp với khối Quản trị rủi ro phát triển mô hình chấm điểm tín dụng nội bộ."
            ],
            "perks": [
                  "Gói vay ưu đãi lãi suất ngân hàng MB cho nhân viên",
                  "Thưởng cuối năm 4-6 tháng lương"
            ],
            "aiMatch": 94
      },
      {
            "id": 402,
            "title": "Quản Lý Rủi Ro Tín Dụng Khách Hàng Doanh Nghiệp",
            "company": "Ngân hàng VPBank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 45 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 12,
                  "responseRate": 86,
                  "lastReviewed": "12:00"
            },
            "updated": "50 phút trước",
            "verified": true,
            "skills": [
                  "Quản trị rủi ro",
                  "Thẩm định hồ sơ tín dụng",
                  "Basel II/III",
                  "Phân tích dòng tiền"
            ],
            "jdSummary": [
                  "Thẩm định độc lập các khoản vay vốn trung và dài hạn của doanh nghiệp quy mô lớn.",
                  "Đánh giá tính khả thi phương án kinh doanh và phương án tài sản đảm bảo nợ vay.",
                  "Giám sát chặt chẽ các chỉ tiêu cảnh báo rủi ro sớm (Early Warning Signals)."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong khối Ngân hàng TMCP",
                  "Bảo hiểm sức khỏe đặc quyền"
            ],
            "aiMatch": 92
      },
      {
            "id": 403,
            "title": "Trưởng Phòng Thẩm Định Dự Án & Đầu Tư Trực Tiếp",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "45 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Thẩm định đầu tư",
                  "Project Finance",
                  "M&A",
                  "Đàm phán hợp đồng tài trợ vốn"
            ],
            "jdSummary": [
                  "Chủ trì thẩm định các dự án năng lượng tái tạo, hạ tầng và bất động sản công nghiệp.",
                  "Xây dựng cấu trúc tài trợ vốn hợp vốn (Syndicated Loan) với các định chế tài chính quốc tế.",
                  "Báo cáo và giải trình trước Hội đồng tín dụng và Quản lý rủi ro cấp cao."
            ],
            "perks": [
                  "Thưởng hiệu quả dự án hàng năm hấp dẫn",
                  "Môi trường Agile chuyển đổi số số 1"
            ],
            "aiMatch": 96
      },
      {
            "id": 404,
            "title": "Chuyên Viên Quản Lý Danh Mục Đầu Tư (Portfolio Manager)",
            "company": "Chứng khoán SSI (SSI Securities)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 8,
                  "responseRate": 80,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Chứng khoán",
                  "CFA level 2+",
                  "Định giá cổ phiếu",
                  "Phân tích vĩ mô"
            ],
            "jdSummary": [
                  "Quản lý danh mục tài sản ủy thác của khách hàng tổ chức và cá nhân có tài sản ròng cao.",
                  "Phân tích định giá doanh nghiệp niêm yết bằng phương pháp DCF và P/E so sánh.",
                  "Thiết lập chiến lược tái cơ cấu danh mục cổ phiếu phòng ngừa biến động thị trường."
            ],
            "perks": [
                  "Hoa hồng quản lý quỹ tính theo Alpha vượt trội",
                  "Môi trường làm việc top đầu TTCK"
            ],
            "aiMatch": 91
      },
      {
            "id": 405,
            "title": "Senior Internal Auditor (Kiểm Toán Nội Bộ Tài Chính)",
            "company": "Vinamilk - Công ty Cổ phần Sữa Việt Nam",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "26 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 8,
                  "responseRate": 67,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Kiểm toán nội bộ",
                  "IFRS / VAS",
                  "Kiểm soát tuân thủ",
                  "ACCA / CPA"
            ],
            "jdSummary": [
                  "Thực hiện các cuộc kiểm toán định kỳ đối với các chi nhánh, nhà máy và trang trại Vinamilk.",
                  "Đánh giá hiệu lực của hệ thống kiểm soát nội bộ và đề xuất cải tiến quy trình kế toán.",
                  "Lập báo cáo kiểm toán độc lập trình Ủy ban Kiểm toán trực thuộc HĐQT."
            ],
            "perks": [
                  "Môi trường làm việc bền vững hàng đầu Việt Nam",
                  "Thưởng tháng 13 + thưởng hoàn thành KPI"
            ],
            "aiMatch": 88
      },
      {
            "id": 406,
            "title": "Financial Planning & Analysis (FP&A) Specialist",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "FP&A",
                  "Lập ngân sách",
                  "Phân tích P&L chuỗi bán lẻ",
                  "Excel nâng cao"
            ],
            "jdSummary": [
                  "Xây dựng kế hoạch tài chính và ngân sách hoạt động hàng năm cho chuỗi bán lẻ.",
                  "Theo dõi và phân tích biến động chi phí thực tế so với ngân sách đã phê duyệt.",
                  "Đưa ra các phân tích cảnh báo biên lợi nhuận ròng cho Ban Điều Hành."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Cơ hội phát triển lên vị trí Finance Manager"
            ],
            "aiMatch": 89
      },
      {
            "id": 407,
            "title": "Chuyên Viên Kinh Doanh Ngoại Hối & Phái Sinh (FX & Derivatives Trader)",
            "company": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 55 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trader / Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "30 phút trước",
            "verified": true,
            "skills": [
                  "FX Trading",
                  "Phái sinh tỷ giá",
                  "Thị trường liên ngân hàng",
                  "Quản trị trạng thái ngoại hối"
            ],
            "jdSummary": [
                  "Thực hiện các giao dịch mua bán ngoại tệ giao ngay (Spot), kỳ hạn (Forward) và hoán đổi (Swap).",
                  "Cung cấp giải pháp phòng ngừa rủi ro biến động tỷ giá cho khách hàng doanh nghiệp xuất nhập khẩu.",
                  "Duy trì hạn mức trạng thái ngoại tệ và tuân thủ chặt chẽ quy định của Ngân hàng Nhà nước."
            ],
            "perks": [
                  "Thưởng hiệu quả giao dịch (P&L bonus) cạnh tranh",
                  "Môi trường kinh doanh tiền tệ số 1"
            ],
            "aiMatch": 95
      },
      {
            "id": 408,
            "title": "Trưởng Phòng Quản Lý Tài Sản & Khách Hàng Ưu Tiên (Priority Wealth)",
            "company": "Ngân hàng TMCP Á Châu (ACB)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "45 phút trước",
            "verified": true,
            "skills": [
                  "Wealth Management",
                  "Tư vấn đầu tư trái phiếu",
                  "Chứng chỉ quỹ",
                  "Chăm sóc khách hàng VIP"
            ],
            "jdSummary": [
                  "Điều hành phòng dịch vụ khách hàng ưu tiên ACB Privilege Banking.",
                  "Thiết kế danh mục phân bổ tài sản an toàn và sinh lời bền vững cho khách hàng có số dư lớn.",
                  "Quản lý tổng tài sản quản lý (AUM) tăng trưởng theo mục tiêu chiến lược của ngân hàng."
            ],
            "perks": [
                  "Thưởng doanh số và hiệu quả quản lý hấp dẫn",
                  "Bảo hiểm sức khỏe đặc quyền ACB Care"
            ],
            "aiMatch": 93
      },
      {
            "id": 409,
            "title": "Chuyên Viên Môi Giới & Tư Vấn Đầu Tư Khách Hàng VIP",
            "company": "Công ty Cổ phần Chứng khoán VPS",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "25 - 50 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 20,
                  "evaluated14d": 19,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Môi giới chứng khoán",
                  "Phân tích kỹ thuật TA",
                  "Tư vấn Margin",
                  "Quản trị rủi ro danh mục"
            ],
            "jdSummary": [
                  "Cung cấp các bản tin khuyến nghị đầu tư cổ phiếu hàng ngày cho nhóm khách hàng giá trị cao.",
                  "Hỗ trợ quản trị rủi ro danh mục và cơ cấu tỷ trọng margin hợp lý theo diễn biến thị trường.",
                  "Mở rộng tệp nhà đầu tư cá nhân năng động trên nền tảng SmartOne."
            ],
            "perks": [
                  "Tỷ lệ chia sẻ hoa hồng phí giao dịch cao nhất thị trường",
                  "Đào tạo phân tích độc quyền"
            ],
            "aiMatch": 92
      },
      {
            "id": 410,
            "title": "Chuyên Viên Quản Trị Rủi Ro Thanh Khoản & Thị Trường",
            "company": "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "26 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Market Risk",
                  "Rủi ro thanh khoản",
                  "LCR / NSFR",
                  "Stress Testing",
                  "Mô hình VaR"
            ],
            "jdSummary": [
                  "Đo lường và giám sát các chỉ số an toàn vốn và thanh khoản theo tiêu chuẩn Basel II & III.",
                  "Thực hiện kiểm tra sức chịu đựng (Stress Testing) danh mục trái phiếu và lãi suất liên ngân hàng.",
                  "Đề xuất các biện pháp phòng ngừa rủi ro biến động thị trường tài chính vĩ mô."
            ],
            "perks": [
                  "Phúc lợi toàn diện và tính ổn định cao",
                  "Lộ trình phát triển chuyên gia phân tích rủi ro"
            ],
            "aiMatch": 90
      },
      {
            "id": 411,
            "title": "Trưởng Nhóm Thẩm Định Tín Dụng Dự Án Năng Lượng Xanh",
            "company": "Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Thẩm định dự án điện gió/mặt trời",
                  "Tín dụng xanh ESG",
                  "Mô hình dòng tiền dự án",
                  "Bảo lãnh EPC"
            ],
            "jdSummary": [
                  "Chủ trì thẩm định các dự án điện gió, điện mặt trời và hạ tầng khu công nghiệp xanh.",
                  "Đánh giá các điều kiện hợp đồng mua bán điện (PPA) và khả năng trả nợ vay dài hạn.",
                  "Kết nối nguồn vốn ưu đãi từ các định chế tài chính quốc tế như IFC, ADB."
            ],
            "perks": [
                  "Chế độ đãi ngộ vượt trội",
                  "Môi trường làm việc thúc đẩy tài chính bền vững ESG"
            ],
            "aiMatch": 93
      },
      {
            "id": 412,
            "title": "Senior Equity Research Analyst (Ngành Bất Động Sản & Bán Lẻ)",
            "company": "Quỹ Đầu tư Dragon Capital Vietnam",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "35 - 58 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior Analyst",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Equity Research",
                  "Mô hình định giá tài chính",
                  "Thăm dò thực địa dự án",
                  "Báo cáo đầu tư song ngữ"
            ],
            "jdSummary": [
                  "Nghiên cứu chuyên sâu ngành bất động sản và bán lẻ tiêu dùng phục vụ quyết định giải ngân quỹ.",
                  "Gặp gỡ ban lãnh đạo các doanh nghiệp niêm yết và khảo sát tiến độ thực địa dự án.",
                  "Xây dựng mô hình dự báo doanh thu, lợi nhuận và định giá cổ phiếu độc lập."
            ],
            "perks": [
                  "Làm việc tại quỹ quản lý tài sản lớn nhất Việt Nam",
                  "Thưởng hiệu quả đầu tư năm hấp dẫn"
            ],
            "aiMatch": 95
      },
      {
            "id": 413,
            "title": "Chuyên Viên Cao Cấp Tái Cấu Trúc Tài Chính & M&A",
            "company": "Ngân hàng TMCP Tiên Phong (TPBank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Tái cấu trúc nợ",
                  "Tư vấn M&A",
                  "Định giá tài sản bảo đảm",
                  "Pháp lý tài chính"
            ],
            "jdSummary": [
                  "Tư vấn các giải pháp tái cấu trúc nguồn vốn và sáp nhập doanh nghiệp cho khách hàng lớn.",
                  "Định giá và lập phương án xử lý nợ có tài sản đảm bảo quy mô hàng nghìn tỷ đồng.",
                  "Phối hợp với các tổ chức tư vấn luật hoàn thiện cấu trúc giao dịch an toàn."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh top ngân hàng số",
                  "Lộ trình thăng tiến chuyên gia rõ ràng"
            ],
            "aiMatch": 91
      },
      {
            "id": 414,
            "title": "Investment Associate (Khối Quỹ Đầu Tư Tư Nhân Private Equity)",
            "company": "Tập đoàn Quản lý Quỹ VinaCapital",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Investment Associate",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Private Equity",
                  "Financial Due Diligence",
                  "LBO Modeling",
                  "Thương thảo cổ đông"
            ],
            "jdSummary": [
                  "Thực hiện thẩm định tài chính chi tiết (Financial Due Diligence) các thương vụ đầu tư cổ phần tư nhân.",
                  "Xây dựng kịch bản tài chính phức tạp và đánh giá tỷ suất hoàn vốn nội bộ (IRR).",
                  "Đồng hành hỗ trợ tái cơ cấu quản trị tại các công ty trong danh mục đầu tư."
            ],
            "perks": [
                  "Thưởng thành công thương vụ (Carried Interest)",
                  "Môi trường làm việc chuẩn Wall Street"
            ],
            "aiMatch": 96
      },
      {
            "id": 415,
            "title": "Trưởng Phòng Kế Hoạch & Quản Lý Chi Phí Hoạt Động (Cost Control)",
            "company": "Ngân hàng TMCP Phát triển TP.HCM (HDBank)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Cost Control",
                  "Tối ưu hóa CIR",
                  "Quản trị ngân sách OPEX/CAPEX",
                  "Kiểm soát mua sắm"
            ],
            "jdSummary": [
                  "Kiểm soát toàn bộ chi phí hoạt động OPEX và chi phí đầu tư CAPEX của toàn hệ thống ngân hàng.",
                  "Tối ưu hóa tỷ lệ chi phí trên thu nhập (CIR) theo chỉ tiêu Hội đồng Quản trị giao.",
                  "Thẩm định hiệu quả kinh tế các đề xuất mua sắm trang thiết bị và phần mềm chuyển đổi số."
            ],
            "perks": [
                  "Chế độ phúc lợi ngân hàng hấp dẫn",
                  "Môi trường năng động nhiều cơ hội phát triển"
            ],
            "aiMatch": 90
      },
      {
            "id": 416,
            "title": "Chuyên Viên Kiểm Soát Tuân Thủ & Phòng Chống Rửa Tiền (AML/CTF)",
            "company": "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "AML/CTF",
                  "Kiểm soát tuân thủ",
                  "Rà soát giao dịch đáng ngờ",
                  "Cảnh báo rủi ro gian lận"
            ],
            "jdSummary": [
                  "Giám sát và phân tích các giao dịch có dấu hiệu đáng ngờ theo Luật Phòng chống rửa tiền.",
                  "Phối hợp với Cục Phòng chống rửa tiền thuộc NHNN cung cấp thông tin điều tra.",
                  "Cập nhật chính sách tuân thủ nội bộ và tổ chức đào tạo cho cán bộ nghiệp vụ."
            ],
            "perks": [
                  "Công việc ổn định, phúc lợi đầy đủ",
                  "Được tài trợ học chứng chỉ quốc tế CAMS"
            ],
            "aiMatch": 88
      },
      {
            "id": 417,
            "title": "Chuyên Viên Định Phí Bảo Hiểm (Actuary Specialist)",
            "company": "Tổng Công ty Bảo hiểm Bảo Việt (Bảo Việt Nhân Thọ)",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 52 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Actuary Specialist",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Actuarial Science",
                  "Định phí sản phẩm bảo hiểm",
                  "Dự phòng rủi ro IFRS 17",
                  "Mô hình Prophet"
            ],
            "jdSummary": [
                  "Thiết kế và tính toán phí bảo hiểm cho các sản phẩm bảo hiểm nhân thọ và liên kết đầu tư.",
                  "Xây dựng mô hình trích lập dự phòng kỹ thuật đáp ứng chuẩn mực báo cáo tài chính quốc tế IFRS 17.",
                  "Đánh giá khả năng thanh toán và rủi ro tài chính định kỳ hàng quý."
            ],
            "perks": [
                  "Hỗ trợ lệ phí thi và ngày nghỉ học thi các chứng chỉ SOA/IFoA",
                  "Lương thưởng hấp dẫn"
            ],
            "aiMatch": 94
      },
      {
            "id": 418,
            "title": "Quản Lý Khách Hàng Doanh Nghiệp Lớn (Corporate Banking Lead)",
            "company": "Ngân hàng TMCP Lộc Phát Việt Nam (LPBank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Corporate Banking",
                  "Tín dụng doanh nghiệp lớn",
                  "Huy động vốn",
                  "Quan hệ khách hàng"
            ],
            "jdSummary": [
                  "Khai thác và chăm sóc các tập đoàn xây dựng, năng lượng và sản xuất kinh doanh quy mô lớn.",
                  "Tư vấn các gói tài trợ vốn lưu động, phát hành bảo lãnh dự thầu và quản lý dòng tiền.",
                  "Dẫn dắt nhóm quan hệ khách hàng doanh nghiệp hoàn thành chỉ tiêu tăng trưởng tín dụng."
            ],
            "perks": [
                  "Gói thu nhập hấp dẫn theo kết quả kinh doanh",
                  "Chính sách thăng tiến minh bạch"
            ],
            "aiMatch": 92
      },
      {
            "id": 419,
            "title": "Senior Financial Analyst (Khối Khách Hàng Doanh Nghiệp Hàn Quốc)",
            "company": "Công ty Chứng khoán Mirae Asset Việt Nam",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior Analyst",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Financial Analysis",
                  "Tiếng Hàn/Anh lưu loát",
                  "Tư vấn niêm yết IB",
                  "Thương vụ M&A"
            ],
            "jdSummary": [
                  "Hỗ trợ các doanh nghiệp Hàn Quốc tại Việt Nam tiếp cận nguồn vốn qua kênh phát hành trái phiếu và cổ phiếu.",
                  "Phân tích năng lực tài chính và lập hồ sơ chào bán chứng khoán riêng lẻ.",
                  "Soạn thảo các tài liệu thuyết trình thương vụ chuyên nghiệp bằng tiếng Hàn hoặc tiếng Anh."
            ],
            "perks": [
                  "Môi trường làm việc tập đoàn tài chính số 1 Hàn Quốc",
                  "Cơ hội onsite tại Seoul"
            ],
            "aiMatch": 91
      },
      {
            "id": 420,
            "title": "Quản Lý Đối Soát Tài Chính & Thanh Toán Trung Gian",
            "company": "Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Reconciliation",
                  "FinTech Settlement",
                  "Quy trình đối soát ngân hàng",
                  "SQL nâng cao"
            ],
            "jdSummary": [
                  "Quản lý hệ thống đối soát dữ liệu giao dịch tự động giữa ví điện tử MoMo và hơn 40 ngân hàng.",
                  "Xử lý nhanh chóng các giao dịch chênh lệch, khiếu nại hoàn tiền và phòng ngừa thất thoát.",
                  "Tự động hóa báo cáo dòng tiền và thời gian thanh toán công nợ cho các đối tác bán hàng."
            ],
            "perks": [
                  "Thưởng cổ phiếu ESOP thường niên",
                  "Môi trường làm việc năng động và nhiều thử thách công nghệ"
            ],
            "aiMatch": 93
      },
      {
            "id": 421,
            "title": "Trưởng Nhóm Phát Triển Sản Phẩm Tài Chính Số (WealthTech Product Owner)",
            "company": "Công ty Cổ phần Chứng khoán VNDIRECT",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Product Owner",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Product Owner",
                  "Chứng chỉ quỹ Dwealth",
                  "Thiết kế hành trình đầu tư",
                  "Agile/Scrum"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm thiết kế các sản phẩm tiết kiệm sinh lời, chứng chỉ quỹ và tích lũy mục tiêu trên App DGo.",
                  "Phối hợp với IT và UI/UX Designer xây dựng giao diện đầu tư đơn giản, trực quan cho nhà đầu tư F0.",
                  "Theo dõi các chỉ số đo lường hiệu quả sản phẩm (MAU, Volume giao dịch, Retention)."
            ],
            "perks": [
                  "Chế độ đãi ngộ cạnh tranh bậc nhất ngành chứng khoán",
                  "Văn hóa tôn trọng sáng tạo cá nhân"
            ],
            "aiMatch": 92
      },
      {
            "id": 422,
            "title": "Chuyên Viên Xử Lý Nợ & Tái Thiết Danh Mục Khách Hàng",
            "company": "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "20 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Cần Thơ",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Xử lý nợ xấu NPL",
                  "Thẩm định phát mãi tài sản",
                  "Đàm phán cơ cấu nợ",
                  "Pháp lý tố tụng"
            ],
            "jdSummary": [
                  "Trực tiếp đàm phán với khách hàng có nợ quá hạn để thống nhất phương án cơ cấu lại lịch trả nợ.",
                  "Thực hiện thủ tục bán đấu giá tài sản bảo đảm thu hồi vốn theo đúng quy định pháp luật.",
                  "Quản lý hồ sơ pháp lý và phối hợp với cơ quan thi hành án dân sự."
            ],
            "perks": [
                  "Thưởng nóng theo tỷ lệ thu hồi nợ thành công",
                  "Chế độ phúc lợi Sacombank đầy đủ"
            ],
            "aiMatch": 87
      },
      {
            "id": 423,
            "title": "Senior Audit Associate (Khối Kiểm Toán Ngân Hàng & FinTech)",
            "company": "PwC Vietnam (PricewaterhouseCoopers)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "26 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Hà Nội",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior Associate",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "External Audit",
                  "Big 4 Experience",
                  "Kiểm toán ngân hàng",
                  "IFRS Standards",
                  "ACCA/CPA"
            ],
            "jdSummary": [
                  "Trưởng nhóm phụ trách kiểm toán báo cáo tài chính cho các ngân hàng thương mại và ví điện tử lớn.",
                  "Đánh giá tính tuân thủ các chuẩn mực kế toán IFRS 9 về trích lập dự phòng rủi ro tín dụng.",
                  "Soạn thảo thư quản lý (Management Letter) chỉ ra các điểm yếu kiểm soát nội bộ."
            ],
            "perks": [
                  "Môi trường làm việc Big 4 chuẩn mực quốc tế",
                  "Chính sách tài trợ học bổng ACCA/CPA"
            ],
            "aiMatch": 95
      },
      {
            "id": 424,
            "title": "M&A Due Diligence Consultant (Tư Vấn Tài Chính Doanh Nghiệp)",
            "company": "KPMG Vietnam",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Consultant / Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Financial Due Diligence",
                  "Tư vấn M&A",
                  "Chất lượng lợi nhuận (QoE)",
                  "Vốn lưu động ròng (NWC)"
            ],
            "jdSummary": [
                  "Thực hiện thẩm định chất lượng lợi nhuận (Quality of Earnings) và nợ ròng cho các thương vụ M&A.",
                  "Xác định các yếu tố rủi ro tài chính tiềm ẩn có thể ảnh hưởng đến mức định giá mua bán doanh nghiệp.",
                  "Hỗ trợ khách hàng trong quá trình đàm phán hợp đồng mua bán cổ phần (SPA)."
            ],
            "perks": [
                  "Làm việc cùng các chuyên gia hàng đầu khu vực châu Á - Thái Bình Dương",
                  "Gói bảo hiểm toàn diện"
            ],
            "aiMatch": 94
      },
      {
            "id": 501,
            "title": "Trưởng Phòng Tuyển Dụng Nhân Tài (Talent Acquisition Lead)",
            "company": "FPT Software Global",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng / Quản lý",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 20,
                  "evaluated14d": 19,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "10 phút trước",
            "verified": true,
            "skills": [
                  "Tech Recruitment",
                  "Talent Sourcing",
                  "Headhunting",
                  "Employer Branding"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm hoàn thành chỉ tiêu tuyển dụng 500+ kỹ sư phần mềm cao cấp hàng năm.",
                  "Xây dựng quan hệ hợp tác với các trường đại học công nghệ hàng đầu và cộng đồng developer.",
                  "Ứng dụng công nghệ AI ATS để tối ưu thời gian tuyển dụng (Time-to-Hire)."
            ],
            "perks": [
                  "Thưởng tuyển dụng theo năng suất hàng tháng",
                  "Gói bảo hiểm FPT Care cho cả gia đình"
            ],
            "aiMatch": 95
      },
      {
            "id": 502,
            "title": "HR Business Partner (HRBP) - Khối Công Nghệ",
            "company": "VNG Corporation",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "35 phút trước",
            "verified": true,
            "skills": [
                  "HRBP",
                  "Quản trị nhân tài",
                  "Đánh giá KPI / OKRs",
                  "Văn hóa doanh nghiệp"
            ],
            "jdSummary": [
                  "Đồng hành chiến lược với Giám đốc khối sản phẩm Game & Zalo về quy hoạch nguồn nhân lực.",
                  "Triển khai các chương trình đánh giá hiệu suất, thăng tiến và giữ chân nhân tài công nghệ.",
                  "Giải quyết các vấn đề quan hệ lao động và tư vấn phát triển tổ chức (OD)."
            ],
            "perks": [
                  "Làm việc tại không gian sáng tạo VNG Campus",
                  "Thưởng performance theo quý"
            ],
            "aiMatch": 93
      },
      {
            "id": 503,
            "title": "Chuyên Viên C&B & Chính Sách Nhân Sự Cao Cấp",
            "company": "Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 16,
                  "responseRate": 89,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "C&B",
                  "Luật lao động",
                  "Xây dựng thang bảng lương 3P",
                  "Thuế TNCN & BHXH"
            ],
            "jdSummary": [
                  "Quản lý bảng lương và chế độ đãi ngộ hàng tháng cho hơn 1.000 cán bộ nhân viên.",
                  "Khảo sát lương thưởng thị trường (Salary Benchmarking) để đề xuất điều chỉnh bảng lương 3P.",
                  "Tối ưu hóa các chính sách phúc lợi và đảm bảo tuân thủ 100% Luật lao động hiện hành."
            ],
            "perks": [
                  "Môi trường quân đội kỷ luật và chuyên nghiệp",
                  "Phúc lợi toàn diện và ổn định lâu dài"
            ],
            "aiMatch": 90
      },
      {
            "id": 504,
            "title": "Trưởng Phòng Hành Chính & Quản Trị Vận Hành Văn Phòng",
            "company": "Bitexco Group",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 10,
                  "responseRate": 71,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Quản trị hành chính",
                  "Facility Management",
                  "Quản lý chi phí",
                  "Đấu thầu nhà cung cấp"
            ],
            "jdSummary": [
                  "Quản trị toàn bộ công tác vận hành, an ninh và lễ tân tại trụ sở tập đoàn.",
                  "Đàm phán hợp đồng mua sắm trang thiết bị văn phòng và quản lý chi phí hành chính định kỳ.",
                  "Tổ chức các sự kiện nội bộ, lễ kỷ niệm và hậu cần cho Ban Lãnh Đạo tập đoàn."
            ],
            "perks": [
                  "Làm việc tại tòa tháp Bitexco Financial Tower",
                  "Chế độ nghỉ phép 15 ngày/năm"
            ],
            "aiMatch": 85
      },
      {
            "id": 505,
            "title": "Learning & Development (L&D) Specialist",
            "company": "Sun Group Corporation",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & Đà Nẵng",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 10,
                  "responseRate": 83,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Đào tạo nội bộ",
                  "Khung năng lực",
                  "E-Learning",
                  "Phát triển lãnh đạo"
            ],
            "jdSummary": [
                  "Khảo sát nhu cầu đào tạo (TNA) của các khối vận hành du lịch và quản lý dự án.",
                  "Thiết kế giáo trình và tổ chức các khóa đào tạo nâng cao kỹ năng mềm và kỹ năng chuyên môn.",
                  "Vận hành hệ thống học tập trực tuyến LMS cho toàn bộ cán bộ nhân viên tập đoàn."
            ],
            "perks": [
                  "Được tham gia các chương trình đào tạo quốc tế",
                  "Phúc lợi du lịch nghỉ dưỡng"
            ],
            "aiMatch": 88
      },
      {
            "id": 506,
            "title": "Chuyên Viên Phát Triển Văn Hóa Doanh Nghiệp & EB",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 13,
                  "responseRate": 87,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Employer Branding",
                  "Truyền thông nội bộ",
                  "Tổ chức sự kiện",
                  "Sáng tạo nội dung"
            ],
            "jdSummary": [
                  "Lên kế hoạch và triển khai các chiến dịch xây dựng Thương hiệu Nhà tuyển dụng (Employer Branding).",
                  "Sản xuất các ấn phẩm truyền thông nội bộ, radio và bản tin định kỳ gắn kết nhân viên.",
                  "Chủ trì các hoạt động teambuilding, phong trào thể thao và trách nhiệm xã hội CSR."
            ],
            "perks": [
                  "Môi trường ngân hàng chuyển đổi số xuất sắc nhất",
                  "Chế độ đãi ngộ và lộ trình nghề nghiệp rõ ràng"
            ],
            "aiMatch": 91
      },
      {
            "id": 507,
            "title": "HR Operations Specialist (Quản Trị Nhân Sự Khối Vận Hành Kho Vận)",
            "company": "Shopee Vietnam (SPX Express)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Bắc Ninh",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "HR Operations",
                  "Quản lý hợp đồng lao động",
                  "Chấm công ca kíp",
                  "Thực thi quy chế"
            ],
            "jdSummary": [
                  "Quản lý hồ sơ nhân sự và ký kết hợp đồng lao động cho hơn 2.000 nhân viên kho vận logistics.",
                  "Giám sát dữ liệu chấm công vân tay, giải quyết phép năm và chế độ thai sản, ốm đau kịp thời.",
                  "Tổ chức tiếp nhận nhân sự mới (Onboarding) và đào tạo nội quy an toàn lao động."
            ],
            "perks": [
                  "Môi trường E-commerce năng động",
                  "Phụ cấp ăn ca và xe đưa đón"
            ],
            "aiMatch": 89
      },
      {
            "id": 508,
            "title": "Giám Đốc Nhân Sự Khối Vận Hành Bán Lẻ (HR Director WinMart)",
            "company": "Masan Group (WinCommerce)",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "45 - 75 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Giám đốc khối",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "40 phút trước",
            "verified": true,
            "skills": [
                  "HR Strategy",
                  "Quản trị nhân lực bán lẻ quy mô lớn",
                  "Quan hệ lao động",
                  "Tối ưu định biên"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược nhân sự toàn diện cho hơn 30.000 nhân sự chuỗi siêu thị WinMart và WinMart+.",
                  "Thiết kế cơ chế lương thưởng kích thích năng suất lao động tại điểm bán (Productivity-based Pay).",
                  "Xây dựng đội ngũ kế thừa và chuẩn hóa tiêu chuẩn dịch vụ khách hàng 5 sao."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh top tập đoàn bán lẻ",
                  "Xe ô tô đưa đón lãnh đạo"
            ],
            "aiMatch": 96
      },
      {
            "id": 509,
            "title": "Trưởng Nhóm Thu Hút Nhân Tài Cấp Cao (Executive Search Lead)",
            "company": "Tập đoàn Vingroup",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Executive Search",
                  "Headhunting C-Level",
                  "Tuyển dụng nhân sự quốc tế",
                  "Đàm phán đãi ngộ"
            ],
            "jdSummary": [
                  "Tìm kiếm và thu hút các chuyên gia hàng đầu thế giới về trí tuệ nhân tạo, ô tô điện và y tế.",
                  "Phỏng vấn đánh giá năng lực lãnh đạo và tư vấn mức đãi ngộ cho Hội đồng Quản trị.",
                  "Đảm bảo trải nghiệm ứng viên cao cấp đạt chuẩn quốc tế từ lúc tiếp cận đến khi hòa nhập."
            ],
            "perks": [
                  "Phúc lợi đặc quyền hệ sinh thái Vingroup (Vinhomes, Vinmec, Vinpearl)",
                  "Thưởng thành tích cao"
            ],
            "aiMatch": 95
      },
      {
            "id": 510,
            "title": "Quản Lý Đào Tạo & Phát Triển Chuỗi Siêu Thị Toàn Quốc",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý đào tạo",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Retail Training",
                  "Văn hóa Tận Tâm Phục Vụ",
                  "Đào tạo kỹ năng bán hàng",
                  "Mobile Learning App"
            ],
            "jdSummary": [
                  "Quản lý hệ thống đào tạo hội nhập văn hóa phục vụ khách hàng cho hàng nghìn nhân viên mới mỗi tháng.",
                  "Sản xuất các video micro-learning đào tạo tính năng sản phẩm công nghệ mới trên app nội bộ.",
                  "Đánh giá hiệu quả ứng dụng kiến thức vào thực tế và cải thiện chỉ số hài lòng khách hàng NPS."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Môi trường làm việc thân thiện đoàn kết"
            ],
            "aiMatch": 92
      },
      {
            "id": 511,
            "title": "Chuyên Viên Quan Hệ Lao Động & Tuân Thủ (ER Specialist)",
            "company": "Samsung Display Vietnam (SDV)",
            "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 36 triệu",
            "salaryIsOrange": false,
            "location": "Bắc Ninh & Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Employee Relations",
                  "Giải quyết tranh chấp lao động",
                  "Đối thoại công đoàn",
                  "Pháp lý lao động"
            ],
            "jdSummary": [
                  "Xử lý các vấn đề quan hệ lao động, kỷ luật lao động và khiếu nại của người lao động đúng luật.",
                  "Tổ chức hội nghị người lao động định kỳ và phối hợp với Ban Chấp hành Công đoàn cơ sở.",
                  "Đảm bảo nhà máy luôn đạt điểm đánh giá cao trong các cuộc đánh giá trách nhiệm xã hội RBA."
            ],
            "perks": [
                  "Xe đưa đón CBNV khắp các tuyến Hà Nội - Bắc Ninh",
                  "Bữa ăn miễn phí và chế độ thưởng lớn"
            ],
            "aiMatch": 90
      },
      {
            "id": 512,
            "title": "HRBP Leader (Khối Viễn Thông & Hạ Tầng Số Doanh Nghiệp)",
            "company": "Tập đoàn Công nghệ CMC (CMC Corporation)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm HRBP",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "HRBP IT",
                  "Quy hoạch tổ chức",
                  "Đánh giá năng lực nhân sự",
                  "Giữ chân nhân tài"
            ],
            "jdSummary": [
                  "Đối tác nhân sự chiến lược cho các đơn vị thành viên khối hạ tầng số và an ninh mạng CMC.",
                  "Xây dựng ma trận kỹ năng chuyên môn và lộ trình thăng tiến nghề nghiệp cho kỹ sư công nghệ.",
                  "Tham mưu cơ chế lương thưởng khích lệ tinh thần đổi mới sáng tạo và chuyển đổi số."
            ],
            "perks": [
                  "Môi trường làm việc tôn trọng cá nhân",
                  "Chế độ phúc lợi tập đoàn công nghệ toàn diện"
            ],
            "aiMatch": 91
      },
      {
            "id": 513,
            "title": "People Operations Partner (Chính Sách & Trải Nghiệm Nhân Viên)",
            "company": "Grab Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "People Partner",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "People Operations",
                  "Employee Experience",
                  "Onboarding tự động hóa",
                  "Workday HRIS"
            ],
            "jdSummary": [
                  "Tối ưu hóa các điểm chạm trong hành trình trải nghiệm nhân viên từ gia nhập đến rời tổ chức.",
                  "Vận hành hệ thống quản lý thông tin nhân sự toàn cầu Workday mượt mà và chính xác.",
                  "Tổ chức các diễn đàn đối thoại mở Grabbers All-Hands và khảo sát mức độ gắn kết Pulse Survey."
            ],
            "perks": [
                  "Môi trường làm việc linh hoạt chuẩn quốc tế",
                  "Gói phụ cấp GrabCredits hàng tháng"
            ],
            "aiMatch": 93
      },
      {
            "id": 514,
            "title": "Chuyên Viên Khảo Sát & Xây Dựng Khung Năng Lực (Talent Management)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Talent Management",
                  "Khung năng lực từ điển chức danh",
                  "Assessment Center",
                  "Quy hoạch kế thừa"
            ],
            "jdSummary": [
                  "Xây dựng và chuẩn hóa bộ từ điển năng lực chuyên môn cho từng khối phòng ban trong ngân hàng.",
                  "Thiết kế bài kiểm tra đánh giá năng lực định kỳ tại trung tâm khảo thí Assessment Center.",
                  "Nhận diện các nhân sự có tiềm năng cao (HiPo) để đưa vào chương trình đào tạo quản trị viên tập sự."
            ],
            "perks": [
                  "Môi trường ngân hàng chuyển đổi số năng động nhất",
                  "Chế độ đãi ngộ xứng đáng"
            ],
            "aiMatch": 89
      },
      {
            "id": 515,
            "title": "Trưởng Bộ Phận Tuyển Dụng Quốc Tế (Global Talent Acquisition)",
            "company": "Tập đoàn VinFast Toàn Cầu",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "35 - 60 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng bộ phận",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Global Recruitment",
                  "Kỹ sư ô tô điện",
                  "Thị trường Mỹ/Canada/Châu Âu",
                  "Relocation Package"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm tuyển dụng nhân sự cấp quản lý và chuyên gia tại các văn phòng VinFast Bắc Mỹ và châu Âu.",
                  "Xây dựng chính sách luân chuyển cán bộ quốc tế (Relocation & Expat Policies).",
                  "Đại diện tập đoàn tham gia các ngày hội việc làm và triển lãm công nghệ ô tô quốc tế."
            ],
            "perks": [
                  "Ưu đãi mua ô tô điện VinFast đặc quyền",
                  "Cơ hội công tác nước ngoài thường xuyên"
            ],
            "aiMatch": 95
      },
      {
            "id": 516,
            "title": "Quản Trị Hành Chính & Cung Ứng Vật Tư Văn Phòng Toàn Quốc",
            "company": "Tập đoàn Golden Gate (Golden Gate Group)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Hành chính văn phòng",
                  "Đấu thầu mua sắm",
                  "Quản lý tài sản cố định",
                  "Facility Services"
            ],
            "jdSummary": [
                  "Quản lý hợp đồng thuê trụ sở văn phòng, dịch vụ an ninh và vệ sinh tòa nhà.",
                  "Thương thảo giá và ký kết hợp đồng cung cấp đồ dùng văn phòng, máy in và dịch vụ IT support.",
                  "Kiểm kê tài sản định kỳ và thanh lý thiết bị cũ hỏng theo đúng quy trình kiểm toán."
            ],
            "perks": [
                  "Ưu đãi 30% tại toàn bộ hệ thống nhà hàng Golden Gate",
                  "Môi trường làm việc thân thiện"
            ],
            "aiMatch": 87
      },
      {
            "id": 517,
            "title": "Compensation & Benefits Lead (Xây Dựng Cơ Chế Thưởng ESOP)",
            "company": "One Mount Group",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm C&B",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Total Rewards",
                  "ESOP Structure",
                  "Thang bảng lương công nghệ",
                  "Khảo sát Mercer/WTW"
            ],
            "jdSummary": [
                  "Thiết kế gói đãi ngộ tổng thể (Total Rewards) cạnh tranh nhất ngành công nghệ cho One Mount.",
                  "Xây dựng quy chế và quản lý kế hoạch phân phối cổ phiếu thưởng ESOP cho nhân sự chủ chốt.",
                  "Phân tích chi phí ngân sách nhân sự (HR Cost) và đề xuất phương án tối ưu hóa hiệu suất chi trả."
            ],
            "perks": [
                  "Gói khám sức khỏe Vinmec VIP",
                  "Chế độ làm việc linh hoạt Hybrid"
            ],
            "aiMatch": 94
      },
      {
            "id": 518,
            "title": "Internal Communications & Culture Specialist",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "18 - 28 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Truyền thông nội bộ",
                  "Văn hóa startup công nghệ",
                  "Sản xuất bản tin video",
                  "Townhall Event"
            ],
            "jdSummary": [
                  "Chủ trì sản xuất bản tin nội bộ hàng tuần, podcast và video truyền cảm hứng văn hóa Be.",
                  "Tổ chức các buổi gặp gỡ toàn thể CBNV (Monthly Townhall) kết nối lãnh đạo và nhân viên.",
                  "Lên kế hoạch tổ chức các sự kiện mừng sinh nhật công ty, Ngày hội gia đình và tiệc Year End Party."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí",
                  "Môi trường làm việc trẻ trung sáng tạo"
            ],
            "aiMatch": 88
      },
      {
            "id": 519,
            "title": "Trưởng Nhóm Quản Trị Trải Nghiệm Nhân Viên (EX Specialist)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Employee Experience",
                  "HR Digital Transformation",
                  "MB WOW Culture",
                  "Lắng nghe phản hồi"
            ],
            "jdSummary": [
                  "Xây dựng và số hóa toàn bộ trải nghiệm nhân viên trên ứng dụng MB Nhân Sự Thông Minh.",
                  "Khảo sát chỉ số hài lòng nhân viên eNPS và đề xuất các cải tiến về môi trường làm việc số.",
                  "Triển khai các chương trình ghi nhận và khen thưởng tức thì (Spot Bonus, Kudos)."
            ],
            "perks": [
                  "Phúc lợi ngân hàng thuộc top tốt nhất Việt Nam",
                  "Thưởng các dịp lễ tết chu đáo"
            ],
            "aiMatch": 92
      },
      {
            "id": 520,
            "title": "HR Business Partner (Khối Logistics & Supply Chain)",
            "company": "Tiki Corporation (TikiNOW Smart Logistics)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "24 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Bình Dương",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "HRBP Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "HRBP Logistics",
                  "Định biên nhân sự kho vận",
                  "Năng suất lao động ca kíp",
                  "An toàn lao động"
            ],
            "jdSummary": [
                  "Làm việc trực tiếp cùng Giám đốc khối kho vận TikiNOW để giải quyết các bài toán nguồn lực mùa cao điểm.",
                  "Tối ưu hóa chi phí nhân sự trên mỗi đơn hàng đóng gói và giao nhận hoàn tất.",
                  "Giải quyết tranh chấp phát sinh tại các trung tâm xử lý đơn hàng Fulfillment Center."
            ],
            "perks": [
                  "Môi trường thương mại điện tử chuyên nghiệp",
                  "Mua sắm Tiki ưu đãi nội bộ"
            ],
            "aiMatch": 90
      },
      {
            "id": 521,
            "title": "Chuyên Viên Tuyển Dụng & Đào Tạo Tiếp Viên Hàng Không",
            "company": "Công ty Cổ phần Hàng không Vietjet (Vietjet Air)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Hà Nội",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Tuyển dụng hàng không",
                  "Đánh giá ngoại hình/ngoại ngữ",
                  "Phỏng vấn cabin crew",
                  "Tổ chức casting"
            ],
            "jdSummary": [
                  "Tổ chức các đợt thi tuyển tiếp viên hàng không tại các thành phố lớn trên cả nước và khu vực.",
                  "Đánh giá các tiêu chuẩn khắt khe về ngoại ngữ, kỹ năng giao tiếp và khả năng phản ứng tình huống.",
                  "Điều phối khóa đào tạo nghiệp vụ an toàn bay tại Học viện Hàng không Vietjet."
            ],
            "perks": [
                  "Vé máy bay miễn phí không giới hạn tuyến bay nội địa và quốc tế",
                  "Môi trường đa văn hóa"
            ],
            "aiMatch": 91
      },
      {
            "id": 522,
            "title": "Quản Lý Nhân Sự Vùng (Regional HR Manager FMCG)",
            "company": "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "26 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Đà Nẵng & Miền Trung",
            "city": "Đà Nẵng",
            "exp": "3-5 năm",
            "level": "Trưởng phòng vùng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Regional HR",
                  "Quản lý nhân sự chi nhánh tỉnh",
                  "Tuyển dụng diện rộng",
                  "Chính sách địa phương"
            ],
            "jdSummary": [
                  "Quản lý công tác nhân sự cho hơn 12 chi nhánh FPT Telecom tại các tỉnh miền Trung.",
                  "Chỉ đạo hoàn thành chỉ tiêu tuyển dụng nhân viên kinh doanh và kỹ thuật viên bảo trì mạng lưới.",
                  "Kiểm tra định kỳ việc thực thi chính sách chế độ của CBNV theo đúng chuẩn tập đoàn."
            ],
            "perks": [
                  "Chế độ phúc lợi FPT Care",
                  "Thưởng hoàn thành mục tiêu kinh doanh vùng"
            ],
            "aiMatch": 89
      },
      {
            "id": 523,
            "title": "Employer Branding & Future Leaders Program Specialist",
            "company": "Unilever Vietnam",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Employer Branding",
                  "UFLP Management",
                  "University Relations",
                  "Hackathon/Case Competition"
            ],
            "jdSummary": [
                  "Chủ trì chương trình Nhà Lãnh Đạo Tương Lai Unilever Future Leaders Program (UFLP) danh giá.",
                  "Tổ chức cuộc thi giải quyết tình huống kinh doanh Unilever Future Leaders League cho sinh viên xuất sắc.",
                  "Quản lý các kênh truyền thông tuyển dụng và duy trì vị thế Nơi làm việc tốt nhất Việt Nam."
            ],
            "perks": [
                  "Môi trường phát triển nhân tài chuẩn tập đoàn FMCG số 1",
                  "Phúc lợi và bảo hiểm toàn diện"
            ],
            "aiMatch": 95
      },
      {
            "id": 524,
            "title": "Trưởng Phòng Hành Chính Bệnh Viện & Quản Trị Cơ Sở Vật Chất",
            "company": "Hệ thống Y tế Vinmec (Vinmec Healthcare System)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng hành chính",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Quản trị hành chính y tế",
                  "Tiêu chuẩn quốc tế JCI",
                  "Facility Management",
                  "Quản lý an ninh/vệ sinh"
            ],
            "jdSummary": [
                  "Quản lý toàn bộ công tác hành chính, hậu cần và cơ sở vật chất tại bệnh viện đa khoa quốc tế Vinmec.",
                  "Đảm bảo các quy trình vệ sinh kiểm soát nhiễm khuẩn đạt chuẩn chất lượng quốc tế JCI nghiêm ngặt.",
                  "Điều phối công tác khánh tiết, đón tiếp các đoàn chuyên gia y tế và bệnh nhân VIP."
            ],
            "perks": [
                  "Gói chăm sóc y tế Vinmec đặc quyền cho bản thân và gia đình",
                  "Chế độ đãi ngộ vượt trội"
            ],
            "aiMatch": 91
      }
];

    // Trạng thái vận hành (mặc định tab Tất cả)
    let currentCategory = 'all';
    let currentPage = 1;
    const JOBS_PER_PAGE = 12; // Tối đa 3 cột thẻ, tối đa 4 hàng thẻ = 12 thẻ/trang
    let previewHideTimeout = null;

    // Kiểm tra trạng thái đăng nhập của người dùng
    function checkUserLoginState() {
      const loggedViewEl = document.getElementById('account-logged-view');
      const hasLoggedStorage = localStorage.getItem('easycv_user_logged');
      if (hasLoggedStorage !== null) {
        return hasLoggedStorage === 'true';
      }
      return !!(loggedViewEl && window.getComputedStyle(loggedViewEl).display !== 'none');
    }

    // Thuật toán ưu tiên hiển thị (Sort & Scoring Engine)
    function calculateJobRank(job, isLogged) {
      if (!isLogged) {
        // CHƯA ĐĂNG NHẬP:
        // Đánh giá chất lượng việc làm: Huy hiệu Tia Sét, NTD uy tín, Mức lương hấp dẫn, Điểm AI Match và Độ mới
        let score = (job.aiMatch ? Math.round(job.aiMatch * 0.5) : 30);
        if (job.isLightningBadge) score += 40; // HR phản hồi nhanh
        if (job.verified) score += 25; // NTD xác thực uy tín
        if (job.salaryIsOrange) score += 20; // Lương cạnh tranh
        if (job.updated.includes('phút')) score += 30; // Mới đăng < 1h
        else if (job.updated.includes('1 giờ') || job.updated.includes('2 giờ')) score += 15;
        return score;
      }

      // ĐÃ ĐĂNG NHẬP:
      // Ưu tiên theo dữ liệu người dùng:
      // - Hành vi gần đây (Cao): dữ liệu search job, dữ liệu xem job, dữ liệu lưu job
      // - Dữ liệu hồ sơ và CV ứng viên (Cao)
      // - Dữ liệu tính năng gợi ý việc làm (Cao)
      // - Dữ liệu tín hiệu job: mới đăng, uy tín NTD, độ tương tác (Trung bình)
      let score = 0;

      // 1. Dữ liệu tìm kiếm gần đây
      let searchHistory = [];
      try {
        searchHistory = JSON.parse(localStorage.getItem('easycv_search_history') || '[]');
      } catch (e) {
        searchHistory = ['Sales', 'B2B', 'React', 'Marketing'];
      }
      if (!Array.isArray(searchHistory) || searchHistory.length === 0) {
        searchHistory = ['Sales', 'B2B', 'React', 'Marketing'];
      }
      searchHistory.forEach(kw => {
        const kwLower = kw.toLowerCase();
        if (job.title.toLowerCase().includes(kwLower)) score += 45;
        if (job.skills.some(s => s.toLowerCase().includes(kwLower))) score += 30;
      });

      // 2. Dữ liệu xem job & lưu job gần đây
      let savedJobs = [];
      try {
        savedJobs = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
      } catch (e) {
        savedJobs = [];
      }
      if (savedJobs.includes(job.id)) score += 50;

      // 3. Dữ liệu hồ sơ & CV ứng viên (Profile: IT & Sales B2B, Kỹ năng cao)
      const userProfileSkills = ['B2B Sales', 'Key Account', 'ReactJS', 'Node.js', 'Digital Marketing', 'Data Analyst', 'HRBP'];
      job.skills.forEach(skill => {
        if (userProfileSkills.includes(skill)) score += 25;
      });
      if (job.category === 'sales' || job.category === 'it') score += 40;

      // 4. Tính năng gợi ý việc làm (AI Match)
      if (job.aiMatch) {
        score += Math.round(job.aiMatch * 0.5); // +40-50 điểm
      }

      // 5. Tín hiệu job: Mới đăng, Uy tín NTD, Huy hiệu Tia Sét
      if (job.isLightningBadge) score += 30; // HR phản hồi nhanh
      if (job.verified) score += 20; // NTD uy tín
      if (job.updated.includes('phút')) score += 25; // Mới đăng < 1h
      else if (job.updated.includes('1 giờ') || job.updated.includes('2 giờ')) score += 15;

      return score;
    }

    // Lấy danh sách việc làm đã sắp xếp theo tab hiện tại và thuật toán ưu tiên (chuẩn 2 trang x 12 việc làm = 24 việc làm)
    function getRankedJobsForCategory(categoryKey) {
      const isLogged = checkUserLoginState();
      
      if (categoryKey === 'all') {
        // Tab "Tất cả": Tuyển chọn cân bằng 24 việc làm hàng đầu từ 5 nhóm ngành (6 IT, 6 Sales, 4 Marketing, 4 Finance, 4 HR)
        const categories = ['it', 'sales', 'marketing', 'finance', 'hr'];
        const quota = { it: 6, sales: 6, marketing: 4, finance: 4, hr: 4 };
        
        let selected = [];
        categories.forEach(cat => {
          const catJobs = FEATURED_JOBS_DATA.filter(j => j.category === cat)
            .map(j => ({ ...j, priorityScore: calculateJobRank(j, isLogged) }))
            .sort((a, b) => b.priorityScore - a.priorityScore);
          selected.push(...catJobs.slice(0, quota[cat]));
        });

        // Sắp xếp tổng thể theo điểm ưu tiên để hiển thị các công việc hot nhất
        selected.sort((a, b) => b.priorityScore - a.priorityScore);
        return selected.slice(0, 24);
      }

      // Lọc theo nhóm ngành đã chọn (mỗi ngành đúng 24 việc làm = 2 trang x 12 thẻ)
      const filtered = FEATURED_JOBS_DATA.filter(job => job.category === categoryKey);

      // Tính điểm và sắp xếp giảm dần theo điểm ưu tiên
      const scoredList = filtered.map(job => ({
        ...job,
        priorityScore: calculateJobRank(job, isLogged)
      }));

      scoredList.sort((a, b) => b.priorityScore - a.priorityScore);
      return scoredList.slice(0, 24);
    }

    // Render danh sách job cards ra Grid
    function renderJobsGrid() {
      const rankedJobs = getRankedJobsForCategory(currentCategory);
      const totalJobs = rankedJobs.length;
      const totalPages = Math.max(1, Math.ceil(totalJobs / JOBS_PER_PAGE));

      if (currentPage > totalPages) currentPage = 1;

      const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
      const pageJobs = rankedJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

      let savedJobs = [];
      try {
        savedJobs = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
      } catch (e) {
        savedJobs = [];
      }

      const cardsHtml = pageJobs.map(job => {
        const isSaved = savedJobs.includes(job.id);
        const salaryClass = job.salaryIsOrange ? 'job-pill-salary' : 'job-pill-salary';
        
        // Huy hiệu Tia Sét chuẩn TopCV
        let lightningBadgeHtml = '';
        if (job.isLightningBadge && job.lightningStats) {
          const stats = job.lightningStats;
          lightningBadgeHtml = `
            <div class="badge-lightning" tabindex="0" role="tooltip" aria-label="Huy hiệu Tia Sét - Phản hồi nhanh">
              <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <!-- Tooltip chuẩn TopCV -->
              <div class="lightning-tooltip-box">
                <div class="lightning-tooltip-header">
                  <span>⚡ Huy hiệu Tia Sét</span>
                  <span style="color: #59B789; font-size: 11px;">Đang hiển thị</span>
                </div>
                <div class="lightning-tooltip-rate">
                  <strong>Tỷ lệ tương tác: ${stats.responseRate}%</strong> (${stats.evaluated14d}/${stats.applied30d} CV đã đánh giá)
                </div>
                <div class="lightning-tooltip-rules">
                  <div>• Tin đang hiển thị, có tối thiểu 2 CV ứng tuyển (30 ngày gần nhất).</div>
                  <div>• Tỷ lệ tương tác ≥ 80% (được NTD đánh giá trong vòng ≤14 ngày kể từ lúc nộp).</div>
                  <div>• Hệ thống tự động xét duyệt 2 lần/ngày vào lúc <strong>0h</strong> và <strong>12h</strong>.</div>
                  <div style="color: #8A8A8A; margin-top: 2px;">(Xét lần gần nhất lúc ${stats.lastReviewed} • Giữ huy hiệu trong khung giờ tiếp theo)</div>
                </div>
              </div>
            </div>
          `;
        }

        return `
          <article class="job-card" data-job-id="${job.id}" data-category="${job.category}">
            <div class="job-card-header">
              <div class="job-logo-wrapper" title="Công ty ${job.company} tuyển dụng tại EasyCV">
                <img src="${job.logo}" alt="${job.company}" class="job-logo" loading="lazy" />
                ${lightningBadgeHtml}
              </div>
              <div class="job-content">
                <a href="chi-tiet-viec-lam.html?id=${job.id}" class="job-title" data-job-id="${job.id}" title="${job.title}">${job.title}</a>
                <a href="chi-tiet-cong-ty.html?company=${encodeURIComponent(job.company)}" class="company-name" title="${job.company}">${job.company}</a>
              </div>
            </div>

            <div class="job-card-footer">
              <div class="job-pills">
                <span class="job-pill ${salaryClass}">${job.salaryBadge}</span>
                <span class="job-pill job-pill-location">${job.city || job.location.split('&')[0].split('(')[0].trim()}</span>
              </div>
              <button type="button" class="btn-bookmark ${isSaved ? 'active' : ''}" data-job-id="${job.id}" aria-label="${isSaved ? 'Bỏ Lưu' : 'Lưu công việc này'}" title="${isSaved ? 'Đã Lưu' : 'Lưu'}">
                <svg viewBox="0 0 24 24" fill="${isSaved ? '#FF3333' : 'none'}" stroke="${isSaved ? '#FF3333' : 'currentColor'}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>
          </article>
        `;
      }).join('');

      gridEl.innerHTML = cardsHtml;

      // Render Pagination Buttons
      renderPaginationControls(totalPages);

      // Gắn sự kiện cho các thẻ job mới tạo
      bindJobCardEvents();
    }

    // Render thanh điều hướng phân trang
    function renderPaginationControls(totalPages) {
      if (!paginationControls) return;

      if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
      }

      let btnsHtml = `
        <button type="button" class="featured-page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''} aria-label="Trang trước" title="Trang trước">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      `;

      for (let i = 1; i <= totalPages; i++) {
        btnsHtml += `
          <button type="button" class="featured-page-btn page-num-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" aria-label="Chuyển đến trang ${i}">
            ${i}
          </button>
        `;
      }

      btnsHtml += `
        <button type="button" class="featured-page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Trang tiếp theo" title="Trang tiếp theo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      `;

      paginationControls.innerHTML = btnsHtml;

      // Gắn sự kiện click phân trang
      const prevBtn = paginationControls.querySelector('.prev-btn');
      const nextBtn = paginationControls.querySelector('.next-btn');
      const numBtns = paginationControls.querySelectorAll('.page-num-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            renderJobsGrid();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderJobsGrid();
          }
        });
      }

      numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const page = parseInt(btn.getAttribute('data-page'), 10);
          if (page && page !== currentPage) {
            currentPage = page;
            renderJobsGrid();
          }
        });
      });
    }

    // Xử lý Popover Preview khi hover vào tên job
    function showJobPreview(jobId, targetEl) {
      if (!previewPopup) return;
      clearTimeout(previewHideTimeout);

      const job = FEATURED_JOBS_DATA.find(j => j.id === parseInt(jobId, 10));
      if (!job) return;

      const skillsHtml = job.skills.map(s => `<span class="job-preview-skill-pill">${s}</span>`).join('');
      const jdHtml = job.jdSummary.map(d => `<li>${d}</li>`).join('');

      let lightningBadgeInfo = '';
      if (job.isLightningBadge && job.lightningStats) {
        lightningBadgeInfo = `<span class="job-preview-badge job-preview-badge-lightning">⚡ Tương tác nhanh: ${job.lightningStats.responseRate}%</span>`;
      }

      previewPopup.innerHTML = `
        <div class="job-preview-header">
          <img src="${job.logo}" alt="${job.company}" class="job-preview-logo" />
          <div class="job-preview-title-box">
            <div class="job-preview-title">${job.title}</div>
            <div class="job-preview-company">${job.company}</div>
          </div>
        </div>

        <div class="job-preview-quick-badges">
          <span class="job-preview-badge job-preview-badge-salary">${job.salaryBadge}</span>
          <span class="job-preview-badge job-preview-badge-loc">📍 ${job.location}</span>
          <span class="job-preview-badge job-preview-badge-exp">💼 ${job.exp}</span>
          ${lightningBadgeInfo}
        </div>

        <div class="job-preview-section-title">Mô tả công việc tóm tắt</div>
        <ul class="job-preview-desc-list">
          ${jdHtml}
        </ul>

        <div class="job-preview-section-title">Kỹ năng yêu cầu</div>
        <div class="job-preview-skills-wrap">
          ${skillsHtml}
        </div>

        <div class="job-preview-actions">
          <a href="viec-lam.html?apply=${job.id}" class="job-preview-btn-apply" target="_blank" rel="noopener noreferrer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            <span>Ứng tuyển ngay</span>
          </a>
          <a href="chi-tiet-viec-lam.html?id=${job.id}" class="job-preview-btn-detail" target="_blank" rel="noopener noreferrer">
            <span>Xem chi tiết JD</span>
          </a>
        </div>
      `;

      // Định vị thông minh tránh tràn viewport
      const rect = targetEl.getBoundingClientRect();
      const popupWidth = 380;
      let leftPos = rect.left;
      let topPos = rect.bottom + 8;

      if (leftPos + popupWidth > window.innerWidth - 20) {
        leftPos = window.innerWidth - popupWidth - 20;
      }
      if (leftPos < 20) leftPos = 20;

      // Nếu gần đáy màn hình, hiển thị popup phía trên
      if (topPos + 350 > window.innerHeight) {
        topPos = Math.max(20, rect.top - 360);
      }

      previewPopup.style.left = `${leftPos}px`;
      previewPopup.style.top = `${topPos}px`;
      previewPopup.classList.add('is-visible');
      previewPopup.setAttribute('aria-hidden', 'false');
    }

    function hideJobPreview(immediate = false) {
      if (!previewPopup) return;
      if (immediate) {
        previewPopup.classList.remove('is-visible');
        previewPopup.setAttribute('aria-hidden', 'true');
        return;
      }
      previewHideTimeout = setTimeout(() => {
        previewPopup.classList.remove('is-visible');
        previewPopup.setAttribute('aria-hidden', 'true');
      }, 180);
    }

    if (previewPopup) {
      previewPopup.addEventListener('mouseenter', () => {
        clearTimeout(previewHideTimeout);
      });
      previewPopup.addEventListener('mouseleave', () => {
        hideJobPreview(false);
      });
    }

    // Gắn sự kiện cho các elements trên thẻ job
    function bindJobCardEvents() {
      // Hover tên job -> hiển thị Popover Preview
      gridEl.querySelectorAll('.job-title').forEach(titleEl => {
        titleEl.addEventListener('mouseenter', (e) => {
          const jobId = titleEl.getAttribute('data-job-id');
          if (jobId) {
            showJobPreview(jobId, titleEl);
          }
        });
        titleEl.addEventListener('mouseleave', () => {
          hideJobPreview(false);
        });
      });

      // Click Bookmark -> Lưu vào localStorage
      gridEl.querySelectorAll('.btn-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const jobId = parseInt(btn.getAttribute('data-job-id'), 10);
          if (!jobId) return;

          let savedJobs = [];
          try {
            savedJobs = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
          } catch (err) {
            savedJobs = [];
          }

          const idx = savedJobs.indexOf(jobId);
          if (idx > -1) {
            savedJobs.splice(idx, 1);
            btn.classList.remove('active');
            const svg = btn.querySelector('svg');
            if (svg) {
              svg.setAttribute('fill', 'none');
              svg.setAttribute('stroke', 'currentColor');
            }
          } else {
            savedJobs.push(jobId);
            btn.classList.add('active');
            const svg = btn.querySelector('svg');
            if (svg) {
              svg.setAttribute('fill', '#FF3333');
              svg.setAttribute('stroke', '#FF3333');
            }
          }

          localStorage.setItem('easycv_saved_jobs', JSON.stringify(savedJobs));
        });
      });

      // Click Thẻ job -> Mở trang chi tiết việc làm
      gridEl.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-bookmark') || e.target.closest('.company-name') || e.target.closest('.badge-lightning')) {
            return;
          }
          const jobId = card.getAttribute('data-job-id');
          if (jobId) {
            window.location.href = `chi-tiet-viec-lam.html?id=${jobId}`;
          }
        });
      });

      // Click Nút Ứng tuyển trên thẻ job (nếu có) -> Bật Toast thông báo ứng tuyển thành công
      gridEl.querySelectorAll('.btn-card-apply').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const card = btn.closest('.job-card');
          const title = card ? card.querySelector('.job-title')?.textContent.trim() : 'công việc';
          if (typeof showToast === 'function') {
            showToast(`🚀 Đã gửi hồ sơ ứng tuyển vị trí "${title}" thành công!`, '✓');
          }
        });
      });
    }

    // Xử lý chuyển đổi 5 Tabs ngành nghề
    const tabBtns = tabsContainer.querySelectorAll('.filter-pill-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        if (!cat || cat === currentCategory) return;

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        currentCategory = cat;
        currentPage = 1;
        renderJobsGrid();
      });
    });

    // Khởi tạo ban đầu
    renderJobsGrid();
  }

  // Khởi động toàn bộ các modules
  initLogoTooltips();
  initFeaturedJobsSection();
});


