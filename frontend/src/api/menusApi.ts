import type {
    CreateMenuRequest,
    Menu,
    MenuDetails,
    MenuListParams,
    UpdateMenuRequest,
} from "types/menu";

import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";

export async function getMenus(params: MenuListParams): Promise<Menu[]> {
    const response = await apiClient.get<Menu[]>(API_ROUTES.menu.list, {
        params,
    });

    return response.data;
}

export async function getMenuById(id: string | number): Promise<MenuDetails> {
    const response = await apiClient.get<MenuDetails>(API_ROUTES.menu.byId(id));

    return response.data;
}

export async function createMenu(data: CreateMenuRequest): Promise<void> {
    await apiClient.post(API_ROUTES.menu.create, data);
}

export async function updateMenu(
    id: string | number,
    data: UpdateMenuRequest,
): Promise<void> {
    await apiClient.put(API_ROUTES.menu.byId(id), data);
}

export async function deleteMenu(id: string | number): Promise<void> {
    await apiClient.delete(API_ROUTES.menu.byId(id));
}

export async function getMenusByPerson(
    userId: number,
    params: MenuListParams,
): Promise<Menu[]> {
    const response = await apiClient.get<Menu[]>(
        API_ROUTES.menu.byPerson(userId),
        { params },
    );

    return response.data;
}
