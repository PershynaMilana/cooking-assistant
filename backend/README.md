# Cooking Assistant - Backend

Express + PostgreSQL API for the [Cooking Assistant](../README.md) platform. Listens on port 3000 and
serves the [frontend](../frontend/README.md) at http://localhost:8080 (CORS-restricted).

## Tech stack

- Node.js + TypeScript + Express 5 - HTTP server
- PostgreSQL via `pg` (connection pool, raw SQL, no ORM)
- jsonwebtoken + bcryptjs - auth (httpOnly cookie session) and password hashing
- cookie-parser - reads the auth cookie on every request
- helmet + express-rate-limit - security headers and brute-force guard on auth
- pino + pino-http - structured app and request logging
- zod - request and environment validation
- node-pg-migrate - versioned SQL schema migrations
- tsx - TypeScript runtime and dev auto-reload

## Running locally

Prefer the root of the monorepo: `npm install && npm start` boots backend + frontend together. Use the
commands below only to work on the backend alone.

```bash
npm install
npm run dev      # tsx watch -> http://localhost:3000 (auto-reload)
npm start        # tsx, no auto-reload
npm run typecheck
```

## Configuration

### 1. backend/.env

This file is gitignored and not in the repo. Copy the template and fill in real values:

```bash
cp .env.example .env     # PowerShell: Copy-Item .env.example .env
```

[.env.example](.env.example) ships with working local defaults; here is what each key is (fill in your own
values rather than copying any shown here):

```
JWT_SECRET_KEY=<random string, at least 32 characters>
DB_USER=<your postgres user>
DB_PASSWORD=<your postgres password>
DB_HOST=<db host>
DB_PORT=<db port>
DB_NAME=<your database name>
NODE_ENV=<development | production>
PORT=<backend port>
LOG_LEVEL=<pino log level, e.g. info>
CORS_ORIGIN=<allowed frontend origin>
COOKIE_DOMAIN=<empty in dev; shared parent domain in production>
```

`NODE_ENV=production` turns on the `Secure` flag of the auth cookie. `COOKIE_DOMAIN` is left empty in dev
(a host-only cookie); in production set the shared parent domain (e.g. `.example.com`) so `app.*` and
`api.*` subdomains share the session cookie. See [src/config/cookie.ts](src/config/cookie.ts).

`JWT_SECRET_KEY` is used by [src/middleware/jwtMiddleware.ts](src/middleware/jwtMiddleware.ts) (verifies
tokens) and [src/infrastructure/security/JwtTokenService.ts](src/infrastructure/security/JwtTokenService.ts)
(signs them at login). It must be at least 32 characters (validated on startup). Without it, login and
every protected route return a 500 configuration error.
The rest of the env is validated with zod on startup; invalid ports or logger levels fail fast with a
clear configuration error. `LOG_LEVEL` controls the pino logger level and defaults to `info` when unset.

When you add a new env key, add it (without a value) to [.env.example](.env.example) too.

### 2. PostgreSQL connection - [src/config/env.ts](src/config/env.ts) and [src/db.ts](src/db.ts)

Credentials are read from the `DB_*` variables above. Each one falls back to a conventional local-Postgres
default when unset (the exact fallbacks live in [src/config/env.ts](src/config/env.ts)). Set the `DB_*`
keys in `.env` to match your own Postgres - no need to edit [src/db.ts](src/db.ts).

### 3. Database - [migrations/](migrations/) + [src/scripts/seed.ts](src/scripts/seed.ts)

The schema is owned by `node-pg-migrate`. The migrate/seed scripts reuse the app's own DB config
([src/config/env.ts](src/config/env.ts) → the `DB_*` env vars), so there is no separate `DATABASE_URL` to keep
in sync. `node-pg-migrate` creates the **tables inside** a database - it does not create the database itself, so
the database has to exist first.

Pick the path that matches your situation:

#### A. Fresh / empty database (new machine, prod, a teammate cloning the repo)

1. Create an empty database whose name matches your `DB_NAME`. Any one of these (substitute your own
   `DB_USER` / `DB_NAME`):
   - **pgAdmin**: right-click *Databases* → *Create* → *Database* → give it your `DB_NAME`.
   - **psql**: `psql -U <DB_USER> -c "CREATE DATABASE <DB_NAME>;"`
   - **createdb** (only works if the Postgres `bin/` folder is on your PATH, otherwise use the full path to it):
     `createdb -U <DB_USER> <DB_NAME>`
2. `npm run migrate` - builds every table from the files in [migrations/](migrations/).
3. `npm run seed` - loads reference + sample data (units, recipe types, menu categories, sample ingredients).

#### B. A database that already has the schema (the original `database.sql` setup, from before migrations)

Do **not** run a plain `npm run migrate` - it would fail because the tables already exist. Adopt the migrations
once, without touching any data:

```bash
npm run migrate -- up --fake
```

This records the initial migration as "already applied" (it writes one row to the `pgmigrations` tracking
table) but runs no SQL, so existing rows are untouched. After this one-time step the database is in sync with
the migrations and you treat it like any other. (The `--` is needed only because `--fake` is a flag; bare words
such as `down` are forwarded without it.)

#### Day to day: which change goes where

Structure and data are different things - this is the part people trip on:

| What you are doing | Where it goes |
| --- | --- |
| A user creates a recipe / adds a pantry ingredient through the running app | Nowhere - it is runtime data via the normal API. No migration, no seed. |
| A new **starter ingredient** that every fresh DB should ship with | A row in `seed.ts`, then `npm run seed` |
| A new table / column / constraint / index (the **shape** of the DB) | A new migration |

**Add a starter ingredient (e.g. a 23rd):** add one row to the ingredients `VALUES` list in
[src/scripts/seed.ts](src/scripts/seed.ts) - the columns are `(name, unit, allergens, days_to_expire,
seasonality, storage_condition)` - then `npm run seed`. Seed is idempotent (`ON CONFLICT (name) DO NOTHING`), so
on an existing DB it inserts only the new row and leaves the rest alone. Commit `seed.ts`. Do **not** write a
migration - ingredients are rows, not schema.

**Make a schema change (the only time you write a migration):**

1. `npm run migrate:create add-calories-to-ingredients` - scaffolds
   `migrations/<timestamp>_add-calories-to-ingredients.sql` with empty `-- Up Migration` / `-- Down Migration`
   sections.
2. Fill `Up` with the change and `Down` with the exact reverse:
   ```sql
   -- Up Migration
   ALTER TABLE ingredients ADD COLUMN calories INTEGER;

   -- Down Migration
   ALTER TABLE ingredients DROP COLUMN calories;
   ```
3. `npm run migrate` - applies only the new file (the `pgmigrations` table tracks what already ran, so old
   migrations are skipped). `npm run migrate down` rolls the last one back via its `Down` section.
4. Update the code that uses the new shape (the relevant `Pg*Repository` SQL and types, plus a zod schema if it
   is request input), and commit the migration file together with that code.

The number prefixing a migration file is a timestamp that only sets apply order (later = runs later). Never
rename, edit, or reorder a migration that has already been applied anywhere - add a new migration instead.

#### Commands

| Command | Does |
| --- | --- |
| `npm run migrate` | apply all pending migrations (up) |
| `npm run migrate down` | roll back the last migration |
| `npm run migrate:create <name>` | scaffold a new migration file |
| `npm run migrate -- up --fake` | mark migrations as applied without running them (adopt an existing DB) |
| `npm run seed` | load / top up reference + sample data (idempotent) |

All commands work from the repo root or from `backend/`. The legacy `database.sql` has been removed - the
migrations are the single source of truth for the schema (its old content is in git history if ever needed).

### 4. CORS - [src/app.ts](src/app.ts)

The allowed origin comes from the `CORS_ORIGIN` env var (default `http://localhost:8080`). Set it to the
frontend's URL for non-local deploys; no code change needed. CORS runs with `credentials: true` and the app
mounts `cookie-parser`, so the browser can send the httpOnly auth cookie cross-origin (see
[Auth flow](#auth-flow)).

## Structure

```
backend/
├── package.json          scripts and backend package metadata
├── tsconfig.json         TypeScript config and path aliases
├── jest.config.js        Jest + ts-jest config
├── eslint.config.js      regular ESLint config
├── eslint.sonarjs.config.js
├── migrations/           node-pg-migrate SQL migrations (the source of truth for the schema)
├── .env.example          env template (tracked) - copy to .env
├── .env                  JWT_SECRET_KEY + DB_* + PORT (you create - gitignored)
│
└── src/
    ├── scripts/             migrate.ts (node-pg-migrate runner) and seed.ts (idempotent seed)
    ├── app.ts                createApp(controllers); mounts middleware, health, and routers without listening
    ├── index.ts              runtime entry; listens on 3000 and shuts down server + pg pool cleanly
    ├── composition-root.ts   dependency injection: buildControllers(deps), plus real pg wiring
    ├── db.ts                 pg.Pool connection (reads DB_* env via config/env.ts)
    ├── config/env.ts         typed env loading and JWT secret guard (isProduction, cookieDomain, corsOrigin)
    ├── config/logger.ts      shared pino logger, LOG_LEVEL-aware and silent in tests
    ├── config/cookie.ts      AUTH_COOKIE_NAME + AUTH_COOKIE_OPTIONS (httpOnly, sameSite, secure, maxAge)
    │
    ├── domain/               innermost layer (no framework/db deps)
    │   ├── entities/         Recipe, Menu (only entities that enforce an invariant)
    │   ├── errors/           AppError + NotFoundError / ValidationError / UnauthorizedError (carry HTTP status)
    │   └── repositories/     repository interfaces (TypeScript interface)
    │
    ├── application/
    │   ├── ports/            service interfaces: PasswordHasher, TokenService
    │   ├── validation/       zod request schemas (*.schemas.ts), the validate() helper, assertRecipesExist
    │   └── use-cases/        one class per operation (recipes/, recipe-types/, menus/, menu-categories/, pantry/, users/)
    │
    ├── infrastructure/
    │   ├── persistence/pg/   concrete pg repositories - ALL SQL lives here
    │   └── security/         BcryptPasswordHasher, JwtTokenService
    │
    ├── middleware/
    │   ├── jwtMiddleware.ts  authenticateToken - verifies the JWT from the authToken cookie, attaches req.user
    │   ├── rateLimit.ts      authLimiter - rate limits register/login outside tests
    │   └── errorHandler.ts   turns thrown errors into { error } responses (mounted last)
    │
    ├── routes/               route factories (controller) => router, all under /api
    │   └── *.routes.ts
    │
    ├── controller/           thin HTTP adapters (DI classes) that call use cases
    │   ├── *.controller.ts
    │   └── requestUser.ts    getUserId(req) helper - returns req.user.id (never body/params)
    │
    ├── types/                ambient .d.ts files (express.d.ts req.user, env.d.ts, node-pg-migrate.d.ts)
    └── test/                 Jest setup, fake deps/test app helpers, and HTTP integration tests
```

## Architecture - clean (layered)

Dependencies point inward (Dependency Rule). The real graph is built in
[src/composition-root.ts](src/composition-root.ts) and consumed by [src/index.ts](src/index.ts). Tests can
reuse `buildControllers(deps)` with fakes and pass the result to [src/app.ts](src/app.ts). The app factory
mounts `helmet`, pino request logging, CORS (with credentials), `cookie-parser`, the 100kb JSON body
parser, the public health check, domain routers, and then the error handler in that order.

- **routes/** - factory functions `(controller) => router`; map `METHOD /path` directly to a
  controller handler, guard with `authenticateToken` (the only public routes are `/health`, `/register`,
  `/login`, and `/logout`).
- **controller/** - thin classes; a handler reads `req`, calls a use case, sends the response. No try/catch.
- **application/validation/** - zod request schemas and the shared `validate()` helper. Schemas describe
  request shape only (types, required scalars, formats, ranges, array item shape).
- **application/use-cases/** - one class per operation with `execute(...)`: input validation + orchestration;
  throw domain errors; depend on repository/service interfaces only. Service ports in **application/ports/**.
- **domain/** - repository interfaces, entities, and `errors/AppError.ts` (errors carry an HTTP `status`).
  Entities such as `Recipe` and `Menu` keep domain invariants like non-empty ingredient/recipe lists, so
  each validation rule lives in one layer only.
- **infrastructure/persistence/pg/** - concrete repositories; ALL SQL; constructor takes the `pg.Pool`.
  **infrastructure/security/** - bcryptjs + jwt adapters.

Errors: a use case throws a domain error -> Express 5 forwards the rejected promise -> `errorHandler`
logs through pino and replies `{ error: <msg> }` with `err.status || 500`. Every error body uses
`{ error }`, including auth failures and the JSON 404 for unknown routes. Transactions live inside a
single repository method (see menu/pantry repos).

To add a feature: add SQL to a `Pg*Repository` (and its interface), add a use case, call it from a
controller handler, and wire the new pieces in [src/composition-root.ts](src/composition-root.ts).

## Tests

Run `npm test` or `npm run test:coverage` from this folder. Unit tests are co-located in `__tests__/`:
use cases/entities use fake repositories, and middleware tests call `req`/`res`/`next` directly. HTTP
integration tests live in [src/test/integration/](src/test/integration/) and use supertest with
`buildTestApp`. Pg-repository tests are deferred until a future real-DB suite with Testcontainers.

## Auth flow

Auth is an **httpOnly cookie** (`authToken`) - the token is never in a response body and the client never
reads it. Cookie name and options live in [src/config/cookie.ts](src/config/cookie.ts).

1. `POST /api/login` verifies the password via `BcryptPasswordHasher` and signs an HS256 JWT (payload
   `{ id }`, `expiresIn: "24h"`) via `JwtTokenService`. The controller sets it with
   `res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)` (`httpOnly`, `sameSite: "lax"`, `secure` in
   production, `domain` from `COOKIE_DOMAIN`, `maxAge` 24h) and responds `{ message: "Logged in" }`.
2. The browser sends the cookie automatically on later requests (`cookie-parser` + CORS `credentials: true`).
3. [src/middleware/jwtMiddleware.ts](src/middleware/jwtMiddleware.ts) reads the JWT from
   `req.cookies[AUTH_COOKIE_NAME]`, verifies it with `JWT_SECRET_KEY` (HS256 only) - `401` if the cookie is
   missing, `403` if it is invalid/expired - then attaches `req.user = { id }` and calls `next()`.
4. `GET /api/me` (protected) returns `{ id }` so the client can check its session. `POST /api/logout`
   (public) clears the cookie and returns `{ message: "Logged out" }`.
5. The current user's id always comes from `req.user.id` via the `getUserId(req)` helper
   ([src/controller/requestUser.ts](src/controller/requestUser.ts)), never from the request body/params.
6. `/register` and `/login` are rate-limited by `authLimiter` (10 requests / 15 min per IP, `429` on
   excess); there is no per-account lockout, and login returns the same generic error for unknown user vs
   wrong password (anti-enumeration). pino redacts the `cookie` and `authorization` headers from logs.

## API reference

All endpoints under `/api`. Public routes: `/health`, `/register`, `/login`, `/logout`. Every other route
requires the `authToken` session cookie (sent automatically by the browser); there is no `Authorization`
header. Routes that act on "the current user" take the id from the cookie, not from a path segment.

### Health ([src/routes/health.routes.ts](src/routes/health.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Liveness check, returns `{ status: "ok" }` |

### Auth ([src/routes/user.routes.ts](src/routes/user.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/register` | Create a user (`name`, `surname`, `login`, `password`); rate-limited |
| POST | `/login` | Authenticate, set the `authToken` cookie, return `{ message: "Logged in" }`; rate-limited |
| POST | `/logout` | Clear the `authToken` cookie, return `{ message: "Logged out" }` (public) |
| GET | `/me` | Return the current user's id `{ id }` from the cookie (session check) |
| GET | `/user` | List all users |

### Recipes ([src/routes/recipe.routes.ts](src/routes/recipe.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/recipe` | Create a recipe with ingredients |
| GET | `/recipes` | List all recipes (joined with type + ingredients) |
| GET | `/recipe/:id` | Single recipe with ingredients |
| PUT | `/recipe/:id` | Update a recipe |
| DELETE | `/recipe/:id` | Delete a recipe |
| GET | `/ingredients` | List all known ingredients |
| GET | `/recipes-by-filters` | Filter (type, ingredients, time, date) |
| GET | `/recipes-filters-person` | Filter the current user's recipes (user from cookie) |
| GET | `/recipes-stats` | Aggregated stats for the analytics page |

### Recipe types ([src/routes/type.routes.ts](src/routes/type.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/recipe-types` | List all |

> Recipe-type create/update/delete were removed in the 1.40 lockdown - only the read-only list remains.

### User pantry ([src/routes/userIngredients.routes.ts](src/routes/userIngredients.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/user-ingredients` | Get the current user's pantry |
| PUT | `/user-ingredients` | Add/replace pantry items |
| PUT | `/user-ingredients/update-quantities` | Bulk update quantities (qty 0 deletes the row) |
| GET | `/user-ingredients/history/:ingredientId` | Purchase history for one ingredient |
| PUT | `/user-ingredients/history/:purchaseId` | Update a purchase entry |
| DELETE | `/user-ingredients/:ingredientId` | Remove a pantry item |

### Menus ([src/routes/menu.routes.ts](src/routes/menu.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/menu` | All menus (also accepts category filter) |
| POST | `/create-menu` | Create a menu with recipes |
| GET | `/menu/:id` | Menu details + recipes |
| PUT | `/menu/:id` | Update a menu |
| DELETE | `/menu/:id` | Delete a menu |
| GET | `/menu-filters-person` | The current user's menus (user from cookie) |

### Menu categories ([src/routes/menuCategory.routes.ts](src/routes/menuCategory.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/menu-categories` | List categories |

## Data model

Full schema in the initial migration [migrations/1781185648364_initial-schema.sql](migrations/1781185648364_initial-schema.sql). Big picture:

- `person` to `recipes` via `person_id` (recipe owner)
- `recipes` to `ingredients` through `recipe_ingredients` (with `quantity_recipe_ingredients`)
- `recipes.type_id` -> `recipe_types`
- `person` to `ingredients` through `person_ingredients` (the pantry, with `quantity_person_ingradient`
  - typo in the real column name, leave it) and `ingredient_purchases` (history log)
- `ingredients.id_unit_measurement` -> `unit_measurement`
- `ingredients` carries metadata: `allergens`, `days_to_expire`, `seasonality`, `storage_condition`
- `menu` (per-user, with `category_id` -> `menu_category`) to `recipes` through `menu_recipe`

The "ingredients you are missing for a menu" query joins `menu_recipe` -> `recipe_ingredients` ->
`ingredients` and subtracts the user's `person_ingredients`.

## Conventions

- Source uses TypeScript `import` / `export`; runtime semantics stay CommonJS through `tsx`.
- Controllers, use cases, and repositories are classes wired via the composition root (constructor DI).
  Repositories implement an interface from `src/domain/repositories/` and hold all SQL - match the
  pattern.
- Cross-folder backend imports use path aliases from [tsconfig.json](tsconfig.json): `@domain/*`,
  `@application/*`, `@infrastructure/*`, `@controller/*`, `@routes/*`, `@middleware/*`, `@config/*`,
  and `@test/*`. Keep true same-folder imports relative with `./`.
- Comments are plain `//` with a single space and a lowercase first letter (acronyms keep their case, e.g. `// JWT login`). The old `//?` / `//!` prefixes were removed.
- Raw SQL with `$1`, `$2`, ... parameters via `db.query(text, values)` - never string-concatenate
  user input.

## Versioning

The whole project shares one version and one changelog at the repo root. This package's version in
[package.json](package.json) marks the last release in which the backend changed. See the
[root README](../README.md#versioning-and-changelog) and [root CHANGELOG.md](../CHANGELOG.md).

## Related

- [Root README](../README.md) - project overview and monorepo scripts
- [Frontend README](../frontend/README.md) - React client
- [CHANGELOG.md](../CHANGELOG.md) - project changelog
- [CLAUDE.md](../CLAUDE.md) - notes for AI tooling
