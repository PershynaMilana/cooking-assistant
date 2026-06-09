// port: contract every password hasher must implement
class PasswordHasher {
    async hash(_plain) {
        throw new Error("not implemented");
    }

    async compare(_plain, _hash) {
        throw new Error("not implemented");
    }
}

module.exports = PasswordHasher;
