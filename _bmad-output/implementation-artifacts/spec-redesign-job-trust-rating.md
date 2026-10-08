---
title: 'Redesign job trust rating'
type: 'feature'
created: '2026-10-08'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '_bmad-output/planning-artifacts/prd.md'
  - 'assets/design-tokens.css'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The five bordered emoji cards used to rate a job post's trustworthiness closely resemble TopCV's component and do not establish a distinctive EasyCV interaction.

**Approach:** Replace the card grid with a compact EasyCV-branded clarity meter: a connected five-point scale with numbered markers, concise labels, a live selected-state summary, and accessible radio/keyboard behavior. Preserve per-job local persistence and keep the root and `public/` site copies synchronized.

</frozen-after-approval>

## Implementation Notes

- Replaced the five bordered emoji cards with one connected five-point clarity meter. Numeric markers and concise labels distinguish every state without depending on emoji rendering or color alone.
- Added a branded header, anonymous-feedback cue, explanatory hint, and `aria-live` selected-state badge using only the current `--eb-primary-*` and `--eb-text-*` palette.
- Versioned persistence as `easycv_job_transparency_ratings_v2` so answers to the old mixed trust/clarity question are not silently reinterpreted. Added roving `tabindex` plus Arrow, Home, and End key behavior for the radio group.
- Updated `chi-tiet-viec-lam.html`, `css/chi-tiet.css`, and `js/chi-tiet-viec-lam.js`, synchronized their `public/` mirrors, and refreshed the detail CSS/JS cache key.

| Issue | Technical solution | Verification |
|---|---|---|
| TopCV-like five-card/emoji composition | Connected numbered scale with a distinct EasyCV visual hierarchy | Headless Chrome screenshot reviewed at 778px and 375px |
| Selection needed persistence and clear feedback | Added a versioned storage key and exposed a visible/live selected label | Selection `4 / Khá minh bạch` persisted across reload and was announced correctly |
| Radio controls lacked keyboard navigation | Roving focus with Arrow/Home/End selection | Browser automation selected index 4 with ArrowRight |
| Mobile labels could overflow | Five flexible columns, compact mobile typography, and adaptive header stacking | 375px viewport reported zero horizontal overflow |

- Independent review prompted corrections to local-only copy, measurement semantics, storage versioning, four contrast/focus states, mobile text layout, verifier coverage, and test portability. The final mobile treatment becomes a vertical connected scale for readable 12px labels and 44px targets.
- Verification: `node --check js/chi-tiet-viec-lam.js`, `git diff --check`, root/public SHA-256 parity, forbidden legacy-color/emoji scan, and `node scratch/verify_job_trust_rating.js` all passed. Browser automation covers click, Arrow, Home, End, roving focus, accessible metadata, persistence after reload, and 375px overflow.

## Review Triage Log

- `medium` — The original copy implied that local-only feedback reached EasyCV. Patched the eyebrow, hint, and toast to state that the private rating is stored on the current device.
- `medium` — The question and option details mixed clarity, completeness, and trust. Patched all wording around one measurable concept: job-post transparency and verifiability.
- `medium` — Reusing the old numeric storage key could reinterpret previous answers. Patched with the versioned `easycv_job_transparency_ratings_v2` key.
- `medium` — White 13px text on `--eb-primary-500` lacked AA contrast. Patched the selected marker to `--eb-primary-700`.
- `medium` — The 11px eyebrow used a low-contrast orange. Patched it to `--eb-primary-700`.
- `medium` — The replacement focus ring was below the 3:1 non-text threshold. Patched it to a 3px `--eb-primary-700` outline.
- `medium` — Unselected marker boundaries were below the 3:1 non-text threshold. Patched them to `--eb-text-300`.
- `medium` — Five 10px mobile labels in one row were cramped. Patched mobile to a connected vertical scale with 12px labels and 44px minimum targets.
- `low` — Persistence verification did not reload the page. Patched the browser test to reload and assert restored selection, status, and roving tabindex.
- `low` — Accessibility coverage checked only ArrowRight. Patched coverage for click, ArrowDown/Right, Home/End, focus movement, one-tab-stop behavior, accessible labels, descriptions, and the live region.
- `low` — The verifier hard-coded workspace, Chrome, and debugging-port assumptions. Patched workspace resolution, OS temp profile cleanup, environment overrides, and a process-derived default port.
- `low` — Component shadows embedded palette RGB values. Patched them to the semantic `--color-primary-glow` and `--shadow-sm` tokens.
- `false` — The reviewer saw `status: in-progress` before workflow finalization; this was the required active state during implementation/review and is now correctly `done`.

