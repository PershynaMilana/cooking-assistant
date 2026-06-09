const {
    NotFoundError,
    ValidationError,
} = require("../../../domain/errors/AppError");

class UpdatePurchaseQuantity {
    constructor(pantryRepository) {
        this.pantryRepository = pantryRepository;
    }

    async execute(userId, purchaseId, quantity) {
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

module.exports = UpdatePurchaseQuantity;
