export const ROUTES = {
    home: "/",
    main: "/main",
    login: "/login",
    registration: "/registration",

    myRecipes: "/my-recipes",
    addRecipe: "/add-recipe",
    recipeDetails: "/recipe/:id",
    changeRecipe: "/change-recipe/:id",

    recipeTypes: "/types",
    addRecipeType: "/add-type",
    editRecipeType: "/types/:id",

    ingredients: "/ingredients",
    stats: "/stats",

    menu: "/menu",
    myMenus: "/my-menus",
    addMenu: "/add-menu",
    menuDetails: "/menu/:id",
    changeMenu: "/change-menu/:id",

    notFound: "*",
} as const;

const withId = (pattern: string, id: string | number): string =>
    pattern.replace(":id", String(id));

export const recipeDetailsPath = (id: string | number): string =>
    withId(ROUTES.recipeDetails, id);

export const changeRecipePath = (id: string | number): string =>
    withId(ROUTES.changeRecipe, id);

export const editRecipeTypePath = (id: string | number): string =>
    withId(ROUTES.editRecipeType, id);

export const menuDetailsPath = (id: string | number): string =>
    withId(ROUTES.menuDetails, id);

export const changeMenuPath = (id: string | number): string =>
    withId(ROUTES.changeMenu, id);
