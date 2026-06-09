const RecipeTypeRepository = require("../../../domain/repositories/RecipeTypeRepository");

class PgRecipeTypeRepository extends RecipeTypeRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async findAll() {
        const result = await this.pool.query(`SELECT * FROM recipe_types`);
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT * FROM recipe_types WHERE id = $1`,
            [id],
        );
        return result.rows[0] || null;
    }

    async create({ type_name, description }) {
        const result = await this.pool.query(
            `INSERT INTO recipe_types (type_name, description) VALUES ($1, $2) RETURNING *`,
            [type_name, description],
        );
        return result.rows[0];
    }

    async update(id, { type_name, description }) {
        const result = await this.pool.query(
            `UPDATE recipe_types SET type_name = $1, description = $2 WHERE id = $3 RETURNING *`,
            [type_name, description, id],
        );
        return result.rows[0] || null;
    }

    async deleteById(id) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

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
            return result.rowCount > 0;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = PgRecipeTypeRepository;
