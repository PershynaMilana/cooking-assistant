const { NotFoundError } = require("../../../domain/errors/AppError");
const Recipe = require("../../../domain/entities/Recipe");

class UpdateRecipe {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute(id, input) {
        const recipe = Recipe.forUpdate(input);
        const updated = await this.recipeRepository.update(id, recipe);
        if (!updated) {
            throw new NotFoundError("Recipe not found");
        }
        return updated;
    }
}

module.exports = UpdateRecipe;
