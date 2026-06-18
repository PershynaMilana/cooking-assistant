import React from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { PrivateRoute } from "components/layout/PrivateRoute";

import LoginPage from "pages/auth/LoginPage";
import RegisterPage from "pages/auth/RegisterPage";
import ChangeMenuPage from "pages/menu/ChangeMenuPage";
import CreateMenuPage from "pages/menu/CreateMenuPage";
import MenuDetailsPage from "pages/menu/MenuDetailsPage";
import MenuPage from "pages/menu/MenuPage";
import NotFoundPage from "pages/not-found/NotFoundPage";
import IngredientsPage from "pages/person-ingradients/IngredientsPage";
import AddRecipeType from "pages/recipe-types/AddTypePage";
import EditRecipeType from "pages/recipe-types/EditRecipeType";
import TypesPage from "pages/recipe-types/TypesPage";
import ChangeRecipePage from "pages/recipes/ChangeRecipePage";
import CreateRecipePage from "pages/recipes/CreateRecipePage";
import MainPage from "pages/recipes/MainPage";
import RecipeDetailsPage from "pages/recipes/RecipeDetailsPage";
import StatsPage from "pages/statistics/StatsPage";
import UserMenuPage from "pages/user-menu/UserMenuPage";
import UserRecipesPage from "pages/user-recipes/UserRecipesPage";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />

            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegisterPage />} />

            {/* main */}
            <Route
                path="/main"
                element={
                    <PrivateRoute>
                        <MainPage />{" "}
                    </PrivateRoute>
                }
            />

            {/* user recipes */}
            <Route
                path="/my-recipes"
                element={
                    <PrivateRoute>
                        <UserRecipesPage />{" "}
                    </PrivateRoute>
                }
            />

            {/* user menus */}
            <Route
                path="/my-menus"
                element={
                    <PrivateRoute>
                        <UserMenuPage />{" "}
                    </PrivateRoute>
                }
            />

            {/* types */}
            <Route
                path="/types"
                element={
                    <PrivateRoute>
                        <TypesPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/types/:id"
                element={
                    <PrivateRoute>
                        <EditRecipeType />
                    </PrivateRoute>
                }
            />
            <Route
                path="/add-type"
                element={
                    <PrivateRoute>
                        <AddRecipeType />
                    </PrivateRoute>
                }
            />

            {/* recipes */}
            <Route
                path="/add-recipe"
                element={
                    <PrivateRoute>
                        <CreateRecipePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/recipe/:id"
                element={
                    <PrivateRoute>
                        <RecipeDetailsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/change-recipe/:id"
                element={
                    <PrivateRoute>
                        <ChangeRecipePage />
                    </PrivateRoute>
                }
            />

            {/* stats */}
            <Route
                path="/stats"
                element={
                    <PrivateRoute>
                        <StatsPage />
                    </PrivateRoute>
                }
            />

            {/* user-ingredients */}
            <Route
                path="/ingredients"
                element={
                    <PrivateRoute>
                        <IngredientsPage />
                    </PrivateRoute>
                }
            />

            {/* menu */}
            <Route
                path="/menu"
                element={
                    <PrivateRoute>
                        <MenuPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/add-menu"
                element={
                    <PrivateRoute>
                        <CreateMenuPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/menu/:id"
                element={
                    <PrivateRoute>
                        <MenuDetailsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/change-menu/:id"
                element={
                    <PrivateRoute>
                        <ChangeMenuPage />
                    </PrivateRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

const AppWrapper: React.FC = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
