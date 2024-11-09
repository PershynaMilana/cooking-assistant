const db = require("../db");

class IngredientsController {
  async getSelectedIngredients(req, res) {
    try {
      const ingredients = await db.query(
        `SELECT ingredient_id FROM selected_ingredients`
      );
      res.json(ingredients.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSelectedIngredients(req, res) {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Некоректний формат даних" });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM selected_ingredients`);

      const values = ingredients.map((_, index) => `($${index + 1})`).join(",");
      await client.query(
        `INSERT INTO selected_ingredients (ingredient_id) VALUES ${values}`,
        ingredients
      );

      await client.query("COMMIT");
      res.json({ message: "Інгредієнти оновлено" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  async deleteSelectedIngredient(req, res) {
    const { id } = req.params;
    try {
      await db.query(
        "DELETE FROM selected_ingredients WHERE ingredient_id = $1",
        [id]
      );
      res.json({ message: "Інгредієнт видалено з вибраних" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new IngredientsController();
