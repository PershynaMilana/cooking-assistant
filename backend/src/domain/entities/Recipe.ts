import { ValidationError } from "@domain/errors/AppError";

export interface RecipeIngredient {
    id: number;
    quantity?: number;
    quantity_recipe_ingredients?: number;
}

export interface RecipeCreationInput {
    title?: string;
    content?: string;
    person_id?: number;
    ingredients: RecipeIngredient[];
    type_id?: number;
    cooking_time?: number;
    servings?: number;
}

export type RecipeUpdateInput = Omit<RecipeCreationInput, "person_id">;

function validateIngredients(ingredients: RecipeIngredient[]): void {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new ValidationError("Ingredients cannot be empty");
    }

    for (const ingredient of ingredients) {
        if (!ingredient.id) {
            throw new ValidationError("All ingredients must have id");
        }
    }
}

export class Recipe {
    declare title?: string;
    declare content?: string;
    declare person_id?: number;
    declare ingredients: RecipeIngredient[];
    declare type_id?: number;
    declare cooking_time?: number;
    declare servings?: number;

    static forCreation({
        title,
        content,
        person_id,
        ingredients,
        type_id,
        cooking_time,
        servings,
    }: RecipeCreationInput): Recipe {
        validateIngredients(ingredients);

        return new Recipe({
            title,
            content,
            person_id,
            ingredients,
            type_id,
            cooking_time,
            servings,
        });
    }

    static forUpdate({
        title,
        content,
        ingredients,
        type_id,
        cooking_time,
        servings,
    }: RecipeUpdateInput): Recipe {
        if (!title || !content) {
            throw new ValidationError("Title and content cannot be empty");
        }

        validateIngredients(ingredients);

        return new Recipe({
            title,
            content,
            ingredients,
            type_id,
            cooking_time,
            servings,
        });
    }

    private constructor(data: Partial<Recipe>) {
        Object.assign(this, data);
    }
}

export default Recipe;
