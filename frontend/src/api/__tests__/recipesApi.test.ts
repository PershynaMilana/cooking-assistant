import type {
    CreateRecipeRequest,
    RecipeDetails,
    RecipeFilterParams,
    RecipeListItem,
    RecipeWithIngredientNames,
    UpdateRecipeRequest,
} from "types/recipe";

import { API_ROUTES } from "api/endpoints";
import {
    createRecipe,
    deleteRecipe,
    getRecipeById,
    getRecipes,
    getRecipesByFilters,
    getRecipesByPerson,
    updateRecipe,
} from "api/recipesApi";

import {
    mockedDelete,
    mockedGet,
    mockedPost,
    mockedPut,
} from "test/apiClientMock";

jest.mock("../client");

const ID = "7";
const PERSON_ID = 3;
const CREATION_DATE = "2024-01-01";
const FILTERS: RecipeFilterParams = {
    ingredient_name: "egg",
    sort_order: "asc",
};
const SAMPLE_LIST: RecipeListItem[] = [
    {
        id: 1,
        title: "Borscht",
        type_name: "Soup",
        creation_date: CREATION_DATE,
        cooking_time: 60,
    },
];
const SAMPLE_WITH_INGREDIENTS: RecipeWithIngredientNames[] = [
    {
        id: 1,
        title: "Borscht",
        type_name: "Soup",
        creation_date: CREATION_DATE,
        cooking_time: 60,
        ingredients: ["beet"],
    },
];
const SAMPLE_DETAILS: RecipeDetails = {
    id: 1,
    title: "Borscht",
    content: "boil",
    ingredients: [],
    type_id: 2,
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
    servings: 4,
    person_id: PERSON_ID,
    isOwner: true,
};
const CREATE_BODY: CreateRecipeRequest = {
    title: "Borscht",
    content: "boil",
    ingredients: [{ id: 1, quantity: 2 }],
    type_id: 2,
    cooking_time: 60,
    servings: 4,
};
const UPDATE_BODY: UpdateRecipeRequest = {
    title: "Borscht",
    content: "boil",
    type_id: 2,
    cooking_time: 60,
    servings: 4,
    ingredients: [{ id: 1, quantity_recipe_ingredients: 2 }],
};

describe("recipesApi", () => {
    it("should get recipes by filters with the query params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_LIST });

        const result = await getRecipesByFilters(FILTERS);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipes.byFilters, {
            params: FILTERS,
        });
        expect(result).toEqual(SAMPLE_LIST);
    });

    it("should get recipes by person with the query params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_LIST });

        const result = await getRecipesByPerson(FILTERS);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipes.byPerson, {
            params: FILTERS,
        });
        expect(result).toEqual(SAMPLE_LIST);
    });

    it("should get a recipe by id and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_DETAILS });

        const result = await getRecipeById(ID);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipes.byId(ID));
        expect(result).toEqual(SAMPLE_DETAILS);
    });

    it("should get the full recipes list and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_WITH_INGREDIENTS });

        const result = await getRecipes();

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.recipes.list);
        expect(result).toEqual(SAMPLE_WITH_INGREDIENTS);
    });

    it("should post a new recipe to the create endpoint", async () => {
        mockedPost.mockResolvedValue({ data: undefined });

        await createRecipe(CREATE_BODY);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.recipes.create,
            CREATE_BODY,
        );
    });

    it("should put an updated recipe to the by-id endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updateRecipe(ID, UPDATE_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.recipes.byId(ID),
            UPDATE_BODY,
        );
    });

    it("should delete a recipe by id", async () => {
        mockedDelete.mockResolvedValue({ data: undefined });

        await deleteRecipe(ID);

        expect(mockedDelete).toHaveBeenCalledWith(API_ROUTES.recipes.byId(ID));
    });
});
