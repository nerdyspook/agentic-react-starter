# Agentic React Starter

A reusable starting point for React + TypeScript applications built with Vite and
pnpm. It includes React Compiler, ESLint, Prettier, Vitest, and a project-local
OpenSpec workflow. The initial page is deliberately minimal.

This starter targets this frontend stack. Choose routing, data fetching, a design
system, backend services, and deployment for the application you are building.

## Requirements

- Node.js 24.x. The verification environment uses Node.js 24.18.0.
- pnpm 11.23.0, pinned in `package.json` through `packageManager`.

Make those tools available in your terminal before installing dependencies. Check
them with `node --version` and `pnpm --version`.

## Start a new project

1. Create a new repository from this starter, including its hidden configuration
   directories and `pnpm-lock.yaml`. If copying files manually, leave behind the
   original `.git`, `node_modules`, and `dist` directories.
2. Open a terminal in the new project root and install the locked dependencies:

   ```sh
   pnpm install --frozen-lockfile
   pnpm run check
   pnpm run dev
   ```

3. Open the local URL printed by Vite. The page should display **Ready to build**.
4. Follow the new-project checklist below before adding application features.

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

## New-project checklist

- Change `name` in `package.json` and the page title in `index.html`.
- Replace `public/favicon.svg` with the application's icon, updating its link in
  `index.html` if the filename changes.
- Review `AGENTS.md` and `openspec/config.yaml` for the new project's conventions
  and requirements.
- Start `.agents/memory/decisions.md` without previous project or starter-maintenance
  history. Add consequential decisions as the new project makes them.
- Replace the initial page and the example utility/test as real application
  behavior is introduced. Keep meaningful tests in place.
- If the application needs environment variables, document their names and safe
  placeholder values in `.env.example`. Local `.env` files are Git-ignored.
- Run `pnpm run check`, inspect the application in a browser, and choose the
  project's deployment and CI configuration.

## Testing and browser checks

Vitest runs `src/**/*.test.ts` in a Node environment. The included `isNonEmpty`
utility and its tests demonstrate a normal value, an empty string, and
whitespace-only input. They exercise test wiring and example logic; the initial
page does not call this utility.

The current configuration does not discover `.test.tsx` files or provide a DOM
environment, rendered React component tests, or browser automation. Adapt the
testing setup when a project's requirements call for those capabilities.

Record browser checks separately from automated results. At minimum, inspect the
page at a narrow viewport and 200% zoom, check the browser console, and test
keyboard navigation and visible focus for interactive controls. The initial page
contains no interactive controls.

## Agent instructions and project memory

- `AGENTS.md` contains working preferences, coding rules, and the project workflow.
- `.agents/memory/decisions.md` starts with instructions only. Record project
  decisions and their reasons there, linking to OpenSpec design details when useful.
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

The `openspec/specs/` and `openspec/changes/` directories start without project
specifications or changes. `openspec/config.yaml` defines the shared artifact rules.

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
