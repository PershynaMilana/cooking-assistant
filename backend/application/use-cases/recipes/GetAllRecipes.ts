import type { RecipeRepository } from "../../../domain/repositories/RecipeRepository";

export default class GetAllRecipes {
    constructor(
        private recipeRepository: Pick<
            RecipeRepository,
            "findAllWithIngredients"
        >,
    ) {}

    async execute(): Promise<unknown[]> {
        return this.recipeRepository.findAllWithIngredients();
    }
}
