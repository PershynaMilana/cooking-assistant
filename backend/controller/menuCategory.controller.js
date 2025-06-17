const db = require("../db");

class MenuCategoryController {
  //? Get all menu categories
  async getAllMenuCategories(req, res) {
    try {
      const query = "SELECT * FROM menu_category ORDER BY category_name";
      const result = await db.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getting menu categories:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  //? Get menu categories by ID
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
          .json({ message: "Menu not found for this category" });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getting menu by category:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  //? Get menus by category
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
            .json({ message: "Invalid category_id format" });
        }

        query += " WHERE category_id = $1";
        values.push(categoryId);
      }

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Menu not found for specified category" });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getting menu by category:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new MenuCategoryController();
