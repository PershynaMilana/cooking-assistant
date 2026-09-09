import { useTranslation } from "react-i18next";

import { ROUTES } from "constants/routes";

import { useAppDispatch } from "redux/hooks";
import { useDeleteRecipeMutation } from "redux/services/recipesApi";
import { closeModal } from "redux/slices/uiSlice";

import { useAppRouter } from "hooks/useAppRouter";

import { ConfirmModal } from "components/modals/ConfirmModal";

interface DeleteRecipeModalProps {
    modalId: string;
    recipeId: string;
    recipeTitle: string;
}

export const DeleteRecipeModal = ({
    modalId,
    recipeId,
    recipeTitle,
}: DeleteRecipeModalProps) => {
    const { t } = useTranslation("recipes");
    const dispatch = useAppDispatch();
    const router = useAppRouter();
    const [deleteRecipe, { isLoading }] = useDeleteRecipeMutation();

    const handleConfirm = async () => {
        // success and failure toasts are handled by the global listener
        const result = await deleteRecipe(recipeId);

        if ("data" in result) {
            dispatch(closeModal(modalId));
            router.push(ROUTES.allRecipes);
        }
    };

    return (
        <ConfirmModal
            title={t("recipeDetailsPage.deleteTitle")}
            message={t("recipeDetailsPage.deleteMessage", {
                title: recipeTitle,
            })}
            confirmLabel={t("recipeDetailsPage.deleteButton")}
            isConfirmDisabled={isLoading}
            onClose={() => dispatch(closeModal(modalId))}
            onConfirm={() => void handleConfirm()}
        />
    );
};
