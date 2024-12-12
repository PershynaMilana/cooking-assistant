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
         um.unit_name,
         i.allergens,
         i.days_to_expire,
         i.seasonality,
         i.storage_condition,
         pi.purchase_date -- Добавляем поле purchase_date
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

      for (const ingredient of ingredients) {
        // Добавляем или обновляем ингредиенты в person_ingredients
        await client.query(
          `INSERT INTO person_ingredients (person_id, ingredient_id, quantity_person_ingradient, purchase_date)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (person_id, ingredient_id) 
           DO UPDATE SET quantity_person_ingradient = person_ingredients.quantity_person_ingradient + $3, 
                         purchase_date = NOW()`,
          [userId, ingredient.id, ingredient.quantity_person_ingradient]
        );

        // Сохраняем историю в ingredient_purchases
        await client.query(
          `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
          [userId, ingredient.id, ingredient.quantity_person_ingradient]
        );
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Інгредієнти оновлено успішно" });
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

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // Удаляем записи из истории покупок
      await client.query(
        `DELETE FROM ingredient_purchases WHERE person_id = $1 AND ingredient_id = $2`,
        [userId, ingredientId]
      );

      // Удаляем сам ингредиент
      const result = await client.query(
        `DELETE FROM person_ingredients WHERE person_id = $1 AND ingredient_id = $2`,
        [userId, ingredientId]
      );

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ message: "Інгредієнт не знайдений для цього користувача" });
      }

      await client.query("COMMIT");
      res.json({ message: "Інгредієнт та його історія успішно видалені" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  //? Оновлення кількості інгредієнтів
  async updateIngredientQuantities(req, res) {
    const userId = req.params.userId;
    const { updatedIngredients } = req.body;

    if (!Array.isArray(updatedIngredients)) {
      return res.status(400).json({ error: "Некорректный формат данных" });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      for (const ingredient of updatedIngredients) {
        // Получаем текущее количество
        const { rows } = await client.query(
            `SELECT quantity_person_ingradient
             FROM person_ingredients
             WHERE person_id = $1 AND ingredient_id = $2`,
            [userId, ingredient.id]
        );

        const currentQuantity = rows[0]?.quantity_person_ingradient || 0;
        const addedQuantity = ingredient.quantity_person_ingradient - currentQuantity;

        if (addedQuantity > 0) {
          // Обновляем общее количество
          await client.query(
              `UPDATE person_ingredients
           SET quantity_person_ingradient = $1, purchase_date = NOW()
           WHERE person_id = $2 AND ingredient_id = $3`,
              [ingredient.quantity_person_ingradient, userId, ingredient.id]
          );

          // Сохраняем только добавленное количество в историю покупок
          await client.query(
              `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
              [userId, ingredient.id, addedQuantity]
          );
        }
      }

      await client.query("COMMIT");
      res.json({
        message: "Количество ингредиентов и история покупок обновлены",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }


  async updatePurchaseQuantity(req, res) {
    const { userId, purchaseId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: "Кількість не може бути порожньою." });
    }

    try {
      // Проверяем, что покупка существует и принадлежит пользователю
      const purchase = await db.query(
          `SELECT * FROM ingredient_purchases WHERE id = $1 AND person_id = $2`,
          [purchaseId, userId]
      );

      if (purchase.rows.length === 0) {
        return res.status(404).json({ error: "Покупка не знайдена." });
      }

      // Обновляем количество
      await db.query(
          `UPDATE ingredient_purchases SET quantity = $1 WHERE id = $2`,
          [quantity, purchaseId]
      );

      // Пересчитываем общее количество ингредиента
      const ingredientId = purchase.rows[0].ingredient_id;
      const totalQuantityResult = await db.query(
          `SELECT SUM(quantity) AS total_quantity FROM ingredient_purchases WHERE ingredient_id = $1`,
          [ingredientId]
      );

      const totalQuantity = totalQuantityResult.rows[0].total_quantity || 0;

      // Обновляем общее количество в таблице person_ingredients
      await db.query(
          `UPDATE person_ingredients
           SET quantity_person_ingradient = $1
           WHERE person_id = $2 AND ingredient_id = $3`,
          [totalQuantity, userId, ingredientId]
      );

      res.status(200).json({ message: "Кількість покупки оновлена успішно." });
    } catch (error) {
      console.error("Помилка при оновленні кількості покупки:", error);
      res.status(500).json({ error: "Помилка сервера." });
    }
  }



    async getPurchaseHistory(req, res) {
        const userId = req.params.userId;
        const ingredientId = req.params.ingredientId;

        try {
            const result = await db.query(
                `SELECT
                     ip.id,
                     ip.quantity,
                     ip.purchase_date,
                     um.unit_name,
                     i.days_to_expire
                 FROM ingredient_purchases ip
                          JOIN ingredients i ON ip.ingredient_id = i.id
                          JOIN unit_measurement um ON i.id_unit_measurement = um.id
                 WHERE ip.person_id = $1 AND ip.ingredient_id = $2
                 ORDER BY ip.purchase_date ASC`,
                [userId, ingredientId]
            );

            console.log(result.rows);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }



}

module.exports = new UserIngredientsController();
