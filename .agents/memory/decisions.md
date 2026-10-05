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
requested reviews.
Reason: One planning workflow avoids overlapping guidance and maintenance while
preserving milestone boundaries and the existing review and verification tools.
Details: Keep the built-in spec-driven schema and concise artifact rules in
openspec/config.yaml. No active OpenSpec change or separate design document exists
for this starter harness cleanup.
History: The original requirement for a separate session-progress file is
superseded by D005.

## D005 — Keep feature progress in OpenSpec

Status: Accepted — 2026-10-05
Decision: Remove the standalone session-progress file from the starter. Keep
feature implementation tasks in the active OpenSpec change and report progress,
actual verification results, and next steps in the response.
Reason: Avoid duplicate tracking and carrying setup history into new projects.
Supersedes: D004's requirement for a separate session-progress file.

## D006 — Keep shared working preferences in root instructions

Status: Accepted — 2026-10-05
Decision: Keep shared working preferences directly in root AGENTS.md and remove
the separate tool-specific preferences file.
Reason: Include the preferences with project instructions and avoid a separate
file-reading step.
