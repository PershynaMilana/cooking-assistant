const { ValidationError } = require("../../../domain/errors/AppError");

class UpdateIngredientQuantities {
    constructor(pantryRepository) {
        this.pantryRepository = pantryRepository;
    }

    async execute(userId, updatedIngredients) {
        if (!Array.isArray(updatedIngredients)) {
            throw new ValidationError("Incorrect data format");
        }

        await this.pantryRepository.updateQuantities(
            userId,
            updatedIngredients,
        );
    }
}

module.exports = UpdateIngredientQuantities;
