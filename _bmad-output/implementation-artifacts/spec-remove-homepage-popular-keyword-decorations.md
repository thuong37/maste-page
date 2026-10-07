---
title: 'Remove homepage popular-keyword decorations'
type: 'refactor'
created: '2026-10-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['_bmad-output/planning-artifacts/prd.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The homepage “Ngành nghề & từ khóa phổ biến” section includes the unnecessary “Cập nhật mỗi 15 phút” label and decorative fire emojis on selected keyword chips.

**Approach:** Remove the update label and every fire-icon element from this homepage section while preserving the keyword text, job counts, links, layout, and root/public parity.

</frozen-after-approval>

## Implementation Notes

- Removed the “Cập nhật mỗi 15 phút” metadata from the popular-keywords header in both homepage builds.
- Removed all four decorative fire emoji elements while preserving chip labels, counts, links, and data attributes.
- Removed the now-unused `.keyword-hot-icon` CSS rule and the empty invisible header SVG so no decorative placeholder leaves extra leading space; kept root/public HTML and CSS synchronized.
- PRD reconciliation: this presentation-only cleanup preserves FR-7's encoded keyword-search navigation contract and does not alter the PRD's required homepage discovery or search behavior.

| Surface | Defect / Root Cause | Technical Resolution | Verification | Result |
|---------|---------------------|----------------------|--------------|--------|
| Popular-keyword header | A hard-coded freshness claim adds unnecessary metadata. | Remove the metadata span from both homepage builds. | Scoped source assertion and rendered DOM check. | PASS |
| Keyword chips | Four decorative emoji spans add visual noise and inconsistent platform rendering. | Remove all fire spans and the orphaned `.keyword-hot-icon` rule. | Assert no fire markup/selector and retain all 12 chips. | PASS |
| Header alignment | An invisible placeholder SVG still reserves 18px plus gap spacing. | Remove the dead SVG from both homepage builds. | Rendered desktop/mobile bounds check. | PASS |
| Search interaction | Cleanup must not change keyword navigation. | Preserve each anchor's `data-keyword` and existing click handler. | Intercept every rendered chip click and compare the encoded target URL. | PASS |
| Static build parity | Root and deployable files can drift. | Apply identical HTML/CSS edits in root and `public/`. | SHA-256 byte-parity checks. | PASS |

## Review Triage Log

- `medium` — Confirmed the invisible header SVG reserved unnecessary leading space; patched by removing it from root and public HTML, then verified zero header SVGs at 1440px and 375px.
- `false` — `status: 'in-progress'` was required during implementation and review; it is now correctly finalized as `done` after all review findings were triaged.
- `medium` — Confirmed that the artifact needed structured defect, solution, and evidence reporting; patched with the implementation matrix above.
- `medium` — Confirmed the initial checks did not render the UI or exercise click navigation; added and passed `scratch/verify_homepage_keyword_cleanup.js` for all 12 chips at 1440px and 375px.
- `medium` — Confirmed the artifact lacked an explicit PRD reconciliation note; patched with an FR-7 trace showing the encoded keyword-navigation contract remains intact.

