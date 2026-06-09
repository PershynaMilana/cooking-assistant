class GetRecipeStats {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute() {
        return this.recipeRepository.getStats();
    }
}

module.exports = GetRecipeStats;
