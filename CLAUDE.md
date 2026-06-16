# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two-app monorepo (no workspaces - each side has its own `package.json`):

- [backend/](backend/) - Node.js + Express 5 + TypeScript + PostgreSQL (`pg`) API on port `3000`; helmet, express-rate-limit, pino, and zod provide operational hardening and input validation; source lives under [backend/src/](backend/src/)
- [frontend/](frontend/) - React 18 + TypeScript + Vite on port `8080` (Tailwind CSS, React Router v6)
- Database schema is managed by `node-pg-migrate`: SQL migrations live in [backend/migrations/](backend/migrations/) (the initial one captures the full current schema) and reference/sample data is loaded by [backend/src/scripts/seed.ts](backend/src/scripts/seed.ts).
- Root [package.json](package.json) is an orchestration shim: it pulls in `concurrently` and exposes scripts that drive both sub-packages. It also holds the single shared project version (see [Versioning](#versioning) below).
- [CHANGELOG.md](CHANGELOG.md) at the root is the single changelog for the whole project.

## Common commands

Preferred - from repository root ([package.json](package.json)):

```bash
npm install              # installs root + auto-runs postinstall in backend & frontend
npm start                # OR npm run dev - concurrently boots backend (3000) + frontend (8080)
npm run start:backend    # backend only (tsx watch)
npm run start:frontend   # frontend only (vite)
```

The root `postinstall` hook (`npm --prefix backend install && npm --prefix frontend install`) means a single `npm i` at the root populates all three `node_modules`. Don't add a separate `install:all` script.

Per-app, if you need it directly:

Backend ([backend/](backend/)):

```bash
npm run dev        # tsx watch -> http://localhost:3000
npm start          # tsx src/index.ts, no auto-reload
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run test       # jest via ts-jest
npm run migrate    # node-pg-migrate: apply all pending migrations (up); `migrate down` rolls back one
npm run seed       # load reference + sample data (idempotent)
```

Frontend ([frontend/](frontend/)):

```bash
npm run dev      # vite dev server -> http://localhost:8080
npm run build    # tsc -b && vite build  (real type-check happens here)
npm run preview  # serve production build
npm run lint     # eslint .
```

The backend has a Jest + ts-jest test suite (`npm --prefix backend test`, or `test:coverage`). The frontend has no tests yet.

Backend test conventions (match these when adding tests):

- Business-logic unit tests stay no DB, no Express. Use cases and domain entities are tested with fake repositories/ports built from `jest.fn()`; mock only what is necessary.
- Middleware unit tests call the middleware directly with mocked `req`/`res`/`next`.
- Supertest integration tests use `buildTestApp` with fake repositories/ports. They exercise real routes, auth middleware, controllers, use cases, and `errorHandler` without a database.
- Pg-repository tests are deferred until a future real-DB suite with Testcontainers; do not add mock-pool SQL-string tests as a substitute.
- Unit tests are co-located in `__tests__/` next to the unit, named `<Unit>.test.ts`; HTTP integration tests live in `backend/src/test/integration/`.
- Test names start with "should": `it("should ...")`.
- Assert domain errors with the custom matcher `expect(err).toBeAppError(Class, message, status)` ([backend/src/test/jest.setup.ts](backend/src/test/jest.setup.ts)); capture thrown errors with `catchError` / `catchSyncError` ([backend/src/test/helpers/assertions.ts](backend/src/test/helpers/assertions.ts)).

## Versioning

The whole project shares ONE version, stored in the root [package.json](package.json). It increments by one each release (for example `1.3 -> 1.4`).

A release also bumps `backend/package.json` and/or `frontend/package.json` up to the shared number, but only for the side(s) actually changed. An untouched side keeps its old number. So a package version is a marker of "the last release in which this package changed" and may skip numbers - it is NOT strict SemVer.

Worked example:

- `1.2` changed only the backend: `backend` went to `1.2`, `frontend` stayed on its previous number.
- `1.3` changed both: both went to `1.3`.
- A later `1.5` that changes only the backend takes `backend` straight to `1.5` (skipping `1.4`, which it was not part of); `frontend` stays where it was.

Rule of thumb: bump the version before each push/release. To bump, edit the `version` field in the relevant `package.json` files directly (root always, plus each changed side). Do not use `npm version` (it would also touch the gitignored `package-lock.json`).

## Changelog

There is ONE changelog: root [CHANGELOG.md](CHANGELOG.md). There are no per-package changelogs.

1. Each release is a `## [x.y] - YYYY-MM-DD` heading containing `### Backend` and/or `### Frontend` subsections. Omit the subsection for a side that was not touched.
2. While work is in flight, add entries under the top `## [Unreleased]` heading; at release time, move them into a new dated version heading and leave `## [Unreleased]` empty.
3. Write entries from the user's perspective, not the code's. Good: "Filter recipes by cooking time range". Bad: "Add `time_min`/`time_max` query params to `/api/recipes-by-filters`".
4. Use Keep a Changelog wording where it helps (`Added`, `Changed`, `Fixed`, `Removed`, `Security`), but the `### Backend` / `### Frontend` split is the primary structure here.

## Commit and PR conventions

One commit = code change + version bump + changelog update. Bundle them together.

Message format: `<version>: <short description>` - the shared target version, for example:

```
1.4: add cooking-time filter to the recipe list
1.5: fix menu deletion leaving orphaned rows
```

Optionally note the side when only one changed: `1.4 (frontend): ...`. The version in the message lets GitLens blame hover show which release a line landed in (a confirmed user preference).

Hard rules:

- Do NOT create git tags.
- Do NOT add a `Co-Authored-By` trailer to commits.
- Do NOT commit directly to `main`. Branch from `main`, named after the release (for example `release/1.4`), commit there, push, and open a PR for review.
- Never `git push` without explicit user permission.

Preferred git commands (use these exact forms):

```
git switch main          # switch to existing branch
git switch -c release/X.Y   # create and switch to new branch
git add .                # stage all changes
git push origin release/X.Y  # push branch (no -u flag)
```

### PR / MR description

Keep the body short and to the point - what was **added** and what was **fixed**, nothing else. Two optional bulleted sections; omit either if it has nothing:

```
<version>: <same text as the commit title>

Added:
- <new capability, in user-facing language>

Fixed:
- <bug fixed, in user-facing language>
```

PR title = the commit title (`<version>: <description>`). One bullet per change, in plain language (what it means for a user, not the code). Default to just `Added`/`Fixed`; only reach for `Changed`/`Removed`/`Security` if a change is genuinely neither. No verification/"Checks" line, no Claude/Co-Authored-By attribution.

### Quality gates (CI + hooks)

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on every PR and on push to `main`: `format` (Prettier check), `lint` (ESLint), `typecheck` (`tsc --noEmit`), `sonarjs` (SonarJS lint), and `test` (Jest with coverage). All must be green to merge. The same checks run locally before a commit via the Husky `pre-commit` hook (lint-staged + typecheck + lint + sonarjs + tests), and `pre-push` blocks pushing straight to `main`. Hosted SonarCloud is not wired up (no `SONAR_TOKEN`); the local `sonarjs` lint covers the static-analysis role for now.

## Required configuration

1. PostgreSQL connection in [backend/src/config/env.ts](backend/src/config/env.ts) reads the `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` environment variables, falling back to the historical hardcoded defaults (`postgres` / `12345678` / `localhost` / `5432` / `cooking_helper`) when unset. Env values are parsed with zod on startup, so invalid ports or logger levels fail fast with a clear configuration error. `JWT_SECRET_KEY` stays optional at startup (but must be at least 32 characters when set) and is still checked lazily by JWT code. [backend/src/db.ts](backend/src/db.ts) consumes that typed config.
2. Backend `.env` is gitignored. Copy [backend/.env.example](backend/.env.example) to `backend/.env` and fill it in. It holds `JWT_SECRET_KEY` (read lazily through [backend/src/config/env.ts](backend/src/config/env.ts) by JWT auth code) plus the `DB_*` keys, `PORT`, optional `LOG_LEVEL` for pino, and `CORS_ORIGIN` (the allowed frontend origin). Without `JWT_SECRET_KEY`, login and every protected route return a 500 configuration error. Tests set a long `JWT_SECRET_KEY` in [backend/src/test/jest.setup.ts](backend/src/test/jest.setup.ts). When you add a new env key, add it (without a value) to `.env.example` too.
3. CORS in [backend/src/app.ts](backend/src/app.ts) allows the origin from the `CORS_ORIGIN` env var (default `http://localhost:8080`, via `config.corsOrigin`). For a different frontend port or a deployed origin, set `CORS_ORIGIN` in `.env` - no code change.
4. Database setup uses `node-pg-migrate` (configured to reuse the same `config.db` as the app, so there is no separate `DATABASE_URL`). On a fresh DB run `npm run migrate` (or `migrate up`) then `npm run seed` from the root or `backend/`. `seed` is idempotent (guards against existing rows), so it is safe to re-run. A DB that already has the schema from the legacy `database.sql` adopts the migrations without re-creating anything via `npm run migrate -- up --fake` (marks the initial migration as applied; data is untouched). New migrations are scaffolded with `npm --prefix backend run migrate:create <name>` (SQL files with `-- Up Migration` / `-- Down Migration` markers). The legacy `database.sql` has been removed - migrations are the only source of truth for the schema (its old content lives in git history if ever needed).

## Database workflow

Three kinds of database change, and they are NOT the same thing - pick by what you are changing:

1. **Runtime data** (a user creates a recipe, adds a pantry ingredient, etc.) - just flows in through the normal API/repository `INSERT`s while the app runs. No migration, no seed, nothing to edit. This is the vast majority of writes.
2. **Seed / starter reference data** (the unit_measurement / recipe_types / menu_category rows and the sample ingredients that every fresh DB should start with) - lives in [backend/src/scripts/seed.ts](backend/src/scripts/seed.ts).
3. **Schema change** (a new table, column, constraint, or index - the _shape_ of the DB) - a new migration in [backend/migrations/](backend/migrations/).

**To add a new starter ingredient (e.g. a 23rd one):** add one row to the ingredients `VALUES` list in [backend/src/scripts/seed.ts](backend/src/scripts/seed.ts) (name, unit, allergens, days_to_expire, seasonality, storage_condition), then run `npm run seed`. Seed is idempotent (`ON CONFLICT (name) DO NOTHING`), so on an existing DB it inserts only the new row and leaves the other 22 alone. Commit the seed change. Do NOT write a migration for this - ingredients are rows, not schema.

**To make a schema change (the only time you write a migration):**

1. `npm --prefix backend run migrate:create <short-name>` - scaffolds `migrations/<timestamp>_<short-name>.sql` with empty `-- Up Migration` / `-- Down Migration` sections.
2. Fill in `Up` (the change, e.g. `ALTER TABLE ingredients ADD COLUMN calories INTEGER;`) and `Down` (the exact reverse, e.g. `ALTER TABLE ingredients DROP COLUMN calories;`).
3. `npm run migrate` - applies only the new file (already-run migrations are recorded in the `pgmigrations` table and skipped). `npm run migrate down` rolls back the last one via its `Down` section.
4. Update the code that uses the new shape (the relevant `Pg*Repository` SQL/types, and a zod schema if it is request input), then commit the migration file together with that code.

The timestamp prefix on a migration filename only sets apply order (later timestamp = runs later); never rename or reorder existing migration files once they have been applied anywhere.

**How it is wired (read before adding any DB feature):**

- Migrations are plain SQL files in [backend/migrations/](backend/migrations/), one file per change, using node-pg-migrate's `-- Up Migration` / `-- Down Migration` markers (the `migrate:create` script scaffolds them; `migration-file-language` is `sql`). node-pg-migrate records applied migrations in a `pgmigrations` table and skips them next run. No `pgm.*` JS DSL - keep migrations as raw SQL.
- The runner and seed are tsx scripts in [backend/src/scripts/](backend/src/scripts/) (`migrate.ts`, `seed.ts`), placed under `src/` so they are typechecked and linted (they are excluded from coverage by the `collectCoverageFrom` allowlist). `migrate.ts` calls node-pg-migrate's programmatic `runner({ databaseUrl: config.db, ... })` and parses `up`/`down`/`--fake` from `argv`; `seed.ts` opens its own short-lived `new Pool(config.db)`. Both reuse `config.db` from [backend/src/config/env.ts](backend/src/config/env.ts) - the same `DB_*` source as `db.ts`; there is deliberately NO separate `DATABASE_URL`. Both log through the pino `logger` (the global `no-console` rule applies) and set `process.exitCode = 1` on failure.
- node-pg-migrate exposes its types through an `exports` map that the project's `moduleResolution: "Node"` does not read, so [backend/src/types/node-pg-migrate.d.ts](backend/src/types/node-pg-migrate.d.ts) re-exports them for tsc only (tsx resolves the real module at runtime). Leave that shim in place.
- `seed.ts` must stay idempotent so re-running it never duplicates or errors: tables with a unique constraint use `INSERT ... ON CONFLICT (...) DO NOTHING` (e.g. `ingredients.name`); reference tables without one (`unit_measurement`, `recipe_types`, `menu_category`) use `INSERT ... SELECT ... WHERE NOT EXISTS`. Seed the sample ingredients with all columns in one statement, looking the unit id up by `unit_name` (a subquery/JOIN) - never id-based `UPDATE`s.
- The initial migration is the full current schema (not a replay of historical ALTERs). It intentionally cleaned up two bits of cruft from the old `database.sql` while keeping behaviour identical: the duplicate `menu_recipe.menu_id` foreign key became one `ON DELETE CASCADE`, and `ingredient_purchases.quantity` is `NOT NULL DEFAULT 0` directly. Keep the misspelled column name `quantity_person_ingradient` (it is the real column).
- Two setup paths: a fresh/empty DB runs `npm run migrate` + `npm run seed`; a DB that already had the schema from the old `database.sql` is adopted once with `npm run migrate -- up --fake` (marks the initial migration applied without running it - data untouched). All scripts work from the repo root or `backend/`.

## Architecture

### Backend - clean (layered) architecture

Express app creation in [backend/src/app.ts](backend/src/app.ts) mounts operational middleware first (`helmet`, `pino-http`, CORS, and the 100kb JSON body parser), then the public health check and six domain routers under `/api`; [backend/src/index.ts](backend/src/index.ts) only wires the real composition root into `createApp`, listens, and drains the HTTP server plus pg pool on `SIGTERM`/`SIGINT`:

- `health.routes` -> public `/health` liveness probe
- `user.routes` -> register, login, get users
- `recipe.routes` -> recipe CRUD, ingredient list, filters, stats
- `type.routes` -> recipe types CRUD
- `userIngredients.routes` -> per-user pantry + purchase history
- `menu.routes` -> menu CRUD + per-user filter
- `menuCategory.routes` -> menu category list, menus by category

The backend is organised in layers with dependencies pointing inward (Dependency Rule). Wiring is built once in [backend/src/composition-root.ts](backend/src/composition-root.ts): `buildControllers(deps)` is reusable for tests, and the default export uses the real Pg repositories/services.

- **Routes** ([backend/src/routes/](backend/src/routes/)) are factory functions `(controller) => router` for domain routes, plus controller-free infrastructure routes such as health. They map `METHOD /path` directly to a controller handler and (almost always) guard it with `authenticateToken`. Only `/health`, `/register`, and `/login` are public; register/login are guarded by `authLimiter` from [backend/src/middleware/rateLimit.ts](backend/src/middleware/rateLimit.ts). Express 5 forwards rejected promises from async handlers to the error middleware.
- **Controllers** ([backend/src/controller/](backend/src/controller/)) are thin HTTP adapters: classes whose handlers are arrow-function properties (so `this` is bound). A handler reads input from `req` (params/body/query/`req.user.id`), calls a use case, sends the response. No try/catch - errors propagate to the error middleware.
- **Validation** ([backend/src/application/validation/](backend/src/application/validation/)) - zod request schemas plus the shared `validate()` helper. Schemas describe request shape only: types, required scalars, formats, ranges, and array item shape. Domain invariants stay in entities, so each rule lives in one layer only.
- **Use cases** ([backend/src/application/use-cases/](backend/src/application/use-cases/)) - one class per operation with `async execute(...)`. They hold input validation + orchestration, throw domain errors, and depend on repository/service TypeScript `interface`s, never on `pg` or express. Service ports are in [backend/src/application/ports/](backend/src/application/ports/) (`PasswordHasher`, `TokenService`).
- **Domain** ([backend/src/domain/](backend/src/domain/)) - repository TypeScript `interface`s, entities, and error types in [backend/src/domain/errors/AppError.ts](backend/src/domain/errors/AppError.ts) (`AppError` carries an HTTP `status`; `NotFoundError`/`ValidationError`/`UnauthorizedError`).
  `Recipe` and `Menu` entities keep domain invariants such as non-empty ingredients/recipes and required menu category.
- **Infrastructure** ([backend/src/infrastructure/](backend/src/infrastructure/)) - concrete `pg` repositories under `persistence/pg/` (ALL SQL lives here) and security adapters under `security/` (`BcryptPasswordHasher`, `JwtTokenService`). Adapters `implements` the relevant interface and each repository takes the shared `pool` from [backend/src/db.ts](backend/src/db.ts) via its constructor.
- **Config and ambient types**: [backend/src/config/env.ts](backend/src/config/env.ts) is the single typed environment loader, and [backend/src/config/logger.ts](backend/src/config/logger.ts) is the shared pino logger (`LOG_LEVEL`, silent in tests). [backend/src/types/](backend/src/types/) is only for ambient `.d.ts` declarations such as `express.d.ts` and `env.d.ts`; regular DTO/domain types live beside their layer as normal `.ts` exports.

Errors: a use case `throw`s a domain error; Express 5 forwards the rejected promise to the single `errorHandler` ([backend/src/middleware/errorHandler.ts](backend/src/middleware/errorHandler.ts)), which logs through pino and replies `{ error: <message> }` with `err.status || 500`. Every error body is `{ error: ... }`, including auth middleware failures and the JSON 404 for unknown routes.

When adding a feature: add SQL to the relevant `Pg*Repository` (and its interface), add a zod schema in `application/validation/`, add a use case (which calls `validate(...)` then orchestrates), call it from a controller handler, and wire the new pieces in the composition root. Transactions (`BEGIN/COMMIT/ROLLBACK`) live inside a single repository method (see the menu/pantry repos).

Auth flow: login signs a JWT with payload `{ id }` and `expiresIn: "24h"` via [backend/src/infrastructure/security/JwtTokenService.ts](backend/src/infrastructure/security/JwtTokenService.ts). [backend/src/middleware/jwtMiddleware.ts](backend/src/middleware/jwtMiddleware.ts) reads `Authorization: Bearer <token>`, verifies, and attaches `req.user`. The current user's id always comes from `req.user.id` (never from the request body/params).

### Frontend - pages, routing, auth

Routing is centralized in [frontend/src/App.tsx](frontend/src/App.tsx). All non-auth routes are wrapped in `<PrivateRoute>`, which gates purely on the presence of `authToken` in `localStorage` ([frontend/src/components/PrivateRoute.tsx](frontend/src/components/PrivateRoute.tsx)). It does NOT verify expiry - an expired token still renders the page, and the API call inside is what 403s.

Token storage gotcha - read this before touching auth code: the actual key used everywhere (Header, LoginPage, every page that calls the API) is `"authToken"`. The hook [frontend/src/hooks/useAuth.tsx](frontend/src/hooks/useAuth.tsx) reads/writes a different key `"token"` and is effectively dead code; do not rely on it for gating decisions. If you need auth state in a new component, mirror the pattern from `Header.tsx` / `PrivateRoute.tsx` (read `authToken` directly) rather than importing `useAuth`.

API calls are made with `axios` directly from each page - there is no shared API client, no interceptor, no central error handler. Each request manually attaches `Authorization: Bearer ${localStorage.getItem("authToken")}`. When adding a new endpoint call, follow the existing inline pattern; do not introduce a wrapper unless the user asks for one.

Pages are organized by domain folder under [frontend/src/pages/](frontend/src/pages/) (`auth`, `recipes`, `user-recipes`, `menu`, `user-menu`, `recipe-types`, `person-ingradients`, `statistics`, `not-found`). Reusable UI lives in [frontend/src/components/](frontend/src/components/). Stats page uses `apexcharts`/`react-apexcharts` and exports PDFs via `@react-pdf/renderer` + `jspdf`.

### Database model highlights

Key tables and joins (see the initial migration [backend/migrations/1781185648364_initial-schema.sql](backend/migrations/1781185648364_initial-schema.sql) for the full schema):

- `person` (users) <-> `recipes` via `person_id`
- `recipes` <-> `ingredients` through `recipe_ingredients` (with `quantity_recipe_ingredients`)
- `recipes.type_id` -> `recipe_types`
- `person` <-> `ingredients` through `person_ingredients` (the pantry, with `quantity_person_ingradient` - note the misspelling, it's the actual column name) and `ingredient_purchases` (history)
- `menu` (per-user, with `category_id` -> `menu_category`) <-> `recipes` through `menu_recipe`
- `ingredients` carries `id_unit_measurement` -> `unit_measurement` plus metadata (`allergens`, `days_to_expire`, `seasonality`, `storage_condition`)

The "missing ingredients for a menu" feature works by joining `menu_recipe` -> `recipe_ingredients` -> `ingredients` and subtracting the user's `person_ingredients`.

## Conventions in this codebase

- Comments are plain `//` with a single space and a lowercase first letter (acronyms / proper nouns like JWT, SQL, URL, Express keep their case, e.g. `// JWT login`). The old `//?` / `//!` prefixes were removed - don't reintroduce them.
- Backend source is TypeScript with ESM-style `import`/`export`, executed by `tsx` with CommonJS runtime semantics (`module: "CommonJS"` in [backend/tsconfig.json](backend/tsconfig.json)). Do not add new `require`/`module.exports` in backend source files; root tooling configs such as ESLint and Jest stay CommonJS `.js`.
- Backend layering rules (keep the style uniform):
    - In a controller, every injected use case is a field named `<operation>UseCase` (e.g. `this.createRecipeUseCase`), called from the matching arrow-function handler. Uniform naming, and it never clashes with a handler name.
    - Add a `domain/entities/` class only when it enforces an invariant. The write use case builds it through a named factory (`Recipe.forCreation(...)` / `Recipe.forUpdate(...)`) that throws a `ValidationError`, then passes the entity to the repository. Do NOT create empty data-holder entities, and do NOT route reads through entities (queries return repository rows as-is, so response shapes stay identical).
    - Validate request input with a zod schema in `application/validation/` (one `<area>.schemas.ts` per domain, shared field helpers in `common.schemas.ts`); the use case calls `validate(schema, input)` from [backend/src/application/validation/validate.ts](backend/src/application/validation/validate.ts) at the top of `execute()` before building any entity. Schemas cover request shape only (types, required scalars, formats, ranges, array item shape) - the entity factory keeps the domain invariant (e.g. non-empty ingredients), so each rule lives in exactly one layer and zod does NOT duplicate it. A failed `validate` throws `ValidationError` (400), so every bad input is `{ error }`.
    - One route path = exactly one handler. Don't register a second router on a path another router already owns - the later one is unreachable dead code (mount order is in `index.ts`).
    - All SQL lives in `infrastructure/persistence/pg/*` repositories that implement an interface from `domain/repositories/`; multi-step transactions (`BEGIN/COMMIT/ROLLBACK`) stay inside a single repository method.
    - Type placement follows the layer: use inline types for one file, co-located `<area>.types.ts` for shared DTO/filter shapes inside a folder, and exported entity/repository types from their own modules. Do not turn `backend/src/types/` into a general type bucket.
- Backend path aliases are configured in [backend/tsconfig.json](backend/tsconfig.json): `@domain/*`, `@application/*`, `@infrastructure/*`, `@controller/*`, `@routes/*`, `@middleware/*`, `@config/*`, and `@test/*`. Do not introduce `../` imports under `backend/src/`; cross-folder imports use aliases, while true same-folder neighbors stay relative with `./`. `tsx` resolves the aliases at runtime, and Jest maps them through `pathsToModuleNameMapper` in [backend/jest.config.js](backend/jest.config.js).
- The frontend has minor inconsistencies (typo `person-ingradients` folder, the dead `useAuth` hook). Don't "clean these up" as part of an unrelated change - they're load-bearing for existing imports.
- Commit lockfiles and tool configs. `package-lock.json` (root/backend/frontend) and `eslint.config.js` are tracked - committing them keeps installs reproducible and lets CI run `npm ci`. (They used to be gitignored; that rule was removed.)
