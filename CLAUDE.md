# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two-app monorepo (no workspaces — each side has its own `package.json`):

- [backend/](backend/) — Node.js + Express 4 + PostgreSQL (`pg`) API on port `8080`
- [frontend/](frontend/) — React 18 + TypeScript + Vite on port `5173` (Tailwind CSS, React Router v6)
- [backend/database.sql](backend/database.sql) — full schema **and** seed data (run once against an empty DB)
- Root [package.json](package.json) is an orchestration shim: it pulls in `concurrently` and exposes scripts that drive both sub-packages. **Versions are NOT synced** — root, backend, and frontend each track their own version and changelog (see [Versioning](#versioning--independent-per-package) below).

## Common commands

**Preferred — from repository root** ([package.json](package.json)):
```bash
npm install              # installs root + auto-runs postinstall in backend & frontend
npm start                # OR npm run dev — concurrently boots backend (8080) + frontend (5173)
npm run start:backend    # backend only (nodemon)
npm run start:frontend   # frontend only (vite)
```

The root `postinstall` hook (`npm --prefix backend install && npm --prefix frontend install`) means a single `npm i` at the root populates **all three** `node_modules`. Don't add a separate `install:all` script.

### Versioning — independent per package

`backend/`, `frontend/`, and root each have **their own version**. There is intentionally **no `postversion` sync hook** — bumping one package does not bump the others. This is the correct shape for this monorepo: a frontend bug fix should not bump the backend version (because the backend changelog would lie about what changed).

When the user asks for a bump, run it in the matching folder. All three `package.json` files expose the same short scripts — `patch`, `minor`, `major` — that wrap `npm version <level> --no-git-tag-version` so you can't forget the flag:

```bash
cd frontend && npm run patch     # frontend-only change
cd backend && npm run patch      # backend-only change
npm run minor                    # at root — coordinated product release (umbrella)
```

The literal `npm version patch --no-git-tag-version` still works in any of the three folders if needed. Bump and changelog edits land in the same git commit as the code change, manually committed and tagged.

Tag conventions: `frontend-v1.1.0`, `backend-v1.1.0`, `v1.1.0` (root). Each package has its own `CHANGELOG.md` ([`CHANGELOG.md`](CHANGELOG.md), [`backend/CHANGELOG.md`](backend/CHANGELOG.md), [`frontend/CHANGELOG.md`](frontend/CHANGELOG.md)) following [Keep a Changelog](https://keepachangelog.com/) — entries go under `## [Unreleased]` while in flight, then move into a dated version heading at bump time.

**Don't bump versions for refactors, doc changes, comment edits, or anything user-invisible** — those land without a version bump.

### ⚠️ Always update the changelog while implementing features

This is a **hard rule** — applies to every Claude session that ships user-visible code:

1. **The moment** you finish implementing a user-visible change, edit the matching `CHANGELOG.md` (`backend/CHANGELOG.md` for API/SQL/server changes, `frontend/CHANGELOG.md` for UI/page/component changes) and add an entry under the `## [Unreleased]` heading.
2. Use the standard [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) sub-headings: `Added` (new feature), `Changed` (behavioral change to existing feature), `Fixed` (bug fix), `Removed`, `Deprecated`, `Security`. Create the sub-heading if it isn't there yet.
3. Write the entry from the **user's perspective**, not the code's. ✅ "Filter recipes by cooking time range" — ❌ "Add `time_min` and `time_max` query params to `/api/recipes-by-filters`".
4. **Do NOT bump the version** while the work is still in flight. Versions get bumped at release time (when the user explicitly says "let's release" or "bump version") — at that moment the entire `## [Unreleased]` block gets renamed to `## [x.y.z] — YYYY-MM-DD` and a fresh empty `## [Unreleased]` is added on top.
5. If you change something **across both packages**, add an entry to **both** `backend/CHANGELOG.md` and `frontend/CHANGELOG.md` describing what each side did.

**Skip changelog entries for:** code formatting, comment edits, doc-only changes, internal refactors with no behavior change, dependency lockfile updates, work-in-progress that doesn't ship. If a future user couldn't tell the difference, don't write an entry.

When in doubt, err on the side of writing one — a slightly verbose changelog is cheap; missing entries are not.

### Commit conventions

**One commit = code change + version bump + changelog update.** Always bundle all three; never split them.

**Message format:** `<scope> <oldver> -> <newver>: <short description>`

```
frontend 1.0.0 -> 1.0.1: fix recipe filter dropdown closing on first click
backend  1.0.0 -> 1.1.0: add /api/recipes-by-cooking-time endpoint
1.0.0 -> 1.1.0: coordinated release — cooking-time filter (frontend + backend)
```

**Why:** the user reads code in VSCode with GitLens blame hover and wants the version range visible inline on each line — confirmed preference, not optional.

**Non-shipping changes** (docs, refactor, dependency bump) — no bump, no version range:
```
docs: clarify auth token gotcha in CLAUDE.md
chore: bump axios 1.7 -> 1.8
refactor(frontend): extract RecipeCard styles
```

**After committing, tag:**
```bash
git tag frontend-v1.1.0   # frontend release
git tag backend-v1.1.0    # backend release
git tag v1.1.0            # root umbrella
```

**Never `git push` (including `--tags`) without explicit user permission.**

**Per-app, if you need it directly:**

Backend ([backend/](backend/)):
```bash
npm run dev    # nodemon -> http://localhost:8080
npm start      # plain node, no auto-reload
```

Frontend ([frontend/](frontend/)):
```bash
npm run dev      # vite dev server -> http://localhost:5173
npm run build    # tsc -b && vite build  (real type-check happens here)
npm run preview  # serve production build
npm run lint     # eslint .
```

There is **no test suite** in either app. Do not invent one when answering "how do I run tests".

## Required configuration

1. **PostgreSQL connection** is hardcoded in [backend/db.js](backend/db.js) (`user: postgres`, `password: 12345678`, `database: cooking_helper_final`). Edit this file directly to change credentials — there is no `DATABASE_URL` env override.
2. **Backend `.env`** must contain `JWT_SECRET_KEY=...`. Read by [backend/middleware/jwtMiddleware.js](backend/middleware/jwtMiddleware.js) and [backend/controller/user.controller.js](backend/controller/user.controller.js); without it login throws and every protected route 403s.
3. **CORS** in [backend/index.js](backend/index.js) is locked to `origin: "http://localhost:5173"`. If you change the frontend port or run from a different origin, update it here.
4. **Database seeding**: run all of [backend/database.sql](backend/database.sql) once on a fresh DB. The file is *not* idempotent — it mixes `CREATE TABLE`, `ALTER TABLE`, and `INSERT` statements representing the historical migration history of the project, and re-running it on a populated DB will error.

## Architecture

### Backend — controller / route / middleware

Express bootstrap in [backend/index.js](backend/index.js) mounts six routers under `/api`:

- `user.routes` -> register, login, get users
- `recipe.routes` -> recipe CRUD, ingredient list, filters, stats
- `type.routes` -> recipe types CRUD
- `userIngredients.routes` -> per-user pantry + purchase history
- `menu.routes` -> menu CRUD + per-user filter
- `menuCategory.routes` -> menu category list, menus by category

Each route file is a thin shim that maps `METHOD /path` -> controller method and (almost always) wraps it with `authenticateToken`. Only `/register` and `/login` are public.

Controllers are class instances exported as singletons (`module.exports = new XController()`) and write SQL directly via the shared `pool` from [backend/db.js](backend/db.js) — there is no ORM, no repository layer, no service layer. When adding a feature: add SQL in the controller, add a route in `routes/`, mount it in `index.js` if it's a new router.

Auth flow: [backend/controller/user.controller.js](backend/controller/user.controller.js) signs a JWT with payload `{ id }` and `expiresIn: "24h"`. [backend/middleware/jwtMiddleware.js](backend/middleware/jwtMiddleware.js) reads `Authorization: Bearer <token>`, verifies, and attaches `req.user`. Controllers downstream pull `req.user.id` (or accept `person_id` from the body — both patterns exist in this codebase).

### Frontend — pages, routing, auth

Routing is centralized in [frontend/src/App.tsx](frontend/src/App.tsx). All non-auth routes are wrapped in `<PrivateRoute>`, which gates purely on the presence of `authToken` in `localStorage` ([frontend/src/components/PrivateRoute.tsx](frontend/src/components/PrivateRoute.tsx)). It does **not** verify expiry — an expired token still renders the page, and the API call inside is what 403s.

**Token storage gotcha — read this before touching auth code:** the actual key used everywhere (Header, LoginPage, every page that calls the API) is `"authToken"`. The hook [frontend/src/hooks/useAuth.tsx](frontend/src/hooks/useAuth.tsx) reads/writes a *different* key `"token"` and is effectively dead code; do not rely on it for gating decisions. If you need auth state in a new component, mirror the pattern from `Header.tsx` / `PrivateRoute.tsx` (read `authToken` directly) rather than importing `useAuth`.

API calls are made with `axios` directly from each page — there is no shared API client, no interceptor, no central error handler. Each request manually attaches `Authorization: Bearer ${localStorage.getItem("authToken")}`. When adding a new endpoint call, follow the existing inline pattern; do not introduce a wrapper unless the user asks for one.

Pages are organized by domain folder under [frontend/src/pages/](frontend/src/pages/) (`auth`, `recipes`, `user-recipes`, `menu`, `user-menu`, `recipe-types`, `person-ingradients`, `statistics`, `not-found`). Reusable UI lives in [frontend/src/components/](frontend/src/components/). Stats page uses `apexcharts`/`react-apexcharts` and exports PDFs via `@react-pdf/renderer` + `jspdf`.

### Database model highlights

Key tables and joins (see [backend/database.sql](backend/database.sql) for the full picture):
- `person` (users) ↔ `recipes` via `person_id`
- `recipes` ↔ `ingredients` through `recipe_ingredients` (with `quantity_recipe_ingredients`)
- `recipes.type_id` -> `recipe_types`
- `person` ↔ `ingredients` through `person_ingredients` (the pantry, with `quantity_person_ingradient` — note the misspelling, it's the actual column name) and `ingredient_purchases` (history)
- `menu` (per-user, with `category_id` -> `menu_category`) ↔ `recipes` through `menu_recipe`
- `ingredients` carries `id_unit_measurement` -> `unit_measurement` plus metadata (`allergens`, `days_to_expire`, `seasonality`, `storage_condition`)

The "missing ingredients for a menu" feature works by joining `menu_recipe` -> `recipe_ingredients` -> `ingredients` and subtracting the user's `person_ingredients`.

## Conventions in this codebase

- Comments often use the `//?` and `//!` prefixes (route descriptions, change markers). Match this style when editing those files.
- Backend uses CommonJS (`require`/`module.exports`); frontend uses ESM + TS. Don't mix them.
- The frontend has minor inconsistencies (typo `person-ingradients` folder, the dead `useAuth` hook). Don't "clean these up" as part of an unrelated change — they're load-bearing for existing imports.
- `eslint.config.js` and `package-lock.json` are gitignored at the repo root (see [.gitignore](.gitignore)). Do not commit them.
