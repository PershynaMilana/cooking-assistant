import type { PantryIngredient } from "types/userIngredient";

import { useAppDispatch } from "redux/hooks";
import { useDeleteUserIngredientMutation } from "redux/services/userIngredientsApi";
import { closeModal } from "redux/slices/uiSlice";

import { DeleteConfirmModal } from "components/ingredients/DeleteConfirmModal";

interface DeleteIngredientModalProps {
    modalId: string;
    ingredient: PantryIngredient;
}

export const DeleteIngredientModal = ({
    modalId,
    ingredient,
}: DeleteIngredientModalProps) => {
    const dispatch = useAppDispatch();
    const [deleteIngredient] = useDeleteUserIngredientMutation();

    const handleConfirm = async () => {
        // success and failure toasts are handled by the global listener
        const result = await deleteIngredient(ingredient.id);

        if ("data" in result) {
            dispatch(closeModal(modalId));
        }
    };

    return (
        <DeleteConfirmModal
            ingredient={ingredient}
            onConfirm={() => void handleConfirm()}
            onCancel={() => dispatch(closeModal(modalId))}
        />
    );
};
