import type { RecipeTypeSummary } from "types/recipeType";

import { API_ROUTES } from "api/endpoints";
import { getRecipeTypes } from "api/recipeTypesApi";

import { mockedGet } from "test/apiClientMock";

jest.mock("../client");

const QUERY = { ids: "1,2" };
const SAMPLE_TYPES: RecipeTypeSummary[] = [
    { id: 1, type_name: "Soup", description: "warm" },
];

describe("recipeTypesApi", () => {
    it("should get the recipe types with the query params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_TYPES });

        const result = await getRecipeTypes(QUERY);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipeTypes.list, {
            params: QUERY,
        });
        expect(result).toEqual(SAMPLE_TYPES);
    });
});
