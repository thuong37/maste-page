# Industry Filter in the Hero Search Bar

## Decision

EasyCV now exposes the existing five-page industry taxonomy through a dedicated `Danh mục nghề` control at the beginning of the hero search bar. The picker follows the supplied reference while using EasyCV orange (`#F97316`), Inter typography, the existing 60px search bar, and the current keyword-based search contract.

The picker uses single selection because the current result page accepts one keyword string. Users may select either an industry group or a specific role/specialty; applying the selection fills the keyword input and leaves the final search action under the existing `Tìm việc ngay` button.

## Change Matrix

| Area | Previous state | Implemented solution | Result |
|---|---|---|---|
| Search entry point | Keyword and location only | Added accessible industry trigger before the keyword field | Industry discovery is visible without focusing the keyword input |
| Industry taxonomy | Complete data and renderer existed but were hidden | Reused `INDUSTRY_PAGES`, category paging, and role rendering | No duplicate taxonomy or inconsistent labels |
| Picker interaction | Industry roles immediately submitted search in a hidden legacy panel | Added pending/applied selection, search, clear, cancel, apply, outside-click, and Escape behavior | Reference-like filter workflow with reversible choices |
| Accessibility | Hidden panel had no dedicated trigger state | Added `aria-expanded`, `aria-controls`, pressed states, live selection status, labels, and visible orange focus rings | Keyboard and assistive-technology state is exposed |
| Responsive layout | Search controls stacked on mobile but no industry entry | Trigger becomes full-width; picker uses scrollable single-column navigation and sticky actions | No horizontal overflow at 390px |
| Static deployment | Root and `public/` copies require manual synchronization | Updated and hash-checked both copies | Local and deployed builds remain identical |

## Files Updated

- `index.html`, `public/index.html`
- `css/home.css`, `public/css/home.css`
- `js/home.js`, `public/js/home.js`
- `_bmad-output/implementation-artifacts/spec-industry-filter-search-bar.md`
- `_bmad-output/planning-artifacts/.memlog.md`

## Verification

- `node --check js/home.js` and `node --check public/js/home.js`: passed.
- Python standard-library HTML parser against `index.html`: passed.
- SHA-256 hashes for each root/public HTML, CSS, and JavaScript pair: identical.
- `node scratch/test_industry_filter.js` with local headless Chrome: passed desktop open/select/apply checks and mobile 390x844 responsive checks.
- Desktop result: picker opened at 595px height; role selection enabled Apply; applying `Frontend ReactJS` populated the keyword field and closed the picker.
- Mobile result: viewport width and document scroll width both measured 390px; trigger width was 340px, picker width was 358px, and footer controls remained rendered.
- Screenshots: `scratch/industry_filter_desktop.png` and `scratch/industry_filter_mobile.png`.
