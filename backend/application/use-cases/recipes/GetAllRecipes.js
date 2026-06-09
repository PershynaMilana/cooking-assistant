class GetAllRecipes {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute() {
        return this.recipeRepository.findAllWithIngredients();
    }
}

module.exports = GetAllRecipes;
