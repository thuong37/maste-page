---
title: 'Synchronize Job Detail top filters'
type: 'feature'
created: '2026-10-06'
status: 'completed'
route: 'oneshot'
review_loop_iteration: 1
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Job Detail page has the shared smart-search controls but was initially missing the six advanced filter dropdowns available on Job List, forcing users to return to the result page before they can narrow jobs by company industry, experience, level, salary, work type, or Saturday schedule.

**Approach:** Reuse the current Job List filter-bar markup, styling, option values, selection states, searchable industry menu, clear action, outside-click/Escape behavior, and keyboard-operable controls on Job Detail. Keep the detail page focused on the current job while users compose criteria; submit the combined search and filter state through the existing search button or directly to `viec-lam.html`, where the canonical live-filter engine applies it.

</frozen-after-approval>

## Implementation & Bug Fix Report

### 1. Initial Implementation
- Added 6 filter dropdown pills: Lĩnh vực công ty, Kinh nghiệm, Cấp bậc, Mức lương, Hình thức, Nghỉ thứ 7.
- Added saved filters dialog (`#ctSavedFiltersDialog`) and clear filter trigger.
- Created `js/chi-tiet-filter.js` (and mirrored to `public/js/chi-tiet-filter.js`) to handle state, dropdown toggles, saved filters persistence, and redirection to `viec-lam.html` with query params.

### 2. Defect Resolution: Filter Bar Left-Aligned & Detached as Separate Block
- **Issue:** The filter bar was rendered as an isolated white card (`background: #FFFFFF`, border, border-radius) and left-aligned because it was initially placed outside `.job-search-hero` and outside `.hero-search-sticky-bar`.
- **Root Cause:**
  - CSS rule `.job-search-hero .top-filter-bar` sets `background: transparent !important; border: none !important; border-radius: 0 !important; margin-top: 8px !important;` which only applies when the filter bar is inside `.job-search-hero`.
  - Centering is provided by `.job-search-container` (`max-width: 1250px; margin: 0 auto; padding: 0 20px;`) and `.hero-search-sticky-bar`.
- **Solution:**
  - Moved `#chiTietTopFilterBar` and `#ctSavedFiltersDialog` inside `.hero-search-sticky-bar`, directly below the search form and suggest dropdown.
  - Adjusted `.single-job-hero` padding to `28px 0 8px 0` for consistent vertical rhythm.
  - Mirrored all updates to `public/chi-tiet-viec-lam.html` and `public/js/chi-tiet-filter.js`.

### 3. Verification & Metrics Matrix

| Metric / Check | `viec-lam.html` (Reference) | `chi-tiet-viec-lam.html` (Before Fix) | `chi-tiet-viec-lam.html` (After Fix) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Search Box Position / Width** | `x: 100, width: 1210` | `x: 100, width: 1210` | `x: 100, width: 1210` | ✅ Identical |
| **Filter Bar Position / Width** | `x: 100, width: 1210` | Misaligned (left) | `x: 100, width: 1210` | ✅ 100% Pixel Match |
| **Filter Bar Background** | `rgba(0, 0, 0, 0)` (transparent) | `#FFFFFF` (isolated card) | `rgba(0, 0, 0, 0)` (transparent) | ✅ Unified |
| **Filter Bar Border** | `0px none` | `1px solid #E2E8F0` | `0px none` | ✅ Unified |
| **Parent Container** | `hero-search-sticky-bar` | `main.page-wrapper` | `hero-search-sticky-bar` | ✅ Symmetrical |
| **Pill Labels** | Mức lương, Hình thức | Lương, Loại hình | Mức lương, Hình thức | ✅ Aligned |
| **Sticky Scroll Top Position** | `top: 0px` (sát mép trên) | `top: 72px` (khoảng trống thừa) | `top: 0px` (sát mép trên) | ✅ Fixed |
| **Console Errors** | 0 | 0 | 0 | ✅ Zero errors |
| **Interactions (Dropdown/Dialog)** | Working | Working | Working | ✅ Passed |

### 4. Sticky Scroll Defect Resolution (Neo đỉnh màn hình khi cuộn)
- **Vấn đề:** Khi cuộn trang, thanh tìm kiếm và bộ lọc được neo cố định nhưng nằm lơ lửng cách mép trên 72px, tạo khoảng trống rỗng phía trên do headerHeight được gán cứng vào `--sticky-search-top`.
- **Giải pháp:**
  - Trong `js/chi-tiet-viec-lam.js` & `public/js/chi-tiet-viec-lam.js`, cập nhật `initStickySearch()` gán `--sticky-search-top = '0px'`, kích hoạt khi `wrapperRect.top <= 0`, bù chiều cao chính xác bằng `stickyBar.offsetHeight`.
  - Bổ sung `.site-header { position: relative !important; top: auto !important; }` vào thẻ `<style>` của `chi-tiet-viec-lam.html` & `public/chi-tiet-viec-lam.html`.
- **Kết quả:** Kiểm thử tự động trên Chrome Headless tại `scrollY = 350px`: `stickyBar.top = 0px`, `computedTop = '0px'`, `siteHeader.top = -350px`. Thanh neo áp sát mép trên cùng tuyệt đối (0px gap).

