const { NotFoundError } = require("../../../domain/errors/AppError");

class DeleteRecipeType {
    constructor(recipeTypeRepository) {
        this.recipeTypeRepository = recipeTypeRepository;
    }

    async execute(id) {
        const deleted = await this.recipeTypeRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Recipe type not found");
        }
    }
}

module.exports = DeleteRecipeType;
