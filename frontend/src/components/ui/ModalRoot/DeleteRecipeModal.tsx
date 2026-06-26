import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useAppDispatch } from "redux/hooks";
import { useDeleteRecipeMutation } from "redux/services/recipesApi";
import { addNotification } from "redux/slices/notificationsSlice";
import { closeModal } from "redux/slices/uiSlice";

import { Modal } from "components/ui/Modal";

interface DeleteRecipeModalProps {
    modalId: string;
    recipeId: string;
}

export const DeleteRecipeModal = ({
    modalId,
    recipeId,
}: DeleteRecipeModalProps) => {
    const { t } = useTranslation("recipes");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteRecipe, { isLoading }] = useDeleteRecipeMutation();

    const handleConfirm = async () => {
        // a failed mutation is already toasted by the global listener
        const result = await deleteRecipe(recipeId);

        if ("data" in result) {
            dispatch(
                addNotification({
                    type: "success",
                    message: t("recipeDetailsPage.deleted"),
                }),
            );
            dispatch(closeModal(modalId));
            navigate(ROUTES.main);
        }
    };

    return (
        <Modal
            isOpen
            title={t("recipeDetailsPage.deleteTitle")}
            message={t("recipeDetailsPage.deleteMessage")}
            isConfirmDisabled={isLoading}
            onClose={() => dispatch(closeModal(modalId))}
            onConfirm={() => void handleConfirm()}
        />
    );
};
