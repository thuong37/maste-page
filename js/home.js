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
  const courseSection = document.querySelector('#goi-y-khoa-hoc');
  const courseGrid = courseSection?.querySelector('.courses-grid');
  if (courseGrid) {
    const samples = [
      { id: 'cloud', title: 'AWS Cloud Practitioner từ cơ bản đến thực hành', category: 'Cloud Computing', badge: 'Chứng chỉ quốc tế', teacher: 'Chuyên gia giải pháp Cloud', rating: '4.9 (1.8k học viên)', price: '1.790.000đ', old: '2.990.000đ', image: 'photo-1451187580459-43490279c0fa' },
      { id: 'marketing', title: 'Digital Marketing & tối ưu chiến dịch đa kênh', category: 'Digital Marketing', badge: 'Dự án thực tế', teacher: 'Marketing Lead tại doanh nghiệp công nghệ', rating: '4.8 (2.1k học viên)', price: '1.390.000đ', old: '2.490.000đ', image: 'photo-1460925895917-afdab827c52f' },
      { id: 'product', title: 'Quản lý sản phẩm: Từ ý tưởng đến ra mắt', category: 'Product Management', badge: 'Có chứng nhận', teacher: 'Senior Product Manager', rating: '4.9 (980 học viên)', price: '1.690.000đ', old: '2.890.000đ', image: 'photo-1552664730-d307ca884978' },
      { id: 'excel', title: 'Excel nâng cao & tự động hóa báo cáo', category: 'Office Skills', badge: 'Học theo dự án', teacher: 'Chuyên gia phân tích kinh doanh', rating: '4.8 (3.2k học viên)', price: '990.000đ', old: '1.790.000đ', image: 'photo-1543286386-713bdd548da4' }
    ];
    const star = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    samples.forEach(course => {
      const card = document.createElement('a');
      card.className = 'course-card';
      card.href = `#khoa-hoc-${course.id}`;
      card.innerHTML = `<div class="course-thumb-wrap" style="background-image:url('https://images.unsplash.com/${course.image}?auto=format&fit=crop&w=500&q=80')"><span class="course-category-tag">${course.category}</span><span class="course-match-badge">${course.badge}</span></div><div class="course-body"><h3 class="course-title">${course.title}</h3><div class="course-instructor"><span>Giảng viên: ${course.teacher}</span></div><div class="course-meta-row"><span class="course-rating">${star} ${course.rating}</span><div class="course-price-wrap"><span class="course-price-sale">${course.price}</span><span class="course-price-old">${course.old}</span></div></div></div>`;
      courseGrid.appendChild(card);
    });

    const cards = [...courseGrid.querySelectorAll('.course-card')];
    const controls = document.createElement('div');
    controls.className = 'course-carousel-controls';
    controls.setAttribute('aria-label', 'Điều hướng khóa học');
    controls.innerHTML = '<button class="course-carousel-arrow" type="button" aria-label="Nhóm khóa học trước">‹</button><div class="course-carousel-dots"></div><button class="course-carousel-arrow" type="button" aria-label="Nhóm khóa học tiếp theo">›</button>';
    courseGrid.after(controls);
    const dotsWrap = controls.querySelector('.course-carousel-dots');
    let page = 0;
    let timer;
    const pageSize = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 1100 ? 2 : 4;
    const render = () => {
      const size = pageSize();
      const count = Math.ceil(cards.length / size);
      page = Math.min(page, count - 1);
      cards.forEach((card, index) => { card.hidden = Math.floor(index / size) !== page; });
      dotsWrap.replaceChildren();
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'course-carousel-dot';
        dot.setAttribute('aria-label', `Nhóm khóa học ${i + 1}`);
        dot.setAttribute('aria-current', String(i === page));
        dot.addEventListener('click', () => { page = i; render(); restart(); });
        dotsWrap.appendChild(dot);
      }
    };
    const advance = step => { page = (page + step + Math.ceil(cards.length / pageSize())) % Math.ceil(cards.length / pageSize()); render(); };
    const stop = () => { clearInterval(timer); timer = undefined; };
    const restart = () => { stop(); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !courseSection.matches(':hover, :focus-within')) timer = setInterval(() => advance(1), 5000); };
    controls.querySelectorAll('.course-carousel-arrow').forEach((button, index) => button.addEventListener('click', () => { advance(index ? 1 : -1); restart(); }));
    courseSection.addEventListener('mouseenter', stop);
    courseSection.addEventListener('mouseleave', restart);
    courseSection.addEventListener('focusin', stop);
    courseSection.addEventListener('focusout', () => setTimeout(restart, 0));
    window.addEventListener('resize', () => { render(); restart(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : restart());
    render();
    restart();
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
  const industryNavList = document.getElementById('industryNavList');
  const industryPageInfo = document.getElementById('industryPageInfo');
  const btnIndustryPrevPage = document.getElementById('btnIndustryPrevPage');
  const btnIndustryNextPage = document.getElementById('btnIndustryNextPage');
  const industryMegaContent = document.getElementById('industryMegaContent');

  if (heroSearchWrapper && heroSearchInput && searchSuggestDropdown) {
    const STORAGE_KEY = 'easycv_recent_searches_v2';
    const DEFAULT_HISTORY = [
      'ReactJS Developer',
      'Marketing Leader',
      'UI/UX Designer',
      'Java Spring Boot',
      'Kế toán tổng hợp'
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
        itemBtn.className = `industry-nav-item ${cat.key === selectedCategoryKey ? 'active' : ''}`;
        itemBtn.setAttribute('data-category', cat.key);
        itemBtn.innerHTML = `
          <span>${cat.name}</span>
          <span class="nav-item-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        `;

        itemBtn.addEventListener('click', (e) => {
          e.preventDefault();
          selectCategory(cat.key);
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

      // Phần 1: Khối "Được tìm kiếm nhiều" với biểu tượng lửa đỏ
      if (catData.hotSearches && catData.hotSearches.length > 0) {
        html += `
          <div class="mega-section-hot">
            <span class="mega-hot-label">Được tìm kiếm nhiều</span>
            <div class="mega-hot-tags">
              ${catData.hotSearches.map(role => `
                <button type="button" class="hot-search-pill" data-role="${role}">
                  <span class="hot-fire-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72V7a5 5 0 0 1 5 5v1.28c.6.34 1 .98 1 1.72 0 1.1-.9 2-2 2h-1a5 5 0 0 1-5 5v1c0 1.1-.9 2-2 2s-2-.9-2-2v-1a5 5 0 0 1-5-5H2c-1.1 0-2-.9-2-2 0-.74.4-1.38 1-1.72V12a5 5 0 0 1 5-5V5.72C5.4 5.38 5 4.74 5 4c0-1.1.9-2 2-2h5z" opacity="0"/></svg>🔥
                  </span>
                  <span>${role}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Phần 2: Các nhóm danh mục chi tiết (mỗi nhóm gồm tên nhóm và các tag vị trí)
      if (catData.subgroups && catData.subgroups.length > 0) {
        catData.subgroups.forEach(group => {
          html += `
            <div class="mega-subgroup-row">
              <span class="mega-subgroup-title">${group.title}</span>
              <div class="mega-subgroup-tags">
                ${group.roles.map(r => `
                  <button type="button" class="subgroup-tag-pill" data-role="${r}">${r}</button>
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

      // Gắn sự kiện click tìm kiếm cho tất cả các thẻ vị trí
      const allPills = industryMegaContent.querySelectorAll('.hot-search-pill, .subgroup-tag-pill');
      allPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const role = pill.getAttribute('data-role') || pill.textContent.trim();
          executeSearch(role);
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

    // Initialize
    renderHistory();
    renderIndustryNav();
  }
});

