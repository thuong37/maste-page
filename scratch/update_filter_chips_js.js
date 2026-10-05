const fs = require('fs');

['js/viec-lam.js', 'public/js/viec-lam.js'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const target = 'function renderActiveFilterChips() {';
  const startIdx = content.indexOf(target);
  if (startIdx !== -1) {
    const endIdx = content.indexOf('function resetAllTopFilters', startIdx);
    const oldFunc = content.slice(startIdx, endIdx);
    const newFunc = `function renderActiveFilterChips() {
    const chipsRow = document.getElementById('activeFilterChipsRow');
    const chipsList = document.getElementById('activeChipsList');
    const clearBtn = document.getElementById('btnClearTopFilters');

    // Đã bỏ hàng hiển thị giá trị đang lọc ("Đang lọc: ...") bên dưới theo yêu cầu người dùng
    if (chipsRow) chipsRow.style.display = 'none';
    if (chipsList) chipsList.innerHTML = '';

    const activeFilters = [
      { type: 'exp', value: selectedExp },
      { type: 'salary', value: selectedSalary },
      { type: 'level', value: selectedLevel },
      { type: 'type', value: selectedType },
      { type: 'saturday', value: selectedSaturday }
    ];

    const activeCount = activeFilters.filter(f => Boolean(f.value)).length;

    if (clearBtn) {
      clearBtn.style.display = activeCount > 0 ? 'inline-flex' : 'none';
    }
  }

  `;
    content = content.replace(oldFunc, newFunc);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated renderActiveFilterChips in ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
});
