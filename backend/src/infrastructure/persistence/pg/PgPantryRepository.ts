import type { Pool } from "pg";

import type {
    PantryIngredientInput,
    PantryRepository,
} from "@domain/repositories/PantryRepository";

export default class PgPantryRepository implements PantryRepository {
    constructor(private pool: Pool) {}

    async findByUser(userId: string | number): Promise<unknown[]> {
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
         pi.purchase_date
       FROM person_ingredients pi
       JOIN ingredients i ON pi.ingredient_id = i.id
       JOIN unit_measurement um ON i.id_unit_measurement = um.id
       WHERE pi.person_id = $1`,
            [userId],
        );
        return ingredients.rows;
    }

    async addIngredients(
        userId: string | number,
        items: PantryIngredientInput[],
    ): Promise<void> {
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

    async deleteIngredient(
        userId: string | number,
        ingredientId: string | number,
    ): Promise<boolean> {
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

    async updateQuantities(
        userId: string | number,
        items: PantryIngredientInput[],
    ): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            for (const ingredient of items) {
                const { rows } = await client.query(
                    `SELECT quantity_person_ingradient
             FROM person_ingredients
             WHERE person_id = $1 AND ingredient_id = $2
             FOR UPDATE`,
                    [userId, ingredient.id],
                );

                const currentQuantity =
                    rows[0]?.quantity_person_ingradient || 0;
                const addedQuantity =
                    ingredient.quantity_person_ingradient - currentQuantity;

                if (addedQuantity > 0) {
                    // an increase is a purchase: upsert the pantry row and log it
                    await client.query(
                        `INSERT INTO person_ingredients (person_id, ingredient_id, quantity_person_ingradient, purchase_date)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (person_id, ingredient_id)
           DO UPDATE SET quantity_person_ingradient = $3, purchase_date = NOW()`,
                        [
                            userId,
                            ingredient.id,
                            ingredient.quantity_person_ingradient,
                        ],
                    );

                    await client.query(
                        `INSERT INTO ingredient_purchases (person_id, ingredient_id, quantity, purchase_date)
           VALUES ($1, $2, $3, NOW())`,
                        [userId, ingredient.id, addedQuantity],
                    );
                } else if (addedQuantity < 0) {
                    if (ingredient.quantity_person_ingradient === 0) {
                        await client.query(
                            `DELETE FROM ingredient_purchases
           WHERE person_id = $1 AND ingredient_id = $2`,
                            [userId, ingredient.id],
                        );
                        await client.query(
                            `DELETE FROM person_ingredients
           WHERE person_id = $1 AND ingredient_id = $2`,
                            [userId, ingredient.id],
                        );
                    } else {
                        await client.query(
                            `UPDATE person_ingredients
           SET quantity_person_ingradient = $1
           WHERE person_id = $2 AND ingredient_id = $3`,
                            [
                                ingredient.quantity_person_ingradient,
                                userId,
                                ingredient.id,
                            ],
                        );
                    }
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

    async updatePurchaseQuantity(
        userId: string | number,
        purchaseId: string | number,
        quantity: number,
    ): Promise<boolean | null> {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");

            const purchase = await client.query(
                `SELECT quantity, ingredient_id FROM ingredient_purchases WHERE id = $1 AND person_id = $2 FOR UPDATE`,
                [purchaseId, userId],
            );

            if (purchase.rows.length === 0) {
                await client.query("ROLLBACK");
                return null;
            }

            // apply the purchase edit as a delta on the pantry stock so prior
            // consumption is preserved (recomputing as SUM of purchases would lose it)
            const { quantity: oldQuantity, ingredient_id: ingredientId } =
                purchase.rows[0];
            const delta = quantity - oldQuantity;

            await client.query(
                `UPDATE ingredient_purchases SET quantity = $1 WHERE id = $2`,
                [quantity, purchaseId],
            );

            await client.query(
                `UPDATE person_ingredients
           SET quantity_person_ingradient = GREATEST(quantity_person_ingradient + $1, 0)
           WHERE person_id = $2 AND ingredient_id = $3`,
                [delta, userId, ingredientId],
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

    async findPurchaseHistory(
        userId: string | number,
        ingredientId: string | number,
    ): Promise<unknown[]> {
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
