import type { Pool } from "pg";

import type { Recipe } from "domain/entities/Recipe";

interface RecipeRow {
    id: number;
    title: string;
    content: string;
    person_id: number;
    type_id: number | null;
    creation_date: Date;
    cooking_time: number | null;
    servings: number | null;
}

export async function createRecipeInDb(
    pool: Pool,
    {
        title,
        content,
        person_id,
        ingredients,
        type_id,
        cooking_time,
        servings,
    }: Recipe,
): Promise<unknown> {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const newRecipe = await client.query<RecipeRow>(
            `INSERT INTO recipes (title, content, person_id, type_id, cooking_time, servings)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, content, person_id, type_id, cooking_time, servings],
        );

        const recipeId = newRecipe.rows[0].id;

        for (const { id, quantity_recipe_ingredients } of ingredients) {
            await client.query(
                `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_recipe_ingredients)
             VALUES ($1, $2, $3)`,
                [recipeId, id, quantity_recipe_ingredients],
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

export async function updateRecipeInDb(
    pool: Pool,
    recipeId: string | number,
    personId: number,
    {
        title,
        content,
        ingredients: newIngredients,
        type_id,
        cooking_time,
        servings,
    }: Recipe,
): Promise<unknown> {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query<RecipeRow>(
            `UPDATE recipes SET title = $1, content = $2, type_id = $3, cooking_time = $4, servings = $5
         WHERE id = $6 AND person_id = $7 RETURNING *`,
            [
                title,
                content,
                type_id,
                cooking_time,
                servings,
                recipeId,
                personId,
            ],
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
                [recipeId, id, quantity_recipe_ingredients],
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
