import type { ReactElement } from "react";
import React from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { ROUTES } from "constants/routes";

import { PrivateRoute } from "components/layout/PrivateRoute";

import LoginPage from "pages/auth/LoginPage";
import RegisterPage from "pages/auth/RegisterPage";
import ChangeMenuPage from "pages/menu/ChangeMenuPage";
import CreateMenuPage from "pages/menu/CreateMenuPage";
import MenuDetailsPage from "pages/menu/MenuDetailsPage";
import MenuPage from "pages/menu/MenuPage";
import NotFoundPage from "pages/not-found/NotFoundPage";
import IngredientsPage from "pages/person-ingradients/IngredientsPage";
import TypesPage from "pages/recipe-types/TypesPage";
import ChangeRecipePage from "pages/recipes/ChangeRecipePage";
import CreateRecipePage from "pages/recipes/CreateRecipePage";
import MainPage from "pages/recipes/MainPage";
import RecipeDetailsPage from "pages/recipes/RecipeDetailsPage";
import StatsPage from "pages/statistics/StatsPage";
import UserMenuPage from "pages/user-menu/UserMenuPage";
import UserRecipesPage from "pages/user-recipes/UserRecipesPage";

interface AppRoute {
    path: string;
    element: ReactElement;
}

// every authenticated route, rendered once under a single <PrivateRoute> layout
const PRIVATE_ROUTES: AppRoute[] = [
    { path: ROUTES.main, element: <MainPage /> },
    { path: ROUTES.myRecipes, element: <UserRecipesPage /> },
    { path: ROUTES.myMenus, element: <UserMenuPage /> },
    { path: ROUTES.recipeTypes, element: <TypesPage /> },
    { path: ROUTES.addRecipe, element: <CreateRecipePage /> },
    { path: ROUTES.recipeDetails, element: <RecipeDetailsPage /> },
    { path: ROUTES.changeRecipe, element: <ChangeRecipePage /> },
    { path: ROUTES.stats, element: <StatsPage /> },
    { path: ROUTES.ingredients, element: <IngredientsPage /> },
    { path: ROUTES.menu, element: <MenuPage /> },
    { path: ROUTES.addMenu, element: <CreateMenuPage /> },
    { path: ROUTES.menuDetails, element: <MenuDetailsPage /> },
    { path: ROUTES.changeMenu, element: <ChangeMenuPage /> },
];

const App: React.FC = () => (
    <Routes>
        <Route
            path={ROUTES.home}
            element={<Navigate to={ROUTES.main} replace />}
        />

        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.registration} element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
            {PRIVATE_ROUTES.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
        </Route>

        <Route path={ROUTES.notFound} element={<NotFoundPage />} />
    </Routes>
);

const AppWrapper: React.FC = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
