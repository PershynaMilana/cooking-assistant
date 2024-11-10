const Router = require("express");
const router = new Router();
const userController = require('../controller/user.controller');
const authenticateToken = require("../middleware/jwtMiddleware");

//? registration
router.post("/register", userController.registerUser);

//? login
router.post("/login", userController.loginUser);

//? get users
router.get("/user", authenticateToken, userController.getUsers);

module.exports = router;
