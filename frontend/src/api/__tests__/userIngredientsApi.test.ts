import type {
    Purchase,
    SaveUserIngredientsRequest,
    UpdatePurchaseRequest,
    UpdateQuantitiesRequest,
    UserIngredient,
} from "types/userIngredient";

import { API_ROUTES } from "api/endpoints";
import {
    deleteUserIngredient,
    getPurchaseHistory,
    getUserIngredients,
    saveUserIngredient,
    updatePurchase,
    updateQuantities,
} from "api/userIngredientsApi";

import { mockedDelete, mockedGet, mockedPut } from "test/apiClientMock";

jest.mock("../client");

const INGREDIENT_ID = 5;
const PURCHASE_ID = 11;
const SAMPLE_USER_INGREDIENTS: UserIngredient[] = [
    {
        ingredient_id: 5,
        ingredient_name: "Potato",
        unit_name: "g",
        quantity_person_ingradient: 100,
    },
];
const SAMPLE_PURCHASES: Purchase[] = [
    {
        id: 1,
        quantity: 100,
        purchase_date: "2024-01-01",
        unit_name: "g",
        days_to_expire: 10,
    },
];
const SAVE_BODY: SaveUserIngredientsRequest = {
    ingredients: [
        { id: 5, ingredient_name: "Potato", quantity_person_ingradient: 100 },
    ],
};
const QUANTITIES_BODY: UpdateQuantitiesRequest = {
    updatedIngredients: [
        { id: 5, unit_name: "g", quantity_person_ingradient: 200 },
    ],
};
const PURCHASE_BODY: UpdatePurchaseRequest = { quantity: 50 };

describe("userIngredientsApi", () => {
    it("should get the user ingredients and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_USER_INGREDIENTS });

        const result = await getUserIngredients();

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.userIngredients.list);
        expect(result).toEqual(SAMPLE_USER_INGREDIENTS);
    });

    it("should put saved user ingredients to the list endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await saveUserIngredient(SAVE_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.list,
            SAVE_BODY,
        );
    });

    it("should put updated quantities to the update-quantities endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updateQuantities(QUANTITIES_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.updateQuantities,
            QUANTITIES_BODY,
        );
    });

    it("should delete a user ingredient by ingredient id", async () => {
        mockedDelete.mockResolvedValue({ data: undefined });

        await deleteUserIngredient(INGREDIENT_ID);

        expect(mockedDelete).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.item(INGREDIENT_ID),
        );
    });

    it("should get the purchase history and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_PURCHASES });

        const result = await getPurchaseHistory(INGREDIENT_ID);

        expect(mockedGet).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.history(INGREDIENT_ID),
        );
        expect(result).toEqual(SAMPLE_PURCHASES);
    });

    it("should put an updated purchase to the history endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updatePurchase(PURCHASE_ID, PURCHASE_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.history(PURCHASE_ID),
            PURCHASE_BODY,
        );
    });
});
