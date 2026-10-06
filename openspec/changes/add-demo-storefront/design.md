# Design

## Context

See [proposal.md](proposal.md) for scope and requirement provenance. At planning time, `App.tsx` only rendered a heading; there was no reusable commerce code, router, data layer, or design system. React/TypeScript/Vite and Node-environment Vitest were configured. Milestone 1 reuses `isNonEmpty` for required product strings and adds the shell, data layer, and contracts below.

The user confirmed dummy JSON product data and deferred responsive layouts for this iteration. The design serves those fixtures locally over HTTP to preserve the custom request-hook requirement. The subsequent request to implement the current proposal carries forward its documented defaults, including USD and the planned cart lifetime.

Current inspection: ProductListPage renders 25 text rows; ProductDetailsPage renders a main image and description without cart actions. `ProductImage`, `Price`, `Button`, `PageState`, validation, money helpers, and request hooks already exist and should be reused. The header count is hardcoded and the cart is an empty shell. This revision makes search required, specifies image cards/numbered pages, and expands the still-pending milestones; task 1.5's native-zoom check remains open.

## Goals / Non-Goals

**Goals:** Keep URL state, fetched data, and cart state separate; make totals and query behavior testable without a browser; keep each milestone reviewable.

**Non-Goals:** Responsive/mobile layouts, a live product API, a server framework, payment integration, global state library, generic fetching framework, or production commerce guarantees. All three requested pages remain in scope.

## Decisions

### Data contract and custom hooks

Use dummy JSON resources served from `public/data`: a listing JSON file and a detail JSON file per slug. Serving files over HTTP exercises real `fetch`, loading, error, retry, and cancellation without a backend; direct imports would bypass that request lifecycle. Listing filtering/pagination happens in the client for this small catalog. A future production API could move these operations server-side behind the same feature interface.

| Shape              | Proposed contract                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List item          | Preserve `id`, `slug`, `image`, `price: string`; add `name`, `category`, and `currency`.                                                                                      |
| Detail             | Preserve `id`, `images: string[]`, `description`; define `pricing: { amount: string, currency: string }`; add matching `slug`, `name`, and `category`.                        |
| Normalized product | Stable identity plus `priceMinor: number`, currency, and validated display fields.                                                                                            |
| Cart line          | Preserve the meaning of `productid`, price, quantity; internally use `productId`, `unitPriceMinor`, and positive integer `quantity`, with name/slug/image/currency snapshots. |

Use unique nonempty IDs and URL-safe slugs; listing and detail identity/price must agree in fixtures. Render descriptions as plain text. Accept nonnegative decimal amounts with up to two fraction digits, convert by string parsing to safe integer minor units, and reject invalid or mixed-currency data. USD is the demo default carried forward from the approved proposal. Empty images and descriptions are valid and receive fallbacks.

Existing `useProducts()` and `useProduct(slug)` own request lifecycle and expose loading, data/not-found, error, and retry states. Extend the listing hook to `useProducts(query)`: retain its stable catalog request and derive matches, sorted page items, result count, and page count through pure selection helpers. Query changes must not refetch the unchanged dummy JSON or store a second copy of filtered results. Keep category options derived from the full catalog so filtering cannot remove its own choices. Reuse the existing validation, AbortController cleanup, and stale-response guards. Presentational children receive props; cart/header use `useCart` without redundant API calls.

### Routing and URL state

Reuse the installed React Router setup for `/products`, `/products/:slug`, and `/cart`, with `/` redirecting to `/products` and a not-found route. No new routing or fetching dependency is needed.

The URL owns applied `q`, category, price range, sort, and page. ProductSearch holds only its unsubmitted search text; ProductFilters holds unsubmitted category/price inputs and validation. Submit each form with Enter or its Search/Apply filters button. Sorting applies on selection. Navigation resynchronizes drafts from the URL, including Back/Forward. Use URLSearchParams to preserve literal punctuation and unrelated keys safely.

Pure selection order: trim `q` -> case-insensitive literal substring match against `name` -> category and inclusive price filters -> numeric/name sort with ID tie-break -> page clamp -> slice 12 items. An empty `q` is omitted. Keep search case for display/URL; lowercase only for matching. No fuzzy matching, regex interpretation, description search, debounce, or request per keystroke. Submit-based search is predictable and avoids polluting history.

Each changed search/filter/sort pushes one history entry and resets page to 1; a submission equal to the currently applied normalized values is a no-op. Numbered links change only page and preserve applied criteria. Invalid URL normalization replaces history; clamp pages only after data is loaded. Clear search removes only `q`; Reset filters removes category/price; the no-results Clear search and filters action removes both. All preserve sort and unrelated keys and reset page to 1.

Example: `/products?q=mug&category=home&minPrice=10&maxPrice=50&sort=price-desc&page=2`. With 25 matching records, it shows the second set of 12, reports 25 results, and offers pages 1–3. Browser Back from details restores the prior catalog URL; preserving that query in the dedicated Back to products link is optional and not required here.

Pagination remains mounted outside the listing's conditional loading/error/empty/results content. For zero or one result page, show page 1 as current and keep Previous/Next visible but disabled; a zero-result count makes clear that this is an empty view. While valid catalog data is unavailable, show the normalized requested page with loading/unavailable counts, disable navigation, and defer URL clamping until data arrives. Use native disabled buttons for unavailable directions and links for valid destinations. Visibility is a layout requirement, not sticky positioning. This preserves predictable controls without allowing navigation to nonexistent pages.

### Shared cart and checkout

One `CartProvider` above route pages owns immutable cart lines and provides `useCart`. Pure transition/calculation functions handle add/increase/decrease/remove/clear and derive count/total; do not store duplicate totals or product quantities. Keep the provider mounted during navigation. Cart line snapshots let the cart remain usable without another catalog request. No persistence is proposed initially; reload resets the demo.

Milestone 3 connects the existing detail view to an Add to cart button: add exactly one unit per click, display quantity 0 before adding, merge repeated additions by ID, and announce the new quantity. Replace the hardcoded header count with the sum of quantities. At the same milestone, replace the empty cart stub with editable lines and totals backed by the provider; otherwise the application would contradict a successful add. The latest user request moves removal/clear into milestone 3 and adds quantity buttons. Increase/decrease changes one unit; decrease is disabled at quantity 1, and Remove is the explicit deletion action. Checkout remains milestone 4. Use a pure reducer to reject invalid or unsafe mutations without changing lines, exposing an accessible error. Functional/reducer updates retain rapid clicks. After removal, focus the next line control (previous line when removing the last), or the empty-cart heading when no lines remain; clear focuses that heading. Preserve unavailable-add behavior for loading, error, and not-found states.

Checkout is a guarded event-driven transition: validate a nonempty cart, capture its exact amount/currency, clear lines, and expose one success result. Keep the result separate from the newly empty cart so its amount cannot become zero. Reset the success on dismissal or leaving the cart route; repeat activation on empty state is a no-op. No payment API or pretend network loading is needed.

### Components and state ownership

| Boundary                                      | Responsibility and owned state                                                                                                                                                                                                            |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `App` / `StoreLayout` / `Header`              | Routes, common header, cart link, main landmark, and navigation focus handling.                                                                                                                                                           |
| `src/components/common.tsx`                   | Small shared Button, ProductImage, Price, and request/empty-state presentation components with explicit props. No fetching or cart ownership.                                                                                             |
| `ProductListPage`                             | Reads/applies URL query, calls `useProducts(query)`, renders request states, result count, and labeled sort control.                                                                                                                      |
| `ProductSearch.tsx`                           | Separate search form with visible label, draft text, Search/Clear actions, and value/onSubmit/onClear props.                                                                                                                              |
| `ProductFilters.tsx`                          | Separate category/price form with visible labels, draft fields, range validation, Apply/Reset actions, and value/categories/onApply/onReset props. No fetching or router ownership.                                                       |
| `ProductGrid` / `ProductCard`                 | Desktop image-card grid; each card reuses ProductImage and Price and links image/name to the slug. No card-level API request or add-to-cart action is needed.                                                                             |
| `Pagination.tsx`                              | Receives request status, requested/resolved page, available counts, and generated URLs; always remains visible; displays numbered links, current page (`aria-current="page"`), and unavailable boundary controls. No separate page state. |
| `ProductDetailsPage`                          | Product request hook and cart hook; ProductGallery owns selected image index, reset for a new product.                                                                                                                                    |
| `CartProvider` / `useCart`                    | Cart transitions and shared lines; count and monetary totals are derived.                                                                                                                                                                 |
| `CartPage` / `CartLine` / `CartSummary`       | Cart display and actions; checkout success presentation and accessible focus after removal.                                                                                                                                               |
| `features/products` and `features/cart` logic | API decoding, query helpers, money conversion, and cart transitions actually used by the UI and tested with Vitest.                                                                                                                       |

```text
Search / Filters / Sort / Page --> URL query --> useProducts(query)
Catalog JSON --> fetch + validate ------------> useProducts(query)
useProducts(query) --> search + filter + sort + paginate --> image cards
image card --> slug details --> Add to cart --> CartProvider
CartProvider --> Header count / Detail quantity / Cart lines and total
Cart actions --> CartProvider --> checkout success
```

### Styling and media

Target a desktop layout, using a 1280 x 800 browser window as the proposed verification baseline. Responsive breakpoints, mobile layouts, and narrow-screen/reflow acceptance are deferred at the user's request, superseding the earlier 320px requirements for this change. Retain semantic controls, labels, keyboard navigation, visible focus, and accessible feedback. Inspect text and controls at 200% zoom on desktop; horizontal scrolling at zoom is acceptable for this iteration.

Reuse the existing Tailwind integration, cream/green styling, spacing, rounded surfaces, and focus treatment. Lay out a desktop filter sidebar beside a three-column card grid, with search/sort/result count above the grid and numbered pagination below. Keep images square with intrinsic dimensions and a stable fallback; expose lazy loading for offscreen card images without forcing it on the detail hero. Preserve the existing React Compiler/Vitest configuration and package versions.

Expand the dummy catalog from 25 to a proposed 49 products, preserving existing IDs/slugs and adding matching detail JSON. Keep multiple categories, varied/equal prices, and the free item; ensure exactly 25 records match `q=mug&category=home&minPrice=10&maxPrice=50` for a deterministic 12/12/1-page demonstration. Each added product needs a relevant local WebP image (shared reference images remain acceptable for dummy variants). Update fixture-test assertions that currently expect 25 total/13 filtered, and README counts when implementing. A static gallery with selectable thumbnails remains required for multi-image details; an animated carousel is optional.

## Risks / Trade-offs

- [Catalog expansion changes fixture assumptions] -> Preserve routes/IDs and extend paired JSON plus invariant tests together; retain independent small datasets for search/sort/page tests.
- [Search adds scope to milestone 2] -> Reserve explicit tasks for URL composition, history, and combined-filter testing instead of treating search as only an input field. Keep full cart interaction in the following milestones.
- [Responsive behavior deferred] -> Verify the desktop journey now and record mobile layout/reflow as future work; retain keyboard and feedback accessibility.
- [Client filtering downloads the whole list] -> Appropriate for the demo fixture size; the API boundary allows future server pagination without changing the URL contract.
- [Price strings and floating point] -> Validate at the boundary and calculate in safe integer minor units; never turn missing/invalid prices into zero.
- [Memory-only cart loses data on refresh] -> Make that limitation explicit in demo copy; persistence requires a separate decision and storage-error scenarios.
- [Snapshots can become stale against a live catalog] -> Demo fixtures are immutable; real commerce needs server-authoritative price/stock validation, outside this proposal.
- [Clean slug URLs need host fallback] -> Verify direct URLs under Vite dev and preview; future hosting must rewrite application routes to the SPA entry while serving JSON/media normally.
- [Node tests cannot prove UI behavior] -> Reserve browser verification in every UI milestone plus a final journey pass; do not claim hook rendering or accessibility from logic tests.

## Migration Plan

No existing feature data needs migration. Implement one milestone at a time after plan review. Preserve framework-managed files and unrelated changes; dependency/config changes are limited to approved integration needs. Deployment is outside scope. If a milestone is rejected, adjust its scoped diff rather than resetting unrelated work.

## Verification approach

Use Vitest for observable application logic actually called by the UI: query round-trips with encoded punctuation, whitespace/case search, combined constraints, stable numeric/name sort, page resets/clamps, 0/1/12/13/25/49 result boundaries, and cart/checkout transitions. Use hand-authored records and literal expected ID arrays/counts, not the selector itself to calculate expectations. Keep fixture consistency tests separate from business-result tests.

Manual desktop browser checks cover visible image cards, numbered/current page links and always-visible disabled pagination for single-page/empty/loading/error states, search and separate filters composing in the URL, independent/combined resets, direct URLs/reloads, Back/Forward, image/request failures, and repeated cart additions across routes. Retain keyboard/focus and 200% native zoom checks; the earlier unverified zoom check remains explicitly pending. Narrow-viewport/reflow checks stay deferred. Record UI evidence separately, run `pnpm run check` at each milestone, and retain the final integrated acceptance pass in [tasks.md](tasks.md).
