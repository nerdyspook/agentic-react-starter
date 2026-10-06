# Proposal

## Why

The foundation currently shows a text directory and basic details, but shoppers still need visual discovery and cart actions. Complete the journey with product cards, shareable search/filtering, numbered pages, product additions, and simulated checkout.

## What Changes

### Explicit requirements

- Product listing as ecommerce cards with visible product images, names, prices, and links to details.
- Expand dummy products and provide numbered pagination that stays visible in every listing state, including single-page, empty, loading, and error states; search, filters, sorting, and page state must work together through URL parameters.
- A separate filters component on ProductListPage, alongside product search.
- Product details reached by slug, with an add-to-cart action and visible quantity already added.
- Cart with increase/decrease quantity, remove-item, and clear-cart actions, a total, and demo checkout success displaying the amount.
- Shared header with a cart count, custom hooks for API calls, Tailwind styling, a common components file, and empty states on all three pages.
- Use dummy JSON product data for this iteration; a live product API or new backend is not required.
- Desktop layouts only for now; responsive layouts and narrow-viewport acceptance are deferred by user request.

### Implementation defaults

- Fetch the local dummy JSON catalog over HTTP through custom hooks so loading, retry, and error states remain demonstrable.
- Interpret web format as WebP. Add product names, categories, and currency to the supplied data contract; normalize decimal price strings to integer minor units.
- Use 12 products per page, price ascending/descending and name sorting, category and price-range filters, and a badge counting total units.
- Keep cart state across client-side navigation, but reset on a full reload. Use USD as the single demo currency; successful checkout captures the amount and clears the cart.
- These defaults are carried forward under the user's request to implement the current proposal. Dummy JSON and deferred responsive layouts were separately confirmed explicitly.

### Proposed details for this revision

- Expand from 25 to 49 products, yielding five pages at 12 per page, with one product on the last page. Include 25 products matching a representative combined search/filter query so pagination remains demonstrable after narrowing results.
- Use `q` for literal, case-insensitive product-name substring search. Trim surrounding whitespace; submit with Enter or Search, and remove empty `q` values. Live search, fuzzy matching, and description search are not required.
- Keep separate ProductSearch and ProductFilters components. Each updates its URL fields and preserves the other controls; a changed search, filter, or sort resets page to 1.
- Retain the existing milestone boundaries: cards/search/filters/pagination in milestone 2; functional Add to cart, shared quantities/header count, and visible cart contents in milestone 3. The latest user request brings increase/decrease quantity, removal, and clear into milestone 3; checkout remains milestone 4. Decrease stops at one unit; Remove deletes the line.

### Optional extras and exclusions

- An image carousel is optional; a static main image and thumbnails cover multiple images initially.
- Cart persistence across reloads and filters beyond category/price are optional follow-ups. Search and cart quantity controls are now required by the user's revisions.
- Responsive breakpoints, mobile layouts, and narrow-screen/reflow verification are deferred. Keyboard navigation, visible focus, labels, and understandable feedback remain required.
- Real payments, a live product API or new backend, authentication, orders, stock reservation, taxes, shipping, discounts, and deployment are outside this demo proposal.

## Capabilities

### New Capabilities

- `product-catalog`: Product cards, URL-driven search/filtering/sorting, numbered pagination, product media, and catalog request states.
- `product-details`: Direct slug navigation, descriptive product information, and adding units to the shared cart.
- `shopping-cart`: Shared cart count and lines, quantity controls, removal, clearing, accurate totals, and simulated checkout.

### Modified Capabilities

None. The project contains no existing capability specs.

## Impact

React Router, Tailwind, request hooks, validation, and shared image/price/state components already exist from milestone 1. Remaining work extends the product feature, fixtures, and tests and adds shared cart state; no new dependency is needed for this revision. Milestone 2 now delivers 49 products and query-driven cards. The current request implements detail/cart interactions and extends cart quantity controls; preserve completed tasks and pending native-zoom checks.
