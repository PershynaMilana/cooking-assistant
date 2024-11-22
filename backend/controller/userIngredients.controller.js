const db = require("../db");

class UserIngredientsController {

  //? Отримання інгредієнтів користувача
  async getUserIngredients(req, res) {
    const userId = req.query.userId || 1;

    try {
      const ingredients = await db.query(
          `SELECT
             pi.ingredient_id,
             i.name AS ingredient_name,
             pi.quantity_person_ingradient,
             um.unit_name
           FROM person_ingredients pi
                  JOIN ingredients i ON pi.ingredient_id = i.id
                  JOIN unit_measurement um ON i.id_unit_measurement = um.id
           WHERE pi.person_id = $1`,
          [userId]
      );
      res.json(ingredients.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Оновлення інгредієнтів користувача
  async updateUserIngredients(req, res) {
    const userId = req.query.userId || 1;
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Некоректний формат даних" });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
          `DELETE FROM person_ingredients WHERE person_id = $1`,
          [userId]
      );

      const values = ingredients
          .map((_, index) => `($1, $${index + 2})`)
          .join(",");
      await client.query(
          `INSERT INTO person_ingredients (person_id, ingredient_id) VALUES ${values}`,
          [userId, ...ingredients]
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

  //? Видалення інгредієнта користувача
  async deleteUserIngredient(req, res) {
    const userId = req.params.userId;
    const ingredientId = req.params.ingredientId;

    try {
      const result = await db.query(
          `DELETE FROM person_ingredients WHERE person_id = $1 AND ingredient_id = $2`,
          [userId, ingredientId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Інгредієнт не знайдений для цього користувача" });
      }

      res.json({ message: "Інгредієнт успішно видалено" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new UserIngredientsController();

