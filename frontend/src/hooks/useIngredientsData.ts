import { useCallback, useEffect, useState } from "react";

import { logger } from "config/logger";
import type { Ingredient } from "types/ingredient";
import type { PantryIngredient } from "types/userIngredient";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
} from "api/userIngredientsApi";

export const useIngredientsData = () => {
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [personIngredients, setPersonIngredients] = useState<
        PantryIngredient[]
    >([]);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>(
        [],
    );

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const ingredients = await getIngredients();

                setAllIngredients(
                    [...ingredients].sort((a, b) =>
                        a.name.localeCompare(b.name),
                    ),
                );
            } catch (error) {
                logger.error("Error loading ingredients:", error);
            }
        };

        void fetchAll();
    }, []);

    const fetchPersonIngredients = useCallback(async () => {
        try {
            const data = await getUserIngredients();

            setPersonIngredients(
                data.map((item) => ({
                    ...item,
                    id: item.ingredient_id,
                })),
            );
            setSelectedIngredients(
                data.map((ingredient) => ingredient.ingredient_id),
            );
        } catch (error) {
            logger.error("Error loading selected ingredients:", error);
        }
    }, []);

    useEffect(() => {
        void fetchPersonIngredients();
    }, [fetchPersonIngredients]);

    const saveNewIngredients = useCallback(async (): Promise<boolean> => {
        const newIngredients = allIngredients
            .filter(
                (ingredient) =>
                    selectedIngredients.includes(ingredient.id) &&
                    !personIngredients.some(
                        (item) => item.id === ingredient.id,
                    ),
            )
            .map((ingredient) => ({
                id: ingredient.id,
                ingredient_name: ingredient.name,
                quantity_person_ingradient: 1,
            }));

        try {
            await saveUserIngredient({ ingredients: newIngredients });
            await fetchPersonIngredients();

            return true;
        } catch (error) {
            logger.error("Error saving ingredients:", error);

            return false;
        }
    }, [
        allIngredients,
        selectedIngredients,
        personIngredients,
        fetchPersonIngredients,
    ]);

    const removeIngredient = useCallback(
        async (ingredientId: number): Promise<boolean> => {
            try {
                await deleteUserIngredient(ingredientId);
                setPersonIngredients((prev) =>
                    prev.filter((item) => item.id !== ingredientId),
                );
                setSelectedIngredients((prev) =>
                    prev.filter((id) => id !== ingredientId),
                );

                return true;
            } catch (error) {
                logger.error("Error deleting ingredient and history:", error);

                return false;
            }
        },
        [],
    );

    const toggleIngredientSelection = useCallback((ingredientId: number) => {
        setSelectedIngredients((prev) =>
            prev.includes(ingredientId)
                ? prev.filter((id) => id !== ingredientId)
                : [...prev, ingredientId],
        );
    }, []);

    return {
        allIngredients,
        personIngredients,
        selectedIngredients,
        fetchPersonIngredients,
        saveNewIngredients,
        removeIngredient,
        toggleIngredientSelection,
    };
};
