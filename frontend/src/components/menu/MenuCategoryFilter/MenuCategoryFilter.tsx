import React from "react";
import { useTranslation } from "react-i18next";

import type { MenuCategory } from "types/menu";

import { CheckboxFilterDropdown } from "components/ui/CheckboxFilterDropdown";

interface MenuCategoryFilterProps {
    categories: MenuCategory[];
    selectedCategories: number[];
    onChange: (categories: number[]) => void;
}

export const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
    categories,
    selectedCategories,
    onChange,
}) => {
    const { t } = useTranslation("menu");

    return (
        <CheckboxFilterDropdown
            items={categories}
            selected={selectedCategories}
            onChange={onChange}
            getKey={(category) => category.menu_category_id}
            getLabel={(category) => category.category_name}
            buttonLabel={t("categoryFilter.filter")}
            resetLabel={t("categoryFilter.reset")}
        />
    );
};
