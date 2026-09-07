import type { ReactElement } from "react";
import React, { Suspense } from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Route,
    RouterProvider,
} from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useOfflineNotice } from "hooks/useOfflineNotice";

import { HomeRoute } from "components/layout/HomeRoute";
import { PageSpinner } from "components/layout/PageSpinner";
import { PrivateRoute } from "components/layout/PrivateRoute";
import { RouteErrorBoundary } from "components/layout/RouteErrorBoundary";
import { ModalRoot } from "components/modals";
import { ThemeManager } from "components/theme/ThemeManager";
import { Toaster } from "components/ui/Toasts";

const LoginPage = React.lazy(() => import("views/auth/LoginPage"));
const RegisterPage = React.lazy(() => import("views/auth/RegisterPage"));
const ForgotPasswordPage = React.lazy(
    () => import("views/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = React.lazy(
    () => import("views/auth/ResetPasswordPage"),
);
const VerifyEmailPage = React.lazy(() => import("views/auth/VerifyEmailPage"));
const HomePage = React.lazy(() => import("views/home/HomePage"));
const GuestLandingPage = React.lazy(
    () => import("views/home/GuestLandingPage"),
);
const ChangeMenuPage = React.lazy(() => import("views/menu/ChangeMenuPage"));
const CreateMenuPage = React.lazy(() => import("views/menu/CreateMenuPage"));
const MenuDetailsPage = React.lazy(() => import("views/menu/MenuDetailsPage"));
const MenuPage = React.lazy(() => import("views/menu/MenuPage"));
const NotFoundPage = React.lazy(() => import("views/not-found/NotFoundPage"));
const IngredientsPage = React.lazy(
    () => import("views/person-ingredients/IngredientsPage"),
);
const ProfilePage = React.lazy(() => import("views/profile/ProfilePage"));
const SettingsPage = React.lazy(() => import("views/settings/SettingsPage"));
const ChangeRecipePage = React.lazy(
    () => import("views/recipes/ChangeRecipePage"),
);
const CreateRecipePage = React.lazy(
    () => import("views/recipes/CreateRecipePage"),
);
const MainPage = React.lazy(() => import("views/recipes/MainPage"));
const RecipeDetailsPage = React.lazy(
    () => import("views/recipes/RecipeDetailsPage"),
);
const StatsPage = React.lazy(() => import("views/statistics/StatsPage"));
const UserMenuPage = React.lazy(() => import("views/user-menu/UserMenuPage"));
const UserRecipesPage = React.lazy(
    () => import("views/user-recipes/UserRecipesPage"),
);

interface AppRoute {
    path: string;
    element: ReactElement;
}

const PRIVATE_ROUTES: AppRoute[] = [
    { path: ROUTES.myRecipes, element: <UserRecipesPage /> },
    { path: ROUTES.myMenus, element: <UserMenuPage /> },
    { path: ROUTES.addRecipe, element: <CreateRecipePage /> },
    { path: ROUTES.changeRecipe, element: <ChangeRecipePage /> },
    { path: ROUTES.stats, element: <StatsPage /> },
    { path: ROUTES.ingredients, element: <IngredientsPage /> },
    { path: ROUTES.addMenu, element: <CreateMenuPage /> },
    { path: ROUTES.changeMenu, element: <ChangeMenuPage /> },
    { path: ROUTES.profile, element: <ProfilePage /> },
    { path: ROUTES.settings, element: <SettingsPage /> },
];

// reachable without a session; must render immediately and never block on the /api/me round trip
// (no PrivateRoute wrapper) - session status may change their chrome, never whether they render
const PUBLIC_ROUTES: AppRoute[] = [
    { path: ROUTES.allRecipes, element: <MainPage /> },
    { path: ROUTES.recipeDetails, element: <RecipeDetailsPage /> },
    { path: ROUTES.allMenus, element: <MenuPage /> },
    { path: ROUTES.menuDetails, element: <MenuDetailsPage /> },
];

// shell chrome shared by every route; lives inside the router so descendants (modals, forms) can use data-router hooks like useBlocker
const RootLayout: React.FC = () => {
    useOfflineNotice();

    return (
        <>
            <ThemeManager />
            <Suspense fallback={<PageSpinner />}>
                <Outlet />
            </Suspense>
            <ModalRoot />
            <Toaster />
        </>
    );
};

// data router (not <BrowserRouter>): forms block in-app navigation away from unsaved edits via useBlocker, which plain routers don't support
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout />} errorElement={<RouteErrorBoundary />}>
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.registration} element={<RegisterPage />} />
            <Route
                path={ROUTES.forgotPassword}
                element={<ForgotPasswordPage />}
            />
            <Route
                path={ROUTES.resetPassword}
                element={<ResetPasswordPage />}
            />
            <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
            <Route
                path={ROUTES.home}
                element={
                    <HomeRoute
                        authedElement={<HomePage />}
                        guestElement={<GuestLandingPage />}
                    />
                }
            />
            {PUBLIC_ROUTES.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
            <Route element={<PrivateRoute />}>
                {PRIVATE_ROUTES.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Route>
            <Route path={ROUTES.notFound} element={<NotFoundPage />} />
        </Route>,
    ),
);

const AppWrapper: React.FC = () => <RouterProvider router={router} />;

export default AppWrapper;
