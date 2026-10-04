# Project decisions

Record consequential decisions and their reasons.
Keep entries short. Mark replaced decisions as superseded.

## D001 — Application stack

Status: Accepted
Decision: Use React, TypeScript, and Vite.
Reason: React is familiar; TypeScript makes data contracts explicit.
Tradeoff: Keep TypeScript straightforward enough to explain and debug.

## D002 — Package management

Status: Accepted
Decision: Use pnpm and keep development tools project-local.
Reason: Versions can be recorded in package.json and pnpm-lock.yaml.
Usage: Run OpenSpec with `pnpm exec openspec`.

## D003 — Testing

Status: Accepted
Decision: Use Vitest for application logic and manual browser checks for UI.
Reason: Start with one testing library that I can understand confidently.
Tradeoff: Browser interactions are not covered by these logic tests.
