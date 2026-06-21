import type { PantryRepository } from "domain/repositories/PantryRepository";

import { idSchema } from "application/validation/common.schemas";
import { pantryUpdateIngredientsSchema } from "application/validation/pantry.schemas";
import { validate } from "application/validation/validate";

export default class UpdateIngredientQuantities {
    constructor(
        private pantryRepository: Pick<PantryRepository, "updateQuantities">,
    ) {}

    async execute(
        userId: string | number,
        updatedIngredients: unknown,
    ): Promise<void> {
        const validUserId = validate(idSchema, userId);
        const data = validate(
            pantryUpdateIngredientsSchema,
            updatedIngredients,
        );

        await this.pantryRepository.updateQuantities(validUserId, data);
    }
}
