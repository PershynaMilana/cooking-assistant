import { NotFoundError } from "../../../domain/errors/AppError";
import type { PantryRepository } from "../../../domain/repositories/PantryRepository";

export default class DeleteUserIngredient {
    constructor(
        private pantryRepository: Pick<PantryRepository, "deleteIngredient">,
    ) {}

    async execute(
        userId: string | number,
        ingredientId: string | number,
    ): Promise<void> {
        const deleted = await this.pantryRepository.deleteIngredient(
            userId,
            ingredientId,
        );
        if (!deleted) {
            throw new NotFoundError("Ingredient not found for this user");
        }
    }
}
