class GetAllIngredients {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute() {
        return this.recipeRepository.findAllIngredients();
    }
}

module.exports = GetAllIngredients;
