class SearchPersonRecipes {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async execute(personId, filters) {
        return this.recipeRepository.searchByPerson(personId, filters);
    }
}

module.exports = SearchPersonRecipes;
