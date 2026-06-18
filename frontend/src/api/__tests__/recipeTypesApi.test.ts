import type { RecipeTypeFormData, RecipeTypeSummary } from "types/recipeType";

import { API_ROUTES } from "api/endpoints";
import {
    createRecipeType,
    deleteRecipeType,
    getRecipeTypeById,
    getRecipeTypes,
    updateRecipeType,
} from "api/recipeTypesApi";

import {
    mockedDelete,
    mockedGet,
    mockedPost,
    mockedPut,
} from "test/apiClientMock";

jest.mock("../client");

const ID = "7";
const QUERY = { ids: "1,2" };
const SAMPLE_TYPES: RecipeTypeSummary[] = [
    { id: 1, type_name: "Soup", description: "warm" },
];
const SAMPLE_FORM: RecipeTypeFormData = {
    type_name: "Soup",
    description: "warm",
};

describe("recipeTypesApi", () => {
    it("should get the recipe types with the query params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_TYPES });

        const result = await getRecipeTypes(QUERY);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipeTypes.list, {
            params: QUERY,
        });
        expect(result).toEqual(SAMPLE_TYPES);
    });

    it("should get a recipe type by id and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_FORM });

        const result = await getRecipeTypeById(ID);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipeTypes.byId(ID));
        expect(result).toEqual(SAMPLE_FORM);
    });

    it("should post a new recipe type to the list endpoint", async () => {
        mockedPost.mockResolvedValue({ data: undefined });

        await createRecipeType(SAMPLE_FORM);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.recipeTypes.list,
            SAMPLE_FORM,
        );
    });

    it("should put an updated recipe type to the by-id endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updateRecipeType(ID, SAMPLE_FORM);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.recipeTypes.byId(ID),
            SAMPLE_FORM,
        );
    });

    it("should delete a recipe type by id", async () => {
        mockedDelete.mockResolvedValue({ data: undefined });

        await deleteRecipeType(1);

        expect(mockedDelete).toHaveBeenCalledWith(
            API_ROUTES.recipeTypes.byId(1),
        );
    });
});
