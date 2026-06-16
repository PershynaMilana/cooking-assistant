import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";
import type {
    UserIngredient,
    Purchase,
    SaveUserIngredientsRequest,
    UpdateQuantitiesRequest,
    UpdatePurchaseRequest,
} from "../types/userIngredient";

export async function getUserIngredients(
    userId: number,
): Promise<UserIngredient[]> {
    const response = await apiClient.get<UserIngredient[]>(
        API_ROUTES.userIngredients.byPerson(userId),
        { params: { userId } },
    );
    return response.data;
}

export async function saveUserIngredient(
    userId: number,
    body: SaveUserIngredientsRequest,
): Promise<void> {
    await apiClient.put(API_ROUTES.userIngredients.byPerson(userId), body, {
        params: { userId },
    });
}

export async function updateQuantities(
    userId: number,
    body: UpdateQuantitiesRequest,
): Promise<void> {
    await apiClient.put(
        API_ROUTES.userIngredients.updateQuantities(userId),
        body,
    );
}

export async function deleteUserIngredient(
    userId: number,
    ingredientId: number,
): Promise<void> {
    await apiClient.delete(
        API_ROUTES.userIngredients.item(userId, ingredientId),
    );
}

export async function getPurchaseHistory(
    userId: number,
    ingredientId: number,
): Promise<Purchase[]> {
    const response = await apiClient.get<Purchase[]>(
        API_ROUTES.userIngredients.history(userId, ingredientId),
    );
    return response.data;
}

export async function updatePurchase(
    userId: number,
    ingredientId: number,
    body: UpdatePurchaseRequest,
): Promise<void> {
    await apiClient.put(
        API_ROUTES.userIngredients.history(userId, ingredientId),
        body,
    );
}
