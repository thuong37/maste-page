(() => {
  const trigger = document.getElementById('heroLocationTrigger') || document.getElementById('jobLocationTrigger');
  const picker = document.getElementById('heroLocationPicker') || document.getElementById('jobLocationPicker');
  const select = document.getElementById('heroLocationSelect') || document.getElementById('jobLocationSelect');
  if (!trigger || !picker || !select) return;

  const places = [
    {
      name: 'Hà Nội',
      old: [
        'Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy',
        'Thanh Xuân', 'Hà Đông', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm',
        'Tây Hồ', 'Hoàng Mai', 'Gia Lâm', 'Đông Anh', 'Hoài Đức',
        'Thanh Trì', 'Sóc Sơn', 'Mê Linh', 'Thường Tín', 'Đan Phượng'
      ],
      new: [
        'Phường Tràng Tiền', 'Phường Hàng Bạc', 'Phường Kim Mã', 'Phường Dịch Vọng',
        'Phường Nghĩa Đô', 'Phường Nhân Chính', 'Phường Văn Quán', 'Phường Mộ Lao',
        'Phường Mỹ Đình 1', 'Phường Mỹ Đình 2', 'Phường Bồ Đề', 'Phường Yên Hòa'
      ]
    },
    {
      name: 'Hồ Chí Minh',
      old: [
        'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6',
        'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
        'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú',
        'Bình Tân', 'Thủ Đức', 'Bình Chánh', 'Củ Chi', 'Hóc Môn',
        'Nhà Bè', 'Cần Giờ'
      ],
      new: [
        'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Tân Định', 'Phường Đa Kao',
        'Phường Thảo Điền', 'Phường An Phú', 'Phường Thủ Thiêm', 'Phường 1 (Tân Bình)',
        'Phường 2 (Tân Bình)', 'Phường Hiệp Phú', 'Phường Linh Trung', 'Phường Tân Phong (Q7)'
      ]
    },
    {
      name: 'Bình Dương',
      old: [
        'Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Bến Cát', 'Tân Uyên',
        'Bàu Bàng', 'Bắc Tân Uyên', 'Phú Giáo', 'Dầu Tiếng'
      ],
      new: [
        'Phường Phú Hòa', 'Phường Hiệp Thành', 'Phường Dĩ An', 'Phường An Phú',
        'Phường Lái Thiêu', 'Phường Thuận Giao', 'Phường Mỹ Phước', 'Phường Uyên Hưng'
      ]
    },
    {
      name: 'Đà Nẵng',
      old: [
        'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'
      ],
      new: [
        'Phường Hải Châu 1', 'Phường Hải Châu 2', 'Phường Thạch Thang',
        'Phường An Hải Bắc', 'Phường Mỹ An', 'Phường Hòa Khánh Bắc', 'Phường Khuê Trung'
      ]
    },
    {
      name: 'Bắc Ninh',
      old: [
        'TP. Bắc Ninh', 'Từ Sơn', 'Quế Võ', 'Yên Phong', 'Thuận Thành', 'Tiên Du', 'Gia Bình', 'Lương Tài'
      ],
      new: [
        'Phường Tiền An', 'Phường Suối Hoa', 'Phường Đồng Nguyên', 'Phường Phố Mới', 'Phường Hồ', 'Phường Kinh Bắc'
      ]
    },
    {
      name: 'Đồng Nai',
      old: [
        'Biên Hòa', 'Long Thành', 'Nhơn Trạch', 'Trảng Bom', 'Vĩnh Cửu', 'Định Quán', 'Xuân Lộc', 'Long Khánh'
      ],
      new: [
        'Phường Quyết Thắng', 'Phường Tam Hiệp', 'Phường Long Bình', 'Thị trấn Long Thành', 'Thị trấn Hiệp Phước'
      ]
    },
    {
      name: 'Hải Phòng',
      old: [
        'Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn', 'Thủy Nguyên', 'An Dương'
      ],
      new: [
        'Phường Minh Khai', 'Phường Máy Tơ', 'Phường Cầu Đất', 'Phường Đằng Giang', 'Phường Quán Toan'
      ]
    },
    {
      name: 'Cần Thơ',
      old: [
        'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt', 'Phong Điền', 'Thới Lai'
      ],
      new: [
        'Phường An Khánh', 'Phường Tân An', 'Phường Trà Nóc', 'Phường Lê Bình', 'Phường Hưng Lợi'
      ]
    },
    {
      name: 'Hưng Yên',
      old: [
        'TP. Hưng Yên', 'Văn Lâm', 'Mỹ Hào', 'Văn Giang', 'Yên Mỹ', 'Khoái Châu'
      ],
      new: [
        'Phường Hiến Nam', 'Phường Lê Lợi', 'Thị trấn Như Quỳnh', 'Phường Bần Yên Nhân'
      ]
    }
  ];
  const provinceList = document.getElementById('locationProvinceList');
  const districtList = document.getElementById('locationDistrictList');
  const provinceSearch = document.getElementById('locationProvinceSearch');
  const districtSearch = document.getElementById('locationDistrictSearch');
  let mode = 'old';
  let active = 'Hồ Chí Minh';
  let selected = new Map();
  let committed = new Map();
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  const matches = (value, query) => normalize(value).includes(normalize(query.trim()));

  function row(label, checked, current, arrow, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `location-picker-item${checked ? ' is-selected' : ''}${current ? ' is-current' : ''}`;
    button.setAttribute('aria-pressed', String(checked));
    const box = document.createElement('span');
    box.className = 'location-check';
    box.textContent = checked ? '✓' : '';
    const name = document.createElement('span');
    name.textContent = label;
    button.append(box, name);
    if (arrow) {
      const end = document.createElement('span');
      end.className = 'location-arrow';
      end.setAttribute('aria-hidden', 'true');
      end.textContent = '›';
      button.append(end);
    }
    button.addEventListener('click', action);
    return button;
  }

  function render() {
    if (!provinceList || !districtList) return;
    provinceList.replaceChildren();
    districtList.replaceChildren();
    const qProv = provinceSearch ? provinceSearch.value : '';
    const visible = places.filter(place => matches(place.name, qProv));
    visible.forEach(place => {
      const value = selected.get(place.name);
      const item = row(place.name, !!value, active === place.name, true, () => {
        active = place.name;
        if (selected.has(place.name)) selected.delete(place.name);
        else selected.set(place.name, new Set());
        if (districtSearch) districtSearch.value = '';
        render();
      });
      provinceList.append(item);
    });
    if (!visible.length) provinceList.append(empty('Không tìm thấy tỉnh/thành phố'));
    const place = places.find(item => item.name === active);
    const qDist = districtSearch ? districtSearch.value : '';
    const districts = place ? place[mode].filter(name => matches(name, qDist)) : [];
    const current = selected.get(active);
    districtList.append(row('Tất cả', !!current && current.size === 0, false, false, () => {
      selected.set(active, new Set());
      render();
    }));
    districts.forEach(name => districtList.append(row(name, !!current && current.has(name), false, false, () => {
      const next = new Set(selected.get(active) || []);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      if (next.size) selected.set(active, next);
      else selected.delete(active);
      render();
    })));
    if (!districts.length) districtList.append(empty(place && !place[mode].length ? 'Chọn Tất cả để tìm trong khu vực này' : 'Không tìm thấy khu vực'));
  }

  function empty(message) {
    const node = document.createElement('div');
    node.className = 'location-picker-empty';
    node.textContent = message;
    return node;
  }

  function close() {
    picker.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  function apply() {
    committed = new Map([...selected].map(([name, districts]) => [name, new Set(districts)]));
    const labels = [...committed].map(([name, districts]) => districts.size ? `${name}: ${[...districts].join(', ')}` : name);
    const value = labels.join('; ');
    select.replaceChildren(new Option(value || 'Tất cả địa điểm', value));
    select.value = value;
    // Dispatch change event to sync with job search filters
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const labelText = labels.length === 0 ? 'Tất cả địa điểm' : labels.length === 1 ? labels[0] : `${labels.length} địa điểm`;
    updateTriggerLabel(labelText);
    close();
    trigger.focus();
  }

  function updateTriggerLabel(text) {
    if (!trigger) return;
    // Khử triệt để mọi text node tự do nằm trực tiếp bên trong trigger tránh lặp chữ
    Array.from(trigger.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.remove();
      }
    });
    let labelSpan = trigger.querySelector('.location-label') || trigger.querySelector('#heroLocationLabel');
    if (!labelSpan) {
      labelSpan = document.createElement('span');
      labelSpan.className = 'location-label';
      labelSpan.id = 'heroLocationLabel';
      const chevron = trigger.querySelector('.location-chevron');
      if (chevron) {
        trigger.insertBefore(labelSpan, chevron);
      } else {
        trigger.appendChild(labelSpan);
      }
    }
    labelSpan.textContent = text;
  }

  trigger.addEventListener('click', event => {
    event.stopPropagation();
    if (!picker.hidden) return close();
    selected = new Map([...committed].map(([name, districts]) => [name, new Set(districts)]));
    picker.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.getElementById('searchSuggestDropdown')?.classList.remove('is-open');
    render();
    provinceSearch?.focus();
  });
  picker.addEventListener('click', event => event.stopPropagation());
  provinceSearch?.addEventListener('input', render);
  districtSearch?.addEventListener('input', render);
  picker.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    selected.clear();
    picker.querySelectorAll('[data-mode]').forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    if (districtSearch) {
      districtSearch.placeholder = mode === 'new' ? 'Nhập Phường/Xã mới' : 'Nhập Quận/Huyện cũ';
      districtSearch.value = '';
    }
    render();
  }));
  document.getElementById('locationClearAll')?.addEventListener('click', () => { selected.clear(); render(); });
  document.getElementById('locationApply')?.addEventListener('click', apply);
  (document.getElementById('heroSearchInput') || document.getElementById('jobSearchInput'))?.addEventListener('focus', close);
  document.addEventListener('click', event => { if (!picker.contains(event.target) && !trigger.contains(event.target)) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !picker.hidden) { close(); trigger.focus(); } });
  
  // Expose global controller
  window.EasyCVLocationPicker = {
    reset() {
      selected.clear();
      committed.clear();
      if (select) {
        select.replaceChildren(new Option('Tất cả địa điểm', ''));
        select.value = '';
      }
      updateTriggerLabel('Tất cả địa điểm');
      render();
    },
    setSelected(cityName) {
      selected.clear();
      if (cityName && cityName !== 'Tất cả địa điểm' && cityName !== '') {
        selected.set(cityName, new Set());
        committed.set(cityName, new Set());
        if (select) {
          select.replaceChildren(new Option(cityName, cityName));
          select.value = cityName;
        }
        updateTriggerLabel(cityName);
      } else {
        committed.clear();
        if (select) {
          select.replaceChildren(new Option('Tất cả địa điểm', ''));
          select.value = '';
        }
        updateTriggerLabel('Tất cả địa điểm');
      }
      render();
    },
    close
  };

  // Dọn dẹp DOM ngay khi khởi chạy để loại bỏ mọi text thừa do cache/markup
  const initialText = trigger.querySelector('.location-label')?.textContent?.trim() || 'Tất cả địa điểm';
  updateTriggerLabel(initialText);

  render();
})();
