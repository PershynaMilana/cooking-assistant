const db = require("../db");

class TypeController {
  //? Create new recipe type
  async createRecipeType(req, res) {
    const { type_name, description } = req.body;

    try {
      const newType = await db.query(
        `INSERT INTO recipe_types (type_name, description) VALUES ($1, $2) RETURNING *`,
        [type_name, description]
      );
      res.json(newType.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Get all recipe types
  async getAllRecipeTypes(req, res) {
    try {
      const recipeTypes = await db.query(`SELECT * FROM recipe_types`);
      res.json(recipeTypes.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Update recipe type
  async updateRecipeType(req, res) {
    const { id } = req.params;
    const { type_name, description } = req.body;

    try {
      const updatedType = await db.query(
        `UPDATE recipe_types SET type_name = $1, description = $2 WHERE id = $3 RETURNING *`,
        [type_name, description, id]
      );

      if (updatedType.rowCount === 0) {
        return res.status(404).json({ error: "Recipe type not found" });
      }

      res.json(updatedType.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Delete recipe type
  async deleteRecipeType(req, res) {
    const { id } = req.params;

    try {
      await db.query(
        "DELETE FROM recipe_ingredients WHERE recipe_id IN (SELECT id FROM recipes WHERE type_id = $1)",
        [id]
      );
      await db.query("DELETE FROM recipes WHERE type_id = $1", [id]);

      const result = await db.query(
        "DELETE FROM recipe_types WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Recipe type not found" });
      }

      res.json({
        message: "Recipe type and all related recipes successfully deleted",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Get recipe type by ID
  async getRecipeTypeById(req, res) {
    const typeId = req.params.id;

    try {
      const recipeType = await db.query(
        `SELECT * FROM recipe_types WHERE id = $1`,
        [typeId]
      );

      if (recipeType.rows.length === 0) {
        return res.status(404).json({ error: "Recipe type not found" });
      }

      res.json(recipeType.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TypeController();
