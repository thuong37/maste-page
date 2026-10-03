---
title: 'Highlight popular search keywords in category modal'
type: 'feature'
created: '2026-10-03'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context: ['_bmad-output/planning-artifacts/prd.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The aligned “Được tìm kiếm nhiều” row still blends into the surrounding category content and does not attract enough attention.

**Approach:** Highlight the row as a branded recommendation area with a subtle EasyCV orange surface, stronger label hierarchy, refined chip borders, dark-mode parity, and a visible keyboard-focus state without implying that every keyword is selected.

</frozen-after-approval>

## Implementation Notes

- Highlighted the entire recommendation row with a subtle orange gradient, a 3px EasyCV-orange inset accent, and a warmer divider so the section reads as a distinct recommendation area.
- Increased the label hierarchy to orange `#C2410C` at weight 800 and refined keyword chips to white surfaces with orange-tinted borders at weight 600; hover adds a stronger orange border and restrained shadow.
- Added a dedicated 2px orange `:focus-visible` outline and dark-mode equivalents without adding selected-state semantics to the suggestion chips.
- Synchronized root/public CSS, raised all stylesheet consumers to `v=1.2_highlight`, and extended the browser test to assert light/dark colors, keyboard-focus CSS, alignment, selection flow, and responsive overflow.
- Headless Chrome verification passed at 1440px, 900px, and 390px; the final light-mode screenshot was visually inspected after theme transitions settled.
- Validated the treatment against PRD FR-6 (HOT position discovery) and the WCAG 2.1 AA accessibility requirement; interactive chip borders and keyboard focus indicators maintain at least 3:1 contrast.

