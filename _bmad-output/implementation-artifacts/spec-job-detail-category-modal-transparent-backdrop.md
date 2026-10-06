---
title: 'Remove the Job Detail category-popup scrim and blur'
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

**Problem:** Opening “Danh mục Nghề” on Job Detail still darkens and blurs the surrounding interface, reproducing the backdrop defect already corrected on Job List and Homepage.

**Approach:** Give Job Detail an explicit page scope and apply the same transparent, no-blur backdrop treatment used by Job List and Homepage, while preserving the full-screen outside-click hit area, popup positioning, responsive behavior, and category interactions.

</frozen-after-approval>

## Implementation Notes

- Code map: `css/category-filter-modal.css` and its public mirror contain the grouped transparent/no-blur page scopes. `chi-tiet-viec-lam.html` and its public mirror need the Job Detail body scope and a new cache key. `scratch/verify_category_no_blur.js` is the existing cross-route browser matrix.
- Footprint: two mirrored CSS files, two mirrored Job Detail HTML files, the existing verification script, and required documentation/memory records. No dependency, API, controller, data, or irreversible change.
- Keep the shared backdrop element and `pointer-events: auto`; only its visual background/filter changes on Job Detail.
- Added `job-detail-page` to both Job Detail body elements, extended the grouped transparent/no-blur selector, and raised the category-modal asset key to `v=1.5_all_pages_clear_backdrop`.
- Extended `scratch/verify_category_no_blur.js` to cover root/public Job Detail and a dedicated 375px Job Detail viewport check.

### Defect and Verification Matrix

| Scenario | Expected behavior | Actual result |
|---|---|---|
| Root Job Detail, desktop | No dark scrim and no backdrop blur | Transparent background and `backdrop-filter: none` — PASS |
| Public Job Detail | Match the root route | Transparent/no-blur with active outside-click capture — PASS |
| Job Detail, 375px mobile | Preserve the transparent backdrop without overflow | Dialog width 335px within the 375px viewport — PASS |
| Outside-click hit area | Keep the backdrop interactive | `pointer-events: auto` — PASS |
| Homepage and Job List regression | Retain their corrected behavior | Both remain transparent/no-blur — PASS |
| Source/public parity | Keep CSS and Job Detail HTML mirrors synchronized | SHA-256 parity — PASS |
