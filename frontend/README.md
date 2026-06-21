# Cooking Assistant - Frontend

React 18 + TypeScript + Vite client for the [Cooking Assistant](../README.md) platform. It talks to the
[backend](../backend/README.md) API under `/api`. Authentication is a server-set **httpOnly cookie**, so
the client never sees or stores a token - it just sends requests with credentials and lets the browser
carry the cookie.

**Live:** https://cooking-assistant.app

## Tech stack

- **React 18 + TypeScript** - UI
- **Vite 5** - dev server, HMR, production bundler (`vite-plugin-svgr` for SVG-as-component imports)
- **React Router DOM v6** - routing, with `React.lazy` + `Suspense` code splitting (one chunk per page)
- **Tailwind CSS + PostCSS + Autoprefixer** - styling (brand colours/fonts in `tailwind.config.js`)
- **axios** - HTTP client, wrapped behind a single shared instance in `src/api/`
- **i18next + react-i18next** - all user-facing strings (one namespace per domain, `en` locale today)
- **ApexCharts + react-apexcharts** - charts on the stats page (lazy-loaded)
- **@react-pdf/renderer + jspdf** - PDF report export (lazy-loaded on click)
- **Jest 30 + @swc/jest + React Testing Library + jsdom** - test suite (~108 files, 80% coverage gate)

> No `jwt-decode`, no Redux/RTK, no global state library. State lives in custom hooks; auth lives in the
> cookie. (RTK is planned for a later release but is intentionally not here yet.)

## Running locally

Prefer the repo root: `npm install && npm start` boots backend + frontend together. Use the commands
below only to work on the frontend alone.

```bash
npm install
npm run dev          # vite dev server -> http://localhost:8080
npm run build        # tsc -b && vite build (the real type-check happens here)
npm run preview      # serve the production dist/
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run lint:sonarjs # SonarJS static-analysis ruleset
npm run stylelint    # stylelint src/**/*.{css,scss}
npm run typecheck    # tsc -b
npm run test         # jest
npm run test:coverage# jest --coverage (enforces the 80% threshold)
```

Type errors only surface at `npm run build` / `npm run typecheck` (`tsc -b`), not at `npm run dev`. Run
one of them before opening a PR.

## Production (Docker + nginx)

In production the frontend is a static bundle served by nginx. The [Dockerfile](Dockerfile) two stages:

1. **builder** - sets `ARG VITE_API_URL` (baked into the Vite bundle at build time), runs `npm run build`,
   produces `dist/`.
2. **runner** - copies `dist/` into `nginx:alpine`, uses [nginx.conf](nginx.conf) which sets the SPA
   fallback (`try_files $uri $uri/ /index.html`) so React Router deep-links work, plus 1-year
   cache headers for content-hashed assets.

`VITE_API_URL` is passed as a Docker build-arg from GitHub Actions (value: `https://api.cooking-assistant.app`).
Once baked in it cannot be changed at runtime - to point the bundle at a different API, rebuild the image.

## Environment

A frontend `.env` is optional - copy [.env.example](.env.example) only if you need to override the API
location.

```
# VITE_API_URL=<deployed API origin>
```

- **Dev:** leave `VITE_API_URL` unset. The base URL falls back to `""` ([src/config/env.ts](src/config/env.ts)),
  so requests go to `/api` on the same origin (`:8080`). The Vite dev server proxies `/api` to the backend
  (`VITE_DEV_PROXY_TARGET`, default `http://localhost:3000` - see [vite.config.ts](vite.config.ts)). Keeping
  requests same-origin is what lets the httpOnly auth cookie be first-party without TLS in dev.
- **Production:** set `VITE_API_URL` to the deployed API origin.

## Auth - read this before touching auth code

Auth is a **server-set httpOnly cookie** (`authToken`). The client cannot read it and stores nothing.

- The single shared axios instance ([src/api/client.ts](src/api/client.ts)) is created with
  `withCredentials: true`, so the browser sends/receives the cookie automatically. There is **no**
  `Authorization: Bearer` header and **no** `localStorage` token anywhere.
- **Login** ([src/hooks/useLoginForm.ts](src/hooks/useLoginForm.ts) -> [src/api/authApi.ts](src/api/authApi.ts))
  POSTs `/api/login`; the server sets the cookie and responds `{ message: "Logged in" }`. The hook then
  navigates to `/main`. On a `429` (too many attempts) it reads `retry-after` and soft-locks the submit
  button until the window passes.
- **Logout** POSTs `/api/logout`; the server clears the cookie. Nothing to clean up client-side.
- **Route gating** ([src/components/layout/PrivateRoute/PrivateRoute.tsx](src/components/layout/PrivateRoute/PrivateRoute.tsx))
  is server-verified: on mount it calls `getMe()` (`GET /api/me`). While the check is pending it renders a
  blank screen; on `200` it renders the route; on `401/403` it redirects to `/login`; on any other error it
  shows a session-error message. It does **not** read `localStorage` and does **not** inspect a token.
- **401/403 handling** is centralized in the axios response interceptor (`handleAuthError` in
  [src/api/client.ts](src/api/client.ts)): a 401/403 on a protected request hard-redirects to `/login`
  (via `window.location.assign`, since it runs outside React Router - see [src/api/redirect.ts](src/api/redirect.ts)).
  `GET /api/me` is exempt (`SKIP_REDIRECT_URLS`) so `PrivateRoute` can handle its own 401 without a double
  redirect, and the public paths (`/login`, `/registration`) are exempt too.

## Source structure

```
src/
├── main.tsx                 ReactDOM root (mounts <AppWrapper/>, imports i18n + index.css)
├── App.tsx                  Router + Suspense + React.lazy pages + PrivateRoute layout route
├── index.css                global Tailwind + custom CSS
│
├── api/                     the ONLY place axios is touched
│   ├── client.ts            shared axios instance (withCredentials) + 401/403 interceptor
│   ├── endpoints.ts         API_ROUTES - typed map of every backend path (param routes are builders)
│   ├── httpError.ts         getApiErrorMessage(err) - normalize any error to a user string
│   ├── redirect.ts          redirectToLogin() - hard navigation used by the interceptor
│   ├── authApi.ts           login / getMe / register / logout
│   ├── recipesApi.ts, menusApi.ts, recipeTypesApi.ts, ingredientsApi.ts,
│   ├── userIngredientsApi.ts, menuCategoriesApi.ts, statsApi.ts   per-domain wrappers
│   └── __mocks__/client.ts  manual jest mock of the axios instance
│
├── components/              reusable UI, grouped by domain (each is a folder + index.ts barrel)
│   ├── layout/              Header, PrivateRoute, PageSpinner, ListPageLayout
│   ├── ui/                  Card, Modal, SearchComponent, CheckboxFilterDropdown, DateFilterDropdown,
│   │                        OwnerActions, ToggleButtonGroup
│   ├── forms/               RecipeForm, MenuFormFields, auth/{LoginForm,RegisterForm}, shared fields/
│   ├── recipes/             RecipeCard, RecipeFilterPanel, IngredientPicker, CookingTimeField, ...
│   ├── menu/                MenuCard, MenuListView, MissingIngredientsList, GroupedRecipesList, ...
│   ├── ingredients/         IngredientList, QuantityEditor, PurchaseHistoryModal, DeleteConfirmModal, ...
│   ├── recipe-types/        TypeListItem (read-only)
│   └── stats/               RecipeTypeChart (+ LazyChart), RecipeTypesSummary, ReportDownloadButtons, ...
│
├── hooks/                   all data fetching + stateful logic (50+ hooks, composed; no global store)
│
├── pages/                   one folder per domain (route components, lazy-loaded)
│   ├── auth/                LoginPage, RegisterPage
│   ├── recipes/             MainPage, CreateRecipePage, RecipeDetailsPage, ChangeRecipePage
│   ├── user-recipes/        UserRecipesPage ("my recipes")
│   ├── recipe-types/        TypesPage (read-only list; add/edit/delete were removed in 1.40)
│   ├── person-ingredients/  IngredientsPage (the pantry)
│   ├── menu/                MenuPage, CreateMenuPage, MenuDetailsPage, ChangeMenuPage
│   ├── user-menu/           UserMenuPage ("my menus")
│   ├── statistics/          StatsPage + the PDF report components (StatsReport, Pdf*, reportStyles)
│   └── not-found/           NotFoundPage (404)
│
├── constants/               routes.ts (ROUTES + path builders + PUBLIC_PATHS), languages, queryParams
├── config/                  env.ts (API_BASE_URL), logger.ts (dev-only console wrapper)
├── i18n/                    index.ts (i18next init) + locales/en/<namespace>.json
├── types/                   shared TypeScript types (recipe, menu, ingredient, stats, auth, api, ...)
├── utils/                   pure helpers (cookingTimeUtils, dateUtils, ingredientExpirationUtils, ...)
├── test/                    Jest setup + shared test helpers (router, mocks, constants)
└── assets/                  fonts (Kharkiv Tone, Montserrat) + searchIcon.png
```

## The api/ layer

Pages and hooks never import `axios` - they call typed functions from `src/api/*`, and the ESLint
boundaries rule blocks any direct `axios` import outside `src/api/`.

- **[client.ts](src/api/client.ts)** - one `apiClient = axios.create({ baseURL, withCredentials: true })`
  with a single response interceptor that redirects to `/login` on 401/403. Re-exports `isAxiosError` so
  feature code never imports axios for that either.
- **[endpoints.ts](src/api/endpoints.ts)** - `API_ROUTES`, a single typed source of truth for every path,
  grouped by domain; parameterized routes are builder functions, e.g. `API_ROUTES.recipes.byId(id)`.
- **[httpError.ts](src/api/httpError.ts)** - `getApiErrorMessage(err)` turns any error into a user-facing
  string by reading the backend's unified `{ error }` body, falling back to `error.message`.
- **Per-domain modules** (`recipesApi.ts`, `menusApi.ts`, ...) - thin async functions wrapping
  `apiClient.get/post/put/delete` with typed request/response generics, returning `response.data`.

## Routing and code splitting

- [App.tsx](src/App.tsx) loads every page with `React.lazy(() => import("pages/..."))` and wraps the whole
  tree in one `<Suspense fallback={<PageSpinner/>}>`. Each page is its own bundle chunk.
- Private routes are a data-driven `PRIVATE_ROUTES` array rendered as children of a single
  `<Route element={<PrivateRoute/>}>` layout route (PrivateRoute renders `<Outlet/>`). Public routes
  (`/login`, `/registration`), the `/` -> `/main` redirect, and the `*` 404 sit outside the guard.
- All paths come from [src/constants/routes.ts](src/constants/routes.ts) (`ROUTES`, path builders like
  `recipeDetailsPath(id)`, and `PUBLIC_PATHS`). Heavy libs are lazy too: ApexCharts via
  `RecipeTypeChart/LazyChart`, and `@react-pdf/renderer` via a dynamic `import()` on the download click.

### Routes

Public: `/login`, `/registration`. Everything else is wrapped in `<PrivateRoute>`.

| Path | Page | Access |
|------|------|--------|
| `/` -> `/main` | redirect | public |
| `/login`, `/registration` | LoginPage, RegisterPage | public |
| `/main` | MainPage - recipe feed | private |
| `/my-recipes` | UserRecipesPage | private |
| `/my-menus` | UserMenuPage | private |
| `/types` | TypesPage (read-only list) | private |
| `/add-recipe`, `/recipe/:id`, `/change-recipe/:id` | Recipe create / details / edit | private |
| `/menu`, `/add-menu`, `/menu/:id`, `/change-menu/:id` | Menu list / create / details / edit | private |
| `/ingredients` | IngredientsPage (pantry) | private |
| `/stats` | StatsPage (charts + PDF export) | private |
| `*` | NotFoundPage | public |

## State and hooks

There is no global state library. Every fetch and piece of stateful logic is a custom hook in
[src/hooks/](src/hooks/), composed from smaller hooks (e.g. `useRecipeList` combines `useRecipes`,
`useRecipeFilters`, and reference-data hooks). Each hook calls the `api/` layer, never axios directly.

## Internationalization

[src/i18n/index.ts](src/i18n/index.ts) initializes i18next with inlined JSON resources (synchronous,
`useSuspense: false`), `lng: "en"`, `defaultNS: "common"`. One namespace file per domain lives under
`src/i18n/locales/en/` (`common`, `recipes`, `recipeTypes`, `menu`, `ingredients`, `stats`, `auth`).
Components/hooks read strings via `useTranslation("<namespace>")`. ESLint enforces translated strings on
the shared `components/ui`, `components/layout`, and `i18n` layers.

## Layering, ESLint boundaries, path aliases

- **Bare path aliases**, never `../` across folders: `api/`, `components/`, `hooks/`, `pages/`, `utils/`,
  `types/`, `constants/`, `config/`, `i18n/`, `assets/`, `test/` (defined in `tsconfig.app.json`, mirrored
  in `vite.config.ts`, `jest.config.cjs`, and the ESLint resolver).
- **`eslint-plugin-boundaries`** declares the layers (config, types, constants, i18n, utils, api, hooks,
  components, pages) and enforces (as errors): components may not import pages, and only the `api/` layer
  may import `axios`. (The default is permissive; the plan is to tighten it later.)
- Other guards: `simple-import-sort` (layer-aware order), `import/no-cycle`, `no-restricted-imports`
  banning `../`, a local `no-complex-condition` rule (3+ logical operands must be a named constant),
  `max-lines` (150 global, 120 for pages), and `complexity` 15.

## Testing

Jest 30 + `@swc/jest` + React Testing Library + jsdom. ~108 co-located `__tests__/` files across `api/`,
`hooks/`, `components/`, `pages/`, `utils/`, and `constants/`; `npm run test:coverage` enforces an 80%
global threshold (branches/functions/lines/statements).

Read [src/test/jest.setup.ts](src/test/jest.setup.ts) and [jest.config.cjs](jest.config.cjs) before
writing tests. Conventions:

- Co-located `__tests__/`, named `<Unit>.test.ts(x)`; `it("should ...")` names.
- Prefer `act` over `waitFor` (per the repo rule); render hooks with `renderHook`.
- Use `renderWithRouter` from [src/test/router.tsx](src/test/router.tsx) (it defaults to a non-root route
  because `SearchComponent` special-cases `/`); assert navigation against the shared `mockNavigate`.
- **Mocking**: api-layer tests `jest.mock("../client")` and assert against `mockedGet/Post/...` (via
  [src/test/apiClientMock.ts](src/test/apiClientMock.ts)). Component/page/hook tests mock the higher-level
  api wrapper (`jest.mock("api/recipesApi")`), not the axios client. `config/env` and `config/logger` are
  mocked globally through `moduleNameMapper`.
- No `as any` casts; `jest.requireActual` is given an explicit type parameter.

## Conventions

- Talk to the backend only through `src/api/*`; never import `axios` in a page, hook, or component.
- All user-facing copy goes through i18n (`useTranslation`), not string literals.
- Tailwind for layout/spacing; custom CSS in [src/index.css](src/index.css). Stylelint guards CSS/SCSS.
- New routes go in [src/constants/routes.ts](src/constants/routes.ts) and the `PRIVATE_ROUTES` array
  (or the public set) in [App.tsx](src/App.tsx); add the page as a `React.lazy` import.

## Known oddities (not bugs to fix in unrelated changes)

- The backend DB column `quantity_person_ingradient` (missing letters) keeps its misspelling - it is the
  real column name and appears verbatim in API responses. The frontend pantry **folder** was corrected to
  `person-ingredients` (the matching DB column stays misspelled).

## Versioning

The whole project shares one version and one changelog at the repo root. This package's version in
[package.json](package.json) marks the last release in which the frontend changed. See the
[root README](../README.md#versioning-and-changelog) and [root CHANGELOG.md](../CHANGELOG.md).

## Related

- [Root README](../README.md) - project overview and monorepo scripts
- [Backend README](../backend/README.md) - API server
- [CHANGELOG.md](../CHANGELOG.md) - project changelog
- [CLAUDE.md](../CLAUDE.md) - notes for AI tooling
