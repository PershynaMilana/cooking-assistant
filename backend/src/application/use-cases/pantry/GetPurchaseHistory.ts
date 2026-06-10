import type { PantryRepository } from "@domain/repositories/PantryRepository";

export default class GetPurchaseHistory {
    constructor(
        private pantryRepository: Pick<PantryRepository, "findPurchaseHistory">,
    ) {}

    async execute(
        userId: string | number,
        ingredientId: string | number,
    ): Promise<unknown[]> {
        return this.pantryRepository.findPurchaseHistory(userId, ingredientId);
    }
}
