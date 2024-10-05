const db = require("../db");

class RecipeController {
  async createRecipe(req, res) {
    const { title, content, person_id, ingredients } = req.body;

    try {
      const newRecipe = await db.query(
          `INSERT INTO recipes (title, content, person_id) VALUES ($1, $2, $3) RETURNING *`,
          [title, content, person_id]
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
          `SELECT r.*, array_agg(i.name) AS ingredients
         FROM recipes r
         LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
         LEFT JOIN ingredients i ON ri.ingredient_id = i.id
         GROUP BY r.id`
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
          `SELECT r.*, array_agg(i.name) AS ingredients
         FROM recipes r
         LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
         LEFT JOIN ingredients i ON ri.ingredient_id = i.id
         WHERE r.id = $1
         GROUP BY r.id`,
          [recipeId]
      );

      if (recipe.rows.length === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.json(recipe.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecipesByIngredient(req, res) {
    const { ingredient_id } = req.query;

    try {
      const recipes = await db.query(
          `SELECT recipes.id, recipes.title, recipes.content,
                json_agg(json_build_object('id', ingredients.id, 'name', ingredients.name)) AS ingredients
          FROM recipes
          LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
          LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
          WHERE recipes.id IN (
              SELECT recipe_id FROM recipe_ingredients WHERE ingredient_id = $1
          )
          GROUP BY recipes.id;`,
          [ingredient_id]
      );

      res.json(recipes.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecipesByIngredientName(req, res) {
    const { ingredient_name } = req.query; // Получаем название ингредиента из параметров запроса

    try {
      const recipes = await db.query(
          `SELECT recipes.id, recipes.title, recipes.content,
              json_agg(json_build_object('id', ingredients.id, 'name', ingredients.name)) AS ingredients
        FROM recipes
        LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
        LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
        WHERE ingredients.name ILIKE $1
        GROUP BY recipes.id;`,
          [`%${ingredient_name}%`] // Используем ILIKE для поиска по названию
      );

      res.json(recipes.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRecipe(req, res) {
    const recipeId = req.params.id;
    const { title, content, ingredients } = req.body;

    try {
      const result = await db.query(
          `UPDATE recipes SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
          [title, content, recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Обновление ингредиентов
      await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [recipeId]);

      for (let ingredientId of ingredients) {
        await db.query(
            `INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ($1, $2)`,
            [recipeId, ingredientId]
        );
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRecipe(req, res) {
    const recipeId = req.params.id;

    try {
      await db.query(
          `DELETE FROM recipe_ingredients WHERE recipe_id = $1`,
          [recipeId]
      );

      const result = await db.query(
          `DELETE FROM recipes WHERE id = $1 RETURNING *`,
          [recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.json({ message: "Recipe deleted successfully" });
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


  // get by user

  // async getRecipesByPerson(req, res) {
  //   const { person_id } = req.query;
  //
  //   try {
  //     const recipes = await db.query(
  //       `SELECT recipes.id, recipes.title, recipes.content,
  //               json_agg(json_build_object('id', ingredients.id, 'name', ingredients.name)) AS ingredients
  //        FROM recipes
  //        LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
  //        LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
  //        WHERE recipes.person_id = $1
  //        GROUP BY recipes.id;`,
  //       [person_id]
  //     );
  //
  //     res.json(recipes.rows);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}

module.exports = new RecipeController();
