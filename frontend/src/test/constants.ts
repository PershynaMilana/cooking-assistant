import { ROUTES } from "constants/routes";

// navigation route targets used in navigate() assertions (sourced from the app
// route constants so test expectations can never drift from the real paths)
export const ROUTE_HOME = ROUTES.home;
export const ROUTE_MAIN = ROUTES.main;
export const ROUTE_MENU = ROUTES.menu;

export const LABEL_COOKING_TIME = "Cooking Time (hh:mm)";

export const BTN_RESET_FILTERS = "Reset filters";

export const BTN_DELETE_RECIPE = "Delete recipe";
export const BTN_EDIT_RECIPE = "Edit recipe";

export const BTN_DELETE_MENU = "Delete menu";

export const BTN_EDIT_INGREDIENTS = "Edit ingredients";

export const ERROR_RECIPES_REQUIRED = "Please select at least one recipe.";
export const ERROR_COOKING_TIME_FORMAT = "Enter time in format hh:mm";

export const MOCK_ERROR_NETWORK = "Network error";
export const MOCK_ERROR_SERVER = "Server error";
export const MOCK_ERROR_INGREDIENTS = "Ingredients unavailable";
export const MOCK_ERROR_TYPES = "Types unavailable";
