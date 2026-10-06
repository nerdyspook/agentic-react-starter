# Tasks

The latest user instruction authorizes completing all remaining milestones in one pass, superseding the earlier per-milestone review stops below. Preserve each acceptance criterion and keep unavailable checks open. Dummy JSON product data and deferral of responsive layouts are confirmed; the request to implement the current proposal carries forward the defaults in [proposal.md](proposal.md). Browser checks target desktop (baseline: 1280 x 800); no mobile or narrow-viewport/reflow acceptance is required. Desktop 200% zoom checks allow horizontal scrolling.

The latest request revises planning only: search is now required, the catalog expands, and pagination is explicitly numbered and always visible in every listing state. Completed milestone 1 checkboxes remain historical facts. Implementation is now authorized for all remaining tasks by the subsequent user request.

## 1. Foundation and data contract

Acceptance: direct routes and a consistent desktop Tailwind shell work; validated dummy JSON product data is available through custom hooks.

- [x] 1.1 Review remaining contract additions, demo currency, WebP interpretation, URL defaults, unit count, cart reload behavior, and checkout clearing; verify proposal/design/specs reflect accepted decisions before coding. Use the confirmed dummy JSON source and desktop-only scope.
- [x] 1.2 Integrate project-local Tailwind and React Router while preserving existing plugins; implement route shell, header, common components file, and fallback route. Verify `pnpm run check` and manually open/reload `/products`, `/products/example-slug`, `/cart`, and an unknown route; header initially shows 0.
- [x] 1.3 Add agreed catalog/detail fixtures, at least 25 products with useful category/price variation, local WebP assets, and request decoding with exact money conversion. Verify with Vitest normal, empty, malformed, duplicate-ID/slug, mismatched fixture, currency, decimal, zero-price, and unsafe-number cases; independently expect `19.99` to become 1999 and reject `19.999`.
- [x] 1.4 Implement the product API module and custom request hooks used by pages. Verify API success, HTTP failure, malformed payload, missing slug, and abort behavior with Vitest fetch stubs; manually throttle/block requests and navigate rapidly to verify hook loading, retry, cancellation, and stale-response handling.
- [ ] 1.5 Document the dummy JSON contract, desktop-only scope, and demo limitations in the project README, run `pnpm run check`, and record desktop keyboard, 200% zoom, and console checks for the shell separately from automated results. Verify only intended changes before stopping for review.

Milestone 1 implementation and documentation are delivered. Task 1.5 remains open solely for native 200% browser-zoom verification: the browser connection did not apply zoom shortcuts. Automated checks and the other desktop checks passed; see [verification.md](verification.md). Stop here for review before milestone 2.

## 2. Image cards, search, filters, and numbered pagination

Acceptance: a desktop card grid displays images/name/price and slug links; 49 products yield five numbered pages at 12/page; pagination stays visible in single-page, empty, loading, and error states, with unavailable navigation disabled. Search, separate filters, sorting, and page compose in the URL, including direct links/history and clear/reset actions. All [catalog scenarios](specs/product-catalog/spec.md) pass.

- [x] 2.1 Expand dummy JSON to 49 products while preserving existing IDs/slugs, with matching details and relevant local WebP assets. Ensure 25 products match `q=mug&category=home&minPrice=10&maxPrice=50`. Update the existing fixture-count assertions and README counts; verify Vitest catalog/detail/asset invariants and the new counts pass.
- [x] 2.2 Implement pure URL parse/serialize/update and search-filter-sort-pagination helpers used by `useProducts(query)`; retain the existing fetch lifecycle without refetching on query changes. Verify Vitest literal expected IDs/counts for case/whitespace/punctuation search, empty `q`, default/invalid/duplicate params, unrelated-key preservation, changed versus unchanged submissions, independent/combined resets, inclusive ranges, numeric sorts/ties, 0/1/12/13/25/49 results, and page clamps. Add a hand-calculated test that distinguishes filtering before pagination from filtering only the current page.
- [x] 2.3 Replace text rows with ProductGrid/ProductCard using existing ProductImage and Price; expose lazy loading for card media while retaining normal detail image loading. Manually verify visible images/names/prices, image/name slug links, stable image fallbacks, desktop layout, and keyboard focus.
- [x] 2.4 Add separate ProductSearch and ProductFilters components with explicit values/options/callbacks, visible labels, draft inputs, submit and clear/reset actions. Connect them and the sort control to the page's URL updates; manually verify Enter/Search, Apply filters, validation, literal punctuation, page reset, preserved companion fields, and draft synchronization on Back/Forward. Document the `q` URL example and submit-based search in README.
- [x] 2.5 Add numbered pagination with generated links preserving search/filter/sort, current-page indication, matching-result count, and correct Previous/Next boundaries. Manually verify 49 -> five pages with one final item, combined 25 matches -> 12/12/1, visible page 1 and disabled Previous/Next for zero/one page, visible disabled pagination with loading/unavailable counts during requests/failures, no URL change from disabled controls, and valid pages after retry, direct page URLs/reloads, and no-results Clear search and filters recovery.
- [ ] 2.6 Run `pnpm run check` and manually verify the full desktop search/filter/sort/page/card flow, empty catalog, unknown category, no matches, request/image errors, keyboard focus, 200% native zoom, and console/network output. Confirm changing criteria does not refetch JSON; record automated and browser outcomes separately and stop for review. Keep any unverified zoom check open.

Milestone 2 implementation and tasks 2.1–2.5 are delivered. Task 2.6 remains open solely for native 200% zoom verification; full checks and other desktop browser checks passed. See [verification.md](verification.md). Stop for review before milestone 3.

## 3. Product details and shared cart additions

Acceptance: details show Add to cart and quantity 0 initially. Adding product A twice and B once yields detail quantities 2/1, header count 3, and two visible cart lines with accurate totals across navigation. The gallery and all existing detail recovery states work; cart increase/decrease/remove/clear work in this milestone under the latest user request; checkout remains milestone 4. Decrease stops at 1, with explicit Remove for deletion.

- [x] 3.1 Implement pure cart add/increase/decrease/remove/clear/count/total transitions and the shared provider/hook; verify Vitest cases for repeated adds, multiple products, removal of a missing ID, clear on empty, invalid quantity/price/currency, decrease at 1, missing-line changes, rapid sequential updates, and safe arithmetic. Use independently calculated totals and verify no input mutation.
- [ ] 3.2 Connect the existing ProductDetailsPage to the shared cart hook; reuse Button for Add to cart, show/announce the current quantity from 0, and replace the hardcoded header count. Manually add A twice and B once, navigate away/back, and verify 2/1 quantities and count 3 without duplicate lines; verify rapid successive clicks are retained and unavailable products cannot be added.
- [ ] 3.3 Replace the empty CartPage stub with provider-backed lines and totals using shared image/price components. Manually navigate from details to cart and verify two lines with quantities 2/1, images, unit prices, correct totals, and no false empty message; verify a full reload resets to the documented empty cart. Use the tested cart calculation functions, not UI-only arithmetic.
- [ ] 3.4 Extend existing slug details with main-image/thumbnail selection, preserving loading/retry/not-found/description/media fallbacks. Add multi-image demo data where needed; manually paste/reload known and unknown slugs, navigate rapidly, and inspect zero/one/multiple-image cases with keyboard controls.
- [ ] 3.5 Document cart lifetime, add behavior, and product route behavior, run `pnpm run check`, and manually verify desktop keyboard gallery/add controls, quantity announcements, focus, 200% native zoom, and console output. Record results and stop for review; leave unavailable checks open.

- [ ] 3.6 Add line increase/decrease/remove and Clear cart controls from shared state (removal/clear moved from former task 4.1 at user request). Verify 19.99 x 2 -> increase to 59.97 -> decrease to 19.99, decrease disabled at 1, repeated clicks, detail/header synchronization, removal focus to another line, and last-line/clear focus to the empty heading. Run full checks and record browser evidence before stopping for review.

## 4. Cart and simulated checkout

Acceptance: [shopping-cart/spec.md](specs/shopping-cart/spec.md) passes, including exact totals and a captured checkout amount after clearing.

- [ ] 4.2 Implement guarded checkout and success snapshot behavior with Vitest tests: three units at 19.99 plus two at 0.10 produce 60.17, success retains 60.17 after clearing, empty/double checkout produces no second result, and a nonempty zero-total cart succeeds. Verify success dismissal/navigation resets feedback as designed.
- [ ] 4.3 Manually complete checkout, verify the demo label, amount, empty cart/count, keyboard announcement, and absence of payment requests; verify a full reload resets the cart per the reviewed behavior.
- [ ] 4.4 Document checkout limits, run `pnpm run check`, and manually verify desktop keyboard removal/clear/checkout, visible focus, 200% zoom, and console output. Record results and stop for review.

## 5. Integrated acceptance and handoff

Acceptance: all required journeys and error paths are verified together; automated and browser results are separately recorded. Reserve this milestone for integration verification, with no new feature scope.

- [ ] 5.1 Run `pnpm run check` and `pnpm exec openspec validate add-demo-storefront --strict --no-interactive`; record actual commands and outcomes, resolve failures, and verify every capability requirement has evidence from its milestone.
- [ ] 5.2 Under dev and production preview, manually follow the desktop journey search/filter/sort/numbered page -> image card -> slug details -> repeated adds -> cart remove/clear -> demo checkout; verify shared query URLs, direct-route refreshes, history, total/count synchronization, and dummy JSON request/image failures. Record desktop viewport, keyboard, zoom, console, and network findings separately from Vitest results.
- [ ] 5.3 Summarize the scoped diff, remaining limitations, and actual verification; update project memory only for accepted consequential decisions with a design link. Stop for user review without staging or committing.
