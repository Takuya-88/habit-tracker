# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/` and is grouped by feature (e.g., `src/core/`, `src/ui/`, `src/api/`).
- Tests mirror the source layout in `tests/` (e.g., `tests/ui/` for `src/ui/`).
- Developer utilities in `scripts/` (setup, data seeding, local tooling).
- Static assets in `public/` (for web) or `assets/` (for apps/libraries).
- Configuration at the repo root (e.g., `.env.example`, `Makefile`, `package.json` or `pyproject.toml`).

## Build, Test, and Development Commands
- `make setup` — install dependencies (e.g., `npm ci` or `uv/poetry install`).
- `make dev` — run the app locally with watch/reload.
- `make test` — run unit tests with coverage.
- `make lint` — run formatter and linter.
- `make build` — create a production build.
If no Makefile, use language-native equivalents (e.g., `npm run dev/test/lint/build` or `pytest -q`).

## Coding Style & Naming Conventions
- Indentation: 2 spaces by default; use 4 for Python.
- Filenames: kebab-case for JS/TS; snake_case for Python; directories kebab-case.
- Prefer small, single-purpose modules; avoid cyclic imports.
- Default tooling (add config on first use): JS/TS → ESLint + Prettier; Python → Ruff + Black.

## Testing Guidelines
- Frameworks: JS/TS → Vitest/Jest; Python → pytest.
- Place tests under `tests/`; name as `*.test.ts|js` or `test_*.py`.
- Target ≥ 80% line coverage; test behavior, edges, and error paths.
- Keep tests fast and deterministic; use fixtures and test helpers in `tests/_helpers/`.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Example: `feat(auth): add session refresh`.
- Keep subject ≤ 72 chars; include a clear body explaining the “why”.
- PRs must include: what/why, linked issues, screenshots for UI, and tests/docs for changes.
- Ensure CI passes and code is formatted/linted before requesting review.

## Security & Configuration
- Never commit secrets; use `.env.local` (git-ignored) and provide `.env.example`.
- Pin dependency versions and upgrade via PRs.
- Validate inputs at boundaries (API, CLI, forms); fail closed by default.

## Agent-Specific Instructions
- Obey this file’s conventions; prefer minimal, surgical changes.
- Use existing scripts (`make …`) rather than inventing new entrypoints.
- Update docs and tests with behavior changes; avoid broad refactors.
- Do not add license headers or change file headers unless requested.
