import React from "react";
import { useTranslation } from "react-i18next";

interface IngredientsActionBarProps {
    isEditing: boolean;
    onSaveOrEdit: () => void;
    onEditQuantities: () => void;
}

export const IngredientsActionBar: React.FC<IngredientsActionBarProps> = ({
    isEditing,
    onSaveOrEdit,
    onEditQuantities,
}) => {
    const { t } = useTranslation("ingredients");

    return (
        <div className="flex justify-center mt-6 space-x-4">
            <button
                onClick={onSaveOrEdit}
                className="bg-green-500 text-white py-2 px-4 rounded-full"
            >
                {isEditing ? t("page.saveButton") : t("page.editButton")}
            </button>
            {!isEditing && (
                <button
                    onClick={onEditQuantities}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-full"
                >
                    {t("page.editQuantitiesButton")}
                </button>
            )}
        </div>
    );
};
