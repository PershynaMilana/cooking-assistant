import { recipeFiltersSchema } from "@application/validation/recipe.schemas";
import { validate } from "@application/validation/validate";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class SearchRecipes {
    constructor(private recipeRepository: Pick<RecipeRepository, "search">) {}

    async execute(filters: unknown): Promise<unknown[]> {
        const validFilters = validate(recipeFiltersSchema, filters);
        return this.recipeRepository.search(validFilters);
    }
}
