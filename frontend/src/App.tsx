import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateRecipePage from "./pages/CreateRecipePage.tsx";
import RecipeDetailsPage from "./pages/RecipeDetailsPage.tsx";
import ChangeRecipePage from "./pages/ChangeRecipePage.tsx";
import StatsPage from "./pages/StatsPage.tsx";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      {/* auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegisterPage />} />
      {/* main */}
      <Route path="/main" element={<MainPage />} />
      <Route path="/add-recipe" element={<CreateRecipePage />} />
      <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
      <Route path="/change-recipe/:id" element={<ChangeRecipePage />} />
      <Route path="/stats" element={<StatsPage />} />{" "}
      {/* Добавлен маршрут для статистики */}
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
