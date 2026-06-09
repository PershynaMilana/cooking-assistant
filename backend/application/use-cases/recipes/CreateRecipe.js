const Recipe = require("../../../domain/entities/Recipe");

class CreateRecipe {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute(input) {
        const recipe = Recipe.forCreation(input);
        return this.recipeRepository.create(recipe);
    }
}

module.exports = CreateRecipe;
