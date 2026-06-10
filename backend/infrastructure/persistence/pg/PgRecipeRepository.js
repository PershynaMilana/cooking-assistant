const RecipeRepository = require("../../../domain/repositories/RecipeRepository");

class PgRecipeRepository extends RecipeRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async create({
        title,
        content,
        person_id,
        ingredients,
        type_id,
        cooking_time,
        servings,
    }) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            const newRecipe = await client.query(
                `INSERT INTO recipes (title, content, person_id, type_id, cooking_time, servings)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [title, content, person_id, type_id, cooking_time, servings],
            );

            const recipeId = newRecipe.rows[0].id;

            for (const { id, quantity } of ingredients) {
                await client.query(
                    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
             VALUES ($1, $2, $3)`,
                    [recipeId, id, quantity || 1],
                );
            }

            await client.query("COMMIT");
            return newRecipe.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async findAllWithIngredients() {
        const recipes = await this.pool.query(
            `SELECT r.*, rt.type_name, array_agg(i.name) AS ingredients
         FROM recipes r
                LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                LEFT JOIN ingredients i ON ri.ingredient_id = i.id
                LEFT JOIN recipe_types rt ON r.type_id = rt.id
         GROUP BY r.id, rt.type_name`,
        );

        return recipes.rows;
    }

    async findByIdWithIngredients(recipeId) {
        const recipe = await this.pool.query(
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
            [recipeId],
        );

        return recipe.rows[0] || null;
    }

    async update(
        recipeId,
        {
            title,
            content,
            ingredients: newIngredients,
            type_id,
            cooking_time,
            servings,
        },
    ) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            const result = await client.query(
                `UPDATE recipes SET title = $1, content = $2, type_id = $3, cooking_time = $4, servings = $5
         WHERE id = $6 RETURNING *`,
                [title, content, type_id, cooking_time, servings, recipeId],
            );

            if (result.rowCount === 0) {
                await client.query("ROLLBACK");
                return null;
            }

            await client.query(
                `DELETE FROM recipe_ingredients WHERE recipe_id = $1`,
                [recipeId],
            );

            for (const { id, quantity_recipe_ingredients } of newIngredients) {
                await client.query(
                    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
             VALUES ($1, $2, $3)`,
                    [recipeId, id, quantity_recipe_ingredients || 1],
                );
            }

            await client.query("COMMIT");
            return result.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async search({
        ingredient_name,
        type_ids,
        start_date,
        end_date,
        min_cooking_time,
        max_cooking_time,
        sort_order,
    }) {
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

        if (min_cooking_time) {
            baseQuery += ` AND r.cooking_time >= $${paramIndex}`;
            params.push(Number(min_cooking_time));
            paramIndex++;
        }

        if (max_cooking_time) {
            baseQuery += ` AND r.cooking_time <= $${paramIndex}`;
            params.push(Number(max_cooking_time));
        }

        baseQuery += ` GROUP BY r.id, rt.type_name`;

        if (sort_order) {
            baseQuery += ` ORDER BY r.cooking_time ${
                sort_order === "asc" ? "ASC" : "DESC"
            }`;
        }

        const recipes = await this.pool.query(baseQuery, params);
        return recipes.rows;
    }

    async searchByPerson(
        person_id,
        {
            ingredient_name,
            type_ids,
            start_date,
            end_date,
            min_cooking_time,
            max_cooking_time,
            sort_order,
        },
    ) {
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
        }

        baseQuery += ` GROUP BY r.id, rt.type_name`;

        if (sort_order) {
            baseQuery += ` ORDER BY r.cooking_time ${
                sort_order === "asc" ? "ASC" : "DESC"
            }`;
        }

        const recipes = await this.pool.query(baseQuery, params);

        return recipes.rows;
    }

    async deleteById(recipeId) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            await client.query(`DELETE FROM menu_recipe WHERE recipe_id = $1`, [
                recipeId,
            ]);

            await client.query(
                `DELETE FROM recipe_ingredients WHERE recipe_id = $1`,
                [recipeId],
            );

            const result = await client.query(
                `DELETE FROM recipes WHERE id = $1 RETURNING *`,
                [recipeId],
            );

            await client.query("COMMIT");
            return result.rowCount > 0;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async findAllIngredients() {
        const ingredients = await this.pool.query(
            `SELECT i.*, um.unit_name
           FROM ingredients i
                  LEFT JOIN unit_measurement um ON i.id_unit_measurement = um.id`,
        );
        return ingredients.rows;
    }

    async getStats() {
        const { rows: fastestRecipe } = await this.pool.query(
            `SELECT r.*, rt.type_name as "typeName"
           FROM recipes r
                  JOIN recipe_types rt ON r.type_id = rt.id
           --ORDER BY r.cooking_time ASC LIMIT 1
           WHERE r.cooking_time = (
             SELECT MIN(cooking_time)
             FROM recipes
           )`,
        );

        const { rows: slowestRecipe } = await this.pool.query(
            `SELECT r.*, rt.type_name as "typeName"
           FROM recipes r
                  JOIN recipe_types rt ON r.type_id = rt.id
           --ORDER BY r.cooking_time DESC LIMIT 1
           WHERE r.cooking_time = (
             SELECT MAX(cooking_time)
             FROM recipes
           )`,
        );

        const { rows: typeStats } = await this.pool.query(
            `SELECT rt.type_name as "typeName", COUNT(*) as count
           FROM recipes r
             JOIN recipe_types rt ON r.type_id = rt.id
           GROUP BY rt.type_name`,
        );

        const { rows: recipesWithMostIngredients } = await this.pool.query(
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
           )`,
        );

        const { rows: recipesWithLeastIngredients } = await this.pool.query(
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
           )`,
        );

        const { rows: averageCookingTimes } = await this.pool.query(
            `SELECT rt.type_name as "typeName",
              AVG(r.cooking_time) as "averageCookingTime"
         FROM recipes r
         JOIN recipe_types rt ON r.type_id = rt.id
         GROUP BY rt.type_name`,
        );

        return {
            fastestRecipe,
            slowestRecipe,
            typeStats,
            recipesWithMostIngredients,
            recipesWithLeastIngredients,
            averageCookingTimes,
        };
    }
}

module.exports = PgRecipeRepository;
