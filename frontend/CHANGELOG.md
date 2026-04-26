# Frontend Changelog

Changes to the React + Vite single-page application. This file tracks **only** frontend changes — backend changes live in [`../backend/CHANGELOG.md`](../backend/CHANGELOG.md).

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] — 2026-04-26

🛠️ Tooling and documentation pass — **no UI or behavior changes**. All routes, components, and user flows are untouched. Existing bookmarks and sessions keep working unchanged.

### Added
- **[CHANGELOG.md](CHANGELOG.md)** (this file) — documenting frontend version history going forward, with the initial state captured retroactively as `[1.0.0]`.
- **Project-specific [README.md](README.md)** — replaces the default Vite + React + TypeScript template stub. Documents the page/route map, source structure, the `authToken` auth pattern (with the dead `useAuth` hook gotcha), Tailwind conventions, and known oddities (`person-ingradients` folder typo, `quantity_person_ingradient` column typo).
- **`patch` / `minor` / `major` npm scripts** in [package.json](package.json) — short aliases for `npm version <level> --no-git-tag-version`. Run from this folder to bump the frontend version in isolation.

## [1.0.0] — 2026-04-26

🎉 Initial release of the frontend SPA.

### Added
- **React 18 + TypeScript + Vite 5** project skeleton with Tailwind CSS, PostCSS, and Autoprefixer.
- **Routing** via React Router v6 with a `<PrivateRoute>` auth gate (redirects to `/login` when `localStorage.authToken` is missing).
- **Auth pages** — `/login`, `/registration`, JWT stored in `localStorage` under key `authToken`.
- **Recipe pages** — community feed (`/main`), personal list (`/my-recipes`), create / view / edit (`/add-recipe`, `/recipe/:id`, `/change-recipe/:id`).
- **Recipe type management** — list, create, edit (`/types`, `/add-type`, `/types/:id`).
- **Pantry page** — `/ingredients`, with quantities, purchase dates, and expiration alerts.
- **Purchase history modal** — drill into per-ingredient purchase log.
- **Menu pages** — community feed (`/menu`), personal list (`/my-menus`), create / view / edit (`/add-menu`, `/menu/:id`, `/change-menu/:id`); ingredient-shortfall detection rendered inside menu detail.
- **Statistics page** — `/stats`, charts via `apexcharts` / `react-apexcharts`, PDF export via `@react-pdf/renderer` + `jspdf`.
- **Shared components** — `Header`, `Modal`, `RecipeCard`, `SearchComponent`, `RecipeTypeFilter`, `DateFilterDropdown`, `PurchaseHistoryModal`, `menu/MenuCard`, `menu/MenuCategoryFilter`.
- **`useAuth` hook** scaffold *(currently unused — see [README](README.md#-auth--read-this-before-touching-auth-code) for the gotcha)*.

### Notes
- Token storage key is **`authToken`** everywhere. The `useAuth` hook references a different key (`token`) and is dead code; do not rely on it.
- `<PrivateRoute>` checks token presence only, not expiry. API calls inside protected pages are responsible for handling `403`s.
- API calls use `axios` directly inside each page — no shared client by design.

[Unreleased]: https://github.com/PershynaMilana/cooking-assistant/compare/frontend-v1.1.0...HEAD
[1.1.0]: https://github.com/PershynaMilana/cooking-assistant/compare/frontend-v1.0.0...frontend-v1.1.0
[1.0.0]: https://github.com/PershynaMilana/cooking-assistant/releases/tag/frontend-v1.0.0
