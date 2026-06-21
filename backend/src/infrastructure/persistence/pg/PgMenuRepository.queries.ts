import type { Pool } from "pg";

import type { MenuFilters } from "application/use-cases/menus/menu.types";

type QueryParam = string | number | number[];

interface MenuListRow {
    id: number;
    title: string;
    categoryName: string;
    menuContent: string;
}

export async function findAllMenus(
    pool: Pool,
    filters: unknown,
): Promise<unknown[]> {
    const { menu_name, category_ids }: MenuFilters = filters ?? {};

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
            query += ` WHERE m.category_id = ANY($${queryParams.length + 1})`;
        }
        queryParams.push(categoryArray);
    }

    const result = await pool.query<MenuListRow>(query, queryParams);

    return result.rows;
}

export async function searchPersonMenus(
    pool: Pool,
    personId: number,
    filters: unknown,
): Promise<unknown[]> {
    const { menu_name, category_ids }: MenuFilters = filters ?? {};

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

    const queryParams: QueryParam[] = [personId];

    if (menu_name) {
        query += ` AND m.menu_title ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${menu_name}%`);
    }

    if (category_ids) {
        const categoryArray = category_ids.split(",").map(Number);

        query += ` AND m.category_id = ANY($${queryParams.length + 1})`;
        queryParams.push(categoryArray);
    }

    const result = await pool.query<MenuListRow>(query, queryParams);

    return result.rows;
}
