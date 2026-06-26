import type { MenuListParams } from "types/menu";

// merges the stored category filter with the URL-sourced name search into the
// query params the menu endpoints expect
export const buildMenuFilterParams = (
    selectedCategories: number[],
    menuName: string | null,
): MenuListParams => ({
    menu_name: menuName ?? "",
    category_ids:
        selectedCategories.length > 0
            ? selectedCategories.join(",")
            : undefined,
});
