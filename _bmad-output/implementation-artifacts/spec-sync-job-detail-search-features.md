---
title: 'Synchronize Job Detail search-bar features'
type: 'feature'
created: '2026-10-06'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Job Detail page displays the shared search bar, category modal, and location picker, but its search-suggestion behavior is an older reduced implementation. It lacks the current Job List/Homepage keyword suggestions, popular keywords, recommended jobs, structured history controls, consistent positioning, accessibility state, and coordinated popup behavior.

**Approach:** Bring the Job Detail search interaction to feature parity with the current canonical search experience while preserving its detail-page layout and redirecting every submitted search to `viec-lam.html` with the selected keyword, location, category, and industry parameters.

</frozen-after-approval>

## Implementation Notes

- Code map: `js/chi-tiet-viec-lam.js` contains the reduced search controller to replace; reuse its existing `normalizeText`, `JOBS_DATA`, category event wiring, sticky controller, and toast utility. `js/viec-lam.js` lines around the `RECENT SEARCHES & SUGGEST DROPDOWN` block are the canonical feature reference. `css/viec-lam.css` and `css/home.css` already provide the rich popup presentation loaded by Job Detail. `chi-tiet-viec-lam.html` and its public mirror contain the form, location picker, modal, stylesheet/script cache keys, and empty popup host.
- Footprint: the root/public Job Detail JavaScript and HTML mirrors, one focused browser regression test, and project-required memory/implementation documentation. No new dependency, API, data migration, deployment, or irreversible operation.
- Preserve native query semantics and the Job Detail URL until a user submits a search. Use `easycv_recent_searches_v2` so history is shared consistently across Homepage, Job List, and Job Detail.
- Added `js/job-detail-search.js` and its public mirror as the canonical Job Detail search controller. The legacy inline controller is guarded as a fallback, preventing duplicate event handlers while retaining resilience if the new module is omitted.
- Updated both Job Detail HTML mirrors to load current shared styles and the new controller with cache-busting keys. Added `scratch/verify_job_detail_search_sync.js` for root/public, desktop/mobile, interaction, accessibility-state, persistence, popup coordination, and redirect coverage.

### Feature and Verification Matrix

| Scenario | Expected behavior | Actual result |
|---|---|---|
| Empty keyword focus | Show structured history, popular keywords, and recommended jobs | 5 history rows, 6 popular keywords, and 5 recommended jobs — PASS |
| Typing `Product` | Switch to keyword suggestions and highlight the matching text | 2 matching suggestions with highlighted `Product` — PASS |
| Shared history | Store submitted searches under `easycv_recent_searches_v2` | Submitted keyword appears first after returning to Job Detail — PASS |
| Search submission | Redirect to Job List with keyword, location, category, and industry | All four query parameters preserved — PASS |
| Popup coordination | Category and search popups must not overlap | Category trigger closes suggestions and opens the category modal — PASS |
| Accessibility state | Expose dialog semantics and expanded state | `role=dialog` and `aria-expanded` synchronize — PASS |
| Mobile 375px | Popup remains fully within the viewport | Popup measured 335px wide from x=20 to x=355 — PASS |
| Public mirror | Load the same controller and popup structure | Public route opens with 5 recommended jobs — PASS |
| Source/public parity | Root and public files remain identical | SHA-256 parity — PASS |
