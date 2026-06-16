export interface Menu {
    id: number;
    title: string;
    categoryname: string;
    menucontent: string;
}

export interface MenuCategory {
    menu_category_id: number;
    category_name: string;
}

export interface MissingIngredient {
    ingredient_name: string;
    missing_quantity: number;
    unit_name: string;
}

export interface MenuDetailRecipe {
    id: number;
    recipe_id: number;
    title: string;
    type_name: string;
    cooking_time: number;
    creation_date: string;
    missingIngredients: MissingIngredient[];
}

export interface MenuDetails {
    menu: {
        id: number;
        title: string;
        categoryname: string;
        menucontent: string;
        categoryid?: number;
        personid?: number;
    };
    recipes: MenuDetailRecipe[];
}

export interface MenuListParams {
    menu_name?: string;
    category_ids?: string;
}

export interface CreateMenuRequest {
    menuTitle: string;
    menuContent: string;
    categoryId: number;
    personId: number;
    recipeIds: number[];
}

export interface UpdateMenuRequest {
    menuTitle: string;
    menuContent: string;
    categoryId: number | null;
    recipeIds: number[];
}
