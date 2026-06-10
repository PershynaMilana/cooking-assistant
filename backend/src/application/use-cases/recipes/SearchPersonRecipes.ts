import type { RecipeRepository } from "@domain/repositories/RecipeRepository";
import type { RecipeFilters } from "./recipe.types";

export default class SearchPersonRecipes {
    constructor(
        private recipeRepository: Pick<RecipeRepository, "searchByPerson">,
    ) {}

    async execute(
        personId: number,
        filters: RecipeFilters,
    ): Promise<unknown[]> {
        return this.recipeRepository.searchByPerson(personId, filters);
    }
}
