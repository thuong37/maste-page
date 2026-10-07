---
title: 'Paginate popular industries as two-row groups'
type: 'bugfix'
created: '2026-10-07'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The popular-industries carousel currently collapses the cards into one row and advances one card at a time. The section must keep two rows of cards and change the complete visible group when either arrow is selected.

**Approach:** Render the industry cards as responsive two-row pages, then move the carousel by one full page per interaction. Keep the existing arrow placement, progressive fallback, keyboard access, visible focus treatment, and mirrored public assets.

</frozen-after-approval>

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `node --check js/home.js` and `node --check public/js/home.js` — expected: both scripts parse successfully.
- `git diff --check` — expected: no whitespace errors.
- Compare root/public file hashes — expected: each mirrored pair is byte-identical.

**Manual checks:**
- At desktop, tablet, and mobile widths, the active industry page has exactly two rows and each arrow changes the whole visible group.
- Only cards on the active page are exposed to keyboard and assistive-technology navigation.
