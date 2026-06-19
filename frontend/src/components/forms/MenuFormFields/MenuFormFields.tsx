import React from "react";
import { useTranslation } from "react-i18next";

import type { MenuCategory } from "types/menu";
import type { RecipeListItem } from "types/recipe";

import type { useMenuForm } from "hooks/useMenuForm";

import { FormField, FormSelect, FormTextArea } from "components/forms/fields";
import { MenuRecipeToggleList } from "components/menu/MenuRecipeToggleList";

type MenuPageKey = "createMenuPage" | "changeMenuPage";

interface MenuFormFieldsProps {
    form: ReturnType<typeof useMenuForm>;
    categories: MenuCategory[];
    allRecipes: RecipeListItem[];
    idPrefix: string;
    keyPrefix: MenuPageKey;
}

export const MenuFormFields: React.FC<MenuFormFieldsProps> = ({
    form,
    categories,
    allRecipes,
    idPrefix,
    keyPrefix,
}) => {
    const { t } = useTranslation("menu");

    const {
        menuTitle,
        menuDescription,
        selectedCategory,
        selectedRecipes,
        errors,
        setMenuTitle,
        setMenuDescription,
        setSelectedCategory,
        toggleRecipeSelection,
    } = form;

    return (
        <>
            <FormField
                id={`${idPrefix}-title`}
                label={t(`${keyPrefix}.titleLabel`)}
                value={menuTitle}
                onChange={setMenuTitle}
                error={errors.menuTitleError}
            />

            <FormTextArea
                id={`${idPrefix}-description`}
                label={t(`${keyPrefix}.descriptionLabel`)}
                value={menuDescription}
                onChange={setMenuDescription}
                error={errors.menuDescriptionError}
            />

            <FormSelect
                id={`${idPrefix}-category`}
                label={t(`${keyPrefix}.categoryLabel`)}
                value={selectedCategory ?? ""}
                onChange={(value) => {
                    setSelectedCategory(Number(value));
                }}
                placeholder={t(`${keyPrefix}.categoryPlaceholder`)}
                options={categories.map((category) => ({
                    value: category.menu_category_id,
                    label: category.category_name,
                }))}
                error={errors.categoryError}
            />

            <MenuRecipeToggleList
                allRecipes={allRecipes}
                selectedRecipes={selectedRecipes}
                onToggle={toggleRecipeSelection}
                label={t(`${keyPrefix}.recipesLabel`)}
                errorMessage={errors.recipesError}
            />
        </>
    );
};
