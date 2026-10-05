# Saved Job Filters — Implementation Record

## Implementation design

- The existing URL query remains the canonical filter state. Snapshots allow only `keyword`, `location`, `category`, `industry`, `exp`, `salary`, `level`, `type`, and `saturday`; navigation-only keys such as `jobId`, view, sort, and pagination are excluded.
- Browser persistence uses the versioned `easycv_saved_job_filters_v1` record: `{ version: 1, filters: [...] }`. Each filter has a generated stable ID, trimmed name, sanitized parameters, and creation timestamp.
- Applying a saved filter replaces the supported URL criteria and delegates state/UI/result synchronization to the existing `syncStateFromUrl()` and filtering engine.
- The modal implements semantic dialog labelling, focus containment, Escape/backdrop/close-button dismissal, trigger focus restoration, inline validation, and inline delete confirmation.
- Source files and deployable `public/` mirrors remain byte-for-byte synchronized.

## Defect and solution matrix

| Scenario / defect | Technical solution | Result |
|---|---|---|
| Empty criteria | Disable save action, provide an explanatory title, and revalidate on submit | No record is written |
| Blank or overlong name | Trim, enforce 1–60 characters, show inline Vietnamese error, retain input focus | Invalid submissions are blocked |
| Duplicate names | Identity and deletion use generated IDs instead of names | Duplicate display names remain safe |
| Invalid or corrupt storage | Parse defensively and normalize version, record shape, IDs, names, and allowlisted parameters | Page boot and dialog remain usable with an empty collection |
| Applying after filters changed | Build a new query from the saved allowlist, replace URL state, then run existing state synchronization | URL, filter pills, and results update together |
| Accidental deletion | Render row-level cancel/confirm controls before mutation | Cancel is non-mutating; confirm removes only the selected ID |
| Keyboard/modal accessibility | Trap Tab focus, handle Escape, label the dialog, restore trigger focus, and add visible focus styles | Keyboard-only workflow is supported |
| Mobile presentation | Use a bottom-sheet layout at 640px and below with 44px controls | Verified at 375px |
| Styles ignored after mobile scrollbar rules | Close a pre-existing unterminated CSS rule before the responsive section | Saved-filter styles parse and touch targets render correctly |

## Verification evidence

- `node --check js/viec-lam.js` — passed.
- `node --check public/js/viec-lam.js` — passed.
- `node --check scratch/verify_saved_job_filters.js` — passed.
- `node scratch/verify_saved_job_filters.js` — passed all 18 browser assertions: five-criterion save, stable IDs and duplicate names, refresh persistence, invalid names, apply/replace behavior, transient/invalid-key exclusion, text-only rendering, cancel/confirm delete, Escape/focus restoration, corrupt storage, empty criteria, and 375px layout.
- `git diff --no-index -- js/viec-lam.js public/js/viec-lam.js` — no differences.
- `git diff --no-index -- css/viec-lam.css public/css/viec-lam.css` — no differences.
- `git diff --no-index -- viec-lam.html public/viec-lam.html` — no differences.

## Residual risk

- Persistence is intentionally browser-local and does not synchronize across devices or accounts.
- Browser automation covered Chromium; static parity and standards-based APIs reduce, but do not eliminate, cross-browser rendering risk.
