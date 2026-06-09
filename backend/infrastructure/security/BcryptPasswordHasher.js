const bcrypt = require("bcrypt");
const PasswordHasher = require("../../application/ports/PasswordHasher");

class BcryptPasswordHasher extends PasswordHasher {
    async hash(plain) {
        return bcrypt.hash(plain, 10);
    }

    async compare(plain, hash) {
        return bcrypt.compare(plain, hash);
    }
}

module.exports = BcryptPasswordHasher;
