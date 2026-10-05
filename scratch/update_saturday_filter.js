const fs = require('fs');
const path = require('path');

function updateHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove leading icons from filter buttons
  // Industry
  content = content.replace(
    /(<button type="button" class="filter-pill-btn" id="industryFilterBtn"[^>]*>)\s*<svg[^>]*>[\s\S]*?<\/svg>\s*(<span class="pill-label" id="industryFilterLabel">)/g,
    '$1\n                $2'
  );

  // Exp
  content = content.replace(
    /(<button type="button" class="filter-pill-btn" id="expFilterBtn"[^>]*>)\s*<svg[^>]*>[\s\S]*?<\/svg>\s*(<span class="pill-label" id="expFilterLabel">)/g,
    '$1\n                $2'
  );

  // Level
  content = content.replace(
    /(<button type="button" class="filter-pill-btn" id="levelFilterBtn"[^>]*>)\s*<svg[^>]*>[\s\S]*?<\/svg>\s*(<span class="pill-label" id="levelFilterLabel">)/g,
    '$1\n                $2'
  );

  // Salary
  content = content.replace(
    /(<button type="button" class="filter-pill-btn" id="salaryFilterBtn"[^>]*>)\s*<svg[^>]*>[\s\S]*?<\/svg>\s*(<span class="pill-label" id="salaryFilterLabel">)/g,
    '$1\n                $2'
  );

  // Type
  content = content.replace(
    /(<button type="button" class="filter-pill-btn" id="typeFilterBtn"[^>]*>)\s*<svg[^>]*>[\s\S]*?<\/svg>\s*(<span class="pill-label" id="typeFilterLabel">)/g,
    '$1\n                $2'
  );

  // 2. Replace Filter 5 (Checkbox Nghỉ thứ 7) with Dropdown Filter Thứ 7
  const saturdayDropdownHtml = `<!-- Filter 5: Thứ 7 -->
            <div class="filter-dropdown-wrap" id="saturdayDropdownWrap">
              <button type="button" class="filter-pill-btn" id="saturdayFilterBtn" aria-haspopup="true" aria-expanded="false" title="Lọc theo chế độ làm việc Thứ 7">
                <span class="pill-label" id="saturdayFilterLabel">Thứ 7</span>
                <svg class="pill-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div class="filter-dropdown-menu" id="saturdayDropdownMenu" hidden>
                <div class="dropdown-item is-selected" data-type="saturday" data-value="" data-label="Không lọc">
                  <span>Không lọc</span>
                  <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="dropdown-item" data-type="saturday" data-value="work_sat" data-label="Làm thứ 7">
                  <span>Làm thứ 7</span>
                  <span class="item-count" data-count-saturday="work_sat">8</span>
                </div>
                <div class="dropdown-item" data-type="saturday" data-value="off_sat" data-label="Nghỉ thứ 7">
                  <span>Nghỉ thứ 7</span>
                  <span class="item-count" data-count-saturday="off_sat">16</span>
                </div>
                <div class="dropdown-item" data-type="saturday" data-value="unmentioned" data-label="Không đề cập">
                  <span>Không đề cập</span>
                  <span class="item-count" data-count-saturday="unmentioned">4</span>
                </div>
              </div>
            </div>`;

  if (content.includes('id="sat5DayFilterWrap"')) {
    content = content.replace(
      /<!-- Filter 5: Nghỉ thứ 7 \(checkbox\) -->[\s\S]*?<\/label>/,
      saturdayDropdownHtml
    );
  } else if (!content.includes('id="saturdayDropdownWrap"')) {
    // If sat5DayFilterWrap not present, insert after typeDropdownWrap
    content = content.replace(
      /(<\/div>\s*<\/div>\s*)(<!-- Nút Xóa Lọc Nhanh -->|<button type="button" class="btn-clear-top-filters")/g,
      `</div>\n            </div>\n\n            ${saturdayDropdownHtml}\n\n            $2`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateHtml(path.join(__dirname, '..', 'viec-lam.html'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'viec-lam.html'))) {
  updateHtml(path.join(__dirname, '..', 'public', 'viec-lam.html'));
}
