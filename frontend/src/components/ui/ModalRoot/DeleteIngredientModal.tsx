import { useTranslation } from "react-i18next";

import type { PantryIngredient } from "types/userIngredient";

import { useAppDispatch } from "redux/hooks";
import { useDeleteUserIngredientMutation } from "redux/services/userIngredientsApi";
import { addNotification } from "redux/slices/notificationsSlice";
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
    const { t } = useTranslation("ingredients");
    const dispatch = useAppDispatch();
    const [deleteIngredient] = useDeleteUserIngredientMutation();

    const handleConfirm = async () => {
        // a failed mutation is already toasted by the global listener
        const result = await deleteIngredient(ingredient.id);

        if ("data" in result) {
            dispatch(
                addNotification({
                    type: "success",
                    message: t("page.deleted"),
                }),
            );
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
