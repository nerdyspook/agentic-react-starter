---
name: safe-refactor
description: Simplify existing code while preserving its observable behaviour.
---

1. Read the relevant implementation and tests.
2. State the behaviour that must stay the same.
3. Run the relevant tests to establish a baseline.
4. Make the smallest useful refactor.
5. Run pnpm run check.
6. Explain what became simpler and how behaviour was verified.
7. Keep new features outside this refactor.
