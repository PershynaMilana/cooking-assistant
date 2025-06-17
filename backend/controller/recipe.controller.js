const db = require("../db");

class RecipeController {
  //? Create recipe
  // async createRecipe(req, res) {
  //   const {
  //     title,
  //     content,
  //     person_id,
  //     ingredients,
  //     type_id,
  //     cooking_time,
  //     servings,
  //   } = req.body;

  //   try {
  //     // Create recipe
  //     const newRecipe = await db.query(
  //       `INSERT INTO recipes (title, content, person_id, type_id, cooking_time, servings)
  //        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
  //       [title, content, person_id, type_id, cooking_time, servings]
  //     );

  //     const recipeId = newRecipe.rows[0].id;

  //     // Add ingredients with quantity
  //     for (let { id, quantity } of ingredients) {
  //       await db.query(
  //         `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
  //            VALUES ($1, $2, $3)`,
  //         [recipeId, id, quantity || 1]
  //       );
  //     }

  //     res.json(newRecipe.rows[0]);
  //   } catch (error) {
  //     console.error("Error creating recipe:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // }
  async createRecipe(req, res) {
    const {
      title,
      content,
      person_id,
      ingredients,
      type_id,
      cooking_time,
      servings,
    } = req.body;

    try {
      // Check for ingredients presence
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Ingredients cannot be empty" });
      }

      // Check that all ingredients have id
      for (let ingredient of ingredients) {
        if (!ingredient.id) {
          return res
            .status(400)
            .json({ error: "All ingredients must have id" });
        }
      }

      // Create recipe
      const newRecipe = await db.query(
        `INSERT INTO recipes (title, content, person_id, type_id, cooking_time, servings)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, content, person_id, type_id, cooking_time, servings]
      );

      const recipeId = newRecipe.rows[0].id;

      // Add ingredients with quantity
      for (let { id, quantity } of ingredients) {
        await db.query(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
             VALUES ($1, $2, $3)`,
          [recipeId, id, quantity || 1]
        );
      }

      res.json(newRecipe.rows[0]);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Get all recipes
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

  //? Get recipe by ID
  async getRecipeWithIngredients(req, res) {
    const recipeId = req.params.id;

    try {
      const recipe = await db.query(
        `SELECT r.*,
                  json_agg(
                      json_build_object(
                          'id', i.id,
                          'name', i.name,
                          'quantity_recipe_ingredients', ri.quantity_recipe_ingredients,
                          'unit_name', um.unit_name
                      )
                  ) AS ingredients,
                  rt.type_name
           FROM recipes r
                  LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                  LEFT JOIN ingredients i ON ri.ingredient_id = i.id
                  LEFT JOIN unit_measurement um ON i.id_unit_measurement = um.id
                  LEFT JOIN recipe_types rt ON r.type_id = rt.id
           WHERE r.id = $1
           GROUP BY r.id, rt.type_name`,
        [recipeId]
      );

      if (recipe.rows.length === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.json(recipe.rows[0]);
    } catch (error) {
      console.error("Error getting recipe:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Update recipe by ID
  // async updateRecipe(req, res) {
  //   const recipeId = req.params.id;
  //   const {
  //     title,
  //     content,
  //     ingredients: newIngredients,
  //     type_id,
  //     cooking_time,
  //     servings,
  //   } = req.body;

  //   try {
  //     if (!title || !content) {
  //       return res
  //         .status(400)
  //         .json({ error: "Title and content cannot be empty" });
  //     }

  //     const result = await db.query(
  //       `UPDATE recipes SET title = $1, content = $2, type_id = $3, cooking_time = $4, servings = $5
  //        WHERE id = $6 RETURNING *`,
  //       [title, content, type_id, cooking_time, servings, recipeId]
  //     );

  //     if (result.rowCount === 0) {
  //       return res.status(404).json({ error: "Recipe not found" });
  //     }

  //     // Delete old ingredients
  //     await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
  //       recipeId,
  //     ]);

  //     // Add new ingredients with quantity
  //     for (let { id, quantity_recipe_ingredients } of newIngredients) {
  //       await db.query(
  //         `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
  //            VALUES ($1, $2, $3)`,
  //         [recipeId, id, quantity_recipe_ingredients || 1]
  //       );
  //     }

  //     res.json(result.rows[0]);
  //   } catch (error) {
  //     console.error("Error updating recipe:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // }
  async updateRecipe(req, res) {
    const recipeId = req.params.id;
    const {
      title,
      content,
      ingredients: newIngredients,
      type_id,
      cooking_time,
      servings,
    } = req.body;

    try {
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content cannot be empty" });
      }

      // Check for ingredients presence
      if (!Array.isArray(newIngredients) || newIngredients.length === 0) {
        return res.status(400).json({ error: "Ingredients cannot be empty" });
      }

      // Check that all ingredients have id
      for (let ingredient of newIngredients) {
        if (!ingredient.id) {
          return res
            .status(400)
            .json({ error: "All ingredients must have id" });
        }
      }

      const result = await db.query(
        `UPDATE recipes SET title = $1, content = $2, type_id = $3, cooking_time = $4, servings = $5
         WHERE id = $6 RETURNING *`,
        [title, content, type_id, cooking_time, servings, recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Delete old ingredients
      await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
        recipeId,
      ]);

      // Add new ingredients with quantity
      for (let { id, quantity_recipe_ingredients } of newIngredients) {
        await db.query(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
             VALUES ($1, $2, $3)`,
          [recipeId, id, quantity_recipe_ingredients || 1]
        );
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ error: error.message });
    }
  }
  //? Filter recipes by ingredients, types, dates and cooking time
  async searchRecipes(req, res) {
    const {
      ingredient_name,
      type_ids,
      start_date,
      end_date,
      min_cooking_time,
      max_cooking_time,
      sort_order,
    } = req.query;

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

      // Add minimum cooking time filter
      if (min_cooking_time) {
        baseQuery += ` AND r.cooking_time >= $${paramIndex}`;
        params.push(Number(min_cooking_time));
        paramIndex++;
      }

      // Add maximum cooking time filter
      if (max_cooking_time) {
        baseQuery += ` AND r.cooking_time <= $${paramIndex}`;
        params.push(Number(max_cooking_time));
        paramIndex++;
      }

      baseQuery += ` GROUP BY r.id, rt.type_name`;

      if (sort_order) {
        baseQuery += ` ORDER BY r.cooking_time ${
          sort_order === "asc" ? "ASC" : "DESC"
        }`;
      }

      const recipes = await db.query(baseQuery, params);
      res.json(recipes.rows);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Filter recipes by ingredients, types, dates, cooking time and person_id
  async searchPersonRecipes(req, res) {
    const {
      ingredient_name,
      type_ids,
      start_date,
      end_date,
      min_cooking_time,
      max_cooking_time,
      sort_order,
    } = req.query;

    const { id: person_id } = req.params;

    try {
      let baseQuery = `
        SELECT r.id, r.title, r.content, r.person_id, r.type_id, r.creation_date, r.cooking_time,
               rt.type_name, json_agg(json_build_object('id', i.id, 'name', i.name)) AS ingredients
        FROM recipes r
               LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
               LEFT JOIN ingredients i ON ri.ingredient_id = i.id
               LEFT JOIN recipe_types rt ON r.type_id = rt.id
        WHERE r.person_id = $1
      `;

      const params = [person_id];
      let paramIndex = 2;

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

      if (min_cooking_time) {
        baseQuery += ` AND r.cooking_time >= $${paramIndex}`;
        params.push(Number(min_cooking_time));
        paramIndex++;
      }

      if (max_cooking_time) {
        baseQuery += ` AND r.cooking_time <= $${paramIndex}`;
        params.push(Number(max_cooking_time));
        paramIndex++;
      }

      baseQuery += ` GROUP BY r.id, rt.type_name`;

      if (sort_order) {
        baseQuery += ` ORDER BY r.cooking_time ${
          sort_order === "asc" ? "ASC" : "DESC"
        }`;
      }

      const recipes = await db.query(baseQuery, params);

      res.json(recipes.rows);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Delete recipe by ID
  // async deleteRecipe(req, res) {
  //   const recipeId = req.params.id;

  //   try {
  //     await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
  //       recipeId,
  //     ]);

  //     const result = await db.query(
  //       `DELETE FROM recipes WHERE id = $1 RETURNING *`,
  //       [recipeId]
  //     );

  //     if (result.rowCount === 0) {
  //       return res.status(404).json({ error: "Recipe not found" });
  //     }

  //     res.json({ message: "Recipe successfully deleted" });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
  async deleteRecipe(req, res) {
    const recipeId = req.params.id;

    try {
      // Delete all menu relations
      await db.query(`DELETE FROM menu_recipe WHERE recipe_id = $1`, [
        recipeId,
      ]);

      // Delete all ingredients related to the recipe
      await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [
        recipeId,
      ]);

      // Delete the recipe itself
      const result = await db.query(
        `DELETE FROM recipes WHERE id = $1 RETURNING *`,
        [recipeId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.json({ message: "Recipe successfully deleted" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Get all ingredients
  async getAllIngredients(req, res) {
    try {
      const ingredients = await db.query(
        `SELECT i.*, um.unit_name
           FROM ingredients i
                  LEFT JOIN unit_measurement um ON i.id_unit_measurement = um.id`
      );
      res.json(ingredients.rows);
    } catch (error) {
      console.error("Error getting ingredients:", error);
      res.status(500).json({ error: error.message });
    }
  }

  //? Get fastest and slowest recipe, as well as statistics by types
  async getRecipesStats(req, res) {
    try {
      const { rows: fastestRecipe } = await db.query(
        `SELECT r.*, rt.type_name as "typeName"
           FROM recipes r
                  JOIN recipe_types rt ON r.type_id = rt.id
           --ORDER BY r.cooking_time ASC LIMIT 1
           WHERE r.cooking_time = (
             SELECT MIN(cooking_time)
             FROM recipes
           )`
      );

      const { rows: slowestRecipe } = await db.query(
        `SELECT r.*, rt.type_name as "typeName"
           FROM recipes r
                  JOIN recipe_types rt ON r.type_id = rt.id
           --ORDER BY r.cooking_time DESC LIMIT 1
           WHERE r.cooking_time = (
             SELECT MAX(cooking_time)
             FROM recipes
           )`
      );

      const { rows: typeStats } = await db.query(
        `SELECT rt.type_name as "typeName", COUNT(*) as count
           FROM recipes r
             JOIN recipe_types rt ON r.type_id = rt.id
           GROUP BY rt.type_name`
      );

      const { rows: recipesWithMostIngredients } = await db.query(
        `SELECT r.*, COUNT(ri.ingredient_id) as ingredient_count
           FROM recipes r
                  JOIN recipe_ingredients ri ON r.id = ri.recipe_id
           GROUP BY r.id
           HAVING COUNT(ri.ingredient_id) = (
             SELECT MAX(ingredient_count)
             FROM (
                    SELECT COUNT(ri.ingredient_id) as ingredient_count
                    FROM recipes r
                           JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                    GROUP BY r.id
                  ) subquery
           )`
      );

      const { rows: recipesWithLeastIngredients } = await db.query(
        `SELECT r.*, COUNT(ri.ingredient_id) as ingredient_count
           FROM recipes r
                  JOIN recipe_ingredients ri ON r.id = ri.recipe_id
           GROUP BY r.id
           HAVING COUNT(ri.ingredient_id) = (
             SELECT MIN(ingredient_count)
             FROM (
                    SELECT COUNT(ri.ingredient_id) as ingredient_count
                    FROM recipes r
                           JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                    GROUP BY r.id
                  ) subquery
           )`
      );

      const { rows: averageCookingTimes } = await db.query(
        `SELECT rt.type_name as "typeName", 
              AVG(r.cooking_time) as "averageCookingTime"
         FROM recipes r
         JOIN recipe_types rt ON r.type_id = rt.id
         GROUP BY rt.type_name`
      );

      res.json({
        fastestRecipe,
        slowestRecipe,
        typeStats,
        recipesWithMostIngredients,
        recipesWithLeastIngredients,
        averageCookingTimes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecipeController();
