import type { PantryRepository } from "domain/repositories/PantryRepository";

import { idSchema } from "application/validation/common.schemas";
import { pantryIngredientsSchema } from "application/validation/pantry.schemas";
import { validate } from "application/validation/validate";

export default class AddUserIngredients {
    constructor(
        private pantryRepository: Pick<PantryRepository, "addIngredients">,
    ) {}

    async execute(
        userId: string | number,
        ingredients: unknown,
    ): Promise<void> {
        const validUserId = validate(idSchema, userId);
        const data = validate(pantryIngredientsSchema, ingredients);

        await this.pantryRepository.addIngredients(validUserId, data);
    }
}
