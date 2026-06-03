# Backend Changelog

Changes to the Express + PostgreSQL API server. This file tracks **only** backend changes — frontend changes live in [`../frontend/CHANGELOG.md`](../frontend/CHANGELOG.md).

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] — 2026-06-03

### Security
- **`backend/.env` is no longer tracked by git** — removed from version control (`git rm --cached`) and added to `.gitignore`, so the `JWT_SECRET_KEY` is no longer committed. Your local `.env` keeps working unchanged; a fresh clone no longer ships the secret.

### Added
- **[`.env.example`](.env.example)** — template listing every required environment variable (`JWT_SECRET_KEY`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `PORT`). On a fresh checkout, copy it to `.env` and fill in real values.

### Changed
- **Database credentials are now read from environment variables** in [`db.js`](db.js) (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`) instead of being hardcoded. The previous hardcoded values remain as fallback defaults, so existing setups need no changes.

## [1.1.0] — 2026-04-26

🛠️ Tooling and documentation pass — **no API or schema changes**. Existing endpoints, request/response shapes, and database structure are untouched. Safe to upgrade without any client work.

### Added
- **[CHANGELOG.md](CHANGELOG.md)** (this file) — documenting backend version history going forward, with the initial state captured retroactively as `[1.0.0]`.
- **Comprehensive [README.md](README.md)** — full API reference (~30 endpoints across 6 domains: user, recipe, type, userIngredients, menu, menuCategory), env/config requirements, auth flow, data model, and conventions.
- **`patch` / `minor` / `major` npm scripts** in [package.json](package.json) — short aliases for `npm version <level> --no-git-tag-version`. Run from this folder to bump the backend version in isolation.

## [1.0.0] — 2026-04-26

🎉 Initial release of the backend API.

### Added
- **Express 4 server** on port `8080`, mounting six resource routers under `/api`.
- **JWT authentication** — `POST /api/login` issues 24h tokens signed with `JWT_SECRET_KEY`; `authenticateToken` middleware guards every non-public endpoint.
- **bcrypt password hashing** in `user.controller.js` (cost factor 10).
- **PostgreSQL connection pool** via `pg`, configured in `db.js`.
- **CORS** locked to `http://localhost:5173`.
- **Routes & controllers** for:
  - `user` — registration, login, list users
  - `recipe` — CRUD, ingredient list, type/ingredient/time/date filters, stats aggregation
  - `recipe-types` — full CRUD
  - `user-ingredients` — pantry CRUD, bulk-update quantities, purchase history
  - `menu` — CRUD, per-user filter
  - `menu-categories` — list categories, list menus by category
- **Database schema** — 11 relational tables (`person`, `recipes`, `ingredients`, `recipe_ingredients`, `recipe_types`, `unit_measurement`, `person_ingredients`, `ingredient_purchases`, `menu`, `menu_category`, `menu_recipe`) with seed data for recipe types, units, menu categories, and sample ingredients.
- **Ingredient metadata** — `allergens`, `days_to_expire`, `seasonality`, `storage_condition` on every ingredient.
- **Unit conversion table** — gr, kg, ml, l, teaspoon, tablespoon, cup, pcs with gram coefficients.

### Notes
- Database connection credentials are **hardcoded** in [`db.js`](db.js) by design — no `DATABASE_URL` env override.
- [`database.sql`](database.sql) is **not idempotent** — run once on an empty database.

[Unreleased]: https://github.com/PershynaMilana/cooking-assistant/compare/backend-v1.1.0...HEAD
[1.2.0]: https://github.com/PershynaMilana/cooking-assistant/compare/backend-v1.1.0...HEAD
[1.1.0]: https://github.com/PershynaMilana/cooking-assistant/compare/backend-v1.0.0...backend-v1.1.0
[1.0.0]: https://github.com/PershynaMilana/cooking-assistant/releases/tag/backend-v1.0.0
