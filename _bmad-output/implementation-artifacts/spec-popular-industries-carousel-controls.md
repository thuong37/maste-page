---
title: 'Replace the popular-industries view-all link with carousel controls'
type: 'feature'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The “Ngành nghề & từ khóa phổ biến” header shows a “Xem tất cả 45 ngành nghề” link, while the user wants only the same two compact navigation controls used by the CV discovery carousel.

**Approach:** Remove the view-all link, add accessible previous/next circular controls in its place, and convert the eight popular-industry cards into a responsive, manually navigable infinite carousel. Keep the keyword cloud below unchanged and synchronize source/public files.

</frozen-after-approval>

## Implementation Notes

- Removed the “Xem tất cả 45 ngành nghề” link and replaced it with two native circular arrow buttons that visually match the CV carousel controls.
- Wrapped the eight industry cards in a progressive-enhancement carousel: the original responsive grid remains available before/without JavaScript, while `.is-carousel-ready` enables an infinite one-card-at-a-time track.
- Desktop shows four cards, tablet shows two, and small screens show one. The keyword cloud below the industry cards is unchanged.
- Added reduced-motion handling, guarded transition completion, visible-card `tabindex`/`aria-hidden` synchronization, focus preservation, accessible control names, and a live announcement describing the visible card range.

| Defect / risk | Technical resolution | Verification |
|---|---|---|
| Obsolete industry view-all link | Removed the link and added previous/next controls | Scoped DOM assertion passed |
| Industry cards could not be manually browsed | Added bidirectional infinite track movement | CDP click test moved the first card and updated the live range |
| Carousel could hide content if JavaScript fails | Carousel styles activate only after JS adds `.is-carousel-ready`; fallback remains the original grid | Computed-style and source inspection passed |
| Offscreen cards could remain keyboard-focusable | Synchronize `tabindex` and `aria-hidden` after load, resize, and navigation | CDP reported correct visible/hidden counts |
| Focus ring could be clipped | Added explicit focus styling and 6px viewport padding | Desktop/mobile headless render passed |
| Source/public drift | Mirrored HTML, CSS, and JS changes | SHA-256 parity passed for all three pairs |

## Review Triage Log

- `medium` — Small-screen global header stacking moved controls below the title; patched with a section-specific two-column grid.
- `medium` — CSS-only failure mode hid cards when JavaScript was unavailable; patched with an `.is-carousel-ready` progressive-enhancement gate.
- `medium` — Focus outlines could be clipped by the viewport; patched with explicit focus styling and sufficient inset.
- `medium` — A focused card could become hidden after navigation or responsive resizing; patched by transferring focus to the first visible card when necessary.
- `low` — The live message named only the first visible card; patched to announce the visible count and first-to-last range.
- `medium` — The implementation artifact was incomplete during review; resolved by this implementation record, defect matrix, test results, and completed status.
- `medium` — The mandatory memory entry was absent during review; resolved in `_bmad-output/planning-artifacts/.memlog.md`.

