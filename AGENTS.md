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

## React and TypeScript

Apply when creating or modifying React or TypeScript code.

- Before adding a function, hook, or component, search for existing code that meets the requirement. Reuse or extend it when appropriate.
- Use understandable components and explicit props.
- Follow the project's existing design system, shared components, and styling conventions. If none exists, keep new UI consistent with established patterns.
- Keep rendering pure; perform side effects in event handlers or Effects, not during render.
- Treat props and state as immutable; create new objects and arrays when updating them.
- Call state and effect Hooks at the top level of React function components or custom Hooks, before early returns.
- Keep state close to the component that owns it.
- Derive values instead of storing duplicate state.
- Use Effects to synchronize with external systems; calculate derived values during render and handle user actions in event handlers.
- Include every reactive Effect dependency and clean up subscriptions, timers, or other resources when needed.
- Use functional state updates when the next value depends on the old one.
- Avoid any; narrow unknown external values before using them.
- Keep business calculations in functions that the UI actually calls.
- Prefer focused functions with clear names and straightforward control flow. Introduce abstractions only when they simplify the current requirements.

## Testing

Apply when creating or modifying tests.

- Use Vitest and explicit imports from vitest.
- Test observable behaviour of application logic.
- Include relevant normal, boundary and invalid-input cases.
- Calculate expected answers independently of the implementation.
- For bug fixes, demonstrate a failing regression test before fixing.
- Start with simple test and expect statements.
- Explain each test's input, expected result and the bug it would catch.
- Record UI checks separately; logic tests do not verify rendered behaviour.

## Accessibility and UI checks

Apply when creating or modifying user interfaces.

- Use semantic buttons, links, headings and form elements.
- Give form controls visible labels.
- Preserve visible keyboard focus.
- Make loading, empty, error and success states understandable.
- Check keyboard navigation and a narrow viewport in the browser.

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
