---
title: 'Anchor Job List search suggestions below the keyword box'
type: 'bugfix'
created: '2026-10-05'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** On the Job List page, focusing or clicking the keyword field opens the suggestion popup below the filter bar instead of immediately below the search box. The filter bar is currently nested inside the popup's positioning ancestor, so `top: 100%` includes both search and filter content.

**Approach:** Close the search wrapper immediately after the suggestion popup in both source and public HTML mirrors, leaving the top filter bar as a following sibling. Preserve the existing suggestion content, JavaScript behavior, responsive rules, search/filter interactions, and EasyCV styling.

</frozen-after-approval>

## Implementation Notes

- Root cause confirmed in `viec-lam.html` and `public/viec-lam.html`: `#topFilterBar` is inside `#heroSearchStickyBar`, while two closing tags appear only after the saved-filter dialog.
- Move those two structural closing tags to immediately after `#searchSuggestDropdown`; do not alter popup sizing or filtering logic.
- Verify source/public parity, DOM ancestry, JavaScript syntax, desktop placement, and 375px behavior.
- Review showed that moving the filter outside the sticky container would regress the established sticky-filter behavior. The final implementation preserves the DOM and instead calculates `--search-suggest-top` from the search form's bottom edge.
- Updated `css/viec-lam.css`, `js/viec-lam.js`, and their `public/` mirrors; added `scratch/verify_job_list_suggest_anchor.js` to lock the anchor relationship.
- Verification passed with an exact 8px popup gap in normal desktop, sticky desktop, and emulated 375px mobile states. The popup stayed within the viewport, remained open, and the filter remained inside the sticky container in all cases.
- JavaScript syntax, whitespace checks, and source/public SHA-256 parity passed.

## Review Triage Log

- `high / patch` — The proposed DOM move would break sticky-filter selectors and behavior; replaced it with a computed popup top offset while preserving ancestry.
- `false` — The stale sticky-height comment concern no longer applies because the DOM move was reverted.
- `false` — The reported mobile overflow came from a Chrome outer-window screenshot; CDP device metrics at an actual 375px viewport passed popup containment and anchor assertions.
- `low / patch` — Added an exact 8px acceptance measurement to the automated verification and implementation record.
- `medium / patch` — Added automated coverage for the open popup in sticky mode instead of relying on a closed-popup screenshot.
- `low / patch` — Recorded reproducible assertions and outcomes in this artifact.
- `medium / patch` — Added `scratch/verify_job_list_suggest_anchor.js` to enforce DOM ancestry and coordinates across normal, sticky, and mobile states.
- `false` — `in-progress` was correct during review; status changed to `done` only after review and verification completed.
- `false` — The source file contains a valid UTF-8 em dash; mojibake was caused by PowerShell display decoding.
- `medium / patch` — Added the required decision, action, and verification entries to `.memlog.md`.
- `low / patch` — Restored the five overwritten PNG files so no unrelated binary changes remain.
- `low / patch` — Removed the irrelevant screenshot changes rather than treating them as acceptance evidence.
