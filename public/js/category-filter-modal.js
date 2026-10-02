/**
 * EasyCV - Category Filter Modal (Danh mục Nghề) Controller
 * Faithfully mirrors the reference job category filter while retaining
 * EasyCV's signature orange theme (#F97316) and design architecture.
 */

(function () {
  'use strict';

  // 1. Comprehensive Taxonomy Dataset matching user reference screenshot
  const CATEGORY_DATA = [
    {
      key: 'sales',
      name: 'Kinh doanh/Bán hàng',
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
      subgroups: [
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

    init: function (config = {}) {
      this.triggerBtn = document.getElementById(config.triggerId || 'categoryFilterTrigger');
      this.triggerLabel = document.getElementById(config.labelId || 'categoryFilterLabel');
      this.overlay = document.getElementById(config.overlayId || 'categoryModalOverlay');
      this.backdrop = document.getElementById(config.backdropId || 'categoryModalBackdrop');
      this.closeBtn = document.getElementById(config.closeBtnId || 'categoryModalClose');
      this.searchInput = document.getElementById(config.searchInputId || 'categoryModalSearchInput');
      this.searchClearBtn = document.getElementById(config.searchClearBtnId || 'categorySearchClear');
      this.groupListEl = document.getElementById(config.groupListId || 'categoryGroupList');
      this.subgroupListEl = document.getElementById(config.subgroupListId || 'categorySubgroupList');
      this.scrollHintEl = document.getElementById(config.scrollHintId || 'categoryScrollHint');
      this.clearAllBtn = document.getElementById(config.clearAllBtnId || 'btnCategoryClearAll');
      this.cancelBtn = document.getElementById(config.cancelBtnId || 'btnCategoryCancel');
      this.submitBtn = document.getElementById(config.submitBtnId || 'btnCategorySubmit');
      this.onApplyCallback = config.onApply || null;

      if (!this.overlay) {
        // Modal markup not yet in DOM, skip or auto-inject if needed
        return;
      }

      this.bindEvents();
      this.renderGroups();
      this.renderSubgroups();
    },

    bindEvents: function () {
      const self = this;

      if (this.triggerBtn) {
        this.triggerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          self.open();
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

      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => {
          const val = self.searchInput.value.trim();
          if (self.searchClearBtn) {
            self.searchClearBtn.hidden = !val;
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
          self.close(false);
        }
      });
    },

    open: function () {
      this.isOpen = true;
      // Copy applied to temp
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
      }

      document.body.style.overflow = 'hidden';

      if (this.searchInput) {
        this.searchInput.value = '';
        if (this.searchClearBtn) this.searchClearBtn.hidden = true;
        setTimeout(() => this.searchInput.focus(), 100);
      }

      this.renderGroups();
      this.renderSubgroups();
    },

    close: function (isApplied = false) {
      this.isOpen = false;
      if (!isApplied) {
        // Discard temp
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
      }

      document.body.style.overflow = '';
    },

    clearAll: function () {
      this.tempSelection.groups.clear();
      this.tempSelection.subgroups.clear();
      this.tempSelection.roles.clear();
      this.renderGroups();
      this.renderSubgroups();
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

    updateTriggerUI: function () {
      if (!this.triggerLabel) return;

      const totalItems = this.appliedSelection.roles.size + this.appliedSelection.groups.size;
      if (totalItems === 0) {
        this.triggerLabel.textContent = 'Danh mục Nghề';
        if (this.triggerBtn) this.triggerBtn.classList.remove('is-active');
        return;
      }

      if (this.triggerBtn) this.triggerBtn.classList.add('is-active');

      if (this.appliedSelection.roles.size === 1) {
        const role = Array.from(this.appliedSelection.roles)[0];
        this.triggerLabel.textContent = role.length > 18 ? `${role.slice(0, 16)}…` : role;
      } else if (this.appliedSelection.groups.size === 1 && this.appliedSelection.roles.size === 0) {
        const groupKey = Array.from(this.appliedSelection.groups)[0];
        const group = CATEGORY_DATA.find(g => g.key === groupKey);
        const name = group ? group.name : 'Danh mục Nghề';
        this.triggerLabel.textContent = name.length > 18 ? `${name.slice(0, 16)}…` : name;
      } else {
        const first = this.appliedSelection.roles.size > 0
          ? Array.from(this.appliedSelection.roles)[0]
          : CATEGORY_DATA.find(g => g.key === Array.from(this.appliedSelection.groups)[0])?.name || 'Nghề';
        const prefix = first.length > 12 ? `${first.slice(0, 10)}…` : first;
        this.triggerLabel.textContent = `${prefix} (${totalItems})`;
      }
    },

    handleSearch: function (query) {
      const norm = normalizeStr(query);
      if (!norm) {
        this.renderGroups();
        this.renderSubgroups();
        return;
      }

      // Filter across all categories, subgroups, and roles
      let matchingSubgroups = [];
      CATEGORY_DATA.forEach(group => {
        group.subgroups.forEach(sub => {
          const matchSubTitle = normalizeStr(sub.title).includes(norm);
          const matchingRoles = sub.roles.filter(r => normalizeStr(r).includes(norm));
          if (matchSubTitle || matchingRoles.length > 0 || normalizeStr(group.name).includes(norm)) {
            matchingSubgroups.push({
              groupName: group.name,
              groupKey: group.key,
              title: sub.title,
              roles: matchSubTitle ? sub.roles : (matchingRoles.length > 0 ? matchingRoles : sub.roles)
            });
          }
        });
      });

      this.renderSearchResults(matchingSubgroups, query);
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

        // Click row: set active category
        item.addEventListener('click', (e) => {
          if (e.target.closest('.cat-checkbox')) {
            // Checkbox click
            e.stopPropagation();
            self.toggleCategory(cat.key);
            return;
          }
          self.activeCategoryKey = cat.key;
          self.renderGroups();
          self.renderSubgroups();
        });

        self.groupListEl.appendChild(item);
      });
    },

    renderSubgroups: function () {
      if (!this.subgroupListEl) return;
      const self = this;
      this.subgroupListEl.innerHTML = '';

      const currentCategory = CATEGORY_DATA.find(c => c.key === self.activeCategoryKey) || CATEGORY_DATA[0];
      if (!currentCategory) return;

      currentCategory.subgroups.forEach(sub => {
        const row = document.createElement('div');
        row.className = 'category-subgroup-row';

        const isSubChecked = self.tempSelection.subgroups.has(sub.title);

        // Build Specialty Pills
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

        // Checkbox/Title click for Subgroup
        const titleWrap = row.querySelector('.category-role-title-wrap');
        titleWrap.addEventListener('click', () => {
          self.toggleSubgroup(sub.title, sub.roles);
        });

        // Pill clicks
        row.querySelectorAll('.category-specialty-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            const role = pill.getAttribute('data-role');
            self.toggleRole(role, sub.title);
          });
        });

        self.subgroupListEl.appendChild(row);
      });

      // Reset scroll position and show hint if overflow
      this.subgroupListEl.scrollTop = 0;
      if (this.scrollHintEl) {
        setTimeout(() => {
          const hasScroll = self.subgroupListEl.scrollHeight > self.subgroupListEl.clientHeight + 40;
          self.scrollHintEl.classList.toggle('is-hidden', !hasScroll);
        }, 50);
      }
    },

    renderSearchResults: function (results, query) {
      if (!this.subgroupListEl) return;
      const self = this;
      this.subgroupListEl.innerHTML = '';

      if (results.length === 0) {
        this.subgroupListEl.innerHTML = `
          <div class="category-search-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <div style="font-weight: 600; color: #334155; margin-top: 10px;">Không tìm thấy danh mục phù hợp với "${query}"</div>
            <p>Vui lòng thử lại với từ khóa khác như "Sales", "Marketing", "React"...</p>
          </div>
        `;
        if (this.scrollHintEl) this.scrollHintEl.classList.add('is-hidden');
        return;
      }

      results.forEach(sub => {
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
            <div>
              <span class="category-role-title">${sub.title}</span>
              <div style="font-size: 11px; color: #94A3B8; font-weight: 500; margin-top: 2px;">${sub.groupName}</div>
            </div>
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

        self.subgroupListEl.appendChild(row);
      });
    },

    toggleCategory: function (catKey) {
      const isCurrentlyChecked = this.tempSelection.groups.has(catKey);
      const cat = CATEGORY_DATA.find(c => c.key === catKey);

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
      }

      this.renderGroups();
      this.renderSubgroups();
    },

    toggleSubgroup: function (title, roles = []) {
      const isCurrentlyChecked = this.tempSelection.subgroups.has(title);

      if (isCurrentlyChecked) {
        this.tempSelection.subgroups.delete(title);
        roles.forEach(r => this.tempSelection.roles.delete(r));
      } else {
        this.tempSelection.subgroups.add(title);
        // Optional: also check all child roles or leave as subgroup level
      }

      this.renderGroups();
      this.renderSubgroups();
    },

    toggleRole: function (role, subTitle) {
      if (this.tempSelection.roles.has(role)) {
        this.tempSelection.roles.delete(role);
      } else {
        this.tempSelection.roles.add(role);
        // Also ensure subgroup or group is aware if needed
      }

      this.renderGroups();
      this.renderSubgroups();
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

})();
