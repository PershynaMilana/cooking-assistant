import Recipe from "@domain/entities/Recipe";
import type { RecipeCreationInput } from "@domain/entities/Recipe";
import { validate } from "@application/validation/validate";
import { createRecipeSchema } from "@application/validation/recipe.schemas";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class CreateRecipe {
    constructor(private recipeRepository: Pick<RecipeRepository, "create">) {}

    async execute(input: RecipeCreationInput): Promise<unknown> {
        const data = validate(createRecipeSchema, input);
        const recipe = Recipe.forCreation(data);
        return this.recipeRepository.create(recipe);
    }
}
