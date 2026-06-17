import { API_ROUTES } from "../endpoints";
import {
    getUserIngredients,
    saveUserIngredient,
    updateQuantities,
    deleteUserIngredient,
    getPurchaseHistory,
    updatePurchase,
} from "../userIngredientsApi";
import type {
    UserIngredient,
    Purchase,
    SaveUserIngredientsRequest,
    UpdateQuantitiesRequest,
    UpdatePurchaseRequest,
} from "../../types/userIngredient";
import { mockedGet, mockedPut, mockedDelete } from "../../test/apiClientMock";

jest.mock("../client");

const USER_ID = 3;
const INGREDIENT_ID = 5;
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
    it("should get the user ingredients with the user id params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_USER_INGREDIENTS });

        const result = await getUserIngredients(USER_ID);

        expect(mockedGet).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.byPerson(USER_ID),
            { params: { userId: USER_ID } },
        );
        expect(result).toEqual(SAMPLE_USER_INGREDIENTS);
    });

    it("should put saved user ingredients to the by-person endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await saveUserIngredient(USER_ID, SAVE_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.byPerson(USER_ID),
            SAVE_BODY,
            { params: { userId: USER_ID } },
        );
    });

    it("should put updated quantities to the update-quantities endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updateQuantities(USER_ID, QUANTITIES_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.updateQuantities(USER_ID),
            QUANTITIES_BODY,
        );
    });

    it("should delete a user ingredient by user and ingredient id", async () => {
        mockedDelete.mockResolvedValue({ data: undefined });

        await deleteUserIngredient(USER_ID, INGREDIENT_ID);

        expect(mockedDelete).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.item(USER_ID, INGREDIENT_ID),
        );
    });

    it("should get the purchase history and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_PURCHASES });

        const result = await getPurchaseHistory(USER_ID, INGREDIENT_ID);

        expect(mockedGet).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.history(USER_ID, INGREDIENT_ID),
        );
        expect(result).toEqual(SAMPLE_PURCHASES);
    });

    it("should put an updated purchase to the history endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updatePurchase(USER_ID, INGREDIENT_ID, PURCHASE_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.userIngredients.history(USER_ID, INGREDIENT_ID),
            PURCHASE_BODY,
        );
    });
});
