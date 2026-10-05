const fs = require('fs');
const path = require('path');

// ==========================================
// 1. UPDATE CSS
// ==========================================
function updateCss(filePath) {
  let css = fs.readFileSync(filePath, 'utf8');

  // Replace filter-pill-btn rules
  const oldCssPattern = /\.filter-pill-btn\s*\{[\s\S]*?\.filter-dropdown-wrap\.is-open\s*\.filter-pill-btn\s*\.pill-chevron\s*\{[\s\S]*?\}/;
  
  const newCss = `.filter-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8.5px 14px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  font-family: inherit;
}

.filter-pill-btn .pill-chevron {
  color: #94A3B8;
  margin-left: 2px;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.15s;
}

.filter-pill-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
  color: #0F172A;
}

.filter-pill-btn:hover .pill-chevron {
  color: #64748B;
}

.filter-pill-btn.is-active {
  border-color: #F97316;
  background: #FFF7ED;
  color: #EA580C;
  font-weight: 600;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
}

.filter-pill-btn.is-active .pill-chevron {
  color: #EA580C;
}

.filter-dropdown-wrap.is-open .filter-pill-btn .pill-chevron {
  transform: rotate(180deg);
}`;

  if (oldCssPattern.test(css)) {
    css = css.replace(oldCssPattern, newCss);
    fs.writeFileSync(filePath, css, 'utf8');
    console.log(`Updated CSS in ${filePath}`);
  } else {
    console.warn(`Could not find oldCssPattern in ${filePath}`);
  }
}

// ==========================================
// 2. UPDATE JS
// ==========================================
const SATURDAY_MAP = {
  1: 'off_sat',       // FPT Software
  2: 'work_sat',      // Techcombank RM
  3: 'off_sat',       // VNG (Zalo)
  4: 'off_sat',       // Viettel
  5: 'work_sat',      // Shopee SPX Logistics
  6: 'off_sat',       // MoMo
  7: 'off_sat',       // VNPAY
  8: 'work_sat',      // Vingroup Vinhomes
  9: 'work_sat',      // CMC Telecom
  10: 'off_sat',      // Base.vn
  11: 'off_sat',      // One Mount Group
  12: 'off_sat',      // KMS Technology
  13: 'off_sat',      // FPT Software Academy
  14: 'unmentioned',  // Tiki HR
  15: 'work_sat',     // Masan Consumer
  16: 'off_sat',      // NashTech Vietnam
  17: 'off_sat',      // VinAI Research
  18: 'off_sat',      // MB Bank
  19: 'unmentioned',  // Vinamilk
  20: 'off_sat',      // Bosch
  21: 'off_sat',      // Unilever
  22: 'unmentioned',  // VPBank
  23: 'work_sat',     // Gemadept
  24: 'off_sat',      // VNPT
  25: 'off_sat',      // Tiki Tech Hub
  26: 'off_sat',      // FPT Digital
  27: 'work_sat',     // Dentsu
  28: 'work_sat'      // Tân Á Đại Thành
};

function updateJs(filePath) {
  let js = fs.readFileSync(filePath, 'utf8');

  // 1. Add saturday field to JOBS_DATA
  for (const [id, satVal] of Object.entries(SATURDAY_MAP)) {
    // Look for id: 1, ... type: '...',
    const idRegex = new RegExp(`(id:\\s*${id},[\\s\\S]*?type:\\s*'[a-z]+',)`);
    if (idRegex.test(js) && !js.includes(`id: ${id},` + '\n' + `      saturday:`)) {
      js = js.replace(idRegex, `$1\n      saturday: '${satVal}',`);
    }
  }

  // 2. State variable
  if (!js.includes('selectedSaturday')) {
    js = js.replace(
      /let selectedType = '';/,
      `let selectedType = '';\n  let selectedSaturday = '';`
    );
  }

  // 3. FILTER_DEFAULT_LABELS
  if (!js.includes("saturday: 'Thứ 7'")) {
    js = js.replace(
      /type: 'Loại hình'/,
      `type: 'Loại hình',\n    saturday: 'Thứ 7'`
    );
  }

  // 4. updateFilterCounts
  if (!js.includes('[data-count-saturday]')) {
    js = js.replace(
      /(document\.querySelectorAll\('\[data-count-type\]'\)\.forEach[\s\S]*?\}\);)/,
      `$1\n    document.querySelectorAll('[data-count-saturday]').forEach(el => {\n      const val = el.getAttribute('data-count-saturday');\n      el.textContent = JOBS_DATA.filter(j => j.saturday === val).length;\n    });`
    );
  }

  // 5. renderActiveFilterChips
  if (!js.includes("{ type: 'saturday', value: selectedSaturday")) {
    js = js.replace(
      /\{ type: 'type', value: selectedType, labelPrefix: 'Hình thức' \}/,
      `{ type: 'type', value: selectedType, labelPrefix: 'Hình thức' },\n      { type: 'saturday', value: selectedSaturday, labelPrefix: 'Thứ 7' }`
    );
  }

  // 6. resetAllTopFilters
  if (!js.includes("selectedSaturday = '';")) {
    js = js.replace(
      /selectedType = '';\s*\n\s*\['exp', 'salary', 'level', 'type'\]/,
      `selectedType = '';\n    selectedSaturday = '';\n\n    ['exp', 'salary', 'level', 'type', 'saturday']`
    );
  }

  // 7. initTopFilterBar - dropdown items click
  if (!js.includes("else if (type === 'saturday') selectedSaturday = value;")) {
    js = js.replace(
      /else if \(type === 'type'\) selectedType = value;/,
      `else if (type === 'type') selectedType = value;\n        else if (type === 'saturday') selectedSaturday = value;`
    );
  }

  // 8. initTopFilterBar - chip remove click
  if (!js.includes("else if (clearType === 'saturday') selectedSaturday = '';")) {
    js = js.replace(
      /else if \(clearType === 'type'\) selectedType = '';/,
      `else if (clearType === 'type') selectedType = '';\n      else if (clearType === 'saturday') selectedSaturday = '';`
    );
  }

  // 9. applyJobFilters criteria
  if (!js.includes('const filterSaturday = selectedSaturday;')) {
    js = js.replace(
      /const filterType = selectedType;/,
      `const filterType = selectedType;\n    const filterSaturday = selectedSaturday;`
    );
  }

  if (!js.includes('|| filterSaturday')) {
    js = js.replace(
      /\|\| filterType\);/,
      `|| filterType || filterSaturday);`
    );
  }

  // 10. applyJobFilters matching loop
  if (!js.includes('// 9. Chế độ làm việc thứ 7')) {
    js = js.replace(
      /(if \(isMatch && filterType && job\.type !== filterType\) \{\s*isMatch = false;\s*\})/,
      `$1\n\n      // 9. Chế độ làm việc thứ 7 (Top Filter Bar)\n      if (isMatch && filterSaturday && job.saturday !== filterSaturday) {\n        isMatch = false;\n      }`
    );
  }

  // 11. URL sync in applyJobFilters
  if (!js.includes("newParams.set('saturday', selectedSaturday);")) {
    js = js.replace(
      /if \(selectedType\) newParams\.set\('type', selectedType\);/,
      `if (selectedType) newParams.set('type', selectedType);\n      if (selectedSaturday) newParams.set('saturday', selectedSaturday);`
    );
  }

  // 12. syncStateFromUrl
  if (!js.includes("const saturdayParam = urlParams.get('saturday')")) {
    js = js.replace(
      /const typeParam = urlParams\.get\('type'\) \|\| '';/,
      `const typeParam = urlParams.get('type') || '';\n    const saturdayParam = urlParams.get('saturday') || '';`
    );
  }

  if (!js.includes("selectedSaturday = saturdayParam;")) {
    js = js.replace(
      /selectedType = typeParam;/,
      `selectedType = typeParam;\n    selectedSaturday = saturdayParam;`
    );
  }

  if (!js.includes("['exp', 'salary', 'level', 'type', 'saturday'].forEach(t => {")) {
    js = js.replace(
      /\['exp', 'salary', 'level', 'type'\]\.forEach\(t => \{/,
      `['exp', 'salary', 'level', 'type', 'saturday'].forEach(t => {`
    );
  }

  if (!js.includes("t === 'type' ? selectedType : selectedSaturday;")) {
    js = js.replace(
      /t === 'level' \? selectedLevel : selectedType;/,
      `t === 'level' ? selectedLevel : t === 'type' ? selectedType : selectedSaturday;`
    );
  }

  fs.writeFileSync(filePath, js, 'utf8');
  console.log(`Updated JS in ${filePath}`);
}

// Run for both root and public
updateCss(path.join(__dirname, '..', 'css', 'viec-lam.css'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'css', 'viec-lam.css'))) {
  updateCss(path.join(__dirname, '..', 'public', 'css', 'viec-lam.css'));
}

updateJs(path.join(__dirname, '..', 'js', 'viec-lam.js'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'js', 'viec-lam.js'))) {
  updateJs(path.join(__dirname, '..', 'public', 'js', 'viec-lam.js'));
}
