import { useState } from "react";

import type { PantryIngredient } from "types/userIngredient";

import { useIngredientsData } from "hooks/useIngredientsData";
import { useQuantityUpdates } from "hooks/useQuantityUpdates";

export const useIngredientCatalog = () => {
    const {
        allIngredients,
        personIngredients,
        selectedIngredients,
        fetchPersonIngredients,
        saveNewIngredients,
        removeIngredient,
        toggleIngredientSelection,
    } = useIngredientsData();

    const {
        isEditingQuantity,
        updatedIngredients,
        startEditing,
        handleQuantityChange,
        saveUpdatedQuantities,
    } = useQuantityUpdates(personIngredients, fetchPersonIngredients);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedIngredientToDelete, setSelectedIngredientToDelete] =
        useState<PantryIngredient | null>(null);
    const [selectedHistoryIngredient, setSelectedHistoryIngredient] =
        useState<PantryIngredient | null>(null);

    const handleSaveOrToggleEdit = async () => {
        if (isEditing) {
            const ok = await saveNewIngredients();

            if (ok) setIsEditing(false);

            return;
        }

        setIsEditing(true);
    };

    const handleToggleQuantityEdit = () => {
        startEditing();
        setIsEditing(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedIngredientToDelete) {
            return;
        }

        const ok = await removeIngredient(selectedIngredientToDelete.id);

        if (ok) {
            setSelectedIngredientToDelete(null);
        }
    };

    const closeHistoryModal = () => {
        setSelectedHistoryIngredient(null);
        void fetchPersonIngredients();
    };

    return {
        allIngredients,
        personIngredients,
        selectedIngredients,
        toggleIngredientSelection,
        isEditing,
        isEditingQuantity,
        updatedIngredients,
        handleQuantityChange,
        saveUpdatedQuantities,
        handleSaveOrToggleEdit,
        handleToggleQuantityEdit,
        selectedIngredientToDelete,
        setSelectedIngredientToDelete,
        selectedHistoryIngredient,
        setSelectedHistoryIngredient,
        handleConfirmDelete,
        closeHistoryModal,
    };
};
