import type { Pool } from "pg";

import type { RecipeTypeRepository } from "@domain/repositories/RecipeTypeRepository";

export default class PgRecipeTypeRepository implements RecipeTypeRepository {
    constructor(private pool: Pool) {}

    async findAll(): Promise<unknown[]> {
        const result = await this.pool.query(`SELECT * FROM recipe_types`);
        return result.rows;
    }
}
