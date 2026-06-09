const Menu = require("../../../domain/entities/Menu");

class UpdateMenu {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(id, input) {
        const menu = Menu.forUpdate(id, input);
        await this.menuRepository.update(id, menu, input.recipeIds);
    }
}

module.exports = UpdateMenu;
