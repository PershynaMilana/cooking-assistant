require('dotenv').config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {

    // get token from header - authorization
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY,(err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is invalid or expired" });
        }

        // get user data from token
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
