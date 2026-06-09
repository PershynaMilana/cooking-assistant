class GetAllRecipeTypes {
    constructor(recipeTypeRepository) {
        this.recipeTypeRepository = recipeTypeRepository;
    }

    async execute() {
        return this.recipeTypeRepository.findAll();
    }
}

module.exports = GetAllRecipeTypes;
