// port: contract every menu repository must implement
class MenuRepository {
    async findAll(_filters) {
        throw new Error("not implemented");
    }

    async create(_menu, _recipeIds) {
        throw new Error("not implemented");
    }

    async findByIdWithRecipes(_id) {
        throw new Error("not implemented");
    }

    async update(_id, _menu, _recipeIds) {
        throw new Error("not implemented");
    }

    async deleteById(_id) {
        throw new Error("not implemented");
    }

    async searchByPerson(_personId, _filters) {
        throw new Error("not implemented");
    }
}

module.exports = MenuRepository;
