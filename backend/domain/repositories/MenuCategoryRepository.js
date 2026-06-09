// port: contract every menu-category repository must implement
class MenuCategoryRepository {
    async findAll() {
        throw new Error("not implemented");
    }
}

module.exports = MenuCategoryRepository;
