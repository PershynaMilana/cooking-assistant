# Cooking Assistant - Frontend

React 18 + TypeScript + Vite client for the [Cooking Assistant](../README.md) platform. Talks to the
[backend](../backend/README.md) API at http://localhost:8080/api.

## Tech stack

- React 18 + TypeScript - UI
- Vite 5 - dev server, HMR, production bundler
- React Router DOM v6 - routing
- Tailwind CSS + PostCSS + Autoprefixer - styling
- axios - HTTP client
- jwt-decode - parse the JWT payload on the client
- ApexCharts + react-apexcharts - charts on the stats page
- @react-pdf/renderer + jspdf - PDF export

## Running locally

Prefer the root of the monorepo: `npm install && npm start` boots backend + frontend together. Use the
commands below only to work on the frontend alone.

```bash
npm install
npm run dev      # vite dev server -> http://localhost:5173
npm run build    # tsc -b && vite build (real type-check happens here)
npm run preview  # preview the production dist/
npm run lint     # eslint .
```

The dev server expects the backend at http://localhost:8080. Backend CORS is locked to
http://localhost:5173 - if you change Vite's port, update [../backend/index.js](../backend/index.js).

## Source structure

```
src/
├── App.tsx               all routes + <PrivateRoute> wrapping
├── main.tsx              ReactDOM root
├── index.css             global Tailwind + custom CSS
│
├── components/           shared UI
│   ├── Header.tsx
│   ├── Modal.tsx
│   ├── PrivateRoute.tsx          auth gate (checks localStorage.authToken)
│   ├── RecipeCard.tsx
│   ├── RecipeTypeFilter.tsx
│   ├── DateFilterDropdown.tsx
│   ├── SearchComponent.tsx
│   ├── PurchaseHistoryModal.tsx
│   └── menu/                     MenuCard, MenuCategoryFilter
│
├── hooks/
│   └── useAuth.tsx       DEAD CODE - see Auth note below
│
├── pages/                one folder per domain
│   ├── auth/             LoginPage, RegisterPage
│   ├── recipes/          MainPage, CreateRecipePage, RecipeDetailsPage, ChangeRecipePage
│   ├── user-recipes/     UserRecipesPage ("my recipes")
│   ├── recipe-types/     TypesPage, AddTypePage, EditRecipeType
│   ├── person-ingradients/   IngredientsPage (sic - folder typo, do NOT rename)
│   ├── menu/             MenuPage, CreateMenuPage, MenuDetailsPage, ChangeMenuPage
│   ├── user-menu/        UserMenuPage ("my menus")
│   ├── statistics/       StatsPage (charts + PDF export)
│   └── not-found/        404 catch-all
│
└── assets/               fonts, searchIcon.png
```

## Routes

Defined in [src/App.tsx](src/App.tsx). Public: `/login`, `/registration`. Everything else is wrapped in
`<PrivateRoute>` and redirects to `/login` if `localStorage.authToken` is missing.

| Path | Page |
|------|------|
| `/` -> `/main` | Redirect |
| `/main` | MainPage - community recipe feed |
| `/my-recipes` | UserRecipesPage |
| `/my-menus` | UserMenuPage |
| `/types`, `/types/:id`, `/add-type` | Recipe type management |
| `/add-recipe`, `/recipe/:id`, `/change-recipe/:id` | Recipe CRUD |
| `/menu`, `/add-menu`, `/menu/:id`, `/change-menu/:id` | Menu CRUD |
| `/ingredients` | Personal pantry |
| `/stats` | Analytics + PDF export |
| `*` | 404 |

## Auth - read this before touching auth code

The real `localStorage` key used everywhere ([Header.tsx](src/components/Header.tsx),
[LoginPage.tsx](src/pages/auth/LoginPage.tsx), [PrivateRoute.tsx](src/components/PrivateRoute.tsx),
every page that calls the API) is `"authToken"`.

[src/hooks/useAuth.tsx](src/hooks/useAuth.tsx) reads/writes a different key, `"token"`, and is dead
code. Do not import it for new auth logic. The pattern used throughout:

```tsx
const token = localStorage.getItem("authToken");
axios.get("http://localhost:8080/api/recipes", {
  headers: { Authorization: `Bearer ${token}` },
});
```

`PrivateRoute` only checks token presence, not expiry - an expired token still renders the page; the
API call inside is what 403s.

## Conventions

- API calls live inside pages, using axios directly. No shared API client, no interceptor, no central
  error handler - do not add one casually.
- Tailwind for layout/spacing; custom CSS in [src/index.css](src/index.css).
- Type errors only surface at `npm run build` (`tsc -b`), not at `npm run dev`. Run build before a PR.

## Known oddities (not bugs to fix in unrelated changes)

- Folder `pages/person-ingradients/` has a typo (should be `ingredients`). Imports depend on it - leave it.
- DB column `quantity_person_ingradient` (missing letters) - same story, used in API responses.
- `useAuth` hook with the wrong storage key - see the Auth note above.

## Versioning

The whole project shares one version and one changelog at the repo root. This package's version in
[package.json](package.json) marks the last release in which the frontend changed. See the
[root README](../README.md#versioning-and-changelog) and [root CHANGELOG.md](../CHANGELOG.md).

## Related

- [Root README](../README.md) - project overview
- [Backend README](../backend/README.md) - API server
- [CHANGELOG.md](../CHANGELOG.md) - project changelog
- [CLAUDE.md](../CLAUDE.md) - notes for AI tooling
