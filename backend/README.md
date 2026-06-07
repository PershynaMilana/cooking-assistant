# Cooking Assistant - Backend

Express + PostgreSQL API for the [Cooking Assistant](../README.md) platform. Listens on port 8080 and
serves the [frontend](../frontend/README.md) at http://localhost:5173 (CORS-restricted).

## Tech stack

- Node.js + Express 4 - HTTP server
- PostgreSQL via `pg` (connection pool, raw SQL, no ORM)
- jsonwebtoken + bcrypt - auth and password hashing
- dotenv - env loading
- nodemon - dev auto-reload

## Running locally

Prefer the root of the monorepo: `npm install && npm start` boots backend + frontend together. Use the
commands below only to work on the backend alone.

```bash
npm install
npm run dev      # nodemon -> http://localhost:8080 (auto-reload)
npm start        # plain node, no auto-reload
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
```

`JWT_SECRET_KEY` is used by [middleware/jwtMiddleware.js](middleware/jwtMiddleware.js) (verifies tokens)
and [controller/user.controller.js](controller/user.controller.js) (signs them at login). Without it,
login throws and every protected route returns 403.

When you add a new env key, add it (without a value) to [.env.example](.env.example) too.

### 2. PostgreSQL connection - [db.js](db.js)

Credentials are read from the `DB_*` variables above, with the historical hardcoded values as fallback
defaults:

```js
{
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "12345678",
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || "cooking_helper",
}
```

Set the `DB_*` keys in `.env` if your Postgres differs - no need to edit [db.js](db.js).

### 3. Database schema - [database.sql](database.sql)

Run once against an empty database to create tables and seed reference data. It is NOT idempotent (it
mixes CREATE TABLE, ALTER TABLE, and INSERT) - running it twice will fail.

### 4. CORS - [index.js](index.js)

Hardcoded to `origin: "http://localhost:5173"`. If the frontend runs from a different origin, update
`corsOptions` there.

## Structure

```
backend/
├── index.js              express bootstrap, mounts /api routers, listens on 8080
├── db.js                 pg.Pool connection (reads DB_* env)
├── database.sql          full schema + seed data (run once)
├── .env.example          env template (tracked) - copy to .env
├── .env                  JWT_SECRET_KEY + DB_* + PORT (you create - gitignored)
│
├── middleware/
│   └── jwtMiddleware.js  authenticateToken - verifies Bearer JWT, attaches req.user
│
├── routes/               thin route -> controller mapping, all under /api
│   ├── user.routes.js
│   ├── recipe.routes.js
│   ├── type.routes.js
│   ├── userIngredients.routes.js
│   ├── menu.routes.js
│   └── menuCategory.routes.js
│
└── controller/           business logic + raw SQL
    ├── user.controller.js
    ├── recipe.controller.js
    ├── type.controller.js
    ├── userIngredients.controller.js
    ├── menu.controller.js
    └── menuCategory.controller.js
```

## Architecture - route -> controller -> SQL

Deliberately thin pipeline, no ORM, no service layer, no repository layer.

1. [index.js](index.js) wires CORS, JSON parsing, and mounts six routers under `/api`.
2. [routes/](routes/) files are shims: `METHOD /path` -> controller method, almost always wrapped in
   `authenticateToken`. Only `/register` and `/login` are public.
3. [controller/](controller/) files are class instances exported as singletons
   (`module.exports = new XController()`). Methods write SQL directly through the shared `pg.Pool`.

To add a feature: write the SQL in a controller method, register the route in the right `routes/*.js`,
and if it is a new domain, create a router and mount it in [index.js](index.js).

## Auth flow

1. `POST /api/login` verifies the password via `bcrypt.compare` and signs a JWT with payload `{ id }`
   and `expiresIn: "24h"`.
2. Client sends `Authorization: Bearer <token>` on later requests.
3. [middleware/jwtMiddleware.js](middleware/jwtMiddleware.js) verifies with `JWT_SECRET_KEY`, attaches
   `req.user`, calls `next()`.
4. Controllers read `req.user.id` (some also accept `person_id` in the body - both patterns exist;
   prefer `req.user.id` for new code).

## API reference

All endpoints under `/api`. Everything except `/register` and `/login` requires
`Authorization: Bearer <token>`.

### Auth ([routes/user.routes.js](routes/user.routes.js))
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/register` | Create a user (`name`, `surname`, `login`, `password`) |
| POST | `/login` | Authenticate, returns `{ token }` |
| GET | `/user` | List all users |

### Recipes ([routes/recipe.routes.js](routes/recipe.routes.js))
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

### Recipe types ([routes/type.routes.js](routes/type.routes.js))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/recipe-types` | List all |
| POST | `/recipe-types` | Create |
| GET | `/recipe-type/:id` | Single |
| PUT | `/recipe-type/:id` | Update |
| DELETE | `/recipe-type/:id` | Delete |

### User pantry ([routes/userIngredients.routes.js](routes/userIngredients.routes.js))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/user-ingredients/:id` | Get a user's pantry |
| PUT | `/user-ingredients/:id` | Add/replace pantry items |
| DELETE | `/user-ingredients/:userId/:ingredientId` | Remove a pantry item |
| PUT | `/user-ingredients/update-quantities/:userId` | Bulk update quantities |
| GET | `/user-ingredients/:userId/history/:ingredientId` | Purchase history |
| PUT | `/user-ingredients/:userId/history/:purchaseId` | Update a purchase entry |

### Menus ([routes/menu.routes.js](routes/menu.routes.js))
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/menu` | All menus (also accepts category filter) |
| POST | `/create-menu` | Create a menu with recipes |
| GET | `/menu/:id` | Menu details + recipes |
| PUT | `/menu/:id` | Update a menu |
| DELETE | `/menu/:id` | Delete a menu |
| GET | `/menu-filters-person/:id` | A user's menus |

### Menu categories ([routes/menuCategory.routes.js](routes/menuCategory.routes.js))
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

- CommonJS (`require` / `module.exports`) - do not introduce ESM.
- Controllers are class instances exported as singletons - match the pattern.
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
