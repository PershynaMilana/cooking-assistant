import type { Pool } from "pg";

import type {
    RecipeTypeInput,
    RecipeTypeRepository,
} from "@domain/repositories/RecipeTypeRepository";

export default class PgRecipeTypeRepository implements RecipeTypeRepository {
    constructor(private pool: Pool) {}

    async findAll(): Promise<unknown[]> {
        const result = await this.pool.query(`SELECT * FROM recipe_types`);
        return result.rows;
    }

    async findById(id: string | number): Promise<unknown | null> {
        const result = await this.pool.query(
            `SELECT * FROM recipe_types WHERE id = $1`,
            [id],
        );
        return result.rows[0] || null;
    }

    async create({
        type_name,
        description,
    }: RecipeTypeInput): Promise<unknown> {
        const result = await this.pool.query(
            `INSERT INTO recipe_types (type_name, description) VALUES ($1, $2) RETURNING *`,
            [type_name, description],
        );
        return result.rows[0];
    }

    async update(
        id: string | number,
        { type_name, description }: RecipeTypeInput,
    ): Promise<unknown | null> {
        const result = await this.pool.query(
            `UPDATE recipe_types SET type_name = $1, description = $2 WHERE id = $3 RETURNING *`,
            [type_name, description, id],
        );
        return result.rows[0] || null;
    }

    async deleteById(id: string | number): Promise<boolean> {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            await client.query(
                "DELETE FROM menu_recipe WHERE recipe_id IN (SELECT id FROM recipes WHERE type_id = $1)",
                [id],
            );
            await client.query(
                "DELETE FROM recipe_ingredients WHERE recipe_id IN (SELECT id FROM recipes WHERE type_id = $1)",
                [id],
            );
            await client.query("DELETE FROM recipes WHERE type_id = $1", [id]);

            const result = await client.query(
                "DELETE FROM recipe_types WHERE id = $1 RETURNING *",
                [id],
            );

            await client.query("COMMIT");
            return Boolean(result.rowCount);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
}
