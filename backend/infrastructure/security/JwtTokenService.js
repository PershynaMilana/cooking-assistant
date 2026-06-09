const jwt = require("jsonwebtoken");
const TokenService = require("../../application/ports/TokenService");

class JwtTokenService extends TokenService {
    generate(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h",
        });
    }
}

module.exports = JwtTokenService;
