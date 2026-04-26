# 🍳 Cooking Assistant — Frontend

React 18 + TypeScript + Vite client for the [Cooking Assistant](../README.md) platform. Talks to the [backend](../backend/README.md) API at `http://localhost:8080/api`.

## 🛠️ Tech Stack

- **React 18** + **TypeScript** — UI layer
- **Vite 5** — dev server, HMR, production bundler
- **React Router DOM v6** — client-side routing
- **Tailwind CSS** + PostCSS + Autoprefixer — styling
- **axios** — HTTP client
- **jwt-decode** — parse JWT payload on the client
- **ApexCharts** + **react-apexcharts** — analytics charts on the stats page
- **@react-pdf/renderer** + **jspdf** — PDF report export

## 🚀 Running locally

> Prefer the **root** of the monorepo: `npm install && npm start` from there boots backend + frontend together. See [the root README](../README.md). Use the commands below only when you want to work on the frontend in isolation.

```bash
npm install      # only first time, or use root postinstall
npm start        # alias of `npm run dev`
npm run dev      # vite dev server -> http://localhost:5173
npm run build    # tsc -b && vite build  (real type-check happens here)
npm run preview  # preview the production dist/
npm run lint     # eslint .
```

The dev server expects the backend to be reachable at `http://localhost:8080`. CORS on the backend is locked to `http://localhost:5173` — if you change Vite's port, update [../backend/index.js](../backend/index.js) too.

## 📁 Source structure

```
src/
├── App.tsx               # all routes + <PrivateRoute> wrapping
├── main.tsx              # ReactDOM root
├── index.css / App.css   # global Tailwind + custom CSS
│
├── components/           # shared UI building blocks
│   ├── Header.tsx
│   ├── Modal.tsx
│   ├── PrivateRoute.tsx          # auth gate (checks localStorage.authToken)
│   ├── RecipeCard.tsx
│   ├── RecipeTypeFilter.tsx
│   ├── DateFilterDropdown.tsx
│   ├── SearchComponent.tsx
│   ├── PurchaseHistoryModal.tsx
│   └── menu/                     # MenuCard, MenuCategoryFilter
│
├── hooks/
│   └── useAuth.tsx       # ⚠️ DEAD CODE — see Auth gotcha below
│
├── pages/                # one folder per domain
│   ├── auth/             # LoginPage, RegisterPage
│   ├── recipes/          # MainPage, CreateRecipePage, RecipeDetailsPage, ChangeRecipePage
│   ├── user-recipes/     # UserRecipesPage  ("my recipes")
│   ├── recipe-types/     # TypesPage, AddTypePage, EditRecipeType
│   ├── person-ingradients/   # IngredientsPage  (sic — folder typo, do NOT rename)
│   ├── menu/             # MenuPage, CreateMenuPage, MenuDetailsPage, ChangeMenuPage
│   ├── user-menu/        # UserMenuPage  ("my menus")
│   ├── statistics/       # StatsPage  (charts + PDF export)
│   └── not-found/        # 404 catch-all
│
└── assets/               # fonts, react.svg, searchIcon.png
```

## 🧭 Routes

Defined in [src/App.tsx](src/App.tsx). Public: `/login`, `/registration`. Everything else is wrapped in `<PrivateRoute>` and redirects to `/login` if `localStorage.authToken` is missing.

| Path | Page |
|------|------|
| `/` -> `/main` | Redirect |
| `/main` | `MainPage` — community recipe feed |
| `/my-recipes` | `UserRecipesPage` |
| `/my-menus` | `UserMenuPage` |
| `/types`, `/types/:id`, `/add-type` | Recipe type management |
| `/add-recipe`, `/recipe/:id`, `/change-recipe/:id` | Recipe CRUD |
| `/menu`, `/add-menu`, `/menu/:id`, `/change-menu/:id` | Menu CRUD |
| `/ingredients` | Personal pantry |
| `/stats` | Analytics + PDF export |
| `*` | 404 |

## 🔐 Auth — read this before touching auth code

The real `localStorage` key used everywhere ([Header.tsx](src/components/Header.tsx), [LoginPage.tsx](src/pages/auth/LoginPage.tsx), [PrivateRoute.tsx](src/components/PrivateRoute.tsx), every page that calls the API) is **`"authToken"`**.

[src/hooks/useAuth.tsx](src/hooks/useAuth.tsx) reads/writes a *different* key — **`"token"`** — and is **dead code**. Don't import it for new auth logic. The pattern used throughout the project:

```tsx
const token = localStorage.getItem("authToken");
axios.get("http://localhost:8080/api/recipes", {
  headers: { Authorization: `Bearer ${token}` },
});
```

`PrivateRoute` only checks token presence, not expiry — an expired token still renders the page; the API call inside is what 403s.

## 🎨 Conventions

- **API calls live inside pages**, using `axios` directly. There is no shared API client, no axios interceptor, no central error handler. Don't introduce one casually — it's a deliberate flat structure.
- **Tailwind for layout/spacing**, custom CSS in [src/App.css](src/App.css) and [src/index.css](src/index.css) for project-specific styles.
- TypeScript is strict-ish — type errors only surface at `npm run build` (`tsc -b`), not at `npm run dev`. Run `npm run build` before opening a PR.

## 🐞 Known oddities (not bugs to "fix" in unrelated changes)

- Folder name `pages/person-ingradients/` has a typo (should be `ingredients`). Many imports depend on the spelling — leave it.
- DB column `quantity_person_ingradient` (single `r` instead of `rad`) — same story, used in API responses.
- `useAuth` hook with the wrong storage key — see [Auth section](#-auth--read-this-before-touching-auth-code).

## 📈 Versioning & changelog

The frontend has its **own** version, independent of the backend. Bump it only when you change frontend code; keep the changelog up to date.

```bash
# from frontend/
npm run patch    # 1.0.0 -> 1.0.1  (bug fixes, copy tweaks, style fixes)
npm run minor    # 1.0.1 -> 1.1.0  (new page, new component, new feature)
npm run major    # 1.1.0 -> 2.0.0  (route rename, removed feature, redesign)
```

These scripts wrap `npm version <level> --no-git-tag-version` so you never accidentally trigger npm's auto-commit/tag.

After bumping, open [`CHANGELOG.md`](CHANGELOG.md), move your entries from `## [Unreleased]` into a new `## [x.y.z] — YYYY-MM-DD` section, then commit:

```bash
git add frontend/package.json frontend/package-lock.json frontend/CHANGELOG.md
git commit -m "frontend: 1.0.0 -> 1.1.0 — add dark mode toggle"
git tag frontend-v1.1.0
```

**SemVer rules of thumb for this codebase:**
- `PATCH` — fixed a UI bug, copy fix, layout tweak, dependency patch upgrade.
- `MINOR` — new page, new component, new filter, new chart on the stats page.
- `MAJOR` — removed/renamed a route users had bookmarked, redesigned a major page, dropped support for an old browser, changed auth flow.

See the full project workflow in the [root README](../README.md#versioning--changelogs).

## 🔗 Related

- [Root README](../README.md) — project overview
- [Backend README](../backend/README.md) — API server
- [CHANGELOG.md](CHANGELOG.md) — frontend version history
- [CLAUDE.md](../CLAUDE.md) — architecture notes for AI tooling
