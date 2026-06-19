import React from "react";
import { useTranslation } from "react-i18next";

import type { RecipeTypeSummary } from "types/recipeType";

import { CheckboxFilterDropdown } from "components/ui/CheckboxFilterDropdown";

interface RecipeTypeFilterProps {
    selectedTypes: number[];
    onChange: (selectedTypes: number[]) => void;
    types: RecipeTypeSummary[];
}

export const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
    selectedTypes,
    onChange,
    types,
}) => {
    const { t } = useTranslation("recipes");

    return (
        <CheckboxFilterDropdown
            items={types}
            selected={selectedTypes}
            onChange={onChange}
            getKey={(type) => type.id}
            getLabel={(type) => type.type_name}
            buttonLabel={t("typeFilter.filter")}
            resetLabel={t("typeFilter.reset")}
        />
    );
};
