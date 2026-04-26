# Changelog

All notable product-level changes are tracked here. Per-package details live in [`backend/CHANGELOG.md`](backend/CHANGELOG.md) and [`frontend/CHANGELOG.md`](frontend/CHANGELOG.md).

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] — 2026-04-26

🛠️ **Monorepo tooling, versioning workflow, and full documentation pass.** Product code (backend API + frontend UI) is unchanged — both stay on `1.0.0`. This release is purely about developer experience around the monorepo.

### Added
- **Root orchestration scripts** — `npm install` at the root now installs all three packages via a `postinstall` hook; `npm start` (and its `npm run dev` alias) boots backend + frontend together via [`concurrently`](https://www.npmjs.com/package/concurrently) with colored prefixes; `npm run start:backend` / `start:frontend` to run each side in isolation.
- **Independent per-package versioning** — `backend/`, `frontend/`, and root each track their own version. Each `package.json` exposes short `npm run patch` / `minor` / `major` scripts that wrap `npm version <level> --no-git-tag-version`.
- **Three CHANGELOG.md files** following [Keep a Changelog](https://keepachangelog.com/) — root (this file, release-level summary), [`backend/CHANGELOG.md`](backend/CHANGELOG.md), [`frontend/CHANGELOG.md`](frontend/CHANGELOG.md). Initial `[1.0.0]` entries documented retroactively.
- **[CLAUDE.md](CLAUDE.md)** — architectural notes and conventions for AI coding tooling, including the auth token storage gotcha, the route -> controller -> SQL pipeline, and changelog discipline.
- **Backend [README.md](backend/README.md)** — created from scratch with full API reference (~30 endpoints across 6 domains), env/config requirements, auth flow, data model, and conventions.
- **Frontend [README.md](frontend/README.md)** — replaced the default Vite template with project-specific docs: page structure, routes table, ⚠️ auth token gotcha, conventions, known oddities.
- **Root [README.md](README.md)** — rewritten as a welcoming entry point: project description, feature table, quick start TL;DR, structure with cross-links, scripts cheat sheet, versioning workflow.

### Changed
- Stopped tracking `.idea/` editor files — added to `.gitignore` and untracked from the index.
- Added `.claude/` to `.gitignore` to keep local AI-tool state out of the repo.

### Tooling notes
- Root and sub-package versions are deliberately **not** synced — bumping the frontend does not bump the backend.
- Tag conventions: `v1.1.0` for root releases, `frontend-v1.x.y` and `backend-v1.x.y` for per-package releases.

## [1.0.0] — 2026-04-26

🎉 **Initial public release.**

A working full-stack cooking-management platform — register, build a pantry, write recipes, plan menus with auto-generated shopping lists, and export cooking analytics to PDF.

### Added
- **Authentication** — registration + login with bcrypt-hashed passwords and JWT (24h expiry).
- **Recipe management** — full CRUD, ingredients with quantities & units, cooking time, servings, type filtering.
- **Recipe types** — Breakfast / Lunch / Dinner-style categorization, fully manageable from the UI.
- **Smart pantry** — per-user ingredient inventory with quantities, purchase dates, expiration windows, allergens, seasonality, and storage conditions.
- **Purchase history** — append-only audit log of every ingredient purchase, queryable per ingredient.
- **Menu planning** — bundle multiple recipes into Breakfast / Lunch / Dinner menus.
- **Smart "missing ingredients" detection** — when planning a menu, the app subtracts your pantry and tells you what to buy.
- **Analytics + PDF export** — recipe statistics page with charts (`apexcharts`) and downloadable PDF reports (`@react-pdf/renderer`, `jspdf`).
- **Filtering** — by type, ingredients, cooking time, creation date — across the community feed or a single user's recipes.
- **Monorepo orchestration** — single `npm install` + `npm start` from the root boots backend and frontend together via `concurrently`.

### Tech
- Frontend: React 18, TypeScript, Vite 5, React Router v6, Tailwind CSS, axios, ApexCharts.
- Backend: Node.js, Express 4, PostgreSQL via `pg`, JWT, bcrypt.
- Database: PostgreSQL 14+, schema and seed in [`backend/database.sql`](backend/database.sql).

See [`backend/CHANGELOG.md`](backend/CHANGELOG.md) and [`frontend/CHANGELOG.md`](frontend/CHANGELOG.md) for per-package details.

[Unreleased]: https://github.com/PershynaMilana/cooking-assistant/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/PershynaMilana/cooking-assistant/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/PershynaMilana/cooking-assistant/releases/tag/v1.0.0
