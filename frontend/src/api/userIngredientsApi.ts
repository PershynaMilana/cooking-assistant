import type {
    Purchase,
    SaveUserIngredientsRequest,
    UpdatePurchaseRequest,
    UpdateQuantitiesRequest,
    UserIngredient,
} from "types/userIngredient";

import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";

export async function getUserIngredients(): Promise<UserIngredient[]> {
    const response = await apiClient.get<UserIngredient[]>(
        API_ROUTES.userIngredients.list,
    );

    return response.data;
}

export async function saveUserIngredient(
    body: SaveUserIngredientsRequest,
): Promise<void> {
    await apiClient.put(API_ROUTES.userIngredients.list, body);
}

export async function updateQuantities(
    body: UpdateQuantitiesRequest,
): Promise<void> {
    await apiClient.put(API_ROUTES.userIngredients.updateQuantities, body);
}

export async function deleteUserIngredient(
    ingredientId: number,
): Promise<void> {
    await apiClient.delete(API_ROUTES.userIngredients.item(ingredientId));
}

export async function getPurchaseHistory(
    ingredientId: number,
): Promise<Purchase[]> {
    const response = await apiClient.get<Purchase[]>(
        API_ROUTES.userIngredients.history(ingredientId),
    );

    return response.data;
}

export async function updatePurchase(
    purchaseId: number,
    body: UpdatePurchaseRequest,
): Promise<void> {
    await apiClient.put(API_ROUTES.userIngredients.history(purchaseId), body);
}
