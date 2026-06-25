import type { RecipeTypeSummary } from "types/recipeType";

import { API_ROUTES } from "api/endpoints";

import { recipeTypesApi } from "redux/services/recipeTypesApi";

import { mockedGet } from "test/apiClientMock";
import { makeTestStore } from "test/store";

jest.mock("api/client");

const SAMPLE_TYPES: RecipeTypeSummary[] = [
    { id: 1, type_name: "Soup", description: "warm" },
    { id: 2, type_name: "Salad", description: "cold" },
];

describe("recipeTypesApi", () => {
    it("should fetch the full recipe types list", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_TYPES });
        const store = makeTestStore();

        const result = await store.dispatch(
            recipeTypesApi.endpoints.getRecipeTypes.initiate(null),
        );

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipeTypes.list, {
            params: null,
        });
        expect(result.data).toEqual(SAMPLE_TYPES);
    });

    it("should pass the ids query params when filtering by selected types", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_TYPES });
        const store = makeTestStore();

        await store.dispatch(
            recipeTypesApi.endpoints.getRecipeTypes.initiate({ ids: "1,2" }),
        );

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipeTypes.list, {
            params: { ids: "1,2" },
        });
    });
});
