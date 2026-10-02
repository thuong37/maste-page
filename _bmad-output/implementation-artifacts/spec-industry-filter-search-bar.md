---
title: 'Add industry filter to the hero search bar'
type: 'feature'
created: '2026-10-02'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
  - '{project-root}/design-system/easycv/MASTER.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The EasyCV hero search bar exposes keyword and location controls but does not provide the prominent industry/category entry point shown in the supplied reference, even though the repository already contains a hidden multi-page industry data set and mega-menu renderer.

**Approach:** Add an accessible “Danh mục nghề” trigger at the start of the search bar and present a responsive industry picker based on the reference image. Reuse the existing industry taxonomy and search submission flow, preserve the current EasyCV orange visual identity, and keep the root and `public/` static builds synchronized.

</frozen-after-approval>

## Implementation Notes

- Reused the existing `INDUSTRY_PAGES`, pagination, category navigation, and role renderer rather than introducing a second taxonomy.
- Added a leading search-bar trigger and an orange-branded picker mode with category/role single selection, in-panel search, clear/cancel/apply actions, Escape/outside-click dismissal, visible focus styles, and mobile stacking.
- Applying a selection populates the existing keyword field so the established `viec-lam.html?keyword=...&location=...` submission contract remains unchanged. Editing or clearing that keyword also clears the industry label to prevent misleading state.
- Kept `index.html`, `css/home.css`, and `js/home.js` byte-identical with their `public/` mirrors.
- Verified JavaScript syntax, HTML parsing, mirrored hashes, desktop interaction, and 390px responsive behavior. The local `ui-ux-pro-max` stack search had no verified popover-specific match after one retry, so the implementation follows the repository design system and verified accessibility guidance for visible focus and unobscured controls.

