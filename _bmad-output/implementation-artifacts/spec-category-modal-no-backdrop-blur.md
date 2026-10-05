---
title: 'Remove background blur from the job category modal'
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

**Problem:** Opening the “Danh mục Nghề” popup on the job-list page currently blurs the surrounding interface, which conflicts with the requested presentation.

**Approach:** Remove the backdrop blur from this category popup while preserving its existing anchored layout, dimming layer, outside-click dismissal, z-index behavior, responsive behavior, and all category-selection interactions.

</frozen-after-approval>

## Implementation Notes

- Code map: `css/category-filter-modal.css` defines the shared source backdrop effect; `public/css/category-filter-modal.css` is its deployed mirror. Before this change, the shared `.category-modal-backdrop` rule applied both standard and WebKit `blur(4px)` declarations on every consuming page.
- Footprint: the two mirrored category-modal stylesheets and the two mirrored job-list HTML files. No new API, dependency, data mutation, deployment action, or irreversible change.
- Verification: confirm both CSS copies remain byte-identical, neither category backdrop rule applies blur, and the backdrop continues to receive pointer events for outside-click dismissal.
- Preserved the shared blur for homepage and job-detail consumers, then added a job-list-only `body.job-list-page` override that disables both standard and WebKit backdrop filtering. Added the page scope class and incremented the job-list stylesheet cache key in both HTML mirrors.
- Added `scratch/verify_category_no_blur.js`. Chrome headless verified desktop and 375px mobile no-blur rendering, retained dimming and outside-click dismissal, category selection, and unchanged blur on homepage and job-detail consumers.

## Review Triage Log

- `medium` — The original global CSS deletion affected homepage and job-detail consumers of the shared stylesheet. Patched with a `body.job-list-page` scope and verified the other pages retain `blur(4px)`.
- `medium` — The job-list HTML retained the previous stylesheet cache key. Patched both HTML mirrors with `v=1.3_job_list_no_blur`.
- `medium` — Static verification did not prove interactive and responsive behavior. Added and passed browser checks for open state, outside-click dismissal, category selection, 375px layout, and all shared stylesheet routes.
- `low` — The implementation note described the pre-change rule in present tense and the lifecycle status was stale. Clarified the wording and marked the spec done after verification.
