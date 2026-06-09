const { NotFoundError } = require("../../../domain/errors/AppError");

class DeleteUserIngredient {
    constructor(pantryRepository) {
        this.pantryRepository = pantryRepository;
    }

    async execute(userId, ingredientId) {
        const deleted = await this.pantryRepository.deleteIngredient(
            userId,
            ingredientId,
        );
        if (!deleted) {
            throw new NotFoundError("Ingredient not found for this user");
        }
    }
}

module.exports = DeleteUserIngredient;
