# Milestone 1 verification — 2026-10-06

Scope: foundation and dummy product data only. Tasks 1.1–1.4 are complete;
1.5 remains open for native 200% zoom verification. No milestone 2–5 work is
claimed complete. No staging or commits were performed.

## Automated checks

- `pnpm run check`: passed ESLint, all 28 Vitest tests, TypeScript, production
  build, and repository formatting checks after fixes.
- After documentation updates, `pnpm exec prettier --check .`,
  `pnpm exec openspec validate add-demo-storefront --strict --no-interactive`,
  and `git diff --check` passed. The Git index remained empty.
- 25 new tests exercise the actual UI money, decoding, and request functions;
  3 existing string-validation tests remain. README describes the cases and risks.
- All 25 detail fixtures agree with the catalog on identity and prices. All
  referenced local assets have actual RIFF/WebP file headers; images were also
  visually inspected.
- Regression demonstrated before fixing: the HTML-fallback test failed with a
  JSON parse error. Adding `Accept: application/json` made missing detail files
  return not-found in Vite. The test and subsequent full suite passed.
- An initial build found missing Node type declarations in the filesystem fixture
  test; a test-file type reference fixed it without changing the browser target.

## Browser checks

Used the connected Chrome browser and local Vite server. Desktop route/keyboard
checks used a 1280 × 800 viewport. A temporary server outside the repository served
the production build with controlled JSON failures/delays; no fault-injection code
was added to the application.

- Passed: `/` redirects to `/products`; catalog, known slug, unknown slug, cart,
  and unknown route open/reload with correct content and a Cart 0 header.
- Passed: unknown slug shows product-not-found; unknown route shows page-not-found;
  recovery links navigate back to the catalog.
- Passed: Tab from Products focuses Cart with a visible 3px amber outline; Enter
  opens the cart; route changes focus the main content. Product and recovery links
  also navigate correctly.
- Passed: a forced catalog HTTP 500 displays error/retry; retry with an 8-second
  response delay displays loading and then recovers to the product directory.
- Passed: a product HTTP 500 displays detail error/retry and a subsequent successful
  retry displays the correct product.
- Passed: while a detail response was delayed by 10 seconds, navigation back to
  the catalog and another product displayed the new product; the late response
  never replaced it. AbortSignal forwarding is separately verified in Vitest.
- Passed: normal catalog/detail navigation in a fresh tab produced no console
  warnings or errors. Intentional 404/500 cases produced expected network errors.
- Desktop screenshot: `/private/tmp/storefront-milestone-1.png` (normal browser
  viewport, showing the basic detail view; temporary review artifact).

## Pending check and review steps

Native browser zoom shortcuts did not change the viewport/scale through the
available browser connection. No 200% zoom pass is claimed. To finish task 1.5:

1. Run `pnpm run dev` and open `/products`, `/products/everyday-mug-large`, and `/cart`.
2. Set Chrome's menu zoom to 200%, verify text and keyboard controls remain usable,
   allowing horizontal scrolling for this desktop iteration, then restore zoom.
3. Record the outcome and check task 1.5 only if it passes.

Next milestone after review: product cards, URL sorting/filtering, and pagination.
The current directory intentionally has no query controls or product-card grid;
details have no gallery/add action yet; the cart is an empty shell.

# Milestone 2 verification — 2026-10-06

Scope: image cards, 49-product fixtures, URL search/filter/sort, and always-visible
numbered pagination. Tasks 2.1–2.5 are complete (9/23 overall). Task 2.6 remains
open only for native 200% browser zoom, as does the historical task 1.5. No cart
implementation or dependency changes were made in this milestone. Existing staged
work was preserved; no staging, unstaging, or commits were performed.

## Automated checks

- `pnpm run test -- src/features/products/products.test.ts` ran the configured
  complete suite: all 28 then-existing tests passed after the fixture expansion.
- `pnpm run check`: passed ESLint, all 37 Vitest tests, TypeScript, production
  build, and repository formatting. The first run found formatting differences in
  the 24 new JSON files; scoped Prettier formatting fixed them and the rerun passed.
- Final documentation formatting, strict OpenSpec validation, and `git diff --check`
  passed after updating task progress and project memory.
- Nine new catalog tests call the URL, filter-input, and selector functions used
  by the UI. Literal expectations cover defaults/invalid/duplicate parameters,
  punctuation and whitespace, unchanged submissions, independent/combined resets,
  preserved companion/unrelated fields, exact price inputs, AND filtering,
  numeric/name sorts and ties, immutability, 0/1/12/13/25/49 page boundaries, and
  filtering the entire dataset before slicing. README describes the failure each
  group prevents; no expected IDs or counts come from the selector itself.
- Fixture checks verify 49 matching catalog/detail pairs, valid local WebP headers,
  and exactly 25 home mugs in the inclusive $10–$50 range.

## Browser checks

Used the connected Chrome browser at 1280 × 800, Vite on port 5174, and a temporary
production-build server on port 5180. Fault rules and request logs were outside the
repository; no testing dependency or fault-injection code was added to the app.

- Passed: three-column image cards with names/prices; image and keyboard link
  activation open matching slug details. Existing IDs/slugs remain unchanged.
- Passed: 49 results show five numbered pages; page 5 has one product and disabled
  Next. Combined mug/home/$10–$50 criteria yield 25 results across 12/12/1 pages.
- Passed: Enter and Search submit trimmed case-insensitive name search; drafts do
  not change the URL. An unchanged normalized submission on page 3 keeps page 3
  and adds no history entry (Back goes directly to page 2).
- Passed: category, inclusive price range, and sort compose with search. Clear
  search preserves filters; Reset filters preserves search; changes reset page 1.
- Passed: direct shared URL and reload restore controls, sort, and page. Back and
  Forward restore applied values and discard an unsubmitted draft. Prices normalize
  to two decimal places; unknown-category page 99 clamps to page 1 after loading.
- Passed: reversed form bounds show an error without applying them. Literal `+`
  becomes `q=%2B` and gives no matches; combined reset recovers all 49 products.
- Passed: zero-result and single-product views show page 1 as current with disabled
  Previous/Next. Empty catalog shows its distinct message with visible pagination.
- Passed: forced HTTP 500 shows retry, unavailable totals, and requested page 3
  without changing the URL. A five-second retry shows loading with disabled
  pagination, then restores valid page 3 and page links.
- Passed: forced image 404 produces product-labeled square fallbacks without
  disrupting card layout. Screenshot inspection confirmed visible cards/fallbacks.
- Passed: keyboard Enter activates search, filter reset, numbered pages, and
  product links. Tab from search focuses Search with the visible 3px amber outline.
- Passed: production request log contained two catalog requests (initial forced
  failure plus retry), unchanged after search, filter, sort, and page actions.
- Passed: final normal-route browser console check returned no warnings/errors.
  Intentional request/image failures were confined to fault checks.
- Review screenshot: `/private/tmp/storefront-milestone-2.png`.

## Remaining check and next milestone

The native zoom shortcut did not change viewport width or device-pixel ratio after
removing the viewport override. No native 200% zoom pass is claimed. Manually set
Chrome menu zoom to 200%, exercise the catalog controls/pagination and foundation
routes, and restore zoom. Horizontal scrolling is allowed. Record the result before
checking tasks 1.5 and 2.6. Temporary viewport overrides were reset after inspection.

Stop here for review. Milestone 3 adds shared cart state, detail Add to cart and
quantity, the header unit count, read-only cart contents/totals, and image selection.
Remove/clear/checkout remain milestone 4; final integrated verification is milestone 5.
