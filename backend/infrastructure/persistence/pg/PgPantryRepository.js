const PantryRepository = require("../../../domain/repositories/PantryRepository");

class PgPantryRepository extends PantryRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async findByUser(userId) {
        const ingredients = await this.pool.query(
            `SELECT
         pi.ingredient_id,
         i.name AS ingredient_name,
         pi.quantity_person_ingradient,
         um.unit_name,
         i.allergens,
         i.days_to_expire,
         i.seasonality,
         i.storage_condition,
         pi.purchase_date -- Add purchase_date field
       FROM person_ingredients pi
       JOIN ingredients i ON pi.ingredient_id = i.id
       JOIN unit_measurement um ON i.id_unit_measurement = um.id
       WHERE pi.person_id = $1`,
            [userId],
        );
        return ingredients.rows;
    }

    async addIngredients(userId, items) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            for (const ingredient of items) {
                await client.query(
                    `INSERT INTO person_ingredients (person_id, ingredient_id, quantity_person_ingradient, purchase_date)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (person_id, ingredient_id)
           DO UPDATE SET quantity_person_ingradient = person_ingredients.quantity_person_ingradient + $3,
                         purchase_date = NOW()`,
                    [
                        userId,
                        ingredient.id,
                        ingredient.quantity_person_ingradient,
                    ],
                );

                await client.query(
                    `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
                    [
                        userId,
                        ingredient.id,
                        ingredient.quantity_person_ingradient,
                    ],
                );
            }

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteIngredient(userId, ingredientId) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            await client.query(
                `DELETE FROM ingredient_purchases WHERE person_id = $1 AND ingredient_id = $2`,
                [userId, ingredientId],
            );

            const result = await client.query(
                `DELETE FROM person_ingredients WHERE person_id = $1 AND ingredient_id = $2`,
                [userId, ingredientId],
            );

            if (result.rowCount === 0) {
                await client.query("ROLLBACK");
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

    async updateQuantities(userId, items) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            for (const ingredient of items) {
                const { rows } = await client.query(
                    `SELECT quantity_person_ingradient
             FROM person_ingredients
             WHERE person_id = $1 AND ingredient_id = $2`,
                    [userId, ingredient.id],
                );

                const currentQuantity =
                    rows[0]?.quantity_person_ingradient || 0;
                const addedQuantity =
                    ingredient.quantity_person_ingradient - currentQuantity;

                if (addedQuantity > 0) {
                    await client.query(
                        `UPDATE person_ingredients
           SET quantity_person_ingradient = $1, purchase_date = NOW()
           WHERE person_id = $2 AND ingredient_id = $3`,
                        [
                            ingredient.quantity_person_ingradient,
                            userId,
                            ingredient.id,
                        ],
                    );

                    await client.query(
                        `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
                        [userId, ingredient.id, addedQuantity],
                    );
                }
            }

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async updatePurchaseQuantity(userId, purchaseId, quantity) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            const purchase = await client.query(
                `SELECT * FROM ingredient_purchases WHERE id = $1 AND person_id = $2`,
                [purchaseId, userId],
            );

            if (purchase.rows.length === 0) {
                await client.query("ROLLBACK");
                return null;
            }

            await client.query(
                `UPDATE ingredient_purchases SET quantity = $1 WHERE id = $2`,
                [quantity, purchaseId],
            );

            const ingredientId = purchase.rows[0].ingredient_id;
            const totalQuantityResult = await client.query(
                `SELECT SUM(quantity) AS total_quantity FROM ingredient_purchases WHERE ingredient_id = $1 AND person_id = $2`,
                [ingredientId, userId],
            );

            const totalQuantity =
                totalQuantityResult.rows[0].total_quantity || 0;

            await client.query(
                `UPDATE person_ingredients
           SET quantity_person_ingradient = $1
           WHERE person_id = $2 AND ingredient_id = $3`,
                [totalQuantity, userId, ingredientId],
            );

            await client.query("COMMIT");
            return true;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async findPurchaseHistory(userId, ingredientId) {
        const result = await this.pool.query(
            `SELECT
                     ip.id,
                     ip.quantity,
                     ip.purchase_date,
                     um.unit_name,
                     i.days_to_expire
                 FROM ingredient_purchases ip
                          JOIN ingredients i ON ip.ingredient_id = i.id
                          JOIN unit_measurement um ON i.id_unit_measurement = um.id
                 WHERE ip.person_id = $1 AND ip.ingredient_id = $2
                 ORDER BY ip.purchase_date ASC`,
            [userId, ingredientId],
        );

        return result.rows;
    }
}

module.exports = PgPantryRepository;
