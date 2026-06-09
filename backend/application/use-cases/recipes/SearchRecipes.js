class SearchRecipes {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute(filters) {
        return this.recipeRepository.search(filters);
    }
}

module.exports = SearchRecipes;
