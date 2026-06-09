class MenuController {
    constructor({
        getAllMenus,
        createMenu,
        getMenuById,
        updateMenu,
        deleteMenu,
        searchPersonMenus,
    }) {
        this.getAllMenusUseCase = getAllMenus;
        this.createMenuUseCase = createMenu;
        this.getMenuByIdUseCase = getMenuById;
        this.updateMenuUseCase = updateMenu;
        this.deleteMenuUseCase = deleteMenu;
        this.searchPersonMenusUseCase = searchPersonMenus;
    }

    getAll = async (req, res) => {
        const menus = await this.getAllMenusUseCase.execute(req.query);
        res.status(200).json(menus);
    };

    create = async (req, res) => {
        const { menuTitle, menuContent, categoryId, recipeIds } = req.body;
        const personId = req.user.id;
        const menuId = await this.createMenuUseCase.execute({
            menuTitle,
            menuContent,
            categoryId,
            personId,
            recipeIds,
        });

        res.status(201).json({ message: "Menu created successfully", menuId });
    };

    getById = async (req, res) => {
        const menu = await this.getMenuByIdUseCase.execute(req.params.id);
        res.status(200).json(menu);
    };

    update = async (req, res) => {
        const { id } = req.params;
        const { menuTitle, menuContent, categoryId, recipeIds } = req.body;

        await this.updateMenuUseCase.execute(id, {
            menuTitle,
            menuContent,
            categoryId,
            recipeIds,
        });

        res.status(200).json({ message: "Menu updated successfully" });
    };

    remove = async (req, res) => {
        await this.deleteMenuUseCase.execute(req.params.id);
        res.status(200).json({ message: "Menu deleted successfully" });
    };

    searchByPerson = async (req, res) => {
        const id = req.user.id;
        const menus = await this.searchPersonMenusUseCase.execute(
            id,
            req.query,
        );
        res.status(200).json(menus);
    };
}

module.exports = MenuController;
