---
title: 'Add navigation controls to the CV discovery carousel'
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

**Problem:** The “Khám phá CV” carousel auto-rotates but has no explicit previous/next controls beside “Xem tất cả”, so users cannot intentionally browse its cards in either direction.

**Approach:** Add two compact circular arrow buttons next to “Xem tất cả” and connect them to the existing carousel track so each activation moves one visible CV card backward or forward. Preserve filtering, auto-rotation, responsive layout, dark mode, reduced-motion behavior, keyboard access, and synchronized source/public assets.

</frozen-after-approval>

## Implementation Notes

- Added a right-aligned header action group containing “Xem tất cả” plus previous/next circular controls in `index.html` and `public/index.html`; the controls use native buttons, SVG chevrons, accessible names, `aria-controls`, and a labelled group.
- Extended `css/home.css` and `public/css/home.css` with EasyCV light/dark interaction states, visible keyboard focus, stable non-shifting press feedback, and a sub-480px three-row header layout.
- Extended `js/home.js` and `public/js/home.js` with bidirectional one-card movement, reduced-motion handling, transition cancellation/guarding, hidden-slide focus management, and polite announcements for manual navigation.
- Preserved automatic forward rotation and filter behavior. Filtering now cancels any in-flight movement before rebuilding the track, preventing stale cards from being reinserted.

| Defect / risk | Technical resolution | Verification |
|---|---|---|
| No manual CV-card navigation | Added previous/next controls wired to the existing infinite track | Structural assertions and desktop/mobile render checks passed |
| Filter used during an active transition | Added cancellable transition handlers and fallback timer cleanup | Review trace and JS syntax checks passed |
| Child transitions could prematurely finish track movement | Restricted completion to the track's `transform` event | Static assertion passed |
| Offscreen duplicate links remained keyboard-focusable | Recalculate visible cards and synchronize `tabindex`/`aria-hidden` after builds, moves, and resize | Accessibility-hook assertion passed |
| Narrow header could overflow | Move the action group and filters onto separate rows below 480px | 375px headless render passed |
| Source/public drift | Applied mirrored edits to all HTML, CSS, and JS pairs | SHA-256 parity passed for all three pairs |

## Review Triage Log

- `medium` — Filtering during an active transition could reinsert a stale card; patched by cancelling listeners/timers before `replaceChildren()`.
- `medium` — Bubbled child `transitionend` events could finish movement early; patched by checking the event target and property.
- `low` — The control wrapper lacked group semantics; patched with `role="group"` and its existing accessible label.
- `medium` — Offscreen cloned links remained in keyboard order; patched with visible-slide `tabindex` and `aria-hidden` synchronization.
- `low` — Manual navigation had no screen-reader result feedback; patched with a polite live status updated only for manual movement.
- `medium` — The compact header could overflow on very narrow viewports; patched with a dedicated 480px layout.
- `medium` — The implementation artifact was incomplete during review; resolved by this defect matrix, implementation record, and completed status.
- `medium` — The mandatory memory record was absent during review; resolved in `_bmad-output/planning-artifacts/.memlog.md`.

