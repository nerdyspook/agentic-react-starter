# Everyday Store

A desktop demo storefront built on the React + TypeScript + Vite starter, with
React Router, Tailwind, React Compiler, and Vitest.

Milestones 1–2 implement the shell, image-card catalog, URL search/filter/sort,
always-visible numbered pagination, basic details, and dummy JSON request states.
The image gallery, cart mutations, and demo checkout remain later milestones in
[the OpenSpec tasks](openspec/changes/add-demo-storefront/tasks.md).

## Requirements

- Node.js 24.x. The verification environment uses Node.js 24.18.0.
- pnpm 11.23.0, pinned in `package.json` through `packageManager`.

Make those tools available in your terminal before installing dependencies. Check
them with `node --version` and `pnpm --version`.

## Run locally

1. Open a terminal in the project root and install the locked dependencies:

   ```sh
   pnpm install --frozen-lockfile
   pnpm run check
   pnpm run dev
   ```

2. Open the local URL printed by Vite. `/` redirects to `/products`.
3. Open `/products/everyday-mug-large` directly to inspect a product, or `/cart`
   for the empty cart shell. Unknown slugs and routes have recovery links.

OpenSpec is already configured in this starter. Its CLI is installed with the
development dependencies; a global OpenSpec installation is unnecessary.

## Commands

Run commands from the project root.

| Command               | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `pnpm run dev`        | Start the development server.                                 |
| `pnpm run test`       | Run the Vitest logic tests once.                              |
| `pnpm run test:watch` | Run tests as files change.                                    |
| `pnpm run typecheck`  | Check TypeScript with the project configuration.              |
| `pnpm run lint`       | Run ESLint with no warnings allowed.                          |
| `pnpm run build`      | Check TypeScript and build the application into `dist/`.      |
| `pnpm run preview`    | Serve the existing production build locally.                  |
| `pnpm run format`     | Format maintained files with Prettier.                        |
| `pnpm run check`      | Run lint, tests, the production build, and formatting checks. |

## Dummy product contract

`public/data/products.json` is an array of `{ id, slug, name, category, image,
price, currency }`. Each `public/data/products/<slug>.json` contains `{ id, slug,
name, category, images, description, pricing: { amount, currency } }`.

IDs and lowercase kebab-case slugs are unique and agree across list/detail files.
Names and categories are nonempty strings. Prices are nonnegative decimal strings
with at most two decimal places; currency is USD. Empty image strings, image arrays,
and descriptions are valid and show fallbacks. Invalid records fail the request
instead of silently disappearing or becoming zero-price products.

`useProducts(query)` and `useProduct(slug)` call the product API module, which fetches
JSON with `Accept: application/json`, validates unknown input, and converts amounts
to integer cents. The JSON Accept header prevents Vite's SPA fallback from turning
missing files into successful HTML responses. A missing detail returns not-found;
a missing catalog is an error. Hooks abort obsolete requests, ignore late results,
and expose loading/error/retry states. The listing hook derives search/filter/sort
results and pages from the full catalog; changing query controls does not refetch
JSON. Presentational components do not fetch separately.

The catalog contains 49 dummy variants across home and stationery, including
equal prices, a free sampler, and 25 home mugs within $10–$50 for combined
search/filter pagination checks. Variants share three reference images; they do not
represent real inventory. Local 640 × 640 WebP assets were downloaded from Unsplash:
[mug](https://images.unsplash.com/photo-1514228742587-6b1558fcca3d),
[stool](https://images.unsplash.com/photo-1503602642458-232111445657), and
[notebook](https://images.unsplash.com/photo-1531346878377-a5be20888e57).

## Catalog controls

The URL owns applied `q`, `category`, `minPrice`, `maxPrice`, `sort`, and `page`.
For example:

```text
/products?q=mug&category=home&minPrice=10&maxPrice=50&sort=price-desc&page=2
```

This demo query matches 25 products across three pages (12/12/1). The full catalog
has five pages (12/12/12/12/1). Search matches product names literally, ignoring case
and outer whitespace. Type a draft, then press Enter or Search; typing alone does
not apply it. Apply filters submits category and inclusive USD price bounds.
Reversed or invalid input shows an error without changing the URL.

Changed criteria reset to page 1; unchanged submissions leave the page/history
alone. Clear search preserves filters; Reset filters preserves search. Both retain
sort and unrelated URL fields. No results offers Clear search and filters.
Back/Forward and reload restore applied controls; navigation discards unsaved drafts.
Invalid URL fields normalize with history replacement, and pages clamp after loading.

Pagination is always rendered, including empty, loading, and failed requests.
With zero or one page, page 1 stays visible and both directions are disabled.
During loading/failure, the requested page remains visible with unavailable totals;
navigation is disabled until valid data arrives. Pagination is not sticky.

## Demo limits

The UI currently targets desktop; mobile layouts and responsive reflow are
deferred. The header count stays at 0 until the shared cart milestone. The planned
cart is memory-only and resets on reload. Checkout will be simulated, with no
payment, order, tax, shipping, authentication, or stock service. Deployment is
outside this change; any future host must serve JSON/media normally and support
SPA fallback for application routes.

## Testing and browser checks

Vitest runs `src/**/*.test.ts` in Node. Tests import the same decoding, request,
and money functions used by the UI. The existing `isNonEmpty` utility now validates
required product strings.

| Test file          | Cases and failures prevented                                                                                                                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `money.test.ts`    | Exact 19.99 → 1999, free/whole/fractional prices, malformed values, safe-integer boundary, and currency formatting; catches rounding and coercion bugs.                                                                                                           |
| `products.test.ts` | Normal/empty data, media fallbacks, malformed fields, duplicate identity, wrong currencies, all 49 list/detail pairs, and WebP headers; catches invalid records and fixture drift.                                                                                |
| `catalog.test.ts`  | URL defaults/invalid/duplicate params, literal search, independent resets, combined constraints, numeric sorts/ties, exact form prices, 0/1/12/13/25/49 page boundaries, and filtering before slicing; prevents history/query loss and incorrect page membership. |
| `api.test.ts`      | HTTP success/failure, missing/invalid/mismatched slugs, malformed JSON, retry, abort, and Vite HTML fallback; catches incorrect not-found/error classification and broken cancellation forwarding.                                                                |

Each test name describes its inputs or situation, expected behavior, and the
failure it guards against. Monetary expectations are literal independently
calculated amounts. Fixture comparisons check consistency rather than recalculating
business results through the implementation.

The current configuration does not discover `.test.tsx` files or provide a DOM
environment, rendered React component tests, or browser automation. Adapt the
testing setup when a project's requirements call for those capabilities.

Browser verification is separate from logic tests. At 1280 × 800:

1. Open and reload `/products`, `/products/everyday-mug-large`,
   `/products/example-slug`, `/cart`, and `/unknown`. Check matching content,
   recovery links, and Cart 0.
2. Use Tab/Shift+Tab and Enter on header/product/recovery links. Check visible
   focus, the skip link, and focus moving to the main content after navigation.
3. In browser network tools, block a JSON request, reload, unblock it, and choose
   Try again. Throttle a detail request and navigate away before it finishes;
   verify loading is understandable and the late result cannot replace the new page.
4. Set browser zoom to 200%; inspect text and controls, allowing horizontal
   scrolling for this desktop iteration. Restore zoom afterward.
5. Search for `  MUG  ` with Enter; apply home/$10–$50 and price descending.
   Verify 25 matches, pages 1–3, 12/12/1 products, and URL composition. Navigate
   Back/Forward and reload. Clear search and Reset filters independently.
6. Try an unknown category, unmatched search, reversed range, and literal `+`.
   Verify useful recovery, no invalid form submission, and pagination still visible.
   Block catalog/image requests and try an empty catalog; verify retry/fallbacks and
   visible disabled pagination. Use keyboard controls and verify visible focus.
7. Check the console; intentional failed requests may produce expected network
   errors, but normal routes should have no application errors.

Actual milestone results are recorded in
[the verification record](openspec/changes/add-demo-storefront/verification.md).

## Agent instructions and project memory

- `AGENTS.md` contains working preferences, coding rules, and the project workflow.
- `.agents/memory/decisions.md` records accepted consequential decisions and links
  to OpenSpec design details.
- `.agents/skills/` contains the OpenSpec workflows and the local review, testing,
  and refactoring skills.
- `.codex/agents/frontend_reviewer.toml` defines a reviewer for frontend milestones.
  The `review-change` skill delegates to this reviewer.
- `.codex/config.toml` contains project-scoped Codex settings.

Open the project root in Codex and start a fresh session after changing its
instructions or agent configuration. The reviewer is configured for read-only
work; see the [Codex custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)
for discovery and configuration details. The application commands also work
without an AI coding tool.

## OpenSpec workflow

The active change is `add-demo-storefront`; its delta specs remain under that
change until archival. `openspec/config.yaml` defines the shared artifact rules.

In Codex, invoke the installed skills in chat:

1. Use `$openspec-explore` when requirements need discussion.
2. Use `$openspec-propose` with a feature description to create the proposal,
   specifications, design, and tasks. Review those artifacts before implementation.
3. Use `$openspec-apply-change <change-name>` to implement the requested milestone.
   Use `$openspec-update-change` if the agreed plan needs revision.
4. Run the relevant checks and request `$review-change` when ready for review.
   `$test-behavior` and `$safe-refactor` support focused testing and refactoring work.
5. Use `$openspec-archive-change <change-name>` when implementation and verification
   are complete. Use `$openspec-sync-specs` when specifications need syncing before
   archiving.

Useful CLI checks:

```sh
pnpm exec openspec doctor --json
pnpm exec openspec list --json
pnpm exec openspec validate --all --strict --no-interactive
```

Always use `pnpm exec openspec` for CLI commands. An empty starter has no feature
specifications to validate; successful validation with no items does not verify
application behavior.

## Editor setup

The checked-in VS Code settings enable format-on-save with the Prettier extension
(`esbenp.prettier-vscode`) and point TypeScript to the workspace installation.
Install the extension and select the workspace TypeScript version in the editor.
The **Check project** task runs `pnpm run check`.
