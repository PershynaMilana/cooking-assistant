// port: contract every recipe repository must implement
class RecipeRepository {
    async create(_recipe) {
        throw new Error("not implemented");
    }

    async findAllWithIngredients() {
        throw new Error("not implemented");
    }

    async findByIdWithIngredients(_id) {
        throw new Error("not implemented");
    }

    async update(_id, _data) {
        throw new Error("not implemented");
    }

    async deleteById(_id) {
        throw new Error("not implemented");
    }

    async search(_filters) {
        throw new Error("not implemented");
    }

    async searchByPerson(_personId, _filters) {
        throw new Error("not implemented");
    }

    async getStats() {
        throw new Error("not implemented");
    }

    async findAllIngredients() {
        throw new Error("not implemented");
    }
}

module.exports = RecipeRepository;
