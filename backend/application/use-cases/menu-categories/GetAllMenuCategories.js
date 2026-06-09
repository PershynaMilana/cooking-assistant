class GetAllMenuCategories {
    constructor(menuCategoryRepository) {
        this.menuCategoryRepository = menuCategoryRepository;
    }

    async execute() {
        return this.menuCategoryRepository.findAll();
    }
}

module.exports = GetAllMenuCategories;
