const { NotFoundError } = require("../../../domain/errors/AppError");

class UpdateRecipeType {
    constructor(recipeTypeRepository) {
        this.recipeTypeRepository = recipeTypeRepository;
    }

    async execute(id, { type_name, description }) {
        const updated = await this.recipeTypeRepository.update(id, {
            type_name,
            description,
        });
        if (!updated) {
            throw new NotFoundError("Recipe type not found");
        }
        return updated;
    }
}

module.exports = UpdateRecipeType;
