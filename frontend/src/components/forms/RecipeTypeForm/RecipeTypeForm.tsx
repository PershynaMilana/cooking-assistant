import React from "react";
import { useTranslation } from "react-i18next";

import type { RecipeTypeErrors, RecipeTypeFormData } from "types/recipeType";

import { FormField, FormTextArea } from "components/forms/fields";

interface RecipeTypeFormProps {
    typeData: RecipeTypeFormData;
    errors: RecipeTypeErrors;
    onFieldChange: (field: keyof RecipeTypeFormData, value: string) => void;
    onSubmit: () => unknown;
    submitLabel: string;
}

export const RecipeTypeForm: React.FC<RecipeTypeFormProps> = ({
    typeData,
    errors,
    onFieldChange,
    onSubmit,
    submitLabel,
}) => {
    const { t } = useTranslation("recipeTypes");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <FormField
                id="recipe-type-name"
                label={t("form.nameLabel")}
                value={typeData.type_name}
                onChange={(value) => {
                    onFieldChange("type_name", value);
                }}
                error={errors.type_name}
            />
            <FormTextArea
                id="recipe-type-description"
                label={t("form.descriptionLabel")}
                value={typeData.description}
                onChange={(value) => {
                    onFieldChange("description", value);
                }}
                error={errors.description}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                {submitLabel}
            </button>
        </form>
    );
};
