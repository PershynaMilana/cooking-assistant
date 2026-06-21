import Recipe from "domain/entities/Recipe";
import type { RecipeRepository } from "domain/repositories/RecipeRepository";

import { createRecipeSchema } from "application/validation/recipe.schemas";
import { validate } from "application/validation/validate";

export default class CreateRecipe {
    constructor(private recipeRepository: Pick<RecipeRepository, "create">) {}

    async execute(input: unknown): Promise<unknown> {
        const data = validate(createRecipeSchema, input);
        const recipe = Recipe.forCreation(data);

        return this.recipeRepository.create(recipe);
    }
}
