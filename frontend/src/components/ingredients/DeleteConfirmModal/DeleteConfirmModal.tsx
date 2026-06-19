import React from "react";
import { useTranslation } from "react-i18next";

import type { PantryIngredient } from "types/userIngredient";

interface DeleteConfirmModalProps {
    ingredient: PantryIngredient;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    ingredient,
    onConfirm,
    onCancel,
}) => {
    const { t } = useTranslation("ingredients");

    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4 text-center">
                    {t("page.deleteConfirmMessage", {
                        name: ingredient.ingredient_name,
                    })}
                </p>
                <div className="flex justify-center space-x-2">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-full"
                        onClick={onConfirm}
                    >
                        {t("page.confirmButton")}
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded-full"
                        onClick={onCancel}
                    >
                        {t("page.cancelButton")}
                    </button>
                </div>
            </div>
        </div>
    );
};
