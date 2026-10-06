---
title: 'Match the homepage category popup backdrop to Job List'
type: 'bugfix'
created: '2026-10-06'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Opening the “Danh mục Nghề” popup on the homepage still blurs and darkens the surrounding interface, while the equivalent popup on Job List leaves the page visually unchanged.

**Approach:** Apply the Job List transparent, no-blur backdrop treatment to the homepage category popup while preserving outside-click dismissal, popup positioning, responsive behavior, category selection, and the existing appearance on unrelated pages.

</frozen-after-approval>

## Implementation Notes

- Code map: `css/category-filter-modal.css` and `public/css/category-filter-modal.css` contain the shared backdrop plus the existing Job List page-scoped transparent/no-blur override. `index.html` and `public/index.html` provide the homepage body and stylesheet cache key. `scratch/verify_category_no_blur.js` already exercises backdrop styles, outside-click dismissal, selection, responsive containment, and page isolation.
- Footprint: two mirrored CSS files, two mirrored homepage HTML files, the existing browser verification script, and required documentation/memory records. No irreversible operation, external side effect, API change, or dependency.
- Use an explicit homepage body scope and extend the existing transparent/no-blur rule; do not change the modal controller or remove the backdrop hit area.
- Added `home-page` to the root and public homepage bodies, extended the existing scoped CSS override to both Job List and Homepage, and bumped the homepage category-modal stylesheet cache key.
- Extended `scratch/verify_category_no_blur.js` to assert root/public homepage parity and preserve the existing Job Detail treatment. Static checks and Chrome headless verification passed.

### Defect and Verification Matrix

| Scenario | Technical solution | Actual result |
|---|---|---|
| Root Homepage, desktop | Explicit `home-page` body scope plus transparent/no-blur backdrop override | `background: rgba(0, 0, 0, 0)`, `backdrop-filter: none` — PASS |
| Public Homepage | Mirror the body scope, CSS rule, and cache key | Same transparent/no-blur computed styles — PASS |
| Outside click | Keep the shared backdrop and `pointer-events: auto` | Popup closes — PASS |
| Job List | Retain the existing `job-list-page` selector in the grouped rule | Desktop and 375px mobile behavior remain PASS |
| Category selection | Leave controller and modal markup unchanged | Bulk subgroup and role selection remain PASS |
| Job Detail isolation | Do not add the homepage scope to Job Detail | Existing `blur(4px)` and dark scrim remain — PASS |
| Source/public CSS parity | Apply identical CSS edits to both mirrors | SHA-256 hashes match — PASS |
