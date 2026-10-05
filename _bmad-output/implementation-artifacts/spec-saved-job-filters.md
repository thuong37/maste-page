---
title: 'Save and manage job-list filters'
type: 'feature'
created: '2026-10-05'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '050ec9d947235f381655648f0e21a04569a5a2f0'
context:
  - '_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Candidates on `viec-lam.html` can build a useful combination of job-search criteria, but cannot name, retain, or reuse it. Recreating the same filters across visits adds friction to repeated job discovery.

**Approach:** Add a “Save filter” action and a compact saved-filter management dialog. Persist named snapshots of the page’s canonical filter query parameters in browser storage; users can apply or delete any saved snapshot without introducing a second filtering engine.

## Boundaries & Constraints

**Always:** Preserve the current EasyCV orange/light visual system and Inter typography; support desktop and mobile; use semantic buttons, visible keyboard focus, dialog labelling, Escape/backdrop close, focus restoration, and a delete confirmation state. Treat the existing URL query representation as the source of truth. Keep source and `public/` copies synchronized. Saved filters must survive refreshes in the same browser, use generated stable IDs, and display the saved criteria in human-readable Vietnamese.

**Never:** Do not add backend/account synchronization, packages, authentication changes, browser alerts, or changes to the current job matching behavior. Do not save transient navigation state such as `jobId`, view mode, sort order, or pagination. Do not overwrite unrelated uncommitted changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Save current filter | At least one supported criterion is active and the user enters a trimmed name | A named snapshot is stored, rendered immediately, and remains after refresh | Duplicate names remain valid because records use stable IDs |
| Empty filter | No supported criterion is active | Save action is disabled and explains that a criterion is required | No record is written |
| Invalid name | Empty/whitespace-only name or more than 60 characters | Submission is blocked with an inline Vietnamese validation message | Focus remains on the name field |
| Apply saved filter | User activates a valid saved item | Current supported criteria are replaced, URL/state/UI synchronize, dialog closes, and results refresh | Unknown/invalid parameters are ignored safely |
| Delete saved filter | User requests deletion and confirms | Only the selected stable-ID record is removed | Cancel restores the normal row without mutation |
| Corrupt storage | Stored JSON is missing or malformed | Dialog shows an empty state and remains usable | Recover with an empty collection; do not break page boot |

</frozen-after-approval>

## Code Map

- `viec-lam.html` — existing `#topFilterBar`; add the save/manage trigger, accessible dialog markup, form, list, empty state, and delete-confirmation affordance near the filter controls.
- `js/viec-lam.js` — reuse `applyJobFilters`, `syncStateFromUrl`, `updateFilterPillUI`, and existing URL parameters; add storage normalization, canonical snapshot capture, rendering, apply/delete operations, and dialog focus handling.
- `css/viec-lam.css` — extend existing filter tokens and responsive breakpoints with the toolbar action, dialog, saved-item summaries, validation, focus-visible, dark-mode, and mobile rules.
- `public/viec-lam.html`, `public/js/viec-lam.js`, `public/css/viec-lam.css` — synchronized deployable mirrors; no independent behavior.
- `_bmad-output/planning-artifacts/.memlog.md` — append decision, changed files, and verification results required by project operations.
- `_bmad-output/implementation-artifacts/saved-job-filters.md` — record implementation design, defect/solution matrix, and test evidence after delivery.

## Tasks & Acceptance

**Execution:**
- [x] `viec-lam.html` and `public/viec-lam.html` — add semantic save/manage controls and dialog structure adjacent to the active filter bar.
- [x] `js/viec-lam.js` and `public/js/viec-lam.js` — implement versioned local persistence, canonical query snapshots, validation, apply/delete flows, safe recovery, and accessible dialog behavior.
- [x] `css/viec-lam.css` and `public/css/viec-lam.css` — style the feature consistently across responsive and dark themes with stable interaction states.
- [x] Artifact files — document the feature, implementation matrix, and test results; append the mandatory memory log entries.
- [x] Verification — syntax-check JavaScript and exercise save, refresh persistence, apply, cancel/confirm delete, corrupt storage, keyboard, mobile, and source/public parity scenarios.

**Acceptance Criteria:**
- Given the URL contains `exp=under1&salary=10-15&level=junior&type=hybrid&saturday=off_sat`, when the user saves a valid name, then the named filter appears with all five criteria and survives refresh.
- Given a saved filter exists, when the user applies it after changing the page filters, then its criteria replace the current criteria and the URL, filter pills, and result ordering update together.
- Given a saved filter exists, when the user confirms deletion, then only that filter disappears and does not return after refresh.
- Given keyboard-only use, when the dialog is opened and closed, then focus is visible, contained while open, Escape closes it, and focus returns to the trigger.

## Implementation Notes

- Added a versioned `easycv_saved_job_filters_v1` localStorage schema and defensive normalization for malformed, stale, duplicate-ID, empty, or unsupported records.
- Reused the existing URL/state synchronization path; saved filters do not introduce a second filtering engine.
- Fixed an existing missing CSS closing brace immediately before the responsive section because it prevented the new saved-filter styles from parsing.

## Spec Change Log

## Review Triage Log

## Design Notes

Use one primary toolbar action that opens a dialog. In the dialog, the first section names and saves the current criteria; the second section lists saved presets with a prominent “Apply” action and a quieter delete icon. A row-level inline confirmation avoids a disruptive browser confirmation dialog and prevents accidental deletion.

## Verification

**Commands:**
- `node --check js/viec-lam.js` — expected: exit code 0.
- `node --check public/js/viec-lam.js` — expected: exit code 0.
- `git diff --no-index js/viec-lam.js public/js/viec-lam.js` — expected: no differences.
- `git diff --no-index css/viec-lam.css public/css/viec-lam.css` — expected: no differences.

**Manual checks:**
- Verify the feature at 375px, tablet, and desktop widths, plus keyboard focus order and Escape behavior.
- Verify names/criteria render as text (not HTML), invalid storage does not stop the page, and applying a preset updates the canonical URL.

**Result:** All listed commands passed. `scratch/verify_saved_job_filters.js` passed 18 Chromium assertions across the full I/O matrix, duplicate names, text-only rendering, keyboard focus restoration, invalid/transient-parameter exclusion, and the 375px responsive layout. See `saved-job-filters.md` for the implementation and evidence matrix.
