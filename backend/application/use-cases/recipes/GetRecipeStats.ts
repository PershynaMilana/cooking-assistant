import type { RecipeRepository } from "../../../domain/repositories/RecipeRepository";

export default class GetRecipeStats {
    constructor(private recipeRepository: Pick<RecipeRepository, "getStats">) {}

    async execute(): Promise<unknown> {
        return this.recipeRepository.getStats();
    }
}
