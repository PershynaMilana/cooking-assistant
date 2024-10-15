const db = require("../db");

class RecipeController {
  async createRecipe(req, res) {
    const { title, content, person_id, ingredients, type_id } = req.body;

    try {
      const newRecipe = await db.query(
        `INSERT INTO recipes (title, content, person_id, type_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, content, person_id, type_id]
      );

      const recipeId = newRecipe.rows[0].id;

      for (let ingredientId of ingredients) {
        await db.query(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ($1, $2)`,
          [recipeId, ingredientId]
        );
      }

      res.json(newRecipe.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllRecipes(req, res) {
    try {
      const recipes = await db.query(
        `SELECT r.*, rt.type_name, array_agg(i.name) AS ingredients
         FROM recipes r
         LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
         LEFT JOIN ingredients i ON ri.ingredient_id = i.id
         LEFT JOIN recipe_types rt ON r.type_id = rt.id
         GROUP BY r.id, rt.type_name`
      );

      res.json(recipes.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecipeWithIngredients(req, res) {
    const recipeId = req.params.id;

    try {
      const recipe = await db.query(
        `SELECT r.*, array_agg(i.name) AS ingredients, rt.type_name
         FROM recipes r
         LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
         LEFT JOIN ingredients i ON ri.ingredient_id = i.id
         LEFT JOIN recipe_types rt ON r.type_id = rt.id
         WHERE r.id = $1
         GROUP BY r.id, rt.type_name`,
        [recipeId]
      );

      if (recipe.rows.length === 0) {
        return res.status(404).json({ error: "Рецепт не найден" });
      }

      res.json(recipe.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchRecipes(req, res) {
    const { ingredient_name, type_ids, start_date, end_date } = req.query;

    try {
      let baseQuery = `
        SELECT r.*, rt.type_name, json_agg(json_build_object('id', i.id, 'name', i.name)) AS ingredients
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
        LEFT JOIN recipe_types rt ON r.type_id = rt.id
        WHERE 1=1
      `;

      const params = [];
      let paramIndex = 1;

      if (ingredient_name) {
        baseQuery += ` AND i.name ILIKE $${paramIndex}`;
        params.push(`%${ingredient_name}%`);
        paramIndex++;
      }

      if (type_ids) {
        baseQuery += ` AND r.type_id = ANY($${paramIndex}::int[])`;
        params.push(type_ids.split(",").map(Number));
        paramIndex++;
      }

      if (start_date && end_date) {
        baseQuery += ` AND r.creation_date BETWEEN $${paramIndex} AND $${
          paramIndex + 1
        }`;
        params.push(start_date, end_date);
        paramIndex += 2;
      } else if (start_date) {
        baseQuery += ` AND r.creation_date >= $${paramIndex}`;
        params.push(start_date);
        paramIndex++;
      } else if (end_date) {
        baseQuery += ` AND r.creation_date <= $${paramIndex}`;
        params.push(end_date);
        paramIndex++;
      }

      baseQuery += ` GROUP BY r.id, rt.type_name`;

      const recipes = await db.query(baseQuery, params);

      // Вместо возврата ошибки 404, просто вернем пустой массив
      res.json(recipes.rows);
    } catch (error) {
      console.error("Ошибка при поиске рецептов:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateRecipe(req, res) {
    const recipeId = req.params.id;
    const { title, content, ingredients: newIngredients, type_id } = req.body;

    try {
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Название и содержание не могут быть пустыми" });
      }

      const result = await db.query(
        `UPDATE recipes SET title = $1, content = $2, type_id = $3 WHERE id = $4 RETURNING *`,
        [title, content, type_id, recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Рецепт не найден" });
      }

      let ingredients;

      if (!newIngredients || newIngredients.length === 0) {
        const oldIngredients = await db.query(
          `SELECT ingredient_id FROM recipe_ingredients WHERE recipe_id = $1`,
          [recipeId]
        );

        const existingIngredientIds = oldIngredients.rows.map(
          (row) => row.ingredient_id
        );

        if (existingIngredientIds.length === 0) {
          return res
            .status(400)
            .json({ error: "Нельзя оставить рецепт без ингредиентов" });
        }

        ingredients = existingIngredientIds;
      } else {
        ingredients = newIngredients;
      }

      await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
        recipeId,
      ]);

      for (let ingredientId of ingredients) {
        await db.query(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ($1, $2)`,
          [recipeId, ingredientId]
        );
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Ошибка при обновлении рецепта:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRecipe(req, res) {
    const recipeId = req.params.id;

    try {
      await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
        recipeId,
      ]);

      const result = await db.query(
        `DELETE FROM recipes WHERE id = $1 RETURNING *`,
        [recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Рецепт не найден" });
      }

      res.json({ message: "Рецепт успешно удален" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllIngredients(req, res) {
    try {
      const ingredients = await db.query(`SELECT * FROM ingredients`);
      res.json(ingredients.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

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

  async getAllRecipeTypes(req, res) {
    try {
      const recipeTypes = await db.query(`SELECT * FROM recipe_types`);
      res.json(recipeTypes.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRecipeType(req, res) {
    const { id } = req.params;
    const { type_name, description } = req.body;

    try {
      const updatedType = await db.query(
        `UPDATE recipe_types SET type_name = $1, description = $2 WHERE id = $3 RETURNING *`,
        [type_name, description, id]
      );

      if (updatedType.rowCount === 0) {
        return res.status(404).json({ error: "Тип рецепта не найден" });
      }

      res.json(updatedType.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // async getRecipesByType(req, res) {
  //   const { type_id } = req.query;

  //   try {
  //     const recipes = await db.query(
  //       `SELECT r.*, rt.type_name, array_agg(i.name) AS ingredients
  //        FROM recipes r
  //        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
  //        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
  //        LEFT JOIN recipe_types rt ON r.type_id = rt.id
  //        WHERE r.type_id = $1
  //        GROUP BY r.id, rt.type_name`,
  //       [type_id]
  //     );

  //     if (recipes.rows.length === 0) {
  //       return res.status(404).json({ error: "Рецепты не найдены" });
  //     }

  //     res.json(recipes.rows);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}

module.exports = new RecipeController();
