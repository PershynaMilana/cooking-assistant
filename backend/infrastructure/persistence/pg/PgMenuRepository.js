const MenuRepository = require("../../../domain/repositories/MenuRepository");

class PgMenuRepository extends MenuRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async findAll({ menu_name, category_ids }) {
        if (menu_name) {
            menu_name = decodeURIComponent(menu_name);
        }

        let query = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        mc.category_name AS categoryName,
        m.menu_content AS menuContent
      FROM menu m
             LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
    `;

        const queryParams = [];

        if (menu_name) {
            query += ` WHERE m.menu_title ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${menu_name}%`);
        }

        if (category_ids) {
            const categoryArray = category_ids.split(",").map(Number);
            if (menu_name) {
                query += ` AND m.category_id = ANY($${queryParams.length + 1})`;
            } else {
                query += ` WHERE m.category_id = ANY($${
                    queryParams.length + 1
                })`;
            }
            queryParams.push(categoryArray);
        }

        const result = await this.pool.query(query, queryParams);
        return result.rows;
    }

    async create({ menuTitle, menuContent, categoryId, personId }, recipeIds) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            const menuResult = await client.query(
                `INSERT INTO menu (menu_title, menu_content, category_id, person_id)
             VALUES ($1, $2, $3, $4)
             RETURNING menu_id`,
                [menuTitle, menuContent, categoryId, personId],
            );
            const menuId = menuResult.rows[0].menu_id;

            const recipeInsertPromises = recipeIds.map((recipeId) =>
                client.query(
                    `INSERT INTO menu_recipe (menu_id, recipe_id)
                 VALUES ($1, $2)`,
                    [menuId, recipeId],
                ),
            );
            await Promise.all(recipeInsertPromises);

            await client.query("COMMIT");
            return menuId;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async update(id, { menuTitle, menuContent, categoryId }, recipeIds) {
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");

            const updateMenuQuery = `
      UPDATE menu
      SET menu_title = $1, menu_content = $2, category_id = $3
      WHERE menu_id = $4
    `;
            await client.query(updateMenuQuery, [
                menuTitle,
                menuContent,
                categoryId,
                id,
            ]);

            const deleteRecipesQuery =
                "DELETE FROM menu_recipe WHERE menu_id = $1";
            await client.query(deleteRecipesQuery, [id]);

            const addRecipesPromises = recipeIds.map((recipeId) => {
                return client.query(
                    "INSERT INTO menu_recipe (menu_id, recipe_id) VALUES ($1, $2)",
                    [id, recipeId],
                );
            });
            await Promise.all(addRecipesPromises);

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async findByIdWithRecipes(id) {
        const menuQuery = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        m.menu_content AS menuContent,
        mc.category_name AS categoryName,
        m.person_id AS personId
      FROM menu m
      LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
      WHERE m.menu_id = $1
    `;
        const menuResult = await this.pool.query(menuQuery, [id]);

        if (menuResult.rows.length === 0) {
            return null;
        }

        const menu = menuResult.rows[0];

        const recipeQuery = `
      SELECT
        r.id AS recipe_id,
        r.title,
        r.content,
        r.person_id,
        r.type_id,
        r.creation_date,
        r.cooking_time,
        r.servings,
        rt.type_name AS type_name,
        ARRAY_AGG(i.name) AS ingredients
      FROM recipes r
      JOIN menu_recipe mr ON r.id = mr.recipe_id
      LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      LEFT JOIN ingredients i ON i.id = ri.ingredient_id
      LEFT JOIN recipe_types rt ON rt.id = r.type_id
      WHERE mr.menu_id = $1
      GROUP BY r.id, rt.type_name
    `;
        const recipeResult = await this.pool.query(recipeQuery, [id]);

        const recipesWithDetails = [];
        for (let recipe of recipeResult.rows) {
            const recipeId = recipe.recipe_id;

            const missingIngredientsQuery = `
        SELECT
          i.name AS ingredient_name,
          GREATEST(ri.quantity_recipe_ingredients - COALESCE(pi.quantity_person_ingradient, 0), 0) AS missing_quantity,
          u.unit_name,
          u.coefficient
        FROM recipe_ingredients ri
        LEFT JOIN person_ingredients pi
          ON ri.ingredient_id = pi.ingredient_id AND pi.person_id = $1
        LEFT JOIN ingredients i
          ON ri.ingredient_id = i.id
        LEFT JOIN unit_measurement u
          ON i.id_unit_measurement = u.id
        WHERE ri.recipe_id = $2
        GROUP BY i.name, ri.quantity_recipe_ingredients, pi.quantity_person_ingradient, u.unit_name, u.coefficient
        HAVING GREATEST(ri.quantity_recipe_ingredients - COALESCE(pi.quantity_person_ingradient, 0), 0) > 0
      `;
            const missingIngredientsResult = await this.pool.query(
                missingIngredientsQuery,
                [menu.personid, recipeId],
            );

            const recipeDetails = {
                ...recipe,
                missingIngredients: missingIngredientsResult.rows,
            };
            recipesWithDetails.push(recipeDetails);
        }

        return { menu, recipes: recipesWithDetails };
    }

    async deleteById(id) {
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");

            const deleteMenuRecipeQuery =
                "DELETE FROM menu_recipe WHERE menu_id = $1";
            await client.query(deleteMenuRecipeQuery, [id]);

            const deleteMenuQuery =
                "DELETE FROM menu WHERE menu_id = $1 RETURNING menu_id";
            const result = await client.query(deleteMenuQuery, [id]);

            if (result.rowCount === 0) {
                await client.query("COMMIT");
                return false;
            }

            await client.query("COMMIT");
            return true;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async searchByPerson(id, { menu_name, category_ids }) {
        if (menu_name) {
            menu_name = decodeURIComponent(menu_name);
        }

        let query = `
      SELECT
        m.menu_id AS id,
        m.menu_title AS title,
        mc.category_name AS categoryName,
        m.menu_content AS menuContent
      FROM menu m
      LEFT JOIN menu_category mc ON m.category_id = mc.menu_category_id
      WHERE m.person_id = $1
    `;

        const queryParams = [id];

        if (menu_name) {
            query += ` AND m.menu_title ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${menu_name}%`);
        }

        if (category_ids) {
            const categoryArray = category_ids.split(",").map(Number);
            query += ` AND m.category_id = ANY($${queryParams.length + 1})`;
            queryParams.push(categoryArray);
        }

        const result = await this.pool.query(query, queryParams);
        return result.rows;
    }
}

module.exports = PgMenuRepository;
