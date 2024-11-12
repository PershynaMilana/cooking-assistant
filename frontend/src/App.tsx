import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/recipes/MainPage.tsx";
import NotFoundPage from "./pages/not-found/NotFoundPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import CreateRecipePage from "./pages/recipes/CreateRecipePage.tsx";
import RecipeDetailsPage from "./pages/recipes/RecipeDetailsPage.tsx";
import ChangeRecipePage from "./pages/recipes/ChangeRecipePage.tsx";
import StatsPage from "./pages/statistics/StatsPage.tsx";
import TypesPage from "./pages/recipe-types/TypesPage.tsx";
import EditRecipeType from "./pages/recipe-types/EditRecipeType.tsx";
import AddRecipeType from "./pages/recipe-types/AddTypePage.tsx";
import IngredientsPage from "./pages/person-ingradients/IngredientsPage.tsx.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import UserRecipesPage from "./pages/user-recipes/UserRecipesPage.tsx";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />

            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegisterPage />} />

            {/* main */}
            <Route path="/main" element={<PrivateRoute><MainPage /> </PrivateRoute>} />

            <Route path="/my-recipes" element={<PrivateRoute><UserRecipesPage /> </PrivateRoute>} />

            {/* types */}
            <Route path="/types" element={<PrivateRoute><TypesPage /></PrivateRoute>} />
            <Route path="/types/:id" element={<PrivateRoute><EditRecipeType /></PrivateRoute>} />
            <Route path="/add-type" element={<PrivateRoute><AddRecipeType /></PrivateRoute>} />

            {/* recipes */}
            <Route path="/add-recipe" element={<PrivateRoute><CreateRecipePage /></PrivateRoute>} />
            <Route path="/recipe/:id" element={<PrivateRoute><RecipeDetailsPage /></PrivateRoute>} />
            <Route path="/change-recipe/:id" element={<PrivateRoute><ChangeRecipePage /></PrivateRoute>} />

            {/* stats */}
            <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />

            {/* user-ingredients */}
            <Route path="/ingredients" element={<PrivateRoute><IngredientsPage /></PrivateRoute>} />

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
