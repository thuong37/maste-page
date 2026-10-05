---
title: 'Make the job-list category modal backdrop transparent'
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

**Problem:** The job-list category popup no longer applies CSS blur, but its dark semi-transparent scrim still visually dims the entire surrounding interface, so the result appears effectively unchanged to the user.

**Approach:** Make the backdrop fully transparent on the Job List page while preserving its full-screen hit area for outside-click dismissal, the modal’s stacking and anchored layout, responsive behavior, and category-selection interactions. Keep the existing shared backdrop appearance on other pages unchanged.

</frozen-after-approval>

## Implementation Notes

- Code map: `css/category-filter-modal.css` and its `public/` mirror contain the existing `body.job-list-page .category-modal-backdrop` override; extend only that scoped rule. `scratch/verify_category_no_blur.js` already covers computed backdrop styling, interactions, responsive layout, and shared-page isolation.
- Footprint: two mirrored CSS files, the existing browser verification script, the job-list asset cache key in two mirrored HTML files, and documentation/memory records. No irreversible operation or new dependency.
- Set the Job List scoped backdrop background to transparent while retaining `pointer-events: auto` on the shared rule. Incremented the Job List stylesheet cache key and extended browser assertions to require a fully transparent computed background on desktop and mobile.

### Defect and Verification Matrix

| Scenario | Technical solution | Actual result |
|---|---|---|
| Root Job List, desktop | Scoped transparent background and no blur | `background: rgba(0, 0, 0, 0)`, `backdrop-filter: none` — PASS |
| Root Job List, 375px mobile | Same scoped override with responsive modal | Transparent/no blur; dialog width `335px` within `375px` viewport — PASS |
| Outside click | Preserve backdrop `pointer-events: auto` | Popup closes — PASS |
| Category selection | Leave selection controller unchanged | All subgroup and role selections update — PASS |
| Homepage and Job Detail | Preserve shared backdrop rule | `blur(4px)` and `rgba(15, 23, 42, 0.45)` — PASS |
| Public mirrors | Load all three `public/` routes in Chrome | Public Job List is transparent/no blur; shared pages retain blur/scrim — PASS |
| Source/public parity | Mirrored CSS and HTML edits | SHA-256 parity verified — PASS |

## Review Triage Log

- `low` — Spec lifecycle remained in progress after implementation. Finalized to done after all checks passed.
- `medium` — The artifact lacked the project-required defect/test matrix. Added the scenarios and measured results above.
- `medium` — Shared-page verification checked blur but not scrim color. Patched the browser test to require both values on root and public routes.
- `medium` — Runtime checks initially covered only root routes. Patched the test to load every public mirror and verify the deployed Job List behavior directly.
