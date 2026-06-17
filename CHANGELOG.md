# Changelog

One changelog for the whole project (backend + frontend).

How versioning works here:

The app has one shared version, kept in the root package.json, and it goes up by one each release.
A release bumps backend/package.json and/or frontend/package.json up to that shared number, but only
for the side it actually changed. The untouched side keeps its old number, so a package version just
means "the last release this package changed in" and may skip numbers. It is not strict SemVer.

Each version below lists what changed under Backend / Frontend / Project. A side that was not touched
in a release has no line.

Why we moved to this:

Before, the repo had three separate versions (root, backend, frontend) and three changelogs plus git
tags. For a two-app project that was more bookkeeping than it was worth, so we dropped the per-package
changelogs and the tags and now track everything here against one shared version.


## Unreleased


## 1.37 - 2026-06-16

Frontend:
- Added: a frontend test suite (Jest + React Testing Library) that locks in current behaviour ahead of the upcoming UI refactor - unit tests for every API-layer function and the shared error helper, tests for the reusable UI components, and a behavioral smoke test for every page (login, registration, the recipe and menu lists, recipe and menu details, recipe and menu creation and editing, recipe types, the pantry, and statistics).


## 1.36 - 2026-06-16

Frontend:
- Added: a Jest + React Testing Library test setup (jsdom) so UI components can be unit-tested, with a first smoke test covering the confirmation modal.


## 1.35 - 2026-06-16

Backend:
- Changed: the API server now listens on port 3000 (previously 8080), and the default allowed CORS origin is now http://localhost:8080 (previously http://localhost:5173).

Frontend:
- Changed: the dev server now runs on port 8080 (previously 5173), and the default backend API URL is now http://localhost:3000 (previously http://localhost:8080).


## 1.34 - 2026-06-16

Frontend:
- Changed: ingredient-pantry and statistics HTTP calls extracted from their pages/components into `src/api/userIngredientsApi.ts` and `src/api/statsApi.ts`; paths centralised in `src/api/endpoints.ts`; pages and components no longer call axios directly or build hardcoded backend URLs for requests, completing the API-layer migration of every frontend domain.


## 1.33 - 2026-06-16

Frontend:
- Changed: menu and user-menu HTTP calls extracted from their pages into `src/api/menusApi.ts` and `src/api/menuCategoriesApi.ts`; `getRecipes()` added to `src/api/recipesApi.ts`; paths centralised in `src/api/endpoints.ts`; pages no longer call axios/fetch directly or reference hardcoded backend URLs.


## 1.32 - 2026-06-15

Frontend:
- Changed: recipe and recipe-type HTTP calls extracted from their pages into `src/api/recipesApi.ts`, `src/api/recipeTypesApi.ts`, and `src/api/ingredientsApi.ts`; paths centralised in `src/api/endpoints.ts`; pages no longer call axios/fetch directly or reference hardcoded backend URLs.


## 1.31 - 2026-06-15

Frontend:
- Changed: auth HTTP calls (login, register) extracted from LoginPage/RegisterPage into `src/api/authApi.ts`; paths centralised in `src/api/endpoints.ts`; pages no longer call axios directly or reference hardcoded backend URLs.


## 1.30 - 2026-06-15

Frontend:
- Added: shared axios client instance with configurable base URL (via `VITE_API_URL` env var) and automatic auth-token injection, establishing the API layer foundation for future migration of inline HTTP calls.


## 1.29 - 2026-06-14

Frontend:
- Added: strict linting, accessibility checks, and code-quality analysis (ESLint strict mode, jsx-a11y, SonarJS) enforced on every commit via pre-commit hook and in CI.
- Added: Prettier formatting enforced for all frontend TypeScript, TSX, and CSS files in CI and pre-commit.
- Added: aggregate root scripts (`lint`, `typecheck`, `test`, `build`, `verify`) to run checks across both packages from the repo root.


## 1.28 - 2026-06-14

Frontend:
- Fixed: frontend build and lint now pass with 0 errors (unused-variable, no-explicit-any, unused-catch-binding, and ban-ts-comment errors resolved).
- Fixed: removed unused Vite scaffold leftovers - vite.svg, react.svg, App.css, and 16 unreferenced Montserrat font variants.


## 1.27 - 2026-06-13

Backend:
- Fixed: editing a past purchase no longer overwrites the pantry stock with the sum of all
  purchases - it now adjusts the stock by the change, so ingredients you have already used up
  stay accounted for.
- Authorization now accepts only the `Bearer` scheme; a token sent under any other scheme is
  rejected with 401.
- The statistics page and the menu detail view load faster (their database queries no longer run
  one-by-one).

## 1.26 - 2026-06-13

Backend:
- Creating or editing a recipe now accepts the number of servings sent as text (the
  way the current app sends it), instead of rejecting it with a validation error.
- Adding pantry ingredients, updating their quantities, and building or editing a menu
  now reject duplicate items in a single request with a clear 400 error.
- Pantry quantities must be whole numbers: a fractional amount is rejected with a 400
  error instead of failing with a server error.
- Concurrent updates to the same pantry ingredient no longer race and lose changes.

Project:
- Documentation and release metadata fixes: the example JWT secret in the backend
  README now meets the required minimum length, and the lockfile versions match the
  current release.

Backend:
- Security: recipes and menus can now be edited and deleted only by their owner; a request against
  someone else's recipe or menu returns 404. Deleting a recipe type still removes all recipes of that
  type, and no longer fails with a server error when such a recipe is part of a menu.
- Login no longer reveals whether a login exists: unknown login and wrong password both return the
  same 401 "Invalid login or password". Registering an already taken login returns a clear 409 instead
  of a server error. Server errors no longer expose internal details to the client.
- Malformed list filters (recipe and menu search) are rejected with a clear 400 error instead of
  failing with a server error, and searching menus by a name containing "%" works correctly.
- Pantry fixes: lowering an ingredient quantity is now saved (previously it was silently ignored),
  and pantry and purchase quantities must be at least 1 (a zero-quantity ingredient simply should not
  exist in the pantry - remove it instead). Recipe ingredient amounts equal to 0 are rejected too, and
  the amount field is accepted under either of its two historical names on both create and update.
- Reliability: a dropped idle database connection no longer crashes the server, and frequent lookups
  got database indexes. `JWT_SECRET_KEY` must now be at least 32 characters (checked at startup).


## 1.24 - 2026-06-11

Backend:
- Switched password hashing from bcrypt to the API-compatible bcryptjs (same hash format, so existing
  passwords keep working). This removes bcrypt's vulnerable native build tooling and brings the whole
  project to zero dependency advisories.
- Made the allowed CORS origin configurable through the `CORS_ORIGIN` environment variable (defaulting to
  `http://localhost:5173`), so a deployed frontend no longer needs a code change.


## 1.23 - 2026-06-11

Backend:
- Replaced the single non-idempotent database.sql setup with versioned migrations (node-pg-migrate) and
  a separate, re-runnable seed step, and removed the legacy database.sql. The schema is now created and
  rolled back reproducibly with `npm run migrate up` / `down`, and reference and sample data are loaded with
  `npm run seed`. An already populated database can adopt the migrations without losing data via
  `npm run migrate up -- --fake`.
- Audited and patched dependency vulnerabilities: the root project is now clean, and the backend's
  remaining advisories are limited to bcrypt's native build tooling.


## 1.22 - 2026-06-11

Backend:
- Added schema validation (zod) for all request input, so malformed requests are rejected with a clear
  400 error instead of failing deeper. Unified every error response to the { error } shape (auth errors
  included) and added a JSON 404 for unknown routes. Environment variables are validated on startup.


## 1.21 - 2026-06-11

Backend:
- Hardened the server for production: security headers via helmet, rate limiting on the login and
  register endpoints, an explicit request body size limit, a /api/health check, structured logging
  with pino (replacing console), and graceful shutdown that drains the server and closes the database
  pool on SIGTERM/SIGINT.


## 1.20 - 2026-06-11

Backend:
- Upgraded the backend to Express 5. Async route handlers now rely on the framework's built-in
  promise-rejection forwarding, so the manual asyncHandler wrapper was removed. No API or behavior change.


## 1.19 - 2026-06-10

Backend:
- Added middleware unit tests and supertest HTTP integration tests covering routing, auth, and error
  responses. The Express app is now built through a createApp(controllers) factory so it can be
  exercised in tests without a database. No API or behavior change.


## 1.18 - 2026-06-10

Backend:
- Reorganized the backend so all source lives under backend/src/, with only tooling configs at the
  package root, and introduced path aliases (@domain/*, @application/*, @infrastructure/*,
  @controller/*, @routes/*, @middleware/*, @config/*, @test/*) so imports no longer use ../../.. chains.
  Pure structural change - no API or behavior change.


## 1.17 - 2026-06-10

Backend:
- Migrated the backend to TypeScript. The whole API is now statically type-checked, with no change to
  endpoints, response shapes, or status codes. The Jest suite (now ts-jest) was the safety net.

Project:
- Backend now runs via tsx (no build step); CI gained a typecheck job and the pre-commit hook runs it
  too, so type errors are caught before a commit. Prettier/lint-staged now target backend .ts files.


## 1.16 - 2026-06-10

Project:
- Added Husky git hooks: pre-commit runs the full local quality gate (lint-staged auto-formats staged
  backend .js files with Prettier, then runs backend ESLint, SonarJS lint, and tests with coverage)
  so broken code can never be committed; pre-push blocks accidental direct pushes to main.


## 1.15 - 2026-06-10

Backend:
- Added eslint-plugin-sonarjs (recommended config) to the backend lint, bringing SonarSource
  code-smell and bug-detection rules locally - no SonarCloud account required.
- Security: disabled the X-Powered-By response header (flagged by sonarjs), so the API no longer
  advertises that it runs on Express.

Project:
- Added a separate local SonarJS lint path: a dedicated backend ESLint config, a `lint:sonarjs`
  backend script, and a CI check, so pull requests show SonarJS separately from the regular backend
  ESLint job.


## 1.14 - 2026-06-10

Project:
- CI now runs once per change instead of twice: the workflow no longer triggers on pushes to
  release/** branches (pull requests already cover them), so a release-branch PR shows three checks
  (format, lint, test) instead of six.


## 1.13 - 2026-06-10

Backend:
- Tightened the backend ESLint setup: added eslint-plugin-n for Node correctness,
  eslint-plugin-promise for async correctness, eslint-plugin-jest for the test files,
  eslint-config-prettier to avoid formatter conflicts, and stricter core rules (eqeqeq, no-var,
  prefer-const, curly, no-throw-literal). Declared engines.node ">=20".


## 1.12 - 2026-06-09

Backend:
- Added a Jest unit-test suite covering the backend use cases and domain entities with no database
  required. CI now runs coverage-enforced tests on every push and pull request, with an 80% minimum
  threshold for the backend business-logic unit-test scope.


## 1.11 - 2026-06-09

Project:
- Added GitHub Actions CI: runs the backend lint and the Prettier format check on every pull request to
  main and on pushes to main and release/** branches.


## 1.10 - 2026-06-09

Backend:
- Fixed: editing a purchase record no longer inflates your pantry stock with other users' purchases of
  the same ingredient. The recalculated amount now counts only your own purchases. The whole update now
  runs in a single transaction, so a mid-operation failure no longer leaves the purchase and the pantry
  total out of sync.


## 1.9 - 2026-06-09

Backend:
- Reworked the backend into a layered (clean) architecture: domain entities, use cases, repository
  interfaces with a PostgreSQL implementation, and dependency injection via a composition root.
  Controllers are now thin HTTP adapters. SQL queries, response shapes, and status codes are
  preserved, aside from the security and reliability fixes noted below.
- Error responses are now uniformly { error: ... } across all endpoints (menu and menu-category errors
  previously returned { message: ... }).
- Security: the registration response and the users list no longer include the password hash.
- Recipe create/update/delete and recipe-type deletion are now atomic — each is wrapped in a single
  transaction, so a mid-operation failure no longer leaves partial data behind.
- Removed leftover dead code (a duplicate menu-category handler, an unused menu helper, a commented-out
  route, and an unreachable menus-by-category endpoint).


## 1.8 - 2026-06-08

Backend:
- The server now identifies the logged-in user from the auth token instead of the user id sent by the
  client (security hardening). No visible change for normal use.


## 1.7 - 2026-06-07

Project:
- Unified the comment style across the whole codebase (backend and frontend): removed the //? and //!
  prefixes, switched to plain // comments with a single space and a lowercase first letter (acronyms
  and proper nouns like JWT, SQL, URL, Express keep their case). Comments only - no code or behavior
  changed.


## 1.6 - 2026-06-04

Project:
- Normalized line endings to LF across the repo via .gitattributes (* text=auto eol=lf), so files
  check out the same on every OS and prettier format:check stays stable on Windows and elsewhere.


## 1.5 - 2026-06-04

Backend:
- Reworked error handling. Every endpoint now runs through one shared error middleware that returns
  failures as { error: <message> } with a 500 status and logs them in one place, instead of each
  handler catching its own errors. Database transactions still roll back on failure.
- Menu and menu-category screens now show the real error text when something goes wrong. They used
  to return a generic "Server error" the frontend could not read; their responses now match the
  rest of the API.
- Changed the default database name from cooking_helper_final to cooking_helper. This only affects
  setups that rely on the fallback default; if you set DB_NAME in .env, nothing changes.


## 1.4 - 2026-06-03

Backend:
- Added ESLint (flat config) and a lint script. Existing dead/duplicate code is silenced with
  eslint-disable comments for now and left for a later cleanup.
- Reformatted all backend files with Prettier (4-space indent). No behavior change.

Project:
- Added Prettier with a shared config (.prettierrc, .prettierignore) and format / format:check
  scripts. Only the backend is formatted; the frontend is not touched yet.
- Started committing lockfiles and tool configs: removed package-lock.json and eslint.config.js
  from .gitignore so installs are reproducible and CI can run npm ci.


## 1.3 - 2026-06-03

Documentation and versioning cleanup. No product code changed.

Project:
- Switched to one shared version and this single changelog. Removed the backend and frontend
  changelogs and stopped using git tags.

Backend:
- Simplified the README: removed emoji and decorative formatting, trimmed to the essentials.

Frontend:
- Simplified the README the same way.


## 1.2 - 2026-06-03

Backend:
- Database credentials now come from environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT,
  DB_NAME) instead of being hardcoded in db.js. The old values stay as fallback defaults, so existing
  setups keep working.
- Added backend/.env.example listing every variable to set.
- Stopped tracking backend/.env in git, so the JWT secret is no longer committed. On a fresh checkout,
  copy .env.example to .env and fill it in.


## 1.1 - 2026-04-26

Monorepo tooling and documentation. No product code changed.

Project:
- One npm install at the root now installs both apps, and npm start runs them together.
- Added the first READMEs and project notes.


## 1.0 - 2026-04-26

First release. A working full-stack cooking app.

Backend:
- Express API on port 8080 with JWT login (24h) and bcrypt passwords, PostgreSQL via pg.
- Recipes, recipe types, per-user pantry with purchase history, menu planning with missing-ingredient
  detection, and stats. Around 30 endpoints. Schema and seed data in backend/database.sql.

Frontend:
- React + TypeScript + Vite app with Tailwind and React Router.
- Auth, recipe/menu/pantry/type management, and a statistics page with charts and PDF export.
