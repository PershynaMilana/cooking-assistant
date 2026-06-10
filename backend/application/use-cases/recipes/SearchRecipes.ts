import type { RecipeRepository } from "../../../domain/repositories/RecipeRepository";
import type { RecipeFilters } from "./recipe.types";

export default class SearchRecipes {
    constructor(private recipeRepository: Pick<RecipeRepository, "search">) {}

    async execute(filters: RecipeFilters): Promise<unknown[]> {
        return this.recipeRepository.search(filters);
    }
}
