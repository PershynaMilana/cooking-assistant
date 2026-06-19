import { useCallback, useState } from "react";

import type { PantryIngredient } from "types/userIngredient";

import { updateQuantities } from "api/userIngredientsApi";

import { getUserIdSafe } from "utils/getCurrentUserId";

const NO_AUTH = "No auth token found.";

export const useQuantityUpdates = (
    personIngredients: PantryIngredient[],
    onSaved: () => Promise<void>,
) => {
    const [isEditingQuantity, setIsEditingQuantity] = useState(false);
    const [updatedIngredients, setUpdatedIngredients] = useState<
        PantryIngredient[]
    >([]);

    const startEditing = useCallback(() => {
        setIsEditingQuantity(true);
        setUpdatedIngredients([...personIngredients]);
    }, [personIngredients]);

    const handleQuantityChange = useCallback(
        (id: number, newQuantity: number) => {
            setUpdatedIngredients((prev) =>
                prev.map((ingredient) => {
                    if (ingredient.id !== id) {
                        return ingredient;
                    }

                    const isAddition =
                        newQuantity > ingredient.quantity_person_ingradient;
                    const today = new Date().toISOString().split("T")[0];

                    return {
                        ...ingredient,
                        quantity_person_ingradient: newQuantity,
                        ...(isAddition && { purchase_date: today }),
                    };
                }),
            );
        },
        [],
    );

    const saveUpdatedQuantities = useCallback(async () => {
        const userId = getUserIdSafe();

        if (userId === null) {
            console.error(NO_AUTH);
            setIsEditingQuantity(false);

            return;
        }

        const changedIngredients = updatedIngredients.filter(
            (updatedIngredient) => {
                const original = personIngredients.find(
                    (ingredient) => ingredient.id === updatedIngredient.id,
                );

                return (
                    original &&
                    original.quantity_person_ingradient !==
                        updatedIngredient.quantity_person_ingradient
                );
            },
        );

        if (changedIngredients.length === 0) {
            setIsEditingQuantity(false);

            return;
        }

        try {
            await updateQuantities(userId, {
                updatedIngredients: changedIngredients,
            });
            setIsEditingQuantity(false);
            await onSaved();
        } catch (error) {
            console.error("Error saving ingredient quantities:", error);
            setIsEditingQuantity(false);
        }
    }, [updatedIngredients, personIngredients, onSaved]);

    return {
        isEditingQuantity,
        updatedIngredients,
        startEditing,
        handleQuantityChange,
        saveUpdatedQuantities,
    };
};
