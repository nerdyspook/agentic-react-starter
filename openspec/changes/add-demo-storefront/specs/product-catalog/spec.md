# Product catalog

## Purpose

Let shoppers discover products through a shareable, paginated catalog with predictable sorting, filtering, and recovery states.

## ADDED Requirements

### Requirement: Paginated product listing

The listing at `/products` SHALL display a grid of product cards, each with a visible WebP image or labeled fallback, product name, formatted price, and link to its slug. It SHALL show 12 products per page, with a smaller final page, applying search and filters before sorting and pagination.

#### Scenario: Product cards

- **WHEN** a populated catalog page is displayed
- **THEN** every displayed product has an image card, name, and price
- **AND** activating its image or name opens the matching details; a broken image retains the card layout and a product-labeled fallback

#### Scenario: Final page and numeric ordering

- **WHEN** 13 matching products are sorted by ascending price and page 2 is selected
- **THEN** the final product is displayed, previous navigation is available, and next navigation is disabled
- **AND** prices such as 9.00 and 100.00 are ordered numerically across pages

#### Scenario: Stable ties

- **WHEN** multiple products have the same selected sort value
- **THEN** ascending product ID breaks ties so page membership remains deterministic

### Requirement: URL-controlled catalog state

The listing SHALL support `q`, `page`, `sort` (`name-asc`, `price-asc`, `price-desc`), `category`, `minPrice`, and `maxPrice` query parameters. Defaults SHALL be page 1, name ascending, and no search or filters. Controls and results SHALL reflect direct URLs, reloads, and browser history. Search and filters SHALL combine with AND; price bounds SHALL be inclusive.

#### Scenario: Shared filtered URL

- **WHEN** `/products?q=mug&category=home&minPrice=10&maxPrice=50&sort=price-desc&page=2` is opened
- **THEN** controls reflect that URL and results show the second page of home products whose names contain mug and prices range from 10.00 through 50.00, ordered by descending price

#### Scenario: Controls and browser history

- **WHEN** a shopper applies a changed search, filter, or sort on page 2
- **THEN** the URL and results update and page resets to 1
- **AND** Back restores the previous search, filters, sorting, and page; Forward reapplies the change

#### Scenario: Invalid parameters

- **WHEN** page is nonnumeric, fractional, zero, or negative, or sort is unsupported
- **THEN** the affected field uses its default and the URL is normalized without adding a history entry
- **AND** a page above the final page is clamped after filtering; zero matches uses page 1

#### Scenario: Invalid price range

- **WHEN** URL price bounds are negative, nonnumeric, or have more than two decimal places
- **THEN** invalid bounds are removed from the applied query
- **AND** reversed bounds are both removed; submitting a reversed range in controls instead shows a visible validation message without applying it

#### Scenario: Repeated and unrelated parameters

- **WHEN** a supported query key appears more than once
- **THEN** its first value is used and duplicate values are removed
- **AND** unrelated query parameters are preserved when controls update supported keys

### Requirement: Product-name search

The listing SHALL provide a visibly labeled search field and Search action. Submitting via Enter or Search SHALL set `q` to the trimmed text and apply a case-insensitive literal substring match against product names. Blank search SHALL remove `q`. Typing alone SHALL NOT change results or URL history.

#### Scenario: Search normalization and literal matching

- **WHEN** the shopper submits `  MUG  `
- **THEN** the URL stores `q=MUG`, names such as Everyday Mug Large match, and the field displays the trimmed text
- **AND** punctuation such as `+` is treated literally and encoded through URL parameters, not interpreted as a regular expression or lost as a space

#### Scenario: Draft and unchanged submission

- **WHEN** the shopper types without submitting
- **THEN** the existing results and URL remain unchanged
- **AND** submitting the already-applied normalized search creates no new history entry or page reset; Back/Forward restores draft controls from the navigated URL

### Requirement: Combined search and filter controls

Search and visibly labeled category/price controls SHALL operate independently on one URL state. Clear search SHALL remove only `q`; Reset filters SHALL remove category and price bounds. Each changed action SHALL reset page to 1, preserve sort and unrelated URL keys, and preserve the other controls' applied values.

#### Scenario: Independent search and filter changes

- **WHEN** a shopper applies category home and a price range while `q=mug` is active
- **THEN** the search remains active and only products satisfying all criteria appear
- **AND** Clear search preserves category/price; Reset filters preserves search

### Requirement: Numbered pagination and expanded demo catalog

The demo catalog SHALL contain at least 49 products with matching detail data. The listing SHALL show numbered page links with the current page marked, Previous/Next controls, and a matching-result count. Page links SHALL preserve applied search, filters, and sort. Pagination SHALL remain visible in every listing state, including a single page, empty catalog, no matches, loading, and request failure. Unavailable Previous/Next controls SHALL remain visible but disabled and SHALL NOT change the URL. Always visible means rendered in the listing layout; sticky or fixed positioning is not required.

#### Scenario: Five numbered pages

- **WHEN** 49 products match at 12 products per page
- **THEN** links 1–5 are available, pages 1–4 contain 12 products each, and page 5 contains one
- **AND** selecting page 5 sets `page=5`, marks that page current, and disables Next

#### Scenario: Pagination of combined matches

- **WHEN** `q=mug&category=home&minPrice=10&maxPrice=50` matches 25 seeded products
- **THEN** three numbered pages contain 12, 12, and 1 product respectively; the result count is 25
- **AND** changing criteria to one page resets page to 1, keeps page 1 visible and marked current, and disables both Previous and Next

#### Scenario: Single-page and empty pagination

- **WHEN** zero to 12 products match after a successful request
- **THEN** pagination remains visible with page 1 marked current and both Previous and Next disabled
- **AND** the matching-result count is accurate, including 0 for an empty catalog or no matches; the page 1 indicator does not imply any products exist

#### Scenario: Pagination during loading or failure

- **WHEN** the catalog is loading or its request fails before valid results are available
- **THEN** the pagination region remains visible with disabled Previous/Next controls and a requested-page indicator derived from the normalized URL
- **AND** it labels page totals and result counts as loading or unavailable instead of inventing totals or clamping the URL against missing data
- **AND** successful loading or retry replaces that pending indicator with valid numbered pages and applies the normal page clamp

### Requirement: Catalog recovery states

The catalog SHALL distinguish loading, failed requests or invalid data, an empty catalog, and zero search/filter matches. It SHALL offer retry after failure and Clear search and filters after zero matches, removing `q`, category, and price bounds and resetting page while preserving sort and unrelated keys. Missing or broken images SHALL show a stable fallback with a product label.

#### Scenario: Empty and unmatched catalogs

- **WHEN** the catalog has no products
- **THEN** a catalog-empty message is shown alongside the visible disabled pagination and 0-result count
- **AND** when a nonempty catalog has no matches, including an unknown category or unmatched search, a no-results message and Clear search and filters action are shown instead, alongside the visible disabled pagination and 0-result count

#### Scenario: Request failure and recovery

- **WHEN** the catalog request fails or returns invalid product data
- **THEN** an understandable error and retry action are shown, rather than an empty-results message or fabricated prices
- **AND** a successful retry displays products

#### Scenario: Rapid navigation

- **WHEN** a newer request completes before an older request during navigation
- **THEN** only results belonging to the current route and query are displayed

### Requirement: Accessible desktop catalog

The desktop listing SHALL provide visibly labeled controls, keyboard-operable links and pagination, visible focus, and understandable request-state announcements. Text and controls SHALL remain usable at 200% desktop zoom; horizontal scrolling is permitted. Responsive/mobile layouts are deferred.

#### Scenario: Desktop keyboard navigation

- **WHEN** the shopper uses only the keyboard to search, filter, sort, select a numbered page, and open a product in the desktop layout
- **THEN** focus remains visible and all actions work
