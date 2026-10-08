---
title: 'Open homepage job titles in canonical job detail'
type: 'bugfix'
created: '2026-10-08'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Clicking a job name on the homepage can run a search or navigate with a stale homepage-only ID, so the requested job detail is not opened. For example, “Senior Product Designer (UI/UX App/Web)” is ID `12` in the homepage recommendation pool but canonical ID `3` in the shared detail dataset.

**Approach:** Use the shared job dataset as the source of truth for homepage detail links, include the encoded job title and current homepage keyword in the URL, and navigate in the same tab while retaining semantic link behavior.

</frozen-after-approval>

## Implementation Notes

- Loaded `js/jobs-data.js` before `js/home.js` on the homepage so detail navigation resolves against `window.EASYCV_JOBS`, the same catalog consumed by the job-detail page.
- Added `buildJobDetailHref(job, keyword)` to resolve canonical IDs by normalized title plus company (with a unique-title fallback) and produce `id`, encoded `title`, and live `keyword` parameters. Unknown titles omit the unsafe local ID and still navigate by title, allowing the detail page's existing fallback behavior.
- Converted recommended-job results from search actions into semantic same-tab detail links, removed duplicate handlers that previously redirected to Job List, and updated visible featured-job title/card/detail links to use the same builder.
- Preserved keyboard focus visibility and removed default anchor underlines without changing the existing EasyCV color tokens or layout.
- Synchronized `index.html`, `js/home.js`, and `css/home.css` with their `public/` mirrors. Added `scratch/verify_homepage_job_detail_navigation.js` as a focused browser regression check.

### Defect and Verification Matrix

| Defect | Root cause | Technical resolution | Verification | Result |
|---|---|---|---|---|
| Recommended job name opened search results | Three click handlers called `executeSearch()` | Replace the recommendation with a semantic detail link and remove obsolete duplicate handlers | Headless Chrome clicked the recommendation from the homepage | PASS |
| Product Designer opened the wrong detail record | Homepage pool used stale ID `12`; canonical dataset uses ID `3`; detail page prioritizes ID | Resolve ID by normalized title from `window.EASYCV_JOBS` | URL contains `id=3`; rendered `#jdTitle` matches the clicked job | PASS |
| Search context was lost | Detail URL did not carry the active homepage keyword | Append the live keyword with `URLSearchParams` encoding | URL contains `keyword=Marketing+Leader` | PASS |
| Title/card handlers could compete | The job-card click handler also handled title clicks | Stop title-click bubbling and explicitly exclude `.job-title` from the card handler | Exact detail URL remains stable after click | PASS |
| Source and deployable copies could diverge | Root and `public/` are maintained as mirrors | Apply identical HTML, JS, and CSS changes to both trees | SHA-256 hashes match for all three pairs | PASS |

### Test Results

- `node --check js/home.js` and `node --check public/js/home.js`: PASS.
- `node --check scratch/verify_homepage_job_detail_navigation.js`: PASS.
- `git diff --check`: PASS.
- Headless Chrome at `http://localhost:8765`: PASS; recommended and featured titles are same-tab semantic links, and the final URL was `chi-tiet-viec-lam.html?id=3&title=Senior%20Product%20Designer%20(UI%2FUX%20App%2FWeb)&keyword=Marketing+Leader` with the correct rendered detail title.

## Review Triage Log

- `medium / defer` — Most pre-existing homepage records do not yet exist in the canonical detail catalog, so unmatched records use the detail page's established title fallback; recorded a catalog-reconciliation task in `deferred-work.md` rather than expanding this navigation fix into a data migration.
- `medium / patch` — Title-only resolution could select the wrong employer when duplicate titles exist; changed matching to title plus company and only falls back to title when it is unique.
- `medium / defer` — The 120 featured-job records share the same pre-existing catalog gap as recommendations; grouped with the catalog-reconciliation deferred item. The current change improves their former not-found behavior by passing the clicked title.
- `false` — The requested sample explicitly requires `keyword` in the URL; restoring a detail-page search field or return journey was not requested or claimed by the frozen intent.
- `false` — Different cache-buster strings do not change the underlying `jobs-data.js` file, which was not edited; the browser regression loaded both pages and resolved/rendered canonical ID `3` correctly.
- `low / patch` — The first test covered only the requested recommendation route; extended it to assert semantic same-tab recommendation and featured-title links in addition to the exact navigation/render result.
- `low / rejected` — The test's local Chrome/server assumptions match the repository's existing browser-test convention and the supplied running URL; making it a portable test harness is disproportionate to this scoped fix.
- `false` — `in-progress` was the required workflow state during review; this finalization changes the spec to `done`.

