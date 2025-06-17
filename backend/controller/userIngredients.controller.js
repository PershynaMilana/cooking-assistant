const db = require("../db");

class UserIngredientsController {
  //? Get user ingredients
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
         pi.purchase_date -- Add purchase_date field
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

  //? Update user ingredients
  async updateUserIngredients(req, res) {
    const userId = req.query.userId || 1;
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Incorrect data format" });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      for (const ingredient of ingredients) {
        // Add or update ingredients in person_ingredients
        await client.query(
          `INSERT INTO person_ingredients (person_id, ingredient_id, quantity_person_ingradient, purchase_date)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (person_id, ingredient_id) 
           DO UPDATE SET quantity_person_ingradient = person_ingredients.quantity_person_ingradient + $3, 
                         purchase_date = NOW()`,
          [userId, ingredient.id, ingredient.quantity_person_ingradient]
        );

        // Save history in ingredient_purchases
        await client.query(
          `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
          [userId, ingredient.id, ingredient.quantity_person_ingradient]
        );
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Ingredients updated successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  //? Delete user ingredient
  async deleteUserIngredient(req, res) {
    const userId = req.params.userId;
    const ingredientId = req.params.ingredientId;

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // Delete records from purchase history
      await client.query(
        `DELETE FROM ingredient_purchases WHERE person_id = $1 AND ingredient_id = $2`,
        [userId, ingredientId]
      );

      // Delete the ingredient itself
      const result = await client.query(
        `DELETE FROM person_ingredients WHERE person_id = $1 AND ingredient_id = $2`,
        [userId, ingredientId]
      );

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ message: "Ingredient not found for this user" });
      }

      await client.query("COMMIT");
      res.json({ message: "Ingredient and its history successfully deleted" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  //? Update ingredient quantities
  async updateIngredientQuantities(req, res) {
    const userId = req.params.userId;
    const { updatedIngredients } = req.body;

    if (!Array.isArray(updatedIngredients)) {
      return res.status(400).json({ error: "Incorrect data format" });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      for (const ingredient of updatedIngredients) {
        // Get current quantity
        const { rows } = await client.query(
          `SELECT quantity_person_ingradient
             FROM person_ingredients
             WHERE person_id = $1 AND ingredient_id = $2`,
          [userId, ingredient.id]
        );

        const currentQuantity = rows[0]?.quantity_person_ingradient || 0;
        const addedQuantity =
          ingredient.quantity_person_ingradient - currentQuantity;

        if (addedQuantity > 0) {
          // Update total quantity
          await client.query(
            `UPDATE person_ingredients
           SET quantity_person_ingradient = $1, purchase_date = NOW()
           WHERE person_id = $2 AND ingredient_id = $3`,
            [ingredient.quantity_person_ingradient, userId, ingredient.id]
          );

          // Save only added quantity to purchase history
          await client.query(
            `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
            [userId, ingredient.id, addedQuantity]
          );
        }
      }

      await client.query("COMMIT");
      res.json({
        message: "Ingredient quantities and purchase history updated",
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
      return res.status(400).json({ error: "Quantity cannot be empty." });
    }

    try {
      // Check that the purchase exists and belongs to the user
      const purchase = await db.query(
        `SELECT * FROM ingredient_purchases WHERE id = $1 AND person_id = $2`,
        [purchaseId, userId]
      );

      if (purchase.rows.length === 0) {
        return res.status(404).json({ error: "Purchase not found." });
      }

      // Update quantity
      await db.query(
        `UPDATE ingredient_purchases SET quantity = $1 WHERE id = $2`,
        [quantity, purchaseId]
      );

      // Recalculate total ingredient quantity
      const ingredientId = purchase.rows[0].ingredient_id;
      const totalQuantityResult = await db.query(
        `SELECT SUM(quantity) AS total_quantity FROM ingredient_purchases WHERE ingredient_id = $1`,
        [ingredientId]
      );

      const totalQuantity = totalQuantityResult.rows[0].total_quantity || 0;

      // Update total quantity in person_ingredients table
      await db.query(
        `UPDATE person_ingredients
           SET quantity_person_ingradient = $1
           WHERE person_id = $2 AND ingredient_id = $3`,
        [totalQuantity, userId, ingredientId]
      );

      res
        .status(200)
        .json({ message: "Purchase quantity updated successfully." });
    } catch (error) {
      console.error("Error updating purchase quantity:", error);
      res.status(500).json({ error: "Server error." });
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

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserIngredientsController();
