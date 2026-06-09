const {
    NotFoundError,
    ValidationError,
} = require("../../../domain/errors/AppError");

class DeleteMenu {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(id) {
        if (!id) {
            throw new ValidationError("Menu ID is required");
        }

        const deleted = await this.menuRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Menu not found");
        }
    }
}

module.exports = DeleteMenu;
