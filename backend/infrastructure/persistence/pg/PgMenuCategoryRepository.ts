import type { Pool } from "pg";

import type { MenuCategoryRepository } from "../../../domain/repositories/MenuCategoryRepository";

export default class PgMenuCategoryRepository implements MenuCategoryRepository {
    constructor(private pool: Pool) {}

    async findAll(): Promise<unknown[]> {
        const query = "SELECT * FROM menu_category ORDER BY category_name";
        const result = await this.pool.query(query);
        return result.rows;
    }
}
