# Project decisions

## Accepted — 2026-10-06 storefront foundation

- Use dummy JSON products and defer responsive/mobile layouts, as explicitly
  requested by the user. Local HTTP-served fixtures keep custom hooks and request
  states meaningful without adding a backend.
- Carry forward the current proposal's defaults under the implementation request:
  USD with exact integer-cent calculations, WebP assets, and the documented URL
  and future cart behavior. Shared cart and checkout remain later milestones.
- Request JSON explicitly so missing data files produce 404 rather than Vite's
  SPA HTML fallback. A failing regression test demonstrated the issue before fixing.

Architecture and tradeoffs: [storefront design](../../openspec/changes/add-demo-storefront/design.md).
Verification and the pending native zoom check: [milestone 1 record](../../openspec/changes/add-demo-storefront/verification.md).

## Accepted — 2026-10-06 catalog revision

- The user's apply request approves the revised catalog plan: 49 demo products,
  submitted name search in `q`, separate category/price filters, and URL-owned
  applied criteria. Selection stays client-side so query changes reuse the fetched
  JSON; unsubmitted form drafts reset on navigation.
- Pagination remains rendered in every listing state, as explicitly requested.
  Unavailable navigation is disabled; unknown totals are labeled rather than
  fabricated. This is a layout requirement, not sticky positioning.
- Continue one milestone per review. Catalog implementation is delivered; native
  200% zoom remains unverified. Cart additions belong to milestone 3.

Details and evidence: [design](../../openspec/changes/add-demo-storefront/design.md)
and [verification](../../openspec/changes/add-demo-storefront/verification.md).

Record consequential decisions, their reasons, and tradeoffs.
Distinguish proposed decisions from accepted ones.
Link to relevant OpenSpec documents.
Mark replaced decisions as superseded.
