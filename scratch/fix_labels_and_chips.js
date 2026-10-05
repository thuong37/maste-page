const fs = require('fs');
const path = require('path');

function fixJs(filePath) {
  let js = fs.readFileSync(filePath, 'utf8');

  // Fix FILTER_DEFAULT_LABELS
  if (!js.includes("saturday: 'Thứ 7'")) {
    js = js.replace(
      /type:\s*'Hình thức'/g,
      "type: 'Hình thức',\n    saturday: 'Thứ 7'"
    );
  }

  // Fix resetAllTopFilters
  if (!js.includes("selectedSaturday = '';\r\n\r\n    ['exp', 'salary', 'level', 'type', 'saturday']") &&
      !js.includes("selectedSaturday = '';\n\n    ['exp', 'salary', 'level', 'type', 'saturday']")) {
    js = js.replace(
      /selectedType = '';\s*(\r?\n)\s*\['exp', 'salary', 'level', 'type'\]/g,
      "selectedType = '';$1    selectedSaturday = '';$1$1    ['exp', 'salary', 'level', 'type', 'saturday']"
    );
  }

  fs.writeFileSync(filePath, js, 'utf8');
  console.log(`Fixed JS in ${filePath}`);
}

function fixHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Ensure activeFilterChipsRow exists in topFilterBar
  if (!html.includes('id="activeFilterChipsRow"')) {
    const chipsRowHtml = `\n        <!-- Hàng Active Filter Chips (Hiện các tiêu chí đang lọc) -->\n        <div class="active-filter-chips-row" id="activeFilterChipsRow" style="display: none;">\n          <div class="active-chips-inner">\n            <span class="active-chips-label">Đang lọc:</span>\n            <div class="active-chips-list" id="activeChipsList"></div>\n            <button type="button" class="btn-clear-chips-inline" id="btnClearChipsInline">Xóa tất cả</button>\n          </div>\n        </div>`;

    html = html.replace(
      /(\s*<\/div>\s*<\/div>\s*<\/section>)/,
      `${chipsRowHtml}$1`
    );
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Added activeFilterChipsRow to ${filePath}`);
  }
}

fixJs(path.join(__dirname, '..', 'js', 'viec-lam.js'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'js', 'viec-lam.js'))) {
  fixJs(path.join(__dirname, '..', 'public', 'js', 'viec-lam.js'));
}

fixHtml(path.join(__dirname, '..', 'viec-lam.html'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'viec-lam.html'))) {
  fixHtml(path.join(__dirname, '..', 'public', 'viec-lam.html'));
}
