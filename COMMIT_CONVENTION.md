# InkFlow Commit Convention (for agents and humans)

Standard: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
Language: English, imperative mood ("add", not "added").

## 1. Format

```txt
<type>(<scope>): <subject>

<body>

<footer>
```

- Header max 72 characters, no trailing period, lowercase subject.
- Body is optional. Explain **why** and notable decisions, wrapped at ~80 columns.
- Footer is optional: `BREAKING CHANGE: ...`, `Refs: #123`.

## 2. Types

| Type | Use for |
|---|---|
| `feat` | New user-visible capability |
| `fix` | Bug fix, including accessibility fixes |
| `docs` | Documentation only (README, docs/, AGENTS.md) |
| `style` | Formatting only, no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Add or change tests |
| `build` | Dependencies, package.json, lockfile, build config |
| `ci` | CI configuration |
| `chore` | Maintenance, scripts, repo housekeeping |
| `revert` | Revert a previous commit |

## 3. Scopes

Use one scope. Omit it if the change is truly cross-cutting.

`home`, `explore`, `story`, `reader`, `author`, `nav`, `ui`, `data`, `art`, `tokens`, `a11y`, `qa`, `e2e`, `deps`, `config`

Library only: do not add Studio, Canon, billing or AI scopes until those surfaces exist.

## 4. Examples

```txt
fix(a11y): add role to completed status dot
feat(reader): persist appearance settings in local storage
feat(data): add typed mock repository for 20 stories
test(e2e): cover discover to author journey
docs(qa): add final QA report with performance results
build(deps): pin next, react and tailwind versions
chore(art): add cover generation scripts
```

Breaking change example:

```txt
refactor(data)!: rename StorySummary.lastPublishedAt

BREAKING CHANGE: consumers must read latestChapterAt instead.
```

## 5. Rules for agents

1. **One logical change per commit.** Do not mix features, fixes, docs and dependency changes.
2. **Only commit when the user asks** (or an approved plan says so). **Never push**, force-push, amend published commits or create PRs unless explicitly told.
3. **Check before commit:** `git status` and `git diff --staged`. Stage files by explicit path, never `git add -A` blindly.
4. **Run checks first** when code changed: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`. On Windows PowerShell use `npm.cmd`, not `npm`. Do not commit code that fails these checks unless the user accepts it and the body says so.
5. **Never use `--no-verify`**, never rewrite history without permission.
6. **Never commit:** `.env*` (except `.env.example`), `node_modules/`, `.next/`, `test-results/`, `playwright-report/`, `*.log`, `*.tsbuildinfo`, `.artwork-staging/`, credentials or tokens. Check `.gitignore` before staging.
7. **Honest messages:** describe what changed, not what was hoped. Do not claim tests passed in the message unless they were run.
8. **No Studio/private content** in commit messages or files (see AGENTS.md section 1).
9. Large generated assets (covers, screenshots) go in their own `chore(art)` or `docs(qa)` commit.

## 6. Suggested commit order for the initial FE import

1. `docs: add product foundation and agent guides` (AGENTS.md, design.md, screens.md, architecture.md, mock-contracts.md, content-library.md, FRONTEND_IMPLEMENTATION_PLAN.md, docs/implementation-decisions.md, docs/reference)
2. `build: scaffold next.js app with tailwind and test tooling` (package.json, lockfile, tsconfig, eslint, postcss, next/vitest/playwright config, .gitignore)
3. `feat(data): add typed library contracts and mock catalog`
4. `chore(art): add original cover artwork and generation scripts` (public/mock, scripts)
5. `feat(ui): add tokens, shell and public library routes` (src/app, src/components, src/features, src/styles)
6. `test: add unit and e2e coverage for library`
7. `docs(qa): add screenshots and qa reports`
8. `docs: add frontend run instructions to readme`

Skip or merge steps if a group has no changes. Later fixes use their own `fix(...)` commits.

## 7. Before finishing

- `git log --oneline -n 10` to confirm messages read well.
- `git status` should show no unintended leftovers.
- Report the commit hashes to the user. Do not push.
