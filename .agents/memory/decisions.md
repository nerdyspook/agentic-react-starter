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

## D004 — OpenSpec-only planning

Status: Accepted — 2026-10-05
Decision: Use OpenSpec as the sole owner of requirements, design, and implementation
tasks; remove BMAD skills and runtime. Use the existing review-change skill for
requested reviews, and keep TASK.md for session progress.
Reason: One planning workflow avoids overlapping guidance and maintenance while
preserving milestone boundaries and the existing review and verification tools.
Details: Keep the built-in spec-driven schema and concise artifact rules in
openspec/config.yaml. No active OpenSpec change or separate design document exists
for this starter harness cleanup.
