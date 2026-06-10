import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class GetAllIngredients {
    constructor(
        private recipeRepository: Pick<RecipeRepository, "findAllIngredients">,
    ) {}

    async execute(): Promise<unknown[]> {
        return this.recipeRepository.findAllIngredients();
    }
}
