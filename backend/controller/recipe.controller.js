const db = require("../db");

class RecipeController {
  //? Створення рецепта
  async createRecipe(req, res) {
    const { title, content, person_id, ingredients, type_id, cooking_time } =
      req.body;

    try {
      const newRecipe = await db.query(
        `INSERT INTO recipes (title, content, person_id, type_id, cooking_time) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, content, person_id, type_id, cooking_time]
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

  //? Отримання всіх рецептів
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

  //? Отримання рецепта за ID
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
        return res.status(404).json({ error: "Рецепт не знайдено" });
      }

      res.json(recipe.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Оновлення рецепта за ID
  async updateRecipe(req, res) {
    const recipeId = req.params.id;
    const {
      title,
      content,
      ingredients: newIngredients,
      type_id,
      cooking_time,
    } = req.body;

    try {
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Назва та зміст не можуть бути пустими" });
      }

      const result = await db.query(
        `UPDATE recipes SET title = $1, content = $2, type_id = $3, cooking_time = $4 WHERE id = $5 RETURNING *`,
        [title, content, type_id, cooking_time, recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Рецепт не знайдено" });
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
            .json({ error: "Неможливо залишити рецепт без інгредієнтів" });
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
      res.status(500).json({ error: error.message });
    }
  }

  //? Фільтрація рецептів за інгредієнтами, типами та датами
  async searchRecipes(req, res) {
    const { ingredient_name, type_ids, start_date, end_date, sort_order } =
      req.query;

    try {
      let baseQuery = `
        SELECT r.id, r.title, r.content, r.person_id, r.type_id, r.creation_date, r.cooking_time, 
               rt.type_name, json_agg(json_build_object('id', i.id, 'name', i.name)) AS ingredients
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

      baseQuery += ` GROUP BY r.id, rt.type_name`; // Додаємо r.id в GROUP BY

      if (sort_order) {
        baseQuery += ` ORDER BY r.cooking_time ${
          sort_order === "asc" ? "ASC" : "DESC"
        }`;
      }

      const recipes = await db.query(baseQuery, params);
      res.json(recipes.rows);
    } catch (error) {
      console.error("Помилка при пошуку рецептів:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Видалення рецепта за ID
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
        return res.status(404).json({ error: "Рецепт не знайдено" });
      }

      res.json({ message: "Рецепт успішно видалено" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Отримання всіх інгредієнтів
  async getAllIngredients(req, res) {
    try {
      const ingredients = await db.query(`SELECT * FROM ingredients`);
      res.json(ingredients.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Створення нового типу рецепта
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

  //? Отримання всіх типів рецептів
  async getAllRecipeTypes(req, res) {
    try {
      const recipeTypes = await db.query(`SELECT * FROM recipe_types`);
      res.json(recipeTypes.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Оновлення типу рецепта
  async updateRecipeType(req, res) {
    const { id } = req.params;
    const { type_name, description } = req.body;

    try {
      const updatedType = await db.query(
        `UPDATE recipe_types SET type_name = $1, description = $2 WHERE id = $3 RETURNING *`,
        [type_name, description, id]
      );

      if (updatedType.rowCount === 0) {
        return res.status(404).json({ error: "Тип рецепта не знайдено" });
      }

      res.json(updatedType.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //? Видалення типу рецепта
  async deleteRecipeType(req, res) {
    const { id } = req.params;

    try {
      const result = await db.query(
        `DELETE FROM recipe_types WHERE id = $1 RETURNING *`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Тип рецепта не знайдено" });
      }

      res.json({ message: "Тип рецепта успішно видалено" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecipeController();
