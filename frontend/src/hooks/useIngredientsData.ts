import { useCallback, useEffect, useState } from "react";

import type { Ingredient } from "types/ingredient";
import type { PantryIngredient } from "types/userIngredient";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
} from "api/userIngredientsApi";

import { getUserIdSafe } from "utils/getCurrentUserId";

const NO_AUTH = "No auth token found.";

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
            if (getUserIdSafe() === null) {
                console.error(NO_AUTH);

                return;
            }

            try {
                const ingredients = await getIngredients();

                setAllIngredients(
                    [...ingredients].sort((a, b) =>
                        a.name.localeCompare(b.name),
                    ),
                );
            } catch (error) {
                console.error("Error loading ingredients:", error);
            }
        };

        void fetchAll();
    }, []);

    const fetchPersonIngredients = useCallback(async () => {
        const userId = getUserIdSafe();

        if (userId === null) {
            console.error(NO_AUTH);

            return;
        }

        try {
            const data = await getUserIngredients(userId);

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
            console.error("Error loading selected ingredients:", error);
        }
    }, []);

    useEffect(() => {
        void fetchPersonIngredients();
    }, [fetchPersonIngredients]);

    const saveNewIngredients = useCallback(async (): Promise<boolean> => {
        const userId = getUserIdSafe();

        if (userId === null) {
            console.error(NO_AUTH);

            return false;
        }

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
            await saveUserIngredient(userId, { ingredients: newIngredients });
            await fetchPersonIngredients();

            return true;
        } catch (error) {
            console.error("Error saving ingredients:", error);

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
            const userId = getUserIdSafe();

            if (userId === null) {
                console.error(NO_AUTH);

                return false;
            }

            try {
                await deleteUserIngredient(userId, ingredientId);
                setPersonIngredients((prev) =>
                    prev.filter((item) => item.id !== ingredientId),
                );
                setSelectedIngredients((prev) =>
                    prev.filter((id) => id !== ingredientId),
                );

                return true;
            } catch (error) {
                console.error("Error deleting ingredient and history:", error);

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
