// port: contract every user repository must implement
class UserRepository {
    async findByLogin(_login) {
        throw new Error("not implemented");
    }

    async create(_user) {
        throw new Error("not implemented");
    }

    async findAll() {
        throw new Error("not implemented");
    }
}

module.exports = UserRepository;
