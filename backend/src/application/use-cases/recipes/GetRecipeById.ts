import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class GetRecipeById {
    constructor(
        private recipeRepository: Pick<
            RecipeRepository,
            "findByIdWithIngredients"
        >,
    ) {}

    async execute(
        id: string | number,
        currentUserId: number,
    ): Promise<unknown> {
        const recipeId = validate(idSchema, id);
        const recipe = await this.recipeRepository.findByIdWithIngredients(
            recipeId,
            currentUserId,
        );
        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }
        return recipe;
    }
}
