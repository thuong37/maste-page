---
title: 'Left-align all navbar dropdown items'
type: 'bugfix'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** On job-related pages, a generic `.dropdown-item` rule from the page stylesheet overrides the shared navbar layout and distributes each menu item's icon and label across the row, making navbar labels appear right-aligned.

**Approach:** Scope stronger alignment rules to the desktop navbar dropdowns so all four menu groups consistently place their icons and text from the left edge, while preserving right-side badges and leaving filter dropdowns unchanged.

</frozen-after-approval>

## Implementation Notes

- Added navbar-scoped alignment rules to `css/navbar.css` and `public/css/navbar.css` so later generic page-level `.dropdown-item` declarations cannot spread submenu labels across the row.
- Kept `.badge-pill { margin-left: auto; }` behavior intact, allowing optional status badges to remain at the right edge while icon and title alignment stays consistent.
- Added `scratch/test_navbar_submenu_alignment.js` to verify computed CSS across all navbar groups on all three pages.

| Surface | Root cause | Resolution | Result |
|---------|------------|------------|--------|
| Desktop navbar submenus on job pages | Page-level `.dropdown-item` applies `justify-content: space-between` after the navbar stylesheet | Navbar-scoped selectors restore `flex-start` and left text alignment | PASS |
| Optional submenu badges | Badge must remain visually separate from the title | Flexible content column preserves `.badge-pill { margin-left: auto; }` | PASS |
| Filter dropdown rows | Reused `.dropdown-item` class intentionally distributes labels/counts | Fix is scoped beneath `.navbar .dropdown-menu` | Unchanged |

- Verification: `git diff --check` passed; root/public navbar CSS SHA-256 hashes match; headless Chrome confirmed all four submenu groups use `justify-content: flex-start` and `text-align: left` on `index.html`, `viec-lam.html`, and `chi-tiet-viec-lam.html`.
