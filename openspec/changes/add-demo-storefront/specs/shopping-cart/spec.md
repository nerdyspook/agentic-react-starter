# Shopping cart

## Purpose

Maintain a consistent cart across storefront navigation, show exact demo totals, and let shoppers remove items or complete a simulated checkout.

## ADDED Requirements

### Requirement: Shared cart and header count

Every storefront page SHALL have a cart link showing the sum of quantities, including zero when empty. Cart lines SHALL retain product identity, name, slug, image, unit price, and quantity across client-side navigation. The proposed demo SHALL start with an empty cart after a full reload.

#### Scenario: Unit count across routes

- **WHEN** product A has quantity 2 and product B has quantity 1
- **THEN** every header shows count 3, the cart has two lines, and visiting listing and detail routes preserves those quantities
- **AND** a full reload starts a new empty demo cart

#### Scenario: Added items appear in the cart

- **WHEN** a shopper adds a product from its details and opens `/cart`
- **THEN** the cart shows that product's name, image or fallback, unit price, quantity, line total, and cart total
- **AND** the cart does not show the empty-state message while it contains items

### Requirement: Cart quantity controls

Each cart line SHALL provide visibly labeled increase and decrease buttons. Increase SHALL add one unit; decrease SHALL subtract one unit when quantity exceeds 1 and SHALL be disabled at 1. Changing quantity SHALL immediately update the line total, cart total, shared header unit count, and detail quantity without duplicating the line. A missing line action SHALL be a no-op. Unsafe quantity or total arithmetic SHALL leave the cart unchanged and show an understandable error.

#### Scenario: Increase and decrease

- **WHEN** a product priced at 19.99 has quantity 2 and its increase button is activated
- **THEN** quantity becomes 3 and its line total becomes 59.97
- **AND** decreasing twice produces quantity 1 and line total 19.99, with decrease disabled; Remove remains available

#### Scenario: Quantity updates across routes

- **WHEN** the shopper changes quantity in cart and returns to that product's details
- **THEN** the displayed quantity equals the cart quantity and the header reports the sum of all line quantities
- **AND** rapid successive increases are retained without duplicate lines or lost updates

### Requirement: Removal and clearing

The cart at `/cart` SHALL provide removal of an entire product line and clearing of all lines. Changes SHALL update line totals, cart total, detail quantities, and the header count consistently. An empty cart SHALL show a catalog link and disable or omit checkout and clear actions.

#### Scenario: Remove and clear

- **WHEN** a line with quantity 2 is removed from a cart also containing another line of quantity 1
- **THEN** only the other line remains and the count is 1
- **AND** clearing it produces the empty state, zero total, and zero count

### Requirement: Exact monetary totals

The cart SHALL display currency-formatted unit prices, line totals, and the sum of line totals using exact minor-unit arithmetic in one configured demo currency. Invalid prices, mixed currencies, invalid quantities, or unsafe arithmetic SHALL NOT produce a purchasable line or a misleading total. Zero-price products SHALL be allowed.

#### Scenario: Decimal arithmetic

- **WHEN** the cart contains three units at 19.99 and two units at 0.10
- **THEN** line totals are 59.97 and 0.20 and the checkout total is 60.17 in the configured currency

#### Scenario: Invalid values and free products

- **WHEN** an add would use a negative or malformed price, a nonpositive or fractional quantity, a different currency, or arithmetic outside safe integer bounds
- **THEN** the mutation is rejected, the cart remains unchanged, and the shopper receives an understandable error
- **AND** a valid zero-price product can be added and included in demo checkout

### Requirement: Demo checkout success

Checkout of a nonempty valid cart SHALL display a clearly labeled simulated success with the amount captured at the time of checkout, then clear the cart. It SHALL collect no payment details and make no payment request. Empty-cart checkout SHALL be unavailable, and repeated activation SHALL NOT create a second success from the same cart.

#### Scenario: Captured amount survives clearing

- **WHEN** checkout is activated for a cart totaling 60.17
- **THEN** success displays 60.17 in the configured currency even though the cart and header count have reset to zero
- **AND** success remains visible on the cart page until dismissed or the shopper leaves it

#### Scenario: Empty or repeated checkout

- **WHEN** an empty cart is opened or checkout is activated again after success
- **THEN** no new checkout occurs and no false zero-amount purchase is reported

### Requirement: Accessible cart feedback

Increase/decrease, removal, clear, and checkout controls SHALL be keyboard-operable with visible focus and descriptive labels. Updates and success SHALL be announced accessibly. Removing the focused line SHALL move focus to the next sensible cart control or empty-cart heading. Text and controls SHALL remain usable at 200% desktop zoom; horizontal scrolling is permitted. Responsive/mobile layouts are deferred.

#### Scenario: Remove last line with keyboard

- **WHEN** a keyboard user removes the final cart line
- **THEN** focus moves to the empty-cart heading or catalog link and the empty state and count are announced
