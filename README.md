<div align="center">

# 🍳 Cooking Assistant

### *Your kitchen, finally organized.*

**Track ingredients. Plan menus. Cook smarter. Never wonder "what can I make tonight?" again.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

</div>

---

## 👋 Hey there!

So you just opened a recipe app. Cool — but **this one is different**.

Most cooking apps are glorified bookmark folders. **Cooking Assistant** is the brain you wish your kitchen had: it knows what's in your pantry, when it expires, what you can cook with it tonight, what you'd need to buy for tomorrow's menu, and prints you a PDF of how often you actually use that bag of basil. It's the difference between *having recipes* and *running your kitchen*.

It's a small full-stack project — React on the front, Express + PostgreSQL on the back — built to be readable, hackable, and genuinely useful. No microservices. No 200-package frontend. No 47 layers of abstraction. Just a clean React app talking to a small Node API talking to Postgres. You can read the whole thing in an afternoon.

---

## 📝 About the project

**Cooking Assistant** is a full-stack web application for managing the entire lifecycle of home cooking — from inventorying what's in your kitchen, through recipe creation and meal planning, to data-driven insights about your cooking habits. It is designed as a single-user personal kitchen assistant with a community recipe feed: each user has a private pantry, private menus, and personal stats, while recipes themselves are visible across the platform so users can borrow ideas from each other.

### What problem it solves

Tracking food at home is fragmented across notebooks, fridge magnets, screenshots, and that one Google Doc you started in 2021. The app consolidates four jobs into one place:

1. **Inventory** — *what do I actually have right now?* (pantry with quantities, purchase dates, expiration windows)
2. **Recipes** — *what can I make with this?* (your own + community, filterable by ingredients/type/time)
3. **Planning** — *what am I cooking this week?* (menus that bundle multiple recipes by meal type)
4. **Insight** — *am I actually using what I buy?* (analytics + exportable PDF reports)

The killer feature is the bridge between (1) and (3): when you build a menu, the app automatically computes which ingredients you're **missing** from your pantry, turning a meal plan into a shopping list with zero manual effort.

### Project shape

| Aspect | Detail |
|--------|--------|
| **Type** | Full-stack monorepo, two npm packages (`backend/`, `frontend/`) |
| **Architecture** | Classic 3-tier: React SPA -> Express REST API -> PostgreSQL |
| **Auth model** | Stateless JWT (24h expiry), bcrypt-hashed passwords |
| **Data model** | 11 relational tables (users, recipes, ingredients, units, menus, categories, junction tables, purchase log) |
| **Surface area** | ~30 API endpoints across 6 resource domains |
| **Code style** | Plain CommonJS backend with class-based controllers + raw SQL; functional React on the frontend with hooks and Tailwind |
| **What it deliberately *isn't*** | No ORM, no GraphQL, no microservices, no Docker required, no test suite, no CI. Optimized for clarity and quick iteration over enterprise polish. |

### Technical highlights

- **Smart "missing ingredients" SQL** — joins menu -> recipes -> ingredients and subtracts the user's pantry in a single query
- **Per-ingredient metadata** beyond just names: shelf life (`days_to_expire`), `allergens`, `seasonality`, and `storage_condition` are first-class columns
- **Unit conversion table** (`unit_measurement`) with gram coefficients, so quantities can mix grams, kilograms, milliliters, teaspoons, cups, and pieces
- **Per-purchase audit log** (`ingredient_purchases`) — separate from current pantry quantities, so you can answer *"how much flour did I buy last quarter?"* not just *"how much do I have right now?"*
- **PDF export** of analytics directly from the React app via `@react-pdf/renderer` + `jspdf` — no server-side rendering needed

### Status

Working v1.0.0 — every feature in the table below is implemented end-to-end and exercised through the UI. There is no test suite, so changes are validated manually by running both apps locally (`npm start` from the root) and clicking through the affected flows.

---

## ✨ What it does

|  | Feature | What it actually means |
|--|---------|------------------------|
| 🔐 | **Personal accounts** | Register, log in, your data stays yours. JWT-secured. |
| 📖 | **Recipe management** | Create recipes with step-by-step content, ingredients with quantities & units, cooking time, servings. Edit, delete, browse the community feed. |
| 🥬 | **Smart pantry** | Track every ingredient you have. The app knows shelf life, allergens, seasonality, and storage conditions. Visual alerts when stuff is going bad. |
| 🛒 | **Purchase history** | Every buy is logged with date and quantity. Look back, never re-buy what you already have. |
| 🍽️ | **Menu planning** | Bundle recipes into Breakfast / Lunch / Dinner menus. The app **automatically tells you what's missing** from your pantry — your shopping list, generated. |
| 📊 | **Analytics + PDF reports** | Charts of your cooking patterns. Most/least used ingredients. Export it all to PDF. |
| 🔍 | **Powerful filters** | Find recipes by type, ingredients, cooking time, or creation date — across the whole community or just yours. |

---

## ⚡ Quick start (TL;DR)

You need: **Node 18+**, **PostgreSQL 14+**, and a Postgres client (pgAdmin / DBeaver / psql).

```bash
# 1. Clone
git clone <repository-url>
cd cooking-assistant

# 2. Set up the database
#    - Create a Postgres database called "cooking_helper_final"
#    - Run backend/database.sql against it (in pgAdmin or psql) ONCE
#    - If your Postgres credentials differ from postgres/12345678, edit backend/db.js

# 3. Create backend/.env with a JWT secret
echo "JWT_SECRET_KEY=$(node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))')" > backend/.env

# 4. Install everything (root postinstall fans out to backend + frontend)
npm install

# 5. Boot both apps in one terminal
npm start
```

Open **http://localhost:5173**, register, and you're cooking. 🎉

> 💡 `npm start` runs backend (port 8080) and frontend (port 5173) in parallel via [`concurrently`](https://www.npmjs.com/package/concurrently). One Ctrl+C kills both.

---

## 🏗️ How the project is organized

```
cooking-assistant/
│
├── 📦 package.json        ← orchestration: scripts that run the whole thing
├── 📘 README.md           ← you are here
├── 🤖 CLAUDE.md           ← guidance for Claude Code AI tooling
│
├── 🖥️  backend/            ← Express + PostgreSQL API on :8080
│   └── 📘 README.md       ← backend dev guide (API ref, schema, conventions)
│
└── 🎨 frontend/            ← React + Vite SPA on :5173
    └── 📘 README.md       ← frontend dev guide (routes, structure, gotchas)
```

It's a **plain monorepo** — no npm/pnpm/yarn workspaces, no Lerna, no Turborepo. Each side is a self-contained npm package; the root `package.json` just holds [`concurrently`](https://www.npmjs.com/package/concurrently) and a handful of orchestration scripts. All three `package.json` files share the same `version` and stay synced via the `version:*` scripts.

**Want to dive into the code?**
- 🖥️ [**backend/README.md**](backend/README.md) — full API reference, auth flow, data model, route -> controller -> SQL pipeline
- 🎨 [**frontend/README.md**](frontend/README.md) — page structure, routing, auth gotchas, Tailwind conventions
- 🤖 [**CLAUDE.md**](CLAUDE.md) — architectural notes (also useful for humans, despite the name)

---

## 🧰 Root scripts

All from the repo root:

```bash
npm install              # installs root + auto-fans out to backend + frontend (postinstall hook)
npm start                # ⭐ boot backend + frontend together
npm run dev              # alias of start

npm run start:backend    # backend only (nodemon -> :8080)
npm run start:frontend   # frontend only (vite -> :5173)
```

### Versioning & changelogs

Each side of the monorepo is versioned **independently**:

- [`backend/package.json`](backend/package.json) tracks API versions
- [`frontend/package.json`](frontend/package.json) tracks SPA versions
- [`package.json`](package.json) at the root tracks the **product release** version (an umbrella over the two)

Each has its own changelog: [`CHANGELOG.md`](CHANGELOG.md) (release-level summary), [`backend/CHANGELOG.md`](backend/CHANGELOG.md), [`frontend/CHANGELOG.md`](frontend/CHANGELOG.md). Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: [SemVer](https://semver.org/) — `MAJOR.MINOR.PATCH` where `PATCH` = bug fix, `MINOR` = new feature, `MAJOR` = breaking change.

#### Workflow — one change, one commit

Every commit follows this 4-step cycle. The rule: **code change + version bump + changelog update all land in the same commit.**

---

**Step 1 — make your changes.** Touch only one side per commit when you can (frontend OR backend, not both).

---

**Step 2 — bump the version of the package you changed.** Run from that package's folder:

```bash
cd frontend          # or cd backend, or stay in root for umbrella release

npm run patch        # 1.0.0 -> 1.0.1  — bug fix, style tweak, copy change
npm run minor        # 1.0.0 -> 1.1.0  — new feature, new page, new endpoint
npm run major        # 1.0.0 -> 2.0.0  — breaking change (removed route, schema change)
```

---

**Step 3 — update `CHANGELOG.md` of that package.** Open the matching file and move what you built from `## [Unreleased]` into a new dated section:

```markdown
## [Unreleased]           ← stays empty, ready for next change

## [1.1.0] — 2026-05-01  ← new section you just added

### Added
- Filter recipes by cooking time range
```

Use standard headings: `Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Security`.

---

**Step 4 — commit everything together + tag.**

Commit message format: **`<scope> <oldver> -> <newver>: <short description>`**

```bash
# ── Frontend example ─────────────────────────────────────────────
git add frontend/package.json frontend/package-lock.json frontend/CHANGELOG.md \
        frontend/src/...        # ← your changed source files
git commit -m "frontend 1.0.0 -> 1.1.0: add recipe cooking-time filter"
git tag frontend-v1.1.0

# ── Backend example ──────────────────────────────────────────────
git add backend/package.json backend/package-lock.json backend/CHANGELOG.md \
        backend/routes/... backend/controller/...
git commit -m "backend 1.0.0 -> 1.1.0: add /api/recipes-by-cooking-time endpoint"
git tag backend-v1.1.0

# ── Coordinated root release (both sides bumped) ─────────────────
git add package.json package-lock.json CHANGELOG.md \
        frontend/... backend/...
git commit -m "1.0.0 -> 1.1.0: add cooking-time filter (frontend + backend)"
git tag v1.1.0
```

> 💡 **Why `<oldver> -> <newver>` in the message?** When you hover over any line of code in VSCode (GitLens / built-in blame), the commit message appears inline. Having the version range there means you instantly see "this line was introduced/changed in the `1.0.0 -> 1.1.0` release" without leaving the editor or running `git describe`.

---

**Non-shipping changes** (docs only, refactor, dependency bump) — **skip the bump**, skip the version in the message:

```bash
git commit -m "docs: clarify auth token gotcha in CLAUDE.md"
git commit -m "chore: bump axios 1.7 -> 1.8"
git commit -m "refactor(frontend): extract RecipeCard styles to component"
```

---

#### Quick reference

| Situation | Script | Commit message pattern | Tag |
|-----------|--------|------------------------|-----|
| Frontend bug fix | `cd frontend && npm run patch` | `frontend 1.0.0 -> 1.0.1: fix recipe filter dropdown` | `frontend-v1.0.1` |
| Frontend new feature | `cd frontend && npm run minor` | `frontend 1.0.0 -> 1.1.0: add cooking-time filter` | `frontend-v1.1.0` |
| Backend new endpoint | `cd backend && npm run minor` | `backend 1.0.0 -> 1.1.0: add /api/recipes-by-time` | `backend-v1.1.0` |
| Breaking API change | `cd backend && npm run major` | `backend 1.1.0 -> 2.0.0: remove /api/user-ingredients-legacy` | `backend-v2.0.0` |
| Coordinated release | `npm run minor` (root) | `1.0.0 -> 1.1.0: feature X (frontend + backend)` | `v1.1.0` |
| Docs / refactor | — | `docs: ...` / `chore: ...` / `refactor: ...` | — |

---

## 🛠️ Tech stack at a glance

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, TypeScript, Vite 5, React Router v6, Tailwind CSS, axios, jwt-decode, ApexCharts, @react-pdf/renderer, jsPDF |
| **Backend** | Node.js, Express 4, `pg` (PostgreSQL driver), `jsonwebtoken`, `bcrypt`, `dotenv`, `nodemon` |
| **Database** | PostgreSQL 14+ |
| **Tooling** | ESLint, TypeScript, `concurrently`, plain npm (no workspaces) |

---

## 🎯 The 30-second user journey

1. **Register & log in** — get a JWT, your session lives 24h
2. **Stock your pantry** — add what you have, with quantities and purchase dates
3. **Build recipes** — pick ingredients with units & amounts, set cooking time and servings
4. **Plan menus** — drag recipes into Breakfast / Lunch / Dinner buckets
5. **Get a smart shopping list** — the app subtracts your pantry from your menu and tells you exactly what to buy
6. **Cook**, **track**, **export** — your stats page becomes a PDF you can share

---

## 🤝 Contributing

PRs and issues welcome. Before opening a PR:

1. Read the relevant sub-app README ([backend](backend/README.md) or [frontend](frontend/README.md)) — there are a few **deliberate** quirks (like a typo in a folder name and a dead `useAuth` hook) that look like bugs but aren't safe to "fix" in unrelated changes.
2. Run `npm run build` in `frontend/` and verify the backend boots cleanly.
3. Match the existing code style (especially the `//?` and `//!` comment prefixes on the backend).

---

## 📜 License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

**Made with ❤️ for cooking enthusiasts who want to organize their culinary adventures!**

🍳 Happy cooking, and may your basil never wilt again 🌿

</div>
