import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useAppDispatch } from "redux/hooks";
import { useDeleteMenuMutation } from "redux/services/menusApi";
import { closeModal } from "redux/slices/uiSlice";

import { Modal } from "components/ui/Modal";

interface DeleteMenuModalProps {
    modalId: string;
    menuId: string | number;
}

export const DeleteMenuModal = ({ modalId, menuId }: DeleteMenuModalProps) => {
    const { t } = useTranslation("menu");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteMenu, { isLoading }] = useDeleteMenuMutation();

    const handleConfirm = async () => {
        // success and failure toasts are handled by the global listener
        const result = await deleteMenu(menuId);

        if ("data" in result) {
            dispatch(closeModal(modalId));
            navigate(ROUTES.menu);
        }
    };

    return (
        <Modal
            isOpen
            title={t("menuDetailsPage.deleteTitle")}
            message={t("menuDetailsPage.deleteMessage")}
            isConfirmDisabled={isLoading}
            onClose={() => dispatch(closeModal(modalId))}
            onConfirm={() => void handleConfirm()}
        />
    );
};
