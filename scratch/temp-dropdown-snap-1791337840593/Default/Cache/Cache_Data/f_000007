/**
 * EasyCV - Category Filter Modal (Danh mục Nghề) Controller
 * Faithfully mirrors the reference job category filter while retaining
 * EasyCV's signature orange theme (#F97316) and design architecture.
 */

(function () {
  'use strict';

  // 1. Comprehensive Taxonomy Dataset
  const CATEGORY_DATA = [
    {
      key: 'sales',
      name: 'Kinh doanh/Bán hàng',
      popularKeywords: [
        'Nhân viên kinh doanh',
        'Nhân viên bán hàng',
        'Nhân viên tư vấn',
        'Telesales',
        'Sales Admin',
        'Tư vấn tuyển sinh',
        'Sales Online'
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
          roles: ['Kinh doanh thiết bị/vật liệu xây dựng', 'Kinh doanh nội thất', 'Tư vấn thiết kế xây dựng', 'Sales Xây dựng khác']
        },
        {
          title: 'Sales Giáo dục/Khoá học',
          roles: ['Tư vấn tuyển sinh/khoá học', 'Tư vấn du học/định cư', 'Sales Giáo dục/Khoá học khác']
        },
        {
          title: 'Sales Kỹ thuật & Công nghệ',
          roles: ['Sales Phần mềm B2B (SaaS)', 'Kinh doanh thiết bị IT', 'Chuyên viên giải pháp doanh nghiệp', 'Sales Kỹ thuật khác']
        },
        {
          title: 'Sales Bán lẻ & Chuỗi tiêu dùng',
          roles: ['Giám sát bán hàng (Supervisor)', 'Quản lý cửa hàng', 'Trình dược viên ETC/OTC', 'Sales Bán lẻ khác']
        }
      ]
    },
    {
      key: 'marketing',
      name: 'Marketing/PR/Quảng cáo',
      popularKeywords: [
        'Google Ads Specialist',
        'Facebook & TikTok Ads',
        'SEO Specialist',
        'Performance Marketing',
        'Copywriter / Content Lead',
        'Social Media Executive',
        'Brand Marketing Specialist'
      ],
      subgroups: [
        {
          title: 'Marketing Số (Digital Marketing)',
          roles: ['Google Ads Specialist', 'Facebook & TikTok Ads', 'SEO Specialist', 'Performance Marketing', 'Growth Marketing khác']
        },
        {
          title: 'Truyền thông & Sáng tạo nội dung',
          roles: ['Copywriter / Content Lead', 'Social Media Executive', 'Biên kịch Video / TikTok', 'PR & Báo chí khác']
        },
        {
          title: 'Thương hiệu & Sự kiện',
          roles: ['Brand Marketing Specialist', 'Trade Marketing Executive', 'Tổ chức sự kiện (Event Officer)', 'Thương hiệu khác']
        }
      ]
    },
    {
      key: 'cskh',
      name: 'Chăm sóc khách hàng (Customer Service)/Vận hành',
      popularKeywords: [
        'Chuyên viên tư vấn & CSKH',
        'Xử lý khiếu nại khách hàng',
        'Nhân viên Call Center / Trực chat',
        'Chăm sóc khách hàng VIP',
        'Điều phối dịch vụ khách hàng',
        'Hỗ trợ kỹ thuật Helpdesk'
      ],
      subgroups: [
        {
          title: 'Chăm sóc & Hỗ trợ khách hàng',
          roles: ['Chuyên viên tư vấn & CSKH', 'Xử lý khiếu nại khách hàng', 'Nhân viên Call Center / Trực chat', 'Chăm sóc khách hàng VIP']
        },
        {
          title: 'Vận hành dịch vụ khách hàng',
          roles: ['Điều phối dịch vụ khách hàng', 'Quản lý chất lượng dịch vụ (QA CSKH)', 'Hỗ trợ kỹ thuật Helpdesk', 'Vận hành CSKH khác']
        }
      ]
    },
    {
      key: 'hr',
      name: 'Nhân sự/Hành chính/Pháp chế',
      popularKeywords: [
        'Talent Acquisition Specialist',
        'Headhunter',
        'HR Business Partner (HRBP)',
        'Chuyên viên Tiền lương & Phúc lợi (C&B)',
        'Hành chính văn phòng',
        'Pháp chế doanh nghiệp'
      ],
      subgroups: [
        {
          title: 'Tuyển dụng & Quản trị nhân tài',
          roles: ['Talent Acquisition Specialist', 'Headhunter', 'HR Business Partner (HRBP)', 'Chuyên viên Đào tạo (L&D)']
        },
        {
          title: 'C&B & Chế độ chính sách',
          roles: ['Chuyên viên Tiền lương & Phúc lợi (C&B)', 'Quản lý hợp đồng & Hồ sơ nhân sự', 'Chuyên viên Quan hệ lao động']
        },
        {
          title: 'Hành chính & Pháp chế',
          roles: ['Hành chính văn phòng', 'Pháp chế doanh nghiệp', 'Văn thư - Lưu trữ', 'Hành chính khác']
        }
      ]
    },
    {
      key: 'it',
      name: 'Công nghệ Thông tin',
      popularKeywords: [
        'Frontend Developer (Vue/React)',
        'Backend Developer (Java/Node/.NET)',
        'Fullstack Developer',
        'Mobile Developer (iOS/Android)',
        'Data Analyst',
        'Machine Learning Engineer',
        'DevOps / SRE'
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
          roles: ['QA/QC Automation Tester', 'Manual Tester', 'Product Owner (PO)', 'Business Analyst (BA)']
        }
      ]
    },
    {
      key: 'worker',
      name: 'Lao động phổ thông',
      popularKeywords: [
        'Công nhân may mặc',
        'Công nhân lắp ráp điện tử',
        'Vận hành máy cơ khí',
        'Kiểm tra chất lượng (KCS)',
        'Tài xế giao hàng (Shipper)',
        'Nhân viên đóng gói & phụ kho'
      ],
      subgroups: [
        {
          title: 'Sản xuất & Vận hành máy',
          roles: ['Công nhân may mặc', 'Công nhân lắp ráp điện tử', 'Vận hành máy cơ khí', 'Kiểm tra chất lượng (KCS)']
        },
        {
          title: 'Kho bãi & Giao nhận',
          roles: ['Nhân viên đóng gói & phụ kho', 'Tài xế giao hàng (Shipper)', 'Lái xe tải / xe nâng', 'Bốc xếp hàng hóa']
        }
      ]
    },
    {
      key: 'finance',
      name: 'Tài chính / Ngân hàng / Bảo hiểm',
      popularKeywords: [
        'Kế toán tổng hợp',
        'Kế toán thuế',
        'Kế toán trưởng',
        'Kiểm toán viên độc lập',
        'Quan hệ khách hàng doanh nghiệp (RM)',
        'Tín dụng cá nhân',
        'Giao dịch viên Ngân hàng'
      ],
      subgroups: [
        {
          title: 'Kế toán & Kiểm toán',
          roles: ['Kế toán tổng hợp', 'Kế toán thuế', 'Kế toán trưởng', 'Kiểm toán viên độc lập']
        },
        {
          title: 'Ngân hàng & Đầu tư',
          roles: ['Quan hệ khách hàng doanh nghiệp (RM)', 'Tín dụng cá nhân', 'Phân tích tài chính', 'Giao dịch viên Ngân hàng']
        }
      ]
    },
    {
      key: 'logistics',
      name: 'Vận tải / Kho vận / Logistics',
      popularKeywords: [
        'Sales Logistics',
        'Nhân viên chứng từ XNK',
        'Khai báo hải quan điện tử',
        'Thu mua quốc tế (Sourcing)',
        'Hiện trường XNK',
        'Quản lý kho bãi (Warehouse)',
        'Supply Chain Specialist'
      ],
      subgroups: [
        {
          title: 'Sales Xuất nhập khẩu/Logistics',
          roles: ['Sales Logistics', 'Sales Xuất nhập khẩu/Logistics khác']
        },
        {
          title: 'Xuất nhập khẩu & Hải quan',
          roles: ['Nhân viên chứng từ XNK', 'Khai báo hải quan điện tử', 'Thu mua quốc tế (Sourcing)', 'Hiện trường XNK']
        },
        {
          title: 'Quản trị kho & Vận chuyển',
          roles: ['Quản lý kho bãi (Warehouse)', 'Điều phối đội xe', 'Supply Chain Specialist']
        }
      ]
    },
    {
      key: 'design',
      name: 'Thiết kế / Sáng tạo nghệ thuật',
      popularKeywords: [
        'Graphic Designer 2D',
        'Nhận diện thương hiệu',
        'Thiết kế bao bì / ấn phẩm',
        'UI/UX App/Web Designer',
        '3D Generalist',
        'Motion Designer / Animator'
      ],
      subgroups: [
        {
          title: 'Thiết kế Đồ họa & Thương hiệu',
          roles: ['Graphic Designer 2D', 'Nhận diện thương hiệu', 'Thiết kế bao bì / ấn phẩm']
        },
        {
          title: 'UI/UX & Mỹ thuật số',
          roles: ['UI/UX App/Web Designer', '3D Generalist', 'Motion Designer / Animator']
        }
      ]
    },
    {
      key: 'education',
      name: 'Giáo dục / Đào tạo / Giảng dạy',
      popularKeywords: [
        'Giáo viên tiếng Anh / IELTS',
        'Giáo viên tiếng Trung / Hàn / Nhật',
        'Trợ giảng lớp học',
        'Giáo viên STEM / Lập trình',
        'Tư vấn giáo dục',
        'Phát triển khóa học'
      ],
      subgroups: [
        {
          title: 'Giảng dạy ngoại ngữ',
          roles: ['Giáo viên tiếng Anh / IELTS', 'Giáo viên tiếng Trung / Hàn / Nhật', 'Trợ giảng lớp học']
        },
        {
          title: 'Giáo dục phổ thông & Kỹ năng',
          roles: ['Giáo viên STEM / Lập trình', 'Tư vấn giáo dục', 'Phát triển khóa học']
        }
      ]
    }
  ];

  // Popular searches shown inside category modal
  const POPULAR_KEYWORDS = [
    'Nhân viên kinh doanh',
    'Nhân viên bán hàng',
    'Nhân viên tư vấn',
    'Telesales',
    'Sales Admin',
    'Tư vấn tuyển sinh',
    'Sales Online'
  ];

  // Additional quick search keywords for suggestions mode
  const SUGGESTION_KEYWORDS = [
    'Frontend Developer',
    'Java Spring',
    'Digital Marketing',
    'Kế toán tổng hợp',
    'Graphic Designer',
    'Data Analyst',
    'Nhân viên xuất nhập khẩu',
    'Talent Acquisition'
  ];

  // Helper normalizer
  function normalizeStr(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .trim();
  }

  // Global Controller Object
  window.EasyCVCategoryModal = {
    data: CATEGORY_DATA,
    activeCategoryKey: 'sales',
    appliedSelection: {
      groups: new Set(),
      subgroups: new Set(),
      roles: new Set()
    },
    tempSelection: {
      groups: new Set(),
      subgroups: new Set(),
      roles: new Set()
    },
    isOpen: false,
    isSearchMode: false,

    init: function (config = {}) {
      this.triggerBtn = document.getElementById(config.triggerId || 'categoryFilterTrigger');
      this.triggerLabel = document.getElementById(config.labelId || 'categoryFilterLabel');
      this.overlay = document.getElementById(config.overlayId || 'categoryModalOverlay');
      this.backdrop = document.getElementById(config.backdropId || 'categoryModalBackdrop');
      this.dialog = this.overlay ? this.overlay.querySelector('.category-modal-dialog') : null;
      this.closeBtn = document.getElementById(config.closeBtnId || 'categoryModalClose');
      this.searchInput = document.getElementById(config.searchInputId || 'categoryModalSearchInput');
      this.searchClearBtn = document.getElementById(config.searchClearBtnId || 'categorySearchClear');
      
      this.popularWrap = document.getElementById(config.popularWrapId || 'categoryPopularWrap');
      this.popularChipListEl = document.getElementById(config.popularChipListId || 'categoryPopularChipList');
      this.groupListEl = document.getElementById(config.groupListId || 'categoryGroupList');
      this.subgroupListEl = document.getElementById(config.subgroupListId || 'categorySubgroupList');
      this.subgroupItemsEl = document.getElementById('categorySubgroupItems');

      this.defaultHeadersEl = document.querySelector('.category-default-headers');
      this.searchHeadersEl = document.getElementById('categorySearchHeaders');
      this.searchCountEl = document.getElementById('categorySearchCount');
      this.exitSearchBtn = document.getElementById('btnExitCategorySearch');
      this.searchSuggestionsEl = document.getElementById('categorySearchSuggestions');
      this.searchResultsListEl = document.getElementById('categorySearchResultsList');
      this.searchCloseBtn = document.getElementById(config.searchCloseBtnId || 'btnCategorySearchClose');

      this.scrollHintEl = document.getElementById(config.scrollHintId || 'categoryScrollHint');
      this.clearAllBtn = document.getElementById(config.clearAllBtnId || 'btnCategoryClearAll');
      this.cancelBtn = document.getElementById(config.cancelBtnId || 'btnCategoryCancel');
      this.submitBtn = document.getElementById(config.submitBtnId || 'btnCategorySubmit');
      this.onApplyCallback = config.onApply || null;

      if (!this.overlay) {
        return;
      }

      this.bindEvents();
      this.renderGroups();
      this.renderSubgroups();
      this.renderPopularKeywords();
    },

    bindEvents: function () {
      const self = this;

      if (this.triggerBtn) {
        this.triggerBtn.addEventListener('click', (e) => {
          if (e.target.closest('#categoryClearBtn, .category-clear-btn')) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          e.preventDefault();
          if (self.isOpen) {
            self.close(false);
          } else {
            self.open();
          }
        });
      }

      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => self.close(false));
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => self.close(false));
      }

      if (this.cancelBtn) {
        this.cancelBtn.addEventListener('click', () => self.close(false));
      }

      if (this.submitBtn) {
        this.submitBtn.addEventListener('click', () => self.apply());
      }

      if (this.clearAllBtn) {
        this.clearAllBtn.addEventListener('click', () => self.clearAll());
      }

      // Nút Đóng tìm kiếm (chuẩn TopCV cạnh ô search input)
      if (this.searchCloseBtn) {
        this.searchCloseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          self.exitSearchMode();
        });
      }

      // Search Input Focus / Click: Enter Search Mode (TopCV Standard)
      if (this.searchInput) {
        this.searchInput.addEventListener('focus', () => {
          self.enterSearchMode();
        });

        this.searchInput.addEventListener('click', () => {
          self.enterSearchMode();
        });

        this.searchInput.addEventListener('input', () => {
          const val = self.searchInput.value.trim();
          if (self.searchClearBtn) {
            self.searchClearBtn.hidden = !val;
          }
          if (!self.isSearchMode) {
            self.enterSearchMode();
          }
          self.handleSearch(val);
        });
      }

      if (this.searchClearBtn) {
        this.searchClearBtn.addEventListener('click', () => {
          if (self.searchInput) {
            self.searchInput.value = '';
            self.searchInput.focus();
            self.searchClearBtn.hidden = true;
            self.handleSearch('');
          }
        });
      }

      if (this.exitSearchBtn) {
        this.exitSearchBtn.addEventListener('click', () => {
          self.exitSearchMode();
        });
      }

      if (this.scrollHintEl && this.subgroupListEl) {
        this.subgroupListEl.addEventListener('scroll', () => {
          const maxScroll = self.subgroupListEl.scrollHeight - self.subgroupListEl.clientHeight;
          if (self.subgroupListEl.scrollTop > 50 || maxScroll < 40) {
            self.scrollHintEl.classList.add('is-hidden');
          } else {
            self.scrollHintEl.classList.remove('is-hidden');
          }
        });

        this.scrollHintEl.addEventListener('click', () => {
          self.subgroupListEl.scrollBy({ top: 180, behavior: 'smooth' });
        });
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && self.isOpen) {
          if (self.isSearchMode && self.searchInput && self.searchInput.value) {
            self.searchInput.value = '';
            if (self.searchClearBtn) self.searchClearBtn.hidden = true;
            self.handleSearch('');
          } else if (self.isSearchMode) {
            self.exitSearchMode();
          } else {
            self.close(false);
          }
        }
      });

      // Window resize & scroll dynamic alignment
      window.addEventListener('resize', () => {
        if (self.isOpen) self.updatePosition();
      }, { passive: true });

      window.addEventListener('scroll', () => {
        if (self.isOpen) self.updatePosition();
      }, { passive: true });
    },

    enterSearchMode: function () {
      this.isSearchMode = true;
      if (this.dialog) {
        this.dialog.classList.add('is-searching');
      }
      if (this.defaultHeadersEl) this.defaultHeadersEl.style.display = 'none';
      if (this.searchHeadersEl) this.searchHeadersEl.style.display = 'flex';
      if (this.popularWrap) this.popularWrap.hidden = true;
      if (this.subgroupItemsEl) this.subgroupItemsEl.style.display = 'none';

      const val = this.searchInput ? this.searchInput.value.trim() : '';
      if (!val) {
        this.renderSearchSuggestions();
      } else {
        this.handleSearch(val);
      }
    },

    exitSearchMode: function () {
      this.isSearchMode = false;
      if (this.dialog) {
        this.dialog.classList.remove('is-searching');
      }
      if (this.searchInput) {
        this.searchInput.value = '';
        if (this.searchClearBtn) this.searchClearBtn.hidden = true;
      }
      if (this.defaultHeadersEl) this.defaultHeadersEl.style.display = 'contents';
      if (this.searchHeadersEl) this.searchHeadersEl.style.display = 'none';
      if (this.searchSuggestionsEl) this.searchSuggestionsEl.style.display = 'none';
      if (this.searchResultsListEl) this.searchResultsListEl.style.display = 'none';
      if (this.popularWrap) this.popularWrap.hidden = false;
      if (this.subgroupItemsEl) this.subgroupItemsEl.style.display = 'block';

      this.renderGroups();
      this.renderSubgroups();
    },

    renderSearchSuggestions: function () {
      if (!this.searchSuggestionsEl) return;
      const self = this;
      this.searchSuggestionsEl.style.display = 'flex';
      if (this.searchResultsListEl) this.searchResultsListEl.style.display = 'none';
      if (this.searchCountEl) this.searchCountEl.textContent = 'Gợi ý tìm kiếm';

      const allChips = [...POPULAR_KEYWORDS, ...SUGGESTION_KEYWORDS];
      const popularChipsHtml = allChips.map(keyword => 
        `<button type="button" class="category-suggest-chip" data-keyword="${keyword}">${keyword}</button>`
      ).join('');

      const groupChipsHtml = CATEGORY_DATA.map(g =>
        `<button type="button" class="category-suggest-chip is-group" data-group="${g.key}">${g.name}</button>`
      ).join('');

      this.searchSuggestionsEl.innerHTML = `
        <div class="category-search-suggest-block">
          <div class="category-search-suggest-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Từ khóa được tìm kiếm nhiều</span>
          </div>
          <div class="category-search-suggest-chips">
            ${popularChipsHtml}
          </div>
        </div>

        <div class="category-search-suggest-block">
          <div class="category-search-suggest-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M6 6h10"></path><path d="M6 10h10"></path></svg>
            <span>Nhóm ngành nghề nổi bật</span>
          </div>
          <div class="category-search-suggest-chips">
            ${groupChipsHtml}
          </div>
        </div>
      `;

      // Click suggestion chip
      this.searchSuggestionsEl.querySelectorAll('.category-suggest-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const kw = chip.getAttribute('data-keyword');
          const groupKey = chip.getAttribute('data-group');
          if (kw) {
            if (self.searchInput) {
              self.searchInput.value = kw;
              if (self.searchClearBtn) self.searchClearBtn.hidden = false;
              self.handleSearch(kw);
            }
          } else if (groupKey) {
            self.exitSearchMode();
            self.activeCategoryKey = groupKey;
            self.renderGroups();
            self.renderSubgroups();
          }
        });
      });
    },

    updatePosition: function () {
      if (!this.overlay || !this.isOpen) return;
      const dialog = this.overlay.querySelector('.category-modal-dialog');
      if (!dialog) return;

      if (window.innerWidth <= 768) {
        dialog.style.removeProperty('top');
        dialog.style.removeProperty('max-height');
        dialog.style.removeProperty('height');
        return;
      }

      const searchBox = document.getElementById('jobSearchForm') || 
                        document.getElementById('heroSearchBox') || 
                        (this.triggerBtn ? this.triggerBtn.closest('.hero-search-box') : null);

      if (searchBox) {
        const boxRect = searchBox.getBoundingClientRect();
        const topPos = Math.max(10, Math.round(boxRect.bottom + 8));
        document.documentElement.style.setProperty('--cat-modal-top', `${topPos}px`);
        dialog.style.setProperty('top', `${topPos}px`, 'important');

        const availableHeight = Math.max(260, window.innerHeight - topPos - 20);
        const targetHeight = Math.round(availableHeight * (2 / 3));
        document.documentElement.style.setProperty('--cat-modal-height', `${targetHeight}px`);
        dialog.style.setProperty('height', `${targetHeight}px`, 'important');
        dialog.style.setProperty('max-height', `${targetHeight}px`, 'important');
      }
    },

    open: function () {
      this.isOpen = true;
      this.tempSelection = {
        groups: new Set(this.appliedSelection.groups),
        subgroups: new Set(this.appliedSelection.subgroups),
        roles: new Set(this.appliedSelection.roles)
      };

      if (this.overlay) {
        this.overlay.hidden = false;
      }
      if (this.triggerBtn) {
        this.triggerBtn.setAttribute('aria-expanded', 'true');
        this.triggerBtn.classList.add('is-active');
        const searchBox = this.triggerBtn.closest('.hero-search-box') || document.getElementById('jobSearchForm') || document.getElementById('heroSearchBox');
        if (searchBox) searchBox.classList.add('is-category-open');
      }

      this.updatePosition();

      const searchSuggestDropdown = document.getElementById('searchSuggestDropdown');
      if (searchSuggestDropdown) {
        searchSuggestDropdown.classList.remove('is-open');
      }

      document.body.style.overflow = 'hidden';

      if (this.searchInput) {
        this.searchInput.value = '';
        if (this.searchClearBtn) this.searchClearBtn.hidden = true;
      }

      this.exitSearchMode();
      this.renderGroups();
      this.renderSubgroups();
      this.renderPopularKeywords();
    },

    close: function (isApplied = false) {
      this.isOpen = false;
      this.isSearchMode = false;
      if (this.dialog) {
        this.dialog.classList.remove('is-searching');
      }
      if (!isApplied) {
        this.tempSelection = {
          groups: new Set(this.appliedSelection.groups),
          subgroups: new Set(this.appliedSelection.subgroups),
          roles: new Set(this.appliedSelection.roles)
        };
      }

      if (this.overlay) {
        this.overlay.hidden = true;
      }
      if (this.triggerBtn) {
        this.triggerBtn.setAttribute('aria-expanded', 'false');
        if (this.appliedSelection.groups.size === 0 && this.appliedSelection.roles.size === 0) {
          this.triggerBtn.classList.remove('is-active');
        }
        const searchBox = this.triggerBtn.closest('.hero-search-box') || document.getElementById('jobSearchForm') || document.getElementById('heroSearchBox');
        if (searchBox) searchBox.classList.remove('is-category-open');
      }

      document.body.style.overflow = '';
    },

    clearAll: function () {
      this.tempSelection.groups.clear();
      this.tempSelection.subgroups.clear();
      this.tempSelection.roles.clear();
      this.renderGroups();
      if (this.isSearchMode && this.searchInput && this.searchInput.value.trim()) {
        this.handleSearch(this.searchInput.value.trim());
      } else {
        this.renderSubgroups();
      }
    },

    apply: function () {
      this.appliedSelection = {
        groups: new Set(this.tempSelection.groups),
        subgroups: new Set(this.tempSelection.subgroups),
        roles: new Set(this.tempSelection.roles)
      };

      this.updateTriggerUI();
      this.close(true);

      const payload = {
        groups: Array.from(this.appliedSelection.groups),
        subgroups: Array.from(this.appliedSelection.subgroups),
        roles: Array.from(this.appliedSelection.roles),
        primaryQuery: this.getPrimaryFilterQuery()
      };

      if (typeof this.onApplyCallback === 'function') {
        this.onApplyCallback(payload);
      }

      const event = new CustomEvent('easycv:category-applied', { detail: payload, bubbles: true });
      document.dispatchEvent(event);
    },

    getPrimaryFilterQuery: function () {
      if (this.appliedSelection.roles.size > 0) {
        return Array.from(this.appliedSelection.roles)[0];
      }
      if (this.appliedSelection.subgroups.size > 0) {
        return Array.from(this.appliedSelection.subgroups)[0];
      }
      if (this.appliedSelection.groups.size > 0) {
        const groupKey = Array.from(this.appliedSelection.groups)[0];
        const group = CATEGORY_DATA.find(g => g.key === groupKey);
        return group ? group.name : '';
      }
      return '';
    },

    clearAndApply: function () {
      this.appliedSelection = {
        groups: new Set(),
        subgroups: new Set(),
        roles: new Set()
      };
      this.tempSelection = {
        groups: new Set(),
        subgroups: new Set(),
        roles: new Set()
      };

      this.updateTriggerUI();
      if (this.isOpen) {
        this.renderGroups();
        this.renderSubgroups();
        this.renderPopularKeywords();
      }

      const payload = {
        groups: [],
        subgroups: [],
        roles: [],
        primaryQuery: ''
      };

      if (typeof this.onApplyCallback === 'function') {
        this.onApplyCallback(payload);
      }

      const event = new CustomEvent('easycv:category-applied', { detail: payload, bubbles: true });
      document.dispatchEvent(event);
    },

    updateTriggerUI: function () {
      if (!this.triggerLabel) return;

      const totalItems = this.appliedSelection.roles.size > 0
        ? this.appliedSelection.roles.size
        : (this.appliedSelection.subgroups.size > 0
            ? this.appliedSelection.subgroups.size
            : this.appliedSelection.groups.size);

      const chevron = this.triggerBtn ? this.triggerBtn.querySelector('.category-chevron') : null;
      let clearBtn = this.triggerBtn ? this.triggerBtn.querySelector('.category-clear-btn') : null;

      if (!clearBtn && this.triggerBtn) {
        clearBtn = document.createElement('span');
        clearBtn.className = 'category-clear-btn';
        clearBtn.id = 'categoryClearBtn';
        clearBtn.setAttribute('role', 'button');
        clearBtn.setAttribute('tabindex', '0');
        clearBtn.setAttribute('title', 'Hủy chọn danh mục');
        clearBtn.setAttribute('aria-label', 'Hủy chọn danh mục nghề');
        clearBtn.innerHTML = '✕';
        this.triggerBtn.appendChild(clearBtn);

        const self = this;
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          self.clearAndApply();
        });
        clearBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            self.clearAndApply();
          }
        });
      }

      if (totalItems === 0) {
        this.triggerLabel.textContent = 'Danh mục nghề';
        if (this.triggerBtn) {
          this.triggerBtn.classList.remove('is-active');
          this.triggerBtn.title = 'Mở bộ lọc theo danh mục nghề';
        }
        if (chevron) chevron.style.display = '';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
      }

      if (this.triggerBtn) {
        this.triggerBtn.classList.add('is-active');
        this.triggerBtn.title = `Đã chọn ${totalItems} danh mục nghề (Nhấn ✕ để hủy chọn nhanh)`;
      }

      // Theo yêu cầu người dùng: lúc nào cũng hiện "Danh mục nghề", có chọn thì hiện thêm số các danh mục con: "Danh mục nghề (5)"
      this.triggerLabel.textContent = `Danh mục nghề (${totalItems})`;

      if (chevron) chevron.style.display = 'none';
      if (clearBtn) clearBtn.style.display = 'inline-flex';
    },

    renderPopularKeywords: function () {
      if (!this.popularChipListEl) return;
      const self = this;
      const currentCategory = CATEGORY_DATA.find(c => c.key === self.activeCategoryKey) || CATEGORY_DATA[0];
      const keywords = (currentCategory && currentCategory.popularKeywords && currentCategory.popularKeywords.length > 0)
        ? currentCategory.popularKeywords
        : POPULAR_KEYWORDS;

      this.popularChipListEl.innerHTML = keywords.map(keyword => {
        const isSelected = self.tempSelection.roles.has(keyword);
        return `<button type="button" class="category-popular-chip ${isSelected ? 'is-selected' : ''}" data-keyword="${keyword}">${keyword}</button>`;
      }).join('');

      this.popularChipListEl.querySelectorAll('.category-popular-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const keyword = chip.getAttribute('data-keyword');
          self.togglePopularRole(keyword);
        });
      });
    },

    togglePopularRole: function (keyword) {
      const currentCat = CATEGORY_DATA.find(c => c.key === this.activeCategoryKey);
      let parentSub = null;
      if (currentCat) {
        parentSub = currentCat.subgroups.find(s => s.roles.includes(keyword));
      }
      if (!parentSub) {
        for (const cat of CATEGORY_DATA) {
          parentSub = cat.subgroups.find(s => s.roles.includes(keyword));
          if (parentSub) break;
        }
      }
      this.toggleRole(keyword, parentSub ? parentSub.title : null);
    },

    handleSearch: function (query) {
      const norm = normalizeStr(query);
      if (!norm) {
        this.renderSearchSuggestions();
        return;
      }

      if (this.searchSuggestionsEl) this.searchSuggestionsEl.style.display = 'none';
      if (this.searchResultsListEl) this.searchResultsListEl.style.display = 'flex';

      // Flat list of matching roles with full breadcrumb hierarchy (TopCV standard)
      const matchingItems = [];
      const seenKey = new Set();

      CATEGORY_DATA.forEach(group => {
        group.subgroups.forEach(sub => {
          sub.roles.forEach(role => {
            const matchRole = normalizeStr(role).includes(norm);
            const matchSub = normalizeStr(sub.title).includes(norm);
            const matchGroup = normalizeStr(group.name).includes(norm);

            if (matchRole || matchSub || matchGroup) {
              const uniqueKey = `${role}__${sub.title}__${group.key}`;
              if (!seenKey.has(uniqueKey)) {
                seenKey.add(uniqueKey);
                matchingItems.push({
                  role: role,
                  categoryKey: group.key,
                  categoryName: group.name,
                  subgroupTitle: sub.title,
                  isDirectMatch: matchRole
                });
              }
            }
          });
        });
      });

      // Ưu tiên role khớp trực tiếp từ khóa lên trước
      matchingItems.sort((a, b) => {
        if (a.isDirectMatch && !b.isDirectMatch) return -1;
        if (!a.isDirectMatch && b.isDirectMatch) return 1;
        return 0;
      });

      if (this.searchCountEl) {
        this.searchCountEl.textContent = `${matchingItems.length} kết quả`;
      }

      this.renderSearchResults(matchingItems, query);
    },

    renderGroups: function () {
      if (!this.groupListEl) return;
      const self = this;
      this.groupListEl.innerHTML = '';

      CATEGORY_DATA.forEach(cat => {
        const item = document.createElement('div');
        item.className = `category-group-item ${cat.key === self.activeCategoryKey ? 'is-active' : ''}`;
        item.setAttribute('data-category', cat.key);

        const isChecked = self.tempSelection.groups.has(cat.key);

        item.innerHTML = `
          <div class="category-group-label-wrap">
            <div class="cat-checkbox ${isChecked ? 'is-checked' : ''}" data-action="toggle-group" data-key="${cat.key}" title="Chọn toàn bộ ${cat.name}">
              <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="category-group-title">${cat.name}</span>
          </div>
          <svg class="cat-group-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;

        // Yêu cầu 1: Khi HOVER vào từng nhóm nghề thì tự động hiển thị theo "Nghề" tương ứng, không bắt buộc phải chọn
        item.addEventListener('mouseenter', () => {
          if (self.isSearchMode) return;
          if (self.activeCategoryKey !== cat.key) {
            self.activeCategoryKey = cat.key;
            self.groupListEl.querySelectorAll('.category-group-item').forEach(el => {
              el.classList.toggle('is-active', el.getAttribute('data-category') === cat.key);
            });
            self.renderSubgroups();
          }
        });

        // Click row: toggle checkbox nếu click checkbox, hoặc active nếu click text
        item.addEventListener('click', (e) => {
          if (e.target.closest('.cat-checkbox')) {
            e.stopPropagation();
            self.toggleCategory(cat.key);
            return;
          }
          self.activeCategoryKey = cat.key;
          self.groupListEl.querySelectorAll('.category-group-item').forEach(el => {
            el.classList.toggle('is-active', el.getAttribute('data-category') === cat.key);
          });
          self.renderSubgroups();
        });

        self.groupListEl.appendChild(item);
      });
    },

    renderSubgroups: function () {
      this.renderPopularKeywords();
      const container = this.subgroupItemsEl || this.subgroupListEl;
      if (!container) return;
      const self = this;
      container.innerHTML = '';

      const currentCategory = CATEGORY_DATA.find(c => c.key === self.activeCategoryKey) || CATEGORY_DATA[0];
      if (!currentCategory) return;

      currentCategory.subgroups.forEach(sub => {
        const row = document.createElement('div');
        row.className = 'category-subgroup-row';

        const isSubChecked = self.tempSelection.subgroups.has(sub.title);

        const pillsHtml = sub.roles.map(role => {
          const isRoleSelected = self.tempSelection.roles.has(role);
          return `<button type="button" class="category-specialty-pill ${isRoleSelected ? 'is-selected' : ''}" data-role="${role}">${role}</button>`;
        }).join('');

        row.innerHTML = `
          <div class="category-role-title-wrap" data-subgroup="${sub.title}">
            <div class="cat-checkbox ${isSubChecked ? 'is-checked' : ''}" data-action="toggle-subgroup" data-title="${sub.title}">
              <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="category-role-title">${sub.title}</span>
          </div>
          <div class="category-specialty-pills">
            ${pillsHtml}
          </div>
        `;

        const titleWrap = row.querySelector('.category-role-title-wrap');
        titleWrap.addEventListener('click', () => {
          self.toggleSubgroup(sub.title, sub.roles);
        });

        row.querySelectorAll('.category-specialty-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            const role = pill.getAttribute('data-role');
            self.toggleRole(role, sub.title);
          });
        });

        container.appendChild(row);
      });

      if (this.scrollHintEl && this.subgroupListEl) {
        setTimeout(() => {
          const hasScroll = self.subgroupListEl.scrollHeight > self.subgroupListEl.clientHeight + 40;
          self.scrollHintEl.classList.toggle('is-hidden', !hasScroll);
        }, 50);
      }
    },

    renderSearchResults: function (results, query) {
      const container = this.searchResultsListEl || this.subgroupItemsEl || this.subgroupListEl;
      if (!container) return;
      const self = this;
      container.innerHTML = '';

      if (results.length === 0) {
        container.innerHTML = `
          <div class="category-search-empty">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <div style="font-weight: 700; color: #334155; margin-top: 12px; font-size: 15px;">Không tìm thấy ngành nghề phù hợp với "${query}"</div>
            <p style="color: #64748B; font-size: 13.5px; margin-top: 6px;">Vui lòng thử lại với các từ khóa phổ biến: "Sale", "Marketing", "Frontend", "Kế toán"...</p>
          </div>
        `;
        if (this.scrollHintEl) this.scrollHintEl.classList.add('is-hidden');
        return;
      }

      results.forEach(item => {
        const isSelected = self.tempSelection.roles.has(item.role);

        const row = document.createElement('div');
        row.className = `category-search-result-item ${isSelected ? 'is-selected' : ''}`;
        row.setAttribute('data-role', item.role);
        row.setAttribute('data-subgroup', item.subgroupTitle);

        row.innerHTML = `
          <div class="cat-checkbox ${isSelected ? 'is-checked' : ''}" data-action="toggle-search-role">
            <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="category-search-result-info">
            <div class="category-search-result-name">${item.role}</div>
            <div class="category-search-result-breadcrumb">
              <span>${item.categoryName.toUpperCase()}</span>
              <span class="breadcrumb-separator">&rsaquo;</span>
              <span>${item.subgroupTitle.toUpperCase()}</span>
            </div>
          </div>
        `;

        row.addEventListener('click', (e) => {
          e.preventDefault();
          self.toggleRole(item.role, item.subgroupTitle);
          const nextSelected = self.tempSelection.roles.has(item.role);
          row.classList.toggle('is-selected', nextSelected);
          const cb = row.querySelector('.cat-checkbox');
          if (cb) cb.classList.toggle('is-checked', nextSelected);
        });

        container.appendChild(row);
      });

      if (this.scrollHintEl && this.subgroupListEl) {
        setTimeout(() => {
          const hasScroll = self.subgroupListEl.scrollHeight > self.subgroupListEl.clientHeight + 40;
          self.scrollHintEl.classList.toggle('is-hidden', !hasScroll);
        }, 50);
      }
    },

    toggleCategory: function (catKey) {
      const isCurrentlyChecked = this.tempSelection.groups.has(catKey);
      const cat = CATEGORY_DATA.find(c => c.key === catKey);

      this.activeCategoryKey = catKey;

      if (isCurrentlyChecked) {
        this.tempSelection.groups.delete(catKey);
        if (cat) {
          cat.subgroups.forEach(sub => {
            this.tempSelection.subgroups.delete(sub.title);
            sub.roles.forEach(r => this.tempSelection.roles.delete(r));
          });
        }
      } else {
        this.tempSelection.groups.add(catKey);
        if (cat) {
          cat.subgroups.forEach(sub => {
            this.tempSelection.subgroups.add(sub.title);
            sub.roles.forEach(r => this.tempSelection.roles.add(r));
          });
        }
      }

      this.renderGroups();
      this.renderSubgroups();
    },

    toggleSubgroup: function (title, roles = []) {
      const isCurrentlyChecked = this.tempSelection.subgroups.has(title);

      if (isCurrentlyChecked) {
        this.tempSelection.subgroups.delete(title);
        roles.forEach(r => this.tempSelection.roles.delete(r));
        const currentCat = CATEGORY_DATA.find(c => c.key === this.activeCategoryKey);
        if (currentCat) {
          this.tempSelection.groups.delete(currentCat.key);
        }
      } else {
        this.tempSelection.subgroups.add(title);
        roles.forEach(r => this.tempSelection.roles.add(r));
        const currentCat = CATEGORY_DATA.find(c => c.key === this.activeCategoryKey);
        if (currentCat) {
          const allSubsChecked = currentCat.subgroups.every(s => this.tempSelection.subgroups.has(s.title));
          if (allSubsChecked) {
            this.tempSelection.groups.add(currentCat.key);
          }
        }
      }

      this.renderGroups();
      if (this.isSearchMode && this.searchInput && this.searchInput.value.trim()) {
        this.handleSearch(this.searchInput.value.trim());
      } else {
        this.renderSubgroups();
      }
    },

    toggleRole: function (role, subTitle) {
      if (this.tempSelection.roles.has(role)) {
        this.tempSelection.roles.delete(role);
        if (subTitle) {
          this.tempSelection.subgroups.delete(subTitle);
          const currentCat = CATEGORY_DATA.find(c => c.key === this.activeCategoryKey);
          if (currentCat) {
            this.tempSelection.groups.delete(currentCat.key);
          }
        }
      } else {
        this.tempSelection.roles.add(role);
        if (subTitle) {
          const currentCat = CATEGORY_DATA.find(c => c.key === this.activeCategoryKey);
          const sub = currentCat?.subgroups.find(s => s.title === subTitle);
          if (sub && sub.roles.every(r => this.tempSelection.roles.has(r))) {
            this.tempSelection.subgroups.add(subTitle);
            if (currentCat.subgroups.every(s => this.tempSelection.subgroups.has(s.title))) {
              this.tempSelection.groups.add(currentCat.key);
            }
          }
        }
      }

      this.renderGroups();
      if (this.isSearchMode && this.searchInput && this.searchInput.value.trim()) {
        this.handleSearch(this.searchInput.value.trim());
      } else {
        this.renderSubgroups();
      }
    },

    setSelection: function ({ groups = [], subgroups = [], roles = [] }) {
      this.appliedSelection = {
        groups: new Set(groups),
        subgroups: new Set(subgroups),
        roles: new Set(roles)
      };
      this.tempSelection = {
        groups: new Set(groups),
        subgroups: new Set(subgroups),
        roles: new Set(roles)
      };
      this.updateTriggerUI();
    }
  };

  // Auto-init on DOMContentLoaded if element exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('categoryModalOverlay')) {
      window.EasyCVCategoryModal.init();
    }
  });

  window.EasyCVCategoryData = CATEGORY_DATA;
})();
