import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { SEARCH_PARAM_INGREDIENT_NAME } from "constants/queryParams";
import type { MenuListParams } from "types/menu";

export const useMenuFilters = () => {
    const [searchParams] = useSearchParams();
    // known bug: URL param is still the ingredient_name key instead of menu_name — R18/1.41
    const menuName = searchParams.get(SEARCH_PARAM_INGREDIENT_NAME);

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const buildFilterParams = useCallback((): MenuListParams => {
        return {
            menu_name: menuName ?? "",
            category_ids:
                selectedCategories.length > 0
                    ? selectedCategories.join(",")
                    : undefined,
        };
    }, [menuName, selectedCategories]);

    return {
        menuName,
        selectedCategories,
        setSelectedCategories,
        buildFilterParams,
    };
};
