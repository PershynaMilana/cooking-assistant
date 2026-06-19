import { useCallback, useEffect, useState } from "react";

import type { Menu, MenuListParams } from "types/menu";

import { getApiErrorMessage } from "api/httpError";

import { useMenuCategories } from "hooks/useMenuCategories";
import { useMenuFilters } from "hooks/useMenuFilters";

export type MenuFetcher = (params: MenuListParams) => Promise<Menu[]>;

export const useMenuList = (fetcher: MenuFetcher) => {
    const { selectedCategories, setSelectedCategories, buildFilterParams } =
        useMenuFilters();
    const { categories } = useMenuCategories();

    const [menus, setMenus] = useState<Menu[]>([]);
    const [noMenus, setNoMenus] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMenus = useCallback(async () => {
        setError(null);
        setNoMenus(false);

        try {
            const data = await fetcher(buildFilterParams());

            setMenus(data);
            setNoMenus(data.length === 0);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }, [fetcher, buildFilterParams]);

    useEffect(() => {
        void fetchMenus();
    }, [fetchMenus]);

    const selectedCategoryNames = categories
        .filter((c) => selectedCategories.includes(c.menu_category_id))
        .map((c) => c.category_name)
        .join(", ");

    return {
        selectedCategories,
        setSelectedCategories,
        categories,
        menus,
        noMenus,
        error,
        selectedCategoryNames,
    };
};
