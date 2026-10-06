# Product details

## Purpose

Let shoppers open a product directly by its slug, inspect its information and images, and add units to the shared cart.

## ADDED Requirements

### Requirement: Direct product navigation

The application SHALL resolve `/products/:slug` from the slug independently of prior listing navigation and show the product name, description, images, and formatted price. A direct visit or reload SHALL work. Unknown routes SHALL show a recovery link to the catalog.

#### Scenario: Direct link and refresh

- **WHEN** a known product URL is pasted into a new tab or reloaded
- **THEN** the matching product is loaded without requiring listing state

#### Scenario: Missing product or description

- **WHEN** the slug does not exist or the detail source reports no product
- **THEN** the page shows a product-not-found empty state with a catalog link and no add action
- **AND** a valid product with an empty description shows an explicit description-unavailable message

### Requirement: Product media

The product SHALL show a main image and allow selection of each available image using labeled thumbnail controls. Zero images or failed image loads SHALL show a labeled fallback. A carousel is optional and SHALL NOT be necessary to access product information or add to cart.

#### Scenario: Image availability

- **WHEN** the product has multiple images
- **THEN** choosing a thumbnail updates the main image and exposes which image is selected
- **AND** a single-image product has no unnecessary navigation controls; a zero-image product remains usable with a fallback

### Requirement: Add product units

Valid product details SHALL display an Add to cart button and the current quantity in cart, initially 0. Each successful click SHALL add one unit and immediately update that quantity and the shared header. Repeated adds SHALL merge into one cart line. The displayed quantity SHALL derive from shared cart state.

#### Scenario: First add and cross-product count

- **WHEN** a shopper adds product A twice and product B once
- **THEN** A shows quantity 2, B shows quantity 1, and the header shows 3 total units
- **AND** opening the cart shows two product lines with those quantities; navigating back to A still shows 2

#### Scenario: Repeat addition and removal elsewhere

- **WHEN** the shopper adds a product twice
- **THEN** the page reports quantity 2, the cart contains one line of quantity 2, and the header count increases by 2
- **AND** increasing/decreasing that line in the cart is reflected on return; removing it and returning to details shows quantity 0

### Requirement: Detail request and interaction states

Details SHALL distinguish loading, request/data failure with retry, and not-found states. Adding SHALL be unavailable until a valid product and price are loaded. Controls SHALL support keyboard interaction and visible focus; quantity changes SHALL be announced accessibly. Text and controls SHALL remain usable at 200% desktop zoom; horizontal scrolling is permitted. Responsive/mobile layouts are deferred.

#### Scenario: Failed request and stale product

- **WHEN** loading a product fails, or navigation changes from product A to product B before A completes
- **THEN** no stale or invalid product can be added, a failure offers retry, and A's late response cannot replace B
