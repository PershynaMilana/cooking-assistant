// port: contract every token service must implement
class TokenService {
    generate(_id) {
        throw new Error("not implemented");
    }
}

module.exports = TokenService;
