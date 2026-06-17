import { API_ROUTES } from "../endpoints";
import { getIngredients } from "../ingredientsApi";
import type { Ingredient } from "../../types/ingredient";
import { mockedGet } from "../../test/apiClientMock";

jest.mock("../client");

const SAMPLE_INGREDIENTS: Ingredient[] = [
    { id: 1, name: "Potato", unit_name: "g" },
];

describe("ingredientsApi", () => {
    it("should get the ingredients list and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_INGREDIENTS });

        const result = await getIngredients();

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.ingredients.list);
        expect(result).toEqual(SAMPLE_INGREDIENTS);
    });
});
