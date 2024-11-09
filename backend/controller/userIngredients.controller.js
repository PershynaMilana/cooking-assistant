// // userIngredients.controller.js
// const db = require("../db");

// class UserIngredientsController {
//   async getUserIngredients(req, res) {
//     //? const userId = req.user.id; // Залежить від реалізації авторизації
//     const userId = 1;
//     try {
//       const ingredients = await db.query(
//         `SELECT ingredient_id FROM person_ingredients WHERE person_id = $1`,
//         [userId]
//       );
//       res.json(ingredients.rows);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async updateUserIngredients(req, res) {
//     const userId = 1; // або req.user.id, якщо буде аутентифікація
//     const { ingredients } = req.body;
//     try {
//       await db.query(`DELETE FROM person_ingredients WHERE person_id = $1`, [
//         userId,
//       ]);

//       // Перетворення масиву ingredients в набір значень для вставки
//       const values = ingredients
//         .map((id, index) => `($1, $${index + 2})`)
//         .join(",");
//       await db.query(
//         `INSERT INTO person_ingredients (person_id, ingredient_id) VALUES ${values}`,
//         [userId, ...ingredients]
//       );

//       res.json({ message: "Інгредієнти оновлено" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = new UserIngredientsController();
// userIngredients.controller.js
const db = require("../db");

class UserIngredientsController {
  async getUserIngredients(req, res) {
    const userId = 1; // req.user.id буде додано при реалізації аутентифікації
    try {
      const ingredients = await db.query(
        `SELECT ingredient_id FROM person_ingredients WHERE person_id = $1`,
        [userId]
      );
      res.json(ingredients.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserIngredients(req, res) {
    const userId = 1; // замініть на req.user.id після додавання аутентифікації
    const { ingredients } = req.body;

    // Перевірка, чи є ingredients масивом
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Некоректний формат даних" });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN"); // Початок транзакції

      // Видалення всіх існуючих інгредієнтів користувача
      await client.query(
        `DELETE FROM person_ingredients WHERE person_id = $1`,
        [userId]
      );

      // Вставка нових інгредієнтів користувача
      const values = ingredients
        .map((_, index) => `($1, $${index + 2})`)
        .join(",");
      await client.query(
        `INSERT INTO person_ingredients (person_id, ingredient_id) VALUES ${values}`,
        [userId, ...ingredients]
      );

      await client.query("COMMIT"); // Завершення транзакції
      res.json({ message: "Інгредієнти оновлено" });
    } catch (error) {
      await client.query("ROLLBACK"); // Відкат транзакції у разі помилки
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }
}

module.exports = new UserIngredientsController();
//TODO: finish this later, using userID
