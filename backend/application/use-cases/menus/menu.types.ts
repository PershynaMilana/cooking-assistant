import type { MenuInput, MenuUpdateInput } from "../../../domain/entities/Menu";

export type CreateMenuInput = MenuInput & { recipeIds: number[] };
export type UpdateMenuInput = MenuUpdateInput & { recipeIds: number[] };

export interface MenuFilters {
    menu_name?: string;
    category_ids?: string;
    [key: string]: unknown;
}
