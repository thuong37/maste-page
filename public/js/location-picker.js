(() => {
  const trigger = document.getElementById('heroLocationTrigger');
  const picker = document.getElementById('heroLocationPicker');
  const select = document.getElementById('heroLocationSelect');
  if (!trigger || !picker || !select) return;

  const places = [
    { name: 'Hà Nội', old: ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân', 'Hà Đông', 'Long Biên'], new: ['Ba Đình', 'Hoàn Kiếm', 'Cầu Giấy', 'Hà Đông'] },
    { name: 'Hồ Chí Minh', old: ['Bình Chánh', 'Bình Tân', 'Bình Thạnh', 'Cần Giờ', 'Củ Chi', 'Gò Vấp', 'Phú Nhuận', 'Quận 1', 'Quận 3', 'Quận 7', 'Tân Bình', 'Thủ Đức'], new: ['Bến Thành', 'Sài Gòn', 'Tân Định', 'Bình Thạnh', 'Thủ Đức'] },
    { name: 'Bình Dương', old: ['Dĩ An', 'Thuận An', 'Thủ Dầu Một', 'Bến Cát'], new: [] },
    { name: 'Bắc Ninh', old: ['Bắc Ninh', 'Từ Sơn', 'Quế Võ'], new: ['Bắc Ninh', 'Từ Sơn'] },
    { name: 'Đồng Nai', old: ['Biên Hòa', 'Long Thành', 'Nhơn Trạch'], new: ['Biên Hòa', 'Long Thành'] },
    { name: 'Hưng Yên', old: ['Hưng Yên', 'Văn Lâm', 'Mỹ Hào'], new: ['Hưng Yên', 'Mỹ Hào'] },
    { name: 'Đà Nẵng', old: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Liên Chiểu'], new: ['Hải Châu', 'Sơn Trà'] },
    { name: 'Hải Phòng', old: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Thủy Nguyên'], new: ['Hồng Bàng', 'Ngô Quyền'] },
    { name: 'Cần Thơ', old: ['Ninh Kiều', 'Bình Thủy', 'Cái Răng'], new: ['Ninh Kiều', 'Cái Răng'] }
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
    provinceList.replaceChildren();
    districtList.replaceChildren();
    const visible = places.filter(place => matches(place.name, provinceSearch.value));
    visible.forEach(place => {
      const value = selected.get(place.name);
      const item = row(place.name, !!value, active === place.name, true, () => {
        active = place.name;
        if (selected.has(place.name)) selected.delete(place.name);
        else selected.set(place.name, new Set());
        districtSearch.value = '';
        render();
      });
      provinceList.append(item);
    });
    if (!visible.length) provinceList.append(empty('Không tìm thấy tỉnh/thành phố'));
    const place = places.find(item => item.name === active);
    const districts = place ? place[mode].filter(name => matches(name, districtSearch.value)) : [];
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
    trigger.firstChild.textContent = labels.length === 0 ? 'Tất cả địa điểm ' : labels.length === 1 ? `${labels[0]} ` : `${labels.length} địa điểm `;
    close();
    trigger.focus();
  }

  trigger.addEventListener('click', event => {
    event.stopPropagation();
    if (!picker.hidden) return close();
    selected = new Map([...committed].map(([name, districts]) => [name, new Set(districts)]));
    picker.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.getElementById('searchSuggestDropdown')?.classList.remove('is-open');
    render();
    provinceSearch.focus();
  });
  picker.addEventListener('click', event => event.stopPropagation());
  provinceSearch.addEventListener('input', render);
  districtSearch.addEventListener('input', render);
  picker.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    selected.clear();
    picker.querySelectorAll('[data-mode]').forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    districtSearch.placeholder = mode === 'new' ? 'Nhập Phường/Xã' : 'Nhập Quận/Huyện';
    districtSearch.value = '';
    render();
  }));
  document.getElementById('locationClearAll').addEventListener('click', () => { selected.clear(); render(); });
  document.getElementById('locationApply').addEventListener('click', apply);
  document.getElementById('heroSearchInput')?.addEventListener('focus', close);
  document.addEventListener('click', event => { if (!picker.contains(event.target) && !trigger.contains(event.target)) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !picker.hidden) { close(); trigger.focus(); } });
  render();
})();
