import { ERROR_MESSAGES } from "constants/errorMessages";
import { NotFoundError } from "domain/errors/AppError";
import type { RecipeRepository } from "domain/repositories/RecipeRepository";

import { idSchema } from "application/validation/common.schemas";
import { validate } from "application/validation/validate";

export default class DeleteRecipe {
    constructor(
        private recipeRepository: Pick<RecipeRepository, "deleteById">,
    ) {}

    async execute(id: string | number, personId: number): Promise<void> {
        const recipeId = validate(idSchema, id);
        const validPersonId = validate(idSchema, personId);
        const deleted = await this.recipeRepository.deleteById(
            recipeId,
            validPersonId,
        );

        if (!deleted) {
            throw new NotFoundError(ERROR_MESSAGES.RECIPE_NOT_FOUND);
        }
    }
}
