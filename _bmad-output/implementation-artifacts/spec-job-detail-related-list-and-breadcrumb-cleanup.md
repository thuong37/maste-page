---
title: 'Clean up the Job Detail related-jobs block'
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

**Problem:** The cards under “Việc làm liên quan khác” are inset by horizontal feed padding instead of aligning with the containing block edges, and the breadcrumb below the search area adds unwanted visual clutter.

**Approach:** Remove only the related-list feed’s left/right padding so cards fill the block width, retain useful vertical spacing and card content padding, and remove the entire Job Detail breadcrumb markup and its unused update hook.

</frozen-after-approval>

## Implementation Notes

- Code map: root/public `chi-tiet-viec-lam.html` contain an inline `.split-list-feed` override and the breadcrumb markup; root/public `css/viec-lam.css` contain the base feed padding; root/public `js/chi-tiet-viec-lam.js` update the breadcrumb title defensively. `scratch/verify_chi_tiet_suite.js` already measures the related-list layout.
- Footprint: four root/public HTML/CSS/JS mirrors, the existing browser test, and required documentation/memory records. No dependency, data, routing, API, or irreversible change.
- Keep the “Việc làm liên quan khác” header inset and keep internal card padding; only remove the gap between each card’s outer edge and the related-list container.
- Removed the breadcrumb markup and its inline styling from both HTML mirrors, removed the obsolete breadcrumb title update from both JavaScript mirrors, and set horizontal related-feed padding to zero in both the base stylesheet and the page-level override. Raised the stylesheet cache key to `v=13.1_detail_list_flush`.
- Extended `scratch/verify_chi_tiet_suite.js` with hard assertions, corrected its CDP result access, and added a 375px layout check.

### Layout and Verification Matrix

| Scenario | Expected behavior | Actual result |
|---|---|---|
| Desktop related list | Cards align to both feed edges | Card/feed widths both 458px; horizontal padding 0px — PASS |
| Mobile 375px | Preserve flush alignment without overflow | Card/feed widths both 333px; horizontal padding 0px — PASS |
| Related-list header | Keep readable title inset | Existing header padding retained — PASS |
| Card content | Keep logo/text breathing room | Internal card padding unchanged — PASS |
| Breadcrumb | Remove the entire trail below search | Breadcrumb absent from the DOM — PASS |
| Search/category/sticky regressions | Preserve existing controls | Search, clear, category modal, and sticky checks PASS |
| Source/public parity | Keep HTML/CSS/JS mirrors synchronized | SHA-256 parity — PASS |
