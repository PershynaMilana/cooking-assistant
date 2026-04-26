# 🍳 Cooking Assistant — Backend

Express + PostgreSQL API server for the [Cooking Assistant](../README.md) platform. Listens on port `8080` and serves the [frontend](../frontend/README.md) at `http://localhost:5173` (CORS-restricted).

## 🛠️ Tech Stack

- **Node.js** + **Express 4** — HTTP server
- **PostgreSQL** via `pg` (connection pool, raw SQL, no ORM)
- **jsonwebtoken** + **bcrypt** — auth & password hashing
- **dotenv** — env loading
- **nodemon** — dev auto-reload

## 🚀 Running locally

> Prefer the **root** of the monorepo: `npm install && npm start` from there boots backend + frontend together. See [the root README](../README.md). Use the commands below only when you want to work on the backend in isolation.

```bash
npm install
npm run dev      # nodemon -> http://localhost:8080  (auto-reload)
npm start        # plain node, no auto-reload (production-style)
```

## ⚙️ Required configuration

### 1. `backend/.env`
Create this file (it is gitignored):
```
JWT_SECRET_KEY=your_long_random_secret_here
```

Used by:
- [middleware/jwtMiddleware.js](middleware/jwtMiddleware.js) — verifies tokens on every protected route
- [controller/user.controller.js](controller/user.controller.js) — signs tokens at login

Without it, login throws and every protected route returns 403.

### 2. PostgreSQL connection — [db.js](db.js)
Credentials are **hardcoded**, not env-driven. Defaults:
```js
{
  user: "postgres",
  password: "12345678",
  host: "localhost",
  port: 5432,
  database: "cooking_helper_final",
}
```
Edit [db.js](db.js) directly if any of these differ for you.

### 3. Database schema — [database.sql](database.sql)
Run this once against an empty PostgreSQL database to create tables and seed reference data (recipe types, units, menu categories, sample ingredients).

⚠️ **Not idempotent** — the file represents the historical migration sequence (mixed `CREATE TABLE`, `ALTER TABLE`, `INSERT`). Running it twice on the same DB will fail.

### 4. CORS — [index.js](index.js)
Hardcoded to `origin: "http://localhost:5173"`. If the frontend runs from a different origin, update `corsOptions` here.

## 📁 Structure

```
backend/
├── index.js              # express bootstrap, mounts /api routers, listens on 8080
├── db.js                 # pg.Pool connection
├── database.sql          # full schema + seed data (run once)
├── .env                  # JWT_SECRET_KEY (you create — gitignored)
│
├── middleware/
│   └── jwtMiddleware.js  # authenticateToken — verifies Bearer JWT, attaches req.user
│
├── routes/               # thin route -> controller mapping, all under /api
│   ├── user.routes.js
│   ├── recipe.routes.js
│   ├── type.routes.js
│   ├── userIngredients.routes.js
│   ├── menu.routes.js
│   └── menuCategory.routes.js
│
└── controller/           # business logic + raw SQL
    ├── user.controller.js
    ├── recipe.controller.js
    ├── type.controller.js
    ├── userIngredients.controller.js
    ├── menu.controller.js
    └── menuCategory.controller.js
```

## 🏛️ Architecture — route -> controller -> SQL

Deliberately thin pipeline, no ORM, no service layer, no repository layer.

1. **[index.js](index.js)** wires CORS, JSON parsing, and mounts six routers under `/api`.
2. **[routes/](routes/)** files are shims — `METHOD /path` -> controller method, almost always wrapped in `authenticateToken`. Only `/register` and `/login` are public.
3. **[controller/](controller/)** files are class instances exported as singletons (`module.exports = new XController()`). Methods write SQL directly through the shared `pg.Pool` from [db.js](db.js).

To add a feature:
1. Write the SQL inside a controller method.
2. Register the route in the appropriate `routes/*.js`.
3. If it's a new domain entirely, create a new router file and mount it in [index.js](index.js).

## 🔐 Auth flow

1. `POST /api/login` -> [controller/user.controller.js](controller/user.controller.js) verifies password via `bcrypt.compare`, signs a JWT with payload `{ id }` and `expiresIn: "24h"`.
2. Client sends `Authorization: Bearer <token>` on subsequent requests.
3. [middleware/jwtMiddleware.js](middleware/jwtMiddleware.js) verifies with `JWT_SECRET_KEY`, attaches `req.user`, calls `next()`.
4. Downstream controllers read `req.user.id` (or accept `person_id` in the body — both patterns exist; prefer `req.user.id` for new code).

## 🔌 API Reference

All endpoints under `/api`. Everything except `/register` and `/login` requires `Authorization: Bearer <token>`.

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
| GET | `/menu-categories` | List Breakfast / Lunch / Dinner |

## 🗄️ Data model

Full schema in [database.sql](database.sql). Big picture:

- `person` ↔ `recipes` via `person_id` (recipe owner)
- `recipes` ↔ `ingredients` through `recipe_ingredients` (with `quantity_recipe_ingredients`)
- `recipes.type_id` -> `recipe_types`
- `person` ↔ `ingredients` through `person_ingredients` (the pantry, with `quantity_person_ingradient` *(sic — typo, leave it)*) and `ingredient_purchases` (history log)
- `ingredients.id_unit_measurement` -> `unit_measurement` (gr, kg, ml, l, teaspoon, tablespoon, cup, pcs)
- `ingredients` carries metadata: `allergens`, `days_to_expire`, `seasonality`, `storage_condition`
- `menu` (per-user, with `category_id` -> `menu_category`) ↔ `recipes` through `menu_recipe`

The "ingredients you're missing for a planned menu" query joins `menu_recipe` -> `recipe_ingredients` -> `ingredients` and subtracts the user's `person_ingredients`.

## 🎨 Conventions

- **CommonJS** (`require` / `module.exports`) — keep it that way; do not introduce ESM.
- Controllers are class instances exported as singletons — match the pattern.
- Comments often use `//?` (route description) and `//!` (change marker / TODO). Match this style when editing those files.
- Raw SQL with `$1`, `$2`, … parameters via `db.query(text, values)` — never string-concatenate user input.

## 📈 Versioning & changelog

The backend has its **own** version, independent of the frontend. Bump it only when you change backend code; keep the changelog up to date.

```bash
# from backend/
npm run patch    # 1.0.0 -> 1.0.1  (bug fixes)
npm run minor    # 1.0.1 -> 1.1.0  (new endpoint, new field, additive)
npm run major    # 1.1.0 -> 2.0.0  (breaking API/schema change)
```

These scripts wrap `npm version <level> --no-git-tag-version` so you never accidentally trigger npm's auto-commit/tag.

After bumping, open [`CHANGELOG.md`](CHANGELOG.md), move your entries from `## [Unreleased]` into a new `## [x.y.z] — YYYY-MM-DD` section, then commit:

```bash
git add backend/package.json backend/package-lock.json backend/CHANGELOG.md
git commit -m "backend: 1.0.0 -> 1.1.0 — add /api/recipe-search-by-time"
git tag backend-v1.1.0
```

**SemVer rules of thumb for this codebase:**
- `PATCH` — bug fix in a controller, SQL tweak that doesn't change response shape, fixed validation.
- `MINOR` — new endpoint, new optional field on a response, new column added (backward-compatible migration).
- `MAJOR` — removed/renamed endpoint, changed response shape, changed required request body, breaking schema migration.

See the full project workflow in the [root README](../README.md#versioning--changelogs).

## 🔗 Related

- [Root README](../README.md) — project overview & monorepo scripts
- [Frontend README](../frontend/README.md) — React client
- [CHANGELOG.md](CHANGELOG.md) — backend version history
- [CLAUDE.md](../CLAUDE.md) — architecture notes for AI tooling
