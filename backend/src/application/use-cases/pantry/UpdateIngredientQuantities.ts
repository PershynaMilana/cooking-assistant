import { idSchema } from "@application/validation/common.schemas";
import { pantryIngredientsSchema } from "@application/validation/pantry.schemas";
import { validate } from "@application/validation/validate";
import type { PantryRepository } from "@domain/repositories/PantryRepository";

export default class UpdateIngredientQuantities {
    constructor(
        private pantryRepository: Pick<PantryRepository, "updateQuantities">,
    ) {}

    async execute(
        userId: string | number,
        updatedIngredients: unknown,
    ): Promise<void> {
        const validUserId = validate(idSchema, userId);
        const data = validate(pantryIngredientsSchema, updatedIngredients);

        await this.pantryRepository.updateQuantities(validUserId, data);
    }
}
