import Recipe from "@domain/entities/Recipe";
import type { RecipeCreationInput } from "@domain/entities/Recipe";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class CreateRecipe {
    constructor(private recipeRepository: Pick<RecipeRepository, "create">) {}

    async execute(input: RecipeCreationInput): Promise<unknown> {
        const recipe = Recipe.forCreation(input);
        return this.recipeRepository.create(recipe);
    }
}
