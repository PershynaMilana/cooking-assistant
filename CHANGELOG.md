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
