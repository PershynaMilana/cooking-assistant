# Cooking Assistant - Backend

Express + PostgreSQL API for the [Cooking Assistant](../README.md) platform. Listens on port 8080 and
serves the [frontend](../frontend/README.md) at http://localhost:5173 (CORS-restricted).

## Tech stack

- Node.js + TypeScript + Express 5 - HTTP server
- PostgreSQL via `pg` (connection pool, raw SQL, no ORM)
- jsonwebtoken + bcrypt - auth and password hashing
- helmet + express-rate-limit - security headers and brute-force guard on auth
- pino + pino-http - structured app and request logging
- zod - request and environment validation
- tsx - TypeScript runtime and dev auto-reload

## Running locally

Prefer the root of the monorepo: `npm install && npm start` boots backend + frontend together. Use the
commands below only to work on the backend alone.

```bash
npm install
npm run dev      # tsx watch -> http://localhost:8080 (auto-reload)
npm start        # tsx, no auto-reload
npm run typecheck
```

## Configuration

### 1. backend/.env

This file is gitignored and not in the repo. Copy the template and fill in real values:

```bash
cp .env.example .env     # PowerShell: Copy-Item .env.example .env
```

[.env.example](.env.example) lists every key:

```
JWT_SECRET_KEY=your_long_random_secret_here
DB_USER=postgres
DB_PASSWORD=12345678
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cooking_helper
PORT=8080
LOG_LEVEL=info
```

`JWT_SECRET_KEY` is used by [src/middleware/jwtMiddleware.ts](src/middleware/jwtMiddleware.ts) (verifies
tokens) and [src/infrastructure/security/JwtTokenService.ts](src/infrastructure/security/JwtTokenService.ts)
(signs them at login). Without it, login throws and every protected route returns 403.
The rest of the env is validated with zod on startup; invalid ports or logger levels fail fast with a
clear configuration error. `LOG_LEVEL` controls the pino logger level and defaults to `info` when unset.

When you add a new env key, add it (without a value) to [.env.example](.env.example) too.

### 2. PostgreSQL connection - [src/config/env.ts](src/config/env.ts) and [src/db.ts](src/db.ts)

Credentials are read from the `DB_*` variables above, with the historical hardcoded values as fallback
defaults:

```ts
{
  user: "postgres",
  password: "12345678",
  host: "localhost",
  port: 5432,
  database: "cooking_helper",
}
```

Set the `DB_*` keys in `.env` if your Postgres differs - no need to edit [src/db.ts](src/db.ts).

### 3. Database schema - [database.sql](database.sql)

Run once against an empty database to create tables and seed reference data. It is NOT idempotent (it
mixes CREATE TABLE, ALTER TABLE, and INSERT) - running it twice will fail.

### 4. CORS - [src/app.ts](src/app.ts)

Hardcoded to `origin: "http://localhost:5173"`. If the frontend runs from a different origin, update
the app factory there.

## Structure

```
backend/
├── package.json          scripts and backend package metadata
├── tsconfig.json         TypeScript config and path aliases
├── jest.config.js        Jest + ts-jest config
├── eslint.config.js      regular ESLint config
├── eslint.sonarjs.config.js
├── database.sql          full schema + seed data (run once)
├── .env.example          env template (tracked) - copy to .env
├── .env                  JWT_SECRET_KEY + DB_* + PORT (you create - gitignored)
│
└── src/
    ├── app.ts                createApp(controllers); mounts middleware, health, and routers without listening
    ├── index.ts              runtime entry; listens on 8080 and shuts down server + pg pool cleanly
    ├── composition-root.ts   dependency injection: buildControllers(deps), plus real pg wiring
    ├── db.ts                 pg.Pool connection (reads DB_* env via config/env.ts)
    ├── config/env.ts         typed env loading and JWT secret guard
    ├── config/logger.ts      shared pino logger, LOG_LEVEL-aware and silent in tests
    │
    ├── domain/               innermost layer (no framework/db deps)
    │   ├── entities/         domain objects
    │   ├── errors/           AppError + NotFoundError / ValidationError / UnauthorizedError (carry HTTP status)
    │   └── repositories/     repository interfaces (TypeScript interface)
    │
    ├── application/
    │   ├── ports/            service interfaces: PasswordHasher, TokenService
    │   └── use-cases/        one class per operation (recipes/, recipe-types/, menus/, menu-categories/, pantry/, users/)
    │
    ├── infrastructure/
    │   ├── persistence/pg/   concrete pg repositories - ALL SQL lives here
    │   └── security/         BcryptPasswordHasher, JwtTokenService
    │
    ├── middleware/
    │   ├── jwtMiddleware.ts  authenticateToken - verifies Bearer JWT, attaches req.user
    │   ├── rateLimit.ts      authLimiter - rate limits register/login outside tests
    │   └── errorHandler.ts   turns thrown errors into { error } responses (mounted last)
    │
    ├── routes/               route factories (controller) => router, all under /api
    │   └── *.routes.ts
    │
    ├── controller/           thin HTTP adapters (DI classes) that call use cases
    │   └── *.controller.ts
    │
    ├── types/                ambient .d.ts files
    └── test/                 Jest setup, fake deps/test app helpers, and HTTP integration tests
```

## Architecture - clean (layered)

Dependencies point inward (Dependency Rule). The real graph is built in
[src/composition-root.ts](src/composition-root.ts) and consumed by [src/index.ts](src/index.ts). Tests can
reuse `buildControllers(deps)` with fakes and pass the result to [src/app.ts](src/app.ts). The app factory
mounts `helmet`, pino request logging, CORS, the 100kb JSON body parser, the public health check, domain
routers, and then the error handler in that order.

- **routes/** - factory functions `(controller) => router`; map `METHOD /path` directly to a
  controller handler, guard with `authenticateToken` (except `/health`, `/register`, and `/login`).
- **controller/** - thin classes; a handler reads `req`, calls a use case, sends the response. No try/catch.
- **application/validation/** - zod request schemas and the shared `validate()` helper. Schemas describe
  request shape only (types, required scalars, formats, ranges, array item shape).
- **application/use-cases/** - one class per operation with `execute(...)`: input validation + orchestration;
  throw domain errors; depend on repository/service interfaces only. Service ports in **application/ports/**.
- **domain/** - repository interfaces, entities, and `errors/AppError.ts` (errors carry an HTTP `status`).
  Entities such as `Recipe` and `Menu` keep domain invariants like non-empty ingredient/recipe lists, so
  each validation rule lives in one layer only.
- **infrastructure/persistence/pg/** - concrete repositories; ALL SQL; constructor takes the `pg.Pool`.
  **infrastructure/security/** - bcrypt + jwt adapters.

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

1. `POST /api/login` verifies the password via `BcryptPasswordHasher` and signs a JWT (payload `{ id }`,
   `expiresIn: "24h"`) via `JwtTokenService`.
2. Client sends `Authorization: Bearer <token>` on later requests.
3. [src/middleware/jwtMiddleware.ts](src/middleware/jwtMiddleware.ts) verifies with `JWT_SECRET_KEY`,
   attaches `req.user`, calls `next()`.
4. The current user's id always comes from `req.user.id` (never from the request body/params).

## API reference

All endpoints under `/api`. Everything except `/health`, `/register`, and `/login` requires
`Authorization: Bearer <token>`.

### Health ([src/routes/health.routes.ts](src/routes/health.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Liveness check, returns `{ status: "ok" }` |

### Auth ([src/routes/user.routes.ts](src/routes/user.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/register` | Create a user (`name`, `surname`, `login`, `password`) |
| POST | `/login` | Authenticate, returns `{ token }` |
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
| GET | `/recipes-filters-person/:id` | Filter a user's recipes |
| GET | `/recipes-stats` | Aggregated stats for the analytics page |

### Recipe types ([src/routes/type.routes.ts](src/routes/type.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/recipe-types` | List all |
| POST | `/recipe-types` | Create |
| GET | `/recipe-type/:id` | Single |
| PUT | `/recipe-type/:id` | Update |
| DELETE | `/recipe-type/:id` | Delete |

### User pantry ([src/routes/userIngredients.routes.ts](src/routes/userIngredients.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/user-ingredients/:id` | Get a user's pantry |
| PUT | `/user-ingredients/:id` | Add/replace pantry items |
| DELETE | `/user-ingredients/:userId/:ingredientId` | Remove a pantry item |
| PUT | `/user-ingredients/update-quantities/:userId` | Bulk update quantities |
| GET | `/user-ingredients/:userId/history/:ingredientId` | Purchase history |
| PUT | `/user-ingredients/:userId/history/:purchaseId` | Update a purchase entry |

### Menus ([src/routes/menu.routes.ts](src/routes/menu.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/menu` | All menus (also accepts category filter) |
| POST | `/create-menu` | Create a menu with recipes |
| GET | `/menu/:id` | Menu details + recipes |
| PUT | `/menu/:id` | Update a menu |
| DELETE | `/menu/:id` | Delete a menu |
| GET | `/menu-filters-person/:id` | A user's menus |

### Menu categories ([src/routes/menuCategory.routes.ts](src/routes/menuCategory.routes.ts))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/menu-categories` | List categories |

## Data model

Full schema in [database.sql](database.sql). Big picture:

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
