# Cooking Assistant

Full-stack app for running a home kitchen: track your pantry, write recipes, plan menus, and get a
shopping list of what you are missing. React + TypeScript on the front, Express + PostgreSQL on the back.

## What it does

- Accounts with JWT auth (24h tokens, bcrypt-hashed passwords)
- Recipes: create/edit/delete with ingredients, quantities, units, cooking time, servings
- Pantry: per-user inventory with quantities, purchase dates, expiry, allergens, seasonality
- Menus: bundle recipes by meal type; the app computes which ingredients you are missing
- Stats: charts of your cooking patterns with PDF export
- Filters: by type, ingredient, cooking time, or date

## Quick start

You need Node 18+, PostgreSQL 14+, and a Postgres client (pgAdmin / DBeaver / psql).

```bash
# 1. Clone
git clone <repository-url>
cd cooking-assistant

# 2. Database - create an EMPTY database named "cooking_helper"
#    pgAdmin:  right-click Databases -> Create -> Database -> "cooking_helper"
#    or psql:  psql -U postgres -c "CREATE DATABASE cooking_helper;"

# 3. Backend env
cp backend/.env.example backend/.env     # PowerShell: Copy-Item backend/.env.example backend/.env
#    fill in JWT_SECRET_KEY (and DB_* if your Postgres differs from the defaults)
#    generate a secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Install (root postinstall installs backend + frontend too)
npm install

# 5. Build the schema and load starter data
npm run migrate     # create all tables (node-pg-migrate)
npm run seed        # load reference + sample data (idempotent)

# 6. Run both apps
npm start
```

Open http://localhost:5173, register, and you are in.

> **Already have a `cooking_helper` from the old `database.sql` setup?** Don't run a plain `npm run migrate` on
> it (the tables already exist - it would error). Instead adopt the migrations once, without touching your data:
> `npm run migrate -- up --fake`. Full database guide (schema changes, seeding, rollbacks) is in
> [backend/README.md](backend/README.md).

## Layout

```
cooking-assistant/
├── package.json     orchestration scripts (concurrently)
├── CHANGELOG.md     single changelog for the whole project
├── CLAUDE.md        notes for AI tooling (also useful for humans)
├── backend/         Express + PostgreSQL API on :8080  (see backend/README.md)
└── frontend/        React + Vite SPA on :5173          (see frontend/README.md)
```

It is a plain monorepo - no workspaces. The root `package.json` only holds `concurrently` and a few
scripts. See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for
per-app detail.

## Root scripts

```bash
npm install              # installs root + backend + frontend (postinstall hook)
npm start                # boot backend + frontend together (alias: npm run dev)
npm run start:backend    # backend only (nodemon -> :8080)
npm run start:frontend   # frontend only (vite -> :5173)
```

## Versioning and changelog

The whole project shares ONE version, kept in the root [package.json](package.json), and there is ONE
[CHANGELOG.md](CHANGELOG.md).

How to track it:

- Every release bumps the shared version by one (e.g. 1.3 -> 1.4).
- A release bumps `backend/package.json` and/or `frontend/package.json` up to the shared number, but
  only for the side(s) it actually changed. The untouched side keeps its old number. So a package
  version means "the last release this package changed in" and may skip numbers - it is a marker, not
  strict SemVer.
- [CHANGELOG.md](CHANGELOG.md) records each version with `### Backend` / `### Frontend` sections.

Workflow: branch from `main`, make the change, bump the version, add a changelog entry, commit, push,
open a PR for review. No git tags.

> We used to keep three independent versions and three changelogs with tag conventions. For a two-app
> project that was more overhead than value, so we consolidated to the single version + single
> changelog described above. See the note at the top of [CHANGELOG.md](CHANGELOG.md).

## Tech stack

- Frontend: React 18, TypeScript, Vite 5, React Router v6, Tailwind CSS, axios, jwt-decode, ApexCharts, @react-pdf/renderer, jsPDF
- Backend: Node.js, Express 4, `pg`, `jsonwebtoken`, `bcrypt`, `dotenv`, `nodemon`
- Database: PostgreSQL 14+

There is no test suite. Changes are validated by running both apps locally and clicking through.

## License

MIT - see [LICENSE](LICENSE).
