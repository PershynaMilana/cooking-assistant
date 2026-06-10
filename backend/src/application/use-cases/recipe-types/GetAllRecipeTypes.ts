import type { RecipeTypeRepository } from "@domain/repositories/RecipeTypeRepository";

export default class GetAllRecipeTypes {
    constructor(
        private recipeTypeRepository: Pick<RecipeTypeRepository, "findAll">,
    ) {}

    async execute(): Promise<unknown[]> {
        return this.recipeTypeRepository.findAll();
    }
}
