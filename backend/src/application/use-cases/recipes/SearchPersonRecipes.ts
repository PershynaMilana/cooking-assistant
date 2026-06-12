import { idSchema } from "@application/validation/common.schemas";
import { recipeFiltersSchema } from "@application/validation/recipe.schemas";
import { validate } from "@application/validation/validate";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class SearchPersonRecipes {
    constructor(
        private recipeRepository: Pick<RecipeRepository, "searchByPerson">,
    ) {}

    async execute(personId: number, filters: unknown): Promise<unknown[]> {
        const validPersonId = validate(idSchema, personId);
        const validFilters = validate(recipeFiltersSchema, filters);
        return this.recipeRepository.searchByPerson(
            validPersonId,
            validFilters,
        );
    }
}
