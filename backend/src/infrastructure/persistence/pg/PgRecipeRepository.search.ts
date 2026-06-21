import type { Pool } from "pg";

import type { RecipeFilters } from "application/use-cases/recipes/recipe.types";

type QueryParam = string | number | number[];

interface RecipeSearchRow {
    id: number;
    title: string;
    content: string;
    person_id: number;
    type_id: number | null;
    creation_date: Date;
    cooking_time: number | null;
    type_name: string | null;
    ingredients: unknown;
}

const BASE_RECIPE_SELECT = `
        SELECT r.id, r.title, r.content, r.person_id, r.type_id, r.creation_date, r.cooking_time,
               rt.type_name, json_agg(json_build_object('id', i.id, 'name', i.name)) AS ingredients
        FROM recipes r
               LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
               LEFT JOIN ingredients i ON ri.ingredient_id = i.id
               LEFT JOIN recipe_types rt ON r.type_id = rt.id
      `;

function applyRecipeFilters(
    baseQuery: string,
    params: QueryParam[],
    startIndex: number,
    filters: RecipeFilters,
): string {
    let query = baseQuery;
    let paramIndex = startIndex;
    const {
        ingredient_name,
        type_ids,
        start_date,
        end_date,
        min_cooking_time,
        max_cooking_time,
    } = filters;

    if (ingredient_name) {
        query += ` AND i.name ILIKE $${paramIndex}`;
        params.push(`%${ingredient_name}%`);
        paramIndex++;
    }

    if (type_ids) {
        query += ` AND r.type_id = ANY($${paramIndex}::int[])`;
        params.push(type_ids.split(",").map(Number));
        paramIndex++;
    }

    if (start_date && end_date) {
        query += ` AND r.creation_date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        params.push(start_date, end_date);
        paramIndex += 2;
    } else if (start_date) {
        query += ` AND r.creation_date >= $${paramIndex}`;
        params.push(start_date);
        paramIndex++;
    } else if (end_date) {
        query += ` AND r.creation_date <= $${paramIndex}`;
        params.push(end_date);
        paramIndex++;
    }

    if (min_cooking_time) {
        query += ` AND r.cooking_time >= $${paramIndex}`;
        params.push(min_cooking_time);
        paramIndex++;
    }

    if (max_cooking_time) {
        query += ` AND r.cooking_time <= $${paramIndex}`;
        params.push(max_cooking_time);
    }

    return query;
}

export async function searchRecipes(
    pool: Pool,
    filters: unknown,
): Promise<unknown[]> {
    const parsed: RecipeFilters = filters ?? {};
    const params: QueryParam[] = [];
    let query = applyRecipeFilters(
        `${BASE_RECIPE_SELECT} WHERE 1=1`,
        params,
        1,
        parsed,
    );

    query += ` GROUP BY r.id, rt.type_name`;

    if (parsed.sort_order) {
        query += ` ORDER BY r.cooking_time ${parsed.sort_order === "asc" ? "ASC" : "DESC"}`;
    }

    const result = await pool.query<RecipeSearchRow>(query, params);

    return result.rows;
}

export async function searchPersonRecipes(
    pool: Pool,
    personId: number,
    filters: unknown,
): Promise<unknown[]> {
    const parsed: RecipeFilters = filters ?? {};
    const params: QueryParam[] = [personId];
    let query = applyRecipeFilters(
        `${BASE_RECIPE_SELECT} WHERE r.person_id = $1`,
        params,
        2,
        parsed,
    );

    query += ` GROUP BY r.id, rt.type_name`;

    if (parsed.sort_order) {
        query += ` ORDER BY r.cooking_time ${parsed.sort_order === "asc" ? "ASC" : "DESC"}`;
    }

    const result = await pool.query<RecipeSearchRow>(query, params);

    return result.rows;
}
