import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { SEARCH_PARAM_INGREDIENT_NAME } from "constants/queryParams";

import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectMenuFilters } from "redux/selectors/filtersSelectors";
import { useGetMenuCategoriesQuery } from "redux/services/menuCategoriesApi";
import {
    useGetMenusByPersonQuery,
    useGetMenusQuery,
} from "redux/services/menusApi";
import { setMenuSelectedCategories } from "redux/slices/filtersSlice";

import { buildMenuFilterParams } from "utils/menuFilterParams";
import { getQueryErrorMessage } from "utils/queryError";

export const MENU_SOURCE = {
    all: "all",
    person: "person",
} as const;

export type MenuSource = (typeof MENU_SOURCE)[keyof typeof MENU_SOURCE];

// view model for the two menu lists: the category filter comes from the store,
// the name search from the URL, the menus from RTK Query
export const useMenuListView = (source: MenuSource) => {
    const dispatch = useAppDispatch();
    const { selectedCategories } = useAppSelector(selectMenuFilters);
    const [searchParams] = useSearchParams();
    // known quirk: the menu name search reuses the ingredient_name URL key
    const menuName = searchParams.get(SEARCH_PARAM_INGREDIENT_NAME);

    const params = useMemo(
        () => buildMenuFilterParams(selectedCategories, menuName),
        [selectedCategories, menuName],
    );

    const isPerson = source === MENU_SOURCE.person;
    const all = useGetMenusQuery(params, { skip: isPerson });
    const byPerson = useGetMenusByPersonQuery(params, { skip: !isPerson });
    const active = isPerson ? byPerson : all;

    const { data: categories = [] } = useGetMenuCategoriesQuery(null);
    const menus = active.data ?? [];

    const selectedCategoryNames = categories
        .filter((category) =>
            selectedCategories.includes(category.menu_category_id),
        )
        .map((category) => category.category_name)
        .join(", ");

    return {
        selectedCategories,
        setSelectedCategories: (next: number[]) =>
            dispatch(setMenuSelectedCategories(next)),
        categories,
        menus,
        noMenus: active.isSuccess && menus.length === 0,
        error: active.isError ? getQueryErrorMessage(active.error) : null,
        selectedCategoryNames,
    };
};
