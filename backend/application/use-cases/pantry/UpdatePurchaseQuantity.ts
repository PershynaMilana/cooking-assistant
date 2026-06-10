import {
    NotFoundError,
    ValidationError,
} from "../../../domain/errors/AppError";
import type { PantryRepository } from "../../../domain/repositories/PantryRepository";

export default class UpdatePurchaseQuantity {
    constructor(
        private pantryRepository: Pick<
            PantryRepository,
            "updatePurchaseQuantity"
        >,
    ) {}

    async execute(
        userId: string | number,
        purchaseId: string | number,
        quantity?: number,
    ): Promise<void> {
        if (quantity === undefined) {
            throw new ValidationError("Quantity cannot be empty.");
        }

        const updated = await this.pantryRepository.updatePurchaseQuantity(
            userId,
            purchaseId,
            quantity,
        );
        if (!updated) {
            throw new NotFoundError("Purchase not found.");
        }
    }
}
