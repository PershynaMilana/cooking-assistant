// port: contract every recipe-type repository must implement
class RecipeTypeRepository {
    async findAll() {
        throw new Error("not implemented");
    }

    async findById(_id) {
        throw new Error("not implemented");
    }

    async create(_type) {
        throw new Error("not implemented");
    }

    async update(_id, _type) {
        throw new Error("not implemented");
    }

    async deleteById(_id) {
        throw new Error("not implemented");
    }
}

module.exports = RecipeTypeRepository;
