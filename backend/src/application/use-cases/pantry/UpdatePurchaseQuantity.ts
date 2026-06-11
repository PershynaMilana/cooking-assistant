import { NotFoundError } from "@domain/errors/AppError";
import { idSchema } from "@application/validation/common.schemas";
import { purchaseQuantitySchema } from "@application/validation/pantry.schemas";
import { validate } from "@application/validation/validate";
import type { PantryRepository } from "@domain/repositories/PantryRepository";

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
        const validUserId = validate(idSchema, userId);
        const validPurchaseId = validate(idSchema, purchaseId);
        const validQuantity = validate(purchaseQuantitySchema, quantity);

        const updated = await this.pantryRepository.updatePurchaseQuantity(
            validUserId,
            validPurchaseId,
            validQuantity,
        );
        if (!updated) {
            throw new NotFoundError("Purchase not found.");
        }
    }
}
