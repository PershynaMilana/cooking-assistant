import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { PantryRepository } from "@domain/repositories/PantryRepository";

export default class DeleteUserIngredient {
    constructor(
        private pantryRepository: Pick<PantryRepository, "deleteIngredient">,
    ) {}

    async execute(
        userId: string | number,
        ingredientId: string | number,
    ): Promise<void> {
        const validUserId = validate(idSchema, userId);
        const validIngredientId = validate(idSchema, ingredientId);
        const deleted = await this.pantryRepository.deleteIngredient(
            validUserId,
            validIngredientId,
        );
        if (!deleted) {
            throw new NotFoundError("Ingredient not found for this user");
        }
    }
}
