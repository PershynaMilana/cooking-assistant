export interface RecipeListItem {
    id: number;
    title: string;
    type_name: string;
    creation_date: string;
    cooking_time: number;
}

// shape returned by GET /api/recipes - the recipe list plus an array_agg of
// ingredient names (the list query in PgRecipeRepository.findAllWithIngredients)
export interface RecipeWithIngredientNames extends RecipeListItem {
    ingredients: string[];
}

export interface RecipeDetailIngredient {
    id: number;
    name: string;
    quantity_recipe_ingredients: number;
    unit_name: string;
}

// full shape returned by GET /api/recipe/:id (superset consumed by
// RecipeDetailsPage + ChangeRecipePage - both pages already rely on
// every field below, so the union is accurate, not invented)
export interface RecipeDetails {
    id: number;
    title: string;
    content: string;
    ingredients: RecipeDetailIngredient[];
    type_id: number;
    type_name: string;
    cooking_time: number;
    creation_date: string;
    servings: string;
    person_id: number;
}

export interface RecipeFilterParams {
    ingredient_name: string;
    type_ids?: string;
    start_date?: string;
    end_date?: string;
    min_cooking_time?: string;
    max_cooking_time?: string;
    sort_order: string;
}

export interface CreateRecipeIngredient {
    id: number;
    quantity: number;
}

export interface CreateRecipeRequest {
    title: string;
    content: string;
    person_id: number;
    ingredients: CreateRecipeIngredient[];
    type_id: number | null;
    cooking_time: number;
    servings: string;
}

export interface UpdateRecipeIngredient {
    id: number;
    quantity_recipe_ingredients: number;
}

export interface UpdateRecipeRequest {
    title: string;
    content: string;
    type_id: number | null;
    cooking_time: number;
    servings: string;
    ingredients: UpdateRecipeIngredient[];
}

export interface RecipeFormIngredient {
    id: number;
    name: string;
    quantity: number;
    unit_name: string;
}

export interface RecipeFormInitialValues {
    title: string;
    content: string;
    cookingTime: string;
    servings: string;
    selectedTypeId: number | null;
    selectedIngredients: RecipeFormIngredient[];
}

export interface RecipeFormCreateMessages {
    errorTitle: string;
    errorDescription: string;
    errorIngredients: string;
    errorType: string;
    errorCookingTimeFormat: string;
    errorCookingTimeInvalid: string;
    errorServings: string;
}

export interface RecipeFormChangeMessages {
    errorCookingTimeFormat: string;
    errorCookingTimeInvalid: string;
    errorServings: string;
}
