import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { RecipeRepository } from "@domain/repositories/RecipeRepository";

export default class DeleteRecipe {
    constructor(
        private recipeRepository: Pick<RecipeRepository, "deleteById">,
    ) {}

    async execute(id: string | number): Promise<void> {
        const recipeId = validate(idSchema, id);
        const deleted = await this.recipeRepository.deleteById(recipeId);
        if (!deleted) {
            throw new NotFoundError("Recipe not found");
        }
    }
}
