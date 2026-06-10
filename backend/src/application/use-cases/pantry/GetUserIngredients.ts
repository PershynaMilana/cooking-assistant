import type { PantryRepository } from "@domain/repositories/PantryRepository";

export default class GetUserIngredients {
    constructor(
        private pantryRepository: Pick<PantryRepository, "findByUser">,
    ) {}

    async execute(userId: string | number): Promise<unknown[]> {
        return this.pantryRepository.findByUser(userId);
    }
}
