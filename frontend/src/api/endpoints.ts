export const API_ROUTES = {
    auth: {
        login: "/api/login",
        register: "/api/register",
    },
    recipes: {
        byFilters: "/api/recipes-by-filters",
        byPerson: (userId: string | number) =>
            `/api/recipes-filters-person/${userId}`,
        create: "/api/recipe",
        byId: (id: string | number) => `/api/recipe/${id}`,
    },
    recipeTypes: {
        list: "/api/recipe-types",
        byId: (id: string | number) => `/api/recipe-type/${id}`,
    },
    ingredients: {
        list: "/api/ingredients",
    },
} as const;
