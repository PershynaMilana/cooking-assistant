const { NotFoundError } = require("../../../domain/errors/AppError");

class GetRecipeTypeById {
    constructor(recipeTypeRepository) {
        this.recipeTypeRepository = recipeTypeRepository;
    }

    async execute(id) {
        const type = await this.recipeTypeRepository.findById(id);
        if (!type) {
            throw new NotFoundError("Recipe type not found");
        }
        return type;
    }
}

module.exports = GetRecipeTypeById;
