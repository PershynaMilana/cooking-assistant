import React from "react";
import { useTranslation } from "react-i18next";

import type { Ingredient } from "types/ingredient";
import type { RecipeTypeSummary } from "types/recipeType";

import type { useRecipeForm } from "hooks/useRecipeForm";

import { FormField, FormTextArea } from "components/forms/fields";
import { CookingTimeField } from "components/recipes/CookingTimeField";
import { IngredientPicker } from "components/recipes/IngredientPicker";
import { RecipeTypeSelect } from "components/recipes/RecipeTypeSelect";
import { SelectedIngredientsList } from "components/recipes/SelectedIngredientsList";
import { ServingsField } from "components/recipes/ServingsField";

type RecipePageKey = "createRecipePage" | "changeRecipePage";

interface RecipeFormProps {
    form: ReturnType<typeof useRecipeForm>;
    allIngredients: Ingredient[];
    allTypes: RecipeTypeSummary[];
    keyPrefix: RecipePageKey;
    idPrefix: string;
    typeError: string | null;
    error: string | null;
    cookingTimePlaceholder?: string;
    submitLabel: string;
    onSubmit: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
    form,
    allIngredients,
    allTypes,
    keyPrefix,
    idPrefix,
    typeError,
    error,
    cookingTimePlaceholder,
    submitLabel,
    onSubmit,
}) => {
    const { t } = useTranslation("recipes");

    return (
        <form className="space-y-4">
            <FormField
                id={`${idPrefix}-title`}
                label={t(`${keyPrefix}.titleLabel`)}
                value={form.title}
                onChange={form.setTitle}
            />
            <FormTextArea
                id={`${idPrefix}-description`}
                label={t(`${keyPrefix}.descriptionLabel`)}
                value={form.content}
                onChange={form.setContent}
            />
            <CookingTimeField
                id={`${idPrefix}-cooking-time`}
                label={t(`${keyPrefix}.cookingTimeLabel`)}
                placeholder={cookingTimePlaceholder}
                value={form.cookingTime}
                error={form.cookingTimeError}
                onChange={form.setCookingTime}
            />
            <RecipeTypeSelect
                id={`${idPrefix}-type`}
                label={t(`${keyPrefix}.recipeTypeLabel`)}
                placeholder={t(`${keyPrefix}.recipeTypePlaceholder`)}
                types={allTypes}
                value={form.selectedTypeId}
                error={typeError}
                onChange={form.setSelectedTypeId}
            />
            <IngredientPicker
                allIngredients={allIngredients}
                selectedIds={form.selectedIngredients.map((i) => i.id)}
                label={t(`${keyPrefix}.ingredientsLabel`)}
                onToggle={form.toggleIngredientSelection}
            />
            <SelectedIngredientsList
                ingredients={form.selectedIngredients}
                heading={t(`${keyPrefix}.selectedIngredients`)}
                onQuantityChange={form.updateIngredientQuantity}
            />
            <ServingsField
                id={`${idPrefix}-servings`}
                label={t(`${keyPrefix}.servingsLabel`)}
                placeholder={t(`${keyPrefix}.servingsPlaceholder`)}
                value={form.servings}
                onChange={form.setServings}
            />
            {error && <div className="text-red-500">{error}</div>}
            <button
                type="button"
                onClick={onSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                {submitLabel}
            </button>
        </form>
    );
};
