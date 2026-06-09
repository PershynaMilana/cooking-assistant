const {
    NotFoundError,
    ValidationError,
} = require("../../../domain/errors/AppError");

class GetMenuById {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(id) {
        if (!id) {
            throw new ValidationError("Menu ID is required");
        }

        const menu = await this.menuRepository.findByIdWithRecipes(id);
        if (!menu) {
            throw new NotFoundError("Menu not found");
        }
        return menu;
    }
}

module.exports = GetMenuById;
