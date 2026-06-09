const { NotFoundError } = require("../../../domain/errors/AppError");

class DeleteRecipe {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute(id) {
        const deleted = await this.recipeRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Recipe not found");
        }
    }
}

module.exports = DeleteRecipe;
