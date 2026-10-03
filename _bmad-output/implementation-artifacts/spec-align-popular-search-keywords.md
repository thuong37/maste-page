---
title: 'Align popular search keywords in category modal'
type: 'bugfix'
created: '2026-10-03'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The keyword chips in the “Được tìm kiếm nhiều” row start too far left and do not align with the “VỊ TRÍ CHUYÊN MÔN” column used by the rows below.

**Approach:** Reuse the category modal’s existing two-column grid dimensions for the popular-keyword row, preserve its stacked mobile layout, and keep the root and `public/` static builds synchronized.

</frozen-after-approval>

## Implementation Notes

- Replaced the desktop popular-keyword row's content-width flex layout with the modal's existing `220px minmax(0, 1fr)` column grid; the first keyword now aligns with the “VỊ TRÍ CHUYÊN MÔN” header.
- Added the matching `180px` tablet grid rule and restored the existing stacked flex layout below `768px`.
- Updated both `css/category-filter-modal.css` and `public/css/category-filter-modal.css` and extended `scratch/test_homepage_category.js` with a one-pixel alignment assertion plus an isolated Chrome profile.
- Incremented the stylesheet cache key in both root/public homepage and jobs-page HTML consumers.
- Headless Chrome verification passed: desktop and tablet alignment delta `0px`; mobile restored `display: flex`, `flex-direction: column`, and `390px` scroll width within a `390px` viewport; modal open/select/apply assertions also passed.

## Review Triage Log

- `medium` — stale `v=1.0` stylesheet URLs could preserve the old layout in browser/CDN caches; patched all four HTML consumers to `v=1.1_alignment`.
- `medium` — modal-open state was logged but not asserted; patched explicit title, visibility, group-count, and subgroup-count checks.
- `medium` — selection/application state was logged but not asserted; patched explicit closed-state, `Sales Logistics` label, and active-state checks.
- `medium` — tablet/mobile responsive behavior was untested; patched 900px grid alignment and 390px stacked-layout/overflow assertions.
- `low` — the jobs-page consumer is not opened by this homepage-focused test; rejected because the change is in the byte-identical shared stylesheet/markup contract and adding a second-page harness is disproportionate to this scoped fix.
- `low` — isolated Chrome profiles could accumulate in the OS temp directory; patched best-effort process-exit cleanup for the exact generated directory.
- `low` — fixed two-second Chrome readiness delay can fail on unusually slow startup; rejected as a pre-existing harness limitation whose retry refactor exceeds this UI fix.
- `low` — fixed debugging port can collide with concurrent runs; rejected as a rare developer-only condition whose dynamic-port refactor exceeds this UI fix.
- `low` — evidence PNGs are overwritten rather than snapshot-compared; rejected because they are intentionally retained implementation evidence and were visually inspected, while adding a snapshot framework is disproportionate.
- `false` — `in-progress` status was correct during the required review phase; this finalization step now marks the completed spec `done`.

