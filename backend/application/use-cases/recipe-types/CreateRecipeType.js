class CreateRecipeType {
    constructor(recipeTypeRepository) {
        this.recipeTypeRepository = recipeTypeRepository;
    }

    async execute({ type_name, description }) {
        return this.recipeTypeRepository.create({ type_name, description });
    }
}

module.exports = CreateRecipeType;
