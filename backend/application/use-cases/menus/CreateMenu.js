const Menu = require("../../../domain/entities/Menu");

class CreateMenu {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(input) {
        const menu = Menu.forCreation(input);
        return this.menuRepository.create(menu, input.recipeIds);
    }
}

module.exports = CreateMenu;
