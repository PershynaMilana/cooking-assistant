import type { Pool } from "pg";

import type { RecipeTypeRepository } from "domain/repositories/RecipeTypeRepository";

interface RecipeTypeRow {
    id: number;
    type_name: string;
    description: string;
}

export default class PgRecipeTypeRepository implements RecipeTypeRepository {
    constructor(private pool: Pool) {}

    async findAll(): Promise<unknown[]> {
        const result = await this.pool.query<RecipeTypeRow>(
            `SELECT * FROM recipe_types`,
        );

        return result.rows;
    }
}
