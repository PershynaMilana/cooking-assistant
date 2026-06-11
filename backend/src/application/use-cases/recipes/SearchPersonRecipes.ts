import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
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
        const validPersonId = validate(idSchema, personId);
        return this.recipeRepository.searchByPerson(validPersonId, filters);
    }
}
