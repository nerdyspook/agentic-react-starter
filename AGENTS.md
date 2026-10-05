# Project instructions

## Stack

React, TypeScript, Vite and pnpm.
Vitest is the only automated testing library.

## Commands

- Development: pnpm run dev
- Tests: pnpm run test
- Full checks: pnpm run check
- Formatting: pnpm run format

## Working preferences

- Explain meaningful decisions in plain language.
- Prefer small changes that I can inspect and understand.
- State assumptions that affect implementation.
- Use the project's package manager; prefer pnpm for new projects.
- Report which checks actually ran and their results.
- When teaching, explain the reasoning behind the code.

## Workflow

1. Read the active OpenSpec change, when present.
2. Clarify requirements that materially affect the solution.
3. Identify the current milestone and its acceptance criteria.
4. Implement only the requested milestone.
5. Test relevant logic and provide browser verification steps.
6. Run checks, summarize the diff, and stop for my review.
7. Commit only when requested.

Before implementation, briefly explain material concerns, assumptions, and tradeoffs.
Challenge proposals when there is a concrete reason, and suggest a practical alternative.
Ask for clarification when a decision materially affects scope or behavior.

Do not stage or unstage files unless I explicitly request it.
Preserve any existing staged changes.

## Focused guidance

Before changing React or TypeScript, read
.agents/rules/react-typescript.md.

Before writing tests, read .agents/rules/testing.md.

Before changing UI, read .agents/rules/accessibility.md.

## Planning and review

OpenSpec is the sole planning workflow and owns requirements, design, and implementation tasks.
Use the existing review-change skill when review is requested.

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

- Read .agents/memory/decisions.md.
- Read the relevant OpenSpec documents for the active change.
- Check remembered facts against the current code and configuration.
- Surface conflicts rather than silently relying on stale information.

After completing a milestone:

- Report progress, actual verification results, and next steps in the response.
- Update .agents/memory/decisions.md only when a consequential decision has been made.
- Record its reason; distinguish proposed decisions from accepted ones.
- Mark replaced decisions as superseded.
- Link to OpenSpec design details instead of duplicating them.
