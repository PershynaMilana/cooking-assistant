import { idSchema } from "@application/validation/common.schemas";
import { validate } from "@application/validation/validate";
import type { PantryRepository } from "@domain/repositories/PantryRepository";

export default class GetUserIngredients {
    constructor(
        private pantryRepository: Pick<PantryRepository, "findByUser">,
    ) {}

    async execute(userId: string | number): Promise<unknown[]> {
        const validUserId = validate(idSchema, userId);
        return this.pantryRepository.findByUser(validUserId);
    }
}
