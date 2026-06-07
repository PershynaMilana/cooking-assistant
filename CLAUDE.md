# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two-app monorepo (no workspaces - each side has its own `package.json`):

- [backend/](backend/) - Node.js + Express 4 + PostgreSQL (`pg`) API on port `8080`
- [frontend/](frontend/) - React 18 + TypeScript + Vite on port `5173` (Tailwind CSS, React Router v6)
- [backend/database.sql](backend/database.sql) - full schema and seed data (run once against an empty DB)
- Root [package.json](package.json) is an orchestration shim: it pulls in `concurrently` and exposes scripts that drive both sub-packages. It also holds the single shared project version (see [Versioning](#versioning) below).
- [CHANGELOG.md](CHANGELOG.md) at the root is the single changelog for the whole project.

## Common commands

Preferred - from repository root ([package.json](package.json)):
```bash
npm install              # installs root + auto-runs postinstall in backend & frontend
npm start                # OR npm run dev - concurrently boots backend (8080) + frontend (5173)
npm run start:backend    # backend only (nodemon)
npm run start:frontend   # frontend only (vite)
```

The root `postinstall` hook (`npm --prefix backend install && npm --prefix frontend install`) means a single `npm i` at the root populates all three `node_modules`. Don't add a separate `install:all` script.

Per-app, if you need it directly:

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

There is no test suite in either app. Do not invent one when answering "how do I run tests".

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

## Required configuration

1. PostgreSQL connection in [backend/db.js](backend/db.js) reads the `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` environment variables, falling back to the historical hardcoded defaults (`postgres` / `12345678` / `localhost` / `5432` / `cooking_helper`) when unset.
2. Backend `.env` is gitignored. Copy [backend/.env.example](backend/.env.example) to `backend/.env` and fill it in. It holds `JWT_SECRET_KEY` (read by [backend/middleware/jwtMiddleware.js](backend/middleware/jwtMiddleware.js) and [backend/controller/user.controller.js](backend/controller/user.controller.js)) plus the `DB_*` keys and `PORT`. Without `JWT_SECRET_KEY`, login throws and every protected route 403s. When you add a new env key, add it (without a value) to `.env.example` too.
3. CORS in [backend/index.js](backend/index.js) is locked to `origin: "http://localhost:5173"`. If you change the frontend port or run from a different origin, update it here.
4. Database seeding: run all of [backend/database.sql](backend/database.sql) once on a fresh DB. The file is NOT idempotent - it mixes `CREATE TABLE`, `ALTER TABLE`, and `INSERT` statements representing the historical migration history, and re-running it on a populated DB will error.

## Architecture

### Backend - controller / route / middleware

Express bootstrap in [backend/index.js](backend/index.js) mounts six routers under `/api`:

- `user.routes` -> register, login, get users
- `recipe.routes` -> recipe CRUD, ingredient list, filters, stats
- `type.routes` -> recipe types CRUD
- `userIngredients.routes` -> per-user pantry + purchase history
- `menu.routes` -> menu CRUD + per-user filter
- `menuCategory.routes` -> menu category list, menus by category

Each route file is a thin shim that maps `METHOD /path` -> controller method and (almost always) wraps it with `authenticateToken`. Only `/register` and `/login` are public.

Controllers are class instances exported as singletons (`module.exports = new XController()`) and write SQL directly via the shared `pool` from [backend/db.js](backend/db.js) - there is no ORM, no repository layer, no service layer. When adding a feature: add SQL in the controller, add a route in `routes/`, mount it in `index.js` if it's a new router.

Auth flow: [backend/controller/user.controller.js](backend/controller/user.controller.js) signs a JWT with payload `{ id }` and `expiresIn: "24h"`. [backend/middleware/jwtMiddleware.js](backend/middleware/jwtMiddleware.js) reads `Authorization: Bearer <token>`, verifies, and attaches `req.user`. Controllers downstream pull `req.user.id` (or accept `person_id` from the body - both patterns exist in this codebase).

### Frontend - pages, routing, auth

Routing is centralized in [frontend/src/App.tsx](frontend/src/App.tsx). All non-auth routes are wrapped in `<PrivateRoute>`, which gates purely on the presence of `authToken` in `localStorage` ([frontend/src/components/PrivateRoute.tsx](frontend/src/components/PrivateRoute.tsx)). It does NOT verify expiry - an expired token still renders the page, and the API call inside is what 403s.

Token storage gotcha - read this before touching auth code: the actual key used everywhere (Header, LoginPage, every page that calls the API) is `"authToken"`. The hook [frontend/src/hooks/useAuth.tsx](frontend/src/hooks/useAuth.tsx) reads/writes a different key `"token"` and is effectively dead code; do not rely on it for gating decisions. If you need auth state in a new component, mirror the pattern from `Header.tsx` / `PrivateRoute.tsx` (read `authToken` directly) rather than importing `useAuth`.

API calls are made with `axios` directly from each page - there is no shared API client, no interceptor, no central error handler. Each request manually attaches `Authorization: Bearer ${localStorage.getItem("authToken")}`. When adding a new endpoint call, follow the existing inline pattern; do not introduce a wrapper unless the user asks for one.

Pages are organized by domain folder under [frontend/src/pages/](frontend/src/pages/) (`auth`, `recipes`, `user-recipes`, `menu`, `user-menu`, `recipe-types`, `person-ingradients`, `statistics`, `not-found`). Reusable UI lives in [frontend/src/components/](frontend/src/components/). Stats page uses `apexcharts`/`react-apexcharts` and exports PDFs via `@react-pdf/renderer` + `jspdf`.

### Database model highlights

Key tables and joins (see [backend/database.sql](backend/database.sql) for the full picture):
- `person` (users) <-> `recipes` via `person_id`
- `recipes` <-> `ingredients` through `recipe_ingredients` (with `quantity_recipe_ingredients`)
- `recipes.type_id` -> `recipe_types`
- `person` <-> `ingredients` through `person_ingredients` (the pantry, with `quantity_person_ingradient` - note the misspelling, it's the actual column name) and `ingredient_purchases` (history)
- `menu` (per-user, with `category_id` -> `menu_category`) <-> `recipes` through `menu_recipe`
- `ingredients` carries `id_unit_measurement` -> `unit_measurement` plus metadata (`allergens`, `days_to_expire`, `seasonality`, `storage_condition`)

The "missing ingredients for a menu" feature works by joining `menu_recipe` -> `recipe_ingredients` -> `ingredients` and subtracting the user's `person_ingredients`.

## Conventions in this codebase

- Comments are plain `//` with a single space and a lowercase first letter (acronyms / proper nouns like JWT, SQL, URL, Express keep their case, e.g. `// JWT login`). The old `//?` / `//!` prefixes were removed - don't reintroduce them.
- Backend uses CommonJS (`require`/`module.exports`); frontend uses ESM + TS. Don't mix them.
- The frontend has minor inconsistencies (typo `person-ingradients` folder, the dead `useAuth` hook). Don't "clean these up" as part of an unrelated change - they're load-bearing for existing imports.
- Commit lockfiles and tool configs. `package-lock.json` (root/backend/frontend) and `eslint.config.js` are tracked - committing them keeps installs reproducible and lets CI run `npm ci`. (They used to be gitignored; that rule was removed.)
