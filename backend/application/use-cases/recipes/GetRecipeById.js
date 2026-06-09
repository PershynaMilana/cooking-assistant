const { NotFoundError } = require("../../../domain/errors/AppError");

class GetRecipeById {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute(id) {
        const recipe = await this.recipeRepository.findByIdWithIngredients(id);
        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }
        return recipe;
    }
}

module.exports = GetRecipeById;
