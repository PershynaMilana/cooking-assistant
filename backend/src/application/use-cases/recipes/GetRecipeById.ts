import { NotFoundError } from "@domain/errors/AppError";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class GetRecipeById {
    constructor(
        private recipeRepository: Pick<
            RecipeRepository,
            "findByIdWithIngredients"
        >,
    ) {}

    async execute(id: string | number): Promise<unknown> {
        const recipe = await this.recipeRepository.findByIdWithIngredients(id);
        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }
        return recipe;
    }
}
