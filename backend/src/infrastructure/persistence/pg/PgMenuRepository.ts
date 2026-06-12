import type { Pool } from "pg";

import type { Menu } from "@domain/entities/Menu";
import type { MenuRepository } from "@domain/repositories/MenuRepository";
import type { MenuFilters } from "@application/use-cases/menus/menu.types";

type QueryParam = string | number | number[];

function toMenuFilters(filters: unknown): MenuFilters {
    return (filters ?? {}) as MenuFilters;
}

// the current frontend pre-encodes menu_name before axios encodes the query again,
// so the value arrives still encoded once; decode defensively (never throw on a
// literal "%") until the frontend refactor drops its encodeURIComponent calls
function decodeMenuName(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

export default class PgMenuRepository implements MenuRepository {
    constructor(private pool: Pool) {}

    async findAll(filters: unknown): Promise<unknown[]> {
        let { menu_name } = toMenuFilters(filters);
        const { category_ids } = toMenuFilters(filters);
        if (menu_name) {
            menu_name = decodeMenuName(menu_name);
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

        const queryParams: QueryParam[] = [];

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

    async create(
        { menuTitle, menuContent, categoryId, personId }: Menu,
        recipeIds: number[],
    ): Promise<unknown> {
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

    async update(
        id: string | number,
        personId: number,
        { menuTitle, menuContent, categoryId }: Menu,
        recipeIds: number[],
    ): Promise<boolean> {
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");

            const updateMenuQuery = `
      UPDATE menu
      SET menu_title = $1, menu_content = $2, category_id = $3
      WHERE menu_id = $4 AND person_id = $5
    `;
            const result = await client.query(updateMenuQuery, [
                menuTitle,
                menuContent,
                categoryId,
                id,
                personId,
            ]);

            if (result.rowCount === 0) {
                await client.query("ROLLBACK");
                return false;
            }

            const deleteRecipesQuery =
                "DELETE FROM menu_recipe WHERE menu_id = $1";
            await client.query(deleteRecipesQuery, [id]);

            for (const recipeId of recipeIds) {
                await client.query(
                    "INSERT INTO menu_recipe (menu_id, recipe_id) VALUES ($1, $2)",
                    [id, recipeId],
                );
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

    async findByIdWithRecipes(id: string | number): Promise<unknown | null> {
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

        const recipesWithDetails: unknown[] = [];
        for (const recipe of recipeResult.rows) {
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

    async deleteById(id: string | number, personId: number): Promise<boolean> {
        // menu_recipe is deleted explicitly: databases adopted from the legacy
        // database.sql carry a second menu_id FK without ON DELETE CASCADE,
        // so relying on the cascade would fail there
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");

            const owned = await client.query(
                "SELECT menu_id FROM menu WHERE menu_id = $1 AND person_id = $2 FOR UPDATE",
                [id, personId],
            );

            if (owned.rowCount === 0) {
                await client.query("ROLLBACK");
                return false;
            }

            await client.query("DELETE FROM menu_recipe WHERE menu_id = $1", [
                id,
            ]);
            await client.query("DELETE FROM menu WHERE menu_id = $1", [id]);

            await client.query("COMMIT");
            return true;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async searchByPerson(id: number, filters: unknown): Promise<unknown[]> {
        let { menu_name } = toMenuFilters(filters);
        const { category_ids } = toMenuFilters(filters);
        if (menu_name) {
            menu_name = decodeMenuName(menu_name);
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

        const queryParams: QueryParam[] = [id];

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
