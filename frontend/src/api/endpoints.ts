export const API_ROUTES = {
    auth: {
        login: "/api/login",
        register: "/api/register",
    },
    recipes: {
        list: "/api/recipes",
        byFilters: "/api/recipes-by-filters",
        byPerson: (userId: string | number) =>
            `/api/recipes-filters-person/${userId}`,
        create: "/api/recipe",
        byId: (id: string | number) => `/api/recipe/${id}`,
        stats: "/api/recipes-stats",
    },
    recipeTypes: {
        list: "/api/recipe-types",
        byId: (id: string | number) => `/api/recipe-type/${id}`,
    },
    ingredients: {
        list: "/api/ingredients",
    },
    userIngredients: {
        byPerson: (userId: string | number) =>
            `/api/user-ingredients/${userId}`,
        updateQuantities: (userId: string | number) =>
            `/api/user-ingredients/update-quantities/${userId}`,
        item: (userId: string | number, ingredientId: string | number) =>
            `/api/user-ingredients/${userId}/${ingredientId}`,
        history: (userId: string | number, ingredientId: string | number) =>
            `/api/user-ingredients/${userId}/history/${ingredientId}`,
    },
    menu: {
        list: "/api/menu",
        create: "/api/create-menu",
        byId: (id: string | number) => `/api/menu/${id}`,
        byPerson: (userId: string | number) =>
            `/api/menu-filters-person/${userId}`,
    },
    menuCategories: {
        list: "/api/menu-categories",
    },
} as const;
