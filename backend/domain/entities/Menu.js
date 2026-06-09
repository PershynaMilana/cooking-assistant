const { ValidationError } = require("../errors/AppError");

class Menu {
    static forCreation({
        menuTitle,
        menuContent,
        categoryId,
        personId,
        recipeIds,
    }) {
        if (!menuTitle || !categoryId || !recipeIds || recipeIds.length === 0) {
            throw new ValidationError("Insufficient data to create menu");
        }

        return new Menu({ menuTitle, menuContent, categoryId, personId });
    }

    static forUpdate(id, { menuTitle, menuContent, categoryId, recipeIds }) {
        if (
            !id ||
            !menuTitle ||
            !categoryId ||
            !recipeIds ||
            recipeIds.length === 0
        ) {
            throw new ValidationError("Insufficient data to update menu");
        }

        return new Menu({ menuTitle, menuContent, categoryId });
    }

    constructor(data) {
        Object.assign(this, data);
    }
}

module.exports = Menu;
