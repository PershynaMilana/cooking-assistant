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
