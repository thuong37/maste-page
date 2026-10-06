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

  function updateFilterPillUI(type, value, label) {
    var btn = document.getElementById('ct' + cap(type) + 'FilterBtn');
    var labelSpan = document.getElementById('ct' + cap(type) + 'FilterLabel');
    if (!btn || !labelSpan) return;
    if (value) {
      btn.classList.add('is-active');
      labelSpan.textContent = label;
    } else {
      btn.classList.remove('is-active');
      labelSpan.textContent = FILTER_DEFAULT_LABELS[type] || 'Bo loc';
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
    ['exp', 'salary', 'level', 'type', 'saturday'].forEach(function(type) {
      updateFilterPillUI(type, '', '');
      var menu = document.getElementById('ct' + cap(type) + 'DropdownMenu');
      if (menu) {
        menu.querySelectorAll('.dropdown-item').forEach(function(i) {
          i.classList.remove('is-selected');
          var chk = i.querySelector('.check-icon');
          if (chk) chk.remove();
          if (i.getAttribute('data-value') === '') {
            i.classList.add('is-selected');
            if (!i.querySelector('.check-icon')) {
              i.insertAdjacentHTML('beforeend', '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>');
            }
          }
        });
      }
    });
    syncClearBtnVisibility();
    closeAllFilterDropdowns();
  }

  function navigateToJobList() {
    var params = new URLSearchParams();
    var keywordInput = document.getElementById('jobSearchInput');
    if (keywordInput && keywordInput.value.trim()) params.set('keyword', keywordInput.value.trim());
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
    catch(e) { setSavedFilterError('Khong the luu tren trinh duyet nay.'); }
  }

  function createSavedFilterId() {
    return 'sf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  }

  function getCurrentFilterSnapshot() {
    return sanitizeSavedFilterParams({ exp: selectedExp, salary: selectedSalary, level: selectedLevel, type: selectedType, saturday: selectedSaturday });
  }

  function getSavedFilterCriterionLabel(key, value) {
    var maps = {
      exp: { '0': 'Khong can KN', under1: 'Duoi 1 nam', '1-3': '1-3 nam', '3-5': '3-5 nam', over5: 'Tren 5 nam' },
      salary: { under10: 'Duoi 10tr', '10-15': '10-15tr', '15-25': '15-25tr', '25-50': '25-50tr', over50: 'Tren 50tr', negotiable: 'Thoa thuan' },
      level: { intern: 'Thuc tap sinh', junior: 'Nhan vien', senior: 'Truong nhom', manager: 'Quan ly' },
      type: { fulltime: 'Toan thoi gian', hybrid: 'Hybrid', remote: 'Remote', parttime: 'Ban thoi gian' },
      saturday: { work_sat: 'Lam thu 7', off_sat: 'Nghi thu 7', unmentioned: 'Khong de cap' }
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
    summary.textContent = hasCriteria ? descriptions.join(' • ') : 'Chua co tieu chi nao duoc chon.';
  }

  function renderSavedFilters() {
    var list = document.getElementById('ctSavedFilterList');
    var empty = document.getElementById('ctSavedFilterEmpty');
    var badgeCount = document.getElementById('ctSavedFilterBadgeCount');
    var libCount = document.getElementById('ctSavedFilterLibraryCount');
    if (!list) return;
    var n = savedFilters.length;
    if (badgeCount) { badgeCount.textContent = n; badgeCount.setAttribute('aria-label', n + ' bo loc da luu'); }
    if (libCount) libCount.textContent = n ? n + ' bo loc' : '';
    if (empty) empty.hidden = n > 0;
    list.innerHTML = '';
    savedFilters.forEach(function(filter) {
      var labels = describeSavedFilter(filter.params);
      var li = document.createElement('li');
      li.className = 'saved-filter-item';
      li.innerHTML =
        '<button type="button" class="saved-filter-apply-btn" data-id="' + filter.id + '" title="Ap dung bo loc: ' + filter.name + '">' +
          '<span class="saved-filter-name">' + filter.name + '</span>' +
          '<span class="saved-filter-desc">' + (labels.join(' • ') || 'Khong co tieu chi') + '</span>' +
        '</button>' +
        '<button type="button" class="saved-filter-delete-btn" data-id="' + filter.id + '" aria-label="Xoa bo loc ' + filter.name + '" title="Xoa bo loc nay">' +
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
    exp: { '0': 'Khong can KN', under1: 'Duoi 1 nam', '1-3': '1-3 nam', '3-5': '3-5 nam', over5: 'Tren 5 nam' },
    salary: { under10: 'Duoi 10 trieu', '10-15': '10 - 15 trieu', '15-25': '15 - 25 trieu', '25-50': '25 - 50 trieu', over50: 'Tren 50 trieu', negotiable: 'Thoa thuan' },
    level: { intern: 'Thuc tap sinh', junior: 'Nhan vien', senior: 'Truong nhom/Lead', manager: 'Truong phong/Manager' },
    type: { fulltime: 'Toan thoi gian', hybrid: 'Hybrid (Linh hoat)', remote: 'Remote 100%', parttime: 'Ban thoi gian' },
    saturday: { work_sat: 'Lam thu 7', off_sat: 'Nghi thu 7', unmentioned: 'Khong de cap' }
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
    showToast('Da ap dung bo loc: ' + filter.name, '📂');
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
          if (!name) { setSavedFilterError('Vui long nhap ten bo loc.'); return; }
          var snapshot = getCurrentFilterSnapshot();
          if (!Object.keys(snapshot).some(function(k) { return snapshot[k]; })) {
            setSavedFilterError('Hay chon it nhat mot tieu chi truoc khi luu.'); return;
          }
          if (savedFilters.length >= 10) {
            setSavedFilterError('Ban da luu toi da 10 bo loc.'); return;
          }
          savedFilters.unshift({ id: createSavedFilterId(), name: name, params: snapshot });
          persistSavedFilters(); renderSavedFilters(); updateSavedFilterCurrentState(); setSavedFilterError();
          if (nameInput) nameInput.value = '';
          showToast('Da luu bo loc: ' + name, '🔖');
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
            showToast('Da xoa bo loc', '🗑');
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

    bar.querySelectorAll('.filter-pill-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var wrap = btn.closest('.filter-dropdown-wrap');
        var menu = wrap ? wrap.querySelector('.filter-dropdown-menu') : null;
        if (!menu) return;
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
          var p2 = new URLSearchParams();
          if (value) p2.set('industry', value);
          showToast('Dang chuyen sang: ' + (label || 'Tat ca linh vuc'), '🔍');
          setTimeout(function() {
            window.location.href = 'viec-lam.html' + (p2.toString() ? '?' + p2.toString() : '');
          }, 600);
          return;
        }

        if (type === 'exp') selectedExp = value;
        else if (type === 'salary') selectedSalary = value;
        else if (type === 'level') selectedLevel = value;
        else if (type === 'type') selectedType = value;
        else if (type === 'saturday') selectedSaturday = value;

        var menu = item.closest('.filter-dropdown-menu');
        if (menu) {
          menu.querySelectorAll('.dropdown-item').forEach(function(i) {
            i.classList.remove('is-selected');
            var chk = i.querySelector('.check-icon');
            if (chk) chk.remove();
          });
        }
        item.classList.add('is-selected');
        item.insertAdjacentHTML('beforeend', '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>');

        updateFilterPillUI(type, value, label);
        syncClearBtnVisibility();
        updateSavedFilterCurrentState();
        closeAllFilterDropdowns();
        showToast('Da chon ' + (FILTER_DEFAULT_LABELS[type] || type) + ': ' + (value ? label : 'Tat ca'), '✓');
        setTimeout(navigateToJobList, 700);
      });
    });

    var clearBtn2 = document.getElementById('ctBtnClearTopFilters');
    if (clearBtn2) {
      clearBtn2.addEventListener('click', function() {
        resetAllTopFilters();
        showToast('Da xoa tat ca bo loc tieu chi', '✓');
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
    ['exp', 'salary', 'level', 'type', 'saturday'].forEach(function(key) {
      var val = params.get(key);
      if (val) {
        if (key === 'exp') selectedExp = val;
        if (key === 'salary') selectedSalary = val;
        if (key === 'level') selectedLevel = val;
        if (key === 'type') selectedType = val;
        if (key === 'saturday') selectedSaturday = val;
        var btn = document.getElementById('ct' + cap(key) + 'FilterBtn');
        if (btn) btn.classList.add('is-active');
      }
    });
    syncClearBtnVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();