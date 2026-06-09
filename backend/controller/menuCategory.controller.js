class MenuCategoryController {
    constructor({ getAllMenuCategories }) {
        this.getAllMenuCategoriesUseCase = getAllMenuCategories;
    }

    getAll = async (_req, res) => {
        const categories = await this.getAllMenuCategoriesUseCase.execute();
        res.status(200).json(categories);
    };
}

module.exports = MenuCategoryController;
