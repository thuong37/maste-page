/**
 * chi-tiet-filter.js — Bo loc tieu chi viec lam cho trang Chi tiet viec lam
 * Dong bo hoan toan tu viec-lam.js (initTopFilterBar + savedFilters)
 * Khi ap dung bo loc: redirect sang viec-lam.html voi query params
 * v1.0_synced_from_job_list
 */
(function () {
  'use strict';

  // STATE
  let selectedExp = '';
  let selectedSalary = '';
  let selectedLevel = '';
  let selectedType = '';
  let selectedSaturday = '';

  const FILTER_DEFAULT_LABELS = {
    exp: 'Kinh nghiệm',
    salary: 'Mức lương',
    level: 'Cấp bậc',
    type: 'Hình thức',
    saturday: 'Nghỉ thứ 7'
  };

  const SAVED_FILTER_STORAGE_KEY = 'easycv_saved_filters_v2';
  let savedFilters = [];
  let savedFilterReturnFocus = null;

  // HELPERS
  function showToast(message, icon) {
    icon = icon || '✓';
    let toast = document.getElementById('chiTietFilterToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'chiTietFilterToast';
      toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(16px);background:rgba(15,23,42,0.93);color:#fff;padding:10px 20px;border-radius:100px;font-size:13.5px;font-weight:500;display:flex;align-items:center;gap:8px;box-shadow:0 4px 24px rgba(0,0,0,0.18);transition:opacity 0.25s,transform 0.25s;opacity:0;pointer-events:none;z-index:9999';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span style="color:#F97316">' + icon + '</span> ' + message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(16px)';
    }, 2800);
  }

  function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function closeAllFilterDropdowns() {
    document.querySelectorAll('#chiTietTopFilterBar .filter-dropdown-menu').forEach(function(menu) {
      menu.hidden = true;
    });
    document.querySelectorAll('#chiTietTopFilterBar .filter-pill-btn').forEach(function(btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('#chiTietTopFilterBar .filter-dropdown-wrap').forEach(function(wrap) {
      wrap.classList.remove('is-open');
    });
    var industryInput = document.getElementById('ctIndustrySearchInput');
    if (industryInput && industryInput.value) {
      industryInput.value = '';
      var list = document.getElementById('ctIndustryDropdownList');
      if (list) list.querySelectorAll('.dropdown-item').forEach(function(i) { i.hidden = false; });
      var noRes = document.getElementById('ctIndustryNoResults');
      if (noRes) noRes.hidden = true;
      var clearBtn = document.getElementById('ctIndustrySearchClear');
      if (clearBtn) clearBtn.hidden = true;
    }
  }

  // CHỌN NHIỀU (đồng bộ viec-lam.js): giá trị nối dấu phẩy "intern,junior"; OR trong 1 tiêu chí, AND giữa các tiêu chí
  var MULTI_FILTER_TYPES = ['exp', 'salary', 'level', 'type', 'saturday'];
  var CHECK_ICON_SVG = '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';

  function parseMultiValue(value) {
    var seen = {};
    return String(value || '').split(',').map(function(p) { return p.trim(); }).filter(function(p) {
      if (!p || seen[p]) return false;
      seen[p] = true;
      return true;
    });
  }

  function getFilterValue(type) {
    if (type === 'exp') return selectedExp;
    if (type === 'salary') return selectedSalary;
    if (type === 'level') return selectedLevel;
    if (type === 'type') return selectedType;
    if (type === 'saturday') return selectedSaturday;
    return '';
  }

  function setFilterValue(type, value) {
    var joined = parseMultiValue(value).join(',');
    if (type === 'exp') selectedExp = joined;
    else if (type === 'salary') selectedSalary = joined;
    else if (type === 'level') selectedLevel = joined;
    else if (type === 'type') selectedType = joined;
    else if (type === 'saturday') selectedSaturday = joined;
  }

  function getFilterOptionLabel(type, value) {
    var menu = document.getElementById('ct' + cap(type) + 'DropdownMenu');
    var option = null;
    if (menu) {
      menu.querySelectorAll('.dropdown-item').forEach(function(i) {
        if ((i.getAttribute('data-value') || '') === value) option = i;
      });
    }
    if (!option) return value;
    return option.getAttribute('data-label') || (option.querySelector('span') ? option.querySelector('span').textContent.trim() : value);
  }

  // Không chọn gì → tích "Tất cả …"; có chọn → tích từng mục đã chọn
  function syncFilterDropdownSelection(type) {
    var values = parseMultiValue(getFilterValue(type));
    var menu = document.getElementById('ct' + cap(type) + 'DropdownMenu');
    if (!menu) return;
    menu.querySelectorAll('.dropdown-item').forEach(function(i) {
      var itemValue = i.getAttribute('data-value') || '';
      var isSelected = itemValue ? values.indexOf(itemValue) !== -1 : values.length === 0;
      i.classList.toggle('is-selected', isSelected);
      i.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      var chk = i.querySelector('.check-icon');
      if (isSelected && !chk) i.insertAdjacentHTML('beforeend', CHECK_ICON_SVG);
      else if (!isSelected && chk) chk.remove();
    });
  }

  // Báo cho chi-tiet-viec-lam.js lọc lại danh sách bên trái ngay trên trang (không chuyển trang)
  function notifyDetailFiltersChanged() {
    document.dispatchEvent(new CustomEvent('easycv:detail-filters-change', {
      detail: { exp: selectedExp, salary: selectedSalary, level: selectedLevel, type: selectedType, saturday: selectedSaturday }
    }));
  }

  // Nhãn pill: 0 lựa chọn → tên tiêu chí; 1 → tên lựa chọn; ≥2 → "Cấp bậc (2)"
  function updateFilterPillUI(type, value, label) {
    var btn = document.getElementById('ct' + cap(type) + 'FilterBtn');
    var labelSpan = document.getElementById('ct' + cap(type) + 'FilterLabel');
    if (!btn || !labelSpan) return;
    var defaultLabel = FILTER_DEFAULT_LABELS[type] || 'Bộ lọc';
    var values = MULTI_FILTER_TYPES.indexOf(type) !== -1 ? parseMultiValue(value) : (value ? [value] : []);
    if (values.length === 0) {
      btn.classList.remove('is-active');
      labelSpan.textContent = defaultLabel;
      btn.removeAttribute('title');
    } else if (values.length === 1) {
      btn.classList.add('is-active');
      labelSpan.textContent = MULTI_FILTER_TYPES.indexOf(type) !== -1 ? getFilterOptionLabel(type, values[0]) : label;
      btn.title = defaultLabel + ': ' + labelSpan.textContent;
    } else {
      btn.classList.add('is-active');
      labelSpan.textContent = defaultLabel + ' (' + values.length + ')';
      btn.title = defaultLabel + ': ' + values.map(function(v) { return getFilterOptionLabel(type, v); }).join(', ');
    }
  }

  function hasActiveFilters() {
    return !!(selectedExp || selectedSalary || selectedLevel || selectedType || selectedSaturday);
  }

  function syncClearBtnVisibility() {
    var clearBtn = document.getElementById('ctBtnClearTopFilters');
    if (clearBtn) {
      clearBtn.style.display = hasActiveFilters() ? '' : 'none';
    }
  }

  function resetAllTopFilters() {
    selectedExp = ''; selectedSalary = ''; selectedLevel = ''; selectedType = ''; selectedSaturday = '';
    MULTI_FILTER_TYPES.forEach(function(type) {
      updateFilterPillUI(type, '', '');
      syncFilterDropdownSelection(type);
    });
    syncClearBtnVisibility();
    closeAllFilterDropdowns();
    notifyDetailFiltersChanged();
  }

  // Giữ nguyên trạng thái tìm kiếm khác (địa điểm, danh mục, lĩnh vực, sắp xếp) mà trang Việc làm đã truyền sang
  function getCarriedSearchParams() {
    var current = new URLSearchParams(window.location.search);
    var params = new URLSearchParams();
    var keywordInput = document.getElementById('jobSearchInput');
    var keyword = keywordInput ? keywordInput.value.trim() : (current.get('keyword') || '');
    if (keyword) params.set('keyword', keyword);
    ['location', 'category', 'industry', 'sort'].forEach(function(key) {
      if (current.get(key)) params.set(key, current.get(key));
    });
    return params;
  }

  function navigateToJobList() {
    var params = getCarriedSearchParams();
    if (selectedExp) params.set('exp', selectedExp);
    if (selectedSalary) params.set('salary', selectedSalary);
    if (selectedLevel) params.set('level', selectedLevel);
    if (selectedType) params.set('type', selectedType);
    if (selectedSaturday) params.set('saturday', selectedSaturday);
    window.location.href = 'viec-lam.html' + (params.toString() ? '?' + params.toString() : '');
  }

  // SAVED FILTERS
  function sanitizeSavedFilterParams(candidate) {
    if (!candidate || typeof candidate !== 'object') return {};
    var allowed = ['exp', 'salary', 'level', 'type', 'saturday'];
    var result = {};
    allowed.forEach(function(k) {
      if (candidate[k] && typeof candidate[k] === 'string') result[k] = candidate[k].slice(0, 64);
    });
    return result;
  }

  function normalizeSavedFilterStore(rawValue) {
    try {
      var parsed = JSON.parse(rawValue);
      if (!parsed || typeof parsed !== 'object') return [];
      var arr = Array.isArray(parsed.filters) ? parsed.filters : [];
      return arr.filter(function(r) { return r && r.id && r.name && r.params; }).map(function(r) {
        return { id: String(r.id).slice(0, 64), name: String(r.name).slice(0, 60), params: sanitizeSavedFilterParams(r.params) };
      });
    } catch(e) { return []; }
  }

  function readSavedFilters() {
    try { return normalizeSavedFilterStore(localStorage.getItem(SAVED_FILTER_STORAGE_KEY)); }
    catch(e) { return []; }
  }

  function persistSavedFilters() {
    try { localStorage.setItem(SAVED_FILTER_STORAGE_KEY, JSON.stringify({ filters: savedFilters })); }
    catch(e) { setSavedFilterError('Không thể lưu trên trình duyệt này. Vui lòng kiểm tra quyền lưu trữ.'); }
  }

  function createSavedFilterId() {
    return 'sf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  }

  function getCurrentFilterSnapshot() {
    return sanitizeSavedFilterParams({ exp: selectedExp, salary: selectedSalary, level: selectedLevel, type: selectedType, saturday: selectedSaturday });
  }

  function getSavedFilterCriterionLabel(key, value) {
    var maps = {
      exp: { '0': 'Không cần KN', under1: 'Dưới 1 năm', '1-3': '1-3 năm', '3-5': '3-5 năm', over5: 'Trên 5 năm' },
      salary: { under10: 'Dưới 10tr', '10-15': '10-15tr', '15-25': '15-25tr', '25-50': '25-50tr', over50: 'Trên 50tr', negotiable: 'Thỏa thuận' },
      level: { intern: 'Thực tập sinh', junior: 'Nhân viên', senior: 'Trưởng nhóm', manager: 'Quản lý' },
      type: { fulltime: 'Toàn thời gian', hybrid: 'Hybrid', remote: 'Remote', parttime: 'Bán thời gian' },
      saturday: { work_sat: 'Làm thứ 7', off_sat: 'Nghỉ thứ 7', unmentioned: 'Không đề cập' }
    };
    var label = (maps[key] && maps[key][value]) ? maps[key][value] : value;
    return (FILTER_DEFAULT_LABELS[key] || key) + ': ' + label;
  }

  function describeSavedFilter(params) {
    return Object.keys(params).filter(function(k) { return params[k]; }).map(function(k) { return getSavedFilterCriterionLabel(k, params[k]); });
  }

  function setSavedFilterError(message) {
    message = message || '';
    var err = document.getElementById('ctSavedFilterNameError');
    var inp = document.getElementById('ctSavedFilterName');
    if (!inp || !err) return;
    err.textContent = message;
    err.hidden = !message;
    inp.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function updateSavedFilterCurrentState() {
    var submitBtn = document.getElementById('ctSavedFilterSubmit');
    var summary = document.getElementById('ctSavedFilterCurrentSummary');
    if (!submitBtn || !summary) return;
    var snapshot = getCurrentFilterSnapshot();
    var hasCriteria = Object.keys(snapshot).some(function(k) { return snapshot[k]; });
    var descriptions = describeSavedFilter(snapshot);
    submitBtn.disabled = !hasCriteria;
    submitBtn.title = hasCriteria ? '' : 'Hay chon it nhat mot tieu chi truoc khi luu';
    summary.textContent = hasCriteria ? descriptions.join(' • ') : 'Chưa có tiêu chí nào. Hãy chọn ít nhất một bộ lọc trước khi lưu.';
  }

  function renderSavedFilters() {
    var list = document.getElementById('ctSavedFilterList');
    var empty = document.getElementById('ctSavedFilterEmpty');
    var badgeCount = document.getElementById('ctSavedFilterBadgeCount');
    var libCount = document.getElementById('ctSavedFilterLibraryCount');
    if (!list) return;
    var n = savedFilters.length;
    if (badgeCount) { badgeCount.textContent = n; badgeCount.setAttribute('aria-label', n + ' bộ lọc đã lưu'); }
    if (libCount) libCount.textContent = n ? n + ' bộ lọc' : '';
    if (empty) empty.hidden = n > 0;
    list.innerHTML = '';
    savedFilters.forEach(function(filter) {
      var labels = describeSavedFilter(filter.params);
      var li = document.createElement('li');
      li.className = 'saved-filter-item';
      li.innerHTML =
        '<button type="button" class="saved-filter-apply-btn" data-id="' + filter.id + '" title="Áp dụng bộ lọc: ' + filter.name + '">' +
          '<span class="saved-filter-name">' + filter.name + '</span>' +
          '<span class="saved-filter-desc">' + (labels.join(' • ') || 'Không có tiêu chí') + '</span>' +
        '</button>' +
        '<button type="button" class="saved-filter-delete-btn" data-id="' + filter.id + '" aria-label="Xóa bộ lọc ' + filter.name + '" title="Xóa bộ lọc này">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>';
      list.appendChild(li);
    });
  }

  function openSavedFiltersDialog() {
    var dialog = document.getElementById('ctSavedFiltersDialog');
    if (!dialog) return;
    savedFilterReturnFocus = document.activeElement;
    updateSavedFilterCurrentState();
    renderSavedFilters();
    setSavedFilterError();
    var inp = document.getElementById('ctSavedFilterName');
    if (inp) inp.value = '';
    dialog.hidden = false;
    document.body.classList.add('saved-filter-dialog-open');
    var trigger = document.getElementById('ctSavedFiltersTrigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    var panel = dialog.querySelector('.saved-filters-panel');
    requestAnimationFrame(function() { if (panel) panel.focus(); });
  }

  function closeSavedFiltersDialog() {
    var dialog = document.getElementById('ctSavedFiltersDialog');
    if (!dialog) return;
    dialog.hidden = true;
    document.body.classList.remove('saved-filter-dialog-open');
    var trigger = document.getElementById('ctSavedFiltersTrigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (savedFilterReturnFocus) {
      try { savedFilterReturnFocus.focus(); } catch(e) {}
      savedFilterReturnFocus = null;
    }
  }

  var LABEL_MAPS = {
    exp: { '0': 'Không cần KN', under1: 'Dưới 1 năm', '1-3': '1-3 năm', '3-5': '3-5 năm', over5: 'Trên 5 năm' },
    salary: { under10: 'Dưới 10 triệu', '10-15': '10 - 15 triệu', '15-25': '15 - 25 triệu', '25-50': '25 - 50 triệu', over50: 'Trên 50 triệu', negotiable: 'Thỏa thuận' },
    level: { intern: 'Thực tập sinh', junior: 'Nhân viên', senior: 'Trưởng nhóm/Lead', manager: 'Trưởng phòng/Manager' },
    type: { fulltime: 'Toàn thời gian', hybrid: 'Hybrid (Linh hoạt)', remote: 'Remote 100%', parttime: 'Bán thời gian' },
    saturday: { work_sat: 'Làm thứ 7', off_sat: 'Nghỉ thứ 7', unmentioned: 'Không đề cập' }
  };

  function applySavedFilter(filterId) {
    var filter = savedFilters.find(function(f) { return f.id === filterId; });
    if (!filter) return;
    var p = filter.params;
    selectedExp = p.exp || ''; selectedSalary = p.salary || ''; selectedLevel = p.level || '';
    selectedType = p.type || ''; selectedSaturday = p.saturday || '';
    ['exp', 'salary', 'level', 'type', 'saturday'].forEach(function(t) {
      var val = p[t] || '';
      var label = val ? ((LABEL_MAPS[t] && LABEL_MAPS[t][val]) ? LABEL_MAPS[t][val] : val) : '';
      updateFilterPillUI(t, val, label);
    });
    syncClearBtnVisibility();
    closeSavedFiltersDialog();
    showToast('Đã áp dụng bộ lọc: ' + filter.name, '📂');
    setTimeout(navigateToJobList, 600);
  }

  function initSavedFiltersPanel() {
    savedFilters = readSavedFilters();
    var trigger = document.getElementById('ctSavedFiltersTrigger');
    if (trigger) trigger.addEventListener('click', openSavedFiltersDialog);
    var closeBtn = document.getElementById('ctSavedFiltersClose');
    if (closeBtn) closeBtn.addEventListener('click', closeSavedFiltersDialog);
    var dialog = document.getElementById('ctSavedFiltersDialog');
    if (dialog) {
      var backdrop = dialog.querySelector('.saved-filters-backdrop');
      if (backdrop) backdrop.addEventListener('click', closeSavedFiltersDialog);
      var form = document.getElementById('ctSavedFilterForm');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var nameInput = document.getElementById('ctSavedFilterName');
          var name = nameInput ? nameInput.value.trim() : '';
          if (!name) { setSavedFilterError('Vui lòng nhập tên bộ lọc.'); return; }
          var snapshot = getCurrentFilterSnapshot();
          if (!Object.keys(snapshot).some(function(k) { return snapshot[k]; })) {
            setSavedFilterError('Hay chon it nhat mot tieu chi truoc khi luu.'); return;
          }
          if (savedFilters.length >= 10) {
            setSavedFilterError('Bạn đã lưu tối đa 10 bộ lọc.'); return;
          }
          savedFilters.unshift({ id: createSavedFilterId(), name: name, params: snapshot });
          persistSavedFilters(); renderSavedFilters(); updateSavedFilterCurrentState(); setSavedFilterError();
          if (nameInput) nameInput.value = '';
          showToast('Đã lưu bộ lọc: ' + name, '🔖');
        });
      }
      var savedList = document.getElementById('ctSavedFilterList');
      if (savedList) {
        savedList.addEventListener('click', function(e) {
          var applyBtn = e.target.closest('.saved-filter-apply-btn');
          var deleteBtn = e.target.closest('.saved-filter-delete-btn');
          if (applyBtn) applySavedFilter(applyBtn.getAttribute('data-id'));
          if (deleteBtn) {
            var id = deleteBtn.getAttribute('data-id');
            savedFilters = savedFilters.filter(function(f) { return f.id !== id; });
            persistSavedFilters(); renderSavedFilters(); updateSavedFilterCurrentState();
            showToast('Đã xóa bộ lọc', '🗑');
          }
        });
      }
      dialog.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { e.stopPropagation(); closeSavedFiltersDialog(); }
      });
    }
  }

  function initTopFilterBar() {
    var bar = document.getElementById('chiTietTopFilterBar');
    if (!bar) return;

    // Desktop: rê chuột vào nút lọc là mở menu để chọn luôn; rời khỏi (nút + menu) 200ms thì đóng (đồng bộ viec-lam.js)
    var canHoverOpen = function() { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; };
    bar.querySelectorAll('.filter-dropdown-wrap').forEach(function(wrap) {
      var pillBtn = wrap.querySelector('.filter-pill-btn');
      var pillMenu = wrap.querySelector('.filter-dropdown-menu');
      if (!pillBtn || !pillMenu) return;
      var closeTimer = null;
      wrap.addEventListener('mouseenter', function() {
        if (!canHoverOpen()) return;
        clearTimeout(closeTimer);
        if (!pillMenu.hidden) return;
        closeAllFilterDropdowns();
        pillMenu.hidden = false;
        pillBtn.setAttribute('aria-expanded', 'true');
        wrap.classList.add('is-open');
        wrap.dataset.hoverOpenedAt = String(Date.now());
      });
      wrap.addEventListener('mouseleave', function() {
        if (!canHoverOpen() || pillMenu.hidden) return;
        // Đang gõ tìm lĩnh vực thì không tự đóng
        if (wrap.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return;
        closeTimer = setTimeout(function() {
          if (!pillMenu.hidden) closeAllFilterDropdowns();
        }, 200);
      });
    });

    bar.querySelectorAll('.filter-pill-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var wrap = btn.closest('.filter-dropdown-wrap');
        var menu = wrap ? wrap.querySelector('.filter-dropdown-menu') : null;
        if (!menu) return;
        // Vừa mở bằng hover thì cú click ngay sau đó không đóng menu lại
        if (!menu.hidden && Date.now() - Number(wrap.dataset.hoverOpenedAt || 0) < 600) {
          if (menu.id === 'ctIndustryDropdownMenu') {
            var ctInput = document.getElementById('ctIndustrySearchInput');
            if (ctInput) ctInput.focus();
          }
          return;
        }
        var isOpen = !menu.hidden;
        closeAllFilterDropdowns();
        if (!isOpen) {
          menu.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
          wrap.classList.add('is-open');
          if (menu.id === 'ctIndustryDropdownMenu') {
            requestAnimationFrame(function() {
              var inp = document.getElementById('ctIndustrySearchInput');
              if (inp) inp.focus();
            });
          }
        }
      });
    });

    // Industry search
    (function() {
      var searchInput = document.getElementById('ctIndustrySearchInput');
      var clearBtn = document.getElementById('ctIndustrySearchClear');
      var list = document.getElementById('ctIndustryDropdownList');
      var noResults = document.getElementById('ctIndustryNoResults');
      if (!searchInput || !list) return;
      function filterItems(q) {
        var query = q.trim().toLowerCase();
        var items = list.querySelectorAll('.dropdown-item');
        var visible = 0;
        items.forEach(function(item) {
          var lbl = (item.getAttribute('data-label') || (item.querySelector('span') ? item.querySelector('span').textContent : '') || '').toLowerCase();
          var match = !query || lbl.includes(query);
          item.hidden = !match;
          if (match) visible++;
        });
        if (noResults) noResults.hidden = visible > 0;
        if (clearBtn) clearBtn.hidden = !query;
      }
      searchInput.addEventListener('input', function() { filterItems(searchInput.value); });
      searchInput.addEventListener('keydown', function(e) { e.stopPropagation(); });
      if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
          e.stopPropagation(); searchInput.value = ''; filterItems(''); searchInput.focus();
        });
      }
    })();

    bar.querySelectorAll('.filter-dropdown-menu .dropdown-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        var type = item.getAttribute('data-type');
        var value = item.getAttribute('data-value') || '';
        var label = item.getAttribute('data-label') || (item.querySelector('span') ? item.querySelector('span').textContent.trim() : '') || '';

        if (type === 'industry') {
          closeAllFilterDropdowns();
          var p2 = getCarriedSearchParams();
          if (value) p2.set('industry', value);
          else p2.delete('industry');
          ['exp', 'salary', 'level', 'type', 'saturday'].forEach(function(key) {
            var v = key === 'exp' ? selectedExp : key === 'salary' ? selectedSalary : key === 'level' ? selectedLevel : key === 'type' ? selectedType : selectedSaturday;
            if (v) p2.set(key, v);
          });
          showToast('Đang chuyển sang: ' + (label || 'Tất cả lĩnh vực'), '🔍');
          setTimeout(function() {
            window.location.href = 'viec-lam.html' + (p2.toString() ? '?' + p2.toString() : '');
          }, 600);
          return;
        }

        if (MULTI_FILTER_TYPES.indexOf(type) === -1) return;

        // Bấm để bật/tắt từng lựa chọn, menu giữ mở để chọn tiếp; "Tất cả …" bỏ hết lựa chọn
        var current = parseMultiValue(getFilterValue(type));
        var next = !value ? [] : (current.indexOf(value) !== -1
          ? current.filter(function(v) { return v !== value; })
          : current.concat([value]));
        setFilterValue(type, next.join(','));
        syncFilterDropdownSelection(type);
        updateFilterPillUI(type, getFilterValue(type), label);
        syncClearBtnVisibility();
        updateSavedFilterCurrentState();
        notifyDetailFiltersChanged();
        var summary = next.length ? next.map(function(v) { return getFilterOptionLabel(type, v); }).join(', ') : 'Tất cả';
        showToast('Đã lọc theo ' + (FILTER_DEFAULT_LABELS[type] || type) + ': ' + summary, '✓');
      });
    });

    var clearBtn2 = document.getElementById('ctBtnClearTopFilters');
    if (clearBtn2) {
      clearBtn2.addEventListener('click', function() {
        resetAllTopFilters();
        showToast('Đã xóa tất cả bộ lọc tiêu chí', '✓');
      });
    }

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#chiTietTopFilterBar .filter-dropdown-wrap')) {
        closeAllFilterDropdowns();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeAllFilterDropdowns();
    });
  }

  function init() {
    initTopFilterBar();
    initSavedFiltersPanel();
    var params = new URLSearchParams(window.location.search);
    MULTI_FILTER_TYPES.forEach(function(key) {
      // Hỗ trợ ?level=intern,junior hoặc lặp tham số ?level=intern&level=junior
      setFilterValue(key, params.getAll(key).join(','));
      // Hiển thị đúng nhãn + dấu tích của lựa chọn hiện tại (giống syncStateFromUrl() của viec-lam.js)
      syncFilterDropdownSelection(key);
      updateFilterPillUI(key, getFilterValue(key), '');
    });
    syncClearBtnVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();