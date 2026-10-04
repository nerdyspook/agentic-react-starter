# Project instructions

## Stack

React, TypeScript, Vite and pnpm.
Vitest is the only automated testing library.

## Commands

- Development: pnpm run dev
- Tests: pnpm run test
- Full checks: pnpm run check
- Formatting: pnpm run format

## Workflow

At the start of each task, read .codex/AGENTS.md for additional working preferences.

1. Read TASK.md and the active OpenSpec change, when present.
2. Clarify requirements that materially affect the solution.
3. Identify the current milestone and its acceptance criteria.
4. Implement only the requested milestone.
5. Test relevant logic and provide browser verification steps.
6. Run checks, summarize the diff, and stop for my review.
7. Commit only when requested.

## Focused guidance

Before changing React or TypeScript, read
.agents/rules/react-typescript.md.

Before writing tests, read .agents/rules/testing.md.

Before changing UI, read .agents/rules/accessibility.md.

## Planning and review

OpenSpec owns requirements, design decisions and implementation tasks.
BMAD supplies requested critique or review.
TASK.md holds session progress, not a duplicate specification.

Use subagents when requested or when an invoked skill requires them.
Keep one writer per file.
Preserve framework-managed files.

## Project-local tooling

OpenSpec is installed as a project development dependency.

Run all OpenSpec CLI commands from the project root using:
pnpm exec openspec <arguments>

Use this form even when a skill shows a bare openspec command.
Keep tool installations project-local unless I explicitly request otherwise.

## Project memory

Before planning or implementation:

- Read .agents/memory/decisions.md and TASK.md.
- Read the relevant OpenSpec documents for the active change.
- Check remembered facts against the current code and configuration.
- Surface conflicts rather than silently relying on stale information.

After completing a milestone:

- Update TASK.md with progress, actual verification results, and next steps.
- Update .agents/memory/decisions.md only when a consequential decision has been made.
- Record its reason; distinguish proposed decisions from accepted ones.
- Mark replaced decisions as superseded.
- Link to OpenSpec design details instead of duplicating them.
