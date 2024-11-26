const db = require("../db");

class MenuCategoryController {
  //? Отримання всіх категорій меню
  async getAllMenuCategories(req, res) {
    try {
      const query = "SELECT * FROM menu_category ORDER BY category_name";
      const result = await db.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении категорий меню:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  //? Отримання категорій меню за ID
  async getMenusByCategories(req, res) {
    const { category_id } = req.query;
    try {
      let query = "SELECT * FROM menu";
      const values = [];

      if (category_id) {
        query += " WHERE menu_category_id = $1";
        values.push(parseInt(category_id, 10));
      }

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Меню не найдено для данной категории" });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении меню по категории:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  //? Отримання меню за категорією
  async getMenusByCategories(req, res) {
    const { category_id } = req.query;

    try {
      let query = "SELECT * FROM menu";
      const values = [];

      if (category_id) {
        const categoryId = parseInt(category_id, 10);
        if (isNaN(categoryId)) {
          return res
            .status(400)
            .json({ message: "Неверный формат category_id" });
        }

        query += " WHERE category_id = $1";
        values.push(categoryId);
      }

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Меню не найдено для указанной категории" });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении меню по категории:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

module.exports = new MenuCategoryController();
