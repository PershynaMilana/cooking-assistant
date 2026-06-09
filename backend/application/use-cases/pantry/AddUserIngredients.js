const { ValidationError } = require("../../../domain/errors/AppError");

class AddUserIngredients {
    constructor(pantryRepository) {
        this.pantryRepository = pantryRepository;
    }

    async execute(userId, ingredients) {
        if (!Array.isArray(ingredients)) {
            throw new ValidationError("Incorrect data format");
        }

        await this.pantryRepository.addIngredients(userId, ingredients);
    }
}

module.exports = AddUserIngredients;
