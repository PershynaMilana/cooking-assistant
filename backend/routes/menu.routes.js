const express = require("express");
const { getAllMenus } = require("../controller/menu.controller");

const router = express.Router();

// Роут для отримання всіх меню
router.get("/menu", getAllMenus);

module.exports = router;
