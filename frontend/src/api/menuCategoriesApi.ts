import type { MenuCategory } from "types/menu";

import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";

export async function getMenuCategories(): Promise<MenuCategory[]> {
    const response = await apiClient.get<MenuCategory[]>(
        API_ROUTES.menuCategories.list,
    );

    return response.data;
}
