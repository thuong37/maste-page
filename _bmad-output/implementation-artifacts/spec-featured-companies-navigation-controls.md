---
title: 'Add navigation controls to the Featured Companies carousel'
type: 'feature'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The “Công ty nổi bật” (Featured Companies) section on the homepage auto-rotated continuously, but users had no manual previous/next controls beside “Xem tất cả” to browse companies in both directions.

**Approach:** Add two circular navigation buttons (`<` and `>`) immediately adjacent to “Xem tất cả” in `.top-companies-header`, matching the exact design pattern and brand aesthetic. Connect them to the carousel track for smooth bidirectional one-card manual transitions while maintaining auto-scroll, pause-on-hover/focus, accessibility, dark mode, responsive layouts, and strict source/public asset parity.

</frozen-after-approval>

## Implementation Notes

- Added `.companies-header-actions` with `.section-view-all` ("Xem tất cả") and `.companies-carousel-controls` containing two circular arrow buttons (`.companies-carousel-prev`, `.companies-carousel-next`) and an accessibility live status region (`.companies-carousel-status`) in `index.html` and `public/index.html`.
- Updated `#companies-track` with `id="companies-track"` matching `aria-controls`.
- Extended `css/home.css` and `public/css/home.css` with `.top-companies-header`, `.companies-header-actions`, `.companies-carousel-controls`, `.companies-carousel-arrow`, including hover/active states, visible focus outlines, dark mode palette, and mobile responsive rules (`max-width: 640px` and `max-width: 480px`).
- Extended `js/home.js` and `public/js/home.js` with bidirectional movement logic (`move(-1)` and `move(1)`), transition guarding (`isTransitioning`), fallback timeout (700ms), screen reader live announcements, reduced-motion fallback, and slide accessibility synchronization (`tabindex` and `aria-hidden`).
- Bumped cache-buster query strings to `home.css?v=8.1_companies_nav` and `home.js?v=20261007_companies_nav`.

| Defect / risk | Technical resolution | Verification |
|---|---|---|
| No manual company card navigation | Added circular previous/next controls wired to bidirectional track translation | CDP automated click testing verified forward & backward card transitions |
| Rapid clicking causing transform desynchronization | Added transition guard `isTransitioning`, `fallbackTimer`, and listener cleanup | Rapid click tests passed without DOM corruption |
| Child transition bubbles prematurely ending slide move | Checked `event.target === companiesTrack` and `propertyName === 'transform'` | Transition end filtering verified |
| Offscreen links remained in keyboard focus order | Synchronized `tabindex` (0 vs -1) and `aria-hidden` across cards and interactive child elements | Accessibility evaluation confirmed |
| Narrow header overflow on small mobile devices | Maintained flex alignment, stacking header actions right-aligned below 480px | Headless Chrome tested at 375px with 0 overflow |
| Source/public file divergence | Updated both root and public mirror files simultaneously | SHA-256 parity passed 100% for all three file pairs |

## Verification Summary

- **Syntax Check:** `node --check js/home.js` and `node --check public/js/home.js` exited with code 0 (PASS).
- **Format Check:** `git diff --check` passed with 0 errors.
- **SHA-256 Parity:**
  - `index.html` ⇄ `public/index.html`: MATCH ✅
  - `css/home.css` ⇄ `public/css/home.css`: MATCH ✅
  - `js/home.js` ⇄ `public/js/home.js`: MATCH ✅
- **CDP Headless Chrome Automated Test:**
  - Verified presence of `.top-companies-header`, "Xem tất cả", and circular 36x36px buttons.
  - Verified clicking Next shifted track to "Công ty Cổ Phần VNG - VNG Corporation" and announced via live status.
  - Verified clicking Prev restored track to "Công ty TNHH Phần Mềm FPT - FPT Software" and announced via live status.
  - Verified mobile 375px viewport has no horizontal overflow (`docOverflow: false`).
